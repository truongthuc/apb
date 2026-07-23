# Defer Source Layout to the Project

## Status

Approved

## Context

The previous APB template generated a framework-neutral `src/` and `tests/` skeleton. Even as optional guidance, a physical skeleton can imply that projects should adopt APB's application architecture. That assumption does not fit framework, platform, CMS, monorepo, or owner-defined layouts.

## Decision

APB generates the agent workspace and root bridge files but no application source or test skeleton.

Generated agents preserve an existing project convention and record the actual mapping in `.agent/docs/code-organization.md`. When no convention exists, the agent asks the project owner to choose one before the first implementation task. The non-interactive generator does not prompt for or invent a layout.

This decision supersedes [Add Code Organization Baseline](2026-07-15-add-code-organization-baseline.md).

## Consequences

- APB remains automation-friendly and framework-neutral.
- New projects explicitly choose their application architecture instead of inheriting one from APB.
- Context routing uses documented real source boundaries.
- Shared-code and reuse rules remain, but they apply to owner-approved project locations.
- Generated output no longer includes `templates/src/` or `templates/tests/`.
