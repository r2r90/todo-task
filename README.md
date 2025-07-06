# Todo App

## 🚀 Technologies utilisées

### Frontend
- ⚛️ **React**
- ⚡ **Vite**
- 🎨 **Shadcn/ui**

### Backend
- 🚀 **NestJS**
- 🐘 **PostgreSQL**
- 🔷 **Prisma ORM**

### Autres
- 🐳 **Docker & Docker Compose**
- 🔑 **JWT (authentification)**

## Fonctionnalités


- Authentification et création de compte utilisateur.
- Création, sélection et suppression de listes de tâches.
- Ajout de tâches avec description courte, description longue optionnelle et date d'échéance.
- Marquer les tâches comme terminées ou les restaurer.
- Affichage détaillé des tâches.
- Documentation OpenAPI intégrée.
- Tests e2e automatisés disponibles.


> **Note** : <span style="font-size: 16px;">La configuration présentée ici est prévue uniquement pour un environnement de développement. Pour un déploiement en production, adaptez les variables d'environnement, les ports et la configuration Docker selon vos besoins.</span>

---

## Documentation de l'API

J’ai créé une documentation OpenAPI (Swagger) pour faciliter la compréhension des endpoints de l’API. Elle est accessible via l’URL :

```
http://localhost:4000/docs
```

## Prérequis

- **Node.js** (v16+)
- **npm** (v8+) ou **Yarn**
- **PostgreSQL** (v12+)
- **Docker** (v20+)
- **Docker Compose** (v1.29+)

---

## Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/r2r90/todo-task.git
   cd todo-task
   ```

2. Installer les dépendances :
   - **Serveur** :
     ```bash
     cd server
     cp .env.example .env
     npm install
     ```
   - **Client** :
     ```bash
     cd ../client
     cp .env.example .env
     npm install
     ```

---

## Configuration

### Serveur

Modifier `server/.env` :

```env
NODE_ENV=development
APPLICATION_PORT=4000
POSTGRES_URI=postgresql://user:pass@localhost:5432/todo
JWT_SECRET=your_secret
JWT_ACCESS_TOKEN_TTL=3600s
JWT_REFRESH_TOKEN_TTL=7d
```

### Client

Modifier `client/.env` :

```env
VITE_API_URL=http://localhost:4000/api
```

---

## Lancement

### Mode développement

- **Serveur** :
  ```bash
  cd server
  npm run db:push       # Mise à jour du schéma Prisma
  npm run start:dev     # Live reload
  ```
  Accessible : http://localhost:4000

- **Client** :
  ```bash
  cd client
  npm run dev           # Serveur Vite
  ```
  Accessible : http://localhost:3000

## Docker

Lancer tous les services avec Docker Compose :

```bash
docker-compose up --build
```

- API : http://localhost:4000
- Front-end : http://localhost:3000
- PostgreSQL : port 5432

Arrêter et nettoyer :

```bash
docker-compose down -v
```

---

## Structure du projet

```
todo-task/
├── client/         # Front-end React (Vite, TS, Tailwind)
│   ├── src/
│   ├── public/
│   ├── .env.example
│   └── vite.config.ts
├── server/         # Back-end NestJS (TS, Prisma)
│   ├── src/
│   ├── prisma/
│   ├── test/       # e2e tests
│   ├── .env.example
│   └── src/main.ts # Point d'entrée, Swagger
├── docker-compose.yml
├── README.md
└── .gitignore
```

---

## Tests

Le back-end utilise Jest pour les tests e2e. J’ai créé des tests couvrant les endpoints d’authentification et de gestion des tâches :

- **Authentification** : tests des endpoints de login et d’inscription (`server/test/auth.e2e-spec.ts`)
- **Todo** : tests des endpoints de création, lecture, mise à jour et suppression de tâches (`server/test/todo.e2e-spec.ts`)

---
