# Context Routing Completion Audit

## Objective

Prove that APB can automatically route an agent's natural-language task to a minimal but complete incremental feature context, covering project knowledge and source code without requiring routine project-owner commands, and maintain that context as the feature evolves.

## Requirement Evidence

| Requirement | Evidence | Result |
|---|---|---|
| No routine owner commands | Generated `.agent/AGENTS.md` requires agents to invoke the vendored runtime internally. Packaged-project validation proved the runtime works after extraction without a global install. | Passed |
| Automatic feature recognition | Ranking combines task phrases, feature triggers, changed bound files, and active-feature continuity. A test selects Authentication from a vague task using only a changed bound source file. | Passed |
| First-feature lifecycle | `init-feature` requires a confirmed existing entry point, refuses overwrites, creates an active capsule, and makes the original request immediately routable. Source and vendored-CLI paths are tested. | Passed |
| No eager over-reading | Routes are split into required, conditional, and reference levels. Compact output caps references and symbols, omits duplicate symbol names, targets symbol lines, and replaces unchanged lists with counts. | Passed |
| Evidence before context expansion | `check` rejects unlisted reads; `expand` requires a concrete reason, persists it in the task overlay, and creates a maintenance proposal without silently changing durable bindings. | Passed |
| Related knowledge discovery | Required and metadata-only bindings support note IDs, paths, and heading anchors. Relative Markdown and `related` links are followed transitively with cycle detection; the full graph stays on disk. | Passed |
| Related source discovery | Explicit entry points, symbol bindings, feature-boundary paths, transitive forward imports, transitive reverse callers, tests, shared source, and declared feature dependencies are routed. | Passed for resolved static relationships |
| Cross-language local imports | The lightweight indexer recognizes common forms for JavaScript/TypeScript, Python, Ruby, PHP, Java/C#, and Go. Python forward and reverse routing is tested independently. | Passed within heuristic scope |
| Incremental feature evolution | Source records reuse unchanged size/mtime metadata without content reads. Changed files are re-hashed and re-indexed. Each feature has an independent baseline and each feature/task pair has an overlay. Feature-switching tests preserve prior deltas. | Passed |
| Self-maintaining bindings | Exact entry-point, source, and test renames can be proposed as safe repairs. Discovered or task-expanded source dependencies require validation before promotion. Accepted maintenance updates the capsule, increments revision, records a context fingerprint, and refreshes routing. | Passed |
| Staleness and integrity validation | Validation detects missing entry points, missing symbols, broken knowledge/reference bindings, unresolved feature dependencies, duplicate knowledge IDs, and broken Markdown links. | Passed |
| Self-contained generated projects | `create-apb` vendors CLI and engine files under `.agent/tools/context-routing/` and enforces `.agent/runtime/` ignore directly. A real npm tarball was extracted, generated, and validated successfully. | Passed |
| Token-conscious output | The real APB route produced a 7,283-byte compact payload versus an 18,076-byte full manifest while preserving all 15 routed files on disk; all six source-index records were reused on the repeated run. Synthetic tests prove reference truncation without graph loss. | Passed |

## Completeness Boundary

The router can prove closure for explicit bindings, linked Markdown knowledge, and local imports it resolves. It cannot statically prove runtime-only relationships such as reflection, generated code, dependency injection, runtime events, external services, or business rules that were never recorded.

This limitation is not hidden: every manifest reports `runtimeClosure: unverified` and lists known limitations. Agent rules require targeted fallback investigation and evidence-based context expansion rather than claiming unsupported completeness.

## Validation Summary

- 15 Node tests passed.
- Node syntax checks passed for all three executable/runtime files.
- `apb-context validate --json` returned `valid`, with zero errors and warnings for APB's active feature.
- Repeated real routing reused six of six source records, produced zero maintenance proposals, and reported 15 unchanged feature/task routes.
- `git diff --check` passed.
- npm tarball generation, extraction, project bootstrap, vendored-runtime validation, and runtime-ignore enforcement passed.

## Decision

The objective is achieved within the explicitly reported static-analysis boundary. APB now provides automatic, incremental, self-maintaining feature context routing without routine project-owner commands and without representing runtime-unknown relationships as proven context.

## Related Knowledge

- [Context Routing Documentation](../docs/context-routing.md)
- [Incremental Context Routing Plan](../planning/11-incremental-context-routing.md)
- [Architecture Decision](../architecture-decisions/2026-07-23-use-agent-native-context-routing.md)
- [Implementation Review](../review-history/2026-07-23-incremental-context-routing-review.md)
