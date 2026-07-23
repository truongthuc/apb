# Project Context

This file is the durable project brief for AI agents working on APB.

## Summary

APB is a bootstrap framework for starting AI-assisted software projects with consistent agent rules, planning structure, documentation conventions, and review gates.

## Product Purpose

APB helps a project owner start a software repository with a reusable agent workflow, shared agent rules, planning memory, documentation locations, review history, and architecture decision records.

APB is intended to make AI-assisted development more disciplined without becoming an application framework, runtime orchestrator, or product-specific methodology.

## Primary Users

- Project owners who want a consistent structure for AI-assisted software work.
- AI coding agents that need a clear source of truth before changing a repository.
- Maintainers who want reusable templates and lightweight bootstrap tooling.

## Operating Context

APB is used before or during the early setup of a software project. It creates or provides template files that live in the target repository and become that repository's agent-facing memory.

The generated project is expected to continue evolving its `.agent/` files as requirements, business rules, architecture decisions, and review outcomes become known.

## Core Workflows

- Bootstrap a new project from `templates/` using `create-apb`.
- Start agent orientation from `.agent/index.md` when a project provides one, then follow linked source-of-truth notes.
- Read root bridge files, then follow `.agent/AGENTS.md`.
- Fill `.agent/project-context.md` so agents understand what the generated project does.
- Use `.agent/planning/` for task planning and current scope.
- Use `.agent/business-rules.md` for durable business behavior.
- Use `.agent/architecture-decisions/` for accepted technical decisions.
- Use `.agent/review-history/` for review outcomes.
- Render source BA documents into `.agent/planning/02-project-summary.md` with `apb-render-project-info`.
- Resolve natural-language tasks to incremental feature knowledge, source entry points, dependencies, and tests with `apb-context`.

## In Scope

APB provides reusable structure and templates. It does not implement application behavior or orchestration runtime logic.

In scope:

- Agent rules and bridge files.
- Project context and planning templates.
- Documentation conventions.
- Review-history conventions.
- Architecture decision record conventions.
- Simple bootstrap CLI behavior.
- Simple BA document rendering into project summary notes.
- Local, agent-native context routing through explicit feature capsules and a disposable incremental source index.

## Out of Scope

- Application business logic.
- Runtime AI orchestration.
- Project-specific prompts, agents, or workflows.
- Complex template engines, profiles, manifests, hooks, or blueprints unless repeated usage proves they are needed.
- Automatic merging into non-empty repositories for v0.1.

## Domain Terms

| Term | Meaning |
|---|---|
| APB | AI Project Bootstrap, the current framework and CLI/template package. |
| Agent memory | Durable `.agent/` documentation that helps future agents preserve context. |
| Bridge file | A thin root file such as `AGENTS.md` or `CLAUDE.md` that points tools to `.agent/AGENTS.md`. |
| Project context | The durable project brief in `.agent/project-context.md`. |
| Agent memory index | The navigation map in `.agent/index.md` that links durable source-of-truth notes. |
| Note-linked memory | Plain-Markdown project knowledge connected by relative links, inspired by Obsidian-style note graphs without requiring Obsidian. |
| Known-known task | A task where the owner clearly knows the request and the agent understands it. |
| Open Question | Missing information that blocks safe implementation. |
| Assumption | A safe, reversible interpretation that can be stated while work continues. |
| ADR | Architecture Decision Record stored as a separate file under `.agent/architecture-decisions/`. |

## Business Rules Index

- APB must remain domain-neutral and reusable.
- APB must keep project-specific business behavior out of framework templates.
- APB must not overwrite existing project-specific files unless explicitly requested.
- See `.agent/business-rules.md` for durable APB business rules.

## Technical Context

- APB is a Node.js-based repository.
- `create-apb` copies `templates/` into a new or empty target directory and replaces `{{PROJECT_NAME}}`.
- `apb-render-project-info` reads Markdown, text, DOCX files, or supported source directories and creates `.agent/planning/02-project-summary.md`.
- `apb-context` reads `.agent/features/` capsules, builds a lightweight local source index, preserves per-feature baselines and per-task overlays, and writes disposable state under `.agent/runtime/context-routing/`.
- `create-apb` vendors the context-routing CLI and engine into `.agent/tools/context-routing/` so generated repositories remain self-contained.
- The template source of truth lives under `templates/`.
- Generated projects use `.agent/` for agent-facing long-term memory.
- Generated projects include `.agent/index.md` as the entry point for note-linked agent memory.

## External Systems

- GitHub repository: `https://github.com/truongthuc/apb.git`.
- Node.js and npm are required for local CLI usage.

## Constraints

- Repository documentation must be written in English unless it is public user-facing README content intentionally written in Vietnamese.
- Code, comments, identifiers, commit messages, filenames, and API names must be English.
- Communicate with the project owner in Vietnamese.
- Commit only when explicitly requested.
- Keep generated templates simple until real usage justifies added abstraction.
- Required agent memory must remain plain Markdown and must not depend on Obsidian-only features.

## Open Questions

- When should APB support existing non-empty target directories?
- When should APB introduce template profiles, manifests, hooks, or blueprints?
- Should `apb-render-project-info` eventually produce machine-readable open questions?

## Template Orientation

Generated projects use `.agent/project-context.md` as the durable project brief for AI agents. That file should explain what the project does, why it exists, who it serves, core workflows, boundaries, domain terms, constraints, and open questions before non-trivial implementation work begins.

Generated projects also include `.agent/index.md` as the durable memory map. Agents should update the index when adding important notes, moving source-of-truth documents, or introducing feature, module, concept, or workflow notes.

## Last Reviewed

2026-07-17
