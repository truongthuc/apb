# Methodology Architecture

## Purpose

This document defines the architecture of the APBF Methodology layer.

It describes how the Methodology layer is organized, how its documents relate to one another, and how the Methodology layer bridges the Architectural Decision System and the Templates layer.

This document does not define the methodology itself. It defines the architecture of the methodology.

## Scope

This document covers:

- The logical organization of the Methodology layer.
- The methodology areas that should be defined by later documents.
- The dependency relationships between methodology documents.
- The entry points for APBF users.
- The exit criteria for moving from Methodology to Templates.
- The boundaries between Methodology, Templates, and Tooling.
- The way Methodology reflects approved ADRs without duplicating them.

## Design Principles

- Methodology must reflect approved ADRs without restating them as duplicate authority.
- Methodology must define reusable thinking patterns, not implementation details.
- Methodology must remain domain-neutral.
- Methodology must remain implementation-neutral.
- Methodology must precede Templates.
- Templates must derive from approved Methodology.
- Tooling must not redefine Methodology.
- New methodology documents should extend the architecture without restructuring it.
- Each methodology document should have a single responsibility.

## Methodology Areas

The Methodology layer is partitioned into logical areas. These areas are not software modules and are not Templates layer artifacts.

### Orientation

Defines how a user enters and navigates the APBF Methodology layer.

This area should help users understand where to begin, which methodology documents to read first, and how to move from discovery to readiness for templates.

### Product Planning

Defines how APBF frames project intent, goals, constraints, assumptions, stakeholders, scope, and success criteria.

This area should define planning methodology without introducing domain-specific product logic.

### Knowledge Lifecycle

Defines how project knowledge is captured, refined, approved, reused, revised, and retired during bootstrap work.

This area should describe knowledge handling without defining AI Orchestrator behavior or runtime agent flows.

### Governance

Defines how methodology decisions, approvals, boundaries, and changes are managed within APBF.

This area should align with the Architectural Decision System and must not redefine approved ADRs.

### Bootstrap Workflow

Defines the recommended sequence for moving from initial project understanding to template readiness.

This area should describe workflow at the methodology level without creating tooling, generators, or implementation steps.

### Review Workflow

Defines how methodology outputs are reviewed for readiness, consistency, and boundary alignment.

This area should reflect the distinction between Decision Review and Artifact Review without duplicating review protocols.

### Milestone Workflow

Defines how methodology work reaches milestone readiness and how baseline scope is prepared.

This area should reflect the approved baseline definition and must keep freeze as a milestone-level event only.

### Tooling Readiness

Defines when the Methodology layer is mature enough to discuss Tooling design.

This area does not define Tooling. It only defines readiness criteria for considering Tooling later.

## Relationships Between Methodology Areas

The areas form a dependency chain from orientation to readiness:

1. Orientation helps users navigate the Methodology layer.
2. Product Planning defines project intent and scope.
3. Knowledge Lifecycle defines how planning knowledge is maintained.
4. Governance defines how methodology decisions and changes are controlled.
5. Bootstrap Workflow connects planning outputs into a coherent sequence.
6. Review Workflow validates methodology outputs and readiness.
7. Milestone Workflow defines baseline readiness for methodology work.
8. Tooling Readiness defines when Tooling may be considered.

These relationships are directional, but they should not create rigid hierarchy. A later methodology document may reference earlier areas when needed, but it should not redefine them.

## Dependency Model

Methodology documents should depend on approved ADRs and approved upstream methodology documents.

Recommended dependency order:

1. `.agent/planning/02-methodology-architecture.md`
2. `.agent/planning/03-product-planning-methodology.md`
3. `.agent/planning/04-knowledge-lifecycle.md`
4. `.agent/planning/05-governance-methodology.md`
5. `.agent/planning/06-bootstrap-workflow.md`
6. `.agent/planning/07-review-workflow.md`
7. `.agent/planning/08-milestone-workflow.md`
8. `.agent/planning/09-tooling-readiness.md`
9. `.agent/planning/10-methodology-completion-criteria.md`

Dependency rules:

- Every methodology document must preserve approved ADRs as the normative source of truth.
- Every methodology document must declare its upstream dependencies.
- Downstream documents may consume upstream methodology concepts but must not redefine them.
- Methodology documents must not depend on Templates or Tooling.
- Pending dependencies must be identified before a document can be approved.

## Entry Points

The primary entry point for a new APBF user is the Methodology Architecture.

Recommended user path:

1. Read the repository purpose and project rules.
2. Read the Methodology Architecture.
3. Follow the methodology documents in dependency order.
4. Use completion criteria to determine whether the project is ready for Templates.

The Methodology layer should support both first-time readers and maintainers extending APBF.

## Exit Criteria

A project is ready to leave the Methodology layer and enter the Templates layer when:

- Required methodology documents have been created.
- Required methodology documents have been reviewed.
- Required methodology documents have been approved.
- Methodology dependencies are clear.
- Methodology boundaries are explicit.
- Methodology outputs needed by Templates are identified.
- No Templates layer artifact is required to understand the Methodology.
- No Tooling design is required to complete the Methodology.
- Approved ADRs are reflected without contradiction.

Templates may begin only after the Methodology layer has reached approved readiness.

Milestone freeze remains a milestone-level baseline event and is not required for individual methodology documents to be approved.

## Layer Boundaries

The Methodology layer defines how APBF thinks about project bootstrap.

The Methodology layer must not define:

- Templates layer implementation.
- Tooling design.
- Software project examples.
- Runtime architecture.
- AI Orchestrator domain logic.
- Application-specific business logic.
- Code.

The Templates layer should later convert approved Methodology into reusable artifact structures.

The Tooling layer should later support approved Templates and process constraints without redefining Methodology.

## Navigation Strategy

Methodology navigation should be predictable and dependency-aware.

Navigation should provide:

- A clear starting point.
- A stable reading order.
- Explicit upstream and downstream relationships.
- Clear boundary statements.
- Clear exit criteria.

Future methodology documents should include references to upstream dependencies and related documents.

Navigation should scale by adding documents within existing areas, not by restructuring the Methodology layer.

## Evolution Strategy

The Methodology layer should evolve by approved extension, not broad restructuring.

New methodology documents should be added when:

- Existing methodology areas cannot express a required bootstrap concern.
- A new document has a single responsibility.
- The document depends on approved ADRs or approved upstream methodology documents.
- The document does not introduce Templates or Tooling design.
- The document can be reviewed independently.

Existing methodology areas should be revised only when approved ADRs or approved methodology changes require synchronization.

## Out of Scope

This document does not define:

- Product Planning Methodology.
- Governance Methodology.
- Bootstrap Workflow.
- Knowledge Lifecycle.
- Milestone Workflow.
- Review Workflow.
- Templates.
- Tooling.
- Software project examples.
- Code.

Those topics belong to later methodology documents or later APBF phases.
