# AI Project Bootstrap Framework

APBF is a small bootstrap framework for starting AI-assisted software projects.

## Current Version

v0.1 is intentionally simple:

- Copy template files.
- Replace `{{PROJECT_NAME}}`.
- Produce a usable project bootstrap.

No manifests, hooks, profiles, blueprints, plugins, or orchestration are included.

## Usage

Create a new APBF project:

From this repository:

```bash
npm run create-apbf -- ../my-project
```

Or:

```bash
node bin/create-apbf.js ../my-project
```

The target directory may be missing or empty. The generator stops if the target directory already contains files.

Render BA documents into project information:

```bash
npm run render-project-info -- ../my-project/input/ba-description.md ../my-project
```

Or pass a directory containing multiple source documents:

```bash
npm run render-project-info -- ../my-project/input/docs ../my-project
```

This creates:

```text
.agent/planning/02-project-summary.md
```

The renderer is intentionally simple. It reads `.md`, `.txt`, and `.docx` files, extracts recognizable sections, and leaves open questions for anything missing. Unsupported files are listed in the generated summary.

## Generated Project

The generated project includes:

- `README.md`
- `AGENTS.md`
- `CLAUDE.md`
- `.agent/AGENTS.md`
- `.agent/docs/README.md`
- `.agent/architecture-decisions/README.md`
- `.agent/review-history/README.md`
- `.agent/business-rules.md`
- `.agent/naming-conventions.md`
- `.agent/project-context.md`
- `.agent/planning/00-bootstrap.md`
- `.agent/planning/01-task-list.md`
- `.codex/PLANNOTATOR.md`
- `.codex/artifacts/`
- `.codex/previews/`
- `.codex/reviews/`

Agent-facing planning and documentation live under `.agent/`.

Root `docs/` is optional and should only be used for human-facing documentation outside the agent workflow.

Root `AGENTS.md` and `CLAUDE.md` are bridge files that point agents to `.agent/AGENTS.md`.

## Workflow Discipline

Generated projects use a review-first workflow: planning, planning review, frozen planning, implementation design, design review, frozen design, milestone implementation, code review, fixes, documentation updates, and agent knowledge updates.

Planning templates explicitly separate confirmed requirements, assumptions, open questions, risk areas, out-of-scope behavior, and validation plans. This is intended to catch requirements the owner knows but did not fully describe, and to surface unknowns neither the owner nor the agent has identified yet.

When source documents or owner requests are unclear, generated agent rules require Open Questions instead of silent guessing. Owner answers are routed into the appropriate `.agent/` memory file, such as business rules, project context, planning notes, architecture decisions, naming conventions, docs, or review history. Low-confidence interpretations stay in review drafts until approved.

## Design Principle

Delay abstraction until implementation demonstrates the need.
