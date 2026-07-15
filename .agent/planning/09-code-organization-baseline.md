# Code Organization Baseline

## Purpose

Reduce duplicated helpers, duplicated abstractions, and inconsistent module placement in projects bootstrapped by APB without forcing framework-based projects into a fixed tree.

## Confirmed Requirements

- Generated projects need a default parent code structure that guides agents toward predictable implementation locations.
- The structure must remain framework-neutral and domain-neutral.
- The structure must reduce generic helper drift across independent agent threads.
- The generated rules must require agents to search for existing code before creating helpers, utilities, abstractions, shared modules, or new modules.
- If a project already uses a framework or established repository convention, generated guidance must tell agents to follow that convention first.

## Assumptions

- A lightweight `src/` skeleton is enough as a recommended baseline for projects without an established structure.
- Empty directories should be preserved with `.gitkeep` files so the copy-based generator can include the skeleton.
- Project-specific modules will replace or remove `src/modules/example-module/` after bootstrap.

## Out of Scope

- Framework-specific source files.
- Runtime orchestration behavior.
- Code generation beyond copying template files.
- Automatic duplicate detection in the CLI.

## Design

Generated projects include this recommended baseline for projects without an established framework or repository structure:

```text
src/
  app/
  modules/
    example-module/
  shared/
    kernel/
    adapters/
  integrations/
  tests/
    helpers/
```

Generated projects also include `.agent/docs/code-organization.md`, which defines:

- Framework-first guidance.
- Project-specific structure mapping.
- Directory responsibilities.
- Module boundary rules.
- Shared code rules.
- Reuse checks before adding new helpers or abstractions.
- Code review checks for duplicate helpers and misplaced shared logic.

## Validation Plan

- Run `create-apb` into a temporary target.
- Confirm the generated project includes the new `src/` skeleton.
- Confirm the generated project includes `.agent/docs/code-organization.md`.
- Confirm generated `README.md`, `.agent/AGENTS.md`, and bootstrap planning reference code organization.
- Confirm generated guidance does not state that the APB baseline is mandatory for framework-based projects.
- Confirm OS noise files such as `.DS_Store` are not copied from templates into generated projects.

## Review Result

Owner approved applying a parent code structure to APB initialization after discussing duplicate helper risk across threads.
