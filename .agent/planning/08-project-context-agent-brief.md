# Project Context Agent Brief

## Confirmed Requirements

- Agents need a clear place to understand what a generated project does.
- The project brief should help agents understand purpose, audience, scope, workflows, terminology, constraints, and open questions.
- The solution should fit APB's existing `.agent/` memory model.
- First bootstrap should ask for the project description once, use it to populate `.agent/project-context.md`, and avoid repeating that initial description step after the file is populated.

## Assumptions

- Reusing `.agent/project-context.md` is better than adding another top-level file because APB already routes product purpose and operating context there.
- The template should be explicit enough for generated projects without becoming application-specific.

## Open Questions

- None.

## Risk Areas / Unknowns

- Placeholder content may remain unfilled if the bootstrap workflow does not point owners and agents to it.
- Agents may skip context unless `.agent/AGENTS.md` explicitly requires reading it.

## Out of Scope

- No CLI enforcement.
- No automatic project-context generation beyond the existing BA document renderer.

## Validation Plan

- Confirm `templates/.agent/project-context.md` contains a useful project brief structure.
- Confirm `templates/.agent/AGENTS.md` instructs agents to read project context before non-trivial tasks.
- Confirm `templates/.agent/planning/00-bootstrap.md` points owners to complete project context.
- Confirm bootstrap instructions describe the one-time Initial Project Description step.
- Confirm README lists `.agent/project-context.md` as a starting file.
- Confirm APB's own `.agent/project-context.md` is populated with APB-specific purpose, scope, terminology, constraints, and open questions.
