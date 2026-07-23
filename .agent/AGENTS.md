# APB Agent Rules

This file is the shared source of truth for AI agents working in this repository.

Codex, Claude, and other agents should follow this file before applying tool-specific instructions.

## Communication

- Always communicate with the project owner in Vietnamese.
- All repository documentation must be written in English.
- All code, comments, identifiers, commit messages, filenames, and API names must be written in English.

## Repository Role

- APB is a bootstrap framework for AI-assisted software projects.
- APB is not an application.
- APB is not an AI orchestrator.
- Keep APB domain-neutral, implementation-neutral, and reusable.
- Do not introduce application-specific business rules, runtime flows, agents, prompts, or orchestration behavior.

## Default Workflow

For every software task, follow this order:

1. Planning
2. Planning Review
3. Freeze Planning
4. Implementation Design
5. Design Review
6. Freeze Design
7. Milestone Implementation
8. Code Review
9. Fix Feedback
10. Update Documentation
11. Update Agent Knowledge
12. Commit only when requested

Never start implementation before planning and design are reviewed unless the user explicitly narrows the task to documentation or repository setup.

## Project Orientation

Before following links into specialized notes, start from `.agent/index.md` when it exists. The index is the map of durable project memory and should point to the current source-of-truth notes for context, rules, decisions, planning, reviews, and feature or module knowledge.

Before starting a non-trivial task, read `.agent/project-context.md` to understand what APB is, what it is not, its framework boundaries, template responsibilities, terminology, constraints, and open questions.

If `.agent/project-context.md` is missing, empty, or stale, update it before making framework behavior, template, architecture, or workflow changes.

Generated projects should populate `.agent/project-context.md` once during first bootstrap from the owner's project description. After that, agents should read it as durable context and update it only when project context changes.

For small known-known tasks, only read the project context when the change could affect framework behavior, generated project structure, workflow rules, terminology, or architecture.

## Automatic Context Routing

For every non-trivial task, infer the active feature and resolve its incremental context before broad repository exploration. The project owner should only need to describe the work in natural language; do not require them to run context-routing commands.

When `.agent/features/` contains feature capsules, run `node .agent/tools/context-routing/apb-context.js resolve "<owner request>" --json` as an internal agent step when the vendored runtime exists; APB itself may use `apb-context`. Read `required` knowledge and targeted source entry points first. Read `conditional` dependencies or tests only when the proposed change activates them. Treat `reference` files as discovered metadata and do not read their contents without task-specific evidence.

If no active capsule exists for a confirmed feature, perform one targeted discovery, create the capsule internally with the context-routing runtime's `init-feature` operation, and resolve the original request again. Do not ask the project owner to create routing metadata or learn command syntax.

Before reading a file not present in compact routing output, check it with the context-routing runtime's `check --path <file> --json`. If it is unlisted, identify the import, symbol, failing validation, unresolved rule, or other concrete evidence, then record that evidence with `expand --path <file> --reason <evidence> --json` before reading it. Re-resolve the same task after material repository changes so the per-feature baseline and task overlay report their incremental deltas.

After validation, inspect maintenance proposals. Apply exact safe repairs internally with the context-routing runtime and `maintain --apply-safe --json`. Accept a non-safe proposal only when code, tests, or an approved design proves the relationship, using `maintain --accept <proposal-id> --json`. Re-resolve after maintenance. Do not ask the project owner to run these commands.

Before completing a non-trivial task, run the context-routing runtime with `validate --json`. Use targeted repository search when routing is unresolved or incomplete, then update the feature capsule after confirming the missing relationship.

Routing is a reading aid, not proof of completeness. Reflection, generated code, dynamic dependencies, external systems, and unrecorded business rules may require additional investigation. See `.agent/docs/context-routing.md` for the schema and operating model.

## Knowledge Coverage And Unknowns

Planning and design reduce misunderstanding but do not remove missing context. For every feature, workflow, or framework behavior request, classify project knowledge into these buckets when the task has meaningful ambiguity, risk, or implementation impact:

- Confirmed Requirements: the owner explicitly described the requirement and the agent can trace it to the request or existing documentation.
- Assumptions: the owner may know the requirement, but it was not fully described to the agent. State the assumption clearly and continue only when the assumption is safe and reversible.
- Open Questions: information that is required before implementation can proceed safely. Ask the owner instead of guessing when an Open Question blocks implementation.
- Risk Areas / Unknowns: areas the owner may not have identified yet and the agent cannot fully infer from the request.
- Out of Scope: related behavior intentionally excluded from the current task.
- Validation Plan: how the implementation will prove the confirmed requirements and assumptions.

For known-known work, where the owner clearly states the requested change and the agent understands it, use a lightweight form. Small tasks such as typo fixes, text changes, and simple configuration updates only need assumptions, risks, or validation notes when they actually exist.

Planning Review and Design Review should scale with task complexity. For complex or ambiguous tasks, explicitly ask the owner to validate assumptions and risk areas before freezing planning or design. For small known-known tasks with no meaningful unknowns, the owner's request can serve as sufficient review.

Do not turn the knowledge buckets into a formal checklist. Their value is to expose missing knowledge, not to force headings into every small task.

