# tekhe-care-dash

## Description

tekhe-care-dash est un tableau de bord web dédié au système de santé maternelle de TEKHE. Cette application permet de suivre et gérer les données de santé maternelle, avec un accès basé sur les rôles pour différents utilisateurs tels que les sages-femmes, les responsables de structure, les responsables de district et les partenaires.

L'application offre une interface moderne et intuitive pour la surveillance des consultations prénatales (CPN), la gestion des risques via intelligence artificielle, l'enrôlement CSU, les références SONU, la prévention et la nutrition (PEV), ainsi que l'export vers DHIS2.

## Fonctionnalités

- **Authentification sécurisée** : Connexion basée sur les rôles avec protection des routes.
- **Tableau de bord principal** : Vue d'ensemble des indicateurs clés de performance (KPI) pour la santé maternelle.
- **Suivi CPN** : Gestion des consultations prénatales.
- **Risques IA** : Analyse des risques à l'aide d'intelligence artificielle.
- **Enrôlement CSU** : Gestion des enrôlements CSU.
- **Références SONU** : Suivi des références SONU.
- **PEV & Nutrition** : Prévention et suivi nutritionnel.
- **Export DHIS2** : Export des données vers DHIS2 (réservé aux responsables de district).
- **Analytics Partenaires** : Données anonymisées pour les partenaires ONG, régionaux et gouvernementaux.
- **Détail Patient** : Vue détaillée des informations patient.
- **Interface responsive** : Design adaptatif utilisant Tailwind CSS et Shadcn UI.

## Technologies utilisées

- **Frontend** : React 18 avec TypeScript
- **Build Tool** : Vite
- **Routing** : React Router DOM
- **UI Components** : Shadcn UI (basé sur Radix UI)
- **Styling** : Tailwind CSS
- **State Management** : TanStack React Query
- **Forms** : React Hook Form avec Zod pour la validation
- **Charts** : Recharts
- **Icons** : Lucide React
- **Package Manager** : pnpm

## Installation

### Prérequis

- Node.js (version 18 ou supérieure)
- pnpm (recommandé) ou npm

### Étapes d'installation

1. Clonez le dépôt :

   ```bash
   git clone <url-du-depot>
   cd tekhe-care-dash
   ```

2. Installez les dépendances :

   ```bash
   pnpm install
   ```

3. Lancez l'application en mode développement :

   ```bash
   pnpm run dev
   ```

4. Ouvrez votre navigateur à l'adresse `http://localhost:5173` (ou le port indiqué par Vite).

### Scripts disponibles

- `pnpm run dev` : Lance le serveur de développement
- `pnpm run build` : Construit l'application pour la production
- `pnpm run build:dev` : Construit en mode développement
- `pnpm run lint` : Vérifie le code avec ESLint
- `pnpm run preview` : Prévisualise la version de production

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants Shadcn UI
│   └── ...
├── contexts/           # Contextes React (ex: AuthContext)
├── data/               # Données mockées
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires
├── pages/              # Pages de l'application
│   └── dashboard/      # Pages du tableau de bord
└── ...
```

## Rôles et accès

- **Sage-femme** : Accès aux fonctionnalités de suivi, risques, CSU, SONU, PEV et détail patient.
- **Responsable de structure** : Même accès que la sage-femme.
- **Responsable de district** : Accès complet + export DHIS2.
- **Partenaire ONG/Régional/Gouvernemental** : Accès aux analytics avec données anonymisées.

## Contribution

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commitez vos changements (`git commit -am 'Ajout de nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Contact

Pour toute question ou support, contactez l'équipe TEKHE à [contact@tekhe.sn](mailto:contact@tekhe.sn).
