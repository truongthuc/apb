# Architecture Decision: Use Project Context As Agent Brief

Date: 2026-07-13

Status: Accepted

## Context

Generated projects need a durable place that tells a new agent what the project does before the agent changes product behavior, architecture, business rules, or user-facing workflows.

APB already includes `.agent/project-context.md`, but the template only stated that no context was recorded yet. That made the file too weak as an onboarding surface.

## Decision

Use `.agent/project-context.md` as the required project brief for generated projects.

The template project context must capture project purpose, primary users, operating context, core workflows, in-scope and out-of-scope boundaries, domain terms, technical context, external systems, constraints, open questions, and review status.

Generated `.agent/AGENTS.md` must instruct agents to read `.agent/project-context.md` before non-trivial tasks. If the file is missing, empty, or still placeholder-only, agents must treat project orientation as incomplete and ask for the minimum required context before making product, architecture, or business-logic changes.

During first bootstrap, agents must ask for the project description once and use it to populate `.agent/project-context.md`. Once populated, agents must not repeat the initial description step; they should read the durable brief and update it only when the project context changes.

## Consequences

Agents get a stable entry point for understanding the project. The initial description is captured once instead of being repeatedly requested. Project context remains separate from task-specific planning, business rules, and ADRs while linking to those files when needed.

## Links

- Template: `templates/.agent/project-context.md`
- Agent rules: `templates/.agent/AGENTS.md`
