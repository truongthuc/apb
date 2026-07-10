# Review: Question Answer Routing Template Update

Date: 2026-07-10

## Scope

Define how APB agents should handle unclear source documents or owner requests before any CLI automation is added.

## Decision

Use template and rule updates first. Agents should ask Open Questions when context is unclear, then route owner answers into the correct `.agent/` memory files based on the approved routing map.

CLI support for machine-readable Open Questions is deferred until real usage shows enough repeated pain to justify automation.

## Outcome

- Added Question Answer Routing rules to generated `.agent/AGENTS.md`.
- Added matching rules to APBF's current `.agent/AGENTS.md`.
- Updated `README.md` to describe Open Question routing behavior.
- Marked `APBF-310` as done.
