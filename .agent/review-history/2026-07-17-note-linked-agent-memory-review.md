# Note-Linked Agent Memory Review

## Review Type

Planning, design, and implementation review.

## Decision

Approved adopting a plain-Markdown, note-linked memory model for APB and generated projects.

## Reviewed Scope

- Add `.agent/index.md` as the durable memory entry point.
- Add generated `templates/.agent/index.md`.
- Update agent rules with link conventions, note boundaries, and Obsidian compatibility limits.
- Record the architecture decision and planning note.

## Key Review Notes

- Relative Markdown links are canonical because they are portable and agent-readable.
- Wiki-style links are allowed only as optional editor support.
- Required knowledge must not depend on Obsidian-only features.
- Optional note categories should be documented without forcing empty domain-specific folders into every generated project.
- Durable notes should link related rules, decisions, reviews, modules, concepts, and workflows when those links improve retrieval.

## Result

Approved for APB documentation and template implementation.
