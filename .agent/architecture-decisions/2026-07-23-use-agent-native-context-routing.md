# Use Agent-Native Incremental Context Routing

## Status

Approved

## Context

APB's note-linked memory improves navigation, but agents still need to search broadly and decide which source files to read. As a feature grows, repeatedly rebuilding that context wastes time and tokens and can still omit related rules, decisions, dependencies, or tests.

## Decision

APB will provide agent-native incremental context routing.

Feature capsules are durable Markdown notes under `.agent/features/`. Their YAML frontmatter binds natural-language triggers and knowledge notes to source entry points, implementation boundaries, and tests. Markdown remains the source of truth.

The `apb-context` CLI is an internal primitive for agents. It builds a disposable local source index, resolves a task to the most likely feature, preserves an independent baseline per feature and overlay per feature/task pair, and writes state under `.agent/runtime/context-routing/`. Normal project-owner interaction remains commandless because generated agent rules require agents to invoke routing automatically.

Routing separates required context from conditional and reference context. Required knowledge and entry points are read first. Feature-boundary files remain discoverable at metadata level until the task or a dependency justifies reading them.

The source index uses content hashes and lightweight symbol/import extraction. It is not a compiler, language server, runtime tracer, or guarantee that dynamic dependencies have been discovered. Explicit bindings remain authoritative, and unresolved or stale bindings must be reported.

Routing follows transitive local imports and reverse callers. It produces maintenance proposals when exact entrypoint renames or newly discovered dependencies make a capsule stale. Agents may automatically apply exact evidence-backed repairs; other durable binding changes require validation from code, tests, or an approved design. Accepted maintenance increments the capsule revision and refreshes its context state.

Generated projects vendor the runtime under `.agent/tools/context-routing/`; no global APB installation is required after cloning. An evidence gate records task-local expansion before an agent reads unlisted files. The full graph remains on disk while compact output limits reference lists, symbol locations, and deltas. Agents may initialize the first active feature capsule after targeted discovery when no capsule exists.

## Consequences

- Agents can reach feature-specific knowledge and source entry points without repository-wide reading.
- Subsequent tasks reuse feature bindings and unchanged source-index records.
- Feature capsules require maintenance when boundaries, entry points, rules, or tests change.
- Dynamic dependencies and unbound knowledge remain risk areas and must be surfaced as warnings.
- APB remains a bootstrap framework; it does not schedule agents or execute application workflows.

## Related Knowledge

- [Incremental Context Routing Plan](../planning/11-incremental-context-routing.md)
- [Note-Linked Agent Memory Decision](2026-07-17-use-note-linked-agent-memory.md)
