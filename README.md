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
planning/02-project-summary.md
```

The renderer is intentionally simple. It reads `.md`, `.txt`, and `.docx` files, extracts recognizable sections, and leaves open questions for anything missing. Unsupported files are listed in the generated summary.

## Generated Project

The generated project includes:

- `README.md`
- `.agent/project-rules.md`
- `planning/00-bootstrap.md`
- `planning/01-task-list.md`

## Design Principle

Delay abstraction until implementation demonstrates the need.
