# 🎵 Potes2Live

Application web permettant de trouver des concerts et de créer/rejoindre des groupes pour y assister ensemble.

## 📋 Table des matières

- [Stack technique](#-stack-technique)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Tests](#-tests)
- [Documentation](#-documentation)
- [Architecture](#-architecture)

---

## 🛠️ Stack technique

- **Framework** : Next.js 16 (App Router)
- **Frontend** : React 19, TailwindCSS 4
- **Backend** : Next.js Server Actions
- **Base de données** : PostgreSQL (Neon)
- **ORM** : Drizzle ORM
- **Authentification** : Better-Auth
- **Tests** : Vitest (unitaires), Playwright (E2E)
- **CI/CD** : GitHub Actions
- **Déploiement** : Vercel

---

## 📦 Installation

### Prérequis

- Node.js 20+
- npm
- Compte PostgreSQL (Neon recommandé)

### Étapes

1. **Cloner le projet**
```bash
git clone <repo-url>
cd my-app
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créer un fichier `.env.local` à la racine :

```env
DATABASE_URL=postgresql://user:password@host/db
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

4. **Migrations & seed de la base de données**
```bash
npm run db:push      # Appliquer le schéma
npm run db:seed      # Insérer les données de test
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## 🎮 Utilisation

### Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur Next.js

# Build
npm run build        # Build de production
npm run start        # Lance le build en prod

# Base de données
npm run db:generate  # Générer les migrations
npm run db:migrate   # Appliquer les migrations
npm run db:push      # Push le schéma direct
npm run db:studio    # Interface Drizzle Studio
npm run db:seed      # Seed la BDD

# Qualité & Tests
npm run lint         # Linter ESLint
npm run test         # Tests unitaires (Vitest)
npm run test:watch   # Tests en watch mode
npm run test:ui      # UI interactive Vitest
npm run e2e          # Tests E2E (Playwright)
```

### Fonctionnalités principales

- 🔐 **Authentification** : inscription, connexion, profil
- 🎵 **Concerts** : liste, détails, filtres par ville
- 👥 **Groupes** : création, adhésion, limite de membres
- 💬 **Chat** : messagerie de groupe en temps réel
- 📱 **Responsive** : mobile-first, navbar adaptative

---

## 🧪 Tests

Le projet contient **17 tests** (9 unitaires + 8 E2E) avec CI automatique.

### Tests unitaires (Vitest)

```bash
npm run test        # Run une fois
npm run test:watch  # Mode watch (dev)
npm run test:ui     # Interface interactive
```

**Coverage** :
- Composants : Navbar, ConcertCard, MyGroupCard
- Actions : concerts (get, filter, slug)
- Helpers : utilities

### Tests E2E (Playwright)

```bash
npm run e2e                    # Run les tests
npx playwright test --debug    # Mode debug
npx playwright show-report     # Rapport HTML
```

**Scénarios** :
- Formulaires login/register
- Navigation navbar
- Pages concerts, groups, profile

### CI/CD

GitHub Actions automatique sur `push` et `pull_request` vers `main` :
1. ✅ Lint
2. ✅ Tests unitaires
3. ✅ Tests E2E
4. ✅ Déploiement Vercel

---

## 📖 Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** : architecture technique détaillée, patterns, schémas
- **[TESTING.md](TESTING.md)** : guide complet des tests (local + CI)
- **Code** : types et commentaires inline

---

## 🏗️ Architecture

### Vue d'ensemble

```
Client (React) → Server Actions → Drizzle ORM → PostgreSQL
                      ↓
                 Better-Auth
```

### Structure des dossiers

```
app/
├── (auth)/           # Login, Register
├── actions/          # Server Actions (logique métier)
├── api/auth/         # Better-Auth endpoints
├── concerts/         # Module Concerts
├── groups/           # Module Groupes
├── lib/              # Config (auth, DB, schema)
├── components/       # Composants partagés
└── type.ts           # Types TypeScript
```

### Patterns de conception

- **Server Actions** : encapsulation logique métier
- **Repository** : abstraction DB via Drizzle
- **Component Composition** : UI modulaire
- **Singleton** : instance auth unique

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour les schémas et détails.

---

## 🚀 Déploiement

L'application est déployée sur **Vercel** avec CI/CD automatique.

### Workflow

```
git push main → GitHub Actions → Tests → Vercel Deploy
```

---

## 📊 Métriques

- **Tests** : 17 tests (100% passent)
- **Coverage** : composants + actions critiques
- **CI** : ~20s par run
- **Perf** : Server Components, caching Next.js

---

## 🤝 Contribution

Ce projet est développé dans le cadre du **RNCP6 - Concepteur Développeur d'Applications**.

---

## 📄 Licence

Projet académique RNCP 2026.
