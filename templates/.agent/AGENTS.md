# APBF Agent Rules

This file is the shared source of truth for AI agents working in `{{PROJECT_NAME}}`.

## Communication

- Always communicate with the project owner in Vietnamese.
- All project documentation must be written in English.
- All code, comments, identifiers, commit messages, filenames, and API names must be written in English.

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

Never start implementation before planning and design are reviewed.

## Knowledge Coverage And Unknowns

Planning and design reduce misunderstanding but do not remove missing context. For every feature or workflow request, classify project knowledge into these buckets:

- Confirmed Requirements: the owner explicitly described the requirement and the agent can trace it to the request or existing documentation.
- Assumptions: the owner may know the requirement, but it was not fully described to the agent. State the assumption clearly and mark it for review.
- Open Questions: information that is required before implementation can proceed safely.
- Risk Areas / Unknowns: areas the owner may not have identified yet and the agent cannot fully infer from the request.
- Out of Scope: related behavior intentionally excluded from the current task.
- Validation Plan: how the implementation will prove the confirmed requirements and assumptions.

During Planning Review and Design Review, explicitly ask the owner to validate assumptions and risk areas. Do not treat a plan as complete just because the request was short.

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

## Project Structure

Use this structure for agent-facing workflow material:

```text
.agent/
  AGENTS.md
  artifacts/
  planning/
  docs/
  architecture-decisions/
    README.md
  previews/
  review-history/
  reviews/
  business-rules.md
  naming-conventions.md
  project-context.md
```

Root `docs/` is optional. Use it only for documentation intended for humans outside the agent workflow.

Root `AGENTS.md` and `CLAUDE.md` are bridge files that point to `.agent/AGENTS.md`. Keep these bridge files thin and do not duplicate project rules in them. Codex, Claude, and other agents share `.agent/AGENTS.md` as the source of truth.

## Documentation

Documentation is a living artifact.

Whenever code, API behavior, architecture, setup, or business logic changes, automatically update relevant docs:

- `.agent/planning/*.md`
- `.agent/docs/*.md`
- `.agent/architecture-decisions/*.md`
- `.agent/review-history/*.md`
- `README.md`

Never leave documentation outdated.

## Agent Knowledge

Use `.agent/` as the long-term project memory.

Record architecture decisions as separate ADR files in `.agent/architecture-decisions/`.

Use this naming format:

```text
YYYY-MM-DD-<short-decision-title>.md
```

Do not keep all architecture decisions in a single markdown file.
