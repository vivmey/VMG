# Plan pour un Agent IA Séquentiel de Génération de Contenu SEO

## Objectifs et Vue d’Ensemble

Cet agent IA vise à automatiser la création de contenus optimisés SEO à partir de mots-clés prédéfinis, et à en décliner des variantes pour différents canaux (blog, LinkedIn, X/Twitter, YouTube, TikTok). Le système doit intégrer :

- **Génération d’un article pilier** (format blog) en Markdown, structuré avec réponse rapide, titres H2/H3, points clés, FAQ et conclusion.
- **Déclinaisons multi-plateformes** : contenus adaptés au format LinkedIn (post carrousel ou article long), X (thread), YouTube (script vidéo), TikTok (script court).
- **Maillage interne automatique** : insertion de liens contextuels vers d’autres articles pertinents, en exploitant la base de données Supabase.
- **Orchestration avec n8n** : automatisation de la publication sur les canaux (réseaux sociaux, blog) et notifications.
- **Suivi analytique** : suivi des performances via Google Analytics (pages vues, temps moyen, clics CTA…) à travers un tableau de bord automatisé.
- **Efficacité et coût** : architecture légère (FastAPI + Next.js + Supabase), usage modéré d’APIs IA (OpenAI, Claude) avec possibilité de modèles open-source, et éviter les services SaaS onéreux.

## Architecture du Système

**Back-end (FastAPI)** : Expose une API REST pour déclencher la génération de contenu et fournir les données au front-end. Les endpoints gèrent la séquence de génération via appels aux modèles d’IA et interagissent avec la base Supabase pour stocker et lire les contenus.

**Base de données (Supabase/PostgreSQL)** : Une structure minimale, par ex. une table principale `articles` qui stocke l’article pilier (titre, contenu markdown, mot_clé, date, catégorie, etc.), et éventuellement des champs ou une table associée pour les variantes (contenu_LinkedIn, contenu_Twitter, contenu_YouTube, contenu_TikTok). L’idée est de limiter le nombre de tables pour rester simple (on peut stocker les variantes de format soit dans des colonnes dédiées, soit dans une table `social_posts` liée par `article_id`).

**Front-end (Next.js)** : Sert les contenus aux utilisateurs (pages blog générées à partir de la base, etc.) et peut intégrer le tableau de bord de suivi. Next.js interroge l’API FastAPI et la base Supabase pour afficher les articles et métriques.

**Workflow Automation (n8n)** : Orchestrateur no-code déclenchant des tâches externes. Par exemple, après qu’un article est généré et stocké, n8n peut récupérer son contenu via l’API et utiliser les intégrations LinkedIn/X pour publier aux horaires programmés, envoyer des notifications (Slack, email) ou autres flux (ex: créer un post WordPress, etc.).

**Services externes** : API OpenAI/Claude pour la génération de texte, Google Analytics API pour récupérer les statistiques de trafic. Ces appels sont effectués depuis le backend ou via n8n selon les besoins.

