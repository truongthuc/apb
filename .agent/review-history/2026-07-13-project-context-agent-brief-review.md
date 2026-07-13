# Review: Project Context Agent Brief

Date: 2026-07-13

## Scope

Updated APB templates so generated projects have a durable project brief for agent orientation.

## Review Notes

- `.agent/project-context.md` is the correct home because APB already uses `.agent/` as long-term project memory.
- A new file is not required.
- Generated agents should read project context before non-trivial tasks.
- Placeholder-only project context should block product, architecture, and business-logic changes until the owner provides minimum context.
- During first bootstrap, agents should ask for the project description once and use it to populate `.agent/project-context.md`.
- After `.agent/project-context.md` is populated, agents should not repeat the initial description step; they should read the file and update it only when context changes.
- Small known-known tasks only need project context when they affect product behavior, business rules, workflows, terminology, or architecture.
- APB's own `.agent/project-context.md` was expanded so current-repository agents have the same orientation quality as generated projects.

## Decision

Accepted as a documentation and template rule update.
