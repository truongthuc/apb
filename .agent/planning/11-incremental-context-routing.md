# Incremental Context Routing Plan

## Confirmed Requirements

- Agents must infer the active feature from a natural-language task without requiring routine commands from the project owner.
- Routing must connect feature knowledge to source entry points, implementation boundaries, dependencies, and tests.
- An active task must receive the smallest complete context set practical: required context is read first, while conditional and reference context remains discoverable without being loaded eagerly.
- Feature context must update incrementally as source code and knowledge evolve instead of being rediscovered from scratch for every task.
- Routing must remain local-first, framework-neutral, and optional infrastructure rather than turning APB into an agent orchestrator.

## Assumptions

- Explicit feature bindings are the highest-confidence source of routing truth.
- Lightweight file, symbol, import, and Git metadata can supplement explicit bindings without promising compiler-grade call-graph accuracy.
- Generated cache and active task manifests are disposable and must not become durable project knowledge.
- Agents invoke the resolver as part of their normal lifecycle; project owners do not need to run routing commands during ordinary work.

## Design

- Define feature capsules as Markdown notes under `.agent/features/` with typed YAML frontmatter.
- Add `apb-context`, an internal agent-facing CLI with `resolve`, `index`, and `validate` operations.
- Build a local incremental source index using content hashes and lightweight symbol/import extraction.
- Resolve a task to a feature using explicit feature selection or ranked natural-language triggers.
- Emit a context manifest that separates required, conditional, and reference material and records the reason for every route.
- Persist disposable routing state under `.agent/runtime/context-routing/` to compare subsequent resolutions and report deltas.
- Preserve independent per-feature baselines and per-feature/task overlays so feature switching does not reset incremental history.
- Follow transitive local imports, discover direct reverse callers, and expose cross-feature relationships without eager source reading.
- Generate evidence-backed maintenance proposals for stale entry points and newly discovered dependencies.
- Allow agents to apply exact safe repairs automatically and promote other bindings after validation, incrementing the feature revision and refreshing context.
- Vendor the routing runtime into generated projects so automatic routing has no global-install dependency.
- Guard unlisted reads and record evidence-based task expansion before loading additional files.
- Include symbol line locations and compact delta/reference output to reduce context tokens.
- Create the first active feature capsule automatically after targeted discovery.
- Add an automatic routing protocol to generated agent rules.

## Validation Plan

- Verify natural-language routing selects the intended feature.
- Verify knowledge, source entry points, bounded source files, direct local dependencies, and tests are returned with read levels and reasons.
- Verify a second resolution reuses unchanged source-index records and reports modified bound files as delta.
- Verify validation detects missing entry points and knowledge bindings.
- Verify generated projects contain the routing schema, agent protocol, runtime ignore rule, and CLI documentation.
- Verify switching between features preserves each feature baseline.
- Verify transitive dependencies and reverse callers are discovered at non-eager read levels.
- Verify accepted dependency proposals update capsule bindings and revisions.
- Verify exact entrypoint renames can be repaired safely without owner commands.
- Verify generated repositories execute their vendored runtime without a global installation.
- Verify task expansions persist across re-resolution and can be promoted after validation.
- Verify Python local dependency and caller discovery in addition to JavaScript coverage.
- Verify compact output preserves the complete graph on disk while limiting agent-visible payload.
- Verify first-feature initialization produces an immediately routable active capsule.

## Review Status

Planning and design were reviewed interactively with the project owner on 2026-07-23 and approved for implementation.
