# Use Note-Linked Agent Memory

## Status

Approved

## Context

APB already stores durable agent memory under `.agent/`, but much of that memory is organized as independent linear documents. As projects grow, agents need a faster way to trace relationships between project context, business rules, architecture decisions, planning, reviews, modules, workflows, and domain concepts.

The project owner requested an Obsidian-inspired approach: not installing Obsidian, but using its fundamental model of note-based knowledge connected by links.

## Decision

APB will treat `.agent/` as a plain-Markdown knowledge graph.

`.agent/index.md` is the canonical navigation entry point for durable agent memory. Agents should start there when they need broad orientation, then follow relative Markdown links to the relevant source-of-truth notes.

Required knowledge must remain readable in plain Markdown and must not depend on Obsidian-only syntax, canvas files, Dataview queries, embeds, or plugin metadata. Wiki-style links may be used only as supplemental editor affordances.

Important notes should include cross-links through `Related Knowledge` sections when links help agents trace constraints, behavior, decisions, or implementation boundaries. Simple YAML frontmatter may be used for metadata such as `type`, `status`, `updated`, and `related`.

APB templates will include `.agent/index.md` and generated agent rules describing this note-linked memory convention.

## Rationale

The linked-note model improves retrieval and traceability without adding runtime dependencies or editor lock-in. Relative Markdown links preserve portability across GitHub, agents, local editors, and command-line tools.

Keeping note boundaries at durable concepts, features, modules, workflows, and decisions prevents the graph from becoming too fragmented.

## Scope

Applies to:

- `.agent/index.md`
- `.agent/AGENTS.md`
- `.agent/planning/10-note-linked-agent-memory.md`
- `.agent/review-history/2026-07-17-note-linked-agent-memory-review.md`
- `templates/.agent/index.md`
- `templates/.agent/AGENTS.md`
- `templates/.agent/project-context.md`
- `templates/.agent/docs/README.md`

## Consequences

- Agents get a clear navigation surface before scanning the full repository.
- Generated projects can connect business rules, decisions, modules, concepts, workflows, and reviews over time.
- APB remains editor-neutral and domain-neutral.
- `.agent/index.md` must be updated when durable notes are added, moved, renamed, or promoted.

## Review Requirements

- Verify generated template memory remains plain Markdown.
- Verify canonical links use relative Markdown paths.
- Verify optional note categories do not force application-specific structure.
- Verify `.agent/index.md` points to current source-of-truth files.
