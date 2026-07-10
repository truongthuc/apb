# Architecture Decision: Use APB CLI Names

## Status

Accepted

## Context

The framework is presented publicly as AI Project Bootstrap, abbreviated APB. Existing CLI commands used the older APBF naming, which made command names longer and inconsistent with current user-facing documentation.

## Decision

Use APB command names:

- `create-apb`
- `apb-render-project-info`

The npm package name should also use `apb`.

## Consequences

- Local users should relink the package with `npm link` after pulling this change.
- Documentation and examples use APB command names.
- Older command names are not kept as aliases in v0.1.
