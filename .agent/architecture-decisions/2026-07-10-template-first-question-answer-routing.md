# Architecture Decision: Template First Question Answer Routing

Date: 2026-07-10

Status: Accepted

## Context

APB can generate Open Questions from unclear source documents, but it does not yet have enough usage evidence to justify a dedicated CLI router. The owner wants unclear information to be asked back and, once answered, placed into the correct `.agent/` memory location.

## Decision

Implement question-answer routing as template and agent rules first. Agents must ask Open Questions when source documents or requests are unclear, classify owner answers, and route confirmed knowledge into the correct `.agent/` files.

Do not add CLI automation for answer routing yet.

## Alternatives Considered

- Add CLI routing immediately: rejected because the routing model has not been validated across enough real projects.
- Keep routing informal: rejected because it would allow silent guessing and inconsistent documentation placement.

## Consequences

The workflow becomes immediately usable by agents without adding brittle automation. Future CLI support can be considered after repeated usage shows where structured question lists, answer ingestion, or routing validation would help.

## Links

- Planning: `.agent/planning/06-question-answer-routing.md`
- Review: `.agent/review-history/2026-07-10-question-answer-routing-template-review.md`
