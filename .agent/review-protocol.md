# Architecture Review Protocol

## Purpose

This document defines the Architecture Review Protocol for APBF. It standardizes how architecture reviews should be performed and how review feedback should be received, addressed, and evaluated.

The protocol exists to minimize review iterations while maximizing architectural quality and decision efficiency.

## Review Principles

- Every architecture review should attempt to identify all significant issues in a single pass.
- Reviews should avoid incremental discoveries whenever reasonably possible.
- The reviewer should evaluate the artifact using a predefined review checklist.
- Reviews must distinguish missing items, suggested improvements, risks, freeze checklist items, and final verdict.
- Incremental review cycles are acceptable only when the artifact has materially changed, new requirements have emerged, or previously deferred items are being addressed.
- The objective is to minimize review iterations while maximizing architectural quality and decision efficiency.

## Review Output Structure

Every architecture review should clearly separate the following sections:

### Missing Items

Identify required concepts, sections, decisions, boundaries, or definitions that are absent from the reviewed artifact.

### Suggested Improvements

Identify changes that would improve clarity, consistency, extensibility, governance, or long-term maintainability without blocking approval.

### Risks

Identify architectural, governance, boundary, sequencing, terminology, or decision-quality risks that may affect future APBF work.

### Freeze Checklist

List the conditions that must be satisfied before the artifact can be considered ready to freeze.

### Final Verdict

State whether the artifact is approved, approved with required changes, needs revision, or is not ready for approval.

## Incremental Review Rules

Incremental review cycles are acceptable only when one or more of the following conditions is true:

- The artifact has materially changed.
- New requirements have emerged.
- Previously deferred items are being addressed.

Incremental review must not be used as the default review style. Reviewers should avoid repeatedly discovering issues that could reasonably have been identified in the first review pass.

## Standard Architecture Review Checklist

### Purpose

- Does the artifact clearly state why it exists?
- Does it have a single responsibility?
- Does it avoid solving problems outside its scope?

### Structure

- Is the document structure clear and navigable?
- Are sections ordered logically?
- Does the structure support future extension without becoming ambiguous?

### Metadata

- Does the artifact identify its status, scope, and decision context where needed?
- Is the document's role clear within the APBF repository?
- Are approval or freeze expectations explicit when relevant?

### Terminology

- Are key terms used consistently?
- Are new terms defined or clearly inferable?
- Does the artifact avoid conflicting names for the same concept?

### Layer Boundaries

- Does the artifact preserve the Methodology, Templates, and Tooling layer separation?
- Does it avoid moving implementation concerns into planning or methodology?
- Does it avoid introducing application behavior or AI Orchestrator domain logic?

### Dependencies

- Are dependencies between documents, layers, or decisions explicit?
- Does the artifact identify what must come before and after it?
- Does it avoid depending on artifacts that have not been approved when approval is required?

### Consistency

- Is the artifact consistent with `.agent/project-rules.md`?
- Is it consistent with approved planning decisions?
- Does it preserve English-only repository artifacts and Vietnamese communication when requested?

### Extensibility

- Can the artifact scale as APBF grows?
- Does it support future additions without requiring unnecessary rewrites?
- Does it avoid overfitting to a single project, domain, tool, or implementation path?

### Missing Concepts

- Are any required concepts absent?
- Are there implicit assumptions that should be made explicit?
- Are there gaps that could cause later planning, template, or tooling work to diverge?

### Risks

- What risks could result from approving the artifact as written?
- Could the artifact blur APBF boundaries?
- Could it encourage premature templates, tooling, code, runtime architecture, or orchestration?

### Freeze Checklist

- Has the artifact been reviewed against this checklist?
- Have required missing items been addressed?
- Have blocking risks been resolved or explicitly deferred?
- Is the artifact stable enough to be reused as a dependency?

### Final Verdict

- Approved.
- Approved with required changes.
- Needs revision.
- Not ready for approval.

The final verdict must be explicit and should include the reason for the decision.
