#!/usr/bin/env bash
# scripts/setup-gh-project-vmg.sh
# ------------------------------------------------------------------------
# Crée / met à jour le board GitHub Projects v2 "VMG" (PLAN §5, ADR 017 Axe A).
# Idempotent : ré-exécutable sans casser un board existant.
#
# PRÉ-REQUIS — scope `project` sur le token gh :
#     gh auth refresh -s project,read:project --hostname github.com
#
# Ce script fait :
#   - Créer / récupérer le board "VMG"
#   - Étendre Status pour kanban Trello : Backlog → Todo → In Progress → Review → Done
#   - Créer 5 champs custom single-select : Type, Priorite, Risque, Composant, Sprint
#   - Créer 2 champs DATE : Start, Target
#   - Créer 1 vrai champ ITERATION configuré avec 6 sprints de 14 jours
#     (utilisable directement par la vue Roadmap GH Projects v2)
#   - Lier le repo voisins-moulin-galant au project
#
# ⚠️  Limitations API GitHub Projects v2 (UI-only, hors scope CLI) :
#   - Création de vues (Board / Roadmap / Table) — mutation createProjectV2View
#     mentionnée par Copilot mais inexistante dans l'API publique
#     (cf https://github.com/orgs/community/discussions/153532)
#   - Activation des workflows automations (item added → Backlog, etc.)
#   La draft "📌 README" listée dans le board contient le pas-à-pas (~ 2 clics).
#
# Refs :
#   - https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects
#   - https://github.com/orgs/community/discussions/157957 (iterationConfiguration syntax)
# ------------------------------------------------------------------------

set -euo pipefail

OWNER="${OWNER:-YoLoADR}"
REPO_FULL="${REPO_FULL:-${OWNER}/voisins-moulin-galant}"
TITLE="${TITLE:-VMG}"
SPRINT_START="${SPRINT_START:-2026-05-15}"   # Vendredi 15 mai 2026 (Sprint 1 démarre)
SPRINT_DURATION="${SPRINT_DURATION:-14}"

# Vérification scope project
if ! gh api user --include 2>&1 | grep -qi "X-OAuth-Scopes:.*project"; then
  echo "❌ Le token gh n'a pas le scope 'project'. Lance :"
  echo "    gh auth refresh -s project,read:project --hostname github.com"
  exit 1
fi

echo "▸ Owner: $OWNER | Repo: $REPO_FULL | Title: $TITLE"

# 1. Création / récupération du board
PROJECT_NUMBER=$(gh project list --owner "$OWNER" --format json \
  --jq ".projects[] | select(.title == \"$TITLE\") | .number" 2>/dev/null || true)

if [[ -z "$PROJECT_NUMBER" ]]; then
  echo "▸ Création du board \"$TITLE\"..."
  PROJECT_NUMBER=$(gh project create --owner "$OWNER" --title "$TITLE" --format json --jq '.number')
  echo "  ✓ board #$PROJECT_NUMBER créé"
else
  echo "  ✓ board existant #$PROJECT_NUMBER réutilisé"
fi

PROJECT_ID=$(gh project view "$PROJECT_NUMBER" --owner "$OWNER" --format json --jq '.id')

# 2. Lier le repo au project
echo "▸ Lien repo → project"
gh project link --owner "$OWNER" --number "$PROJECT_NUMBER" "$REPO_FULL" 2>/dev/null \
  || echo "  (déjà linké, OK)"

# 3. Étendre Status pour kanban Trello
echo "▸ Status (kanban Trello-style)"
STATUS_FIELD_ID=$(gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
  --jq '.fields[] | select(.name == "Status") | .id')

STATUS_OPTS=$(gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
  --jq '.fields[] | select(.name == "Status") | .options[].name' | tr '\n' '|')

if [[ "$STATUS_OPTS" != *"Backlog"* ]] || [[ "$STATUS_OPTS" != *"Review"* ]]; then
  cat > /tmp/update_status.graphql <<'EOF'
mutation UpdateStatus($fieldId: ID!) {
  updateProjectV2Field(input: {
    fieldId: $fieldId,
    singleSelectOptions: [
      {name: "Backlog", color: GRAY, description: "Pas encore commencé"},
      {name: "Todo", color: YELLOW, description: "À prendre"},
      {name: "In Progress", color: BLUE, description: "En cours"},
      {name: "Review", color: PURPLE, description: "PR en review"},
      {name: "Done", color: GREEN, description: "Mergé / livré"}
    ]
  }) {
    projectV2Field {
      ... on ProjectV2SingleSelectField { id name options { name } }
    }
  }
}
EOF
  gh api graphql -F fieldId="$STATUS_FIELD_ID" -F query=@/tmp/update_status.graphql >/dev/null
  echo "  ✓ étendu : Backlog → Todo → In Progress → Review → Done"
else
  echo "  · Backlog + Review déjà présents (skip)"
fi

# 4. Champs single-select custom
add_field() {
  local name=$1
  local options=$2
  if ! gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json --jq ".fields[].name" 2>/dev/null | grep -qx "$name"; then
    gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name "$name" --data-type SINGLE_SELECT --single-select-options "$options" >/dev/null
    echo "  + $name"
  else
    echo "  · $name (existe déjà)"
  fi
}

