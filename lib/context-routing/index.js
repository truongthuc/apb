const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const SOURCE_INDEX_VERSION = 3;

const SOURCE_EXTENSIONS = new Set([
  ".c", ".cc", ".cpp", ".cs", ".css", ".go", ".graphql", ".h", ".hpp",
  ".html", ".java", ".js", ".jsx", ".json", ".kt", ".kts", ".php",
  ".py", ".rb", ".rs", ".scss", ".sql", ".svelte", ".swift", ".toml",
  ".ts", ".tsx", ".vue", ".xml", ".yaml", ".yml",
]);

const IGNORED_DIRECTORIES = new Set([
  ".git", ".idea", ".next", ".turbo", ".vscode", "build", "coverage", "dist",
  "node_modules", "target", "vendor",
]);

function findProjectRoot(startDirectory = process.cwd()) {
  let current = path.resolve(startDirectory);
  while (true) {
    if (fs.existsSync(path.join(current, ".agent"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return path.resolve(startDirectory);
    current = parent;
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return {};

  const lines = match[1]
    .split(/\r?\n/)
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => ({
      indent: line.match(/^\s*/)[0].length,
      text: line.trim(),
    }));

  if (lines.length === 0) return {};
  return parseYamlBlock(lines, 0, lines[0].indent).value;
}

function parseYamlBlock(lines, startIndex, indent) {
  const isArray = lines[startIndex].text.startsWith("- ");
  const value = isArray ? [] : {};
  let index = startIndex;

  while (index < lines.length && lines[index].indent === indent) {
    const line = lines[index].text;

    if (isArray) {
      if (!line.startsWith("- ")) break;
      value.push(parseScalar(line.slice(2).trim()));
      index += 1;
      continue;
    }

    const separator = line.indexOf(":");
    if (separator === -1) {
      index += 1;
      continue;
    }

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    if (rawValue) {
      value[key] = parseScalar(rawValue);
      index += 1;
      continue;
    }

    const next = lines[index + 1];
    if (next && next.indent > indent) {
      const parsed = parseYamlBlock(lines, index + 1, next.indent);
      value[key] = parsed.value;
      index = parsed.index;
    } else {
      value[key] = {};
      index += 1;
    }
  }

  return { value, index };
}

function parseScalar(value) {
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (value === "[]") return [];
  return value;
}

function loadFeatureCapsules(projectRoot) {
  const featureDirectory = path.join(projectRoot, ".agent", "features");
  if (!fs.existsSync(featureDirectory)) return [];

  return walkFiles(featureDirectory, (file) => path.extname(file) === ".md")
    .map((file) => {
      const content = fs.readFileSync(file, "utf8");
      const metadata = parseFrontmatter(content);
      return {
        ...metadata,
        file: relativePath(projectRoot, file),
        triggers: asArray(metadata.triggers),
        knowledge: asArray(metadata.knowledge),
        references: asArray(metadata.references),
        depends_on: asArray(metadata.depends_on),
        source: {
          entrypoints: asArray(metadata.source && metadata.source.entrypoints),
          symbols: asArray(metadata.source && metadata.source.symbols),
          paths: asArray(metadata.source && metadata.source.paths),
          tests: asArray(metadata.source && metadata.source.tests),
        },
      };
    })
    .filter((feature) => feature.id
      && feature.type === "feature"
      && feature.status !== "archived"
      && feature.status !== "template");
}

function buildKnowledgeIndex(projectRoot) {
  const agentDirectory = path.join(projectRoot, ".agent");
  const index = new Map();
  if (!fs.existsSync(agentDirectory)) return index;

  for (const file of walkFiles(agentDirectory, (candidate) => path.extname(candidate) === ".md")) {
    const metadata = parseFrontmatter(fs.readFileSync(file, "utf8"));
    if (metadata.id) index.set(metadata.id, relativePath(projectRoot, file));
  }
  return index;
}

function buildSourceIndex(projectRoot, options = {}) {
  const runtimeDirectory = getRuntimeDirectory(projectRoot);
  const cacheFile = path.join(runtimeDirectory, "source-index.json");
  const previous = readJson(cacheFile, { files: {} });
  const files = walkFiles(projectRoot, (file) => isSourceFile(file, projectRoot));
  const next = {};
  let reused = 0;
  let indexed = 0;

  for (const file of files) {
    const relative = relativePath(projectRoot, file);
    const stat = fs.statSync(file);
    if (!options.force && previous.version === SOURCE_INDEX_VERSION
      && previous.files && previous.files[relative]
      && previous.files[relative].size === stat.size
      && previous.files[relative].mtimeMs === stat.mtimeMs) {
      next[relative] = previous.files[relative];
      reused += 1;
      continue;
    }

    const content = fs.readFileSync(file);
    const hash = hashContent(content);
    const text = content.length <= 1024 * 1024 ? content.toString("utf8") : "";
    const symbolLocations = extractSymbolLocations(text);
    next[relative] = {
      hash,
      size: stat.size,
      mtimeMs: stat.mtimeMs,
      symbols: symbolLocations.map((location) => location.name),
      symbolLocations,
      imports: extractImports(text),
    };
    indexed += 1;
  }

  const result = {
    version: SOURCE_INDEX_VERSION,
    gitRevision: getGitRevision(projectRoot),
    generatedAt: new Date().toISOString(),
    files: next,
  };
  fs.mkdirSync(runtimeDirectory, { recursive: true });
  fs.writeFileSync(cacheFile, `${JSON.stringify(result, null, 2)}\n`);

  return { index: result, stats: { total: files.length, indexed, reused } };
}

function resolveContext(projectRoot, task, options = {}) {
  const features = loadFeatureCapsules(projectRoot);
  const runtimeDirectory = getRuntimeDirectory(projectRoot);
  const previousActive = readJson(path.join(runtimeDirectory, "active-context.json"), null);
  const workingTree = getWorkingTreeChanges(projectRoot);
  const rankedFeatures = rankFeatures(features, task, {
    changedFiles: [...workingTree.changed, ...workingTree.added, ...workingTree.deleted],
    activeFeature: previousActive && previousActive.feature && previousActive.feature.id,
  });
  const selected = selectFeature(features, rankedFeatures, options.feature);
  const sourceResult = buildSourceIndex(projectRoot, { force: options.refresh });

  if (!selected) {
    return {
      status: "unresolved",
      task,
      message: features.length === 0
        ? "No feature capsules were found under .agent/features/."
        : "No feature matched the task with enough evidence.",
      featureCandidates: rankedFeatures.slice(0, 3),
      sourceIndex: sourceResult.stats,
    };
  }

  const knowledgeIndex = buildKnowledgeIndex(projectRoot);
  const required = [];
  const conditional = [];
  const reference = [];
  const warnings = [];
  const confidence = featureConfidence(rankedFeatures, selected.id, options.feature);
  const featureStateFile = getFeatureStateFile(projectRoot, selected.id);
  const taskStateFile = getTaskStateFile(projectRoot, selected.id, task);
  const previousFeature = readJson(featureStateFile, null);
  const previousTask = readJson(taskStateFile, null);
  if (confidence < 0.65) {
    warnings.push(`Feature selection is ambiguous (${confidence}); confirm ${selected.id} before changing behavior or scope.`);
  }

  addRoute(required, selected.file, "knowledge", "Selected feature capsule", "summary");
  for (const binding of selected.knowledge) {
    const resolved = resolveKnowledgeBinding(projectRoot, binding, knowledgeIndex);
    if (resolved) {
      addRoute(required, resolved, "knowledge", `Knowledge binding from ${selected.id}`, "targeted");
      const anchor = knowledgeBindingAnchor(binding);
      if (anchor) required[required.length - 1].anchor = anchor;
    } else {
      warnings.push(`Unresolved knowledge binding: ${binding}`);
    }
  }
  for (const binding of selected.references) {
    const resolved = resolveKnowledgeBinding(projectRoot, binding, knowledgeIndex);
    if (resolved) {
      addRoute(reference, resolved, "knowledge", `Reference binding from ${selected.id}`, "metadata");
      const anchor = knowledgeBindingAnchor(binding);
      if (anchor) reference[reference.length - 1].anchor = anchor;
    } else {
      warnings.push(`Unresolved reference binding: ${binding}`);
    }
  }

  const requiredKnowledgePaths = required
    .filter((item) => item.kind === "knowledge")
    .map((item) => item.path);
  for (const linked of discoverLinkedKnowledge(projectRoot, requiredKnowledgePaths, knowledgeIndex)) {
    if (required.some((item) => item.path === linked.path)) continue;
    addRoute(reference, linked.path, "knowledge", linked.reason, "metadata", null, linked.relevance);
  }

  const entrypoints = expandBindings(projectRoot, selected.source.entrypoints, sourceResult.index.files);
  for (const entrypoint of entrypoints) {
    addRoute(required, entrypoint, "source", `Entrypoint of ${selected.id}`, "targeted", sourceResult.index.files[entrypoint]);
  }
  if (selected.source.entrypoints.length === 0) warnings.push(`Feature ${selected.id} has no source entrypoints.`);
  for (const binding of selected.source.entrypoints) {
    if (expandBindings(projectRoot, [binding], sourceResult.index.files).length === 0) {
      warnings.push(`Entrypoint binding matched no source file: ${binding}`);
    }
  }
  for (const binding of selected.source.symbols) {
    const matches = resolveSymbolBinding(binding, sourceResult.index.files);
    if (matches.length === 0) {
      warnings.push(`Symbol binding matched no indexed symbol: ${binding}`);
      continue;
    }
    for (const match of matches) {
      let route = required.find((item) => item.path === match.path && item.kind === "source");
      if (!route) {
        addRoute(required, match.path, "source", `Symbol binding from ${selected.id}`, "targeted", sourceResult.index.files[match.path]);
        route = required[required.length - 1];
      }
      route.targetSymbols = [...(route.targetSymbols || []), { name: match.name, line: match.line }];
    }
  }

  const boundaryFiles = expandBindings(projectRoot, selected.source.paths, sourceResult.index.files);
  const taskTokens = tokenize(task);
  for (const file of boundaryFiles) {
    if (required.some((item) => item.path === file)) continue;
    const record = sourceResult.index.files[file];
    const relevance = scoreSourceRecord(file, record, taskTokens);
    addRoute(reference, file, "source", `Bound source of ${selected.id}`, "metadata", record, relevance);
  }
  reference.sort((left, right) => right.relevance - left.relevance || left.path.localeCompare(right.path));

  const testFiles = expandBindings(projectRoot, selected.source.tests, sourceResult.index.files);
  for (const file of testFiles) {
    addRoute(conditional, file, "test", `Validation binding from ${selected.id}`, "metadata", sourceResult.index.files[file]);
  }

  const dependencyClosure = resolveDependencyClosure(projectRoot, entrypoints, sourceResult.index.files);
  for (const dependency of dependencyClosure.forward) {
    const file = dependency.path;
    if (required.some((item) => item.path === file)) continue;
    const referenceIndex = reference.findIndex((item) => item.path === file);
    if (referenceIndex !== -1) reference.splice(referenceIndex, 1);
    const target = dependency.depth === 1 ? conditional : reference;
    addRoute(
      target,
      file,
      "source",
      `Local dependency at depth ${dependency.depth} from ${dependency.via}`,
      "metadata",
      sourceResult.index.files[file],
    );
  }
  for (const caller of dependencyClosure.reverse) {
    if (required.some((item) => item.path === caller.path)
      || conditional.some((item) => item.path === caller.path)
      || reference.some((item) => item.path === caller.path)) continue;
    addRoute(
      caller.depth === 1 ? conditional : reference,
      caller.path,
      "source",
      `Local caller at depth ${caller.depth} of ${caller.imports}`,
      "metadata",
      sourceResult.index.files[caller.path],
    );
  }

  const affectedFeatures = resolveAffectedFeatures(features, selected, sourceResult.index.files);
  for (const affected of affectedFeatures) {
    if (!reference.some((item) => item.path === affected.file)) {
      addRoute(reference, affected.file, "knowledge", affected.reason, "metadata");
    }
  }
  restoreTaskExpansions(projectRoot, previousTask, { required, conditional, reference }, sourceResult.index.files);
  reference.sort((left, right) => (right.relevance || 0) - (left.relevance || 0) || left.path.localeCompare(right.path));

  const allRoutes = deduplicateRoutes([...required, ...conditional, ...reference]);
  const currentHashes = Object.fromEntries(allRoutes
    .filter((item) => item.kind !== "knowledge" || fs.existsSync(path.join(projectRoot, item.path)))
    .map((item) => [item.path, hashFile(path.join(projectRoot, item.path))]));
  const delta = calculateDelta(previousFeature ? previousFeature.fileHashes : {}, currentHashes);
  const taskDelta = calculateDelta(previousTask ? previousTask.fileHashes : {}, currentHashes);
  const proposals = deduplicateProposals([
    ...buildMaintenanceProposals(
    selected,
    sourceResult.index.files,
    dependencyClosure,
    workingTree,
    previousFeature,
    ),
    ...buildExpansionMaintenanceProposals(selected, previousTask),
  ]);
  const contextFingerprint = hashContent(JSON.stringify(currentHashes));

  const manifest = {
    version: 1,
    status: warnings.length === 0 ? "ready" : "ready-with-warnings",
    task,
    feature: {
      id: selected.id,
      file: selected.file,
      revision: selected.revision || 1,
      confidence,
    },
    gitRevision: getGitRevision(projectRoot),
    generatedAt: new Date().toISOString(),
    manifestPath: relativePath(projectRoot, taskStateFile),
    featureStatePath: relativePath(projectRoot, featureStateFile),
    sourceIndex: sourceResult.stats,
    context: {
      required: deduplicateRoutes(required),
      conditional: deduplicateRoutes(conditional),
      reference: deduplicateRoutes(reference),
    },
    delta,
    taskDelta,
    affectedFeatures,
    coverage: {
      explicitKnowledgeBindings: selected.knowledge.length,
      resolvedKnowledgeBindings: required.filter((item) => item.kind === "knowledge").length - 1,
      linkedKnowledgeDiscovered: reference.filter((item) => item.kind === "knowledge").length,
      boundSourceFiles: boundaryFiles.length,
      forwardDependencies: dependencyClosure.forward.length,
      reverseCallers: dependencyClosure.reverse.length,
      staticClosure: "complete-for-resolved-local-imports",
      runtimeClosure: "unverified",
      knownLimitations: [
        "reflection",
        "generated-code",
        "dependency-injection",
        "runtime-events",
        "external-services",
        "unrecorded-business-rules",
      ],
    },
    maintenance: {
      proposals,
      requiresReview: proposals.some((proposal) => !proposal.safe),
    },
    expansions: previousTask && Array.isArray(previousTask.expansions) ? previousTask.expansions : [],
    warnings,
    fileHashes: currentHashes,
    contextFingerprint,
  };

  if (!options.noWrite) {
    fs.mkdirSync(runtimeDirectory, { recursive: true });
    fs.mkdirSync(path.dirname(featureStateFile), { recursive: true });
    fs.mkdirSync(path.dirname(taskStateFile), { recursive: true });
    writeJson(path.join(runtimeDirectory, "active-context.json"), manifest);
    writeJson(featureStateFile, manifest);
    writeJson(taskStateFile, manifest);
  }

  return manifest;
}

function validateContext(projectRoot) {
  const features = loadFeatureCapsules(projectRoot);
  const knowledgeIndex = buildKnowledgeIndex(projectRoot);
  const sourceResult = buildSourceIndex(projectRoot);
  const errors = [];
  const warnings = [];
  const featureIds = new Set();
  const knownFeatureIds = new Set(features.map((feature) => feature.id));
  const knowledgeValidation = validateKnowledgeGraph(projectRoot);
  errors.push(...knowledgeValidation.errors);
  warnings.push(...knowledgeValidation.warnings);

  if (features.length === 0) warnings.push("No feature capsules were found under .agent/features/.");

  for (const feature of features) {
    if (featureIds.has(feature.id)) errors.push(`Duplicate feature ID: ${feature.id}`);
    featureIds.add(feature.id);
    if (!feature.summary) warnings.push(`${feature.id} has no summary.`);
    if (feature.triggers.length === 0) warnings.push(`${feature.id} has no triggers.`);
    if (feature.source.entrypoints.length === 0) warnings.push(`${feature.id} has no source entrypoints.`);
    for (const dependency of feature.depends_on) {
      if (!knownFeatureIds.has(dependency)) errors.push(`${feature.id}: unresolved feature dependency ${dependency}`);
    }

    for (const binding of feature.knowledge) {
      if (!resolveKnowledgeBinding(projectRoot, binding, knowledgeIndex)) {
        errors.push(`${feature.id}: unresolved knowledge binding ${binding}`);
      }
    }
    for (const binding of feature.references) {
      if (!resolveKnowledgeBinding(projectRoot, binding, knowledgeIndex)) {
        errors.push(`${feature.id}: unresolved reference binding ${binding}`);
      }
    }
    for (const binding of feature.source.entrypoints) {
      if (expandBindings(projectRoot, [binding], sourceResult.index.files).length === 0) {
        errors.push(`${feature.id}: entrypoint matched no source file: ${binding}`);
      }
    }
    for (const binding of feature.source.symbols) {
      if (resolveSymbolBinding(binding, sourceResult.index.files).length === 0) {
        errors.push(`${feature.id}: symbol binding matched no indexed symbol: ${binding}`);
      }
    }
    for (const binding of [...feature.source.paths, ...feature.source.tests]) {
      if (expandBindings(projectRoot, [binding], sourceResult.index.files).length === 0) {
        warnings.push(`${feature.id}: binding matched no indexed file: ${binding}`);
      }
    }
  }

  return {
    status: errors.length === 0 ? "valid" : "invalid",
    features: features.length,
    sourceIndex: sourceResult.stats,
    errors,
    warnings,
  };
}

function createFeatureCapsule(projectRoot, options = {}) {
  const rawId = String(options.id || "").trim();
  const id = rawId.startsWith("feature.") ? rawId : `feature.${rawId}`;
  if (!rawId || !/^feature\.[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(id)) {
    return { status: "invalid", message: "Feature creation requires a stable lowercase ID such as authentication or feature.authentication." };
  }
  if (!options.summary || String(options.summary).trim().length < 8) {
    return { status: "invalid", message: "Feature creation requires a meaningful summary." };
  }

  const featureDirectory = path.join(projectRoot, ".agent", "features");
  const capsuleFile = path.join(featureDirectory, `${safeStateName(id.replace(/^feature\./, ""))}.md`);
  if (fs.existsSync(capsuleFile)) {
    return { status: "invalid", message: `Feature capsule already exists: ${relativePath(projectRoot, capsuleFile)}` };
  }

  const entrypoints = asArray(options.entrypoints).map(normalizePath);
  if (entrypoints.length === 0) {
    return { status: "invalid", message: "Feature creation requires at least one confirmed source entrypoint." };
  }
  for (const entrypoint of entrypoints) {
    const absolute = path.resolve(projectRoot, entrypoint);
    if (!isInsideProject(projectRoot, absolute) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
      return { status: "invalid", message: `Confirmed entrypoint does not exist: ${entrypoint}` };
    }
  }

  const metadata = {
    id,
    type: "feature",
    status: "active",
    summary: String(options.summary).trim(),
    revision: 1,
    verified_at_commit: "",
    verified_at_state: "",
    triggers: uniqueStrings(asArray(options.triggers).length > 0
      ? asArray(options.triggers)
      : id.replace(/^feature\./, "").split(/[.-]/)),
    knowledge: uniqueStrings(asArray(options.knowledge)),
    references: uniqueStrings(asArray(options.references)),
    source: {
      entrypoints: uniqueStrings(entrypoints),
      symbols: uniqueStrings(asArray(options.symbols)),
      paths: uniqueStrings(asArray(options.paths).map(normalizePath)),
      tests: uniqueStrings(asArray(options.tests).map(normalizePath)),
    },
    depends_on: uniqueStrings(asArray(options.dependsOn)),
  };
  const title = id.replace(/^feature\./, "").split(/[.-]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  const body = `# ${title}\n\n## Purpose\n\n${metadata.summary}\n\n## Boundaries\n\nTo be refined as the feature evolves.\n\n## Current Behavior\n\nTo be documented after the first validated implementation task.\n\n## Related Knowledge\n\n- [Project Context](../project-context.md)\n- [Context Routing](../docs/context-routing.md)\n`;
  fs.mkdirSync(featureDirectory, { recursive: true });
  fs.writeFileSync(capsuleFile, `---\n${serializeYamlObject(metadata, 0)}\n---\n\n${body}`);
  return {
    status: "created",
    feature: id,
    capsule: relativePath(projectRoot, capsuleFile),
    message: "Feature capsule created. Resolve the owner request again to start its incremental baseline.",
  };
}

function validateKnowledgeGraph(projectRoot) {
  const agentDirectory = path.join(projectRoot, ".agent");
  const errors = [];
  const warnings = [];
  const ids = new Map();
  if (!fs.existsSync(agentDirectory)) return { errors, warnings };

  const notes = walkFiles(agentDirectory, (candidate) => path.extname(candidate) === ".md");
  for (const note of notes) {
    const relativeNote = relativePath(projectRoot, note);
    const content = fs.readFileSync(note, "utf8");
    const metadata = parseFrontmatter(content);
    if (metadata.id) {
      if (ids.has(metadata.id)) errors.push(`Duplicate knowledge ID ${metadata.id}: ${ids.get(metadata.id)} and ${relativeNote}`);
      else ids.set(metadata.id, relativeNote);
    }

    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split("#")[0].trim();
      if (!target || /^[a-z]+:/i.test(target)) continue;
      const absolute = path.resolve(path.dirname(note), target);
      if (!isInsideProject(projectRoot, absolute)) {
        errors.push(`${relativeNote}: Markdown link leaves the project root: ${target}`);
      } else if (!fs.existsSync(absolute)) {
        errors.push(`${relativeNote}: broken Markdown link: ${target}`);
      }
    }
  }

  for (const note of notes) {
    const relativeNote = relativePath(projectRoot, note);
    const content = fs.readFileSync(note, "utf8");
    const metadata = parseFrontmatter(content);
    for (const related of asArray(metadata.related)) {
      const absolute = path.resolve(path.dirname(note), related);
      if (!ids.has(related) && !fs.existsSync(absolute)) {
        warnings.push(`${relativeNote}: unresolved related knowledge: ${related}`);
      }
    }
  }
  return { errors, warnings };
}

function maintainFeature(projectRoot, options = {}) {
  const runtimeDirectory = getRuntimeDirectory(projectRoot);
  const active = readJson(path.join(runtimeDirectory, "active-context.json"), null);
  const requestedId = options.feature
    ? (options.feature.startsWith("feature.") ? options.feature : `feature.${options.feature}`)
    : active && active.feature && active.feature.id;
  if (!requestedId) {
    return { status: "unresolved", message: "No active or explicitly selected feature is available for maintenance." };
  }

  const featureState = readJson(getFeatureStateFile(projectRoot, requestedId), null);
  const state = active && active.feature && active.feature.id === requestedId ? active : featureState;
  if (!state) {
    return { status: "unresolved", message: `No incremental feature state exists for ${requestedId}. Resolve a task first.` };
  }
  const feature = loadFeatureCapsules(projectRoot).find((candidate) => candidate.id === requestedId);
  if (!feature) {
    return { status: "unresolved", message: `Feature capsule not found: ${requestedId}` };
  }

  const currentRoute = resolveContext(projectRoot, state.task, {
    feature: requestedId,
    refresh: true,
    noWrite: true,
  });
  const acceptedIds = new Set(asArray(options.accept));
  const proposals = deduplicateProposals([
    ...((currentRoute.maintenance && currentRoute.maintenance.proposals) || []),
    ...((state.maintenance && state.maintenance.proposals) || []).filter((proposal) => {
      if (proposal.type !== "add-source-binding" || !proposal.to) return false;
      return fs.existsSync(path.join(projectRoot, proposal.to));
    }),
  ]);
  const selected = proposals.filter((proposal) => acceptedIds.has(proposal.id) || (options.applySafe && proposal.safe));
  if (selected.length === 0) {
    return {
      status: "no-change",
      feature: requestedId,
      proposals,
      message: proposals.length === 0
        ? "No maintenance proposals are pending."
        : "Maintenance proposals require agent validation before acceptance.",
    };
  }

  const capsuleFile = path.join(projectRoot, feature.file);
  const content = fs.readFileSync(capsuleFile, "utf8");
  const metadata = parseFrontmatter(content);
  metadata.source = metadata.source || {};
  metadata.source.entrypoints = asArray(metadata.source.entrypoints);
  metadata.source.symbols = asArray(metadata.source.symbols);
  metadata.source.paths = asArray(metadata.source.paths);
  metadata.source.tests = asArray(metadata.source.tests);
  const applied = [];

  for (const proposal of selected) {
    if (proposal.type === "replace-entrypoint") {
      metadata.source.entrypoints = metadata.source.entrypoints
        .map((binding) => normalizePath(binding) === proposal.from ? proposal.to : binding);
      applied.push(proposal);
    } else if (proposal.type === "remove-stale-entrypoint") {
      metadata.source.entrypoints = metadata.source.entrypoints
        .filter((binding) => normalizePath(binding) !== proposal.from);
      applied.push(proposal);
    } else if (proposal.type === "add-source-binding") {
      if (!isCoveredByBindings(proposal.to, [
        ...metadata.source.entrypoints,
        ...metadata.source.paths,
        ...metadata.source.tests,
      ])) metadata.source.paths.push(proposal.to);
      applied.push(proposal);
    } else if (proposal.type === "replace-source-binding") {
      metadata.source.paths = metadata.source.paths
        .map((binding) => normalizePath(binding) === proposal.from ? proposal.to : binding);
      applied.push(proposal);
    } else if (proposal.type === "remove-stale-source-binding") {
      metadata.source.paths = metadata.source.paths
        .filter((binding) => normalizePath(binding) !== proposal.from);
      applied.push(proposal);
    } else if (proposal.type === "replace-test-binding") {
      metadata.source.tests = metadata.source.tests
        .map((binding) => normalizePath(binding) === proposal.from ? proposal.to : binding);
      applied.push(proposal);
    } else if (proposal.type === "remove-stale-test-binding") {
      metadata.source.tests = metadata.source.tests
        .filter((binding) => normalizePath(binding) !== proposal.from);
      applied.push(proposal);
    }
  }

  metadata.revision = Number(metadata.revision || 0) + 1;
  metadata.verified_at_state = state.contextFingerprint || "";
  const workingTree = getWorkingTreeChanges(projectRoot);
  if (workingTree.changed.length === 0 && workingTree.added.length === 0
    && workingTree.deleted.length === 0 && workingTree.renamed.length === 0) {
    metadata.verified_at_commit = getGitRevision(projectRoot) || metadata.verified_at_commit || "";
  }
  fs.writeFileSync(capsuleFile, renderFrontmatter(metadata, content));

  const refreshed = resolveContext(projectRoot, state.task, { feature: requestedId, refresh: true });
  return {
    status: "updated",
    feature: requestedId,
    capsule: feature.file,
    revision: metadata.revision,
    applied,
    remainingProposals: refreshed.maintenance.proposals,
    refreshedStatus: refreshed.status,
    manifestPath: refreshed.manifestPath,
  };
}

function checkContextPath(projectRoot, requestedPath) {
  if (!requestedPath) return { status: "invalid", message: "Context check requires a project-relative path." };
  const active = readJson(path.join(getRuntimeDirectory(projectRoot), "active-context.json"), null);
  if (!active || !active.context) {
    return { status: "unresolved", message: "No active context exists. Resolve the task before checking a file." };
  }
  const normalized = normalizePath(requestedPath);
  for (const level of ["required", "conditional", "reference"]) {
    const route = (active.context[level] || []).find((item) => item.path === normalized);
    if (route) {
      return {
        status: level === "required" ? "allowed" : level,
        path: normalized,
        level,
        reason: route.reason,
        readLevel: route.readLevel,
        feature: active.feature.id,
        task: active.task,
      };
    }
  }
  return {
    status: "unlisted",
    path: normalized,
    feature: active.feature.id,
    task: active.task,
    message: "Do not read this file until an import, symbol, failing validation, unresolved rule, or other concrete reason justifies expansion.",
  };
}

function expandContext(projectRoot, options = {}) {
  const runtimeDirectory = getRuntimeDirectory(projectRoot);
  const activeFile = path.join(runtimeDirectory, "active-context.json");
  const active = readJson(activeFile, null);
  if (!active || !active.context) {
    return { status: "unresolved", message: "No active context exists. Resolve the task before expanding it." };
  }
  if (!options.path || !options.reason) {
    return { status: "invalid", message: "Context expansion requires both a path and an evidence-based reason." };
  }
  const absolute = path.resolve(projectRoot, options.path);
  if (!isInsideProject(projectRoot, absolute) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    return { status: "invalid", message: `Expansion path is not a project file: ${options.path}` };
  }
  const normalized = relativePath(projectRoot, absolute);
  const level = ["required", "conditional", "reference"].includes(options.level)
    ? options.level
    : "conditional";
  for (const contextLevel of ["required", "conditional", "reference"]) {
    active.context[contextLevel] = (active.context[contextLevel] || []).filter((item) => item.path !== normalized);
  }

  const sourceResult = buildSourceIndex(projectRoot);
  const record = sourceResult.index.files[normalized];
  const kind = normalized.startsWith(".agent/") && path.extname(normalized) === ".md"
    ? "knowledge"
    : /(^|\/)(test|tests|spec|specs)(\/|$)|\.(?:test|spec)\./.test(normalized)
      ? "test"
      : "source";
  addRoute(active.context[level], normalized, kind, `Task expansion: ${options.reason}`, level === "required" ? "targeted" : "metadata", record);
  active.fileHashes[normalized] = hashFile(absolute);
  active.contextFingerprint = hashContent(JSON.stringify(active.fileHashes));
  active.generatedAt = new Date().toISOString();
  active.expansions = [...(active.expansions || []), {
    path: normalized,
    level,
    reason: options.reason,
    at: active.generatedAt,
  }];

  if (kind === "source") {
    const feature = loadFeatureCapsules(projectRoot).find((candidate) => candidate.id === active.feature.id);
    if (feature && !isCoveredByBindings(normalized, [
      ...feature.source.entrypoints,
      ...feature.source.paths,
      ...feature.source.tests,
    ])) {
      const proposal = createProposal(
        "add-source-binding",
        null,
        normalized,
        false,
        `The active task expanded to this source file because: ${options.reason}`,
      );
      active.maintenance = active.maintenance || { proposals: [], requiresReview: false };
      active.maintenance.proposals = deduplicateProposals([...(active.maintenance.proposals || []), proposal]);
      active.maintenance.requiresReview = true;
    }
  }

  writeJson(activeFile, active);
  writeJson(path.join(projectRoot, active.manifestPath), active);
  return {
    status: "expanded",
    feature: active.feature.id,
    task: active.task,
    path: normalized,
    level,
    reason: options.reason,
    manifestPath: active.manifestPath,
    maintenance: active.maintenance,
  };
}

function renderFrontmatter(metadata, originalContent) {
  const bodyMatch = originalContent.match(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  const body = bodyMatch ? bodyMatch[1].replace(/^\r?\n/, "") : originalContent;
  return `---\n${serializeYamlObject(metadata, 0)}\n---\n\n${body.trimStart()}`;
}

function serializeYamlObject(value, indent) {
  const lines = [];
  const prefix = " ".repeat(indent);
  for (const [key, item] of Object.entries(value)) {
    if (Array.isArray(item)) {
      if (item.length === 0) {
        lines.push(`${prefix}${key}: []`);
      } else {
        lines.push(`${prefix}${key}:`);
        for (const entry of item) lines.push(`${prefix}  - ${serializeYamlScalar(entry)}`);
      }
    } else if (item && typeof item === "object") {
      lines.push(`${prefix}${key}:`);
      lines.push(serializeYamlObject(item, indent + 2));
    } else {
      lines.push(`${prefix}${key}: ${serializeYamlScalar(item)}`);
    }
  }
  return lines.join("\n");
}

function serializeYamlScalar(value) {
  if (value === null) return "null";
  if (typeof value === "boolean" || typeof value === "number") return String(value);
  const text = String(value ?? "");
  if (!text || /[:#\[\]{}&,*!|>'"%@`]|^[-?]|\s$/.test(text)
    || ["true", "false", "null"].includes(text.toLowerCase())
    || /^-?\d+(?:\.\d+)?$/.test(text)) {
    return JSON.stringify(text);
  }
  return text;
}

function rankFeatures(features, task, signals = {}) {
  const normalizedTask = normalizeText(task);
  const taskTokens = tokenize(task);

  return features.map((feature) => {
    let score = 0;
    const reasons = [];
    const candidates = [feature.id, feature.summary, ...feature.triggers].filter(Boolean);

    for (const candidate of candidates) {
      const normalizedCandidate = normalizeText(candidate);
      if (normalizedCandidate && normalizedTask.includes(normalizedCandidate)) {
        const weight = feature.triggers.includes(candidate) ? 12 : 8;
        score += weight;
        reasons.push(`phrase:${candidate}`);
      }
      const overlap = [...tokenize(candidate)].filter((token) => taskTokens.has(token)).length;
      if (overlap > 0) score += overlap * 2;
    }

    const featureBindings = [
      ...feature.source.entrypoints,
      ...feature.source.paths,
      ...feature.source.tests,
    ];
    for (const changedFile of signals.changedFiles || []) {
      if (isCoveredByBindings(changedFile, featureBindings)) {
        score += 8;
        reasons.push(`changed-file:${changedFile}`);
      }
    }
    if (signals.activeFeature === feature.id && score > 0) {
      score += 2;
      reasons.push("active-feature-continuity");
    }

    return { id: feature.id, file: feature.file, score, reasons: [...new Set(reasons)] };
  }).sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
}

function selectFeature(features, ranked, requestedFeature) {
  if (requestedFeature) {
    return features.find((feature) => feature.id === requestedFeature || feature.id === `feature.${requestedFeature}`) || null;
  }
  if (!ranked[0] || ranked[0].score <= 0) return null;
  return features.find((feature) => feature.id === ranked[0].id) || null;
}

function featureConfidence(ranked, selectedId, explicitFeature) {
  if (explicitFeature) return 1;
  const selected = ranked.find((feature) => feature.id === selectedId);
  const second = ranked.find((feature) => feature.id !== selectedId);
  if (!selected || selected.score <= 0) return 0;
  const evidence = Math.min(1, selected.score / 20);
  const separation = second
    ? Math.max(0, selected.score - second.score) / Math.max(1, selected.score)
    : 1;
  return Number(Math.min(0.99, 0.4 + evidence * 0.4 + separation * 0.2).toFixed(2));
}

function expandBindings(projectRoot, bindings, indexedFiles) {
  const results = new Set();
  const files = Object.keys(indexedFiles);
  for (const binding of bindings) {
    const normalized = normalizePath(binding);
    if (hasGlob(normalized)) {
      const matcher = globToRegExp(normalized);
      for (const file of files) if (matcher.test(file)) results.add(file);
    } else if (indexedFiles[normalized]) {
      results.add(normalized);
    } else {
      const absolute = path.resolve(projectRoot, binding);
      if (isInsideProject(projectRoot, absolute) && fs.existsSync(absolute) && fs.statSync(absolute).isFile()) {
        results.add(relativePath(projectRoot, absolute));
      }
    }
  }
  return [...results].sort();
}

function resolveSymbolBinding(binding, indexedFiles) {
  const text = String(binding);
  const separator = text.lastIndexOf("#");
  const requestedPath = separator === -1 ? null : normalizePath(text.slice(0, separator));
  const requestedSymbol = separator === -1 ? text : text.slice(separator + 1);
  if (!requestedSymbol) return [];
  const matches = [];
  for (const [file, record] of Object.entries(indexedFiles)) {
    if (requestedPath && file !== requestedPath) continue;
    const location = (record.symbolLocations || []).find((item) => item.name === requestedSymbol);
    if (location) matches.push({ path: file, name: location.name, line: location.line });
  }
  return matches.sort((left, right) => left.path.localeCompare(right.path));
}

function resolveKnowledgeBinding(projectRoot, binding, knowledgeIndex) {
  const target = String(binding).split("#")[0];
  if (knowledgeIndex.has(target)) return knowledgeIndex.get(target);
  const absolute = path.resolve(projectRoot, target);
  return isInsideProject(projectRoot, absolute) && fs.existsSync(absolute) && fs.statSync(absolute).isFile()
    ? relativePath(projectRoot, absolute)
    : null;
}

function knowledgeBindingAnchor(binding) {
  const separator = String(binding).indexOf("#");
  return separator === -1 ? null : String(binding).slice(separator + 1) || null;
}

function discoverLinkedKnowledge(projectRoot, notePaths, knowledgeIndex) {
  const links = new Map();
  const visited = new Set(notePaths);
  const queue = notePaths.map((notePath) => ({ notePath, depth: 0 }));

  while (queue.length > 0) {
    const { notePath, depth } = queue.shift();
    const absoluteNote = path.join(projectRoot, notePath);
    if (!fs.existsSync(absoluteNote)) continue;
    const content = fs.readFileSync(absoluteNote, "utf8");
    const metadata = parseFrontmatter(content);
    const discovered = [];

    for (const related of asArray(metadata.related)) {
      const resolved = resolveKnowledgeBinding(projectRoot, related, knowledgeIndex)
        || resolveMarkdownTarget(projectRoot, absoluteNote, related);
      if (resolved && resolved !== notePath) discovered.push({
        path: resolved,
        reason: `Related knowledge at depth ${depth + 1} from ${notePath}`,
      });
    }

    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split("#")[0].trim();
      if (!target || /^[a-z]+:/i.test(target)) continue;
      const resolved = resolveMarkdownTarget(projectRoot, absoluteNote, target);
      if (resolved && resolved !== notePath) discovered.push({
        path: resolved,
        reason: `Markdown link at depth ${depth + 1} from ${notePath}`,
      });
    }

    for (const discoveredLink of discovered) {
      if (!links.has(discoveredLink.path)) {
        links.set(discoveredLink.path, {
          ...discoveredLink,
          depth: depth + 1,
          relevance: Math.max(1, 6 - depth),
        });
      }
      if (!visited.has(discoveredLink.path)) {
        visited.add(discoveredLink.path);
        queue.push({ notePath: discoveredLink.path, depth: depth + 1 });
      }
    }
  }
  return [...links.values()].sort((left, right) => left.depth - right.depth || left.path.localeCompare(right.path));
}

function resolveMarkdownTarget(projectRoot, sourceNote, target) {
  const absolute = path.resolve(path.dirname(sourceNote), target);
  if (!isInsideProject(projectRoot, absolute)) return null;
  const relative = relativePath(projectRoot, absolute);
  if (!relative.startsWith(".agent/") || path.extname(absolute) !== ".md") return null;
  return fs.existsSync(absolute) && fs.statSync(absolute).isFile() ? relative : null;
}

function resolveDependencyClosure(projectRoot, entrypoints, indexedFiles) {
  const forward = [];
  const visited = new Set(entrypoints);
  const queue = entrypoints.map((file) => ({ path: file, depth: 0 }));

  while (queue.length > 0) {
    const current = queue.shift();
    const record = indexedFiles[current.path];
    if (!record) continue;
    for (const specifier of record.imports || []) {
      const resolved = resolveLocalImport(projectRoot, current.path, specifier, indexedFiles);
      if (!resolved || visited.has(resolved)) continue;
      visited.add(resolved);
      const dependency = { path: resolved, depth: current.depth + 1, via: current.path };
      forward.push(dependency);
      queue.push(dependency);
    }
  }

  const routedSources = new Set([...entrypoints, ...forward.map((item) => item.path)]);
  const reverseImports = new Map();
  for (const [file, record] of Object.entries(indexedFiles)) {
    for (const specifier of record.imports || []) {
      const imported = resolveLocalImport(projectRoot, file, specifier, indexedFiles);
      if (!imported) continue;
      if (!reverseImports.has(imported)) reverseImports.set(imported, []);
      reverseImports.get(imported).push(file);
    }
  }
  const reverse = [];
  const reverseVisited = new Set(routedSources);
  const reverseQueue = [...routedSources].map((file) => ({ path: file, depth: 0 }));
  while (reverseQueue.length > 0) {
    const current = reverseQueue.shift();
    for (const caller of reverseImports.get(current.path) || []) {
      if (reverseVisited.has(caller)) continue;
      reverseVisited.add(caller);
      const relationship = { path: caller, imports: current.path, depth: current.depth + 1 };
      reverse.push(relationship);
      reverseQueue.push(relationship);
    }
  }

  return {
    forward: forward.sort((left, right) => left.depth - right.depth || left.path.localeCompare(right.path)),
    reverse: reverse.sort((left, right) => left.depth - right.depth || left.path.localeCompare(right.path)),
  };
}

function resolveAffectedFeatures(features, selected, indexedFiles) {
  const affected = [];
  for (const feature of features) {
    if (feature.id === selected.id) continue;
    if (selected.depends_on.includes(feature.id)) {
      affected.push({
        id: feature.id,
        file: feature.file,
        direction: "upstream",
        reason: `${selected.id} declares a dependency on ${feature.id}`,
      });
      continue;
    }
    if (feature.depends_on.includes(selected.id)) {
      affected.push({
        id: feature.id,
        file: feature.file,
        direction: "downstream",
        reason: `${feature.id} declares a dependency on ${selected.id}`,
      });
      continue;
    }

    const selectedFiles = new Set(expandBindings(".", [
      ...selected.source.entrypoints,
      ...selected.source.paths,
    ], indexedFiles));
    const otherFiles = new Set(expandBindings(".", [
      ...feature.source.entrypoints,
      ...feature.source.paths,
    ], indexedFiles));
    if ([...selectedFiles].some((file) => otherFiles.has(file))) {
      affected.push({
        id: feature.id,
        file: feature.file,
        direction: "shared-source",
        reason: `${feature.id} shares source bindings with ${selected.id}`,
      });
    }
  }
  return affected;
}

function buildMaintenanceProposals(feature, indexedFiles, dependencyClosure, workingTree, previousFeature) {
  const proposals = [];
  const renameMap = new Map(workingTree.renamed.map((item) => [item.from, item.to]));

  for (const entrypoint of feature.source.entrypoints) {
    const normalized = normalizePath(entrypoint);
    if (indexedFiles[normalized]) continue;
    const previousHash = previousFeature && previousFeature.fileHashes && previousFeature.fileHashes[normalized];
    const hashMatchedRename = previousHash
      ? Object.entries(indexedFiles).find(([candidate, record]) => candidate !== normalized
        && record.hash === previousHash
        && workingTree.added.includes(candidate))
      : null;
    const renamedTo = renameMap.get(normalized) || (hashMatchedRename && hashMatchedRename[0]);
    if (renamedTo && indexedFiles[renamedTo]) {
      proposals.push(createProposal(
        "replace-entrypoint",
        normalized,
        renamedTo,
        true,
        renameMap.has(normalized)
          ? "Git reports an exact rename for a missing entrypoint."
          : "An added file has the exact content hash of the missing entrypoint.",
      ));
    } else {
      proposals.push(createProposal(
        "remove-stale-entrypoint",
        normalized,
        null,
        false,
        "The entrypoint no longer exists and no exact rename was detected.",
      ));
    }
  }

  for (const [bindingType, bindings] of [
    ["source", feature.source.paths],
    ["test", feature.source.tests],
  ]) {
    for (const binding of bindings) {
      const normalized = normalizePath(binding);
      if (hasGlob(normalized) || indexedFiles[normalized]) continue;
      const previousHash = previousFeature && previousFeature.fileHashes && previousFeature.fileHashes[normalized];
      const hashMatchedRename = previousHash
        ? Object.entries(indexedFiles).find(([candidate, record]) => candidate !== normalized
          && record.hash === previousHash
          && workingTree.added.includes(candidate))
        : null;
      const renamedTo = renameMap.get(normalized) || (hashMatchedRename && hashMatchedRename[0]);
      if (renamedTo && indexedFiles[renamedTo]) {
        proposals.push(createProposal(
          `replace-${bindingType}-binding`,
          normalized,
          renamedTo,
          true,
          `An exact rename was detected for a missing ${bindingType} binding.`,
        ));
      } else {
        proposals.push(createProposal(
          `remove-stale-${bindingType}-binding`,
          normalized,
          null,
          false,
          `The exact ${bindingType} binding no longer exists and no rename was detected.`,
        ));
      }
    }
  }

  for (const dependency of dependencyClosure.forward) {
    if (isCoveredByBindings(dependency.path, [
      ...feature.source.entrypoints,
      ...feature.source.paths,
      ...feature.source.tests,
    ])) continue;
    proposals.push(createProposal(
      "add-source-binding",
      null,
      dependency.path,
      false,
      `A routed entrypoint reaches this local dependency at depth ${dependency.depth}.`,
    ));
  }

  return deduplicateProposals(proposals);
}

function buildExpansionMaintenanceProposals(feature, previousTask) {
  if (!previousTask || !Array.isArray(previousTask.expansions)) return [];
  return previousTask.expansions
    .filter((expansion) => expansion.path
      && !expansion.path.startsWith(".agent/")
      && !isCoveredByBindings(expansion.path, [
        ...feature.source.entrypoints,
        ...feature.source.paths,
        ...feature.source.tests,
      ]))
    .map((expansion) => createProposal(
      "add-source-binding",
      null,
      expansion.path,
      false,
      `The active task expanded to this source file because: ${expansion.reason}`,
    ));
}

function restoreTaskExpansions(projectRoot, previousTask, context, indexedFiles) {
  if (!previousTask || !Array.isArray(previousTask.expansions)) return;
  for (const expansion of previousTask.expansions) {
    const absolute = path.resolve(projectRoot, expansion.path);
    if (!isInsideProject(projectRoot, absolute) || !fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) continue;
    if ([...context.required, ...context.conditional, ...context.reference]
      .some((item) => item.path === expansion.path)) continue;
    const level = ["required", "conditional", "reference"].includes(expansion.level)
      ? expansion.level
      : "conditional";
    const kind = expansion.path.startsWith(".agent/") && path.extname(expansion.path) === ".md"
      ? "knowledge"
      : /(^|\/)(test|tests|spec|specs)(\/|$)|\.(?:test|spec)\./.test(expansion.path)
        ? "test"
        : "source";
    addRoute(
      context[level],
      expansion.path,
      kind,
      `Restored task expansion: ${expansion.reason}`,
      level === "required" ? "targeted" : "metadata",
      indexedFiles[expansion.path],
    );
  }
}

function createProposal(type, from, to, safe, evidence) {
  const id = hashContent(`${type}:${from || ""}:${to || ""}`).slice(0, 12);
  return { id, type, from, to, safe, evidence };
}

function deduplicateProposals(proposals) {
  const seen = new Set();
  return proposals.filter((proposal) => {
    if (seen.has(proposal.id)) return false;
    seen.add(proposal.id);
    return true;
  });
}

function isCoveredByBindings(file, bindings) {
  return bindings.some((binding) => {
    const normalized = normalizePath(binding);
    return hasGlob(normalized) ? globToRegExp(normalized).test(file) : normalized === file;
  });
}

function resolveLocalImport(projectRoot, importer, specifier, indexedFiles) {
  const candidates = [];
  const importerExtension = path.extname(importer).toLowerCase();
  const importerDirectory = path.dirname(importer);

  if (importerExtension === ".py" && specifier.startsWith(".")) {
    const dots = specifier.match(/^\.+/)[0].length;
    const moduleName = specifier.slice(dots).replace(/\./g, "/");
    let baseDirectory = importerDirectory;
    for (let level = 1; level < dots; level += 1) baseDirectory = path.dirname(baseDirectory);
    candidates.push(normalizePath(path.join(baseDirectory, moduleName)));
  } else if (specifier.startsWith(".")) {
    candidates.push(normalizePath(path.join(importerDirectory, specifier)));
  } else if (/^[A-Za-z0-9_./-]+$/.test(specifier)) {
    const modulePath = specifier.replace(/\./g, "/");
    candidates.push(normalizePath(modulePath));
    candidates.push(normalizePath(path.join("src", modulePath)));
  } else {
    return null;
  }

  const expanded = [];
  for (const base of candidates) {
    expanded.push(base);
    for (const extension of SOURCE_EXTENSIONS) expanded.push(`${base}${extension}`);
    for (const extension of SOURCE_EXTENSIONS) expanded.push(`${base}/index${extension}`);
    if (importerExtension === ".py") expanded.push(`${base}/__init__.py`);
  }
  return expanded.find((candidate) => indexedFiles[candidate]) || null;
}

function extractSymbolLocations(content) {
  const symbols = new Map();
  const patterns = [
    /\bclass\s+([A-Za-z_$][\w$]*)/,
    /\b(?:function|def|func|fn)\s+([A-Za-z_$][\w$]*)/,
    /\b(?:interface|type|enum|struct|trait)\s+([A-Za-z_$][\w$]*)/,
    /\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*=>/,
  ];
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    for (const pattern of patterns) {
      const match = lines[index].match(pattern);
      if (!match || symbols.has(match[1])) continue;
      symbols.set(match[1], { name: match[1], line: index + 1 });
      if (symbols.size >= 200) return [...symbols.values()];
    }
  }
  return [...symbols.values()];
}

function extractImports(content) {
  const imports = new Set();
  const patterns = [
    /\b(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
    /\brequire\(\s*["']([^"']+)["']\s*\)/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
    /^\s*from\s+([.A-Za-z_][\w.]*)\s+import\s+/gm,
    /^\s*import\s+([A-Za-z_][\w.]*)/gm,
    /\brequire_relative\s*["']([^"']+)["']/g,
    /\b(?:require|include)(?:_once)?\s*\(?\s*["']([^"']+)["']/g,
    /^\s*(?:using|import)\s+([A-Za-z_][\w.]*)\s*;?\s*$/gm,
    /\bimport\s+(?:\(\s*)?["']([^"']+)["']/g,
  ];
  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) imports.add(match[1]);
  }
  return [...imports];
}

function scoreSourceRecord(file, record, taskTokens) {
  let score = 0;
  for (const token of tokenize(file)) if (taskTokens.has(token)) score += 3;
  for (const symbol of (record && record.symbols) || []) {
    for (const token of tokenize(symbol)) if (taskTokens.has(token)) score += 2;
  }
  return score;
}

function calculateDelta(previousHashes = {}, currentHashes = {}) {
  const added = [];
  const modified = [];
  const removed = [];
  const unchanged = [];

  for (const [file, hash] of Object.entries(currentHashes)) {
    if (!(file in previousHashes)) added.push(file);
    else if (previousHashes[file] !== hash) modified.push(file);
    else unchanged.push(file);
  }
  for (const file of Object.keys(previousHashes)) {
    if (!(file in currentHashes)) removed.push(file);
  }
  return { added, modified, removed, unchanged };
}

function addRoute(target, file, kind, reason, readLevel, record, relevance = 0) {
  target.push({
    path: normalizePath(file),
    kind,
    reason,
    readLevel,
    ...(record && record.symbols && record.symbols.length > 0 ? { symbols: record.symbols } : {}),
    ...(record && record.symbolLocations && record.symbolLocations.length > 0
      ? { symbolLocations: record.symbolLocations }
      : {}),
    ...(relevance > 0 ? { relevance } : {}),
  });
}

function deduplicateRoutes(routes) {
  const seen = new Set();
  return routes.filter((route) => {
    const key = `${route.kind}:${route.path}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function walkFiles(directory, predicate) {
  const results = [];
  if (!fs.existsSync(directory)) return results;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORED_DIRECTORIES.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (normalizePath(fullPath).includes("/.agent/runtime/")) continue;
      results.push(...walkFiles(fullPath, predicate));
    } else if (!predicate || predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

function isSourceFile(file, projectRoot) {
  const relative = relativePath(projectRoot, file);
  if (relative.startsWith(".agent/")) return false;
  return SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase());
}

function globToRegExp(pattern) {
  let output = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];
    if (character === "*") {
      if (pattern[index + 1] === "*") {
        output += ".*";
        index += 1;
      } else {
        output += "[^/]*";
      }
    } else if (character === "?") {
      output += "[^/]";
    } else {
      output += character.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
    }
  }
  return new RegExp(`${output}$`);
}

function hasGlob(value) {
  return /[*?]/.test(value);
}

function getRuntimeDirectory(projectRoot) {
  return path.join(projectRoot, ".agent", "runtime", "context-routing");
}

function getFeatureStateFile(projectRoot, featureId) {
  return path.join(getRuntimeDirectory(projectRoot), "features", `${safeStateName(featureId)}.json`);
}

function getTaskStateFile(projectRoot, featureId, task) {
  const taskId = hashContent(`${featureId}:${normalizeText(task)}`).slice(0, 16);
  return path.join(getRuntimeDirectory(projectRoot), "tasks", `${safeStateName(featureId)}-${taskId}.json`);
}

function safeStateName(value) {
  return String(value).replace(/[^a-zA-Z0-9._-]+/g, "-");
}

function getWorkingTreeChanges(projectRoot) {
  const changed = [];
  const added = [];
  const deleted = [];
  const renamed = [];

  try {
    const output = execFileSync("git", ["diff", "--name-status", "-M", "HEAD", "--"], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    for (const line of output.split(/\r?\n/).filter(Boolean)) {
      const parts = line.split("\t");
      const status = parts[0];
      if (status.startsWith("R") && parts[1] && parts[2]) {
        const item = { from: normalizePath(parts[1]), to: normalizePath(parts[2]) };
        renamed.push(item);
        changed.push(item.to);
      } else if (status === "A" && parts[1]) {
        added.push(normalizePath(parts[1]));
        changed.push(normalizePath(parts[1]));
      } else if (status === "D" && parts[1]) {
        deleted.push(normalizePath(parts[1]));
      } else if (parts[1]) {
        changed.push(normalizePath(parts[1]));
      }
    }

  } catch {
    // A repository without HEAD can still provide untracked-file signals below.
  }

  try {
    const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    for (const file of untracked.split(/\r?\n/).filter(Boolean)) {
      const normalized = normalizePath(file);
      if (!added.includes(normalized)) added.push(normalized);
      if (!changed.includes(normalized)) changed.push(normalized);
    }
  } catch {
    // Non-Git projects continue with task text and explicit feature bindings.
  }

  return { changed, added, deleted, renamed };
}

function getGitRevision(projectRoot) {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
}

function hashFile(file) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  return hashContent(fs.readFileSync(file));
}

function hashContent(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0)) return [];
  return [value];
}

function uniqueStrings(values) {
  return [...new Set(values.map((value) => String(value).trim()).filter(Boolean))];
}

function tokenize(value = "") {
  return new Set(normalizeText(value).split(" ").filter((token) => token.length >= 2));
}

function normalizeText(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function normalizePath(value) {
  return String(value).split(path.sep).join("/").replace(/^\.\//, "");
}

function relativePath(root, file) {
  return normalizePath(path.relative(root, file));
}

function isInsideProject(projectRoot, candidate) {
  const relative = path.relative(projectRoot, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

module.exports = {
  buildSourceIndex,
  checkContextPath,
  createFeatureCapsule,
  expandContext,
  findProjectRoot,
  loadFeatureCapsules,
  maintainFeature,
  parseFrontmatter,
  resolveContext,
  validateContext,
};
