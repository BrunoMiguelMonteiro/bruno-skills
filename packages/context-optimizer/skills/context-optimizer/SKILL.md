---
name: context-optimizer
description: Audit context usage and suggest optimizations for Claude Code configuration
---

# Context Optimizer Skill

**Purpose**: Audit skills, plugins, and agents for duplications, overlaps, and optimization opportunities. Generate actionable recommendations to reduce token usage.

## When to Use

Invoke this skill when:
- Bruno wants to audit his Claude Code context usage
- Bruno asks to "optimize context", "check for duplicates", or "reduce token usage"
- Bruno mentions context budget concerns (approaching 200k limit)
- Bruno wants to understand what's consuming context

## Workflow

### Phase 1: Input Collection

1. **Request /context output**:
   ```
   Por favor executa o comando `/context` no Claude Code e cola o output completo aqui.
   ```

2. **Wait for Bruno to paste** the complete output

3. **Save to temporary file**:
   - Use Write tool to save pasted content to `/tmp/context-raw.txt`

### Phase 2: Analysis Pipeline

Execute these scripts in sequence using Bash tool:

```bash
cd /Users/bruno/.claude/skills/context-optimizer

# 1. Parse context output
python3 scripts/parse_context.py /tmp/context-raw.txt > /tmp/context.json

# 2. Run analysis (duplicates + overlaps + impact)
python3 scripts/analyze.py /tmp/context.json > /tmp/report.json
```

### Phase 3: Present Results

1. **Read report**: Use Read tool to load `/tmp/report.json`

2. **Generate executive summary**:
   - Show score global + badge
   - Show breakdown: duplicates / overlaps / organization
   - Show recoverable tokens and new usage %
   - List TOP 5 priority actions

3. **Format each priority action** following this template:

```markdown
### [SEVERITY] Problema: Nome

**Descrição**: [descrição clara]
**Impacto**: [X tokens recuperáveis]

#### ✅ MANTER:
- **Nome**: [qual instância]
- **Razão**: [justificação]
- **Localização**: [path completo]
- **Tokens**: [X]

#### 🗑️ REMOVER:
Para cada instância:
- **Path**: [path completo]
- **Comando**: `[comando shell específico]`
- **Tokens**: [X]

[Se aplicável]
#### ⚠️ ATENÇÃO:
- [Warnings específicos]
- [Dependências conhecidas]
```

4. **Offer options**:
   ```
   A. Ver todos os problemas detalhados (incluindo LOW severity)
   B. Gerar ficheiro optimization-report.md completo
   C. Ver estatísticas por categoria
   D. Terminar
   ```

### Phase 4: Follow-up Actions

**Option A - Detailed view**:
- Show all problems including LOW severity
- Organize by category (duplicates / overlaps / organization)

**Option B - Full report**:
- Generate markdown report using template
- Save to `/tmp/context-optimization-report-[DATE].md`
- Tell Bruno the path

**Option C - Category stats**:
- Show breakdown by category (skills / agents / plugins)
- Show health score per category
- Identify categories with most issues

**Option D - Terminate**:
- Ask if Bruno wants to save history
- If yes, create entry in `data/history.jsonl`
- Thank and close

## Critical Rules

### Decision Hierarchy for "Which to Keep"

When multiple instances exist, apply this hierarchy:

1. **Plugin oficial** > custom implementations
2. **Canonical location** (`~/.claude/skills/`) > agent cache (`~/.claude/agents/.agents/`)
3. **Smaller token count** = more optimized
4. **Most recent mtime** = latest version
5. **Better description** quality

### Command Generation

**For removal**:
- Directory: `rm -rf [path]`
- Symlink: `rm [path]`

**For archive** (when preservation needed):
- `mkdir -p ~/.claude/archive/[category] && mv [path] ~/.claude/archive/[category]/`

### Overlap Actions

| Scenario | Action | Rationale |
|----------|--------|-----------|
| Plugin vs Custom | Keep plugin, remove custom | Official is maintained |
| Agent (>800t) vs Skill | Keep agent | Agent for complex |
| Agent vs Skill (<300t) | Keep skill | Skill for specific |
| Similar size + scope | Clarify descriptions | Need specialization |

