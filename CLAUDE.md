# CLAUDE.md — Voisins Moulin Galant (vitrine + blog fusionnés)

Site de l'association loi 1901 **Voisins Moulin Galant** (Corbeil-Essonnes, 91100). 7e marque de l'écosystème Merenza. **Vitrine + blog fusionnés** (Single Next 16 app, ADR 017 Axe A).

## Identité

- Slug : `voisins-moulin-galant`
- Repo : `YoLoADR/voisins-moulin-galant` (privé)
- Tagline : « Créer du lien et agir ensemble pour notre quartier »
- Fondation : 2018 · 150+ familles soutenues · 12 événements/an
- Origine : fusion `partners/voisins-moulin-galant` (vitrine, ADR 015) + `partners/voisins-moulin-galant-news` (blog, 207 MDX migrés Blogspot) — 2026-05-15

## Commands

```bash
npm run dev          # Port 3010 (turbopack)
npm run build        # Production build, 240+ pages SSG
npm run start        # Production server :3010
npm run lint
npm run typecheck    # tsc --noEmit
npm run generate-article  # Cron auto-content (ADR 016)
```

## Stack

- Next.js 16.1.4 App Router + React 19
- Tailwind CSS 4 (config CSS-first via `@theme` dans `globals.css`)
- next-intl 4 — locales = `['fr']` uniquement
- MDX : `next-mdx-remote` + `gray-matter` (207 articles dans `content/posts/`)
- Strapi (optionnel) : `merenza-cms` multi-tenant, 7e tenant `voisins-moulin-galant`
- Hosting : Netlify (1 site unique post-fusion)
- DNS : IONOS — CNAME vers Netlify (cf brain `feedback_dns_ionos_conserve.md`)
- Forms transactionnels : **HelloAsso embed** (don/adhésion/bénévolat)
- Form contact : **Netlify Forms** (`data-netlify="true"`)
- Newsletter : `app/api/newsletter/route.ts` + `components/forms/NewsletterForm.tsx`
- Analytics : **Plausible** (sans cookie, RGPD-friendly)
- Auto-content blog : GH Actions cron lundi 9h Paris + Claude API (ADR 016)

## Architecture (route groups)

```
app/
├── layout.tsx                      # Root pass-through, metadata SEO globaux
├── sitemap.ts                      # Vitrine + 207 articles + 7 catégories + tags
├── robots.ts
├── globals.css                     # @import tailwindcss + @theme palette VMG
├── api/
│   ├── posts/route.ts              # GET /api/posts (consommé en interne, CORS permissif)
│   ├── newsletter/route.ts
│   └── revalidate/route.ts
└── [locale]/
    ├── layout.tsx                  # Fonts + JSON-LD + Plausible + Header/Footer
    ├── not-found.tsx
    ├── (vitrine)/
    │   ├── page.tsx                # Homepage (12 sections)
    │   ├── qui-sommes-nous/
    │   ├── nos-actions/
    │   ├── dons/
    │   ├── adhesion/
    │   ├── benevolat/
    │   ├── contact/
    │   ├── mentions-legales/
    │   ├── confidentialite/
    │   └── rgpd/
    └── (blog)/
        ├── blog/page.tsx
        ├── blog/[slug]/page.tsx
        ├── category/[category]/page.tsx
        ├── tag/[tag]/page.tsx
        └── rss.xml/route.ts        # Dynamique
```

## Configuration de marque (source unique de vérité)

`brand.config.ts` à la racine. Consolidé depuis ex-`template.config.ts` (vitrine) +
ex-`config/site.config.ts` (blog). Shims rétro-compat conservés.

**Flag clé** : `blog.articlesSource: 'mdx' | 'strapi'`. Override via env `NEXT_PUBLIC_ARTICLES_SOURCE`. Fallback automatique MDX si Strapi inaccessible.

## Composants

