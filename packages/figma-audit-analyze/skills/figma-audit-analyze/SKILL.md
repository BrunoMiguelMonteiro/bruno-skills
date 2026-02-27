---
name: figma-audit-analyze
description: Analyzes a myFCT Figma file for UI pattern and microcopy inconsistencies using intelligent frame sampling — reads config, takes screenshots, extracts text nodes, and produces a findings file. Use when running the analysis phase of a myFCT Figma audit.
---

# figma-audit-analyze

Second step of the myFCT audit pipeline. Reads the config from `figma-audit-setup`, analyzes selected pages by sampling, and produces `*-findings.md`.

**Pipeline:**
```
figma-audit-setup → *-config.md
figma-audit-analyze → *-findings.md   ← this skill
figma-audit-report → *-report.md + Figma page
```

## Process

### 1. Read config

Find the most recent `*-config.md` in `docs/audits/` (or ask Bruno for path).
Extract: file key(s), pages to audit, focus (UI Patterns / Microcopy / Both).

### 2. Get page structure

For each audited page:
```
figma_get_file_data(fileKey, depth=2, verbosity="summary")
```
List top-level frames (screens).

### 3. Sample frames

Select **2–3 representative frames per flow section**:
- Entry screen (list, dashboard, flow landing)
- Detail/edit screen (form, record)
- Final state screen (success, error, review)

Skip loading screens, splash screens, and transient states.

---

## Pass A — UI Pattern Inventory

For each sampled frame:
```
figma_capture_screenshot(nodeId, fileKey)
```

Identify:
1. **Component combinations repeated across flows** (table+filters+pagination, multi-step wizard, side panel, inline-validated form)
2. **Candidates for Design System documentation**: appears in 3+ flows? Has inconsistent variations?

Output: candidate patterns list with frequency and example frame IDs.

---

## Pass B — Consistency Analysis

### B1 — UI Patterns

Check for unjustified variations across equivalent screen types:

| Area | Check |
|------|-------|
| Heading hierarchy | H1/H2/H3 used consistently? |
| CTAs | Primary button reserved for main action? Destructive actions use correct variant? |
| Components | Same form pattern across equivalent flows? |
| CTA position | Footer / header / floating — consistent? |
| Error states | Inline validation vs toast vs modal — used with consistent criteria? |
| Spacing | Spacing tokens applied, or ad-hoc values? |

### B2 — Microcopy

Use `figma_get_file_data` with full verbosity to extract all TEXT nodes:
```
figma_get_file_data(fileKey, depth=99, verbosity="full")
```

Check systematically:

| Category | Examples |
|----------|----------|
| Equivalent labels | "Guardar" vs "Gravar" vs "Save" for the same action |
| Entity terminology | "Instituição" vs "Entidade" vs "Organização" |
| Abbreviations | "IR" vs "Investigador Responsável" — consistent? |
| Error messages | Same error described differently across flows |
| Tone | Imperative vs interrogative vs neutral — consistent? |
| Screen titles | Consistent capitalization? |
| Field labels | Capitalization, abbreviations, punctuation |

---

## Severity Classification

| Code | Meaning |
|------|---------|
| 🔴 Critical | Direct contradiction — same field/action, different labels/components in equivalent screens |
| 🟡 Attention | Pattern inconsistency — wrong component, incorrect hierarchy, unjustified variation |
| 🔵 Suggestion | Improvement opportunity — clarity, brevity, vocabulary alignment |

---

## Output: *-findings.md

Create `docs/audits/YYYY-MM-DD-[name]-findings.md`:

```markdown
# Audit Findings — [flow name]
Date: YYYY-MM-DD
Config: [config path]
Pages analyzed: [list]

## Design System Pattern Candidates

### [Pattern Name]
- Frequency: [N flows]
- Frames: `[frame name]` (node: [nodeId]), ...
- Variations found: [description]

---

## UI Patterns

### 🔴 [UI-001] [Short finding title]
- **Frame:** `[frame name]` (node: `[nodeId]`)
- **Description:** [what is wrong]
- **Recommendation:** [what to do]

## Microcopy

### 🔴 [MC-001] "[Term A]" vs "[Term B]" for the same action
- **Frames:** `[frame A]` (node: `[nodeId]`) and `[frame B]` (node: `[nodeId]`)
- **Term to adopt:** [recommended decision]
- **Description:** [context]
```

**Finding IDs:** UI-001, UI-002 / MC-001, MC-002

After creating findings.md, show Bruno a summary (X critical, Y attention, Z suggestions) and ask if anything is missing. Tell Bruno to invoke `figma-audit-report` next.
