# Bruno Skills

Personal Claude Code skills for writing, linguistic review, and context engineering.

## Installation

### Install all skills at once
```bash
bash <(curl -s https://raw.githubusercontent.com/BrunoMiguelMonteiro/bruno-skills/main/install-all.sh)
```

### Install individual skills

Run these slash commands inside Claude Code:

```
# Add marketplace first
/plugin marketplace add BrunoMiguelMonteiro/bruno-skills

# Then install what you need
/plugin install revisor-linguistico@bruno-skills
/plugin install article-studio@bruno-skills
/plugin install lean-writer@bruno-skills
/plugin install humanizer@bruno-skills
/plugin install digital-garden-assistant@bruno-skills
/plugin install context-engineering-assistant@bruno-skills
/plugin install context-optimizer@bruno-skills
/plugin install claude-md-auditor@bruno-skills
/plugin install research-editor@bruno-skills
/plugin install obsidian-add-book@bruno-skills
```

## Skills

| Skill | Language | Description |
|-------|----------|-------------|
| `revisor-linguistico` | PT-PT | Revisão linguística em Português (Portugal) — 6 níveis de análise |
| `article-studio` | EN | Collaborative long-form article writing assistant |
| `lean-writer` | PT | Elimina verbosidade e redundância em documentos |
| `humanizer` | EN/PT | Remove AI writing patterns systematically |
| `digital-garden-assistant` | PT | Creates atomic Zettelkasten notes (Obsidian workflow) |
| `context-engineering-assistant` | PT | Implements custom context engineering systems |
| `context-optimizer` | PT | Audits and optimizes Claude Code context configuration |
| `claude-md-auditor` | PT | Audits CLAUDE.md files for gaps and contradictions |
| `research-editor` | PT | Research editor for long-form articles |
| `obsidian-add-book` | PT | Adiciona livros ao vault Obsidian via URL (Goodreads/Wook) |

## Update

```
/plugin marketplace update bruno-skills
```

## License

MIT © Bruno Monteiro
