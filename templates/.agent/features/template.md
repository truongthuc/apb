---
id: feature.replace-me
type: feature
status: template
summary: Replace with a compact description of the feature's responsibility.
revision: 1
verified_at_commit: ""
verified_at_state: ""
triggers:
  - replace-me
knowledge:
  - .agent/project-context.md
references: []
source:
  entrypoints:
    - src/modules/example-module/index.ts
  symbols: []
  paths:
    - src/modules/example-module/**
  tests:
    - tests/example-module/**
depends_on: []
---

# Feature Name

## Purpose

Describe the capability and the user or system outcome it owns.

## Boundaries

Describe what belongs to this feature and what explicitly does not.

## Current Behavior

Describe the current accepted behavior without duplicating implementation details.

## Related Knowledge

- [Project Context](../project-context.md)
- [Context Routing](../docs/context-routing.md)
