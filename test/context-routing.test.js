const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { execFileSync } = require("node:child_process");

const {
  buildSourceIndex,
  checkContextPath,
  createFeatureCapsule,
  expandContext,
  maintainFeature,
  parseFrontmatter,
  resolveContext,
  validateContext,
} = require("../lib/context-routing");

test("parses nested feature capsule frontmatter", () => {
  const metadata = parseFrontmatter(`---
id: feature.authentication
type: feature
status: active
revision: 2
triggers:
  - login
  - refresh token
source:
  entrypoints:
    - src/auth/session-service.js
  paths:
    - src/auth/**
---
# Authentication
`);

  assert.equal(metadata.id, "feature.authentication");
  assert.equal(metadata.revision, 2);
  assert.deepEqual(metadata.triggers, ["login", "refresh token"]);
  assert.deepEqual(metadata.source.entrypoints, ["src/auth/session-service.js"]);
});

test("routes a natural-language task to knowledge, source, dependencies, and tests incrementally", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));

  const first = resolveContext(projectRoot, "change refresh token expiration");
  assert.equal(first.feature.id, "feature.authentication");
  assert.equal(first.status, "ready");
  assert.ok(first.context.required.some((item) => item.path === ".agent/business-rules.md"));
  assert.equal(
    first.context.required.find((item) => item.path === ".agent/business-rules.md").anchor,
    "session-expiry",
  );
  assert.ok(first.context.reference.some((item) => item.path === ".agent/architecture-decisions/token-storage.md"));
  assert.ok(first.context.required.some((item) => item.path === "src/auth/session-service.js"));
  assert.deepEqual(
    first.context.required.find((item) => item.path === "src/auth/session-service.js")
      .symbolLocations.find((item) => item.name === "refreshSession"),
    { name: "refreshSession", line: 2 },
  );
  assert.deepEqual(
    first.context.required.find((item) => item.path === "src/auth/session-service.js").targetSymbols,
    [{ name: "refreshSession", line: 2 }],
  );
  assert.ok(first.context.conditional.some((item) => item.path === "src/auth/token-store.js"));
  assert.ok(first.context.conditional.some((item) => item.path === "test/auth/session-service.test.js"));
  assert.ok(first.delta.added.includes("src/auth/session-service.js"));

  const second = resolveContext(projectRoot, "change refresh token expiration");
  assert.ok(second.sourceIndex.reused > 0);
  assert.ok(second.delta.unchanged.includes("src/auth/session-service.js"));

  fs.appendFileSync(path.join(projectRoot, "src/auth/session-service.js"), "\nexport const revoke = () => true;\n");
  const third = resolveContext(projectRoot, "change refresh token expiration");
  assert.ok(third.delta.modified.includes("src/auth/session-service.js"));
});

test("validates missing required entrypoint bindings", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  const featureFile = path.join(projectRoot, ".agent/features/authentication.md");
  const content = fs.readFileSync(featureFile, "utf8").replace(
    "src/auth/session-service.js",
    "src/auth/missing-service.js",
  );
  fs.writeFileSync(featureFile, content);

  const result = validateContext(projectRoot);
  assert.equal(result.status, "invalid");
  assert.ok(result.errors.some((error) => error.includes("missing-service.js")));
});

test("validates duplicate knowledge IDs and broken Markdown links", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  writeFile(projectRoot, ".agent/rules/duplicate.md", `---
id: rule.session-expiry
type: business-rule
---
# Duplicate

[Missing](missing.md)
`);

  const result = validateContext(projectRoot);
  assert.equal(result.status, "invalid");
  assert.ok(result.errors.some((error) => error.includes("Duplicate knowledge ID")));
  assert.ok(result.errors.some((error) => error.includes("broken Markdown link")));
});

test("source indexing reuses unchanged records", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));

  const first = buildSourceIndex(projectRoot);
  const second = buildSourceIndex(projectRoot);
  assert.ok(first.stats.indexed > 0);
  assert.equal(second.stats.indexed, 0);
  assert.equal(second.stats.reused, second.stats.total);
});

