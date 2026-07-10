# Question Answer Routing Workflow

## Purpose

Define how APB should handle unclear source documents: ask Open Questions, receive owner answers, and route confirmed knowledge into the correct `.agent/` files.

## Confirmed Requirements

- When APB cannot confidently classify or place information from source documents, it should create Open Questions instead of silently guessing.
- Owner answers to Open Questions should be used to place information into the correct `.agent/` location.
- Routing should preserve the existing review-first workflow.
- Routing should keep project documentation in English.

## Assumptions

- APB should not automatically write uncertain inferred content into durable project memory.
- The first version can define the routing workflow in templates and documentation before adding a dedicated CLI command.
- Owner answers may contain multiple knowledge types, so routing should support splitting one answer into several target files.
- Low-confidence routing should create a review draft before updating durable `.agent/` files.

## Open Questions

- Should APB apply owner answers directly after the owner responds, or should it always create a review draft first?
- Should the routing workflow be implemented only as agent instructions for now, or should `apb-render-project-info` generate a machine-readable question list?
- Should resolved Open Questions remain in the original project summary with a resolution note, or be moved entirely to the target documents?

## Risk Areas / Unknowns

- Over-routing: one answer may be copied into too many files and create duplication.
- Under-routing: one answer may be stored only in planning even though it is a durable business rule or architecture decision.
- Traceability loss: future agents may not know which source question and owner answer produced a rule.
- Premature automation: a CLI router may be brittle before enough real examples exist.

## Proposed Routing Map

| Owner answer describes | Target location |
|---|---|
| Product/project purpose, audience, boundaries, operating context | `.agent/project-context.md` and relevant `.agent/planning/*.md` |
| Durable business behavior, policy, validation rule, accounting rule, permission rule | `.agent/business-rules.md` |
| Technical structure, integration choice, storage choice, major tradeoff | `.agent/architecture-decisions/YYYY-MM-DD-<short-title>.md` |
| Naming pattern, terminology, code/API naming convention | `.agent/naming-conventions.md` |
| Current task scope, assumptions, out-of-scope behavior, acceptance criteria | `.agent/planning/*.md` |
| API contract, setup note, implementation design, module documentation | `.agent/docs/*.md` |
| Review decision, approval, rejected assumption, resolved concern | `.agent/review-history/YYYY-MM-DD-<topic>.md` |
| Temporary unresolved interpretation | `.codex/reviews/` or `.codex/previews/` until approved |

## Proposed Workflow

1. Extract source document sections into a draft project summary.
2. Mark missing or ambiguous information as Open Questions.
3. Ask the owner the smallest set of blocking questions.
4. Classify each answer using the routing map.
5. If routing confidence is high, update the correct `.agent/` files and add traceability notes.
6. If routing confidence is low, create a review draft in `.codex/reviews/` and ask for approval.
7. Update the original planning summary with resolution status so the same question is not repeatedly asked.

## Validation Plan

- Use a sample BA document with missing scope, business rules, and architecture decisions.
- Confirm that generated Open Questions are specific enough for the owner to answer.
- Confirm that answers route into the expected `.agent/` files.
- Confirm that unresolved or ambiguous answers remain in review drafts instead of durable docs.
- Confirm that generated projects include the workflow instructions.

## Planning Review Request

Review whether this workflow should be template-only for the next step, or whether APB should immediately add CLI support for machine-readable Open Questions.
