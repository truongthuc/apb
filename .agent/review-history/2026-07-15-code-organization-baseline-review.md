# Code Organization Baseline Review

## Review Type

Planning and design review.

## Decision

Approved adding lightweight code organization guidance to APB initialization.

## Reviewed Scope

- Add a framework-neutral `src/` skeleton as a recommended baseline for projects without existing structure.
- Add `.agent/docs/code-organization.md`.
- Update generated `.agent/AGENTS.md` with reuse-before-create rules.
- Update generated planning files so reuse checks are visible before implementation.
- Update APB documentation and agent memory.
- Prevent common OS noise files from being copied into generated projects.

## Key Review Notes

- The goal is to reduce duplicate helpers and duplicated abstractions across independent agent threads.
- The structure must not become an application framework or runtime orchestrator.
- Framework or repository conventions must take precedence when they already exist.
- Shared code should require proven reuse or explicit owner approval.
- Generic catch-all helper files and directories should be discouraged.
- Template noise such as `.DS_Store` should not be generated into target projects.

## Result

Approved for implementation in the APB template package.