test("preserves an incremental baseline for each feature while switching tasks", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  writeFile(projectRoot, ".agent/features/payment.md", `---
id: feature.payment
type: feature
status: active
summary: Payment capture and settlement.
revision: 1
triggers:
  - payment
  - settlement
knowledge: []
source:
  entrypoints:
    - src/payment/payment-service.js
  paths:
    - src/payment/**
  tests: []
depends_on:
  - feature.authentication
---
# Payment
`);
  writeFile(projectRoot, "src/payment/payment-service.js", "export function capturePayment() {}\n");

  const authentication = resolveContext(projectRoot, "change refresh token expiration");
  resolveContext(projectRoot, "change payment settlement");
  fs.appendFileSync(path.join(projectRoot, "src/auth/session-service.js"), "\nexport const revoke = () => true;\n");
  const resumed = resolveContext(projectRoot, "change refresh token expiration");

  assert.ok(authentication.featureStatePath.includes("features/feature.authentication.json"));
  assert.ok(authentication.affectedFeatures.some((item) => item.id === "feature.payment" && item.direction === "downstream"));
  assert.ok(fs.existsSync(path.join(projectRoot, authentication.featureStatePath)));
  assert.ok(fs.existsSync(path.join(projectRoot, authentication.manifestPath)));
  assert.ok(resumed.delta.modified.includes("src/auth/session-service.js"));
  assert.ok(!resumed.delta.added.includes(".agent/business-rules.md"));
});

test("discovers transitive dependencies and reverse callers without eager reading", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  fs.writeFileSync(path.join(projectRoot, "src/auth/token-store.js"), `import { decrypt } from "../crypto/crypto-adapter.js";
export function loadToken() { return decrypt(); }
`);
  writeFile(projectRoot, "src/crypto/crypto-adapter.js", "export function decrypt() { return null; }\n");
  writeFile(projectRoot, "src/app/auth-bootstrap.js", `import { refreshSession } from "../auth/session-service.js";
export function bootstrapAuth() { return refreshSession(); }
`);
  writeFile(projectRoot, "src/app/main.js", `import { bootstrapAuth } from "./auth-bootstrap.js";
export function start() { return bootstrapAuth(); }
`);

  const result = resolveContext(projectRoot, "change refresh token expiration");
  assert.ok(result.context.conditional.some((item) => item.path === "src/auth/token-store.js"));
  assert.ok(result.context.reference.some((item) => item.path === "src/crypto/crypto-adapter.js"));
  assert.ok(result.context.conditional.some((item) => item.path === "src/app/auth-bootstrap.js"));
  assert.ok(result.context.reference.some((item) => item.path === "src/app/main.js"));
});

test("promotes a validated discovered dependency into the feature capsule", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  const capsuleFile = path.join(projectRoot, ".agent/features/authentication.md");
  fs.writeFileSync(capsuleFile, fs.readFileSync(capsuleFile, "utf8").replace(
    "src/auth/**",
    "src/auth/session-service.js",
  ));

  const routed = resolveContext(projectRoot, "change refresh token expiration");
  const proposal = routed.maintenance.proposals.find((item) => item.type === "add-source-binding");
  assert.ok(proposal);
  assert.equal(proposal.to, "src/auth/token-store.js");

  const maintained = maintainFeature(projectRoot, {
    feature: "authentication",
    accept: [proposal.id],
  });
  const metadata = parseFrontmatter(fs.readFileSync(capsuleFile, "utf8"));
  assert.equal(maintained.status, "updated");
  assert.equal(metadata.revision, 2);
  assert.ok(metadata.source.paths.includes("src/auth/token-store.js"));
  assert.ok(metadata.verified_at_state);
});

test("repairs an exact entrypoint rename automatically after a feature baseline exists", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  initializeGitRepository(projectRoot);
  resolveContext(projectRoot, "change refresh token expiration");

  fs.renameSync(
    path.join(projectRoot, "src/auth/session-service.js"),
    path.join(projectRoot, "src/auth/session-manager.js"),
  );
  execFileSync("git", ["add", "-A"], { cwd: projectRoot });
  const routed = resolveContext(projectRoot, "change refresh token expiration");
  const rename = routed.maintenance.proposals.find((item) => item.type === "replace-entrypoint");
  assert.ok(rename);
  assert.equal(rename.safe, true);

  const maintained = maintainFeature(projectRoot, { feature: "authentication", applySafe: true });
  const metadata = parseFrontmatter(fs.readFileSync(
    path.join(projectRoot, ".agent/features/authentication.md"),
    "utf8",
  ));
  assert.equal(maintained.status, "updated");
  assert.ok(metadata.source.entrypoints.includes("src/auth/session-manager.js"));
  assert.ok(!metadata.source.entrypoints.includes("src/auth/session-service.js"));
});

