---
name: claude-md-auditor
description: Audita ficheiros CLAUDE.md para detetar gaps, contradições e violações de best practices da Anthropic
triggers:
  - "Audita o CLAUDE.md"
  - "Verifica conformidade do CLAUDE.md"
  - "Analisa qualidade do CLAUDE.md"
  - "Check CLAUDE.md compliance"
---

# Claude MD Auditor

Esta skill audita ficheiros CLAUDE.md automaticamente para detetar:
1. **Gaps** - Tecnologias, ferramentas e padrões usados mas não documentados
2. **Contradições** - Informação obsoleta ou conflituosa
3. **Violações de Best Practices** - Ausência de secções recomendadas pela Anthropic

## Quando Usar

Use esta skill quando:
- Quiser verificar se CLAUDE.md está completo e atualizado
- Após adicionar novas dependências ou ferramentas ao projeto
- Após mudanças de versões de frameworks
- Periodicamente (mensal) para manutenção preventiva
- Antes de commits importantes ou releases
- Quando sentir que Claude não está a compreender bem o projeto

**Comandos de invocação:**
- "Audita o CLAUDE.md deste projeto"
- "Verifica conformidade do CLAUDE.md"
- "Analisa qualidade do CLAUDE.md"

## Workflow de Auditoria (3 Fases)

### Fase 1: Project Discovery

Objetivo: Descobrir o que o projeto realmente usa

1. **Detetar tipo de projeto**
   - Obsidian Vault (`.obsidian/`, múltiplos `.md`)
   - Astro (`astro.config.*`, ficheiros `.astro`)
   - React/Next.js (`package.json` com react/next)
   - Python API (`requirements.txt`, `pyproject.toml`)
   - Node.js API
   - Static Site

2. **Scanear tecnologias**
   - Frameworks (Astro, React, Next.js, FastAPI, etc.)
   - Config files (tailwind.config.*, tsconfig.json)
   - Dependencies (package.json, requirements.txt)

3. **Scanear ferramentas críticas**
   - Formatters (Prettier, Black)
   - Linters (ESLint, flake8)
   - Testing frameworks (Vitest, Jest, Pytest)
   - Build tools (Vite, Webpack)
   - Docker/containerization
   - Git hooks (Husky, pre-commit)

4. **Scanear scripts e comandos**
   - Scripts package.json
   - Scripts shell (.sh)
   - Scripts Python (.py)

### Fase 2: Gap & Contradiction Detection

Objetivo: Comparar discovered vs. documented

1. **Executar deteção de gaps**
   ```bash
   python3 scripts/detect_gaps.py <project_dir> > gaps.json
   ```

2. **Executar deteção de contradições**
   ```bash
   python3 scripts/detect_contradictions.py <project_dir> > contradictions.json
   ```

3. **Verificar Best Practices**
   - Verificar se secções essenciais existem
   - Calcular score de conformidade

### Fase 3: Report Generation & Suggestions

Objetivo: Apresentar resultados e oferecer correções

1. **Gerar relatório**
   ```bash
   python3 scripts/generate_audit_report.py <project_dir> gaps.json contradictions.json
   ```

2. **Apresentar ao utilizador**
   - Score global (0-100)
   - Breakdown por categoria
   - Problemas ordenados por severidade
   - Sugestões de correção

3. **Oferecer ações interativas**
   - Aplicar correções HIGH automaticamente (com confirmação)
   - Selecionar correções manualmente
   - Gerar TODO list
   - Mostrar diff preview

## Instruções de Execução

### Setup Inicial

Esta skill requer Python 3.8+ e os scripts estão na pasta `scripts/`.

**Nenhuma instalação adicional necessária** - os scripts usam apenas bibliotecas standard Python.

### Execução Completa

Quando o utilizador pedir "Audita o CLAUDE.md deste projeto":

1. **Confirmar diretório do projeto**
   ```
   Vou auditar o CLAUDE.md do projeto em: <cwd>
   Confirma que este é o diretório correto?
   ```

2. **Executar Fase 1: Discovery**
   ```bash
   cd <skill_dir>/scripts
   python3 detect_gaps.py <project_dir> > /tmp/gaps.json
   ```

   Se erros, explicar e parar.

3. **Executar Fase 2: Contradictions**
   ```bash
   python3 detect_contradictions.py <project_dir> > /tmp/contradictions.json
   ```

   Se erros, explicar e parar.

4. **Executar Fase 3: Report**
   ```bash
   python3 generate_audit_report.py <project_dir> /tmp/gaps.json /tmp/contradictions.json
   ```

   Guardar relatório em variável.

5. **Apresentar relatório ao utilizador**
   - Mostrar markdown formatado
   - Destacar score global
   - Listar top 5 ações prioritárias

6. **Perguntar próximos passos**
   ```
   Como queres proceder?

   A. Mostrar apenas problemas HIGH (mais críticos)
   B. Mostrar todos os problemas com detalhes
   C. Gerar ficheiro audit-report.md para referência
   D. Sugerir correções específicas para aplicar
   E. Não fazer nada agora
   ```

### Interpretação de Resultados

#### Scores

- **90-100** ⭐ Excelente - Conformidade exemplar
- **70-89** ✅ Bom - Conformidade sólida, pequenas melhorias
- **50-69** ⚠️ Adequado - Precisa atenção, melhorias recomendadas
- **0-49** ❌ Insuficiente - Revisão urgente necessária

#### Categorias de Problemas

