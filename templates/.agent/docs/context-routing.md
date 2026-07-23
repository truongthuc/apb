# Context Routing

Context routing connects a natural-language task to feature knowledge, source entry points, implementation boundaries, dependencies, and tests without eagerly reading every related file.

## Normal Operation

Project owners do not need to run routing commands. For non-trivial work, the agent automatically runs:

```text
node .agent/tools/context-routing/apb-context.js resolve "<owner request>" --json
```

If the requested feature has no active capsule, the agent performs one targeted discovery and creates it internally with `init-feature`, providing the confirmed purpose, triggers, knowledge, source entry point, boundary, and tests. The command refuses missing entry points and existing capsules. The agent then resolves the original request again.

The resolver returns three context levels:

- `required`: feature knowledge and source entry points to read first.
- `conditional`: dependencies and tests to read when the proposed change activates them.
- `reference`: feature-bound source files that remain discoverable at metadata level.

The agent resolves the task again after material repository changes. APB maintains an independent baseline per feature and an overlay per feature/task pair, so switching features does not discard incremental history. It reports both a feature delta and a task delta.

Source discovery follows local imports and reverse callers transitively from entry points. Direct relationships are conditional context; deeper relationships remain reference metadata until needed.

JSON output is compact by default. It caps symbol lists and returns only the highest-ranked reference files while reporting the complete reference count. The full disposable route remains in `.agent/runtime/context-routing/active-context.json`; agents should request `--full` only for diagnostics that justify the additional context.

Compact output reports unchanged-file counts instead of listing them, caps large delta lists, and includes symbol line locations for targeted source reading.

## Feature Capsule Schema

Feature capsules live under `.agent/features/`. Copy `features/template.md` and provide stable bindings:

```yaml
---
id: feature.authentication
type: feature
status: active
summary: Authentication and session lifecycle.
revision: 1
verified_at_commit: ""
verified_at_state: ""
triggers:
  - authentication
  - login
  - refresh token
knowledge:
  - .agent/business-rules.md
references:
  - README.md
source:
  entrypoints:
    - src/modules/authentication/session-service.ts
  symbols:
    - src/modules/authentication/session-service.ts#refreshSession
  paths:
    - src/modules/authentication/**
  tests:
    - tests/authentication/**
depends_on: []
---
```

Critical knowledge and source entry points should use explicit bindings. `references` identify related documents without making them required reading. A knowledge binding may append `#heading-anchor` for targeted section reading. Broad path bindings define the searchable feature boundary but do not instruct the agent to read every matched file.

Optional `source.symbols` values use `path#symbol` or an unqualified exact symbol name to route directly to validated line locations.

The resolver follows the transitive closure of `related` frontmatter and relative Markdown links from required knowledge notes with cycle detection. Linked notes remain reference metadata until the task justifies reading them, while compact output prevents eager loading of the discovered graph.

## Runtime State

APB writes disposable routing state under `.agent/runtime/context-routing/`. The source index stores file hashes, discovered symbols, and common import specifiers. `features/` stores per-feature baselines, `tasks/` stores task overlays, and `active-context.json` identifies the most recent route.

Runtime state is a cache, not durable knowledge, and must remain ignored by version control.

Unchanged source files are reused through size and modification-time metadata without reading their contents. Changed files receive a new content hash, symbol/line extraction, and import analysis.

## Self-Maintenance

The resolver proposes repairs for stale entry points and newly discovered dependencies outside the declared feature boundary. Agents automatically apply exact safe rename repairs after validation. Other proposals require evidence from code, tests, or an approved design before the agent accepts them.

```text
node .agent/tools/context-routing/apb-context.js maintain --feature <feature-id> --apply-safe --json
node .agent/tools/context-routing/apb-context.js maintain --feature <feature-id> --accept <proposal-id> --json
```

Accepted proposals update the capsule, increment its revision, record the verified context fingerprint, and refresh routing. These are internal agent operations, not project-owner commands.

## Validation And Diagnostics

Agents may use these internal commands when needed:

```text
node .agent/tools/context-routing/apb-context.js validate --json
node .agent/tools/context-routing/apb-context.js index --refresh --json
```

The built-in source index is intentionally lightweight and framework-neutral. It recognizes common imports across JavaScript/TypeScript, Python, Ruby, PHP, Java/C#, and Go, but does not guarantee discovery of reflection, dependency injection, generated code, runtime events, or external contracts. Record critical relationships explicitly in feature capsules.

## Read Guard And Task Expansion

Agents check files absent from compact routing output before reading them:

```text
node .agent/tools/context-routing/apb-context.js check --path <file> --json
```

If a file is unlisted, the agent records concrete evidence before expanding the task overlay:

```text
node .agent/tools/context-routing/apb-context.js expand --path <file> --reason <evidence> --json
```

Expansion remains task-local and creates a maintenance proposal for unbound source. Durable promotion requires validation. The manifest's `coverage` section distinguishes resolved static closure from explicitly unverified runtime relationships.
