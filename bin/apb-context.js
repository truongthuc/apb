#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const runtimeModule = fs.existsSync(path.join(__dirname, "index.js"))
  ? path.join(__dirname, "index.js")
  : path.join(__dirname, "..", "lib", "context-routing");
const {
  buildSourceIndex,
  checkContextPath,
  createFeatureCapsule,
  expandContext,
  findProjectRoot,
  maintainFeature,
  resolveContext,
  validateContext,
} = require(runtimeModule);

const parsed = parseArguments(process.argv.slice(2));
const projectRoot = findProjectRoot(parsed.project || process.cwd());

try {
  if (parsed.command === "index") {
    const result = buildSourceIndex(projectRoot, { force: parsed.refresh });
    printResult({ status: "indexed", projectRoot, ...result.stats }, parsed.json, parsed.full);
  } else if (parsed.command === "validate") {
    const result = validateContext(projectRoot);
    printResult(result, parsed.json, parsed.full);
    if (result.status === "invalid") process.exitCode = 1;
  } else if (parsed.command === "maintain") {
    const result = maintainFeature(projectRoot, {
      feature: parsed.feature,
      applySafe: parsed.applySafe,
      accept: parsed.accept,
    });
    printResult(result, parsed.json, parsed.full);
  } else if (parsed.command === "check") {
    printResult(checkContextPath(projectRoot, parsed.path), parsed.json, parsed.full);
  } else if (parsed.command === "expand") {
    printResult(expandContext(projectRoot, {
      path: parsed.path,
      reason: parsed.reason,
      level: parsed.level,
    }), parsed.json, parsed.full);
  } else if (parsed.command === "init-feature") {
    printResult(createFeatureCapsule(projectRoot, {
      id: parsed.id,
      summary: parsed.summary,
      triggers: parsed.triggers,
      knowledge: parsed.knowledge,
      references: parsed.references,
      entrypoints: parsed.entrypoints,
      symbols: parsed.symbols,
      paths: parsed.sourcePaths,
      tests: parsed.testPaths,
      dependsOn: parsed.dependsOn,
    }), parsed.json, parsed.full);
  } else {
    if (!parsed.task) {
      printUsage();
      process.exitCode = 1;
    } else {
      const result = resolveContext(projectRoot, parsed.task, {
        feature: parsed.feature,
        refresh: parsed.refresh,
        noWrite: parsed.noWrite,
      });
      printResult(result, parsed.json, parsed.full);
    }
  }
} catch (error) {
  console.error(`Context routing failed: ${error.message}`);
  process.exitCode = 1;
}

function parseArguments(argumentsList) {
  const commands = new Set(["resolve", "index", "validate", "maintain", "check", "expand", "init-feature"]);
  const result = {
    command: commands.has(argumentsList[0]) ? argumentsList.shift() : "resolve",
    json: false,
    refresh: false,
    noWrite: false,
    full: false,
    applySafe: false,
    accept: [],
    path: null,
    reason: null,
    level: null,
    id: null,
    summary: null,
    triggers: [],
    knowledge: [],
    references: [],
    entrypoints: [],
    symbols: [],
    sourcePaths: [],
    testPaths: [],
    dependsOn: [],
  };
  const taskParts = [];

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--json") result.json = true;
    else if (argument === "--full") result.full = true;
    else if (argument === "--refresh") result.refresh = true;
    else if (argument === "--apply-safe") result.applySafe = true;
    else if (argument === "--accept") result.accept.push(argumentsList[++index]);
    else if (argument === "--path") result.path = argumentsList[++index];
    else if (argument === "--reason") result.reason = argumentsList[++index];
    else if (argument === "--level") result.level = argumentsList[++index];
    else if (argument === "--id") result.id = argumentsList[++index];
    else if (argument === "--summary") result.summary = argumentsList[++index];
    else if (argument === "--trigger") result.triggers.push(argumentsList[++index]);
    else if (argument === "--knowledge") result.knowledge.push(argumentsList[++index]);
    else if (argument === "--reference") result.references.push(argumentsList[++index]);
    else if (argument === "--entrypoint") result.entrypoints.push(argumentsList[++index]);
    else if (argument === "--symbol") result.symbols.push(argumentsList[++index]);
    else if (argument === "--source-path") result.sourcePaths.push(argumentsList[++index]);
    else if (argument === "--test-path") result.testPaths.push(argumentsList[++index]);
    else if (argument === "--depends-on") result.dependsOn.push(argumentsList[++index]);
    else if (argument === "--no-write") result.noWrite = true;
    else if (argument === "--feature") result.feature = argumentsList[++index];
    else if (argument === "--project") result.project = path.resolve(argumentsList[++index]);
    else taskParts.push(argument);
  }
  result.task = taskParts.join(" ").trim();
  return result;
}

