# APBF Pain Log

## Purpose

Track implementation pain before adding new abstractions.

New abstractions should be considered only when repeated implementation pain demonstrates the need.

## Pain Status Legend

- `observed`: Seen at least once.
- `repeated`: Seen across multiple uses.
- `candidate decision`: May need an architectural decision.
- `deferred`: Not enough evidence to act.

## Observations

| Pain | Status | Frequency | Severity | Candidate Decision | Notes |
|---|---|---:|---:|---|---|
| Existing non-empty target requires manual handling | observed | 1 | Medium | Not yet | Seen when bootstrapping `ai-orchestrator`; current generator correctly refuses to overwrite. |
| Only `{{PROJECT_NAME}}` is supported | observed | 2 | Low | Not yet | Enough for `ai-orchestrator` and `sample-cli`; defer more variables. |
| No Git initialization | observed | 1 | Low | Not yet | Consistent with APBF boundary: approval is architectural, Git is developer choice. |
| No optional template profiles | deferred | 0 | Unknown | No | No evidence yet that v0.1 needs profiles. |
| No blueprint layer | deferred | 0 | Unknown | No | No evidence yet that templates are insufficient. |

## Bootstrap Tests

### `ai-orchestrator`

Result: Passed.

Generated:

- `README.md`
- `.agent/project-rules.md`
- `planning/00-bootstrap.md`
- `planning/01-task-list.md`

Notes:

- Existing repository content had to be backed up before bootstrap.
- The generated project was usable immediately after adding project-specific bootstrap content.

### `sample-cli`

Result: Passed.

Generated:

- `README.md`
- `.agent/project-rules.md`
- `planning/00-bootstrap.md`
- `planning/01-task-list.md`

Notes:

- No new pain beyond the existing variable and target-directory observations.

## Current Decision

Do not add manifest, profiles, blueprints, hooks, plugins, or additional variables yet.

Continue with copy plus `{{PROJECT_NAME}}` substitution until repeated implementation pain proves the need for more.