test("bootstraps a self-contained routing runtime for agents", (context) => {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), "apb-generated-routing-"));
  const projectRoot = path.join(temporaryRoot, "generated");
  context.after(() => fs.rmSync(temporaryRoot, { recursive: true, force: true }));

  execFileSync(process.execPath, [path.join(__dirname, "..", "bin", "create-apb.js"), projectRoot]);
  const runtime = path.join(projectRoot, ".agent/tools/context-routing/apb-context.js");
  const engine = path.join(projectRoot, ".agent/tools/context-routing/index.js");
  assert.ok(fs.existsSync(runtime));
  assert.ok(fs.existsSync(engine));
  assert.equal(fs.existsSync(path.join(projectRoot, "src")), false);
  assert.equal(fs.existsSync(path.join(projectRoot, "tests")), false);
  assert.ok(fs.readFileSync(path.join(projectRoot, ".gitignore"), "utf8").split(/\r?\n/).includes(".agent/runtime/"));

  const validation = JSON.parse(execFileSync(process.execPath, [runtime, "validate", "--json"], {
    cwd: projectRoot,
    encoding: "utf8",
  }));
  assert.equal(validation.status, "valid");
  writeFile(projectRoot, "src/modules/example-module/index.js", "export function runExample() {}\n");
  const created = JSON.parse(execFileSync(process.execPath, [
    runtime,
    "init-feature",
    "--id",
    "example",
    "--summary",
    "Runs the generated example module behavior.",
    "--trigger",
    "example",
    "--entrypoint",
    "src/modules/example-module/index.js",
    "--source-path",
    "src/modules/example-module/**",
    "--json",
  ], { cwd: projectRoot, encoding: "utf8" }));
  const routed = JSON.parse(execFileSync(process.execPath, [
    runtime,
    "resolve",
    "change example behavior",
    "--json",
  ], { cwd: projectRoot, encoding: "utf8" }));
  assert.equal(created.status, "created");
  assert.equal(routed.feature.id, "feature.example");
});

test("infers a feature from changed source when the task wording is vague", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  initializeGitRepository(projectRoot);
  fs.appendFileSync(path.join(projectRoot, "src/auth/token-store.js"), "\nexport const clearToken = () => {};\n");

  const result = resolveContext(projectRoot, "adjust the current behavior");
  assert.equal(result.feature.id, "feature.authentication");
  assert.ok(result.feature.confidence >= 0.65);
});

test("gates unlisted reads and records evidence-based task expansion", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  writeFile(projectRoot, "src/ops/audit-log.js", "export function writeAuditLog() {}\n");
  const routed = resolveContext(projectRoot, "change refresh token expiration");

  const before = checkContextPath(projectRoot, "src/ops/audit-log.js");
  assert.equal(before.status, "unlisted");
  const expanded = expandContext(projectRoot, {
    path: "src/ops/audit-log.js",
    reason: "A failing authentication test requires audit logging",
  });
  const after = checkContextPath(projectRoot, "src/ops/audit-log.js");
  assert.equal(expanded.status, "expanded");
  assert.equal(after.status, "conditional");

  const taskState = JSON.parse(fs.readFileSync(path.join(projectRoot, routed.manifestPath), "utf8"));
  const featureState = JSON.parse(fs.readFileSync(path.join(projectRoot, routed.featureStatePath), "utf8"));
  assert.ok(taskState.expansions.some((item) => item.path === "src/ops/audit-log.js"));
  assert.ok(!featureState.context.conditional.some((item) => item.path === "src/ops/audit-log.js"));
  assert.ok(expanded.maintenance.proposals.some((item) => item.to === "src/ops/audit-log.js"));

  const rerouted = resolveContext(projectRoot, "change refresh token expiration");
  assert.ok(rerouted.context.conditional.some((item) => item.path === "src/ops/audit-log.js"));
  const proposal = rerouted.maintenance.proposals.find((item) => item.to === "src/ops/audit-log.js");
  const maintained = maintainFeature(projectRoot, { feature: "authentication", accept: [proposal.id] });
  const metadata = parseFrontmatter(fs.readFileSync(
    path.join(projectRoot, ".agent/features/authentication.md"),
    "utf8",
  ));
  assert.equal(maintained.status, "updated");
  assert.ok(metadata.source.paths.includes("src/ops/audit-log.js"));
});

test("resolves Python local dependencies and callers", (context) => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "apb-python-routing-"));
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  writeFile(projectRoot, ".agent/features/authentication.md", `---
id: feature.authentication
type: feature
status: active
summary: Authentication behavior.
revision: 1
triggers:
  - authentication
knowledge: []
source:
  entrypoints:
    - src/auth/service.py
  paths:
    - src/auth/**
  tests: []
depends_on: []
---
# Authentication
`);
  writeFile(projectRoot, "src/auth/service.py", "from .store import load_token\n");
  writeFile(projectRoot, "src/auth/store.py", "from ..crypto.adapter import decrypt\n");
  writeFile(projectRoot, "src/crypto/adapter.py", "def decrypt():\n    return None\n");
  writeFile(projectRoot, "src/app/main.py", "from auth.service import authenticate\n");

  const result = resolveContext(projectRoot, "change authentication");
  assert.ok(result.context.conditional.some((item) => item.path === "src/auth/store.py"));
  assert.ok(result.context.reference.some((item) => item.path === "src/crypto/adapter.py"));
  assert.ok(result.context.conditional.some((item) => item.path === "src/app/main.py"));
});

