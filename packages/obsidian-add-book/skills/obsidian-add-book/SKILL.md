---
name: add-book
description: Adicionar livros ao vault do Obsidian via URL (Goodreads/Wook) com auto-preenchimento de metadados
disable-model-invocation: true
---

# Add Book (Simplified)

## Overview

Adicionar livros ao vault do Obsidian a partir de URLs de Goodreads ou Wook. O skill extrai automaticamente título, autor, ISBN, sinopse e capa, depois gera biografia do autor e lista de outros livros. Criação instantânea sem confirmações.

**Localização do vault:** `/Users/bruno/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal/`
**Diretório de livros:** `03 - Recursos/Literatura/Livros/`
**Idioma:** Português de Portugal

## Input Format

O skill aceita apenas URLs de duas fontes:

```
/add-book https://www.goodreads.com/book/show/[id]-[slug]
/add-book https://www.wook.pt/livro/[slug]/[id]
```

**Exemplos válidos:**
- `/add-book https://www.goodreads.com/book/show/77566.Hyperion`
- `/add-book https://www.wook.pt/livro/desistir-adam-phillips/29896367`

**Não aceita:** Títulos, ISBNs, ou URLs de outros sites.

## Workflow (4 Passos)

### Passo 1: Parse URL

Detectar fonte do URL:

```python
if "goodreads.com" in url:
    source = "goodreads"
elif "wook.pt" in url:
    source = "wook"
else:
    # Erro: URL não suportado
    return error_message
```

**Se URL inválido:**
```
❌ URL não suportado.

Formato esperado:
- Goodreads: https://www.goodreads.com/book/show/[id]-[slug]
- Wook: https://www.wook.pt/livro/[slug]/[id]
```

### Passo 2: WebFetch - Extrair Metadados

#### 2.1 Extrair de Goodreads

Use WebFetch com prompt token-optimized:

```
WebFetch(url, prompt="""
Extrai apenas estes campos:

Título: [título completo incluindo subtítulo]
Autor: [nome completo do autor principal]
ISBN: [ISBN-13 se visível, ou "não disponível"]
Sinopse: [primeiros 2-3 parágrafos]
Capa: [URL da imagem - procura tag <img class="ResponsiveImage" ou "BookCover">]

Responde APENAS com os campos acima.
""")
```

**Parsing da resposta:**
- Extrair cada campo usando regex ou split de linhas
- Se campo crítico em falta (título ou autor) → Erro 3
- Se sinopse em inglês → marcar para tradução no Passo 3

#### 2.2 Extrair do Wook

Use WebFetch com prompt semelhante:

```
WebFetch(url, prompt="""
Extrai apenas:

Título: [título completo]
Autor: [nome do autor]
ISBN: [código ISBN ou EAN visível na página]
Sinopse: [descrição do produto, 2-3 parágrafos]
Capa: [URL da imagem principal do produto]

Responde APENAS com os campos.
""")
```

**Parsing da resposta:**
- Sinopse do Wook já está em português → não traduzir
- ISBN geralmente disponível (formato: 978-xxx-xxx-xxx-x)
- Validar campos críticos (título, autor)

### Passo 2.5: Verificar Vault

Antes de gerar qualquer conteúdo, verificar em paralelo o que já existe no vault para o autor extraído.

**A. Verificar nota biográfica em Pessoas:**
```bash
test -f "/Users/bruno/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal/03 - Recursos/Pessoas/{author_name}.md" && echo "EXISTS" || echo "NOT_EXISTS"
```
→ Guardar resultado: `pessoas_exists = true` se EXISTS, `false` se NOT_EXISTS

**B. Verificar livros do mesmo autor já no vault:**
```bash
grep -rl 'autor: "\[\[{author_name}\]\]"' "/Users/bruno/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal/03 - Recursos/Literatura/Livros/" 2>/dev/null
```
→ Guardar lista de títulos (basename sem extensão) em `existing_books[]`
→ Se nenhum resultado: `existing_books = []`

**Nota:** Estas verificações são silenciosas — não mostrar output ao utilizador.

---

### Passo 3: Gerar Conteúdo do Autor

#### 3.1 Traduzir Sinopse (se necessário)

**Detecção de idioma:**
```python
if source == "goodreads":
    # Provavelmente inglês → traduzir
    translate_synopsis = True
elif source == "wook":
    # Já português → skip
    translate_synopsis = False
```

**Se tradução necessária:**
```
Traduz para português de Portugal (tom natural e literário):

[texto sinopse]
```

Manter 2-3 parágrafos máximo.

#### 3.2 Gerar "Sobre o autor"

**Se `pessoas_exists = true`:**
- Skip WebSearch biográfico
- `AUTHOR_BIO = "![[{author_name}]]"` — embed direto da nota existente

