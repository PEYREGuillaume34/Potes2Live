# 🗺️ Roadmap — Potes2Live

> Historique des phases de développement et perspectives d'évolution du projet,
> basé sur l'historique des commits du dépôt.

---

## ✅ Phase 1 — Initialisation du projet *(déc. 2025)*

| Date | Commit | Description |
|------|--------|-------------|
| 18/12/2025 | `d6322ae` | Initial commit from Create Next App |
| 13/01/2026 | `c70bc02` | Première idée / maquette conceptuelle |
| 14/01/2026 | `9bfe198` | Seconde version de l'idée |

**Objectifs atteints :**
- [x] Initialisation Next.js (App Router)
- [x] Définition du concept de l'application
- [x] Exploration de l'architecture technique

---

## ✅ Phase 2 — Fonctionnalités cœur *(jan. 2026)*

| Date | Commit | Description |
|------|--------|-------------|
| 15/01/2026 | `015f30c` | Mobile First — icons et navigation |
| 15/01/2026 | `4f83ab8` | Navbar finalisée, page Profil active |
| 16/01/2026 | `9f6037f` | Connexion / Déconnexion / Inscription + Édition profil |
| 18/01/2026 | `eed0305` | Liste de concerts affichée (filtre en cours) |
| 19/01/2026 | `557b23b` | Filtre Paris & arrondissements |
| 19/01/2026 | `a64711c` | Slug concert fonctionnel |
| 20/01/2026 | `b3c4071` | Server Actions pour les groupes |
| 22/01/2026 | `538a920` | Feature Groupes opérationnelle |
| 22/01/2026 | `fa8d7ac` | Gestion du mot de passe dans l'édition de profil |
| 23/01/2026 | `0fb0553` | Modifications supplémentaires du profil |
| 25/01/2026 | `153e537` | Nombre de groupes affiché sur la card événement |
| 25/01/2026 | `ea03e06` | Système de discussion (v1 non fonctionnel) |
| 26/01/2026 | `1cf27b7` | Chat de groupe fonctionnel |
| 26/01/2026 | `d372dc0` | Liens vers la page discussion depuis /concerts et /groups |

**Objectifs atteints :**
- [x] Authentification complète (inscription, connexion, déconnexion)
- [x] Page profil & édition
- [x] Liste des concerts avec filtre par ville/arrondissement
- [x] Pages de détail concert (slug)
- [x] Création et adhésion à des groupes
- [x] Chat de groupe en temps réel

---

## ✅ Phase 3 — Finitions UI/UX & déploiement *(jan.–fév. 2026)*

| Date | Commit | Description |
|------|--------|-------------|
| 27/01/2026 | `951c1c9` | Changements CSS globaux |
| 27/01/2026 | `236f053` | Bouton désactivé si déjà membre d'un groupe |
| 27/01/2026 | `b40e386` | CSS boutons Inscription / Connexion |
| 28/01/2026 | `15825cb` | Code postal sur les cards concert |
| 28/01/2026 | `d464889` | CSS chatbox & messages |
| 01/02/2026 | `bd6ac9d` | Downgrade Drizzle pour Vercel |
| 04/02/2026 | `9ad1b73` | Responsive desktop |
| 04/02/2026 | `e4e7e1f` | Navbar fixée en haut |
| 04/02/2026 | `accef29` | Correction du typage TypeScript |
| 04/02/2026 | `1c458bc` | Logo vectoriel |
| 06/02/2026 | `26608b7` | CSS bouton Edit & couleur de police groupForm |
| 08/02/2026 | `78e3264` | Barre de recherche ajoutée |
| 08/02/2026 | `1fc7a49` | Barre de recherche affinée |

**Objectifs atteints :**
- [x] Interface responsive (mobile-first + desktop)
- [x] Navbar sticky et logo vectoriel
- [x] Barre de recherche sur les concerts
- [x] Règles UX (bouton désactivé si déjà inscrit)
- [x] Déploiement Vercel fonctionnel

---

## ✅ Phase 4 — Refactorisation & base de données *(fév. 2026)*

