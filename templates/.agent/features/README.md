# Feature Capsules

Feature capsules provide stable, incremental routing between product knowledge and source code.

Create one capsule for each durable user-facing feature or cohesive system capability. Do not create one capsule per function, class, or temporary task.

Each capsule should define:

- A stable `feature.<name>` ID.
- A compact summary and natural-language triggers.
- Required knowledge notes.
- Metadata-only reference documents.
- A small set of source entry points.
- The broader source boundary as path patterns.
- Relevant test paths.
- Feature dependencies when they materially affect routing.

Keep bindings current when files move, public contracts change, or a feature boundary changes. Copy [the feature template](template.md) to create a capsule.

Agents normally create the first capsule automatically after targeted discovery using the vendored context-routing runtime. The template remains available for manual review and schema reference; project owners are not expected to create capsules or run routing commands.

## Related Knowledge

- [Context Routing](../docs/context-routing.md)
- [Agent Rules](../AGENTS.md)
