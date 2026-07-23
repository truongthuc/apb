# Code Organization

This document records the code organization selected for this project.

Use it to keep implementation work predictable across different agents and threads.

## Framework First

If this project already uses a framework, platform, CMS, monorepo, or established repository convention, follow that convention first.

Examples:

- Next.js, Remix, or similar projects may use their existing `app/`, `pages/`, `components/`, `lib/`, or route conventions.
- NestJS, Rails, Laravel, Django, Spring, or similar projects may use their established module, controller, service, model, migration, or package conventions.
- WordPress or another CMS may use its native plugin, theme, module, extension, or content boundaries.
- Monorepos may use their existing `apps/`, `packages/`, `services/`, or workspace layout.

Document the project-specific mapping in this file. APB does not provide or require an application source skeleton.

## Owner Decision Required

If the repository does not have a clear source convention, ask the project owner to choose one before the first implementation task. Do not create a `src/`, module, shared-code, integration, or test layout merely to begin coding.

Record the decision, rationale, and approved locations in the Project Mapping table below.

## Module Boundaries

- Feature-specific logic should live inside the documented feature or module boundary.
- Each module should expose its public API through `index` when the project language and tooling support it.
- Other modules should import from a module public API instead of private implementation files.
- Business rules belong in feature/module-level files, not in generic shared code.
- Integration-specific mapping or normalization belongs under the documented integration boundary.

## Shared Code Rules

- Add reusable code to the project's shared-code location only when at least two modules need it, or when the owner approves it as shared infrastructure.
- Keep shared kernel code domain-neutral.
- Do not create generic catch-all files or directories such as `utils`, `helpers`, `common`, `misc`, `shared.ts`, or `helpers.ts`.
- Prefer module-local helpers until reuse is proven.
- Before adding a helper, utility, abstraction, or shared module, search the existing codebase for equivalent behavior.

## Project Mapping

Record the structure this project actually uses:

| Responsibility | Project Location | Notes |
|---|---|---|
| Application entry and composition | To be defined | Use framework convention when available. |
| Feature/module logic | To be defined | Use framework convention when available. |
| Shared domain-neutral primitives | To be defined | Keep small and reusable. |
| External integrations | To be defined | Keep integration-specific mapping out of feature logic. |
| Test helpers | To be defined | Keep test-only code out of production imports. |

## Reuse Check

Before creating new reusable code, record the answer to these questions in the task plan or review summary:

- What existing files, helpers, modules, or patterns were searched?
- Why is the existing code insufficient?
- Should the new code stay module-local or become shared?
- Which documentation or code organization note must be updated?

## Review Checklist

Code review must check for:

- Duplicate helpers or duplicate business logic.
- New generic utility files.
- Cross-module imports from private implementation files.
- Business rules placed outside the documented feature boundary.
- Shared code introduced before reuse is proven.
