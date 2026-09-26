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
  - Bash(curl:*)
  - Bash(ls:*)
  - Skill(document-skills:*)
  - Agent
  - mcp__plugin_qmd_qmd__query
  - mcp__plugin_qmd_qmd__get
  - mcp__plugin_qmd_qmd__multi_get
---

# Digital Garden Assistant

## Overview

Transform source material (text, web pages, PDFs, Word documents) into atomic Zettelkasten notes for an Obsidian digital garden. Extract core concepts, detect existing vault notes that cover the same concept, and either create new seedling notes or enrich existing ones — following Sönke Ahrens' and Bob Doto's Zettelkasten principles.

See `references/zettelkasten_principles.md` for detailed methodology guidance.

## Core capabilities

### 1. Source material analysis

Accept input from multiple source types:
- **Plain text** - Pasted excerpts or passages
- **Web pages** - URLs via the fetch chain below
- **PDF documents** - Via Skill tool (document-skills:pdf)
- **Word documents** - Via Skill tool (document-skills:docx)
- **Markdown files** - Direct reading from filesystem

**Web fetch chain** (try in order, move on when the result is empty, a login wall, or a client-rendered shell):
1. `curl -s "https://markdown.new/<url>"`
2. `curl -s "https://r.jina.ai/<url>"`
3. `WebFetch` (last resort)

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

**File naming (critical):** The filename must equal the note's `title` exactly, with spaces, e.g. `Attention Residue.md` for `title: "Attention Residue"`. Obsidian resolves `[[wikilinks]]` by filename, not by `title`, so kebab-case filenames (`attention-residue.md`) silently break every link to the note. Strip only characters invalid in filenames (`: / \ ? * " < > |`).

**Tags:** Always YAML list format (one `- tag` per line), never inline `[a, b]`.

**Link integrity:** Before writing any `[[Target]]`, confirm a file named `Target.md` exists in the vault (or is being created in this session). If the existing file's name differs from the concept name, link as `[[Exact Filename|Display Text]]`.

### 3. Vault location

Vault is at: `/Users/brunomonteiro/Library/Mobile Documents/iCloud~md~obsidian/Documents/Garden`

Notes go in category subfolders. The folder list evolves, so always run `ls` on the vault root first and pick from the folders that exist. Common ones:
- `ai-systems/`: ML architectures, LLMs, technical AI concepts
- `interaction-design/`: HCI, UX, interface paradigms
- `computing-history/`: History and philosophy of computing
- `people/`: Thinkers (only when 3+ concepts in vault)
- `design/`: Design concepts and systems
- `psychology/`: Cognitive science, mental models
- `society/`: Social concepts, culture
- `biology/`, `privacy/`, `books/`, `art/`, `photography/`

Special folders (not for concept notes):
- `sources/`: archived literature notes (see Step 1b)
- `bases/`, `assets/`, `shortstory/`: never write concept notes here

Create a new category folder only when no existing one fits, and say so in the Step 4 summary.

---

## Interactive workflow (8 steps)

### Step 1: Receive source

User provides text, URL, file path, or document. Confirm source type and read/fetch content with the appropriate tool (web: use the fetch chain).

### Step 1b: Archive source (optional)

For long-form sources (essays, papers, articles worth rereading) offer to archive a literature note in `sources/`, named `YYYY-MM Author - Title.md`:

```yaml
---
title: "Original Title"
author: "Author Name"
published: YYYY-MM-DD
retrieved: YYYY-MM-DD
source: "https://..."
retrieved_via: "markdown.new | r.jina.ai | WebFetch | file"
type: reference
publish: false
tags:
  - source-archive
---
```

Body: a short blockquote stating it's a personal archive (not for republication) listing `Notes derived from this source: [[...]]`, then the source content. Fill the derived-notes list after Step 6.

### Step 2: Analyze and extract

Read/fetch source material. Identify 2-5 atomic concepts. Present as bullet list for user review:

```
Identified concepts:
1. **Time Blocking**: scheduling specific time periods for focused work
2. **Attention Residue**: mental cost of switching between tasks
3. **Deep Work**: sustained distraction-free concentration

Which ones should I process?
```

### Step 3: Semantic vault check

For each approved concept, run a reranked hybrid search:

```
mcp__plugin_qmd_qmd__query:
  query: "[concept name]: [one-line description]"
  intent: "find Garden notes covering or related to this concept"
  collections: ["Garden"]
  limit: 8
```

Discard results whose file is `AGENTS.md`, `CLAUDE*.md`, `README.md`, or under `sources/`, `bases/`, `shortstory/`.

Reranked scores are top-heavy: the best hit scores high, and genuinely related notes often score only 0.15–0.40. Classify accordingly:
- **Score ≥ 0.80 and the note covers the same idea** (check title and snippet) → MATCH → propose UPDATE
- **Score ≥ 0.15 among the remaining top 5** → candidate RELATED. Read the snippet and keep it only if the relationship can be stated in one sentence
- **Otherwise** → ignore

