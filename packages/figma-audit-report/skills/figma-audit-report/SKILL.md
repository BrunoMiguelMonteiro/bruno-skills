---
name: figma-audit-report
description: Generates the final myFCT Figma audit report — writes a structured Markdown report with executive summary and creates annotated frames on a dedicated Figma page. Use when generating the final output of a myFCT Figma audit.
---

# figma-audit-report

Third and final step of the myFCT audit pipeline. Reads findings from `figma-audit-analyze`, generates a Markdown report, and creates visual annotations in the Figma file.

**Pipeline:**
```
figma-audit-setup → *-config.md
figma-audit-analyze → *-findings.md
figma-audit-report → *-report.md + "🔍 Audit Findings" page   ← this skill
```

## Prerequisite: Desktop Bridge

**Before any Figma write operations:**
1. Tell Bruno: _"Please activate the Desktop Bridge plugin in Figma before continuing."_ (Figma Desktop → Plugins → Development → figma-desktop-bridge → Run)
2. Verify with `figma_get_status`
3. Only proceed when status confirms connection

## Process

### 1. Read findings

Find the most recent `*-findings.md` in `docs/audits/` (or ask Bruno for path).

### 2. Generate Markdown report

Create `docs/audits/YYYY-MM-DD-[name]-report.md`:

```markdown
# Audit Report — [flow name]
Date: YYYY-MM-DD
Config: [path] | Findings: [path]

---

## Executive Summary

| Severity | UI Patterns | Microcopy | Total |
|----------|-------------|-----------|-------|
| 🔴 Critical | N | N | N |
| 🟡 Attention | N | N | N |
| 🔵 Suggestion | N | N | N |
| **Total** | **N** | **N** | **N** |

### Design System Pattern Candidates
- [N patterns identified]

---

## Detailed Findings

### UI Patterns
#### 🔴 [UI-001] [Title]
- **Frame:** `[name]` (node: `[nodeId]`)
- **Problem:** [description]
- **Recommendation:** [concrete action]

### Microcopy
#### 🔴 [MC-001] [Title]
- **Frames:** `[frame A]`, `[frame B]`
- **Problem:** [description]
- **Recommended term:** [correct term]

---

## Vocabulary to Update

Terms to add or correct in `vocabulary/`:

| Incorrect term | Correct term | Context |
|----------------|--------------|---------|
| [term] | [term] | [where to use] |

---

## Next Steps (by priority)

1. **[Action] — [finding IDs]** — [short description]
```

### 3. Create Figma page "🔍 Audit Findings"

**Check if page already exists (avoid duplicates):**

```javascript
await figma.loadAllPagesAsync();
const existing = figma.root.children.find(p => p.name === '🔍 Audit Findings');
// Use existing if found, otherwise create new
```

**Create page structure via `figma_execute`:**

```javascript
const page = figma.createPage();
page.name = '🔍 Audit Findings';

const uiSection = figma.createSection();
uiSection.name = 'UI Patterns';

const mcSection = figma.createSection();
mcSection.name = 'Microcopy';

page.appendChild(uiSection);
page.appendChild(mcSection);
```

**For each critical and attention finding**, create an annotation frame containing:
- Title: `[ID] [Finding title]`
- Severity badge (🔴/🟡/🔵)
- Screenshot of original frame (if available)
- Problem description
- Recommendation

Arrange frames in horizontal grid with 32px spacing inside each section.

### 4. Final verification

1. Take screenshot of "🔍 Audit Findings" page with `figma_take_screenshot`
2. Confirm frames are readable
3. Report to Bruno: report path + number of annotation frames created

## Error Handling

| Situation | Action |
|-----------|--------|
| `figma_get_status` fails | Ask Bruno to activate Desktop Bridge plugin |
| Page "🔍 Audit Findings" already exists | Use existing, add findings without duplicating |
| Invalid node ID for screenshot | Skip screenshot for that finding, continue |
| Finding without node ID | Create text-only annotation frame |
