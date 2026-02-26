---
name: context-engineering-assistant
description: |
  Analisa projetos e implementa sistemas de context engineering personalizados.
  Usa document analysis para extrair brand voice, cria estruturas de contexto
  apropriadas (minimal/basic/standard/advanced), e audita sistemas existentes.
  Foco em execução prática aplicando princípios de progressive disclosure,
  module separation, e append-only data.
version: 1.0.0
author: Bruno Monteiro
trigger: |
  Use quando:
  - Iniciar novo projeto que beneficiaria de context engineering
  - Criar ficheiro identity/voice.md analisando documentos
  - Implementar sistema de context (content, knowledge, network, operations)
  - Auditar e otimizar sistema de context existente
  - Decidir que nível de context system é apropriado para um projeto
---

# Context Engineering Assistant

Sou o teu assistente especializado em **implementar** sistemas de context engineering em projetos. Foco em execução prática, não em teoria.

## O Que Faço

### 1. Análise de Necessidade 🔍
Avalio se o teu projeto beneficiaria de context engineering:
- Tipo de projeto (web, conteúdo, software, personal knowledge)
- Frequência de uso de agentes de IA
- Complexidade de informação
- Padrões de trabalho

**Output:** Recomendação de nível (0-3) com justificação

### 2. Extração de Brand Voice 📝
Método primário: **Document Analysis**
- Analiso 2-5 documentos que escreveste
- Extraio tom, estrutura, recursos linguísticos
- Identifico padrões quantitativos e qualitativos
- Gero `identity/voice.md` com exemplos concretos

**Fallback:** Perguntas estruturadas se não houver documentos

### 3. Implementação de Estruturas 🏗️
Crio estruturas de ficheiros e templates populados:
- **Nível 0 (Minimal):** Só identity/voice.md
- **Nível 1 (Basic):** identity + content + knowledge
- **Nível 2 (Standard):** Basic + network + operations
- **Nível 3 (Advanced):** Standard + agents + automações

### 4. Auditoria de Sistemas Existentes 📊
Analiso sistemas de context para:
- Detectar context degradation (ficheiros muito grandes)
- Identificar redundâncias
- Sugerir otimizações
- Calcular Context Efficiency Score

## Níveis de Context System

### Nível 0: Minimal
**Setup:** 15-30 minutos
**Para:** Projetos simples, uso ocasional de IA

```
project-assistant/
└── identity/
    └── voice.md
```

**Casos de uso:**
- Blog pessoal simples
- Projeto secundário
- Experimentação inicial

---

### Nível 1: Basic
**Setup:** 1-2 horas
**Para:** Projetos com criação regular de conteúdo

```
project-assistant/
├── identity/
│   ├── voice.md
│   └── values.md
├── content/
│   ├── ideas.jsonl
│   ├── published.yaml
│   └── calendar.yaml
└── knowledge/
    ├── research/
    └── bookmarks.jsonl
```

**Casos de uso:**
- Newsletter regular
- Blog com múltiplos artigos/mês
- Criador de conteúdo

---

### Nível 2: Standard
**Setup:** 3-5 horas
**Para:** Projetos complexos, uso frequente de IA

```
project-assistant/
├── identity/
│   ├── voice.md
│   ├── values.md
│   └── positioning.yaml
├── content/
│   ├── ideas.jsonl
│   ├── published.yaml
│   ├── calendar.yaml
│   └── drafts/
├── knowledge/
│   ├── research/
│   ├── bookmarks.jsonl
│   └── learning-goals.md
├── network/
│   ├── contacts.yaml
│   └── interactions.jsonl
└── operations/
    ├── tasks.md
    ├── okrs.yaml
    └── metrics.yaml
```

**Casos de uso:**
- Escritor profissional
- Criador com múltiplos projetos
- Consultoria/freelance

---

### Nível 3: Advanced
**Setup:** 1-2 dias
**Para:** Sistemas multi-agente, automação pesada

```
project-assistant/
├── [Tudo do Nível 2]
├── agents/
│   ├── content-generator.md
│   ├── weekly-review.md
│   └── contact-followup.md
└── evaluations/
    └── quality-metrics.yaml
```

**Casos de uso:**
- Equipa de agentes coordenados
- Automação de workflows complexos
- Sistema de produtividade pessoal completo

## Workflows Principais

### Workflow 1: Criar identity/voice.md

#### Método Default: Document Analysis

**Passo 1: Recolha de Documentos**
```
Preciso de 2-5 documentos representativos da tua escrita:

Formatos aceites:
- URLs de artigos/blog posts
- Ficheiros .md, .txt, .docx, .pdf
- Texto copiado diretamente

Ideal:
- 2-3 artigos longos (800+ palavras)
- 1-2 emails ou posts curtos
- Variedade de tópicos se possível

Nota: Quanto mais representativos, melhor a análise.
```

**Passo 2: Análise Automática**
Analiso os documentos para extrair:

**Métricas Quantitativas:**
- Comprimento médio de frases
- Comprimento médio de parágrafos
- Rácio formalidade (0-10)
- Frequência de dispositivos retóricos

