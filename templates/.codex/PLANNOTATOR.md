# Plannotator Usage

Use Plannotator as the review layer when available.

## Planning Review

Before freezing planning:

```bash
plannotator annotate .agent/planning/
```

## Design Review

Before freezing design:

```bash
plannotator annotate .agent/docs/
```

## Code Review

Before completing milestone implementation:

```bash
plannotator review
```

## Review Summary

After feedback is approved, summarize decisions into:

```text
.agent/review-history/
```
