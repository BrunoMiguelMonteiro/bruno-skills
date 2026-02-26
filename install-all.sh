#!/bin/bash
# Instala todos os skills de bruno-skills
# Uso: bash <(curl -s https://raw.githubusercontent.com/BrunoMiguelMonteiro/bruno-skills/main/install-all.sh)

set -e

MARKETPLACE="bruno-skills"
SKILLS=(
  revisor-linguistico
  article-studio
  lean-writer
  humanizer
  digital-garden-assistant
  context-engineering-assistant
  context-optimizer
  claude-md-auditor
  research-editor
)

echo "A adicionar marketplace $MARKETPLACE..."
claude /marketplace add https://github.com/BrunoMiguelMonteiro/bruno-skills

echo ""
echo "A instalar skills..."
for skill in "${SKILLS[@]}"; do
  echo "  → $skill"
  claude /plugin install "$skill@$MARKETPLACE"
done

echo ""
echo "Concluído! Skills instalados:"
claude /skills list | grep -E "$(IFS='|'; echo "${SKILLS[*]}")"