### Always Include Warnings For

- Plugin removals: "⚠️ Verify plugin is enabled in settings.json"
- Symlink removals: "⚠️ Agent system may recreate automatically"
- Large component removals (>1k tokens): "⚠️ Verify no dependencies"
- Multiple overlaps: "⚠️ Test after removal"

## Output Style

- **Conciso**: Top 5 ações prioritárias only (not all problems)
- **Concreto**: Comandos específicos, não sugestões vagas
- **Decisivo**: Diz qual manter e porquê, não apenas "considere"
- **Português**: Toda a comunicação em português de Portugal

## Example Output

```markdown
# Auditoria de Contexto

**Score Global**: ⚠️ 49/100 - Precisa Atenção
**Data**: 2026-01-30

## 📊 Resumo Executivo
- **Total**: 49k/200k tokens (24.5%)
- **Recuperável**: 8.6k tokens (17.6% do actual)
- **Novo usage**: 40.4k tokens (20.2%)

## 🎯 Top 5 Ações Prioritárias

### 1. [HIGH] Remove duplicate: frontend-design

**Problema**: 3 instâncias encontradas, 550 tokens desperdício
**Impacto**: Recupera 400 tokens (0.8% do total)

#### ✅ MANTER:
- **Nome**: frontend-design
- **Tipo**: Plugin oficial (compound-engineering)
- **Razão**: Plugin oficial, maintained and updated
- **Localização**: `~/.claude/plugins/compound-engineering/.../skills/frontend-design`
- **Tokens**: 150

#### 🗑️ REMOVER:
1. Manual installation
   - Path: `~/.claude/skills/frontend-design/`
   - Comando: `rm -rf ~/.claude/skills/frontend-design`
   - Tokens: 200

2. Agent system cache (symlink)
   - Path: `~/.claude/agents/.agents/skills/frontend-design`
   - Comando: `rm ~/.claude/agents/.agents/skills/frontend-design`
   - Tokens: 200

#### ⚠️ ATENÇÃO:
- Verificar que plugin está enabled em `~/.claude/settings.json`
- Agent system pode recriar symlink automaticamente (é normal)

---

[... mais 4 ações ...]

---

**Ações seguintes**:
A. Ver todos os problemas detalhados
B. Gerar ficheiro optimization-report.md
C. Ver estatísticas por categoria
D. Terminar

Escolhe uma opção (A/B/C/D):
```

## History Tracking

When Bruno chooses to save history:

1. **Read existing history**: `data/history.jsonl`
2. **Append new entry**:
   ```json
   {
     "timestamp": "2026-01-30T15:30:00Z",
     "score_global": 49.0,
     "scores": {"duplicates": 43.7, "overlaps": 38.0, "organization": 74.0},
     "total_tokens": 49000,
     "recoverable": 8600,
     "duplicates_count": 5,
     "overlaps_count": 7
   }
   ```
3. **Compare with previous**: Show improvement/regression trend

## Files Reference

- `scripts/utils.py`: Utility functions (similarity, keywords, etc)
- `scripts/parse_context.py`: Parse /context output to JSON
- `scripts/analyze.py`: Consolidated analysis (duplicates + overlaps + impact)
- `references/optimization-rules.md`: Rules R1-R20 with severities
- `references/scoring-criteria.md`: Scoring system 0-100 breakdown
- `data/history.jsonl`: Historical audit records

## Limitations

- **No automatic fixes**: Only generates recommendations
- **No usage metrics**: Cannot access invocation logs (v1.0)
- **Keyword-based overlaps**: May miss subtle semantic similarities
- **Manual input**: Requires paste of /context output

## Tips for Bruno

- Run audit **monthly** to track trends
- Apply **HIGH severity** actions first
- Test after each removal (don't batch all at once)
- Keep history for comparison
- Re-run audit after applying fixes to verify improvement
