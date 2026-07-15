# Add Code Organization Baseline

## Status

Approved

## Context

Agents working in separate threads can create duplicated helpers, duplicated abstractions, or inconsistent module locations when a project does not provide a clear code structure. Rules alone reduce this risk but do not give agents a concrete parent structure for placing new code.

APB should remain framework-neutral and domain-neutral, so the baseline must avoid application-specific modules, runtime orchestration, or framework-specific implementation files. It must also avoid forcing projects with existing framework conventions into an APB-specific tree.

## Decision

APB will generate lightweight, framework-first code organization guidance.

If a project already uses a framework, platform, monorepo layout, or established repository convention, agents must follow that convention first and document the project-specific mapping in `.agent/docs/code-organization.md`.

For projects without an existing structure, APB will provide this recommended baseline:

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

Generated projects will include `.agent/docs/code-organization.md` as the source of truth for framework mapping, directory responsibilities, module boundaries, shared code rules, reuse checks, and review checks.

Generated `.agent/AGENTS.md` will require agents to search for existing equivalent behavior before creating helpers, utilities, abstractions, shared modules, or new modules.

## Rationale

The guidance gives agents a concrete placement model without choosing a framework. Framework conventions remain authoritative when present. Module-local code is the default, shared code requires proven reuse or owner approval, and generic catch-all helpers are explicitly discouraged.

This reduces duplicate helper creation while preserving APB's scope as a bootstrap framework rather than an application architecture framework.

## Scope

Applies to:

- `templates/src/`
- `templates/.agent/docs/code-organization.md`
- `templates/.agent/AGENTS.md`
- `templates/.agent/planning/00-bootstrap.md`
- `templates/.agent/planning/01-task-list.md`
- Template-facing README documentation.

## Consequences

- New APB projects start with visible code placement guidance.
- Framework-based projects can preserve native framework conventions.
- Agents have a durable document to consult before adding shared code.
- The template includes empty `.gitkeep` files to preserve directories.
- The generator ignores common OS noise entries such as `.DS_Store` and `Thumbs.db`.
- Projects can still adapt or replace the skeleton after bootstrap.

## Alternatives Considered

- Rules-only approach: rejected because it does not provide a concrete placement model.
- Framework-specific templates: rejected because APB must remain domain-neutral and reusable.
- CLI duplicate detection: deferred because it would add complexity before repeated usage proves it is needed.

## Review Requirements

- Verify generated projects include the code organization document and skeleton.
- Verify generated agent rules reference code organization and reuse checks.
- Verify no framework-specific implementation code is introduced.
- Verify generated guidance is framework-first and does not make the APB baseline mandatory.
- Verify generated projects do not include OS noise files from the template source.