**Se `pessoas_exists = false`:**

1. **WebSearch para informação biográfica:**
```
WebSearch("{author_name} biography author books awards")
```

2. **Sintetizar biografia:**
Com base nos resultados, escrever em Português de Portugal:
```
Autor: {author_name}

Requisitos:
- 150 palavras máximo
- 2 parágrafos
- P1: Identidade (nacionalidade, nascimento, profissão, formação)
- P2: Obras principais, prémios, temas recorrentes
- Tom enciclopédico mas envolvente
- Factualmente correto
```

3. **Criar ficheiro de Pessoas:**
Escrever o ficheiro `03 - Recursos/Pessoas/{author_name}.md` com:
```markdown
[bio gerada — sem heading # com o nome do autor]

→ [[{book_title}#Sobre o autor]]
```
Path absoluto: `/Users/bruno/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal/03 - Recursos/Pessoas/{author_name}.md`

4. **Definir embed:**
`AUTHOR_BIO = "![[{author_name}]]"`

**Em ambos os casos**, `{{AUTHOR_BIO}}` no template usa sempre o embed `![[{author_name}]]`.

#### 3.3 Gerar "Outros livros do autor"

Baseado nos resultados do WebSearch (já feito no 3.2 se `pessoas_exists = false`, ou fazer agora se `pessoas_exists = true`):

```
Lista até 5 outros livros de {author_name} (além de "{current_book}"):
Ordenar por relevância/popularidade.
Se não houver 5 livros, lista os disponíveis.
```

**Formatar cada título com base em `existing_books[]`:**

Para cada título da lista:
- **Se o título (ou versão normalizada) está em `existing_books[]`:** formatar como `[[Título]] (Ano)` — wikilink
- **Se não está em `existing_books[]`:** formatar como `*Título* (Ano)` — itálico simples

**Exemplo de output resultante:**
```markdown
- [[Partida]] (2026)           ← já existe no vault
- *Elizabeth Finch* (2022)     ← não existe
- *O Ruído do Tempo* (2016)    ← não existe
```

**Nota de normalização:** Ao comparar títulos de `existing_books[]` (basenames de ficheiro) com os títulos da lista WebSearch, considerar equivalências óbvias (capitalização, acentos).

### Passo 4: Criar Ficheiro

#### 4.1 Normalizar Filename

Transformações sequenciais:

1. **Remove acentos:** `Criação` → `Criacao`
2. **Remove especiais:** Remove caracteres especiais (dois pontos, ponto de interrogação, exclamação, ponto, vírgula, aspas)
**Resultado:** `{normalized-title}.md`

#### 4.2 Preencher Template

Ler template de `assets/book_template.md` e substituir:

```yaml
{{TITLE}} → título extraído
{{AUTHOR}} → "[[Nome do Autor]]" (wikilink com aspas — obrigatório para YAML válido no Obsidian)
{{ISBN}} → ISBN extraído (ou "" se não disponível)
{{DATE}} → "" (vazio - Bruno preenche no Obsidian)
{{STATUS}} → "" (vazio)
{{RATING}} → "" (vazio)
{{GOODREADS_URL}} → URL input (se Goodreads) ou "" (se Wook)
{{COVER_URL}} → URL capa extraída
{{TAGS}} → "  - livros" (apenas tag base)
{{SYNOPSIS}} → sinopse traduzida/original
{{AUTHOR_BIO}} → "![[Nome do Autor]]" (embed — gerado no Passo 3.2)
{{OTHER_BOOKS}} → lista gerada (mix de wikilinks e itálicos — gerado no Passo 3.3)
```

**Exemplo do campo autor no frontmatter:**
```yaml
autor: "[[Julian Barnes]]"
```

**Campos pessoais vazios:** Bruno preenche depois no Obsidian conforme necessário.

#### 4.3 Check Existência e Escrever

**Path completo:**
```
/Users/bruno/Library/Mobile Documents/iCloud~md~obsidian/Documents/Personal/03 - Recursos/Literatura/Livros/{filename}.md
```

**Verificar existência:**
```bash
test -f "{path}" && echo "Existe" || echo "Não existe"
```

**Se ficheiro EXISTE:**
```
⚠️ Ficheiro '{filename}.md' já existe.

Localização: 03 - Recursos/Literatura/Livros/

Opções:
- Abre no Obsidian para ver conteúdo existente
- Apaga manualmente se quiseres substituir
```
Não sobrescrever automaticamente.

**Se ficheiro NÃO EXISTE:**
1. Escrever ficheiro com conteúdo completo
2. Confirmar criação:
```
✅ Livro adicionado: {filename}.md

📁 Localização: 03 - Recursos/Literatura/Livros/
📖 Título: {title}
✍️  Autor: {author}

Preenche no Obsidian:
- Data de leitura, estado, classificação
- Citações à medida que lês
```

