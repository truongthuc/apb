# {{PROJECT_NAME}}

## Purpose

This repository was bootstrapped with APB.

## Starting Point

Begin with:

1. `AGENTS.md`
2. `CLAUDE.md` when using Claude
3. `.agent/AGENTS.md`
4. `.agent/index.md`
5. `.agent/project-context.md`
6. `.agent/planning/00-bootstrap.md`
7. `.agent/planning/01-task-list.md`
8. `.agent/docs/code-organization.md`
9. `.agent/docs/context-routing.md`

`.agent/index.md` is the durable memory map. Use it to connect project context, rules, decisions, reviews, feature notes, module notes, concept notes, and workflow notes with relative Markdown links.

For non-trivial tasks, agents automatically use feature capsules under `.agent/features/` to route natural-language requests to relevant knowledge, source entry points, implementation boundaries, and tests. Project owners do not need to run context-routing commands during normal work.

The local runtime is vendored under `.agent/tools/context-routing/`, so routing continues to work after the repository is cloned without requiring a global APB installation.

## Code Structure

APB does not generate an application source or test skeleton. If the project uses a framework, platform, CMS, or established repository convention, follow it and document the mapping in `.agent/docs/code-organization.md`. Preserve native boundaries such as WordPress `wp-content/plugins` and `wp-content/themes`.

If no source convention exists, the agent must ask the project owner to choose one before the first implementation task. Do not invent a `src/`, module, shared-code, integration, or test layout merely to start coding.

Before adding helpers, utilities, shared modules, or abstractions, read `.agent/docs/code-organization.md`.

## Bootstrap Status

Status: Draft

## Next Step

During first bootstrap, complete `.agent/project-context.md` once from the project description. Then review the bootstrap plan, confirm repository boundaries, and choose the first task from `.agent/planning/01-task-list.md`.
