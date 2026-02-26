---
name: humanizer
description: Systematically removes AI writing patterns using progressive disclosure. Detects em dashes, AI vocabulary, rhetorical patterns, and chatbot artifacts. Use for marketing copy, blog posts, articles, or when text feels AI-written.
---

# Humanizer: Remove AI Writing Patterns

## Your Task

1. **Scan** for AI patterns (listed below)
2. **Consult** pattern details only when needed
3. **Rewrite** problematic sections
4. **Preserve** meaning and tone
5. **Add soul** - not just remove patterns

## Core Philosophy

Avoiding AI patterns is half the job. Add **personality**:
- Have opinions, acknowledge complexity
- Vary rhythm (short punchy + long flowing)
- Use "I" when appropriate
- Let some mess in (tangents, asides)
- Be specific about feelings

## Workflow

### Step 1: Initial Scan

**MANDATORY CHECKS - Always perform these, even if text seems clean:**

#### Style Red Flags (Most Common AI Tells)
Scan the ENTIRE document for:
- [ ] **Em dashes (—)**: Count them. More than 3 total? Load style-patterns.md
- [ ] **Structural repetition**: Any 3+ consecutive sentences/phrases starting the same way? ("It's in...", "The X that...", gerund chains)
- [ ] **Rhetorical contrast pattern**: Count instances of "Short sentence. That's not X—it's Y." More than 1? Flag it.
- [ ] **Rule of three**: Look for adjective triplets ("seamless, intuitive, powerful"). Found any? Load language-patterns.md

#### Language Red Flags
Count these AI vocabulary words in the full text:
- "delve", "landscape" (metaphorical), "tapestry", "foster", "realm", "navigate" (challenges), "robust", "leverage", "harness", "unlock" (potential)
- **If you find 3+ different AI words**: Load language-patterns.md
- **Check for**: "serves as", "boasts", "features" instead of simple "is/has"
- **Check for**: "not just X but Y" or "it's not A, it's B" constructions

#### Content Red Flags
Look for:
- [ ] Words like "testament", "pivotal", "watershed", "landmark", "underscores"
- [ ] "Challenges" sections that feel template-like
- [ ] Vague attributions ("experts argue", "studies show" without naming them)

#### Quick Heuristic
**If ANY of the following are true, you MUST deep-scan:**
- Document is 500+ words (longer text = more patterns hide)
- Text is meant for publication (articles, blog posts, marketing)
- You feel uncertain whether it sounds human
- Author specifically requested humanization

### Step 1.5: Pattern Count Summary

Before loading pattern files, create a quick inventory:
```
DETECTED PATTERNS:
- Em dashes: [count]
- Rhetorical contrasts: [count]
- Structural repetitions: [count]
- AI vocabulary words: [list]
- "Not just/not only" constructions: [count]
- Vague significance claims: [yes/no]
```

**Load pattern files for ANY category with 2+ flags.**

### Step 2: Deep Analysis
For detected categories, read detailed patterns:
```bash
Read ~/.claude/skills/humanizer/patterns/content-patterns.md
Read ~/.claude/skills/humanizer/patterns/language-patterns.md
Read ~/.claude/skills/humanizer/patterns/style-patterns.md
Read ~/.claude/skills/humanizer/patterns/communication-patterns.md
```

**Only load the pattern files you need** - this saves ~40-50% tokens on typical text.

### Step 3: Rewrite
Apply fixes, verify:
- ✓ Natural when read aloud
- ✓ Varied sentence structure
- ✓ Specific details over vague claims
- ✓ Simple constructions (is/are/has)

### Step 4: Add Voice
Don't just remove - inject personality appropriate to context.

### Step 5: Present Results
Show:
- Rewritten text
- Patterns removed (numbered list)
- Brief explanation of key changes

## Pattern Reference (Quick List)

### Content Patterns (1-6)
**Read** `patterns/content-patterns.md` **if text contains:**

1. **Undue significance**: "testament", "pivotal", "marking a significant moment"
2. **Notability emphasis**: "covered by media outlets", "widely recognized"
3. **Superficial -ing analyses**: "highlighting the complexity", "showcasing innovation"
4. **Promotional language**: "nestled in", "vibrant community", "breathtaking views"
5. **Vague attributions**: "experts argue", "observers cite", "sources say"
6. **Formulaic "Challenges" sections**: template-like problem discussions

### Language Patterns (7-12)
**Read** `patterns/language-patterns.md` **if text contains:**