```
components/
├── home/                # 12 sections homepage (BlogSection lit local maintenant)
├── layout/              # Header (switch dark↔light), Footer
├── seo/                 # OrganizationJsonLd (NGO) + JsonLd (blog)
├── ui/                  # Accordion, PageHero, Modal
├── forms/               # ContactForm (Netlify) + NewsletterForm
├── ArticleCard.tsx
├── PostList.tsx
├── mdx-components.tsx   # <Petition>, <Callout>, <EventDate>
└── Badge.tsx
```

## Palette VMG

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#E85D33` | CTA principaux (corail solidaire) |
| `--color-secondary` | `#2D8F6F` | Vert quartier / nature |
| `--color-navy` | `#1F3A5F` | Headings, footer |
| `--color-accent` | `#F5C842` | Highlights ponctuels |
| `--color-light` | `#FFF7F2` | Backgrounds sections |

Source de vérité : `app/globals.css` `@theme` block (Tailwind 4 CSS-first).

## CI/CD

`.github/workflows/`
- `lint-typecheck.yml` — sur PR + push main
- `build.yml` — sur PR + push main (artifact `.next/`)
- `e2e-playwright.yml` — sur PR (smoke tests Playwright, tolérant tant que `tests/smoke.spec.ts` n'existe pas)
- `secrets-scan.yml` — gitleaks sur push + PR
- `generate-article.yml` — cron lundi 7h UTC + workflow_dispatch (ADR 016)

`.github/`
- `dependabot.yml` — npm hebdo grouped + github-actions hebdo
- `CODEOWNERS` — `* @YoLoADR`
- `ISSUE_TEMPLATE/` — feature, bug, tech-debt, doc
- `PULL_REQUEST_TEMPLATE.md`

⚠️ **Branch protection main** : nécessite GitHub Pro pour repos privés. À activer si plan upgrade. En attendant : discipline manuelle (CI green obligatoire avant merge).

## Board GitHub Projects v2

`scripts/setup-gh-project-vmg.sh` (lancer après `gh auth refresh -s project`).

## Bloqueurs résiduels Phase 1 (issues GH ouvertes)

- #3 URLs HelloAsso (don / adhésion / bénévolat) du bureau VMG
- #4 SIRET + président de publication (placeholders `TODO_*` dans `brand.config.ts`)
- #5 GH Secret `ANTHROPIC_API_KEY` (cron auto-content)
- #6 Phase 2 — Import 207 MDX vers Strapi merenza-cms

## Phase 2 (Strapi)

- Préalables : DNS `cms.merenza.com` + R2 token côté `merenza-cms` (Phases 3+5 actuellement bloquées user)
- Seed VMG tenant 7 : `merenza-cms/strapi/scripts/seed-brands.ts` ligne `voisins-moulin-galant` (ajoutée 2026-05-15)
- Script import à écrire : `scripts/import-mdx-to-strapi.ts` (cf issue #6)
- Bascule : set `NEXT_PUBLIC_ARTICLES_SOURCE=strapi` en env Netlify

## Conventions

- **Pas de classe Tailwind hardcodée pour les couleurs** : toujours `bg-primary`, jamais `bg-[#E85D33]`
- **Pas de chaîne en dur dans un composant** : tout passe par `useTranslations()` ou `getTranslations()`
- Les composants `home/` sont des Client Components ; les pages secondaires sont des Server Components
- `BlogSection` lit `lib/posts.ts` localement (fini le fetch cross-domain `/blog/api/posts`)
- Articles MDX : `publishedAt` ISO 8601 d'origine préservé (invariant migration Blogspot, 207 articles)

## Refs brain

- `_brain/wiki/projects/voisins-moulin-galant.md`
- `_brain/wiki/decisions/2026-05-14-017-claude-code-workflow-custom-2-axes.md` — Axe A
- `_brain/wiki/decisions/2026-05-06-015-vmg-7e-marque-clone-templates.md`
- `_brain/wiki/decisions/2026-05-06-014-cms-multitenant-via-role-codes.md`
- `_brain/wiki/decisions/2026-05-06-016-auto-content-via-github-actions-claude.md`
- `.agent/tasks/vmg-fusion-monorepo/` — task tracking fusion
