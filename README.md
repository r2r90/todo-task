# Todo-Task

## Introduction

Todo-Task est une application de gestion de listes de tâches, composée d'une partie front-end (client) et d'une partie back-end (serveur). Elle permet à un utilisateur de créer, modifier, marquer comme terminées et restaurer des tâches au sein de différentes listes.

---

## Prérequis

* **Node.js** (v16+)

* **npm** (v8+) ou **Yarn**

* **PostgreSQL** (v12+)

* **Docker** (v20+)

* **Docker Compose** (v1.29+)

* **Node.js** (v16+)

* **npm** (v8+) ou **Yarn**

* **PostgreSQL** (v12+)

---

## Installation

1. Cloner le dépôt :

   ```bash
   git clone https://github.com/r2r90/todo-task.git
   cd todo-task
   ```

2. Installer les dépendances :

  * **Serveur** (NestJS + Prisma) :

    ```bash
    cd server
    cp .env.example .env
    npm install
    ```

  * **Client** (React + Vite) :

    ```bash
    cd ../client
    cp .env.example .env
    npm install
    ```

---

## Configuration

### Serveur

Dans `server/.env`, configurez :

* `NODE_ENV` : `development` ou `production`
* `APPLICATION_PORT` : port d'écoute (défaut : 4000)
* `POSTGRES_URI` : URI de connexion à PostgreSQL
* `JWT_SECRET`, `JWT_ACCESS_TOKEN_TTL`, `JWT_REFRESH_TOKEN_TTL` : paramètres JWT

### Client

Dans `client/.env`, configurez :

* `VITE_API_URL` : URL de l'API (défaut : `http://localhost:4000/api`)

---

## Lancement

### Mode développement

* **Serveur** :

  ```bash
  cd server
  npm run db:push      # Mise à jour du schéma Prisma
  npm run start:dev    # Serveur avec live reload
  ```

  Accessible sur : `http://localhost:4000`

* **Client** :

  ```bash
  cd client
  npm run dev          # Serveur de développement Vite
  ```

  Accessible sur : `http://localhost:5173`

### Mode production

* **Serveur** :

  ```bash
  cd server
  npm run build        # Compilation NestJS
  npm run start:prod   # Serveur en production
  ```

* **Client** :

  ```bash
  cd client
  npm run build        # Génération des fichiers statiques
  npm run preview      # Prévisualisation du build
  ```

---

## Docker

Le projet peut également être lancé via Docker et Docker Compose pour simplifier le déploiement.

### Fichiers disponibles

* `Dockerfile` (serveur)
* `docker-compose.yml` (compose pour serveur, client et base de données)

### Lancer avec Docker Compose

```bash
# Depuis la racine du projet
docker-compose up --build
```

Les services démarrent sur :

* **API Serveur** : `http://localhost:4000`
* **Front-end** : `http://localhost:5173`
* **Base de données PostgreSQL** : accessible sur le port configuré (`5432` par défaut)

Pour arrêter et supprimer les conteneurs et volumes :

```bash
docker-compose down -v
```

### Mode développement

* **Serveur** :

  ```bash
  cd server
  npm run db:push      # Mise à jour du schéma Prisma
  npm run start:dev    # Serveur avec live reload
  ```

  Accessible sur : `http://localhost:4000`

* **Client** :

  ```bash
  cd client
  npm run dev          # Serveur de développement Vite
  ```

  Accessible sur : `http://localhost:5173`

### Mode production

* **Serveur** :

  ```bash
  cd server
  npm run build        # Compilation NestJS
  npm run start:prod   # Serveur en production
  ```

* **Client** :

  ```bash
  cd client
  npm run build        # Génération des fichiers statiques
  npm run preview      # Prévisualisation du build
  ```

---

## Structure du projet

```
├── client/             # Front-end React (Vite, TS, Tailwind)
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── vite.config.ts
│
├── server/             # Back-end NestJS (TS, Prisma)
│   ├── src/
│   ├── prisma/
│   ├── test/           # Tests e2e
│   ├── .env.example
│   └── src/main.ts     # Point d'entrée, config Swagger
│
├── README.md           # Ce fichier
└── .gitignore
```

---

## Commandes utiles

* `npm run lint` : ESLint (format & erreurs)
* `npm run test` : exécute tous les tests (unitaires + e2e)
* `npm run test:watch` : relance les tests à chaque modif
* `npm run test:cov` : génère le rapport de couverture
* `npm run build` : compile le projet pour la prod

---

## Tests

Le back-end utilise **Jest** pour :

* **Unitaires** : fichiers `server/src/**/*.spec.ts`
* **e2e** : `server/test/app.e2e-spec.ts`

**Commandes :**

* `npm run test` (tous tests)
* `npm run test:cov` (couverture HTML dans `server/coverage`)
* `npm run test:watch` (mode watch)

---

## Documentation de l'API

Le serveur expose **Swagger** sur :

```
http://localhost:4000/doc
```

**Configuration (server/src/main.ts)** :

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Todo-Task API')
    .setDescription('API pour la gestion de tâches')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  await app.listen(process.env.APPLICATION_PORT || 4000);
}
```

---

## Dépannage

* **Connexion PostgreSQL** : vérifiez `POSTGRES_URI` et que PostgreSQL est lancé.
* **Port occupé** : changez `APPLICATION_PORT` ou le port Vite dans `vite.config.ts`.
* **Tests échouent** : assurez-vous d'avoir configuré `DATABASE_URL_TEST` et exécuté `npm run db:push`.

---

## Contact

En cas de question ou de problème, ouvre une issue sur le dépôt GitHub.
