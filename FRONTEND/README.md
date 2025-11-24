# 🎨 App-Generated-Flux-1-1-pro

Une application web moderne de génération d'images utilisant l'IA FLUX-1.1-pro avec une interface chat intégrée.

## ✨ Fonctionnalités

### 🤖 Génération d'Images
- **IA FLUX-1.1-pro** : Génération d'images haute qualité via Azure AI
- **Prompts prédéfinis** : Collection d'exemples de prompts pour débuter
- **Interface moderne** : Design épuré avec glassmorphism et animations fluides
- **Galerie personnelle** : Stockage et gestion de vos images générées

### 💬 Chat IA Intégré
- **Assistant conversationnel** : Chat avec IA Groq (Llama-3.1-8b-instant)
- **Historique organisé** : Conversations triées par date (Aujourd'hui, Cette semaine, Plus ancien)
- **Interface moderne** : Cartes avec effets visuels et animations

### 👤 Gestion Utilisateur
- **Authentification JWT** : Système de connexion sécurisé
- **Profils utilisateurs** : Gestion des informations personnelles
- **Rôles et permissions** : Système de rôles flexible

## 🏗️ Architecture

### Backend (NestJS)
- **Framework** : NestJS avec TypeScript
- **Base de données** : SQLite avec TypeORM
- **Authentification** : JWT avec stratégie Passport
- **API** : RESTful avec validation des données
- **IA Integration** : Azure AI Foundry et Groq API

### Frontend (React + Vite)
- **Framework** : React 18 avec TypeScript
- **Build Tool** : Vite pour le développement rapide
- **Routing** : React Router pour la navigation
- **Styling** : CSS moderne avec glassmorphism
- **State Management** : React Hooks et Context API

### Infrastructure
- **Conteneurisation** : Docker et Docker Compose
- **Déploiement** : Azure Container Apps
- **Réseau** : Communication inter-conteneurs

## 🚀 Démarrage Rapide

### Prérequis
- Docker et Docker Compose
- Node.js 18+ (pour le développement local)
- Compte Azure (pour le déploiement)

### Installation Locale

1. **Cloner le repository**
```bash
git clone https://github.com/michel97400/App-Generated-Flux-1-1-pro.git
cd App-Generated-Flux-1-1-pro
```

2. **Configuration des variables d'environnement**
```bash
# Copier et configurer le fichier .env du backend
cp BACKEND/.env.example BACKEND/.env
# Éditer BACKEND/.env avec vos clés API
```

3. **Démarrer avec Docker Compose**
```bash
docker-compose up --build
```

4. **Accéder à l'application**
- Frontend : http://localhost:5173
- Backend API : http://localhost:3000

### Développement Local

```bash
# Backend
cd BACKEND
npm install
npm run start:dev

# Frontend (nouvelle session)
cd FRONTEND
npm install
npm run dev
```

## 📁 Structure du Projet

```
App-Generated-Flux-1-1-pro/
├── 📁 BACKEND/                 # API NestJS
│   ├── 📁 src/
│   │   ├── 📁 auth/            # Authentification
│   │   ├── 📁 chat/            # Gestion du chat IA
│   │   ├── 📁 flux/            # Génération d'images
│   │   ├── 📁 images/          # Gestion des images
│   │   ├── 📁 users/           # Gestion utilisateurs
│   │   └── 📁 roles/           # Système de rôles
│   ├── 📄 Dockerfile
│   └── 📄 package.json
├── 📁 FRONTEND/                # Application React
│   ├── 📁 src/
│   │   ├── 📁 components/      # Composants réutilisables
│   │   ├── 📁 pages/           # Pages de l'application
│   │   ├── 📁 templates/       # Layouts et templates
│   │   └── 📁 utils/           # Utilitaires
│   ├── 📄 Dockerfile
│   └── 📄 package.json
├── 📄 docker-compose.yml        # Développement
├── 📄 docker-compose.prod.yml   # Production Azure
└── 📄 README.md
```

## 🚀 Déploiement sur Azure

### Via Portail Azure (Recommandé)

1. **Se connecter** à [Azure Portal](https://portal.azure.com)

2. **Créer un Container Apps Environment**
   - Aller dans "Container Apps"
   - Créer un nouvel environnement

3. **Créer une Container App**
   - Sélectionner "Docker Compose"
   - Importer `docker-compose.prod.yml`
   - Configurer les variables d'environnement

4. **Variables d'Environnement Requises**
```env
AZURE_FLUX_ENDPOINT=https://your-endpoint.openai.azure.com/...
AZURE_FLUX_API_KEY=your-azure-api-key
GROQ_API_KEY=your-groq-api-key
GROQ_API_URL=https://api.groq.com/openai/v1
model=llama-3.1-8b-instant
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secure-jwt-secret
```

5. **Déployer et accéder**
   - Azure fournit automatiquement une URL HTTPS

### Via Azure CLI

```bash
# Se connecter
az login

# Créer un groupe de ressources
az group create --name myResourceGroup --location francecentral

# Déployer avec Container Apps
az containerapp create \
  --name flux-app \
  --resource-group myResourceGroup \
  --environment myEnvironment \
  --source . \
  --registry-server myregistry.azurecr.io
```

## 🔧 Configuration

### Variables d'Environnement Backend

| Variable | Description | Exemple |
|----------|-------------|---------|
| `AZURE_FLUX_ENDPOINT` | Endpoint Azure AI Foundry | `https://...azure.com/...` |
| `AZURE_FLUX_API_KEY` | Clé API Azure | `sk-...` |
| `GROQ_API_KEY` | Clé API Groq | `gsk_...` |
| `JWT_SECRET` | Secret pour JWT | `your-secret-key` |
| `PORT` | Port du serveur | `3000` |

### Build et Déploiement

```bash
# Build des images
docker-compose build

# Démarrage en mode développement
docker-compose up

# Démarrage en mode production
docker-compose -f docker-compose.prod.yml up -d
```

## 🎨 Fonctionnalités Avancées

### Interface Utilisateur
- **Design System** : Glassmorphism et animations modernes
- **Responsive** : Adapté mobile et desktop
- **Accessibilité** : Navigation clavier et lecteur d'écran

### Sécurité
- **Authentification** : JWT avec refresh tokens
- **Validation** : Sanitisation des inputs
- **CORS** : Configuration sécurisée
- **Rate Limiting** : Protection contre les abus

### Performance
- **Lazy Loading** : Chargement à la demande
- **Optimisation** : Images compressées
- **Cache** : Mise en cache intelligente

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**Développé avec ❤️ par Michel97400**