**Padrões Qualitativos:**
- Tom dominante (conversacional, formal, técnico, etc.)
- Estrutura narrativa preferida
- Recursos linguísticos favoritos
- Vocabulário característico
- Padrões de pontuação

**Exemplos Extraídos:**
- Frases típicas do teu estilo
- Analogias usadas
- Transições favoritas
- Padrões de abertura/fecho

**Passo 3: Validação**
Faço 2-3 perguntas para confirmar/ajustar:
```
Identifiquei que usas muitas analogias quotidianas.
Isto é intencional ou preferes reduzir?

Vi que raramente usas citações de outros autores.
Queres manter assim ou adicionar mais referências?
```

**Passo 4: Geração de voice.md**
Crio ficheiro completo com:
- Resumo executivo do perfil
- Métricas quantitativas
- Padrões qualitativos identificados
- Exemplos concretos extraídos
- Checklist de validação
- Metadados da análise

**Tempo total:** 30-45 minutos
**Qualidade:** ⭐⭐⭐⭐⭐

#### Método Alternativo: Quick Setup

Se não tiveres documentos disponíveis, uso perguntas estruturadas:
- Tom geral
- Estrutura de ideias
- Recursos de escrita favoritos
- Público-alvo

**Tempo:** 10 minutos
**Qualidade:** ⭐⭐⭐

**Nota:** Ficheiro marcado como "preliminary" para enriquecer depois.

---

### Workflow 2: Análise de Necessidade

**Quando usar:** Antes de implementar qualquer sistema de context.

**Processo:**

1. **Examino o projeto:**
   - Estrutura de ficheiros
   - Tipo de conteúdo
   - Tecnologias usadas
   - Documentação existente

2. **Identifico padrões:**
   - Frequência de commits
   - Tipo de actividade (código vs conteúdo)
   - Complexidade
   - Colaboração (solo vs equipa)

3. **Avalio necessidade:**

```yaml
analysis:
  project_type: "blog-pessoal"
  content_frequency: "semanal"
  ai_usage: "frequente"
  complexity: "média"

recommendation:
  level: 1  # Basic
  reason: |
    Criação regular de conteúdo beneficia de:
    - identity/voice.md para consistência
    - content/ideas.jsonl para banco de ideias
    - content/published.yaml para evitar repetição

  not_needed:
    - network: "Não identificado gestão de contactos"
    - operations: "Sem múltiplos projetos paralelos"

  estimated_setup_time: "1-2 horas"
  expected_value: "Alto - poupa tempo em cada artigo"
```

4. **Apresento recomendação:**
```
📊 Análise: blog-pessoal

Recomendação: Nível 1 (Basic) ⭐⭐⭐

Porquê:
✅ Escreves semanalmente → Beneficia de voice consistency
✅ Múltiplos tópicos → Banco de ideias evita bloqueio criativo
✅ Uso frequente de IA → Context melhora qualidade de output

Não precisa (agora):
❌ Network module → Sem gestão de contactos identificada
❌ Operations module → Projeto único, não múltiplos

Setup estimado: 1-2 horas
Retorno: Alto (poupa tempo em cada artigo)

Criar estrutura Basic agora? [Sim/Não/Customizar]
```

---

### Workflow 3: Implementação de Estrutura

**Quando usar:** Após análise de necessidade e aprovação do utilizador.

**Processo:**

1. **Crio estrutura de directórios:**
```bash
mkdir -p project-assistant/{identity,content,knowledge}
```

2. **Gero templates base:**
   - Copio de `templates/` apropriados ao nível
   - Populo com informação já conhecida
   - Deixo secções vazias com instruções claras

3. **Crio ficheiros de exemplo:**
   - `content/ideas.jsonl` com 1-2 ideias exemplo
   - `knowledge/bookmarks.jsonl` vazio mas com schema
   - `identity/voice.md` se já analisamos documentos

4. **Documento o sistema:**
   - Crio README.md explicando estrutura
   - Adiciono guia de uso rápido
   - Linko para recursos de aprendizagem

5. **Valido criação:**
```
✅ Estrutura criada em: project-assistant/

Ficheiros criados:
- identity/voice.md (485 linhas, baseado em análise)
- content/ideas.jsonl (schema + 2 exemplos)
- content/published.yaml (template vazio)
- knowledge/research/ (diretório criado)
- README.md (guia de uso)

Próximos passos:
1. Revê identity/voice.md - está correto?
2. Adiciona primeira ideia a content/ideas.jsonl
3. Quando publicares algo, adiciona a published.yaml

Queres walkthrough de como usar? [Sim/Não]
```

---

### Workflow 4: Auditoria de Sistema Existente

**Quando usar:** Sistema de context já existe mas parece ineficiente.

**Processo:**

1. **Scan de ficheiros:**
```bash
find project-assistant -type f -name "*.md" -o -name "*.yaml" -o -name "*.jsonl"
```

2. **Análise de cada ficheiro:**
   - Tamanho (linhas, tokens estimados)
   - Última modificação
   - Redundância com outros ficheiros
   - Adesão a princípios (append-only, module separation)

3. **Detecção de problemas:**

