# Guide des Tests & CI

Ce projet contient 3 niveaux de tests :

## 1️⃣ **Tests Unitaires (Vitest)**

Tests des composants React et des utilitaires.

### Lancer localement
```bash
# Run une fois (CI mode)
npm run test

# Watch mode (rechargement auto)
npm run test:watch

# UI interactive (optionnel)
npm run test:ui
```

### Structure
- `tests/unit/*.test.ts` : tests pures (actions, helpers)
- `tests/unit/*.test.tsx` : tests composants (ConcertCard, Navbar, etc.)

---

## 2️⃣ **Tests E2E (Playwright)**

Tests de scénarios utilisateur complets (navigation, formulaires).

### Lancer localement
```bash
# Install navigateurs une seule fois
npx playwright install --with-deps

# Run les tests E2E
npm run e2e

# Mode debug interactive
npx playwright test --debug

# Générer et ouvrir un rapport HTML
npx playwright test --reporter=html
npx playwright show-report
```

### Structure
- `e2e/login.spec.ts` : pages login/register, formulaires
- `e2e/navigation.spec.ts` : navbar, pages principales

### Notes
- Les E2E testent surtout l'**UI et la navigation**, pas les vraies connexions
- Playwright démarre automtiquement le serveur Next (`npm run dev`)
- Les tests s'exécutent en headless mode en CI, en headed mode si tu utilises `--debug`

---

## 3️⃣ **CI avec GitHub Actions**

Workflow automatique qui s'exécute sur chaque push/PR vers `main`.

### Fichier
`.github/workflows/ci.yml`

### Étapes
1. ✅ Lint (ESLint)
2. ✅ Unit tests (Vitest)
3. ✅ E2E tests (Playwright)

### Setup GitHub Secrets (optionnel pour E2E)

Si tu veux que la CI accède à une BDD :

1. Va sur GitHub → **Settings** → **Secrets and variables** → **Actions**
2. Ajoute les secrets suivants :
   - `NEXT_PUBLIC_BETTER_AUTH_URL` : URL de l'auth (ex: `http://localhost:3000`)
   - `BETTER_AUTH_SECRET` : Secret de Better-Auth
   - `DATABASE_URL` : Connexion PostgreSQL (si nécessaire pour seed)

3. Dans `.github/workflows/ci.yml`, ils seront accessibles comme `${{ secrets.NOM }}`

### Exemple d'ajout de secrets en CI
```yaml
env:
  NEXT_PUBLIC_BETTER_AUTH_URL: ${{ secrets.NEXT_PUBLIC_BETTER_AUTH_URL }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 📊 Démarrage Complet Localement

```bash
# 1. Dépendances
npm install

# 2. Setup de la BDD (optionnel, si tu utilises Neon/PostgreSQL)
# Copie .env.example vers .env.local et remplis les variables

# 3. Migrations
npm run db:migrate

# 4. Seed la BDD (données de test)
npm run db:seed

# 5. Dev server
npm run dev      # Lance Next.js en hot-reload

# 6. Tests (dans un autre terminal)
npm run lint     # Vérifier le code
npm run test     # Tests unitaires
npm run e2e      # Tests E2E
```

---

## 🔍 Résumé

| Commande | Type | Temps | Coverage |
|----------|------|-------|----------|
| `npm run lint` | Code quality | ~5s | –– |
| `npm run test` | Unit | ~5s | Composants + utilitaires |
| `npm run e2e` | End-to-End | ~10s | Parcours utilisateur |
| Tous ensemble en CI |  | ~20s total | –– |

---

## 📝 Ajouter plus de tests

### Nouveau test unitaire
```bash
# Crée tests/unit/ma-nouvelle-feature.test.tsx
```

Voir `tests/unit/concert-card.test.tsx` pour un exemple.

### Nouveau test E2E
```bash
# Crée e2e/mon-scenario.spec.ts
```

Voir `e2e/login.spec.ts` pour un exemple.

---

## 🚀 Prochaines étapes

- [ ] Ajouter des tests E2E pour les parcours "créer groupe" et "rejoindre groupe"
- [ ] Configurer une BDD test en CI (PostgreSQL via Neon)
- [ ] Couvrir les actions serveur avec plus de mocks
- [ ] Ajouter des reports de couverture de code (`coverage/index.html`)
- [ ] Intégrer des tests de performance ou accessibilité
