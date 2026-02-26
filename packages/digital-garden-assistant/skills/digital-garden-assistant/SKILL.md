---
name: digital-garden-assistant
description: Create atomic Zettelkasten notes from sources (text, web, PDF, docs) following Ahrens & Doto principles
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
---

# Digital Garden Assistant

## Overview

Transform source material (text, web pages, PDFs, Word documents) into atomic Zettelkasten notes for an Obsidian digital garden. Extract core concepts, create properly structured markdown notes in English, and suggest connections to existing vault notes following Sönke Ahrens' and Bob Doto's Zettelkasten principles.

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

Create notes following Zettelkasten principles (see `references/zettelkasten_principles.md` for detailed guidance):

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
- User can promote to budding/evergreen manually later

### 3. Vault integration

**Vault location:**
- Ask user for vault path on first use
- Store in skill state for subsequent sessions
- Default suggestion: `~/Documents/ObsidianVault/`

**Related note discovery:**
- Search vault using Grep tool for related concepts
- Match by title keywords, tags, and content
- Suggest wikilinks to related notes
- Format: `[[Note Title]]`

**Note placement:**
- Notes go in vault root or user-specified subdirectory
- Filename: `concept-name.md` (kebab-case from title)
- Include frontmatter from `assets/note_template.md`

### 4. Interactive workflow

**Step 1: Receive source**
- User provides text, URL, file path, or document
- Confirm source type and proceed with appropriate tool

**Step 2: Analyze and extract**
- Read/fetch source material
- Identify 2-5 atomic concepts
- Present concepts as bullet list for user review

**Step 3: Confirm concepts**
- Show extracted concepts
- Ask: "These are the core concepts I identified. Which ones should become notes?"
- User can approve all, select subset, or request different extraction

**Step 4: Search related notes**
- For each approved concept, search vault
- Find notes with related keywords/topics
- Present findings: "Found 3 related notes: [[A]], [[B]], [[C]]"

**Step 5: Generate notes**
- For each concept, create note using template
- Include suggested wikilinks
- Write in English, user's own words (rephrased)
- Add source attribution in frontmatter

**Step 6: Write to vault**
- Create markdown files in vault
- Confirm: "Created 3 notes: concept-a.md, concept-b.md, concept-c.md"
- Provide file paths for user review

## Workflow example

```
User: "Help me extract concepts from this article: https://example.com/article"

Assistant: [Uses WebFetch tool]

Assistant: "I found an article about productivity. Here are the core concepts:

1. **Time Blocking** - Scheduling specific time periods for focused work
2. **Deep Work** - Sustained periods of distraction-free concentration  
3. **Attention Residue** - Mental cost of switching between tasks

Which concepts would you like me to turn into notes?"

User: "All three please"

Assistant: [Uses Grep tool to search vault]

Assistant: "Found related notes:
- Time Blocking: Related to [[Pomodoro Technique]], [[Calendar Management]]
- Deep Work: Related to [[Flow State]], [[Productivity Systems]]
- Attention Residue: Related to [[Context Switching]], [[Cognitive Load]]

[Creates 3 notes using template]

Created 3 notes:
- /vault/time-blocking.md
- /vault/deep-work.md  
- /vault/attention-residue.md

All notes are in seedling status and written in English. Review and edit as needed\!"
```

## Key principles

### Atomicity over comprehensiveness

Prefer multiple small notes over one comprehensive note. Each concept should stand alone.

**Example:**
Instead of creating "Productivity Methods.md" with sections for time blocking, deep work, and attention residue, create three separate notes.

### Rephrasing, not copying

Never copy-paste from source material. Always rephrase in your own words (as if explaining to someone unfamiliar with the topic).

**Bad:** "According to the author, deep work is activities performed in a state of distraction-free concentration..."

**Good:** "Deep work means focusing intensely on cognitively demanding tasks without interruptions. This sustained concentration enables higher quality output and faster skill acquisition."

### Connection discovery

When searching for related notes, cast a wide net:
- Search for synonyms and related terms
- Look in tags, titles, and content
- Consider conceptual relationships, not just keyword matches

### Progressive development

Remind users that notes evolve:
- Seedling notes are expected to be rough
- Connections strengthen over time
- Evergreen status emerges through revision

### Writing quality (Elements of Style)

Apply these principles when creating note content:

1. **Active voice** - "Research shows X" not "X is shown by research"
2. **Omit needless words** - "Stable baseline" not "relatively stable baseline level"
3. **Concrete language** - Use specific examples immediately
4. **Minimize m-dashes** - Prefer colons (:), commas, or parentheses ()
5. **Emphatic words at end** - "Adaptation frees attention and energy for new challenges"

**Examples for Zettelkasten:**

Bad: "The concept of cognitive load, which was developed by researchers, refers to the amount of information that working memory can hold."

Good: "Cognitive load describes how much information working memory can hold. Researchers developed this concept to understand learning constraints."

The `elements-of-style` plugin (~/.claude/plugins/cache/elements-of-style) provides comprehensive guidance if needed for complex cases.

## Resources

### references/

- `zettelkasten_principles.md` - Comprehensive guide to Zettelkasten methodology following Sönke Ahrens and Bob Doto. Load this to understand note-taking principles, maturity levels, atomicity, and common pitfalls.

### assets/

- `note_template.md` - Markdown template with frontmatter structure for new notes. Use this template when creating notes, replacing {{PLACEHOLDERS}} with actual values.

## Important notes

- **Always write notes in English**, regardless of source language
- **Always rephrase** - never copy-paste source text
- **One concept per note** - resist the urge to combine related ideas
- **Search vault before creating** - suggest existing related notes
- **Start as seedling** - user promotes to budding/evergreen later
- **Include source attribution** - URL, book title, or document name in frontmatter
