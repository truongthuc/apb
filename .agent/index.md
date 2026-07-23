# Agent Memory Index

This file is the navigation map for APB's durable agent memory. Start here, then follow the linked source-of-truth notes needed for the current task.

## Core

- [Agent Rules](AGENTS.md)
- [Project Context](project-context.md)
- [Business Rules](business-rules.md)
- [Project Rules](project-rules.md)
- [Naming Conventions](naming-conventions.md)

## Methodology

- [Handoff Protocol](handoff-protocol.md)
- [Review Protocol](review-protocol.md)
- [Review Model Decision](review-model-decision.md)
- [Subsystem Model](subsystem-model.md)
- [Document Template](document-template.md)

## Documentation

- [Agent Documentation Index](docs/README.md)
- [Context Routing](docs/context-routing.md)

## Features

- [Context Routing](features/context-routing.md)

## Planning

- [Architecture](planning/00-architecture.md)
- [Methodology Roadmap](planning/01-methodology-roadmap.md)
- [Methodology Architecture](planning/02-methodology-architecture.md)
- [Bootstrap Workflow](planning/03-bootstrap-workflow.md)
- [Task List](planning/04-task-list.md)
- [Pain Log](planning/05-pain-log.md)
- [Question Answer Routing](planning/06-question-answer-routing.md)
- [Known-Known Workflow Scaling](planning/07-known-known-workflow-scaling.md)
- [Project Context Agent Brief](planning/08-project-context-agent-brief.md)
- [Code Organization Baseline (superseded)](planning/09-code-organization-baseline.md)
- [Note-Linked Agent Memory](planning/10-note-linked-agent-memory.md)
- [Incremental Context Routing](planning/11-incremental-context-routing.md)

## Decisions

- [Architecture Decision Index](architecture-decisions/README.md)
- [Use Note-Linked Agent Memory](architecture-decisions/2026-07-17-use-note-linked-agent-memory.md)
- [Use Agent-Native Context Routing](architecture-decisions/2026-07-23-use-agent-native-context-routing.md)
- [Defer Source Layout to the Project](architecture-decisions/2026-07-23-defer-source-layout-to-project.md)

## Reviews

- [Review History Index](review-history/README.md)
- [Note-Linked Agent Memory Review](review-history/2026-07-17-note-linked-agent-memory-review.md)
- [Incremental Context Routing Review](review-history/2026-07-23-incremental-context-routing-review.md)
- [Context Routing Completion Audit](reviews/2026-07-23-context-routing-completion-audit.md)

## Optional Knowledge Notes

Create these folders only when the project has durable knowledge that belongs there:

- `features/` for user-facing or framework feature notes.
- `modules/` for module or subsystem boundary notes.
- `concepts/` for domain concepts and terminology that need more detail than `project-context.md`.
- `workflows/` for durable process or user-flow notes.

Every important note should link back to related rules, decisions, modules, concepts, workflows, or review history.
