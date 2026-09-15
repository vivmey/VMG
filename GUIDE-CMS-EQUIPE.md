# Guide CMS — Équipe Voisins Moulin Galant

> **Document interne.** Ne pas partager hors de l'association.
> Dernière mise à jour : 15 mai 2026.

Bienvenue ! Ce guide te permet de publier toi-même des articles sur le site **voisinsmoulingalant.fr** sans avoir besoin du développeur.

---

## 1. Comprendre comment ça marche

Le site VMG est en réalité **deux choses connectées** :

1. **Le site public** (https://voisinsmoulingalant.fr) — ce que voient les visiteurs.
2. **Le back-office CMS** (Strapi) — l'outil interne où **toi** tu écris les articles.

Quand tu publies un article dans le back-office, il apparaît automatiquement sur le site public en moins d'1 minute.

Le site contient déjà **207 articles historiques** migrés depuis l'ancien blog Blogspot. Tu ne peux pas les modifier (ils sont figés, c'est volontaire pour préserver l'archive). Mais tu peux **ajouter autant de nouveaux articles que tu veux**, et ce sont eux qui apparaîtront en tête de page.

---

## 2. Tes accès

| Compte | À qui | Email | Mot de passe |
|---|---|---|---|
| **Vivien** (compte personnel, rôle Editor) | Vivien (Product Manager) | `vivien@voisinsmoulingalant.fr` | 🔒 transmis séparément par canal sécurisé |
| **Bureau** (compte partagé, rôle Super Admin) | Membres du bureau | `bureau@voisinsmoulingalant.fr` | 🔒 transmis séparément par canal sécurisé |

> **Pourquoi les mots de passe ne sont pas dans ce document ?** Ce fichier est versionné dans Git — y inscrire les mots de passe les graverait dans l'historique du dépôt à jamais. Demande le mot de passe au développeur via Signal, 1Password partagé, ou tout autre canal sécurisé. **Change-le à la 1re connexion** (voir paragraphe suivant).

### Différence entre les deux comptes

- **Vivien (Editor)** : peut **créer, modifier, publier, dépublier** tous les articles. C'est tout ce qu'il faut pour gérer le blog au quotidien. **Ne peut pas** modifier les paramètres techniques, créer d'autres utilisateurs, ou casser quelque chose.
- **Bureau (Super Admin)** : **tout** ce que peut faire Vivien, plus la gestion technique (créer d'autres comptes, modifier les paramètres, etc.). À utiliser uniquement quand c'est strictement nécessaire — pour le travail courant, **utilise Vivien**.

### À faire à la première connexion

1. **Change ton mot de passe** : en haut à droite → ton initiale → `Profile` → onglet `Change password` → entre le nouveau.
2. Note le nouveau mot de passe dans un **gestionnaire de mots de passe sécurisé** (Bitwarden, 1Password) ou dans le coffre partagé du bureau.

---

## 3. Comment se connecter

L'adresse du back-office est :

**👉 https://cms.merenza.com/admin** *(en cours de mise en place — actuellement accessible en interne uniquement)*

Si tu ne peux pas y accéder, demande au développeur de t'ouvrir un accès temporaire.

---

## 4. Publier un nouvel article — étape par étape

### Étape 1 — Aller dans la liste des articles

Une fois connecté(e), dans le menu de gauche :
- Clic sur **Content Manager** (icône stylo)
- Clic sur **Article** (sous-menu)
- Bouton bleu en haut à droite : **+ Create new entry**

### Étape 2 — Choisir la langue

En haut à droite, vérifie que **Locale = Français (fr)** (par défaut c'est bon).

### Étape 3 — Remplir les champs principaux

| Champ | Quoi y mettre | Exemple |
|---|---|---|
| **Title** | Titre de l'article (≤ 80 caractères idéalement) | « Chasse aux œufs 2026 au parc de la Papeterie » |
| **Slug** | Identifiant URL — **généré automatiquement**, ne pas modifier sauf cas particulier | `chasse-aux-oeufs-2026-au-parc-de-la-papeterie` |
| **Excerpt** | Résumé court qui apparaît dans la liste du blog (≤ 280 caractères) | « Cette année encore, 200 enfants ont parcouru le parc à la recherche des chocolats… » |
| **Content** | Le texte complet de l'article (Markdown ou texte normal) | Voir astuces ci-dessous |
| **Cover** | Image principale (apparaît en haut de l'article + dans la liste) | Glisse-dépose une image (JPG/PNG, idéalement 1200×630px) |

### Étape 4 — Choisir une catégorie

Champ **Category** → menu déroulant. Choisir parmi :

| Catégorie | Quand l'utiliser |
|---|---|
| `actualites` | News générales de l'association |
| `evenements` | Annonces ou comptes-rendus d'événements |
| `mobilisation` | Pétitions, prises de position, manifestations |
| `friperie` | Tout ce qui concerne la friperie solidaire |
| `vie-asso` | Vie interne (AG, recrutements bénévoles, etc.) |
| `communique` | Communiqués de presse officiels |
| `galerie` | Galeries photos d'événements |

### Étape 5 — ⚠️ Étape critique : lier la marque

Dans le panneau de droite, section **Brand** :

1. Clic sur le bouton **+ Add an entry**
2. Sélectionner **Voisins Moulin Galant**

**Si tu oublies cette étape, l'article ne s'affichera PAS sur le site public.** C'est la seule erreur sérieuse qu'on peut faire — tout le reste est rattrapable.

### Étape 6 — Sauvegarder en brouillon

Bouton **Save** (en haut à droite). L'article est sauvegardé mais **n'est pas encore visible** sur le site.

C'est le moment de :
- Te relire
- Vérifier l'image
- Demander un avis (Vivien peut sauvegarder, un autre membre du bureau peut relire)

### Étape 7 — Publier

Quand tu es prêt(e) : bouton **Publish** (à côté de Save, en haut à droite).

L'article est maintenant **en ligne sur https://voisinsmoulingalant.fr/fr/blog** dans la minute qui suit.

---

## 5. Astuces pour écrire le contenu

Le champ `Content` accepte du **Markdown** (le format de Wikipedia ou Discord). Quelques bases :

```markdown
## Titre de section

**Texte en gras**, *texte en italique*.

- Premier point
- Deuxième point
- Troisième point

[Lien vers un site](https://example.com)

![Légende de l'image](https://url-de-l-image.jpg)
```

Si tu préfères écrire en texte normal sans Markdown : pas de souci, ça marche aussi. Reviens à la ligne pour faire des paragraphes.

---

## 6. Modifier un article existant

1. Content Manager → Article → clic sur l'article à modifier
2. Modifier les champs
3. **Save** → puis **Publish** pour publier les modifs

⚠️ Tu peux modifier les articles que **tu as créés depuis le CMS**. Les **207 articles historiques** importés depuis Blogspot ne sont pas dans le CMS — ils sont gérés directement dans le code (demande au développeur si tu veux modifier un ancien).

---

## 7. Dépublier ou supprimer un article

- **Dépublier** (le garder mais le cacher du site) : ouvre l'article → bouton **Unpublish**. Tu pourras le republier plus tard.
- **Supprimer** (effacer définitivement) : ouvre l'article → menu `…` en haut à droite → **Delete**. ⚠️ Action irréversible.

---

## 8. Gérer les images et fichiers

Menu de gauche → **Media Library**. Tu peux y déposer toutes les images de l'association. Quand tu crées un article, tu peux soit uploader directement depuis le formulaire, soit piocher dans cette bibliothèque.

Formats acceptés : JPG, PNG, WebP, SVG, PDF.
Limite recommandée : **moins de 2 Mo par image** (sinon le site rame).

---

## 9. Tableau des permissions par rôle

| Action | Vivien (Editor) | Bureau (Super Admin) |
|---|---|---|
| Créer / modifier / publier un article | ✅ | ✅ |
| Modifier un article créé par quelqu'un d'autre | ✅ | ✅ |
| Supprimer un article | ✅ | ✅ |
| Uploader des images / médias | ✅ | ✅ |
| Voir les statistiques de publication | ✅ | ✅ |
| Créer un nouveau compte utilisateur | ❌ | ✅ |
| Modifier la structure (catégories, champs) | ❌ | ✅ |
| Générer des tokens techniques | ❌ | ✅ |

---

## 10. Que faire si ça ne marche pas ?

| Problème | Solution |
|---|---|
| « Mon article ne s'affiche pas sur le site » | Vérifier que la **Brand** est bien `voisins-moulin-galant` (cause n°1 d'oubli). Vérifier que tu as cliqué sur **Publish** et pas seulement **Save**. Attendre 1 min. |
| « J'ai oublié mon mot de passe » | Demander au développeur (yohann.developer@gmail.com) de le réinitialiser. |
| « Le CMS ne s'ouvre pas » | Vérifier que tu es bien sur https://cms.merenza.com/admin. Si l'erreur persiste, screenshot + email au développeur. |
| « J'ai fait une bêtise » | Pas de panique. Tout est récupérable via les versions précédentes (sauf suppression définitive). Demande au développeur. |

---

## 11. Bonnes pratiques

- ✅ **Toujours mettre une image** : un article sans image est moins partagé sur les réseaux sociaux.
- ✅ **Excerpt soigné** : c'est ce que les gens voient dans la liste + sur Google + sur les réseaux. 2-3 phrases qui donnent envie de cliquer.
- ✅ **Catégorie bien choisie** : aide les visiteurs à filtrer (ex. quelqu'un cherche les événements → cat `evenements`).
- ❌ **Ne pas mettre de caractères spéciaux dans le slug** : laisse-le auto-générer.
- ❌ **Ne pas dépublier puis republier** un article pour « le faire remonter » : la date de publication initiale est conservée, ça ne sert à rien.

---

## 12. Sécurité

- **Ne partage jamais** ton mot de passe sur un canal non sécurisé (pas de WhatsApp, pas de SMS, pas de mail standard).
- Pour le compte **Bureau partagé** : utilise un gestionnaire de mots de passe partagé (1Password Teams, Bitwarden Organizations) plutôt que de l'écrire dans un Google Doc.
- À la moindre suspicion de compromission, change le mot de passe (Profile → Change password) et préviens le développeur.

---

## 13. Suivre l'état des articles (le « tableau de bord » éditorial)

Pas besoin d'outil externe : le **Content Manager de Strapi** sert directement de tableau de bord.

### Vue d'ensemble des articles

1. Menu de gauche → **Content Manager** → **Article**
2. Tu vois la liste de tous les articles avec leurs colonnes (title, slug, category, status, publishedAt, brand)
3. En haut de la liste tu as des **filtres** :
   - **Status** : `Published` (en ligne) vs `Draft` (brouillon) vs `Modified` (publié mais avec des modifs non publiées)
   - **Category** : pour filtrer par thème
   - **Locale** : Français (fr)
   - Tu peux aussi filtrer par publishedAt (date)

### Workflow recommandé pour le bureau

Pense les statuts comme des étapes :

| Statut Strapi | Ce que ça veut dire | Qui peut le mettre à jour |
|---|---|---|
| **Draft** (brouillon) | Article en cours de rédaction, pas encore relu | Vivien ou Bureau |
| **Modified** | Publié mais avec des changements en cours de relecture | Vivien ou Bureau |
| **Published** | En ligne sur le site public | Vivien ou Bureau (clic sur Publish) |

**Convention proposée** :
1. La personne qui écrit crée l'article et **Save** (= Draft).
2. Elle ajoute le nom du relecteur dans le champ **Excerpt** entre crochets, ex. `[À relire par Pierre] Cette année…`
3. Le relecteur ouvre l'article, retire le marker, ajuste si besoin, et clique sur **Publish**.

### Personnaliser les colonnes affichées

Bouton **Settings** (en haut de la liste, icône engrenage) → tu peux choisir quelles colonnes voir (utile pour ajouter Brand, Category, Author au tableau).

### Voir l'historique d'un article

Dans un article ouvert → onglet **More actions** → **History** (Strapi 5 sauvegarde toutes les versions). Tu peux revenir à une version antérieure si quelqu'un a fait une bêtise.

---

## 14. Contacts

- **Développeur principal** : Yohann Ravino — yohann.developer@gmail.com
- **Product Manager VMG** : Vivien — vivien@voisinsmoulingalant.fr
- **Compte bureau partagé** : bureau@voisinsmoulingalant.fr

---

*Ce document est versionné dans le dépôt GitHub privé de VMG. Si tu y apportes des modifications (corrections, ajouts), préviens le développeur pour qu'il les committe.*
