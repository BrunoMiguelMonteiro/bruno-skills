---
name: figma-audit-setup
description: Defines scope for a myFCT Figma design audit — lists pages, confirms which to include, excludes old versions, and writes a config file. Use when starting a Figma audit or when asked to audit a myFCT Figma file.
---

# figma-audit-setup

First step of the myFCT audit pipeline. Produces a `*-config.md` consumed by `figma-audit-analyze`.

**Pipeline:**
```
figma-audit-setup → *-config.md
figma-audit-analyze → *-findings.md
figma-audit-report → *-report.md + Figma page
```

## Process

### 1. Get URL(s)

Ask Bruno for the Figma file URL(s). Extract `fileKey` from: `figma.com/design/:fileKey/...`

### 2. List pages

```
figma_get_file_data(fileKey, depth=1, verbosity="summary")
```

Present the page list to Bruno.

### 3. Confirm scope

Ask Bruno to confirm:

**a) Pages to include** — suggest excluding:
- Older versions when a newer one exists (v1, v2 when v3 is active)
- Pages named "Deleted", "Old", "Archive", "Cover"
- Internal utilities (Icons, Components library)
- Older dated versions when a current one exists

When ambiguous (e.g., "v3" vs "v3 final" vs "v3 revisão"), ask which is the **canonical version**.

**b) Audit focus:** UI Patterns / Microcopy / Both

### 4. Write config

Create `docs/audits/YYYY-MM-DD-[name]-config.md`:

```markdown
# Audit Config — [flow name]
Date: YYYY-MM-DD
File(s): [Figma file name]
File key(s): [fileKey]

## Pages to audit
- [Page name] — canonical/active

## Excluded pages
- [Name] — old version (superseded by [X])
- [Name] — internal utility

## Focus
[UI Patterns / Microcopy / Both]

## Notes
[Any context from Bruno]
```

Confirm with Bruno before saving. Tell Bruno to invoke `figma-audit-analyze` next.
