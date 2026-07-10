# Initial APBF Architecture

## Decision Status

Approved for repository initialization.

## Repository Structure

```text
.
├── .agent/
│   └── project-rules.md
├── .agent/planning/
│   └── 00-architecture.md
├── methodology/
│   ├── README.md
│   ├── principles.md
│   ├── lifecycle.md
│   ├── decision-framework.md
│   └── quality-gates.md
├── templates/
│   ├── README.md
│   ├── project-charter.md
│   ├── requirements-brief.md
│   ├── architecture-brief.md
│   ├── implementation-plan.md
│   └── review-checklist.md
├── tooling/
│   ├── README.md
│   ├── tool-selection.md
│   ├── agent-guidelines.md
│   └── automation-boundaries.md
├── docs/
│   ├── README.md
│   ├── repository-guide.md
│   ├── contribution-guide.md
│   └── glossary.md
└── README.md
```

## Top-Level Directory Purposes

### `.agent/`

Contains foundational agent rules for working inside the repository. This directory defines operating guardrails and must not become product documentation or application logic.

### `.agent/planning/`

Contains approved planning decisions for APBF itself. Planning documents record repository-level decisions before methodology, templates, documentation, or tooling are created.

### `methodology/`

Contains the APBF methodology layer. This layer defines domain-neutral principles, lifecycle guidance, decision frameworks, and quality gates for bootstrapping AI-related projects.

### `templates/`

Contains reusable artifact templates derived from the methodology layer. Templates provide structured starting points without embedding application-specific business logic, orchestration behavior, or runtime flows.

### `tooling/`

Contains guidance for tool selection, agent usage, and automation boundaries. Tooling supports the APBF process but does not implement runtime orchestration or application behavior.

### `docs/`

Contains repository documentation for using and maintaining APBF. Documentation explains the framework repository and must remain separate from templates, methodology, and implementation artifacts.

### `README.md`

Provides the repository entry point. It should explain what APBF is, what APBF is not, and how readers should navigate the repository.

## Document Hierarchy

The approved reading order is:

1. `.agent/AGENTS.md`
2. `README.md`
3. `.agent/planning/00-architecture.md`
4. `methodology/README.md`
5. `methodology/principles.md`
6. `methodology/lifecycle.md`
7. `methodology/decision-framework.md`
8. `methodology/quality-gates.md`
9. `templates/README.md`
10. `tooling/README.md`
11. `docs/repository-guide.md`
12. `docs/glossary.md`
13. `docs/contribution-guide.md`

## Relationship Between Methodology, Templates, and Tooling

Methodology defines the rules of thinking.

Templates encode reusable artifacts based on the methodology.

Tooling supports the process without owning the domain.

The relationship is intentionally layered:

- `methodology/` defines principles, lifecycle, decisions, and quality gates.
- `templates/` turns approved methodology into reusable project-starting artifacts.
- `tooling/` describes how tools may support the methodology and templates while staying outside application runtime behavior.

Tooling must not become orchestration. Templates must not contain domain logic. Methodology must not describe application-specific behavior.

## Explicit Boundaries

- APBF is not an application.
- APBF is not an AI Orchestrator.
- APBF must not contain AI Orchestrator domain logic.
- APBF must not define runtime agent flows, orchestration chains, business-specific prompts, application services, product features, or deployment behavior.
- APBF may define reusable bootstrap methodology, neutral templates, repository conventions, and tooling boundaries.
- APBF artifacts must be written in English.
- Communication with the project owner may be in Vietnamese when requested.

## Evolution Roadmap

### Phase 0: Foundation Rules

Establish `.agent/AGENTS.md` as the baseline rule source.

### Phase 1: Repository Skeleton

Create approved top-level directories and entry-point files only after explicit approval.

### Phase 2: Methodology Definition

Define methodology documents for principles, lifecycle, decision-making, and quality gates.

### Phase 3: Template Set

Create reusable templates only after the methodology layer is approved.

### Phase 4: Tooling Boundaries

Define tool selection, agent guidelines, and automation boundaries without writing code.

### Phase 5: Repository Documentation

Create repository documentation after the core methodology and template structure are approved.

### Phase 6: Optional Automation Review

Evaluate automation only after explicit approval. Any automation must support APBF repository workflow and must not turn APBF into an application or AI Orchestrator.