| Date | Commit | Description |
|------|--------|-------------|
| 21/02/2026 | `45de6ac` | Refactorisation générale du code |
| 21/02/2026 | `427b9c3` | Modifications du schéma BDD |
| 21/02/2026 | `b869e1d` | Suppression du champ Capacity sur les salles |
| 22/02/2026 | `adb0c9b` | Curseur & effets Hover améliorés |

**Objectifs atteints :**
- [x] Refactorisation du code pour la maintenabilité
- [x] Nettoyage du schéma de base de données
- [x] Améliorations UX (hover, pointer)

---

## ✅ Phase 5 — Tests & CI/CD *(fév. 2026)*

| Date | Commit | Description |
|------|--------|-------------|
| 24/02/2026 | `0125a2b` | Tests unitaires (Vitest), E2E (Playwright) + pipeline CI |
| 26/02/2026 | `abaee72` | Merge PR #1 — tests unitaires |
| 27/02/2026 | `1a6ce17` | Correction des erreurs ESLint (any, apostrophes) |
| 27/02/2026 | `f8d351c` | Ajustements du workflow GitHub Actions |
| 27/02/2026 | `fcfa229` | Correction variables d'environnement |
| 27/02/2026 | `e314729` | Merge PR #5 — tests CI stabilisés |

**Objectifs atteints :**
- [x] 9 tests unitaires (Navbar, ConcertCard, MyGroupCard, actions)
- [x] 8 tests E2E (login, register, navigation)
- [x] Pipeline CI/CD GitHub Actions (lint → test → E2E → deploy)
- [x] Qualité du code : ESLint, TypeScript strict

---

## 🔭 Phase 6 — Améliorations prévues *(à venir)*

Ces évolutions sont suggérées d'après les patterns et limitations identifiés dans le projet :

### 🔔 Notifications
- [ ] Notifications en temps réel (nouveaux messages, nouvelles demandes de groupe)
- [ ] Emails transactionnels (confirmation d'inscription, rappel de concert)

### 🔍 Recherche avancée
- [ ] Filtres combinés : ville + date + genre musical
- [ ] Recherche par artiste ou salle
- [ ] Tri des résultats (date, popularité)

### 👤 Profil utilisateur enrichi
- [ ] Avatar personnalisé (upload d'image)
- [ ] Genres musicaux favoris
- [ ] Historique des concerts passés

### 🎵 Module Concerts
- [ ] Pagination des listes de concerts
- [ ] Intégration d'une API externe (Ticketmaster, Shotgun, Songkick, Bandsintown…)
- [ ] Partage de concert sur les réseaux sociaux

### 👥 Module Groupes
- [ ] Système de demande d'adhésion (invitation / acceptation)
- [ ] Rôles dans les groupes (admin, modérateur, membre)
- [ ] Fermeture automatique d'un groupe après le concert

### 💬 Chat
- [ ] Lecture en temps réel via WebSocket (remplacement du polling actuel)
- [ ] Messages avec images / emojis
- [ ] Réactions aux messages

### 🛡️ Sécurité & qualité
- [ ] OAuth (connexion via Google, GitHub)
- [ ] Double authentification (2FA)
- [ ] Augmentation de la couverture de tests (>80%)
- [ ] Tests de charge / performance

### 🌍 Internationalisation
- [ ] Support multilingue (FR / EN)
- [ ] Support de villes au-delà de Paris

---

## 📊 Résumé de progression

```
Phase 1 — Initialisation      ██████████ 100%  ✅
Phase 2 — Fonctionnalités     ██████████ 100%  ✅
Phase 3 — UI/UX & Déploiement ██████████ 100%  ✅
Phase 4 — Refactorisation     ██████████ 100%  ✅
Phase 5 — Tests & CI/CD       ██████████ 100%  ✅
Phase 6 — Évolutions futures  ░░░░░░░░░░   0%  🔭
```

---

> **Légende**
> - ✅ Phase terminée
> - 🔭 Phase planifiée / en cours de réflexion
> - [x] Fonctionnalité livrée
> - [ ] Fonctionnalité à implémenter
