# Agent Rules APB Alignment Review

## Context

After the repository folder and CLI names changed to APB, active agent rules still contained APBF naming and one planning document still referenced `.codex/` review paths.

## Decision

Use APB naming in active agent rules and keep `.agent/` as the location for artifacts, previews, and reviews.

## Review Result

Accepted.

## Outcome

- `.agent/AGENTS.md` and `templates/.agent/AGENTS.md` use APB titles.
- Active routing guidance uses `.agent/reviews/` and `.agent/previews/`.
- `.agent/AGENTS.md` remains the source of truth behind root `AGENTS.md` and `CLAUDE.md` bridge files.
