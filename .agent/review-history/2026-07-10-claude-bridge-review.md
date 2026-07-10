# Claude Bridge Review

## Context

The owner reported that Claude does not reliably read project `AGENTS.md` and needs a `CLAUDE.md` file that links back to the shared agent rules.

## Decision

Restore `CLAUDE.md` as a thin bridge file in APBF and generated templates.

## Review Result

Accepted. This is a compatibility bridge, not a separate rule source.

## Constraints

- `CLAUDE.md` must point to `.agent/AGENTS.md`.
- `CLAUDE.md` must not duplicate workflow rules.
- `.agent/AGENTS.md` remains the source of truth when files conflict.
