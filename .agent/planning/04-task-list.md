# APBF Task List

## Current Goal

Turn APBF from a designed framework into a working bootstrap framework by using it on real projects and improving it only from implementation feedback.

## Task Status Legend

- `todo`: Not started.
- `doing`: In progress.
- `done`: Completed.
- `blocked`: Waiting on a decision or missing input.

## Phase 3A: Template Package

### APBF-301: Review Minimal Template Package

Status: done

Goal: Review the current minimal template package for practical usability.

Current templates:

- `templates/README.md`
- `templates/.agent/planning/00-bootstrap.md`
- `templates/.agent/planning/01-task-list.md`
- `templates/.agent/AGENTS.md`

Expected output:

- Approved template package with one implementation-feedback addition.
- Pain list from using the templates.

Review result:

- The initial package bootstrapped a usable project.
- Real usage showed that a persistent task list is needed immediately after bootstrap.
- Added `templates/.agent/planning/01-task-list.md` as a minimal project task list.
- Updated `templates/README.md` and `templates/.agent/planning/00-bootstrap.md` to reference the task list.

### APBF-302: Improve Template Variables Only If Needed

Status: done

Goal: Decide whether `{{PROJECT_NAME}}` is enough or whether v0.1 needs additional variables.

Potential variables:

- `{{PROJECT_NAME}}`
- `{{PROJECT_DESCRIPTION}}`
- `{{AUTHOR}}`
- `{{LICENSE}}`

Expected output:

- Keep current variable model or approve minimal expansion.

Decision:

- Keep only `{{PROJECT_NAME}}` for v0.1.
- Additional variables need more usage evidence.

### APBF-303: Test Template Package on Real Project

Status: done

Goal: Use APBF v0.1 to bootstrap a real repository.

Completed test:

- `ai-orchestrator`

Observed pain:

- Existing non-empty target required manual backup.
- Only one variable exists.
- Generator does not initialize Git.

## Phase 3B: Generator v0.1

### APBF-304: Keep Generator Intentionally Simple

Status: done

Goal: Validate that the generator can bootstrap a project using copy plus variable substitution.

Current behavior:

- Copy `templates/` into target directory.
- Replace `{{PROJECT_NAME}}`.
- Stop.

Deferred:

- Manifest.
- Hooks.
- Conditions.
- Profiles.
- Blueprints.
- Project specification.

### APBF-305: Decide Whether Empty Target Handling Is Enough

Status: done

Goal: Decide whether the current behavior for existing target directories is sufficient.

Current behavior:

- Allows missing target directory.
- Allows existing empty target directory.
- Rejects existing non-empty target directory.

Expected output:

- Keep current behavior or approve a small improvement.

Decision:

- Keep current behavior for v0.1.
- Rejecting non-empty targets is safer than overwriting or merging.
- Revisit only if repeated usage shows this blocks real workflows.

### APBF-306: Add Basic CLI Documentation If Needed

Status: done

Goal: Decide whether APBF needs minimal usage documentation for `create-apb`.

Expected output:

- Either add minimal README usage later or defer until more usage pain appears.

Result:

- Added root `README.md` with minimal `create-apb` usage.

## Phase 3C: Real Bootstrap Feedback

### APBF-307: Bootstrap Additional Sample Project

Status: done

Goal: Use APBF v0.1 on another small project to collect feedback.

Candidate projects:

- Small CLI.
- Small web app demo.

Expected output:

- Bootstrap result.
- Pain list.
- Whether new abstraction is justified.

Result:

- Bootstrapped temporary `sample-cli` project successfully.
- No new abstraction justified.

### APBF-308: Maintain Pain Log

Status: done

Goal: Track implementation pain before adding abstractions.

Pain categories:

- Variables.
- Optional files.
- Target directory handling.
- Template duplication.
- Documentation gaps.
- Generator behavior.

Expected output:

- Pain, frequency, severity, candidate ADR.

Result:

- Added `.agent/planning/05-pain-log.md`.
- Recorded `ai-orchestrator` and `sample-cli` bootstrap feedback.

## Phase 4: Abstraction Decisions Only If Needed

### APBF-309: Render BA Description Into Project Summary

Status: done

Goal: Let a bootstrapped project ingest BA documents and render structured project information.

Result:

