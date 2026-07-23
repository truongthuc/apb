# Context Routing

APB context routing connects a natural-language task to the smallest practical set of feature knowledge, source entry points, implementation files, local dependencies, and tests.

## Feature Capsules

Feature capsules live under `.agent/features/` and use YAML frontmatter. The supported routing fields are:

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
depends_on:
  - feature.identity
---
```

`entrypoints` are required reading. `paths` define the discoverable feature boundary and are initially routed as metadata-level reference context. `tests` are conditional validation context. `knowledge` values are required notes; `references` are related documents that remain metadata-only. Both may use repository-relative paths or note IDs declared in frontmatter elsewhere under `.agent/`. Append `#heading-anchor` to route an agent directly to a required section instead of the whole note.

Optional `source.symbols` bindings use `path#symbol` or an unqualified exact symbol name. They route directly to indexed line locations and are validated against the current source index.

The resolver follows the transitive closure of `related` frontmatter and relative Markdown links from required knowledge notes with cycle detection. Linked notes remain reference metadata until the task provides a reason to read them, and compact output prevents the discovered graph from being loaded eagerly.

## Automatic Agent Lifecycle

For every non-trivial task, an agent should run the equivalent of:

```text
apb-context resolve "<owner request>" --json
```

The project owner should not need to issue this command. Agents use the result to read required items first, expand conditional items only when justified, and avoid reading reference files eagerly.

When the requested feature has no active capsule, the agent performs one targeted discovery and initializes it internally:

```text
apb-context init-feature --id <id> --summary <summary> --trigger <phrase> --entrypoint <file> --source-path <pattern> --test-path <pattern> --json
```

The operation requires a confirmed existing entry point and refuses to overwrite a capsule. The agent then resolves the original request again; the project owner does not run this command.

JSON output is compact by default: it caps symbol lists and returns only the highest-ranked reference files while reporting the total reference count. The full disposable manifest remains available at `.agent/runtime/context-routing/active-context.json`; `--full` is reserved for diagnostics when the complete payload is justified.

Normal output also omits unchanged-file lists, reports their counts, and caps large changed-file lists. Source records include symbol line locations so agents can open targeted regions instead of whole files.

After implementation or when the working tree changes materially, the agent resolves the task again. APB preserves a baseline for each feature and a separate overlay for each feature/task pair. Switching to another feature therefore does not discard the previous feature's incremental state.

The resolver reports two deltas:

- `delta`: changes relative to the last resolution of the selected feature.
- `taskDelta`: changes relative to the previous resolution of the same feature/task pair.

Source discovery follows local imports and reverse callers transitively from feature entry points. Direct dependencies and callers are conditional context; deeper relationships remain reference metadata until the task activates them.

## Context Levels

- `required`: knowledge and source entry points that must be read before planning or implementation.
- `conditional`: direct local dependencies and tests that are read when the proposed change activates them.
- `reference`: files inside the declared feature boundary. Their metadata is available, but their content should not be read without a task-specific reason.

## Read Guard And Task Expansion

Before reading a path absent from compact routing output, agents check its active classification:

```text
apb-context check --path <file> --json
```

An unlisted path must not be read until the agent has concrete evidence. The agent records that evidence in the current task overlay:

```text
apb-context expand --path <file> --reason <evidence> --json
```

Expansion does not silently change the durable feature baseline. An unbound source expansion creates a maintenance proposal that can be promoted only after validation.

## Runtime State

Disposable state is written beneath `.agent/runtime/context-routing/`:

- `source-index.json` caches file hashes, symbols, and imports.
- `features/<feature-id>.json` preserves the latest baseline for each feature.
- `tasks/<feature-id>-<task-id>.json` preserves each active task overlay.
- `active-context.json` points to the most recently resolved context for compatibility and maintenance.

This directory is not durable knowledge and should remain ignored by version control.

The source index first compares file size and modification time. Unchanged files are reused without reading their contents; changed files receive a new content hash, symbol/line extraction, and import analysis.

## Self-Maintenance

Routing emits maintenance proposals when it finds stale entry points or dependencies outside the declared feature boundary. Each proposal contains evidence and a stable ID.

- Exact Git renames or added files with the exact previous content hash are `safe` repairs.
- Newly discovered dependencies and stale removals require agent validation.

After validating code and tests, the agent runs maintenance internally:

```text
apb-context maintain --feature <feature-id> --apply-safe --json
apb-context maintain --feature <feature-id> --accept <proposal-id> --json
```

Accepted maintenance updates the feature capsule, increments `revision`, records `verified_at_state`, and immediately refreshes the feature context. Project owners do not run these commands during normal work.

## Limitations

The built-in indexer uses portable heuristics rather than language-specific ASTs. It recognizes common import forms across JavaScript/TypeScript, Python, Ruby, PHP, Java/C#, and Go, but may not resolve reflection, generated code, dependency injection, event names, external services, or other runtime-only relationships. Feature capsules must bind critical knowledge and entry points explicitly.

Every manifest exposes a `coverage` section. Static local-import closure may be complete for the relationships the indexer can resolve, while runtime closure remains explicitly `unverified`; agents must not present the latter as proven completeness.

## Related Knowledge

- [Incremental Context Routing Plan](../planning/11-incremental-context-routing.md)
- [Agent-Native Context Routing Decision](../architecture-decisions/2026-07-23-use-agent-native-context-routing.md)
