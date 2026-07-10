# Architecture Decision: Restore Claude Bridge

## Status

Accepted

## Supersedes

- `2026-07-10-consolidate-agent-artifacts.md` for the specific decision to omit `CLAUDE.md`.

## Context

APBF previously removed tool-specific bridge files and kept root `AGENTS.md` as the only bridge to `.agent/AGENTS.md`. Real usage showed that Claude does not reliably read `AGENTS.md` in the project unless a `CLAUDE.md` entry point exists.

## Decision

Generate and keep a root `CLAUDE.md` bridge file alongside `AGENTS.md`.

Both bridge files must point to `.agent/AGENTS.md`. They must not contain separate project rules. `.agent/AGENTS.md` remains the shared source of truth for Codex, Claude, and other coding assistants.

## Consequences

- Generated projects include both `AGENTS.md` and `CLAUDE.md`.
- Claude has a tool-specific discovery file, but rule ownership stays centralized in `.agent/AGENTS.md`.
- Agent bridge files must be kept intentionally thin to avoid drift.

## Related Files

- `AGENTS.md`
- `CLAUDE.md`
- `templates/AGENTS.md`
- `templates/CLAUDE.md`
- `.agent/AGENTS.md`
- `templates/.agent/AGENTS.md`
