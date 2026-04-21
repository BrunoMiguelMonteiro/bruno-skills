---
name: digital-garden-assistant
description: Create atomic Zettelkasten notes from sources (text, web, PDF, docs) following Ahrens & Doto principles. Detects existing concepts and updates them instead of creating duplicates.
argument-hint: [source-text|url|file-path]
allowed-tools:
  - AskUserQuestion
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - WebFetch
  - Skill(document-skills:*)
  - mcp__qmd__vsearch
  - mcp__qmd__query
  - mcp__qmd__get
  - mcp__qmd__search
---

# Digital Garden Assistant

## Overview

Transform source material (text, web pages, PDFs, Word documents) into atomic Zettelkasten notes for an Obsidian digital garden. Extract core concepts, detect existing vault notes that cover the same concept, and either create new seedling notes or enrich existing ones — following Sönke Ahrens' and Bob Doto's Zettelkasten principles.

See `references/zettelkasten_principles.md` for detailed methodology guidance.

## Core capabilities

### 1. Source material analysis

Accept input from multiple source types:
- **Plain text** - Pasted excerpts or passages
- **Web pages** - URLs via WebFetch tool
- **PDF documents** - Via Skill tool (document-skills:pdf)
- **Word documents** - Via Skill tool (document-skills:docx)
- **Markdown files** - Direct reading from filesystem

For each source, analyze to:
- Identify 2-5 core concepts (not summaries)
- Extract key insights that deserve standalone notes
- Recognize novel ideas worth capturing
- Distinguish between examples and concepts

### 2. Atomic note creation

Create notes following Zettelkasten principles:

**Note structure:**
- One concept per note
- Written in complete sentences
- Standalone (understandable without reading other notes)
- In user's own words (rephrase, never copy-paste)
- English language
- Proper frontmatter with status, tags, source

**Maturity levels:**
- 🌱 **Seedling** - Initial capture, rough, few connections
- 🌿 **Budding** - Rephrased, some connections, being developed
- 🌲 **Evergreen** - Fully developed, well-connected, refined

**Starting status:**
- New notes from source material → `status: seedling`
- User promotes to budding/evergreen manually later

**Note template:** Use `assets/note_template.md` as the base structure for every new note.

### 3. Vault location

Vault is at: `/Users/brunomonteiro/Library/Mobile Documents/iCloud~md~obsidian/Documents/Garden`

Notes go in category subfolders:
- `ai-systems/` — ML architectures, LLMs, technical AI concepts
- `interaction-design/` — HCI, UX, interface paradigms
- `computing-history/` — History and philosophy of computing
- `people/` — Thinkers (only when 3+ concepts in vault)
- `design/` — Design concepts and systems
- `psychology/` — Cognitive science, mental models
- `society/` — Social concepts, culture
- `art/` — Art concepts and theory
- `photography/` — Photography techniques

---

## Interactive workflow (7 steps)

### Step 1: Receive source

User provides text, URL, file path, or document. Confirm source type and read/fetch content with the appropriate tool.

### Step 2: Analyze and extract

Read/fetch source material. Identify 2-5 atomic concepts. Present as bullet list for user review:

```
Identified concepts:
1. **Time Blocking** — scheduling specific time periods for focused work
2. **Attention Residue** — mental cost of switching between tasks
3. **Deep Work** — sustained distraction-free concentration

Which ones should I process?
```

### Step 3: Semantic vault check

For each approved concept, run a semantic search:

```
mcp__qmd__vsearch: "[concept name]" with limit=5, minScore=0.5
```

Classify each result by score:
- **Score ≥ 0.75** → MATCH — concept likely already exists → propose UPDATE
- **Score 0.50–0.74** → RELATED — suggest as wikilink
- **Score < 0.50** → ignore

### Step 4: Confirm with user

Present the classification for every concept before doing anything:

```
Semantic check results:

"Deep Work"
  ⚠️  MATCH: [[Flow State]] (0.83) — very similar concept exists. Update that note or create new?
  🔗 RELATED: [[Cognitive Load]] (0.61)

"Attention Residue"
  ✅ NEW — no overlapping notes found
  🔗 RELATED: [[Context Switching]] (0.58)

"Time Blocking"
  ✅ NEW — no overlapping notes found
```