echo "▸ Champs single-select"
add_field "Type" "feature,bug,tech-debt,doc"
add_field "Priorite" "P0,P1,P2,P3"
add_field "Risque" "low,med,high"
# Note : "Repo" est un nom réservé GitHub Projects v2 — utiliser "Composant" à la place
add_field "Composant" "vitrine,blog,ci-cd,cms-strapi,brand-config,docs"
# Sprint short-label (utile en filtre rapide), parallèle au vrai champ Iteration ci-dessous
add_field "Sprint" "S1 (15/05-28/05),S2 (29/05-11/06),S3 (12/06-25/06),S4 (26/06-09/07),S5 (10/07-23/07),S6 (24/07-06/08),Backlog"

# 5. Champs DATE
echo "▸ Champs DATE"
add_date_field() {
  local name=$1
  if ! gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json --jq ".fields[].name" 2>/dev/null | grep -qx "$name"; then
    gh project field-create "$PROJECT_NUMBER" --owner "$OWNER" --name "$name" --data-type DATE >/dev/null
    echo "  + $name"
  else
    echo "  · $name (existe déjà)"
  fi
}
add_date_field "Start"
add_date_field "Target"

# 6. Champ Iteration (consommé par la vue Roadmap GH Projects v2)
echo "▸ Champ Iteration (sprints 2 semaines pour vue Roadmap)"

ITER_FIELD_ID=$(gh project field-list "$PROJECT_NUMBER" --owner "$OWNER" --format json \
  --jq '.fields[] | select(.name == "Iteration") | .id' 2>/dev/null || true)

if [[ -z "$ITER_FIELD_ID" ]]; then
  cat > /tmp/create_iter.graphql <<EOF
mutation { createProjectV2Field(input: { projectId: "$PROJECT_ID", dataType: ITERATION, name: "Iteration" }) {
  projectV2Field { ... on ProjectV2IterationField { id } }
} }
EOF
  ITER_FIELD_ID=$(gh api graphql -F query=@/tmp/create_iter.graphql --jq '.data.createProjectV2Field.projectV2Field.id')
  echo "  + Iteration field créé"
else
  echo "  · Iteration field existant"
fi

# Configurer les 6 sprints (la mutation remplace toutes les iterations existantes — irréversible
# côté assignations issues, donc skip si déjà 6 sprints configurés)
ITER_COUNT=$(gh api graphql -f query="query { node(id: \"$ITER_FIELD_ID\") {
  ... on ProjectV2IterationField { configuration { iterations { id } } } } }" \
  --jq '.data.node.configuration.iterations | length')

if [[ "$ITER_COUNT" -lt 6 ]]; then
  cat > /tmp/config_iter.graphql <<EOF
mutation {
  updateProjectV2Field(input: {
    fieldId: "$ITER_FIELD_ID",
    iterationConfiguration: {
      startDate: "$SPRINT_START",
      duration: $SPRINT_DURATION,
      iterations: [
        {startDate: "2026-05-15", duration: 14, title: "Sprint 1 — Pétition PROMEO"},
        {startDate: "2026-05-29", duration: 14, title: "Sprint 2 — HelloAsso + Infra"},
        {startDate: "2026-06-12", duration: 14, title: "Sprint 3 — Propriété + Admin"},
        {startDate: "2026-06-26", duration: 14, title: "Sprint 4 — CMS + Concours"},
        {startDate: "2026-07-10", duration: 14, title: "Sprint 5 — Automatisations"},
        {startDate: "2026-07-24", duration: 14, title: "Sprint 6 — Phase 2 Strapi"}
      ]
    }
  }) { projectV2Field { ... on ProjectV2IterationField { id } } }
}
EOF
  gh api graphql -F query=@/tmp/config_iter.graphql >/dev/null
  echo "  ✓ 6 sprints de 14j configurés (Sprint 1 = $SPRINT_START)"
else
  echo "  · $ITER_COUNT iterations déjà configurées (skip — pour reconfigurer, supprimer Iteration et relancer)"
fi

echo ""
echo "✓ Board VMG #$PROJECT_NUMBER prêt."
echo "  URL : https://github.com/users/$OWNER/projects/$PROJECT_NUMBER"
echo ""
echo "▸ Étapes UI restantes (~ 2 min) — voir aussi draft \"📌 README\" dans le board :"
echo ""
echo "  1. + New view → \"Kanban\" : layout Board · group by Status"
echo "     → kanban Trello (Backlog | Todo | In Progress | Review | Done)"
echo ""
echo "  2. + New view → \"Roadmap\" : layout Roadmap · field Iteration"
echo "     → timeline gantt-style avec barres par sprint"
echo ""
echo "  3. Settings → Workflows : activer 4 built-ins"
echo "     - Auto-add to project (repo: $REPO_FULL is:issue is:open)"
echo "     - Item added → Status = Backlog"
echo "     - PR merged → Status = Done"
echo "     - Item closed → Status = Done"
