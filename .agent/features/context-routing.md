---
id: feature.context-routing
type: feature
status: active
summary: Automatic incremental routing from natural-language tasks to feature knowledge, source code, dependencies, and tests.
revision: 2
verified_at_commit: ""
verified_at_state: ""
triggers:
  - context routing
  - incremental context
  - source routing
  - feature context
  - token optimization
  - self-maintaining context
knowledge:
  - .agent/docs/context-routing.md
  - .agent/planning/11-incremental-context-routing.md
  - .agent/architecture-decisions/2026-07-23-use-agent-native-context-routing.md
references:
  - templates/.agent/AGENTS.md
  - templates/.agent/docs/context-routing.md
  - templates/.agent/features/template.md
  - templates/README.md
  - README.md
  - README.en.md
source:
  entrypoints:
    - bin/apb-context.js
    - lib/context-routing/index.js
  symbols:
    - lib/context-routing/index.js#resolveContext
    - lib/context-routing/index.js#maintainFeature
  paths:
    - bin/apb-context.js
    - bin/create-apb.js
    - lib/context-routing/**
  tests:
    - test/context-routing.test.js
depends_on: []
---

# Context Routing

## Purpose

Allow agents to infer a feature from the owner's natural-language request and load the smallest practical set of related knowledge, source entry points, dependencies, and tests.

## Boundaries

Context routing provides local metadata, ranking, incremental cache reuse, and active manifests. It does not orchestrate agents, replace language servers, or promise runtime-complete dependency analysis.

## Related Knowledge

- [Context Routing Documentation](../docs/context-routing.md)
- [Architecture Decision](../architecture-decisions/2026-07-23-use-agent-native-context-routing.md)
