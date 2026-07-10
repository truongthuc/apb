# Architecture Decision: Consolidate Agent Artifacts

Date: 2026-07-10

Status: Partially Superseded

Superseded by:

- `2026-07-10-restore-claude-bridge.md` for the `CLAUDE.md` bridge decision.

## Context

APB generated both shared agent memory under `.agent/` and Codex-specific artifact directories under `.codex/`. It also generated `CLAUDE.md` as a tool-specific bridge file. This split made the generated structure less coherent because artifacts, previews, and reviews are agent workflow material, while Codex and Claude are both agents that should share one source of truth.

## Decision

Store generated artifacts, previews, and review drafts under `.agent/`:

- `.agent/artifacts/`
- `.agent/previews/`
- `.agent/reviews/`

At the time, APB also chose to keep only root `AGENTS.md` as a bridge file. That bridge-file portion was later superseded because real usage showed Claude needs a `CLAUDE.md` entry point. The `.codex/` artifact consolidation remains accepted.

## Alternatives Considered

- Keep `.codex/` for Codex-specific artifacts: rejected because these artifacts are part of the shared agent workflow, not Codex-only behavior.
- Keep both `AGENTS.md` and `CLAUDE.md`: rejected because duplicated bridge files can drift and imply tool-specific rules.

## Consequences

Generated projects have a smaller and more coherent artifact structure. Agents must read `.agent/AGENTS.md` through root bridge files. After the superseding Claude bridge decision, generated projects use both `AGENTS.md` and `CLAUDE.md` as thin bridges.

## Links

- Planning: `.agent/planning/04-task-list.md`
- Review: `.agent/review-history/2026-07-10-agent-artifact-consolidation-review.md`
