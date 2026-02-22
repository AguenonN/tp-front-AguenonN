# Lien Vidéo 
https://youtu.be/1ZVN8JDn8aU


# Dahomey Pokedex - Frontend

Application React/Vite du projet Pokedex. Cette interface permet de consulter, rechercher, creer, modifier et supprimer des Pokemon via l'API backend.

## Fonctionnalites

- Liste paginee des Pokemon (20 par page).
- Navigation entre pages avec boutons `Precedent` / `Suivant`.
- Recherche temps reel par nom anglais ou francais.
- Recherche insensible aux accents et a la casse (ex: `Evoli`, `evoli`, `Evoli` donnent le meme resultat).
- Creation d'un Pokemon via formulaire (noms, types, stats, URL image).
- Affichage detaille d'un Pokemon (image, types, statistiques).
- Edition des statistiques depuis la page detail.
- Suppression d'un Pokemon depuis la page detail.
- Visualisation d'un hash d'integrite renvoye par le backend.
- Simulation de corruption de cle d'integrite (stockee dans `localStorage`).
- Ecran d'alerte d'integrite avec 3 actions:
  - supprimer toute la base (purge),
  - maintenir la quarantaine,
  - retablir l'integrite.
- Affichage de l'audit trail (operations CREATE/UPDATE/DELETE) sur la fiche detail.

## Stack technique

- React 19
- React Router
- Vite
- CSS custom (pas de framework UI)

## Routes frontend

- `/` : page principale avec liste + creation + recherche.
- `/pokemonDetails/:name` : fiche d'un Pokemon.
- `/integrity-alert` : ecran d'alerte integrite.

## Configuration

Fichier utilise: `front/.env`

```env
VITE_API_URL=http://localhost:3000
```

## Installation et lancement

Depuis le dossier `front`:

```bash
npm install
npm run dev
```

L'application est servie par defaut sur `http://localhost:5173`.

Important: le backend doit aussi etre demarre (API sur le port `3000`).

## Flux principal

1. Charger la liste des Pokemon depuis l'API.
2. Filtrer par nom FR/EN si l'utilisateur saisit une recherche.
3. Naviguer vers la fiche detail avec clic sur une carte.
4. Modifier/supprimer depuis la fiche detail si necessaire.
5. En cas de corruption simulee, rediriger vers l'ecran d'alerte d'integrite.

## Fichiers importants

- `front/src/components/pokelist/index.jsx` : liste, pagination, recherche, creation.
- `front/src/screens/pokemonDetails.jsx` : fiche detail, edition, suppression, audit, integrite.
- `front/src/screens/integrityAlert.jsx` : ecran de gestion corruption.
- `front/src/api.js` : client HTTP vers le backend.
- `front/src/utils/integrityLock.js` : gestion du lock de corruption en localStorage.
