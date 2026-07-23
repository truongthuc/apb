# Incremental Context Routing Review

## Review Type

Planning, design, milestone implementation, and code review.

## Decision

Approved the agent-native incremental context routing MVP.

## Reviewed Scope

- Feature capsule schema with natural-language triggers and bindings to knowledge, source entry points, feature boundaries, and tests.
- `apb-context` resolver, source index, validator, compact JSON output, and active context manifest.
- Incremental reuse through content hashes and routed-file delta reporting.
- Independent per-feature baselines and per-feature/task overlays.
- Transitive local dependency closure and direct reverse-caller discovery.
- Evidence-backed maintenance proposals, safe rename repair, validated binding promotion, and revision refresh.
- Evidence-gated task expansion and durable promotion after validation.
- Vendored generated-project runtime and automatic first-feature initialization.
- Symbol line locations, compact delta/reference output, and transitive linked-knowledge discovery.
- Common local-import routing for JavaScript/TypeScript, Python, Ruby, PHP, Java/C#, and Go.
- Automatic agent lifecycle rules for generated projects.
- Generated template documentation and runtime ignore behavior.

## Review Findings And Fixes

- Fixed feature ranking after tests exposed an incorrect collection API call.
- Promoted direct entry-point imports from reference context to conditional context.
- Excluded the feature capsule template from active feature discovery.
- Preserved the repository's existing ignore rules while adding disposable routing state.
- Moved generated runtime-ignore enforcement into `create-apb` after package audit showed npm excludes template `.gitignore` files from tarballs.
- Restricted explicit path bindings to files inside the project root.
- Added ambiguity warnings for low-confidence feature selection.
- Kept full reference discovery in the disposable manifest while compacting normal JSON output to avoid routing metadata consuming excessive context.

## Validation

- `npm test`: fifteen context-routing tests passed, including feature switching, dependency closure, source-line targeting, binding promotion, exact rename repair, vendored runtime execution, changed-file inference, read gating, Python routing, compact output, knowledge validation, and first-feature initialization.
- Node syntax checks passed for the CLI and context-routing module.
- `git diff --check` passed.
- `apb-context validate --json` passed for APB's active context-routing feature capsule.
- End-to-end bootstrap created a project containing feature templates, routing documentation, agent rules, runtime state, and ignore configuration.
- A generated project with no active feature capsule returned a safe unresolved route instead of guessing.

## Remaining Constraints

- Symbol and import discovery is heuristic and does not replace language-specific AST or runtime analysis.
- Dynamic dependencies and unrecorded business rules require explicit bindings or targeted fallback investigation.
- Token savings must be benchmarked on real feature histories before assigning a quantitative improvement.

## Related Knowledge

- [Incremental Context Routing Plan](../planning/11-incremental-context-routing.md)
- [Context Routing Documentation](../docs/context-routing.md)
- [Architecture Decision](../architecture-decisions/2026-07-23-use-agent-native-context-routing.md)