**Schéma d’ensemble** : L’agent suit un pipeline séquentiel. Une requête de génération (contenant un mot-clé cible) passe par plusieurs étapes dans FastAPI : analyse du mot-clé et du contexte, génération de l’article principal, génération des variantes sociales, enregistrement en base, puis déclenchement de n8n pour distribution. Chaque étape correspond à un rôle logique (analyste, rédacteur, etc.) et peut faire l’objet d’appels IA séparés pour mieux contrôler le résultat[vellum.ai](https://www.vellum.ai/blog/how-to-build-an-ai-agent-for-seo-research-and-content-generation#:~:text=To%20create%20an%20SEO,of%20the%20process%20outlined%20above). Une fois le contenu publié, des scripts ou workflows récupèrent régulièrement les données Google Analytics pour évaluer la performance.

## Structure de la Base de Données (Supabase)

Pour éviter une “surabondance” de tables, on mise sur une **structure simple** : une table principale `articles` et éventuellement quelques tables d’appui. Par exemple :

- **Table `articles`** : contient l’article de blog principal. Champs recommandés : `id`, `titre`, `slug`, `mot_cle_principal`, `contenu_markdown`, `resume` (une métadescription ou un résumé court), `categorie` (ou thématique, pour le classement interne), `date_publication`, `auteur` (facultatif), etc.
- **Table `articles_variants`** (optionnelle) : pour stocker les déclinaisons par canal. Champs : `id`, `article_id` (clé étrangère vers `articles`), `canal` (enum: “LinkedIn”, “Twitter”, “YouTube”, “TikTok”), `contenu_texte`. **Alternative simplifiée** : ajouter dans `articles` des champs texte comme `contenu_linkedin`, `contenu_twitter`, etc., si on préfère une seule table – cela réduit le nombre de tables mais introduit des NULL pour les champs non utilisés.
- **Table `categories`** (optionnelle) : si on souhaite normaliser les catégories/thèmes et lier aux articles. Sinon, un champ texte catégorie dans `articles` peut suffire.
- **Table `liens_internes`** (optionnelle) : si on veut conserver explicitement les relations de maillage entre articles (ex: `source_article_id`, `cible_article_id`, `ancre`). Toutefois, on peut générer les liens dynamiquement à la volée via des requêtes, sans les stocker statiquement.

**Indexation** : Assurer un index plein-texte sur le contenu ou sur les mots-clés/catégories pour faciliter la recherche des articles liés (Supabase/Postgres offre la recherche full-text et les index GIN). On peut aussi utiliser la similarité vectorielle (via pgvector ou le service d’embedding de Supabase) pour trouver des contenus similaires, mais cela ajoute de la complexité – une simple recherche par mots-clés ou catégorie peut suffire initialement.

## Workflow Séquentiel de Génération de Contenu

Le processus peut être découpé en étapes séquentielles, chacune confiée soit à un appel de modèle IA, soit à une fonction dédiée :

### 1. **Analyse du mot-clé et préparation**

**But** : comprendre le contexte du mot-clé cible, l’intention de recherche, et rassembler des éléments pour guider la rédaction.

- *SEO Analyste (IA ou règles)* : L’agent pourrait effectuer une courte analyse du mot-clé : par exemple, vérifier les résultats Google (via une API SERP) pour voir les top articles et en déduire l’intention (informationnelle, transactionnelle…), la longueur moyenne des textes en première page, les sous-thèmes souvent abordés, etc.[vellum.ai](https://www.vellum.ai/blog/how-to-build-an-ai-agent-for-seo-research-and-content-generation#:~:text=To%20actually%20use%20AI%20as,to%20doing%20four%20main%20tasks)[vellum.ai](https://www.vellum.ai/blog/how-to-build-an-ai-agent-for-seo-research-and-content-generation#:~:text=To%20create%20an%20SEO,of%20the%20process%20outlined%20above). Cette étape peut être simplifiée si on ne souhaite pas intégrer une recherche web : on peut prédéfinir pour chaque mot-clé une intention et quelques sous-thèmes manuellement, ou utiliser une requête sur Supabase pour voir s’il existe déjà des articles liés (pour ne pas dupliquer).
- *Prompt contextuel* : On prépare le prompt pour la rédaction en incluant : le mot-clé, l’intention (“ex: l’utilisateur cherche un guide pratique sur …”), le style souhaité, et éventuellement une **liste d’éléments obligatoires** (sous-titres clés, informations spécifiques à inclure). Ces éléments peuvent provenir de l’analyse précédente.

### 2. **Génération de l’article pilier (Blog)**

**But** : produire un article complet optimisé SEO au format Markdown.

L’IA jouera le rôle du **rédacteur SEO**. On va lui fournir un prompt incluant les consignes de structure et d’optimisation.

- **Structure attendue** : On précise que l’article doit comporter :
    - *Réponse rapide (snippet)* : un court paragraphe en tête qui répond directement à la question ou définit le sujet (idéal pour les featured snippets).
    - *Introduction* : mise en contexte (~150-200 mots) présentant le problème et annonçant le plan de l’article.
    - *Développement en sections (H2 et H3)* : organiser l’article en grandes sections (H2) et sous-sections (H3) couvrant chacun un aspect du sujet. Chaque section doit être suffisamment détaillée, avec éventuellement des listes à puces pour les points clés. Google favorise les contenus bien structurés dont chaque partie couvre un sous-ensemble du mot-clé[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=Google%20loves%20well,Here%27s%20my%20proven%20structure).
    - *Points clés* : on peut demander à l’IA de fournir une liste de bullet points récapitulant les points importants (par exemple juste avant la conclusion, ou en encadré après l’intro comme “À retenir”). Des listes concises améliorent la lisibilité et la compréhension[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=%2A%20Short%20paragraphs%20%283,Bold%20text%20for%20important%20terms)[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=5).
    - *FAQ* : une section Foire aux Questions en bas, avec 3-5 questions courantes autour du sujet, chacune avec une réponse claire. Les FAQ ciblent des requêtes longue traîne et augmentent les chances d’apparaître dans le “People Also Ask” de Google et en position zéro[thruuu.com](https://thruuu.com/fr/blog/article-blog-faq/#:~:text=De%20plus%2C%20Google%20affiche%20de,une%20question%20dans%20les%20SERP).
    - *Conclusion* : résumer l’article et éventuellement inclure un appel à l’action (ex: invitation à s’abonner, à consulter un autre article, à laisser un commentaire, etc.)[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=Conclusion%3A).
- **Consignes SEO** : Le prompt doit aussi rappeler les bonnes pratiques SEO on-page : inclure le mot-clé principal dans le H1, l’intro et la conclusion de façon naturelle, utiliser des variantes (synonymes) dans le texte, éviter le bourrage de mots-clés, écrire de manière fluide et informative pour l’utilisateur avant tout. Par exemple, on peut inclure dans le prompt : « *Le contenu doit être informatif et utile. Optimise-le pour le SEO sans paraître robotique : utilise le mot-clé principal “X” dans le titre, l’introduction et la conclusion, ainsi que 3-4 fois dans le corps du texte, naturellement[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=5). Utilise aussi des synonymes et termes liés.* » On demandera des **paragraphes courts** (3-4 lignes max) pour faciliter la lecture[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=%2A%20Short%20paragraphs%20%283,Bold%20text%20for%20important%20terms).
- **Exemple de prompt (pour GPT)** – en français, car on veut un article en français :

```markdown
Vous êtes un rédacteur SEO expérimenté écrivant en français.
Votre tâche : rédiger un**article de blog complet et optimisé SEO** sur le mot-clé suivant : **{mot_clé}**.

**Consignes de structure :**
- Commence par un **Résumé rapide** : 2-3 phrases répondant directement à la question principale ou définissant le sujet. Doit pouvoir être lu indépendamment (feature snippet).
- Ensuite, une **Introduction** ~150 mots : présente le sujet, l’intérêt pour le lecteur, et annonce le plan de l’article.
- Structure l’article en sections avec des titres **H2** et sous-sections **H3** pertinents. Chaque section développe un aspect du sujet.
- Inclue une **liste de points clés** (bullet points) mettant en avant les informations importantes ou conseils pratiques.
- Ajoute une section **FAQ** à la fin, avec 3 à 5 questions courantes sur le sujet et leurs réponses concises en paragraphe (format **Q:** ... **R:** ...).
- Termine par une **Conclusion** résumant les points-clés et proposant une ouverture (par ex, inviter à en savoir plus ou à agir).

**Consignes SEO & style :**
- Optimise pour le mot-clé **{mot_clé}** : utilise-le dans le titre, l’intro et la conclusion, et à quelques reprises dans le texte (de manière naturelle).
- Écris de façon pédagogique et engageante, avec des phrases claires et courtes.
- Utilise des termes variés et des synonymes liés au sujet pour couvrir un champ sémantique large.
- Garde un ton {tonalité} (ex : professionnel mais accessible, ou bien convivial et dynamique, selon la cible).
- N’écris pas de contenu fluff ou hors sujet : reste focalisé sur le sujet et apporte de la valeur ajoutée (exemples concrets, conseils actionnables).
-**Format** : Rends le texte en Markdown valide, avec titres (#, ##, ###), listes à puces, etc.

```

Ce prompt guide le modèle pour produire un article structuré et riche. L’agent IA va renvoyer du Markdown, qu’on pourra directement stocker et afficher.

- **Appel API (OpenAI/Claude)** : On utilisera l’endpoint d’API correspondant (par ex, `openai.ChatCompletion.create` en spécifiant le modèle GPT-4 ou GPT-3.5 Turbo). On peut passer le prompt tel quel dans un message `{"role": "user", "content": prompt}`. Il faudra gérer le découpage en sous-appels si la réponse est très longue, mais GPT-4 peut généralement produire un article de blog en un seul appel grâce à sa fenêtre de contexte étendue (~8k tokens ou plus). La structure indiquée garantit d’obtenir un article complet couvrant le sujet en profondeur.
- **Contrôle qualité (optionnel)** : On peut inclure une étape d’**évaluation automatique** où un second prompt demande à l’IA de vérifier si le texte est complet et respecte les consignes (par exemple utiliser un prompt évaluateur basé sur les guidelines Google de “contenu utile”[vellum.ai](https://www.vellum.ai/blog/how-to-build-an-ai-agent-for-seo-research-and-content-generation#:~:text=That%E2%80%99s%20why%20we%20have%20the,how%20to%20write%20helpful%20content)). Si l’article est jugé incomplet, l’agent pourrait itérativement améliorer la réponse[vellum.ai](https://www.vellum.ai/blog/how-to-build-an-ai-agent-for-seo-research-and-content-generation#:~:text=Now%20that%20we%27ve%20created%20all,one%20more%20step%3A%20Retry%20Logic). Toutefois, cela augmente le nombre d’appels. En pratique, on pourrait simplement logguer le résultat et prévoir une révision manuelle si nécessaire (car l’utilisateur final peut vouloir ajuster avant publication).
- **Insertion en base** : Une fois généré, on stocke l’article Markdown dans Supabase. Par exemple via la librairie `supabase-py` ou via une requête HTTP au **REST API** de Supabase. On crée une entrée dans `articles` avec le contenu, le titre (qu’on peut extraire du Markdown, car le H1 devrait être la première ligne), etc. On peut aussi stocker immédiatement la date de création, et marquer un statut (ex: `statut = 'brouillon'` si on veut réviser avant publication, ou `statut = 'publié'` pour directement en ligne).

### 3. **Génération des variantes multi-plateformes**

Après ou en parallèle de l’article principal, l’agent génère des contenus adaptés à chaque réseau cible, en s’appuyant sur l’article pilier. Le but est de **réutiliser le même travail** en l’adaptant au contexte de chaque plateforme (on parle de content repurposing). Voici les déclinaisons attendues et comment les produire :

- **LinkedIn (post carousel ou texte long)** : Pour un carrousel, on peut extraire les points clés de l’article et les formuler comme une série de slides visuels. Par exemple, un post LinkedIn carousel comporte souvent 5 à 10 slides avec très peu de texte chacun, mettant en avant des idées-forces ou conseils. Si on cible plutôt un post texte “article long” natif sur LinkedIn, le ton peut rester professionnel mais plus direct. **Approche** : Demander à l’IA un résumé *éducatif* en style LinkedIn, éventuellement sous forme de liste de conseils. On peut orienter le prompt vers un format “slide”: *"Donne-moi 5 points clés de cet article sous forme de phrases courtes et percutantes, à utiliser dans un carrousel LinkedIn. Utilise un ton engageant, comme si tu t’adressais à des professionnels en quête de conseil."* Selon Wordtune, les contenus qui fonctionnent sur LinkedIn sont souvent des leçons condensées, visuelles ou sous forme d’infographie tirées du contenu blog[wordtune.com](https://www.wordtune.com/blog/repurposing-content-for-social-media#:~:text=2,educational%20lesson%20that%20sparks%20engagement)[wordtune.com](https://www.wordtune.com/blog/repurposing-content-for-social-media#:~:text=Image).
    
    *Exemple de prompt LinkedIn* :
    
    ```markdown
    À partir de l’article ci-dessous, écris un post LinkedIn à forte valeur ajoutée.
    Forme :*si carrousel* -> propose un plan de 5 à 7 diapositives avec un titre accrocheur et un point clé par diapositive.
           *si post texte* -> environ 1500 caractères, style narration ou conseils.
    Ton: dynamique, orienté business/marketing.
    N’inclus pas de jargon inutile, privilégie la clarté.
    Voici l’article source :
    """
    {contenu_article}
    """
    
    ```
    
    *Gestion* : on peut choisir l’un ou l’autre format. Le carrousel peut être pensé plus tard en design, donc on peut générer juste les phrases clés.
    
- **X (Twitter)** : Le contenu devra tenir en 280 caractères *par tweet*, souvent sous forme de thread pour un article complet. Les threads sur X commencent par un hook accrocheur, puis chaque tweet développe un point clé. **Approche** : Demander un thread de ~5-7 tweets qui résume l’article. Par exemple : *"Crée un thread Twitter concis à partir de cet article. Le premier tweet doit attirer l’attention sur le problème ou une statistique marquante. Chaque tweet suivant (max 280 caractères) apporte un point ou un conseil de l’article. Termine le thread par un tweet de conclusion ou appel à action (ex: poser une question ou inviter à lire l’article complet via un lien)."*
    
    Selon les conseils de repurposing, on peut souvent réutiliser les sous-titres ou listes de l’article comme base du thread[wordtune.com](https://www.wordtune.com/blog/repurposing-content-for-social-media#:~:text=Content%20marketing%20platform%20Clearvoice%20doesn%27t,include%20the%20most%20important%20words). ClearVoice, par exemple, transforme les H3 de son blog en une liste bullet sur Twitter[wordtune.com](https://www.wordtune.com/blog/repurposing-content-for-social-media#:~:text=What%20they%20are%20doing%20is,or%20changing%20it%20up%20slightly).
    
    *Exemple de prompt X* :
    
    ```markdown
    À partir de l’article ci-dessous, écris un thread pour X (Twitter) :
    - Le thread doit comporter 5 à 7 tweets concis.
    - Le 1er tweet est un hook qui donne envie de lire le fil (chiffre frappant, question, fait étonnant).
    - Les tweets 2-6 résument chacun une idée ou un conseil clé (ton bref, éventuellement avec emoji pour le ton léger, si approprié).
    - Le dernier tweet conclut et invite à agir (par ex : poser une question aux lecteurs, ou indiquer “+ de détails dans l’article complet”).
    **Attention** : 280 caractères max par tweet. Pas de hashtag excessif (1 ou 2 pertinents si nécessaire).
    Voici le contenu source :
    """{résumé_ou_points_clés_de_l'article}"""
    
    ```
    
    *Note* : On peut choisir de ne pas inclure l’article entier mais plutôt un résumé ou les points clés pour guider l’IA, afin d’éviter qu’elle dépasse la limite.
    
- **YouTube (script vidéo)** : Ici l’objectif est de produire un *script* qui pourrait être lu (par un humain ou un avatar) pour une vidéo YouTube, par exemple de 5-10 minutes. **Approche** : Demander un script structuré avec introduction orale, points développés, et conclusion, éventuellement en incluant des indications de visuels. Par exemple : *"Convertis cet article en un script de vidéo YouTube d’environ 5 minutes. Adopte un ton enthousiaste comme un présentateur. Commence par accrocher le spectateur en posant la question centrale ou en exposant le problème. Puis structure la vidéo en plusieurs sections correspondant aux H2 de l’article, avec des transitions fluides. Termine par un résumé des conseils et une incitation (abonne-toi, like...). Inclue des suggestions de visuels ou d’exemples si pertinent."*
    
    On peut s’inspirer des recommandations de Wistia : préciser le type de vidéo, la durée visée, le ton, s’il y a une personne face caméra ou seulement voix off, etc.[wistia.com](https://wistia.com/learn/production/turn-articles-into-videos#:~:text=Want%20more%20creative%20control%20over,get%20a%20better%20video%20script)[wistia.com](https://wistia.com/learn/production/turn-articles-into-videos#:~:text=Ready%20with%20these%20pointers%2C%20your,could%20look%20something%20like%20this).
    
    *Exemple de prompt YouTube* :
    
    ```markdown
    Transforme l’article suivant en**script de vidéo YouTube** :
    - Durée cible ~5 minutes (environ 750-800 mots).
    - Style : ton amical et énergique, comme un(e) youtubeur(se) qui explique à son audience.
    - Inclue une**intro percutante** qui présente le sujet et annonce le plan (et donne envie de rester).
    - Pour chaque grande idée de l’article, fais-en un segment du script, avec une explication claire. Tu peux reformuler en style oral.
    - Ajoute entre \[crochets\] d’éventuelles indications visuelles ou textuelles à afficher (ex: \[Affiche un titre "Astuce 1: ..."\] ou \[Insérer infographie des chiffres X\]).
    - Conclusion : résume les points clés et invite à s’abonner / liker / commenter.
    Voici le contenu à adapter :
    """{contenu_article}"""
    
    ```
    
- **TikTok (script court)** : Format très court (30 à 60 secondes). Il faut extraire **l’essentiel en mode très condensé et accrocheur**. Le ton peut être plus décontracté, avec éventuellement l’utilisation de tendances (emoji, expressions populaires, appel direct au spectateur). **Approche** : *"Fournis un script ultra-court (environ 150 mots) pour une vidéo TikTok informelle. Commence par une phrase choc ou une question directe en regard caméra pour captiver. Enchaîne 3-5 conseils rapides (1 phrase chacun). Termine par une conclusion punchy ou un call-to-action (ex: “dis-moi en commentaire…”)."* Le format TikTok préfère l’authenticité et va droit au but[wordtune.com](https://www.wordtune.com/blog/repurposing-content-for-social-media#:~:text=Customizing%20visuals%20for%20each%20platform).
    
    *Exemple de prompt TikTok* :
    
    ```markdown
    À partir de l’article ci-dessous, crée un script**TikTok** très court :
    - Longueur ~45 secondes (120-150 mots).
    - Doit commencer par un**hook** fort (question ou fait surprenant) dans la 1ère seconde pour capter l’attention.
    - Style très**concis et dynamique** : phrases courtes, ton conversationnel.
    - Liste 3 à 5 astuces ou points clés tirés de l’article, formulés de manière punchy (possibilité d’ajouter un ou deux émojis pertinents pour le ton).
    - Conclus en invitant à interagir (ex: poser une question aux viewers ou promettre plus d’astuces sur notre site).
    Voici le contenu de référence :
    """{contenu_article}"""
    
    ```
    

Pour chaque variation, on utilise soit le même modèle d’IA avec un prompt différent, soit éventuellement on peut utiliser un modèle plus petit/rapide pour les formats courts (puisqu’un thread ou un script 1 min est plus court qu’un article de 2000 mots). **Astuce économique** : générer les variantes en une seule fois peut être tenté (ex : demander dans un seul prompt de donner le post LinkedIn, le thread et la FAQ…). Cependant, mieux vaut séparer pour garder un contrôle sur chaque format et parce que chaque plateforme a ses codes à respecter.

Après génération, on insère également ces contenus dans Supabase (soit dans les colonnes dédiées de `articles`, soit dans la table `articles_variants`). Cela permet de les afficher sur le front (par exemple, un onglet “LinkedIn” pour voir l’aperçu du post, etc.) ou de les réutiliser lors de la publication automatique.

### 4. **Maillage interne automatique**

Le “maillage interne” consiste à insérer dans l’article des liens vers d’autres articles du site traitant de sujets liés, afin d’améliorer la navigation et le SEO. Google valorise les contenus faisant autorité sur un sujet et reliés entre eux de manière cohérente[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=6). Notre agent doit donc :

- **Identifier les ancres potentielles** : en parcourant le texte généré, détecter des mots ou expressions qui correspondent à d’autres articles. Par exemple, si l’article mentionne “Supabase” et que nous avons un article dédié à Supabase, c’est une opportunité de lien. De même, si des concepts voisins (catégorie identique) apparaissent, on pourra lier.
- **Rechercher dans la base** : via Supabase, effectuer une requête plein-texte ou par mot-clé pour trouver les 3-5 articles existants les plus pertinents. Par exemple, on peut utiliser le mot clé principal de notre article actuel ou son thème, et chercher d’autres articles avec le même thème. Supabase permet une recherche texte du type :
    
    ```sql
    SELECT id, titre, slugFROM articles
    WHERE to_tsvector('french', contenu_markdown) @@ plainto_tsquery('french','{mot_cle}')
    OR to_tsvector('french', titre) @@ plainto_tsquery('french','{mot_cle}');
    
    ```
    
    Ou plus simplement, filtrer par la colonne `categorie` (si deux articles partagent la même catégorie, ils sont potentiellement liés).
    
- **Choisir les liens à insérer** : idéalement 2 à 5 liens internes pertinents[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=6). On évite d’en mettre trop pour ne pas diluer l’attention. Il faut choisir une ancre descriptive pour chaque lien (pas de “cliquez ici”, mais un texte naturel contenant le sujet de l’article lié).
- **Insertion** : Deux approches possibles :
    1. **Laisser l’IA le faire** : Fournir au modèle la liste des autres articles (titres + URL slug, et éventuellement une phrase de description de chacun), et lui demander de **réviser le contenu** pour y insérer naturellement des liens hypertextes Markdown sur des ancres pertinentes. Par exemple : *“Voici une liste d’articles connexes disponibles : Titre1, Titre2, ... Merci d’insérer 3 à 5 liens internes dans l’article aux endroits appropriés, en utilisant le titre ou un mot-clé approprié comme texte du lien.”* L’IA replacera les liens probablement de manière cohérente.
    2. **Le faire en post-traitement** : Parcourir le Markdown du contenu généré côté backend. Par exemple, on peut définir un dictionnaire de mots-clés → URL à linker (basé sur les titres d’articles liés). En Python, on pourrait faire quelque chose comme :
        
        ```python
        links = {"Supabase":"/articles/supabase-guide","Google Analytics":"/articles/google-analytics" }
        for keyword, urlin links.items():
            contenu_markdown = contenu_markdown.replace(keyword,f"[{keyword}]({url})")
        
        ```
        
        en faisant attention à ne pas lier la première occurrence du mot (pour ne pas spammer dès l’intro, généralement on insère dans le corps).
        
        La méthode IA est élégante mais consomme un appel de plus; la méthode code est déterministe mais nécessite de bien choisir les ancres. On peut combiner : par exemple détecter la présence de certains mots clés (via simple recherche ou en utilisant la liste de résultats de la requête Supabase) puis insérer le lien.
        
- **Exemple** : Supposons que notre article traite de “SEO technique” et que nous ayons déjà un article “Guide de la vitesse de chargement web”. Si le texte contient “améliorer la vitesse du site”, on pourrait ajouter un lien : *améliorer la vitesse du site* → améliorer la vitesse du site. Cela offre un chemin au lecteur vers du contenu relié, et Google voit un lien contextuel avec une ancre riche[nikofischer.com](https://nikofischer.com/seo-content-strategy-organic-traffic#:~:text=6).

**Conseil SEO** : Veiller à ce que chaque nouvel article lie vers quelques anciens articles ET idéalement que quelques anciens articles soient mis à jour pour faire un lien vers le nouveau (maillage bidirectionnel dans le cluster thématique). Ce second aspect peut être orchestré manuellement ou via une petite routine (par ex, pour chaque article lié, ajouter en bas “Voir aussi : [titre du nouvel article]”). Dans un premier temps, l’agent peut se contenter de lier de nouveaux articles vers l’ancien sans rétro-édition.

### 5. **Publication et Orchestration via n8n**

Une fois le contenu généré et stocké, l’étape suivante est de le **publier sur les canaux appropriés**. Plutôt que d’appeler directement les APIs de LinkedIn, Twitter, etc., on délègue à **n8n** ces opérations pour profiter de son écosystème d’intégrations et de son aspect no-code. L’architecture pourrait être : FastAPI notifie n8n (via un webhook ou en écrivant dans la base) qu’un nouvel article est prêt, et n8n exécute les workflows de publication.

- **Intégration FastAPI → n8n** : On peut créer dans n8n un **Webhook Trigger** (un URL spécifique). Dans FastAPI, après l’enregistrement de l’article, on envoie une requête HTTP POST vers ce webhook, avec par exemple l’ID de l’article ou directement tout le contenu nécessaire. Par exemple :
    
    ```python
    import requests
    n8n_webhook_url ="https://myn8ninstance.com/webhook/publier_article"
    data = {"article_id": new_article_id }
    requests.post(n8n_webhook_url, json=data)
    
    ```
    
    Sur réception, n8n démarrera le workflow de distribution.
    
- **Workflow n8n de publication** : À l’intérieur de n8n, on configure des noeuds :
    1. **Récupération de l’article** : un noeud HTTP GET (ou Supabase) va chercher les détails de l’article `article_id` (titre, contenu, variantes) depuis Supabase.
    2. **Publication Blog/Website** : Si le blog est statique (Next.js lisant direct Supabase), on n’a rien à faire, l’article est déjà visible. Sinon, s’il faut le poster sur WordPress ou autre CMS, n8n peut utiliser un noeud dédié (ex: WordPress node) pour créer l’article via API.
    3. **LinkedIn** : Utiliser l’API LinkedIn via le node **LinkedIn** de n8n (ou HTTP node si non fourni). LinkedIn a des endpoints pour publier des posts ou articles. Il faudra avoir configuré les identifiants OAuth LinkedIn dans n8n. Le contenu à poster : pour un carrousel, LinkedIn requiert un document PDF pour un carousel natif – on peut générer un PDF des slides si on a un outil (hors scope ici). On pourrait à la place publier simplement un post texte contenant les points clés, ou un lien vers l’article. Dans le cadre de l’exercice, on peut choisir de publier un post texte avec un extrait et lien. Le **LinkedIn node** prendra en entrée par ex le champ `contenu_linkedin` de la base et le publiera.
    4. **Twitter (X)** : De même, utiliser soit le node **Twitter** (auth OAuth 1.0a ou 2.0) pour poster le thread. n8n devra probablement itérer sur chaque tweet du thread. On peut stocker le thread comme une liste de strings et boucler, ou fournir un texte avec `\n\n` pour séparation et faire un split. Attention aux limites API (Twitter permet maintenant les threads via l’API v2 avec user context).
    5. **YouTube** : Publier une vidéo nécessite d’avoir la vidéo. Ici on n’automatise pas la production de la vidéo elle-même (on n’a généré qu’un script). Si l’on dispose d’un système text-to-speech ou de génération vidéo (via un outil comme Synthesia API ou autre), on pourrait aller plus loin, mais c’est complexe et coûteux. Plus réaliste : n8n peut envoyer le script par email à l’équipe vidéo, ou le placer dans un Google Doc via API pour montage ultérieur. Vu l’objectif “économique”, on peut choisir de **ne pas automatiser la mise en ligne YouTube** dans un premier temps, mais de fournir le script au contenu manager.
    6. **TikTok** : Similaire à YouTube, poster sur TikTok via API est possible (TikTok API existe pour les business accounts) mais requiert une vidéo. On peut imaginer brancher un outil de synthèse vidéo automatique pour TikTok (par exemple, il existe des APIs pour générer une vidéo à partir d’un script, ou des nœuds ffmpeg). Cependant, cela complexifie beaucoup. Donc ici, possiblement, on se limite à générer le script et on notifie quelqu’un de le tourner.
- **Planification et cadence** : n8n permet d’ajouter un **Cron trigger** pour automatiser la génération de nouveaux contenus à intervalle régulier (ex: 1 article par semaine). On pourrait avoir un workflow distinct qui chaque jour/semaine prend un mot-clé prédéfini (depuis une Google Sheet ou depuis une table Supabase “idées”) et appelle l’API FastAPI de génération. Ainsi tout le pipeline devient automatique du brainstorming à la publication.
- **Notifications & suivi via n8n** : On peut configurer des noeuds d’envoi de notification (ex: un message Slack ou un email quand un article est publié, avec un récapitulatif).

Ce type de workflow a déjà été implémenté par des experts : un template n8n propose par exemple de **générer un post LinkedIn et le reposter sur X automatiquement chaque jour**[n8n.io](https://n8n.io/workflows/9100-automated-viral-content-engine-for-linkedin-and-x-with-ai-generation-and-publishing/#:~:text=%E2%9A%99%EF%B8%8F%20How%20It%20Works%20,Flow). Notre pipeline s’inspire de ces bonnes pratiques, en adaptant aux formats choisis. Il est recommandé d’insérer éventuellement une étape de validation manuelle (un noeud qui envoie pour approbation avant publication) pour éviter tout débordement, notamment sur les réseaux (principe de *Human in the loop* pour surveiller le contenu de marque)[n8n.io](https://n8n.io/workflows/9100-automated-viral-content-engine-for-linkedin-and-x-with-ai-generation-and-publishing/#:~:text=Best%20Practices%20%26%20Tips).

### 6. **Suivi des Performances (Google Analytics)**

Une fois les pages en ligne et partagées, il est crucial de mesurer les résultats : trafic organique, comportement des visiteurs, conversions. Pour rester dans l’approche automatisée, on intègre la récupération de données Google Analytics dans le système :

- **Google Analytics 4** : Depuis juillet 2023, GA4 a remplacé Universal Analytics. On utilisera l’**API Google Analytics Data (GA4)** pour extraire les métriques souhaitées. Cette API permet d’obtenir programmatiquement les données de rapports GA (pageviews, durée moyenne, taux de rebond, etc.)[lupagedigital.com](https://www.lupagedigital.com/blog/google-analytics-api-python/#:~:text=Google%20Analytics%204%20,and%20integrate%20with%20other%20applications).
- **Authentification** : Il faudra créer un projet Google Cloud, activer l’API GA4, et obtenir des credentials (une clé de service ou OAuth client)[medium.com](https://medium.com/@sherangaofc/google-analytics-4-ga4-data-extraction-using-api-in-python-7327d93e4acd#:~:text=Create%20Google%20API%20Credentials)[medium.com](https://medium.com/@sherangaofc/google-analytics-4-ga4-data-extraction-using-api-in-python-7327d93e4acd#:~:text=Press%20enter%20or%20click%20to,view%20image%20in%20full%20size). Pour simplifier, un compte de service avec accès en lecture à la propriété GA4 du site est idéal. On récupère un JSON de clé privée.
- **Récupération des données** : On peut faire cela soit via n8n (il existe un n8n Google Analytics node), soit via FastAPI en Python. Par exemple, en Python, utiliser la librairie officielle `google-analytics-data` :
    
    ```python
    from google.analytics.data_v1betaimport BetaAnalyticsDataClient
    from google.analytics.data_v1beta.typesimport RunReportRequest, DateRange, Dimension, Metric
    client = BetaAnalyticsDataClient().from_service_account_json('credentials.json')
    request = RunReportRequest(property=f"properties/{GA4_PROPERTY_ID}",
        dimensions=[Dimension(name="pagePath")],
        metrics=[Metric(name="screenPageViews"), Metric(name="averageSessionDuration")],
        date_ranges=[DateRange(start_date="2024-01-01", end_date="2024-01-31")]
    )
    response = client.run_report(request)
    # parse response rows...
    
    ```
    
    Ce code interroge GA4 pour obtenir, par exemple, le nombre de vues de page (`screenPageViews`) et la durée moyenne de session sur la période donnée, ventilés par URL (`pagePath`). On pourrait affiner les dimensions/metrics (GA4 propose “sessionCount”, “eventCount” pour CTA si trackés, etc.).
    
- **Stockage/affichage des KPIs** : On peut créer une petite interface dans Next.js pour afficher ces stats par article. Par exemple, ajouter des colonnes `vues_mensuelles` ou `dernieres_statistiques` dans la table `articles` et les mettre à jour via un script périodique. Toutefois, il est sans doute préférable de **ne pas stocker** en base (pour éviter la duplication de données analytiques), mais plutôt de calculer à la volée dans un tableau de bord. Une approche : un endpoint FastAPI `/analytics/{article_id}` qui, lorsqu’appelé, utilise l’API GA pour récupérer les données en temps réel et les renvoie en JSON. Next.js peut appeler ce endpoint pour afficher un dashboard admin (avec des graphiques, par ex. en utilisant une librairie de chart).
- **Metrics suivies** :
    - *Pages vues (pageviews)* par article – indicateur de trafic.
    - *Temps moyen passé* sur l’article – indicateur d’engagement (si le temps moyen est élevé, l’article est lu en profondeur).
    - *Taux de conversion CTA* – si on a un CTA (bouton) mesuré via un événement GA (ex: clic sur un lien d’inscription), on peut récupérer le nombre d’events.
    - *Taux de rebond* – si pertinent, pour voir si les gens quittent après l’article ou naviguent plus (grâce au maillage interne, on espère réduire le rebond).
    
    Ces données peuvent être récupérées via GA4 en combinant dimensions et metrics dans l’API. Par exemple, `eventCount` avec dimension `eventName` to filter CTA events.
    
- **Automatisation** : On peut orchestrer via n8n aussi – par exemple un workflow qui tous les mois extrait les chiffres du mois et envoie un rapport (Slack/email) ou alimente une Google Sheet. Vu que GA4 API offre l’accès à ces données, c’est assez flexible. L’important est que l’agent fournisse la **visibilité** sur les performances sans intervention manuelle, aligné avec l’objectif d’automatisation.

## Exemples de Code (FastAPI)

Voici quelques extraits illustratifs de l’implémentation en Python avec FastAPI pour orchestrer ces étapes :

- **Endpoint de génération principale** – crée l’article et ses variantes :

```python
from fastapiimport FastAPI
from supabaseimport create_client

app = FastAPI()
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

@app.post("/generer_article/")
asyncdefgenerer_article(mot_cle: str):
# 1. Préparation du prompt principal
    prompt_article = construire_prompt_article(mot_cle)# fonction qui retourne le texte du prompt

# 2. Appel au modèle d'IA pour générer l'article
    article_markdown = appeler_openai(prompt_article, model="gpt-3.5-turbo")# ou GPT-4, selon budget

# 3. Stocker l'article dans la base
    titre = extraire_titre_markdown(article_markdown)# parse le H1 du markdown
    data = {
"titre": titre,
"mot_cle_principal": mot_cle,
"contenu_markdown": article_markdown,
"date_publication": datetime.utcnow().isoformat()
    }
    res = supabase.table("articles").insert(data).execute()
    article_id = res.data[0]["id"]

# 4. Générer variantes (LinkedIn, Twitter, etc.)
    contenu_linkedin = appeler_openai(construire_prompt_linkedin(article_markdown))
    contenu_twitter = appeler_openai(construire_prompt_twitter(article_markdown))
    contenu_youtube = appeler_openai(construire_prompt_youtube(article_markdown))
    contenu_tiktok = appeler_openai(construire_prompt_tiktok(article_markdown))
# Insérer les variantes
    supabase.table("articles").update({
"contenu_linkedin": contenu_linkedin,
"contenu_twitter": contenu_twitter,
"contenu_youtube": contenu_youtube,
"contenu_tiktok": contenu_tiktok
    }).eq("id", article_id).execute()

# 5. Intégrer liens internes dans l'article (post-traitement simple)
    autres_articles = supabase.rpc("match_articles_pertinents", {"mot": mot_cle}).execute().data
    contenu_maillaged = inserer_liens_internes(article_markdown, autres_articles)
    supabase.table("articles").update({"contenu_markdown": contenu_maillaged}).eq("id", article_id).execute()

# 6. Déclencher workflow n8n de publication
    requests.post(N8N_WEBHOOK_URL, json={"article_id": article_id})

return {"status":"OK","article_id": article_id}

```

*(Ce code est simplifié pour illustration ; en production on gèrerait les erreurs, les temps d’attente des API, etc. De plus, les appels OpenAI pourraient être lancés en tâche de fond asynchrone si on veut répondre plus vite à l’utilisateur et traiter la génération sans bloquer.)*

- **Fonction d’appel OpenAI** (pseudo-code) :

```python
import openai
defappeler_openai(prompt: str, model="gpt-3.5-turbo") ->str:
    response = openai.ChatCompletion.create(
        model=model,
        messages=[ {"role":"user","content": prompt} ],
        temperature=0.7
    )
    texte = response['choices'][0]['message']['content']
return texte

```

On ajustera le modèle (GPT-3.5 vs GPT-4) en fonction de la longueur et de la complexité du contenu : GPT-3.5 est beaucoup plus économique et peut suffire pour la plupart des contenus, tandis que GPT-4 est plus cher mais parfois meilleur sur la cohérence et la créativité. **Côté coût**, GPT-4 peut coûter ~15-30× plus cher par token que 3.5[reddit.com](https://www.reddit.com/r/OpenAI/comments/11rd9pl/damn_gpt4_is_expensive_compared_to_gpt35/#:~:text=Damn%20gpt,costs%2030%20times%20as). Des analyses montrent que **GPT-3.5 Turbo est l’option la plus économique** et souvent suffisante pour des drafts de qualité, alors que GPT-4 offre la performance maximale à un tarif nettement supérieur[dida.do](https://dida.do/openai-s-api-pricing-cost-breakdown-for-gpt-3-5-gpt-4-and-gpt-4o#:~:text=Comparing%20these%20prices%2C%20we%20can,for%20applications%20with%20budget%20constraints)[dida.do](https://dida.do/openai-s-api-pricing-cost-breakdown-for-gpt-3-5-gpt-4-and-gpt-4o#:~:text=Image). Une stratégie pragmatique est d’utiliser GPT-3.5 pour générer le contenu initial, puis éventuellement GPT-4 pour une passe d’editing ou pour les morceaux critiques (ex: la réponse rapide ou les titres) si la qualité doit être peaufinée. Cela permet d’optimiser le budget. De plus, on peut tirer parti des modèles open-source (comme Llama 2) si on veut éviter les coûts variables : un modèle open-source hébergé pourra générer du texte sans coût par requête, mais nécessite une infrastructure (GPU) et aura peut-être une qualité moindre ou une vitesse plus lente pour des textes longs. Pour rester léger, on peut s’appuyer sur les APIs externes au début, et garder en tête l’option open-source pour l’avenir si le volume augmente.

## Optimisations et Bonnes Pratiques

Dans la conception de cet agent, voici quelques propositions d’optimisation pour allier efficacité, qualité et coût :

- **Mise en cache des résultats IA** : Si on génère beaucoup de contenu ou qu’on regénère parfois sur le même mot-clé (par exemple mise à jour d’un article), implémenter un cache pour éviter de solliciter l’API inutilement. On pourrait stocker les réponses d’OpenAI pour un prompt donné (ou au moins le plan de l’article), afin de ne payer qu’une fois.
- **Choix du modèle adaptatif** : comme discuté, utiliser GPT-3.5 pour la majorité des tâches, et garder GPT-4 pour la relecture ou la génération des titres/meta descriptions si besoin de plus de finesse. Ou tester des modèles open-source en local pour les variantes courtes (il existe de petits modèles spécialisés dans le copywriting court, qui pourraient être assez bons pour Twitter par ex).
- **Supervision minimale** : Même si l’objectif est l’autonomie, planifier une relecture humaine rapide des articles piliers avant publication peut éviter de publier du contenu erroné ou maladroit (les LLM peuvent inventer des choses). On peut intégrer une étape où le contenu reste en “brouillon” tant qu’un utilisateur ne l’a pas validé via l’interface Next.js.
- **Prompt tuning** : Raffiner les prompts au fil du temps en analysant les outputs. Si l’IA a tendance à faire des paragraphes trop longs, réitérer l’instruction “paragraphes de 2-3 phrases maximum”. Si la “réponse rapide” n’est pas assez synthétique, ajuster ce segment du prompt. Le prompt engineering est itératif.
- **n8n Best Practices** : Sur n8n, sécuriser les credentials (ne jamais stocker en clair dans le repo) et gérer les quotas API (s’assurer par exemple de ne pas dépasser les limites LinkedIn – peut-être limiter à 1 post par 6h etc.). Utiliser les nodes de délai ou de planification de manière judicieuse pour échelonner les publications (ex: ne pas tout poster partout instantanément, mais plutôt étaler sur quelques heures/jours pour maximiser l’impact).
- **Analytics & Feedback loop** : Utiliser les données GA pour améliorer l’agent. Par exemple, si on constate via GA que certains articles ont un temps de lecture faible, cela peut indiquer un contenu peu engageant – on pourrait alors ajuster les prompts (peut-être l’intro n’est pas assez accrocheuse, etc.). On peut imaginer un futur module d’**auto-amélioration** où l’IA regarde les stats de l’article après un mois et propose une mise à jour de l’article pour l’améliorer (c’est de la R&D supplémentaire, mais envisageable).
- **Évolutivité** : Si le volume d’articles augmente, envisager de paralléliser la génération (FastAPI peut lancer plusieurs tâches async en parallèle). Supabase devrait tenir la charge en lecture/écriture si le volume est raisonnable. n8n peut traiter les workflows en parallèle aussi mais attention à la charge (peut-être mettre en place un queue sur n8n ou utiliser un worker dédié pour les posts réseaux).
- **Coût d’hébergement** : FastAPI peut tourner sur un petit serveur (ou serveless) puisque la majeure partie du travail (IA et n8n) est externalisée. Supabase a une offre gratuite intéressante pour démarrer. n8n peut être auto-hébergé sur le même serveur ou sur un service cloud pas cher (l’exécuter localement permet d’éviter un SaaS Zapier coûteux, n8n étant open-source).

En appliquant ces optimisations et en s’inspirant des workflows existants (par ex. l’idée de combiner **analyse SEO, génération, repurpose, publication auto** est déjà utilisée par des créateurs de contenu modernes[n8n.io](https://n8n.io/workflows/9100-automated-viral-content-engine-for-linkedin-and-x-with-ai-generation-and-publishing/#:~:text=%E2%9A%99%EF%B8%8F%20How%20It%20Works%20,Flow)), on obtient un **agent de contenu SEO complet**. Ce système produit du contenu de manière autonome, le distribue sur plusieurs canaux pour maximiser la portée, et boucle sur les performances pour orienter la stratégie. Ce faisant, il s’aligne avec l’objectif d’être un **“content engine” économique et efficace**, avec un minimum d’intervention manuelle. Les bonnes pratiques comme l’ajout de validations humaines sur les contenus sensibles, l’ajustement de la fréquence de publication et le suivi des métriques assurent que l’automatisation reste sous contrôle et pertinente[n8n.io](https://n8n.io/workflows/9100-automated-viral-content-engine-for-linkedin-and-x-with-ai-generation-and-publishing/#:~:text=Best%20Practices%20%26%20Tips).

En conclusion, ce plan fournit un squelette robuste pour développer l’agent IA séquentiel en Python/FastAPI. Il allie les **avancées de l’IA** pour la génération de texte et l’**ingénierie logicielle** pour orchestrer les tâches, tout en respectant les contraintes du SEO et du marketing de contenu actuels. En capitalisant sur des contenus piliers bien structurés et un recyclage intelligent vers d’autres formats, on maximise la visibilité tout en minimisant l’effort additionnel. Avec une telle approche, on peut nourrir un blog et les réseaux sociaux de façon soutenue, cohérente et mesurable, le tout sur une infrastructure lean (auto-hébergée, open source) contrôlant les coûts.