For each MATCH, ask: update existing note or create a distinct new one?

### Step 5a: CREATE (new concept)

Generate a new seedling note using `assets/note_template.md` as base structure:
- Fill frontmatter: `created` and `edited` = today's date, `status: seedling`, `publish: false`
- Use YAML list format for tags (not inline array)
- Write body in prose paragraphs — opening definition, then elaboration
- Embed [[wikilinks]] within prose where the relationship has natural context
- List remaining related notes under `## Related concepts` with one-sentence descriptions
- Add `## Questions` if open questions arise naturally
- Place in correct category subfolder

### Step 5b: UPDATE (existing concept)

For notes flagged as MATCH and confirmed for update:
1. Read the existing note using `mcp__qmd__get`
2. Identify what new information the source adds that isn't already covered
3. Enrich the note body — add new perspective, examples, or connections
4. Update `edited` field to today's date
5. Add new wikilinks if relevant
6. **Never delete existing content** — only add or expand
7. **Do not change `status`** — user promotes maturity manually
8. **Do not change `source`** — if the new source is significant, add a `sources` list in frontmatter
9. If new information contradicts existing content, add a clearly marked note: `> ⚠️ Note: [source] presents a different view — review needed`

### Step 6: Write to vault

Execute all CREATE and UPDATE operations. Confirm:

```
Done:
  ✅ Created: ai-systems/attention-residue.md
  ✅ Created: ai-systems/time-blocking.md
  ✅ Updated: psychology/flow-state.md (added section on Deep Work)
```

### Step 7: Lint pass (optional)

After all writes, offer a quick lint check:

> "Run lint check? I'll scan for missing connections between notes touched this session. (yes / skip)"

If yes:
1. For each note touched this session, run `mcp__qmd__vsearch` with its title
2. From top-5 results (score ≥ 0.55), identify notes that don't already link to each other
3. Present concise suggestions:

```
Lint — suggested connections:
• [[Attention Residue]] → [[Flow State]] — not yet linked (score: 0.71)
• [[Time Blocking]] → [[Deep Work]] — not yet linked (score: 0.68)

Add these links? (all / select / skip)
```

4. For confirmed suggestions, add wikilinks to the relevant notes via Edit.

---

## Key principles

### Atomicity over comprehensiveness

Prefer multiple small notes over one comprehensive note. Each concept must stand alone.

Instead of "Productivity Methods.md" with three sections, create three separate notes.

### Rephrasing, not copying

Never copy-paste from source material. Always rephrase as if explaining to someone unfamiliar with the topic.

**Bad:** "According to the author, deep work is activities performed in a state of distraction-free concentration..."

**Good:** "Deep work means focusing intensely on cognitively demanding tasks without interruptions. Sustained concentration enables higher quality output and faster skill acquisition."

### Update over duplicate

When a MATCH is found, default to updating the existing note. Only create a new note when the concept is genuinely distinct — not just similar in wording.

### Connection discovery

Cast a wide semantic net when searching. Conceptual relationships matter more than keyword matches. The `mcp__qmd__vsearch` tool handles this; trust scores above 0.55.

Prefer wikilinks embedded in prose (where the relationship has argument) over links collected only in `## Related concepts`.

### Progressive development

Notes evolve over time:
- Seedling notes are expected to be rough
- Connections strengthen as the vault grows
- Evergreen status emerges through deliberate revision

### Writing quality (Elements of Style)

1. **Active voice** — "Research shows X" not "X is shown by research"
2. **Omit needless words** — "Stable baseline" not "relatively stable baseline level"
3. **Concrete language** — use specific examples immediately
4. **Minimize m-dashes** — prefer colons, commas, or parentheses
5. **Emphatic words at end** — "Adaptation frees attention and energy for new challenges"

---

## Important notes

- **Always write notes in English**, regardless of source language
- **Always rephrase** — never copy-paste source text
- **One concept per note** — resist combining related ideas
- **Semantic check before creating** — use vsearch, not just Grep
- **Update beats duplicate** — enrich existing notes when concepts overlap
- **Start as seedling** — user promotes to budding/evergreen manually
- **Include source attribution** — URL, book title, or document name in frontmatter