test("keeps normal agent output compact while preserving the complete discovered graph on disk", (context) => {
  const projectRoot = createFixtureProject();
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  const businessRules = path.join(projectRoot, ".agent/business-rules.md");
  for (let index = 0; index < 25; index += 1) {
    const note = `.agent/concepts/context-${index}.md`;
    writeFile(projectRoot, note, `# Context ${index}\n`);
    fs.appendFileSync(businessRules, `\n[Context ${index}](concepts/context-${index}.md)\n`);
  }

  const cli = path.join(__dirname, "..", "bin", "apb-context.js");
  const compact = JSON.parse(execFileSync(process.execPath, [
    cli,
    "resolve",
    "change refresh token expiration",
    "--project",
    projectRoot,
    "--json",
  ], { encoding: "utf8" }));
  const full = JSON.parse(fs.readFileSync(path.join(projectRoot, compact.manifestPath), "utf8"));

  assert.equal(compact.context.reference.length, 20);
  assert.equal(compact.context.referenceTruncated, true);
  assert.ok(compact.context.referenceTotal >= 25);
  assert.equal(compact.fileHashes, undefined);
  assert.equal(compact.delta.unchanged, undefined);
  assert.equal(typeof compact.delta.unchangedCount, "number");
  const compactEntrypoint = compact.context.required.find((item) => item.path === "src/auth/session-service.js");
  assert.equal(compactEntrypoint.symbols, undefined);
  assert.equal(compactEntrypoint.symbolLocations, undefined);
  assert.ok(compactEntrypoint.targetSymbols.some((item) => item.name === "refreshSession"));
  assert.ok(full.context.reference.length >= 25);
  assert.ok(full.fileHashes["src/auth/session-service.js"]);
});

test("creates the first active feature capsule after targeted discovery", (context) => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "apb-first-feature-"));
  context.after(() => fs.rmSync(projectRoot, { recursive: true, force: true }));
  writeFile(projectRoot, ".agent/project-context.md", "# Project Context\n");
  writeFile(projectRoot, "src/audit/audit-service.js", "export function writeAudit() {}\n");

  const created = createFeatureCapsule(projectRoot, {
    id: "audit-log",
    summary: "Records durable security and business audit events.",
    triggers: ["audit", "audit log"],
    knowledge: [".agent/project-context.md"],
    entrypoints: ["src/audit/audit-service.js"],
    paths: ["src/audit/**"],
  });
  const routed = resolveContext(projectRoot, "add an audit log event");

  assert.equal(created.status, "created");
  assert.equal(routed.feature.id, "feature.audit-log");
  assert.ok(routed.context.required.some((item) => item.path === "src/audit/audit-service.js"));
});

function createFixtureProject() {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "apb-context-routing-"));
  writeFile(projectRoot, ".agent/business-rules.md", `---
id: rule.session-expiry
type: business-rule
status: active
---
# Session Expiry

[Token Storage Decision](architecture-decisions/token-storage.md)
`);
  writeFile(projectRoot, ".agent/architecture-decisions/token-storage.md", "# Token Storage\n");
  writeFile(projectRoot, ".agent/features/authentication.md", `---
id: feature.authentication
type: feature
status: active
summary: Authentication and session lifecycle.
revision: 1
triggers:
  - authentication
  - login
  - refresh token
knowledge:
  - rule.session-expiry#session-expiry
source:
  entrypoints:
    - src/auth/session-service.js
  symbols:
    - src/auth/session-service.js#refreshSession
  paths:
    - src/auth/**
  tests:
    - test/auth/**
depends_on: []
---
# Authentication
`);
  writeFile(projectRoot, "src/auth/session-service.js", `import { loadToken } from "./token-store.js";
export function refreshSession() {
  return loadToken();
}
`);
  writeFile(projectRoot, "src/auth/token-store.js", `export function loadToken() {
  return null;
}
`);
  writeFile(projectRoot, "test/auth/session-service.test.js", `const test = require("node:test");
test("session", () => {});
`);
  return projectRoot;
}

function writeFile(projectRoot, relative, content) {
  const file = path.join(projectRoot, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function initializeGitRepository(projectRoot) {
  execFileSync("git", ["init", "-q"], { cwd: projectRoot });
  execFileSync("git", ["config", "user.email", "apb-test@example.com"], { cwd: projectRoot });
  execFileSync("git", ["config", "user.name", "APB Test"], { cwd: projectRoot });
  execFileSync("git", ["add", "-A"], { cwd: projectRoot });
  execFileSync("git", ["commit", "-qm", "fixture"], { cwd: projectRoot });
}