7. **AI vocabulary**: "delve", "landscape", "tapestry", "foster", "realm", "navigate"
8. **Copula avoidance**: "serves as", "boasts", "features" instead of "is/has"
9. **Negative parallelisms**: "not just X but Y", "it's not A, it's B"
10. **Rule of three**: always exactly 3 items in lists
11. **Synonym cycling**: unnatural word variation to avoid repetition
12. **False ranges**: "from X to Y" on non-scalar dimensions

### Style Patterns (13-20)
**Read** `patterns/style-patterns.md` **if text contains:**

13. **Em dash overuse**: multiple — dashes per paragraph
14. **Excessive boldface**: **too many** **bold** **words**
15. **Inline-header lists**: **Item:** description format
16. **Title Case Headings**: Every Word Capitalized
17. **Emoji usage**: 🎯 embedded in serious content
18. **Curly quotes**: "smart quotes" vs "straight quotes"
19. **Structural repetition**: "It's in X. It's in Y. It's in Z." (anaphora abuse)
20. **Rhetorical contrast**: "Short sentence. That's not X—it's Y." pattern overuse

### Communication Patterns (21-26)
**Read** `patterns/communication-patterns.md` **if text contains:**

21. **Chatbot artifacts**: "I hope this helps", "let me know if you need anything"
22. **Knowledge cutoff disclaimers**: "as of my last update", "as of 2023"
23. **Sycophantic tone**: "Great question!", "You're absolutely right!"
24. **Filler phrases**: "in order to", "due to the fact that", "at this point in time"
25. **Excessive hedging**: "could potentially possibly", "might perhaps"
26. **Generic conclusions**: "bright future ahead", "exciting times", "journey continues"

## Progressive Disclosure in Action

### Efficient Token Usage

**Clean text scenario:**
- Load: SKILL.md only (~5KB)
- Economy: ~72% vs monolithic approach

**Typical scenario:**
- Load: SKILL.md + 2 pattern files (~14KB)
- Economy: ~30% vs monolithic approach

**Complex scenario:**
- Load: SKILL.md + all pattern files (~21KB)
- Economy: 0% but only when needed

**Always mention** when loading pattern files for transparency.

## Bruno's Voice

When humanizing for Bruno:
- **Conversational but intelligent tone**: casual yet precise
- **Personal observations**: "I noticed", "in my experience"
- **Technical accuracy maintained**: don't dumb down
- **No generic enthusiasm**: avoid "exciting" and "amazing"
- **Honesty and vulnerability**: admit uncertainty where appropriate
- **Portuguese of Portugal**: "rever" not "revisar", avoid Brazilian Portuguese

## Integration

Works well with:
- `/article-studio` - use humanizer after drafting
- `/revisor-linguistico` - for Portuguese text refinement
- Sequential workflow: draft → humanize → polish language

## Example

**Before:**
> The update serves as a testament to innovation. Moreover, it provides a seamless, intuitive, and powerful experience—ensuring efficiency.

**After:**
> The update adds batch processing and keyboard shortcuts. Early testers report faster task completion.

**Patterns removed:**
- #1: "serves as testament" (undue significance)
- #7: "Moreover" (AI vocabulary)
- #10: "seamless, intuitive, powerful" (rule of three)
- #13: Em dash overuse
- #3: "ensuring" (superficial -ing analysis)

## When to Use Humanizer

**Use when:**
- Text feels "AI-written" but you can't pinpoint why
- Marketing copy needs personality
- Documentation sounds robotic
- Before publishing articles or blog posts

**Don't use when:**
- Technical specifications (AI patterns may be appropriate)
- Legal or formal documents (some patterns are expected)
- User deliberately wants AI style

## Technical Notes

**File structure:**
```
~/.claude/skills/humanizer/
├── SKILL.md                           # This file (~5KB)
├── patterns/
│   ├── content-patterns.md            # Patterns 1-6 (~4KB)
│   ├── language-patterns.md           # Patterns 7-12 (~4KB)
│   ├── style-patterns.md              # Patterns 13-20 (~5KB)
│   └── communication-patterns.md      # Patterns 21-26 (~3KB)
└── README.md                          # Documentation
```

**Total skill size:** ~21KB distributed
**Typical load:** ~9-15KB (economy of 35-45%)

---

For detailed examples and guidance on each pattern, consult the appropriate pattern file in `~/.claude/skills/humanizer/patterns/`
