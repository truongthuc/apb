# Subsystem Model

## Purpose

This document defines the canonical subsystem model for APBF.

APBF is a decision-centric, subsystem-aware framework. Decisions drive handoffs. Handoffs produce artifacts. Artifacts belong to subsystems. Subsystems are reviewed for architectural coherence. Milestones baseline approved subsystem states. Releases package milestone baselines for use.

This model should be approved before refactoring protocol or template files.

## Subsystem Definition

A subsystem is a unit of architectural coherence.

A subsystem is not just a folder. A folder may represent a subsystem, but the subsystem is defined by shared responsibility, boundary, lifecycle, review criteria, and architectural purpose.

Artifacts may be approved individually, but a subsystem is reviewed as a coherent group of related artifacts.

Subsystem review evaluates whether the artifacts work together, preserve boundaries, use consistent terminology, and support the intended APBF architecture.

## APBF Hierarchy

APBF uses the following hierarchy:

1. `Decision`
2. `Handoff`
3. `Artifact`
4. `Subsystem`
5. `Milestone`
6. `Release`

### Decision

A decision is the unit of architectural intent. It defines what APBF should do, why the direction is chosen, and what architectural constraints must be preserved.

### Handoff

A handoff is the unit of execution. It translates an approved decision into executable work for Codex.

### Artifact

An artifact is the unit of repository change. It may be a file or a coherent change to a file. Artifacts implement approved decisions.

### Subsystem

A subsystem is the unit of architectural coherence. It groups related artifacts that share a responsibility and must be reviewed together.

### Milestone

A milestone is the unit of baseline. It captures approved subsystem states at a meaningful checkpoint.

### Release

A release is the unit of distribution or external readiness. It packages milestone baselines for use outside the immediate development flow.

## Current APBF Subsystems

### `.agent/` = Meta Framework Subsystem

Defines how humans and AI agents collaborate to build APBF. It contains operating rules, review protocol, handoff protocol, document standards, decision standards, and future governance concepts.

### `.agent/planning/` = Planning / Methodology Subsystem

Defines APBF planning decisions and Methodology layer content. It records approved planning direction before Methodology, Templates, Tooling, or Documentation work proceeds.

### `templates/` = Templates Subsystem

Defines reusable artifacts derived from approved Methodology. Templates must not redefine Methodology and must not introduce domain-specific application logic.

### `tooling/` = Tooling Subsystem

Defines tool-related guidance or future tooling support derived from approved Templates. Tooling must not redefine Methodology or Templates.

### `docs/` = Documentation Subsystem

Defines user-facing and maintainer-facing repository documentation for APBF. Documentation explains APBF without becoming Methodology, Templates, Tooling, or application logic.

## Subsystem Responsibilities

Each subsystem should have:

- A clear architectural purpose.
- A defined boundary.
- A known set of artifacts.
- A review approach.
- A relationship to decisions, handoffs, milestones, and releases.
- A clear dependency position relative to other subsystems.

Subsystems should reduce ambiguity by grouping artifacts by responsibility instead of treating files as isolated units.

## Subsystem Boundaries

Subsystem boundaries prevent responsibility overlap.

Boundary rules:

- The Meta Framework subsystem defines collaboration and governance mechanics.
- The Planning / Methodology subsystem defines framework content and methodology direction.
- The Templates subsystem implements approved Methodology through reusable artifact structures.
- The Tooling subsystem supports approved Templates and process constraints without owning the domain.
- The Documentation subsystem explains APBF usage and maintenance without redefining Methodology, Templates, or Tooling.

Subsystems must not introduce AI Orchestrator domain logic.

Subsystems must not convert APBF into an application.

## Subsystem Lifecycle

Subsystems should use the following lifecycle:

1. `Planned`
2. `In Development`
3. `In Review`
4. `Approved`
5. `Baselined`
6. `Revised`

Lifecycle meanings:

- `Planned` means the subsystem is identified but not yet implemented.
- `In Development` means artifacts are being created or revised.
- `In Review` means the subsystem is being evaluated for architectural coherence.
- `Approved` means the subsystem is accepted as coherent and ready for milestone baseline consideration.
- `Baselined` means the subsystem state has been included in a frozen milestone baseline.
- `Revised` means the subsystem is being changed after a previous approved or baselined state.

Freeze is not a subsystem state. Freeze is a milestone-level event only.

## Subsystem Review

Subsystem review evaluates coherence across artifacts.

A subsystem review should verify:

- The subsystem has a clear purpose.
- The subsystem has clear boundaries.
- The subsystem artifacts implement approved decisions.
- The subsystem artifacts use consistent terminology.
- The subsystem artifacts do not conflict with each other.
- The subsystem preserves APBF layer boundaries.
- The subsystem does not introduce application behavior.
- The subsystem does not introduce AI Orchestrator domain logic.
- The subsystem is ready to be included in a milestone baseline.

Subsystem review should happen after relevant artifacts are individually approved.

## Relationship Between Subsystem Approval and Milestone Freeze

Artifacts may be approved individually.

Subsystems are approved when their artifacts are coherent as a group.

Milestones baseline approved subsystem states.

Freeze applies only to milestones.

Milestone freeze records that a set of approved subsystem states has become the baseline for the next phase of APBF work.

Releases package milestone baselines for use.

## Boundary Statement

This document defines the APBF subsystem model only.

This document does not define the governance model.

This document does not define the glossary.

This document does not refactor lifecycle language in existing artifacts.

This document does not review or modify `.agent/decision-template.md`.

This document does not define Templates layer artifacts.

This document does not define Tooling layer artifacts.

This document does not introduce application architecture.

This document does not introduce AI Orchestrator domain logic.
