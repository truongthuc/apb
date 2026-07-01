# ADR-0001: Baseline Definition

## Status

Proposed

## Context

APBF has adopted a decision-centric, subsystem-aware model.

The current primitive set for Phase 1 is:

- Decision
- Decision Review
- Decision Approval
- Handoff
- Artifact
- Artifact Review
- Artifact Approval
- Subsystem
- Milestone
- Release

Before closing or freezing Milestone 1, APBF must define what a baseline means and what milestone freeze means.

A milestone freeze cannot happen until APBF defines what a baseline means.

A baseline is not the same as a release.

A milestone freeze is a baseline event, not an artifact state.

## Decision

APBF defines a baseline as a stable internal reference point created by a milestone freeze event.

Milestone freeze applies only to milestones.

Artifacts are approved, not frozen.

Approved decisions define intent.

Approved artifacts implement intent.

Approved subsystem states define architectural coherence.

A frozen milestone can only be reopened through an explicit superseding decision.

## Rationale

APBF needs a clear baseline model before freezing any milestone.

Without a baseline definition, milestone freeze would be ambiguous. It would be unclear whether freeze applies to files, decisions, artifacts, subsystems, commits, or releases.

Defining baseline before milestone freeze keeps APBF aligned with the decision-centric model.

It also prevents artifact-level freeze from returning through inconsistent protocol or template language.

## Baseline Definition

A baseline is a stable internal reference point for APBF.

A baseline records the approved state of the framework at a milestone boundary.

A baseline may include:

- Approved decisions.
- Approved artifacts.
- Approved subsystem states.
- The repository state that represents those approvals.

A baseline exists to support controlled continuation into the next phase of work.

A baseline does not imply public release.

A baseline does not imply finality forever.

A baseline does imply controlled change after freeze.

## Milestone Freeze Definition

Milestone Freeze is the event that creates a baseline.

Milestone Freeze records that a milestone has reached an approved internal state and can be used as the reference point for subsequent work.

Freeze applies only to milestones.

Freeze does not apply to individual artifacts.

Freeze does not apply to individual decisions.

Freeze does not apply to individual subsystems.

## What Freeze Commits To

Milestone Freeze commits to:

- The approved decisions included in the milestone.
- The approved artifacts included in the milestone.
- The approved subsystem states included in the milestone.
- The baseline scope defined for the milestone.
- Controlled change after the milestone is frozen.

## What Freeze Does Not Commit To

Milestone Freeze does not commit to:

- Public release.
- Permanent finality.
- No future change.
- Freezing individual artifacts.
- Freezing individual decisions.
- Freezing individual subsystems.
- Completing future phases.
- Approving out-of-scope work.

## Baseline Scope

Baseline scope defines what is included in a milestone baseline.

Baseline scope should identify:

- Included decisions.
- Included artifacts.
- Included subsystem states.
- Excluded work.
- Known deferred work.
- Any constraints that apply after freeze.

Work outside the baseline scope is not part of the frozen milestone.

## Reopening a Frozen Milestone

A frozen milestone can only be reopened through an explicit superseding decision.

Reopening a frozen milestone should require:

- A clear reason for reopening.
- Identification of the affected baseline.
- Identification of the affected decisions, artifacts, or subsystem states.
- A description of the change required.
- Approval before any baseline-changing work begins.

Reopening a frozen milestone must preserve historical context.

## Relationship to Approved Decisions

Approved decisions define architectural intent.

A baseline includes the approved decisions that define the milestone's accepted intent.

Decisions included in a baseline should remain traceable to the artifacts and subsystem states that implement them.

If an approved decision must change after milestone freeze, a superseding decision is required.

## Relationship to Approved Artifacts

Approved artifacts implement approved decisions.

A baseline includes the approved artifacts that represent the repository implementation of the milestone's accepted intent.

Artifacts are approved, not frozen.

After milestone freeze, changing an included artifact requires controlled change through an approved decision or approved follow-up process.

## Relationship to Approved Subsystem States

Approved subsystem states define architectural coherence.

A baseline includes approved subsystem states that show related artifacts work together within the intended subsystem boundaries.

Subsystems are not frozen individually.

Subsystem states are included in a milestone baseline when the milestone is frozen.

## Difference Between Baseline and Release

A baseline is an internal reference point.

A release is an external distribution or usage package.

Baseline answers: what approved internal state should future work use as reference?

Release answers: what packaged state is distributed or made ready for use?

A baseline may exist without a release.

A release should be based on a baseline, but a baseline does not imply public release.

## Consequences

APBF must not freeze individual artifacts.

APBF must not treat artifact approval as milestone freeze.

APBF must define baseline scope before freezing a milestone.

APBF must distinguish internal baseline decisions from external release packaging.

Future protocol, template, and review documents should align with milestone-level freeze only.

## Future Impact

Future refactoring should align APBF meta-framework artifacts with this decision.

Expected future impacts:

- Review language should distinguish approval from milestone freeze.
- Handoff language should avoid artifact-level freeze.
- Document templates should treat artifacts as approved, not frozen.
- Subsystem language should treat subsystem states as approved or baselined, not individually frozen.
- Milestone workflow should define baseline scope before milestone freeze.
- Release workflow should package milestone baselines without redefining baseline.

This ADR does not perform those refactors.