- Added `apb-render-project-info`.
- The command reads a Markdown, text, DOCX file, or a directory containing supported documents.
- The command creates `.agent/planning/02-project-summary.md`.
- The renderer uses simple heading-based extraction and does not introduce AI, blueprints, manifests, hooks, or orchestration.
- Unsupported files are listed in the generated summary instead of failing the whole render.

### APBF-310: Add Question Answer Routing Workflow

Status: done

Goal: Define how APB should ask Open Questions when source documents are unclear, then use owner answers to route confirmed knowledge into the correct `.agent/` files.

Expected output:

- Planning note for question-answer routing.
- Owner-reviewed routing map.
- Template and documentation updates after approval.
- Optional CLI enhancement only if the reviewed design proves it is needed.

Result:

- Planning review chose template/rule updates only.
- Added routing rules to generated `.agent/AGENTS.md`.
- Added matching routing rules to APBF's own `.agent/AGENTS.md`.
- Documented the behavior in `README.md`.
- Deferred CLI support until real usage shows structured Open Questions are needed.

### APBF-311: Consolidate Agent Artifacts Under `.agent`

Status: done

Goal: Keep agent-facing generated artifacts, previews, and review drafts inside `.agent/`.

Result:

- Moved artifact, preview, and review placeholder directories from `.codex/` to `.agent/`.
- Removed root `CLAUDE.md` from APBF and generated templates at the time; this was later superseded by APBF-314 after Claude compatibility feedback.
- Removed generated `.codex/` template files.
- Kept root `AGENTS.md` as the only bridge file at the time; current bridge policy is documented in APBF-314.
- Updated APBF rules and README structure documentation.

### APBF-312: Prepare Repository For Public GitHub Hosting

Status: done

Goal: Make the repository safe and understandable to host as a public GitHub repository.

Result:

- Removed local machine paths from public README usage examples.
- Expanded `.gitignore` to exclude dependency folders, local environment files, logs, editor state, build output, and local archives.
- Documented that GitHub repository visibility and npm registry publication are separate decisions.
- Kept `package.json` marked private because APBF v0.1 is not prepared for npm publication.
- Added the MIT license after owner approval.

### APBF-313: Split Default README And English Backup

Status: done

Goal: Make the default GitHub README Vietnamese while preserving the previous English guidance in a table-format backup.

Result:

- Replaced root `README.md` with Vietnamese default guidance.
- Added `README.en.md` as an English table backup of the previous README content.
- Kept publication and npm-private status clear in both README files.

### APBF-314: Restore Claude Bridge File

Status: done

Goal: Ensure generated projects work with Claude by providing a `CLAUDE.md` entry point that links back to the shared agent rules.

Result:

- Restored root `CLAUDE.md` in APBF.
- Restored `templates/CLAUDE.md` for generated projects.
- Added an ADR superseding the previous decision to omit `CLAUDE.md`.
- Updated README files and agent rules to state that `AGENTS.md` and `CLAUDE.md` are thin bridge files, while `.agent/AGENTS.md` remains the source of truth.

### APBF-315: Rename CLI Commands To APB

Status: done

Goal: Use APB command names instead of APBF command names.

Result:

- Replaced old APBF command names with `create-apb` and `apb-render-project-info`.
- Renamed CLI implementation files under `bin/`.
- Updated package metadata, scripts, README files, and generated template wording.

### APBF-401: Evaluate Whether Manifest Is Needed

Status: todo

Goal: Decide whether real usage requires a template manifest.

Do not start unless implementation pain shows copy plus substitution is insufficient.

### APBF-402: Evaluate Whether Profiles Are Needed

Status: todo

Goal: Decide whether real usage requires optional template profiles.

Do not start unless multiple projects need different template subsets.

### APBF-403: Evaluate Whether Blueprint Layer Is Needed

Status: todo

Goal: Decide whether real usage requires a Blueprint layer.

Do not start unless templates become too rigid, duplicated, or cross-dependent.

## Deferred Ideas

These are intentionally deferred:

- Blueprint system.
- Project specification.
- Template manifest.
- Template profiles.
- Plugin system.
- Advanced generator logic.
- Git initialization.
- GitHub Actions templates.
- VSCode templates.
- Docs template package.
- Release packaging.

## Operating Principle

Delay abstraction until implementation demonstrates the need.
