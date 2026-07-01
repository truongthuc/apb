# Planning Document Template

## Purpose

This document defines the canonical structure for APBF planning documents under the `planning/` directory.

It standardizes Methodology planning documents so they remain consistent, maintainable, domain-neutral, and implementation-neutral.

This is not a project template, not a software specification template, and not a documentation style guide.

## Template Rules

- Every planning document must use English.
- Every planning document must remain domain-neutral.
- Every planning document must remain implementation-neutral.
- Every planning document must have a single responsibility.
- Every planning document must preserve APBF layer boundaries.
- Planning documents must not define Templates layer artifacts.
- Planning documents must not define Tooling layer artifacts.
- Planning documents must not introduce application behavior or AI Orchestrator domain logic.

## Mandatory Sections

Every planning document under `planning/` must include the following sections unless an approved architecture review explicitly allows an exception.

### Metadata

Defines the document identity, status, scope, review state, dependency position, consumers, and decision role.

Responsibilities:

- State the document title.
- State the document status.
- State the document version.
- Identify the APBF layer the document belongs to.
- Identify the document owner or reviewing role when relevant.
- Identify the document's review state.
- Identify upstream documents or decisions this document depends on.
- Identify downstream documents this document blocks.
- Identify expected consumers of the document.
- Identify whether the document records decisions, explains concepts, or defines process.
- Reference artifact states such as draft, proposed, approved, frozen, revised, and deprecated when relevant.
- Do not define the artifact status lifecycle in this template. The authoritative lifecycle should be defined in governance documents.

Recommended fields:

- `Title`
- `Status`
- `Version`
- `Layer`
- `Owner`
- `Review State`
- `Last Updated`
- `Depends On`
- `Blocks`
- `Consumers`
- `Decision Type`

### Purpose

Explains why the document exists and what decision or planning need it serves.

Responsibilities:

- Define the document's reason for existing.
- Clarify the problem the document addresses.
- Keep the document focused on a single responsibility.
- Avoid describing implementation details.

### Scope

Defines what the document is allowed to cover.

Responsibilities:

- Identify the planning topic covered by the document.
- Clarify the boundaries of the document.
- State which APBF layer the document supports.
- Prevent scope expansion into Templates, Tooling, application architecture, or runtime behavior.

### Dependencies

Defines the document's position in the APBF planning dependency graph.

Responsibilities:

- List required upstream documents under `Depends On`.
- Identify downstream documents blocked by this document under `Blocks`.
- Identify dependencies that are expected but not yet approved as pending dependencies.
- Keep related-but-not-required documents separate from dependency relationships.
- Preserve the approved Methodology, Templates, and Tooling dependency order.
- Avoid depending on unapproved artifacts unless the dependency is explicitly marked as pending.
- Use `Depends On`, `Blocks`, and `Related Documents` consistently.

Dependency terms:

- `Depends On` identifies required upstream documents, decisions, or rules.
- `Blocks` identifies downstream documents or work that should not proceed until this document is approved or frozen.
- `Related Documents` identifies relevant documents that provide context but are not required dependencies.
- Pending dependencies identify expected upstream inputs that are not yet approved and must be resolved before approval or freeze.

### Constraints

Defines rules that the document must follow.

Responsibilities:

- State repository language requirements.
- State layer boundaries.
- State implementation restrictions.
- State architectural restrictions.
- Preserve approved APBF decisions.

### Out of Scope

Defines what the document must not cover.

Responsibilities:

- Prevent premature implementation details.
- Prevent accidental Templates layer design.
- Prevent accidental Tooling layer design.
- Prevent application architecture.
- Prevent AI Orchestrator domain logic.
- Identify topics deferred to other planning documents.

### Review Checklist

Defines or references the checklist used to review the document before approval or freeze.

Responsibilities:

- Either define a document-specific checklist or reference the standard checklist from `.agent/review-protocol.md`.
- Confirm the document has a clear purpose.
- Confirm the document has a single responsibility.
- Confirm the document preserves APBF layer boundaries.
- Confirm the document is consistent with approved upstream documents.
- Confirm missing concepts, risks, and freeze conditions are evaluated.
- Align with `.agent/review-protocol.md`.

### Approval Criteria

Defines the conditions that must be true before the document can be approved or frozen.

Responsibilities:

- State what must be complete before approval.
- State what must be true before freeze.
- Distinguish approval requirements from review inspection items.
- Identify blocking issues that must be resolved.
- Identify deferred issues that are acceptable to leave unresolved.
- Confirm that required dependencies are approved or explicitly marked as pending.

Difference from `Review Checklist`:

- `Review Checklist` defines what reviewers inspect.
- `Approval Criteria` defines what must be true before approval or freeze.

### Related Documents

Identifies documents that are relevant but not necessarily dependencies.

Responsibilities:

- Link related APBF planning documents.
- Link related governance files under `.agent/`.
- Distinguish related documents from required dependencies.
- Avoid listing required upstream dependencies here when they belong under `Depends On`.
- Help future maintainers navigate the planning layer.

## Optional Sections

Optional sections may be used when they improve clarity or maintainability. They should be omitted when they do not serve the document's single responsibility.

### Principles

Use this section when the document defines rules of thinking, decision principles, or evaluation criteria.

Omit this section when the document only records a roadmap, inventory, status, or dependency structure.

### Inputs

Use this section when the document depends on information that must be collected, reviewed, or validated before the process can proceed.

Omit this section when the document does not define a process or does not require external information.

### Outputs

Use this section when the document defines expected results, deliverables, decisions, or artifacts produced by a process.

Omit this section when the document only defines constraints, principles, or review criteria.

### Process

Use this section when the document defines a repeatable sequence of steps, checkpoints, or review stages.

Omit this section when the document defines principles, concepts, or boundaries without prescribing a sequence.

### Examples

Use this section when examples would reduce ambiguity or help reviewers apply the document consistently.

Omit this section when examples would introduce domain assumptions, implementation details, or premature Templates layer content.

### Notes

Use this section for clarifications that support interpretation but do not belong in the main decision flow.

Omit this section when the note would restate existing content or add nonessential commentary.

### Revision History

Use this section when a document has been revised after approval or freeze.

Omit this section for initial drafts unless revision tracking is required by governance.

## Recommended Document Skeleton

Planning documents should generally follow this order:

1. `Metadata`
2. `Purpose`
3. `Scope`
4. `Dependencies`
5. `Constraints`
6. Optional sections required by the document's responsibility
7. `Out of Scope`
8. `Review Checklist`
9. `Approval Criteria`
10. `Related Documents`

## Design Rationale

This template separates identity, intent, boundaries, dependencies, constraints, review, and navigation so planning documents can scale without repeated restructuring.

Mandatory sections create consistency across the planning layer.

Optional sections allow documents to remain focused without forcing unnecessary content.

The structure supports long-term maintainability by making every document reviewable against the same baseline.

## Boundary

This template only defines the standard structure for Methodology planning documents under `planning/`.

This template does not define Product Planning Methodology, Governance, Bootstrap Workflow, Knowledge Lifecycle, CLI, generator, VSCode extension, Codex integration, or software project templates.
