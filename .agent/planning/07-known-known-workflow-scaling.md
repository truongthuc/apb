# Known-Known Workflow Scaling

## Confirmed Requirements

- Known-known work means the owner clearly knows what they want and the agent understands the request.
- Small tasks should not require full six-bucket planning when there are no meaningful unknowns.
- Assumptions must be distinguished from Open Questions.
- Blocking Open Questions must be asked before implementation.
- Safe assumptions can be recorded and work can continue.
- Planning Review and Design Review should have complexity thresholds.
- The workflow must avoid checklist theater and focus on discovering missing knowledge.

## Assumptions

- This is a documentation and template rule update only.
- Existing review-first workflow remains the default for complex or ambiguous work.

## Open Questions

- None.

## Risk Areas / Unknowns

- Agents may overuse the lightweight path for tasks that actually contain hidden risk.
- Generated projects need the same rule language, otherwise APB's own behavior and template behavior will diverge.

## Out of Scope

- No CLI behavior changes.
- No automation for task complexity classification.

## Validation Plan

- Confirm `.agent/AGENTS.md` and `templates/.agent/AGENTS.md` both describe the scaled workflow.
- Confirm an ADR records the rule change.
- Confirm review history captures the accepted lightweight interpretation.