function printResult(result, json, full) {
  if (json) {
    console.log(JSON.stringify(full ? result : compactResult(result), null, 2));
    return;
  }

  if (result.status === "indexed") {
    console.log(`Indexed ${result.total} source files (${result.indexed} refreshed, ${result.reused} reused).`);
    return;
  }
  if ((result.status === "valid" || result.status === "invalid") && Array.isArray(result.errors)) {
    console.log(`Context routing: ${result.status}. ${result.features} feature capsule(s).`);
    for (const error of result.errors) console.log(`ERROR: ${error}`);
    for (const warning of result.warnings) console.log(`WARNING: ${warning}`);
    return;
  }
  if (["allowed", "conditional", "reference", "unlisted", "expanded"].includes(result.status)) {
    console.log(result.message || `${result.path}: ${result.status}${result.reason ? ` — ${result.reason}` : ""}`);
    return;
  }
  if (result.status === "created") {
    console.log(`${result.message} ${result.capsule}`);
    return;
  }
  if (result.status === "invalid") {
    console.log(result.message);
    return;
  }
  if (result.status === "updated" || result.status === "no-change") {
    console.log(result.message || `Feature capsule ${result.feature} updated to revision ${result.revision}.`);
    for (const proposal of result.applied || []) console.log(`Applied: ${proposal.type} (${proposal.id})`);
    for (const proposal of result.proposals || []) console.log(`Pending: ${proposal.type} (${proposal.id})`);
    return;
  }
  if (result.status === "unresolved") {
    console.log(result.message);
    for (const candidate of result.featureCandidates || []) {
      console.log(`Candidate: ${candidate.id} (score ${candidate.score})`);
    }
    return;
  }

  console.log(`Feature: ${result.feature.id} (confidence ${result.feature.confidence})`);
  printRoutes("Read first", result.context.required);
  printRoutes("Read when activated", result.context.conditional);
  printRoutes("Reference only", result.context.reference);
  const changed = [...result.delta.added, ...result.delta.modified, ...result.delta.removed];
  if (changed.length > 0) console.log(`\nDelta: ${changed.length} routed file(s) changed since the previous context.`);
  for (const warning of result.warnings) console.log(`WARNING: ${warning}`);
}

function printRoutes(label, routes) {
  if (!routes || routes.length === 0) return;
  console.log(`\n${label}:`);
  for (const route of routes) console.log(`- ${route.path} — ${route.reason}`);
}

function printUsage() {
  console.error("Usage: apb-context [resolve] <task> [--feature <id>] [--json] [--full] [--refresh] [--project <path>]");
  console.error("       apb-context index [--refresh] [--json] [--project <path>]");
  console.error("       apb-context validate [--json] [--project <path>]");
  console.error("       apb-context maintain [--feature <id>] [--apply-safe] [--accept <proposal-id>] [--json]");
  console.error("       apb-context check --path <file> [--json]");
  console.error("       apb-context expand --path <file> --reason <evidence> [--level <level>] [--json]");
  console.error("       apb-context init-feature --id <id> --summary <text> --entrypoint <file> [routing bindings] [--json]");
}

function compactResult(result) {
  if (!result.context) return result;
  const referenceLimit = 20;
  return {
    ...result,
    context: {
      required: result.context.required.map(compactRoute),
      conditional: result.context.conditional.map(compactRoute),
      reference: result.context.reference.slice(0, referenceLimit).map(compactRoute),
      referenceTotal: result.context.reference.length,
      referenceTruncated: result.context.reference.length > referenceLimit,
    },
    delta: compactDelta(result.delta),
    taskDelta: compactDelta(result.taskDelta),
    fileHashes: undefined,
  };
}

function compactDelta(delta) {
  if (!delta) return delta;
  const changedLimit = 50;
  return {
    added: delta.added.slice(0, changedLimit),
    addedCount: delta.added.length,
    modified: delta.modified.slice(0, changedLimit),
    modifiedCount: delta.modified.length,
    removed: delta.removed.slice(0, changedLimit),
    removedCount: delta.removed.length,
    unchangedCount: delta.unchanged.length,
    changedTruncated: delta.added.length > changedLimit
      || delta.modified.length > changedLimit
      || delta.removed.length > changedLimit,
  };
}

function compactRoute(route) {
  const symbolLimit = 12;
  if (route.targetSymbols && route.targetSymbols.length > 0) {
    return {
      ...route,
      symbols: undefined,
      symbolLocations: undefined,
      targetSymbols: route.targetSymbols.slice(0, symbolLimit),
      targetSymbolCount: route.targetSymbols.length,
      symbolsTruncated: route.targetSymbols.length > symbolLimit,
    };
  }
  if (route.symbolLocations && route.symbolLocations.length > 0) {
    return {
      ...route,
      symbols: undefined,
      symbolLocations: route.symbolLocations.slice(0, symbolLimit),
      symbolCount: route.symbolLocations.length,
      symbolsTruncated: route.symbolLocations.length > symbolLimit,
    };
  }
  if (!route.symbols || route.symbols.length <= symbolLimit) return route;
  return {
    ...route,
    symbols: route.symbols.slice(0, symbolLimit),
    symbolCount: route.symbols.length,
    symbolsTruncated: true,
  };
}
