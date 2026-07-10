# Methodology Roadmap

## Decision Status

Approved for Methodology layer planning.

## Purpose

This document records the approved planning roadmap for completing the APBF Methodology layer before creating Templates, Tooling implementations, repository documentation, generators, CLIs, editor extensions, or Codex integrations.

APBF must remain a bootstrap framework. It is not an application, not an AI Orchestrator, and must not contain AI Orchestrator domain logic.

## Planning Principles

All planning documents should follow these principles:

- Methodology before implementation.
- Decisions before artifacts.
- Review before freeze.
- Freeze before reuse.
- Reuse before recreation.
- Keep planning domain-neutral.
- Avoid implementation details.
- Every document should have a single responsibility.

## Layer Dependency

Methodology defines principles.

Templates implement methodology.

Tooling automates templates.

Tooling must never redefine methodology.

Templates must never redefine methodology.

Methodology is the single source of truth.

## Approved Planning Document Roadmap

### `.agent/planning/01-methodology-roadmap.md`

Defines the approved planning document roadmap for the Methodology layer. It records the intended planning documents, their purpose, dependency order, and boundaries before any further planning files are created.

### `.agent/planning/02-product-planning-methodology.md`

Defines a domain-neutral product planning methodology for AI-related project bootstrap work. It should cover problem framing, stakeholders, constraints, scope, success criteria, assumptions, and readiness signals without introducing application-specific business logic.

### `.agent/planning/03-agent-knowledge-lifecycle.md`

Defines how project knowledge should be captured, refined, validated, frozen, reused, revised, or retired for agent-assisted bootstrap work. It must describe knowledge lifecycle principles only and must not define runtime agent orchestration, agent chains, or AI Orchestrator domain behavior.

### `.agent/planning/04-governance.md`

Defines governance for APBF planning and methodology decisions. It should cover ownership, approval checkpoints, change control, review responsibilities, artifact status, and boundary enforcement.

### `.agent/planning/05-template-design-principles.md`

Defines principles for future template design. It should explain how templates remain reusable, domain-neutral, minimal, reviewable, and derived from the approved Methodology layer without embedding application logic or AI Orchestrator domain logic.

### `.agent/planning/06-bootstrap-workflow.md`

Defines the methodology-level bootstrap workflow from intake through review and freeze. It should describe process phases and decision points only, without creating generators, CLIs, automation, runtime flows, or code.

### `.agent/planning/07-review-and-freeze-process.md`

Defines the process for reviewing, approving, freezing, revising, and deprecating APBF artifacts. It should establish clear artifact states such as draft, proposed, approved, frozen, revised, and deprecated.

### `.agent/planning/08-milestone-workflow.md`

Defines how APBF work should be organized into milestones. It should cover milestone scope, entry criteria, exit criteria, checkpoints, review expectations, and methods for avoiding scope creep.

### `.agent/planning/09-tooling-design-readiness.md`

Defines when APBF is ready to consider Tooling layer design. It should describe readiness criteria, constraints, and approval gates for thinking about tooling without starting implementation or creating a tooling roadmap prematurely.

### `.agent/planning/10-methodology-completion-criteria.md`

Defines the criteria for determining when the Methodology layer is mature enough to move into Templates layer design. It should establish completeness, consistency, boundary, review, and freeze requirements.

## Dependency Order

The planning documents should be created and reviewed in this order:

1. `.agent/planning/01-methodology-roadmap.md`
2. `.agent/planning/02-product-planning-methodology.md`
3. `.agent/planning/03-agent-knowledge-lifecycle.md`
4. `.agent/planning/04-governance.md`
5. `.agent/planning/05-template-design-principles.md`
6. `.agent/planning/06-bootstrap-workflow.md`
7. `.agent/planning/07-review-and-freeze-process.md`
8. `.agent/planning/08-milestone-workflow.md`
9. `.agent/planning/09-tooling-design-readiness.md`
10. `.agent/planning/10-methodology-completion-criteria.md`

## Dependency Rationale

`.agent/planning/01-methodology-roadmap.md` must come first because it freezes the planning sequence and scope.

`.agent/planning/02-product-planning-methodology.md` should come before lifecycle and governance documents because it defines the core planning approach that later documents must support.

`.agent/planning/03-agent-knowledge-lifecycle.md` should follow product planning methodology because agent knowledge handling depends on what planning knowledge APBF expects to capture and refine.

`.agent/planning/04-governance.md` should follow the first two methodology topics so governance can enforce concrete planning and knowledge lifecycle boundaries.

`.agent/planning/05-template-design-principles.md` should follow governance because template design principles must inherit approved controls and boundary rules.

`.agent/planning/06-bootstrap-workflow.md` should follow template design principles because the workflow must explain how methodology outputs eventually become template-ready without creating templates too early.

`.agent/planning/07-review-and-freeze-process.md` should follow the bootstrap workflow because review and freeze rules depend on the artifact flow being defined.

`.agent/planning/08-milestone-workflow.md` should follow review and freeze rules because milestones need clear completion and approval checkpoints.

`.agent/planning/09-tooling-design-readiness.md` should come near the end because tooling should only be considered after methodology, governance, workflow, review, and milestone rules are clear.

`.agent/planning/10-methodology-completion-criteria.md` should come last because it determines whether the Methodology layer is complete enough to proceed to Templates layer design.

## Layer Gate

No work may begin in the Templates layer until every Methodology document has been:

- Created.
- Reviewed.
- Approved.
- Frozen.

The same rule applies before entering the Tooling layer.

Templates must be derived from approved methodology documents. Templates must not be created from assumptions, unstabilized planning, or unapproved workflow ideas.

## Out of Scope

This phase does not include:

- Source code.
- Runtime architecture.
- AI orchestration.
- Application architecture.
- Technology selection.
- Framework comparison.
- Performance optimization.

## Current Restrictions

- Do not create templates yet.
- Do not create generators.
- Do not create a CLI.
- Do not create a VSCode extension.
- Do not create Codex integration.
- Do not create Tooling implementations.
- Do not create application code.
- Do not introduce AI Orchestrator domain logic.
- Do not create additional files unless explicitly approved.

## Boundary Statement

APBF is not an application.

APBF is not an AI Orchestrator.

APBF must not contain AI Orchestrator domain logic.

APBF may define reusable bootstrap methodology, neutral templates, repository conventions, and tooling boundaries only after the relevant planning decisions are approved.
