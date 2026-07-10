# Review: Agent Artifact Consolidation

Date: 2026-07-10

## Scope

Review generated project structure for agent-facing artifacts and bridge files.

## Decision

Accepted the owner direction to keep generated artifacts, previews, and reviews under `.agent/`, and to remove tool-specific bridge files such as `CLAUDE.md`.

The `CLAUDE.md` removal decision was later superseded by `.agent/architecture-decisions/2026-07-10-restore-claude-bridge.md`.

## Outcome

- Root `AGENTS.md` was initially kept as the only bridge file.
- `.agent/AGENTS.md` remains the shared source of truth.
- `.agent/artifacts/`, `.agent/previews/`, and `.agent/reviews/` replace `.codex/` template directories.
- Generated templates later restored `CLAUDE.md` as a thin compatibility bridge for Claude.
