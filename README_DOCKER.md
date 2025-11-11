# 🐳 Docker Compose - FLUX Application

## 📋 Prérequis

- Docker Desktop installé
- Docker Compose installé

## 🚀 Démarrage rapide

### 1. Configuration de l'environnement

Assurez-vous que le fichier `BACKEND/.env` existe avec les variables suivantes :

```env
AZURE_FLUX_ENDPOINT=https://generate-pics.services.ai.azure.com/openai/deployments/FLUX-1.1-pro/images/generations
AZURE_FLUX_API_KEY=votre_clé_api
JWT_SECRET=votre_secret_jwt
PORT=3000
```

### 2. Démarrer les services

```bash
# Construire et démarrer tous les services
docker-compose up --build

# Ou en mode détaché (background)
docker-compose up -d --build
```

### 3. Accéder à l'application

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **Backend Health** : http://localhost:3000 (GET /)

### 4. Arrêter les services

```bash
# Arrêter les containers
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime la base de données)
docker-compose down -v
```

## 📦 Architecture des conteneurs

### Backend (NestJS)
- **Image** : Node.js 20 Alpine
- **Port** : 3000
- **Volumes** :
  - `database.sqlite` : Base de données persistante
  - `uploads/` : Images générées
- **Build** : Multi-stage (builder + production)

### Frontend (React + Vite)
- **Image** : Nginx Alpine
- **Port** : 5173 (mappé vers le port 80 du container)
- **Features** :
  - Nginx pour servir les fichiers statiques
  - Routing SPA (Single Page Application)
  - Proxy API vers le backend
  - Compression Gzip
  - Cache des assets

## 🔧 Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend

# Reconstruire un service spécifique
docker-compose up -d --build backend

# Lister les containers en cours
docker-compose ps

# Redémarrer un service
docker-compose restart backend

# Accéder au shell d'un container
docker-compose exec backend sh
docker-compose exec frontend sh

# Voir les ressources utilisées
docker stats
```

## 🗄️ Persistance des données

Les données sont persistées grâce aux volumes Docker :

- **database.sqlite** : Sauvegarde automatique dans `BACKEND/database.sqlite`
- **uploads/** : Images générées dans `BACKEND/uploads/`

⚠️ **Important** : Ne supprimez pas ces fichiers si vous voulez conserver vos données !

## 🔄 Mise à jour du code

```bash
# 1. Arrêter les services
docker-compose down

# 2. Modifier votre code

# 3. Reconstruire et redémarrer
docker-compose up --build -d
```

## 🐛 Dépannage

### Le backend ne démarre pas

```bash
# Vérifier les logs
docker-compose logs backend

# Vérifier que le fichier .env existe
ls BACKEND/.env

# Reconstruire from scratch
docker-compose down
docker-compose build --no-cache backend
docker-compose up backend
```

### Le frontend ne se connecte pas au backend

```bash
# Vérifier que le backend est accessible
curl http://localhost:3000

# Vérifier les logs Nginx
docker-compose logs frontend

# Vérifier la configuration réseau
docker network inspect flux-network
```

### Problèmes de permissions (Linux/Mac)

```bash
# Donner les permissions sur les volumes
sudo chown -R $USER:$USER BACKEND/database.sqlite
sudo chown -R $USER:$USER BACKEND/uploads
```

## 📊 Monitoring

### Vérifier la santé des containers

```bash
docker-compose ps
```

### Voir l'utilisation des ressources

```bash
docker stats flux-backend flux-frontend
```

## 🔐 Sécurité

### Variables d'environnement

- ✅ Le fichier `.env` est exclu du build Docker (`.dockerignore`)
- ✅ Les secrets ne sont jamais commités (`.gitignore`)
- ⚠️ En production, utilisez Docker secrets ou un gestionnaire de secrets

### Recommandations production

1. **Désactiver `synchronize: true`** dans TypeORM
2. **Utiliser des variables d'environnement sécurisées**
3. **Configurer HTTPS avec un reverse proxy (Traefik, Nginx)**
4. **Limiter les ressources des containers**
5. **Mettre en place des healthchecks**

## 📝 Structure des fichiers Docker

```
.
├── docker-compose.yml          # Orchestration des services
├── BACKEND/
│   ├── Dockerfile              # Image Node.js multi-stage
│   ├── .dockerignore           # Fichiers exclus du build
│   └── .env                    # Variables d'environnement
└── FRONTEND/
    ├── Dockerfile              # Image Nginx multi-stage
    ├── .dockerignore           # Fichiers exclus du build
    └── nginx.conf              # Configuration Nginx
```

## 🎯 Optimisations

### Multi-stage builds
- Réduction de la taille des images (~60% plus petites)
- Séparation build/production
- Images Alpine Linux légères

### Caching des layers
- Les dépendances npm sont cachées
- Seul le code modifié est rebuild

### Nginx optimisations
- Compression Gzip activée
- Cache des assets statiques (1 an)
- Headers de sécurité configurés

## 🚢 Déploiement

### Docker Hub

```bash
# Tag des images
docker tag flux-backend:latest username/flux-backend:latest
docker tag flux-frontend:latest username/flux-frontend:latest

# Push vers Docker Hub
docker push username/flux-backend:latest
docker push username/flux-frontend:latest
```

### Azure Container Instances

```bash
# Se connecter à Azure
az login

# Créer un groupe de ressources
az group create --name flux-rg --location francecentral

# Déployer avec Azure Container Instances
az container create \
  --resource-group flux-rg \
  --name flux-app \
  --image username/flux-backend:latest \
  --ports 3000 \
  --environment-variables \
    AZURE_FLUX_ENDPOINT="..." \
    AZURE_FLUX_API_KEY="..." \
    JWT_SECRET="..."
```

## 📚 Ressources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Docker](https://docs.nestjs.com/recipes/dockerfile)
- [Nginx Docker](https://hub.docker.com/_/nginx)