## Tratamento de Erros

### Erro 1: URL Inválido

**Trigger:** URL não contém "goodreads.com" nem "wook.pt"

**Mensagem:**
```
❌ URL inválido.

Formato esperado:
- Goodreads: https://www.goodreads.com/book/show/[id]-[slug]
- Wook: https://www.wook.pt/livro/[slug]/[id]

Exemplo: /add-book https://www.goodreads.com/book/show/77566.Hyperion
```

### Erro 2: WebFetch Falhou

**Trigger:** WebFetch retorna erro (404, timeout, site indisponível)

**Mensagem:**
```
❌ Não foi possível aceder ao URL.

Verifica:
- URL está correcto (copia directamente do navegador)
- Página existe (não é 404)
- Site está disponível

Tenta abrir o URL no navegador primeiro.
```

### Erro 3: Campos Críticos em Falta

**Trigger:** WebFetch não extrai título ou autor

**Mensagem:**
```
⚠️ Não foi possível extrair título ou autor da página.

Possíveis causas:
- Site mudou estrutura HTML
- Página não é de um livro
- URL incorrecta

Sugestões:
- Verifica se URL é da página correcta do livro
- Tenta fonte alternativa (Goodreads ↔ Wook)
```

### Erro 4: Ficheiro Já Existe

**Trigger:** Ficheiro com mesmo nome já existe no vault

**Mensagem:**
```
⚠️ Ficheiro '{filename}.md' já existe.

Localização: 03 - Recursos/Literatura/Livros/{filename}.md

Opções:
- Abre ficheiro existente no Obsidian
- Apaga manualmente se quiseres substituir com novos dados
```

## Exemplos

### Exemplo 1: Livro Inglês (Goodreads)

**Input:**
```
/add-book https://www.goodreads.com/book/show/77566.Hyperion
```

**Workflow:**
1. Parse URL → source = "goodreads"
2. WebFetch → extrair:
   - Título: "Hyperion"
   - Autor: "Dan Simmons"
   - ISBN: "978-0553283686"
   - Sinopse: (em inglês, 3 parágrafos)
   - Capa: https://m.media-amazon.com/images/.../Hyperion.jpg
3. Traduzir sinopse para português
4. WebSearch "Dan Simmons biography" → gerar bio (2 parágrafos)
5. Gerar lista outros livros: "The Fall of Hyperion (1990)", "Endymion (1996)", etc.
6. Normalizar filename: "Hyperion.md"
7. Preencher template
8. Check existência → NOT_EXISTS
9. Escrever ficheiro
10. Confirmar: "✅ Livro adicionado: hyperion.md"

**Tokens estimados:** ~3,000

### Exemplo 2: Livro Português (Wook)

**Input:**
```
/add-book https://www.wook.pt/livro/desistir-adam-phillips/29896367
```

**Workflow:**
1. Parse URL → source = "wook"
2. WebFetch → extrair:
   - Título: "Desistir"
   - Autor: "Adam Phillips"
   - ISBN: "978-989-9216-24-2"
   - Sinopse: (já em português)
   - Capa: URL da imagem Wook
3. Skip tradução (sinopse já portuguesa)
4. WebSearch "Adam Phillips biography" → gerar bio
5. Gerar lista outros livros
6. Normalizar filename: "Desistir.md"
7. Preencher template (Goodreads URL vazio)
8. Check existência → NOT_EXISTS
9. Escrever ficheiro
10. Confirmar: "✅ Livro adicionado: desistir.md"

**Tokens estimados:** ~2,500 (sem tradução)

## Notas Importantes

### Idioma e Comunicação

- Todo output para utilizador em **Português de Portugal**
- Campos frontmatter em português: `título`, `autor`, `data de leitura`, etc.
- Secções markdown em português: "Sinopse", "Sobre o autor", "Outros livros do autor"
- Tradução de sinopse com tom literário natural (não literal)

### Path e Template

- **Sempre path absoluto:** `/Users/bruno/Library/Mobile Documents/.../03 - Recursos/Literatura/Livros/`
- **Template:** `assets/book_template.md` (28 linhas, não modificar)
- **Nunca usar paths relativos** (skill pode executar de qualquer diretório)

### Campos Pessoais Vazios

Por design, os seguintes campos ficam vazios:
- `data de leitura`
- `estado da leitura`
- `classificação`
- Tags adicionais (apenas "livros" incluído)

**Razão:** Bruno preenche no Obsidian quando relevante, oferecendo máxima flexibilidade.

### Goodreads URL

- Se fonte = Goodreads → usar URL input
- Se fonte = Wook → deixar campo `url` vazio (ou pesquisar Goodreads como passo extra)
- Não essencial para funcionamento do vault