Never classify on score alone. A high score from a note that merely mentions the term is RELATED, not MATCH.

### Step 4: Confirm with user

Present the classification for every concept before doing anything:

```
Semantic check results:

"Deep Work"
  ⚠️  MATCH: [[Flow State]] (0.86): very similar concept exists. Update that note or create new?
  🔗 RELATED: [[Cognitive Load]] (0.31)

"Attention Residue"
  ✅ NEW: no overlapping notes found → ai-systems/Attention Residue.md
  🔗 RELATED: [[Context Switching]] (0.22)
  ↩️  INCOMING: [[Context Switching]] will link here

"Time Blocking"
  ✅ NEW: no overlapping notes found → psychology/Time Blocking.md
  ↩️  INCOMING: [[Deep Work]] will link here
```

For each MATCH, ask: update existing note or create a distinct new one?

For each NEW note, name at least one existing note that will receive an incoming link to it (see Step 5c).

### Step 5a: CREATE (new concept)

Generate a new seedling note using `assets/note_template.md` as base structure:
- Fill frontmatter: `created` and `edited` = today's date, `status: seedling`, `publish: false`
- Use YAML list format for tags (not inline array)
- Write body in prose paragraphs: opening definition, then elaboration
- Embed [[wikilinks]] within prose where the relationship has natural context
- List remaining related notes under `## Related concepts` as `- [[Note]]: one-sentence description` (colon, not em dash)
- Add `## Questions` if open questions arise naturally
- Place in correct category subfolder, filename = title (see File naming)

### Step 5b: UPDATE (existing concept)

For notes flagged as MATCH and confirmed for update:
1. Read the existing note with `Read` (full path), not the qmd snippet
2. Identify what new information the source adds that isn't already covered
3. Enrich the note body: add new perspective, examples, or connections
4. Update `edited` field to today's date
5. Add new wikilinks if relevant
6. **Never delete existing content**: only add or expand
7. **Do not change `status`**: user promotes maturity manually
8. **Do not change `source`**: if the new source is significant, add a `sources` list in frontmatter
9. If new information contradicts existing content, add a clearly marked note: `> ⚠️ Note: [source] presents a different view; review needed`

### Step 5c: WIRE UP (incoming links, mandatory)

A new note with no incoming links is an orphan. For every CREATE, edit at least one existing note (the INCOMING target named in Step 4) to link to it:
- Prefer a sentence in the prose that states the relationship; otherwise add a `- [[New Note]]: description` bullet under its `## Related concepts`
- Update that note's `edited` date
- Follow Step 5b rules (never delete, never change `status`)

### Step 6: Write to vault

Execute all CREATE, UPDATE and WIRE UP operations. If a source was archived in Step 1b, fill its derived-notes list now. Confirm:

```
Done:
  ✅ Created: ai-systems/Attention Residue.md
  ✅ Created: psychology/Time Blocking.md
  ✅ Updated: psychology/Flow State.md (added section on Deep Work)
  ↩️  Linked from: ai-systems/Context Switching.md, psychology/Deep Work.md
```

### Step 7: Lint pass (always)

Run after every session, without asking:

1. **Broken links:** for every `[[Target]]` in notes touched this session, check that `Target.md` exists (`Glob` for `**/Target.md`). Fix mismatches with `[[Exact Filename|Display]]` or by correcting the link. Never leave a broken link written by this session.
2. **Incoming links:** confirm every note created this session is linked from at least one other note (`Grep` for `[[Title` across the vault).
3. **Missing connections:** for each touched note, run `mcp__plugin_qmd_qmd__query` with its title and one-line description (`collections: ["Garden"]`, `limit: 6`), and identify results with score ≥ 0.15 that are relevant but not yet linked. Present:

```
Lint: suggested connections
• [[Attention Residue]] → [[Flow State]]: not yet linked (score: 0.34)
• [[Time Blocking]] → [[Deep Work]]: not yet linked (score: 0.27)

Add these links? (all / select / skip)
```

4. For confirmed suggestions, add wikilinks to the relevant notes via Edit.

### Step 8: Orphan sweep

If the vault has an `orphan-detector` agent (`.claude/agents/orphan-detector.md`), offer to run it via the Agent tool to catch orphans across the whole vault, not just this session.

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

Cast a wide semantic net when searching. Conceptual relationships matter more than keyword matches. `mcp__plugin_qmd_qmd__query` handles this. Its reranked scores are top-heavy, so judge relevance from the snippet, not from the score alone (see Step 3).

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
- **Semantic check before creating** — use `mcp__plugin_qmd_qmd__query`, not just Grep
- **Filename = title** — `Attention Residue.md`, never `attention-residue.md`
- **No orphans, no broken links** — every new note gets an incoming link; every `[[link]]` points to an existing file
- **Update beats duplicate** — enrich existing notes when concepts overlap
- **Start as seedling** — user promotes to budding/evergreen manually
- **Include source attribution** — URL, book title, or document name in frontmatter