When a requirement is discovered after implementation begins, record it in the relevant planning note, review history, business rules, or architecture decision before continuing.

## Question Answer Routing

When source documents or owner requests are unclear, ask Open Questions instead of silently guessing. Use the owner's answers to route confirmed knowledge into the correct agent memory location.

Routing rules:

- Product purpose, audience, boundaries, and operating context go to `.agent/project-context.md` and relevant `.agent/planning/*.md` files.
- Durable business behavior, policy, validation rules, permission rules, compliance rules, and accounting rules go to `.agent/business-rules.md`.
- Technical structure, integration choices, storage choices, and major tradeoffs go to separate ADR files in `.agent/architecture-decisions/`.
- Naming patterns, terminology, code naming rules, and API naming rules go to `.agent/naming-conventions.md`.
- Current task scope, assumptions, out-of-scope behavior, acceptance criteria, and validation plans go to `.agent/planning/*.md`.
- API contracts, setup notes, implementation designs, and module documentation go to `.agent/docs/*.md`.
- Review decisions, approvals, rejected assumptions, and resolved concerns go to `.agent/review-history/*.md`.
- Unresolved or low-confidence interpretations go to `.agent/reviews/` or `.agent/previews/` until approved.

If one owner answer contains multiple knowledge types, split it across the appropriate files instead of forcing it into one document. Preserve traceability by noting the source question, answer, or review decision where practical.

## Note-Linked Agent Memory

APB uses `.agent/` as a plain-Markdown knowledge graph. Agents should maintain readable notes that link related project knowledge together without requiring Obsidian or any editor-specific runtime.

Use `.agent/index.md` as the first navigation surface for durable memory. Update it whenever adding, moving, renaming, or promoting an important note.

Prefer relative Markdown links for required knowledge:

```md
[Project Context](project-context.md)
```

Wiki-style links such as `[[Project Context]]` may be used only as supplemental editor affordances. Do not store required knowledge exclusively in Obsidian-only syntax, canvas files, Dataview queries, embeds, or plugin metadata.

Important notes should be self-contained enough to read outside a graph view. When useful, include simple YAML frontmatter:

```yaml
---
type: feature
status: active
updated: 2026-07-17
related:
  - ../business-rules.md
---
```

Use the smallest note that represents a durable concept, not one note per function. Good note boundaries include project context, business rules, architecture decisions, module boundaries, domain concepts, workflows, API contracts, review outcomes, and reusable implementation patterns.

Each durable note should include a `Related Knowledge` section when cross-links would help future agents trace behavior, constraints, or decisions.

## Project Structure

APB stores agent-facing planning and documentation inside `.agent/`.

Required structure:

```text
.agent/
  AGENTS.md
  index.md
  artifacts/
  features/
  planning/
  docs/
    context-routing.md
  architecture-decisions/
    README.md
  previews/
  review-history/
  reviews/
  business-rules.md
  naming-conventions.md
  project-context.md
  runtime/
```

Root `docs/` is optional and should only be used for human-facing framework documentation.

Root `AGENTS.md` and `CLAUDE.md` are bridge files pointing to `.agent/AGENTS.md`. Keep these bridge files thin and do not duplicate project rules in them. Codex, Claude, and other agents should share `.agent/AGENTS.md` as the source of truth.

## Generated Code Organization

APB-generated projects include framework-first code organization guidance but no application source or test skeleton.

Generated agents must preserve a framework, platform, CMS, monorepo, or established repository convention and document its mapping. If no convention exists, they must ask the project owner to choose one before implementation. APB must not invent a `src/`, module, shared-code, integration, or test layout.

Generated projects use `.agent/docs/code-organization.md` as the source of truth for framework mapping, module boundaries, shared code rules, and reuse checks. Template updates that affect code placement must update that document and the generated `.agent/AGENTS.md` rules together.

## Documentation

Documentation is a living artifact.

Whenever framework behavior, generated project structure, CLI output, templates, or workflow rules change, update relevant docs:

- `.agent/planning/*.md`
- `.agent/docs/*.md`
- `.agent/architecture-decisions/*.md`
- `.agent/review-history/*.md`
- `README.md`
- `templates/**/*.md`

Never leave documentation knowingly outdated.

## Agent Knowledge

Use `.agent/` as the long-term project memory.

Automatically update `.agent/` when discovering:

- Framework boundaries.
- Architecture decisions.
- Naming conventions.
- Template conventions.
- Review decisions.
- Technical constraints.

When updating agent memory, also update related note links and `.agent/index.md` if the change affects durable navigation.

Record architecture decisions as separate ADR files in `.agent/architecture-decisions/`.

Use this naming format:

```text
YYYY-MM-DD-<short-decision-title>.md
```

Do not keep all architecture decisions in a single markdown file.

## Review

Use Plannotator when available before:

- Freezing planning.
- Freezing design.
- Completing milestone implementation.

After review, summarize decisions into `.agent/review-history/`.

If Plannotator is unavailable, create a review summary in `.agent/reviews/` and ask the user to approve it before continuing.

## Artifacts

Generated HTML artifacts should be saved in:

- `.agent/artifacts/`

Temporary previews should be saved in:

- `.agent/previews/`

Review summaries should be saved in:

- `.agent/reviews/`
