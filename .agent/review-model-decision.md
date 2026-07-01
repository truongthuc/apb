# Review Model Decision

## Purpose

This document captures the architectural decision that APBF separates Decision Review from Artifact Review.

This is a decision record, not a protocol implementation.

## Context

APBF is decision-centric and subsystem-aware.

During subsystem model stabilization, it became clear that previous review language mixed two different concerns:

- Reviewing whether an architectural decision is correct.
- Reviewing whether an artifact correctly implements an approved decision.

These concerns must be separated before refactoring review, handoff, document, or subsystem protocols.

## Decision

Review is not a single concept in APBF.

APBF distinguishes Decision Review from Artifact Review.

Decision Review validates architectural intent before execution.

Artifact Review validates whether produced artifacts correctly implement approved decisions.

Milestones aggregate approved decisions and approved artifacts.

Freeze applies only to milestones.

## Rationale

Decision Review and Artifact Review answer different questions.

Decision Review evaluates whether a proposed architectural direction should be accepted.

Artifact Review evaluates whether repository changes faithfully implement an approved decision.

Combining both review types causes scope confusion, repeated review cycles, and unclear authority over whether a problem belongs to architecture or implementation.

Separating the review types keeps architectural intent stable during execution while still allowing artifact review to detect decision-level problems when they make implementation contradictory, incomplete, or impossible.

## Decision Review

Decision Review validates architectural intent.

Decision Review should evaluate:

- Whether the decision is architecturally sound.
- Whether the decision preserves APBF boundaries.
- Whether the decision conflicts with existing approved decisions.
- Whether the decision is worth executing.
- Whether the decision is clear enough to drive handoffs.
- Whether the decision has acceptable consequences and risks.

Decision Review happens before Execution Handoff.

Only approved decisions should produce Execution Handoffs.

## Artifact Review

Artifact Review validates implementation fidelity.

Artifact Review should evaluate:

- Whether the artifact correctly implements the approved decision.
- Whether the artifact follows the expected template or structure.
- Whether the artifact uses consistent terminology.
- Whether the artifact preserves constraints and boundaries.
- Whether the artifact modifies only approved target files.
- Whether the artifact introduces unintended architectural drift.

Artifact Review should not reopen an approved decision by default.

Artifact Review focuses on whether execution matched the approved decision.

## Review Flow

The APBF review flow is:

1. Decision Review
2. Decision Approval
3. Execution Handoff
4. Artifact Production
5. Artifact Review
6. Artifact Approval

Execution Handoff should begin only after Decision Approval.

Artifact Production should follow the approved Execution Handoff.

Artifact Review should validate that the produced artifact implements the approved decision and handoff constraints.

Artifact Approval means the artifact is accepted as a correct implementation of the approved decision.

## Decision Problems Found During Artifact Review

Artifact Review may discover that an approved decision is contradictory, incomplete, or not implementable.

When this happens, Artifact Review must not silently change the decision.

The process must return to Decision Review when:

- The approved decision conflicts with another approved decision.
- The approved decision is incomplete in a way that affects implementation.
- The approved decision cannot be implemented within approved constraints.
- The approved decision creates boundary violations when implemented.
- The approved decision requires architectural change.

A superseding decision may be required when an approved decision must change.

The superseding decision should preserve historical context and clearly state which earlier decision it replaces.

## Impact on Future Protocol Refactoring

Future protocol refactoring should separate decision review behavior from artifact review behavior.

Expected future impacts:

- `review-protocol.md` may be split or superseded by dedicated Decision Review and Artifact Review protocols.
- `handoff-protocol.md` should make Execution Handoff dependent on Decision Approval.
- `decision-template.md` should support Decision Review requirements.
- `document-template.md` should support Artifact Review requirements.
- `subsystem-model.md` should distinguish subsystem coherence review from Decision Review and Artifact Review.

This decision does not perform those refactors.

## Boundary Statement

This document captures the review model decision only.

This document does not split `review-protocol.md`.

This document does not refactor `handoff-protocol.md`.

This document does not refactor `decision-template.md`.

This document does not refactor `document-template.md`.

This document does not refactor `subsystem-model.md`.

This document does not define Templates layer artifacts.

This document does not define Tooling layer artifacts.

This document does not introduce application architecture.

This document does not introduce AI Orchestrator domain logic.
