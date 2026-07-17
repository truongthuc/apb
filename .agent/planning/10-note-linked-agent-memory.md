# Note-Linked Agent Memory Plan

## Confirmed Requirements

- Adopt an Obsidian-inspired note-link structure for `.agent/` without requiring Obsidian.
- Improve agent retrieval by linking project context, rules, decisions, reviews, planning notes, and future feature/module/concept/workflow notes.
- Keep all required project knowledge in plain Markdown that remains readable outside specialized editors.
- Apply the standard to APB itself and to generated project templates.

## Assumptions

- Relative Markdown links are the canonical link format because they work in GitHub, local editors, command-line search, and agents.
- Wiki-style links can exist as optional editor affordances but must not be the only path to required knowledge.
- APB should define optional note categories without forcing every generated project to create empty feature, module, concept, or workflow folders.

## Design

- Add `.agent/index.md` as the durable memory entry point.
- Add a `Note-Linked Agent Memory` section to `.agent/AGENTS.md` and `templates/.agent/AGENTS.md`.
- Add `templates/.agent/index.md` so new projects start with a navigable memory map.
- Record the decision in an ADR and review summary.

## Validation Plan

- Verify all new links point to existing files or explicitly documented optional folders.
- Verify template guidance remains domain-neutral and framework-neutral.
- Verify required knowledge does not depend on Obsidian-only syntax.