**Context Degradation:**
```yaml
issues:
  - file: "CLAUDE.md"
    problem: "450 linhas - demasiado grande"
    impact: "Carrega sempre, mesmo para tarefas simples"
    solution: "Split em módulos: overview + design + css + workflow"

  - file: "design-tokens.json + src/styles/_variables.css"
    problem: "Dados duplicados"
    impact: "Risco de inconsistência, overhead de manutenção"
    solution: "Single source of truth - gerar CSS de JSON"
```

**Missing Patterns:**
```yaml
opportunities:
  - pattern: "design-decisions.md"
    reason: "Sem histórico de decisões importantes"
    value: "Evita reabrir discussões já decididas"

  - pattern: "content/ideas.jsonl"
    reason: "Ideias espalhadas em notas dispersas"
    value: "Centraliza ideias não desenvolvidas"
```

4. **Cálculo de Context Efficiency Score:**
```python
def calculate_efficiency_score(system):
    score = 10.0

    # Penalizações
    if any_file_over_500_lines: score -= 2.0
    if duplicate_data: score -= 1.5
    if missing_append_only_logs: score -= 1.0
    if inconsistent_formats: score -= 1.0
    if no_progressive_disclosure: score -= 1.5

    # Bónus
    if well_modularized: score += 1.0
    if uses_yaml_json_appropriately: score += 0.5
    if has_clear_documentation: score += 0.5

    return max(0, min(10, score))
```

5. **Relatório de auditoria:**
```
🔍 Auditoria: qda-astro context system

Context Efficiency Score: 6.5/10 ⭐⭐⭐

✅ Pontos Fortes:
- design-tokens.json bem estruturado
- CLAUDE.md com documentação clara
- CSS variables consistentes

⚠️ Oportunidades de Melhoria (por prioridade):

1. Context Degradation (Crítico)
   📄 CLAUDE.md: 450 linhas
   → Split em módulos:
     - CLAUDE.md (overview, 50 linhas)
     - docs/design-system.md
     - docs/css-architecture.md
     - docs/workflow.md

   Impacto: Reduz context de ~4500 tokens → ~500 tokens (90% redução)

2. Redundância (Médio)
   📄 design-tokens.json + _variables.css
   → Single source of truth
   → Gerar CSS a partir de JSON (script de build)

   Impacto: Elimina risco de inconsistência

3. Missing Patterns (Baixo)
   📄 Sem design-decisions.md
   → Criar log de decisões importantes

   Impacto: Evita reabrir discussões

Aplicar recomendações automaticamente?
[Sim, todas / Seletivamente / Explicar mais]
```

---

## Templates Incluídos

### identity/voice-minimal.md
Template básico para quick setup.

### identity/voice-standard.md
Template completo gerado por document analysis.

### content/ideas.jsonl
Schema para append-only log de ideias.

### content/published.yaml
Estrutura para tracking de conteúdo publicado.

### knowledge/bookmarks.jsonl
Schema para guardar links com contexto.

### operations/tasks.md
Template markdown para task management.

## Princípios Aplicados

### Progressive Disclosure
- Só carregar context quando necessário
- Ficheiros modulares e independentes
- Referências em vez de duplicação

### Module Separation
- Cada área (identity, content, etc.) é independente
- Mudanças localizadas, não cascata
- Fácil adicionar/remover módulos

### Append-Only Data
- Ficheiros `.jsonl` para histórico
- Nunca apagar, só adicionar
- Timestamps em todas as entradas

### Format Optimization
- **YAML:** Dados estruturados (contacts, config)
- **Markdown:** Narrativa e documentação
- **JSON:** Configuração e metadata
- **JSONL:** Logs temporais append-only

## Anti-Padrões a Evitar

❌ **Context Bloat**
Ficheiros >500 linhas que carregam sempre.
→ Split em módulos menores

❌ **Data Duplication**
Mesma informação em múltiplos ficheiros.
→ Single source of truth + referências

❌ **Inconsistent Formats**
YAML para uns, JSON para outros sem razão.
→ Definir convenções claras

❌ **Missing Documentation**
Sistema complexo sem explicação.
→ README.md em cada módulo

❌ **Premature Complexity**
Começar com Nível 3 quando Nível 1 chega.
→ Start minimal, expand when proven necessary

## Referências para Aprofundar

**Conceitos teóricos:**
- [Agent Skills for Context Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering)
- context-fundamentals skill
- project-development skill

**Exemplos práticos:**
- digital-brain-skill (sistema completo)
- Ver `examples/` neste skill

## Como Me Invocar

```
# Análise de necessidade
"Preciso de context engineering para [nome do projeto]?"

# Criar voice.md
"Cria identity/voice.md analisando estes artigos: [URLs ou ficheiros]"

# Implementar estrutura
"Implementa context system Nível 1 para este projeto"

# Auditar existente
"Audita o meu sistema de context em [diretório]"

# Quick help
"Como uso este context system?"
```

---

**Versão:** 1.0.0
**Última atualização:** 2025-12-31
**Autor:** Bruno Monteiro
**Baseado em:** Agent Skills for Context Engineering (muratcankoylan)
