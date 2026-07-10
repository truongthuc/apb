# Bootstrap Workflow

## Purpose

This document defines the minimum APBF workflow required to transform a new software project from an empty repository into a state that is ready for Templates.

The workflow is practical, lightweight, and methodology-focused. It is designed to enable implementation early without requiring a complete methodology library.

## Scope

This workflow covers the methodology steps required before Template design can begin.

It defines:

- The minimum bootstrap sequence.
- Required transition points.
- Required outputs for the Templates layer.
- Review points before moving forward.
- Feedback rules for improving Methodology through approved architectural decisions.

This workflow does not define Templates, Tooling, generators, CLIs, or software implementation.

## Workflow Principles

- Use just sufficient methodology to enable Templates.
- Prefer small approved decisions over broad speculative planning.
- Keep each bootstrap step lightweight and reviewable.
- Move toward implementation readiness as early as possible.
- Allow Templates and future implementation work to reveal Methodology gaps.
- Improve Methodology from implementation feedback only through approved architectural decisions.
- Keep APBF domain-neutral and implementation-neutral.

## Bootstrap Flow

The APBF Bootstrap Workflow has six steps:

1. Repository Orientation
2. Boundary Definition
3. Project Intent Capture
4. Bootstrap Decisions
5. Template Readiness Review
6. Template Handoff

Each step should produce only the minimum output needed by the next step.

## Step 1: Repository Orientation

The project starts by establishing where the new repository is and which APBF rules apply.

Objectives:

- Confirm the repository scope.
- Confirm language and artifact expectations.
- Confirm that APBF is being used to bootstrap the project, not to define application behavior directly.
- Identify whether existing files or decisions must be preserved.

Minimum outputs:

- Repository scope statement.
- Applicable APBF rule references.
- Known existing constraints.

Transition point:

- Move forward when the repository boundary is understood and no blocking ambiguity exists.

## Step 2: Boundary Definition

The project defines what the bootstrap effort is allowed to cover.

Objectives:

- Identify project boundaries.
- Identify out-of-scope areas.
- Identify external constraints.
- Prevent premature Templates, Tooling, or implementation work.

Minimum outputs:

- In-scope statement.
- Out-of-scope statement.
- Constraint list.

Transition point:

- Move forward when boundaries are clear enough to prevent scope drift.

## Step 3: Project Intent Capture

The project captures the minimum intent required to design useful Templates.

Objectives:

- Identify the project purpose.
- Identify the primary user or maintainer audience.
- Identify expected project outputs.
- Identify success criteria at a high level.
- Identify assumptions that affect Template design.

Minimum outputs:

- Project purpose.
- Audience statement.
- Expected outputs.
- Success criteria.
- Key assumptions.

Transition point:

- Move forward when project intent is clear enough to guide reusable artifact structure.

## Step 4: Bootstrap Decisions

The project records any architectural decisions required before Template design.

Objectives:

- Identify decisions needed to proceed.
- Separate decision questions from artifact implementation questions.
- Approve only the decisions required to enable Templates.
- Defer nonessential decisions.

Minimum outputs:

- Required decision list.
- Approved bootstrap decisions.
- Deferred decision list.

Transition point:

- Move forward when required bootstrap decisions are approved or explicitly deferred without blocking Template readiness.

## Step 5: Template Readiness Review

The project evaluates whether it has enough methodology output to begin Template design.

Objectives:

- Confirm that required bootstrap outputs exist.
- Confirm that boundaries are explicit.
- Confirm that project intent is usable by Templates.
- Confirm that required bootstrap decisions are approved.
- Confirm that unresolved questions do not block Template design.

Minimum outputs:

- Template readiness verdict.
- Blocking gaps, if any.
- Deferred methodology gaps, if any.
- Template input summary.

Transition point:

- Move to Template Handoff when Template readiness is approved.
- Return to an earlier step when a blocking gap is found.

## Step 6: Template Handoff

The project prepares the handoff from Methodology to Templates.

Objectives:

- Identify the first Template candidates.
- Identify the methodology outputs each Template should consume.
- Identify constraints Templates must preserve.
- Identify feedback questions Templates may return to Methodology.

Minimum outputs:

- Template candidate list.
- Template input map.
- Template constraints.
- Feedback questions for Methodology.

Transition point:

- Begin Template design when the Template Handoff is approved.

## Required Outputs for Templates

The Templates layer should receive:

- Repository scope statement.
- In-scope and out-of-scope statements.
- Constraint list.
- Project purpose.
- Audience statement.
- Expected outputs.
- Success criteria.
- Key assumptions.
- Approved bootstrap decisions.
- Deferred decision list.
- Template input summary.
- Template candidate list.
- Template constraints.

These outputs are methodology outputs, not Template implementations.

## Feedback Loop

Methodology, Templates, and future implementation work should co-evolve.

Templates may reveal missing methodology.

Future generators or CLIs may reveal missing methodology.

Implementation feedback is allowed to improve Methodology, but only through approved architectural decisions.

Feedback must not silently change Methodology, Templates, or Tooling.

If feedback requires a methodology change, the process should return to Decision Review before synchronization work begins.

## Review and Approval

Bootstrap outputs should be reviewed for sufficiency, not completeness.

Review should confirm:

- The workflow outputs are sufficient to enable Template design.
- Required decisions are approved.
- Boundaries are explicit.
- Deferred items are not blocking.
- No Templates or Tooling implementation has been introduced.
- Approved ADRs are respected.

Approval means the bootstrap state is ready for Template design.

Approval does not imply milestone freeze.

Freeze remains a milestone-level baseline event only.

## Out of Scope

This document does not define:

- Product Planning Methodology.
- Governance Methodology.
- Knowledge Lifecycle.
- Detailed Review Workflow.
- Milestone Workflow.
- Templates.
- Template schemas.
- Generators.
- CLI behavior.
- Tooling design.
- Software architecture.
- AI Orchestrator domain logic.
- Code.

Those topics may be addressed later only when supported by approved architectural decisions or approved methodology needs.
