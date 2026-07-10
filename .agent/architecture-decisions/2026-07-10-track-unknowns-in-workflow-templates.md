# Architecture Decision: Track Unknowns In Workflow Templates

Date: 2026-07-10

Status: Accepted

## Context

APBF generated projects use a review-first workflow before implementation. That workflow reduces misunderstanding, but it does not by itself distinguish between requirements that are explicitly described, requirements the owner knows but did not fully describe, and areas that neither the owner nor the agent has identified yet.

## Decision

APBF templates will require planning and design artifacts to classify feature knowledge into confirmed requirements, assumptions, open questions, risk areas / unknowns, out-of-scope behavior, and validation plans.

Agents must explicitly ask the owner to review assumptions and risk areas during Planning Review and Design Review. Requirements discovered later must be recorded in the relevant planning note, review history, business rules, or architecture decision before continuing.

## Alternatives Considered

- Keep the workflow steps only: rejected because it does not force missing context to become visible during review.
- Ask ad hoc clarification questions: rejected as insufficient because unknowns should be recorded as reusable project knowledge.

## Consequences

Planning artifacts become slightly heavier, but they better support iterative discovery and reduce silent assumptions. Generated projects will start with template sections that make missing context visible from the first feature request.

## Links

- Planning:
- Design:
- Review:
