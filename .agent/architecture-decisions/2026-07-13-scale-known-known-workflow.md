# Architecture Decision: Scale Known-Known Workflow

Date: 2026-07-13

Status: Accepted

## Context

APB previously required knowledge coverage buckets for every feature, workflow, or framework behavior request. Real usage showed that this can become too heavy for small known-known tasks where the owner clearly states the requested change and the agent understands it.

## Decision

APB will scale planning, design, and review ceremony to the task.

For complex or ambiguous tasks, agents must still classify confirmed requirements, assumptions, open questions, risk areas / unknowns, out-of-scope behavior, and validation plans. Planning Review and Design Review must explicitly validate assumptions and risk areas before freezing.

For small known-known tasks, agents may use a lightweight form. Typo fixes, text changes, and simple configuration updates only need assumptions, risks, or validation notes when they actually exist. If the owner's request is clear and there are no meaningful unknowns, the request can serve as sufficient Planning Review and Design Review.

Agents must distinguish assumptions from open questions:

- Assumptions are safe, reversible interpretations that allow work to continue.
- Open Questions block safe implementation and must be asked before proceeding.

The buckets are a discovery tool, not a required display checklist.

## Consequences

APB keeps the review-first workflow for high-risk work while reducing overhead for small edits. The practical standard becomes finding and surfacing missing knowledge, not producing the same headings for every task.

## Links

- Amends: 2026-07-10-track-unknowns-in-workflow-templates.md
