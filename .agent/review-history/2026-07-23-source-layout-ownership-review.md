# Source Layout Ownership Review

## Decision Reviewed

Remove the generated application source skeleton and defer source-layout ownership to the project.

## Review Outcome

Approved.

## Key Findings

- A default `src/` tree can be mistaken for an APB requirement even when documentation calls it optional.
- Interactive generator questions would reduce automation and still cannot model every framework or CMS convention.
- Existing conventions should be discovered and documented; missing conventions require an owner decision before implementation.
- Code-boundary, reuse, and duplicate-helper rules remain useful without prescribing directory names.

## Validation

- Generator tests must verify that new projects do not contain `src/` or `tests/` by default.
- Generated rules and documentation must require a recorded project mapping before implementation.
