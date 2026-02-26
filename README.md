# Bruno Skills

Personal Claude Code skills for writing, linguistic review, and context engineering.

## Installation

### Install all skills at once
```bash
bash <(curl -s https://raw.githubusercontent.com/BrunoMiguelMonteiro/bruno-skills/main/install-all.sh)
```

### Install individual skills
```bash
# Add marketplace first
claude /marketplace add https://github.com/BrunoMiguelMonteiro/bruno-skills

# Then install what you need
claude /plugin install revisor-linguistico@bruno-skills
claude /plugin install article-studio@bruno-skills
claude /plugin install lean-writer@bruno-skills
claude /plugin install humanizer@bruno-skills
claude /plugin install digital-garden-assistant@bruno-skills
claude /plugin install context-engineering-assistant@bruno-skills
claude /plugin install context-optimizer@bruno-skills
claude /plugin install claude-md-auditor@bruno-skills
claude /plugin install research-editor@bruno-skills
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

## Update

```bash
claude /plugin update [skill-name]@bruno-skills
```

## License

MIT © Bruno Monteiro
