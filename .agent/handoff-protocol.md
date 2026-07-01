# Handoff Protocol

## Purpose

This document defines how architectural decisions from ChatGPT / Chief Architect are translated into executable tasks for Codex.

The protocol connects the Architecture layer and the Execution layer in APBF without becoming tooling, automation, or implementation logic.

## Roles

### Chief Architect

The Chief Architect makes decisions, reviews architecture, defines methodology, and approves or rejects artifacts.

### Codex

Codex implements approved tasks in the repository, follows project rules, reports changes, and waits for review.

## Handoff Flow

1. Architect Decision
2. Execution Request
3. Codex Implementation
4. Execution Report
5. Architect Review
6. Approval / Revision / Freeze

## Handoff Artifact Format

Every handoff should include:

- Context
- Approved Decisions
- Task
- Target Files
- Constraints
- Out of Scope
- Definition of Done
- Expected Report

## Execution Report Format

Every Codex report should include:

- Files created or modified
- Summary of changes
- Decisions preserved
- Constraints followed
- Deviations, if any
- Open questions
- Waiting for review

## Rules

- Codex must not infer new architecture.
- Codex must not expand scope.
- Codex must not create files outside the handoff unless explicitly approved.
- Codex must communicate with the owner in Vietnamese.
- Repository artifacts must remain in English.
- If unclear, Codex should ask before implementation.

## Boundary

This protocol is not tooling.

This protocol is not automation.

This protocol is not a generator.

This protocol only defines collaboration between architecture and execution layers.