**Gaps (40% do score):**
- Technology gaps: Framework/biblioteca não documentada
- Tool gaps: Formatter/linter/tester não explicado
- Script gaps: Comandos package.json não listados
- Pattern gaps: Convenções não documentadas

**Contradictions (35% do score):**
- Version mismatches: CLAUDE.md diz v1, package.json tem v2
- File references: CLAUDE.md refere ficheiro que não existe
- Tool config: CLAUDE.md diz "use X" mas X não está configurado

**Best Practices (25% do score):**
- Secções essenciais em falta
- Secções recomendadas ausentes
- Qualidade da documentação

#### Severidades

- **HIGH** 🔴: Afeta capacidade de Claude trabalhar efetivamente
- **MEDIUM** 🟡: Informação importante mas não crítica
- **LOW** 🟢: Melhorias de qualidade

## Outputs da Skill

### 1. Relatório Markdown

Relatório completo com:
- Score global e breakdown
- Lista de gaps por severidade
- Lista de contradições
- Best practices checklist
- Top 5 ações prioritárias

### 2. JSON Intermediários (opcionais)

- `gaps.json` - Dados brutos de gaps
- `contradictions.json` - Dados brutos de contradições

### 3. Sugestões Interativas

Baseado nos resultados, oferecer:
- Correções automáticas (para problemas simples)
- Sugestões de texto para adicionar ao CLAUDE.md
- Links para secções relevantes em references/

## Casos de Uso Específicos

### Caso 1: Projeto Novo Sem CLAUDE.md

Se CLAUDE.md não existir:
1. Detetar tipo de projeto
2. Oferecer criar CLAUDE.md baseado em template
3. Popular secções essenciais automaticamente
4. Pedir ao utilizador para rever e completar

### Caso 2: CLAUDE.md Muito Desatualizado

Se score < 50:
1. Mostrar relatório completo
2. Priorizar ações HIGH
3. Oferecer modo "guided update":
   - Ir secção por secção
   - Sugerir conteúdo baseado no que foi detetado
   - Pedir confirmação do utilizador

### Caso 3: CLAUDE.md Bom (70-89)

Se score 70-89:
1. Parabenizar qualidade
2. Listar pequenas melhorias
3. Oferecer aplicar correções automaticamente

### Caso 4: CLAUDE.md Excelente (90+)

Se score 90+:
1. Parabenizar conformidade exemplar
2. Mencionar apenas 1-2 melhorias opcionais
3. Não pressionar para mudanças

## Referências Técnicas

Esta skill usa conhecimento dos seguintes ficheiros:

- **references/anthropic-best-practices.md** - Guidelines oficiais Anthropic
- **references/project-type-patterns.md** - Padrões por tipo de projeto
- **references/detection-rules.md** - Regras de deteção (G1-G20, C1-C10, BP1-BP10)
- **references/scoring-criteria.md** - Sistema de pontuação

Quando em dúvida sobre severidade, padrões esperados, ou como calcular scores, consultar estas referências.

## Limitações Conhecidas

1. **Deteção de padrões** - Ainda não implementada (pattern gaps G14-G15)
2. **Convention mismatches** - Deteção básica, pode melhorar
3. **Projetos multi-tech** - Pode gerar muitos gaps se projeto usa muitas tecnologias
4. **Idiomas** - Assume inglês em código, mas suporta português em documentação

## Troubleshooting

### Script falha com "No module named 'tomli'"

Solução: tomli só é necessário para projetos Python. Se o projeto não for Python, ignorar. Se for Python, o script deve funcionar sem tomli para requirements.txt.

### Muitos false positives

Ajustar severidades ou filtrar por tipo de projeto. Alguns gaps são esperados (e.g., Docker em static sites).

### Score muito baixo injustamente

Verificar se CLAUDE.md usa nomes diferentes (e.g., "Prettier" vs "Code formatter"). Melhorar parsing em CLAUDEmdParser se necessário.

## Manutenção da Skill

### Adicionar Nova Regra de Deteção

1. Definir regra em `references/detection-rules.md`
2. Implementar lógica em `scripts/detect_gaps.py` ou `detect_contradictions.py`
3. Adicionar teste com projeto exemplo
4. Atualizar scoring se necessário

### Adicionar Novo Tipo de Projeto

1. Adicionar padrão em `references/project-type-patterns.md`
2. Atualizar `ProjectDetector._detect_project_type()` em detect_gaps.py
3. Definir ferramentas esperadas
4. Testar com projeto real desse tipo

## Exemplo de Uso

```
User: Audita o CLAUDE.md deste projeto

Claude: Vou auditar o CLAUDE.md do vault Obsidian em /Users/bruno/.../FCT.
[Executa scripts...]

Auditoria completa! Aqui estão os resultados:

# CLAUDE.md Audit Report
**Score Global:** ⭐ 92/100 - Excelente

## 📊 Scores
- Gaps: 88/100 ✅ Good
- Contradictions: 100/100 ✅ Good
- Best Practices: 95/100 ✅ Good

Encontrei apenas 2 melhorias menores:
1. Scripts de manutenção validate-vault.sh e fix-properties.py poderiam ter exemplos de output
2. Secção "Examples" poderia ter mais exemplos práticos

No geral, o CLAUDE.md está excelente! 🎉

Queres que gere um relatório completo ou está tudo bem assim?
```

---

**Nota Final:** Esta skill foi desenhada para ser proativa mas não intrusiva. Um CLAUDE.md com score 70+ já é muito bom. Não pressionar utilizador para perfeição desnecessária.
