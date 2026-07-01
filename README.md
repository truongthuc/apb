# AI Project Bootstrap Framework

APBF is a small bootstrap framework for starting AI-assisted software projects.

## Current Version

v0.1 is intentionally simple:

- Copy template files.
- Replace `{{PROJECT_NAME}}`.
- Produce a usable project bootstrap.

No manifests, hooks, profiles, blueprints, plugins, or orchestration are included.

## Usage

From this repository:

```bash
npm run create-apbf -- ../my-project
```

Or:

```bash
node bin/create-apbf.js ../my-project
```

The target directory may be missing or empty. The generator stops if the target directory already contains files.

## Generated Project

The generated project includes:

- `README.md`
- `.agent/project-rules.md`
- `planning/00-bootstrap.md`
- `planning/01-task-list.md`

## Design Principle

Delay abstraction until implementation demonstrates the need.
