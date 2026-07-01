# Decision Template

## Purpose

This document defines the canonical structure for APBF architectural decisions.

APBF is decision-centric. Architectural decisions are the highest-level unit of work. Handoffs execute approved decisions. Artifacts implement decisions. Reviews verify whether artifacts correctly implement decisions. Milestones baseline groups of approved decisions and approved artifacts.

Freeze applies only to milestones. Artifacts are approved, not frozen.

## Decision-Centric Model

APBF treats decisions as the source of architectural intent.

The repository should evolve from approved decisions, not from isolated file changes.

Core units:

- Decision = unit of architectural intent.
- Handoff = unit of execution.
- Artifact = unit of repository change.
- Review = validation of decision implementation.
- Milestone = unit of baseline.
- Commit = unit of version history.

Decision flow:

1. An architectural decision is proposed.
2. The decision is reviewed.
3. The decision is approved, rejected, revised, or superseded.
4. An approved decision may produce one or more execution handoffs.
5. Handoffs produce repository artifacts.
6. Reviews validate whether artifacts correctly implement the decision.
7. Approved decisions and approved artifacts may be included in a milestone baseline.
8. Freeze occurs only as a milestone-level event.

## Decision Lifecycle

APBF decisions should use the following lifecycle:

1. `Proposed`
2. `In Review`
3. `Approved`
4. `Rejected`
5. `Superseded`

Lifecycle meanings:

- `Proposed` means the decision has been written but not yet reviewed.
- `In Review` means the decision is being evaluated by the Chief Architect.
- `Approved` means the decision is accepted as current architectural intent.
- `Rejected` means the decision should not be implemented.
- `Superseded` means a later approved decision replaces this decision.

Only approved decisions should be executed through handoffs.

## Decision Template Structure

Each architectural decision should include the following sections:

1. `Decision ID`
2. `Status`
3. `Title`
4. `Context`
5. `Decision`
6. `Rationale`
7. `Scope`
8. `Consequences`
9. `Impacted Artifacts`
10. `Handoff Requirements`
11. `Review Requirements`
12. `Milestone Impact`
13. `Related Decisions`
14. `Supersedes`
15. `Superseded By`

## Relationship Between Core Units

### Decision

A decision captures architectural intent. It explains what has been decided, why it was decided, what it affects, and how it should be validated.

### Handoff

A handoff translates an approved decision into executable work for Codex. Handoffs must start from an approved decision and must not create new architecture by inference.

### Artifact

An artifact is a repository change that implements a decision. Artifacts can be drafted, reviewed, revised, and approved. Artifacts are not frozen individually.

### Review

A review validates whether a decision is sound or whether an artifact correctly implements an approved decision. Reviews should distinguish decision review from artifact implementation review.

### Milestone

A milestone groups approved decisions and approved artifacts into a baseline. Milestones are the only unit that can be frozen.

### Commit

A commit records repository history. A commit may contain one or more artifacts, but it is not the source of architectural intent. Commits should preserve traceability to decisions when practical.

## Decision Status Values

Approved decision status values:

- `Proposed`
- `In Review`
- `Approved`
- `Rejected`
- `Superseded`

Status rules:

- A decision must not be executed while it is `Proposed`.
- A decision must not be executed while it is `In Review`.
- A `Rejected` decision must not be implemented.
- A `Superseded` decision must not be treated as current intent.
- Only an `Approved` decision may drive handoffs.

## Superseding Decisions

A new decision may supersede an earlier decision when architectural intent changes.

Superseding rules:

- The new decision must identify the earlier decision under `Supersedes`.
- The earlier decision should identify the new decision under `Superseded By` when updated by an approved handoff.
- Superseding should preserve the reason for change.
- Superseding should not erase historical context.
- Superseded decisions remain part of the decision history but no longer represent current architectural intent.

## Required Decision Fields

Every architectural decision should include:

- `Decision ID`
- `Status`
- `Title`
- `Context`
- `Decision`
- `Rationale`
- `Scope`
- `Consequences`
- `Impacted Artifacts`
- `Handoff Requirements`
- `Review Requirements`
- `Milestone Impact`

Field responsibilities:

- `Decision ID` uniquely identifies the decision.
- `Status` states the decision lifecycle state.
- `Title` names the decision clearly.
- `Context` explains the conditions that created the need for the decision.
- `Decision` states the architectural decision directly.
- `Rationale` explains why this decision is preferred.
- `Scope` defines where the decision applies.
- `Consequences` identifies expected tradeoffs and impacts.
- `Impacted Artifacts` lists files or artifact groups expected to be affected.
- `Handoff Requirements` describes what execution handoffs must preserve.
- `Review Requirements` defines how decision implementation should be validated.
- `Milestone Impact` states whether the decision affects milestone readiness or baseline criteria.

## Optional Decision Fields

Optional fields may be used when needed:

- `Alternatives Considered`
- `Risks`
- `Open Questions`
- `Related Decisions`
- `Supersedes`
- `Superseded By`
- `References`
- `Notes`

Usage guidance:

- Use `Alternatives Considered` when multiple architectural options were evaluated.
- Use `Risks` when the decision introduces uncertainty or future maintenance concerns.
- Use `Open Questions` when the decision is approved with explicit unresolved items.
- Use `Related Decisions` when other decisions provide context but are not replaced.
- Use `Supersedes` when this decision replaces an earlier decision.
- Use `Superseded By` when a later decision replaces this decision.
- Use `References` when external or internal references are needed.
- Use `Notes` only for clarifications that do not belong in the main decision body.

## When a Decision Is Required

An architectural decision is required when work changes or establishes:

- APBF repository structure.
- APBF collaboration workflow.
- APBF lifecycle model.
- APBF review model.
- APBF handoff model.
- APBF milestone model.
- APBF layer boundaries.
- APBF artifact standards.
- APBF methodology direction.
- APBF governance assumptions.
- The relationship between decisions, handoffs, artifacts, reviews, milestones, or commits.

An architectural decision is not required for mechanical edits that only implement an already approved decision without changing architectural intent.

## Boundary Statement

This template defines the structure for APBF architectural decisions only.

This template does not define the governance model.

This template does not define the glossary.

This template does not define Templates layer artifacts.

This template does not define Tooling layer artifacts.

This template does not introduce application architecture.

This template does not introduce AI Orchestrator domain logic.
