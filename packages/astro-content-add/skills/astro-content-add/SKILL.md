---
name: astro-content-add
description: Adds new content to the workingbruno Astro site (workingbruno_v6). Use this skill whenever Bruno wants to publish anything to the site — a book review, a blog post/note, a link with commentary, or a portfolio work. Triggers on phrases like "adiciona o livro", "publica esta nota", "guarda este link", "adiciona ao site", "novo post", "nova entrada no reading", or any mention of adding content to workingbruno. Also triggers when Bruno pastes text and says something like "quero publicar isto".
---

Helps Bruno add new content entries to his Astro personal site (workingbruno_v6).

## Project

**Path:** `/Users/bruno/astro/workingbruno_v6/`

## The 4 Content Types

### `reading` — Book reviews
**File:** `src/content/reading/slug-do-titulo.md`
**Cover image:** `src/assets/reading/slug-do-titulo.[ext]`

Required: `title`, `author`, `pubDate`, `cover` (path relative: `../../assets/reading/filename`), `coverAlt`
Optional: `description`, `tags`, `URL`

```yaml
---
title: 'Four Thousand Weeks'
author: 'Oliver Burkeman'
pubDate: 2023-09-28
tags: [non-fiction, essay]
URL: 'https://www.goodreads.com/book/show/54785515-four-thousand-weeks'
cover: '../../assets/reading/four-thousand-weeks.webp'
coverAlt: 'Cover of "Four Thousand Weeks" by Oliver Burkeman'
---
```

**Date format:** Always `YYYY-MM-DD`. If Bruno only gives a month, use the 1st: `2026-02-01`. The site has legacy entries with human-readable formats — ignore those and always use ISO.

**Goodreads URL:** For every book, search Goodreads and suggest the URL to Bruno. Use `curl` to fetch the search results:
```bash
curl -sL "https://www.goodreads.com/search?q=four+thousand+weeks+oliver+burkeman" | grep -o 'href="/book/show/[^"]*"' | head -3
```
Present the top match to Bruno and ask him to confirm before adding to frontmatter. If the fetch fails, give Bruno this URL to find it himself: `https://www.goodreads.com/search?q=TITLE+AUTHOR`

**Cover image handling:**
- Always save covers as `.webp` in `src/assets/reading/`
- Filename = slug of the book title (e.g., `the-timeless-way-of-building.webp`)
- Cover path in frontmatter: `../../assets/reading/slug.webp`

If Bruno provides a **URL**: download with `curl`, convert with `cwebp`:
```bash
curl -sL "https://..." -o /tmp/cover-tmp.jpg
cwebp /tmp/cover-tmp.jpg -o /Users/bruno/astro/workingbruno_v6/src/assets/reading/slug.webp
```

If Bruno provides a **path in the Personal vault**: copy and convert if not already webp:
```bash
# If already webp:
cp "/Users/bruno/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal/path/to/cover.webp" \
   /Users/bruno/astro/workingbruno_v6/src/assets/reading/slug.webp

# If jpg/png:
cwebp "/path/to/cover.jpg" -o /Users/bruno/astro/workingbruno_v6/src/assets/reading/slug.webp
```

If no cover is provided: create the file without `cover`/`coverAlt` and tell Bruno what to add and where to place it.

---

### `notes` — Blog posts / personal writing
**File:** `src/content/notes/YYYYMMDD-slug-do-titulo.md`

Required: `title`, `description`, `pubDate`
Optional: `updatedDate`, `featuredImage` + `featuredImageAlt` (paired), `tags`, `draft: true`, `lang` (default `en`)

```yaml
---
title: 'Note Title'
description: 'One sentence summarising the post.'
pubDate: 2025-10-20
tags: [knowledge-work, reading]
---
```

**Language:** Default is English — do not add `lang` unless Bruno explicitly writes in Portuguese or says the note is in Portuguese. If Portuguese, add `lang: pt`.

**Date format:** Always `YYYY-MM-DD`.

**Note on drafts:** If Bruno says "rascunho" or "draft", add `draft: true`. Drafts won't appear on the site.

---

### `links` — Curated external links with commentary
**File:** `src/content/links/YYYYMMDD-slug-do-titulo.md`

Required: `title`, `url`, `pubDate`
Optional: `description`, `draft: true`

```yaml
---
title: Writing Can Save You Time
url: https://perell.com/note/writing-can-save-you-time/
pubDate: 2025-01-28
description: How writing ideas down creates intellectual capital you can remix for life.
---

Bruno's comment or quote from the article goes here as body text.
```

**Language:** All content (title, description, body) in **English** by default. Only use Portuguese if Bruno writes his commentary in Portuguese or explicitly says so.

**Date format:** Always `YYYY-MM-DD`.

**Style note:** The body of a link entry is typically a pull quote from the article + 1-2 sentences of Bruno's commentary. If Bruno provides text, use it. If not, ask.

---

### `work` — Portfolio projects
**File:** `src/content/work/slug-do-titulo.md`

Required: `title`, `description`, `pubDate`, `client`, `role`
Optional: `updatedDate`, `tags`, `URL`, `thumbImage` + `thumbAlt` (paired), `projectCover` + `projectCoverAlt` (paired), `password: true`, `lang` (default `en`)

```yaml
---
title: 'Project Name'
description: 'What this project is.'
pubDate: 2024-06-01
client: 'Client Name'
role: 'UX Designer'
lang: pt
---
```

---

## Workflow

### Step 1 — Identify the content type

If Bruno doesn't say explicitly, infer from context:
- A book → `reading`
- An article/URL he wants to comment on → `links`
- A personal essay, weekly digest, reflection → `notes`
- A portfolio project → `work`

When unsure, ask: *"É para o reading (livro), links (artigo externo), notes (post teu) ou work (projeto de portfólio)?"*

### Step 2 — Collect missing required fields

Check what's missing from the required fields for that type. Ask only for what you need — don't run through a checklist of every optional field.

For `reading`, the cover image is almost always missing. Ask: *"Tens a capa do livro? Se sim, onde está o ficheiro?"*

For `pubDate`, if not given, use today's date.

For `links`, if Bruno pastes or mentions a URL, use the page title as a starting point for `title`.

### Step 3 — Generate the slug

Slugify the title: lowercase, accents removed, spaces → hyphens. Keep it short (3-5 words max).

Examples:
- "The Timeless Way of Building" → `the-timeless-way-of-building`
- "Leitura lenta e atenção profunda" → `leitura-lenta-atencao-profunda`

### Step 4 — Create the file

Write the file to the correct path. For `notes` and `links`, prefix the filename with today's date in `YYYYMMDD` format.

If a cover image was provided, also move/copy it to `src/assets/[type]/filename.[ext]`.

### Step 5 — Validate

Run `astro check` from the project root to confirm the frontmatter passes Zod validation:

```bash
cd /Users/bruno/astro/workingbruno_v6 && npm run build 2>&1 | head -30
```

If validation fails, read the error and fix the frontmatter. The most common issues are: missing required fields, invalid date format, image path typo.

### Step 6 — Confirm

Tell Bruno: what file was created, the full path, and any manual steps remaining (e.g., "Ainda precisas de colocar a capa em `src/assets/reading/the-timeless-way.jpg`").
