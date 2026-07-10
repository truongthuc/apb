# APB CLI Rename Review

## Context

The owner requested changing APBF command names to APB command names.

## Decision

Rename the CLI commands and implementation filenames from APBF to APB naming.

## Review Result

Accepted.

## Validation Notes

- `package.json` should expose `create-apb` and `apb-render-project-info`.
- README files should not refer to old APBF command names.
- CLI smoke tests should run through the renamed files.
