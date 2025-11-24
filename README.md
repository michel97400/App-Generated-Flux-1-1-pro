# 🎨 App-Generated-Flux-1-1-pro

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)
[![Azure](https://img.shields.io/badge/Azure-0078D4?style=for-the-badge&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)

Une application web moderne de génération d'images utilisant l'IA FLUX-1.1-pro avec une interface chat intégrée.

## ✨ Vue d'ensemble

Cette application full-stack combine :
- **Génération d'images IA** avec FLUX-1.1-pro via Azure AI
- **Chat conversationnel** avec Groq (Llama-3.1-8b-instant)
- **Interface moderne** avec design glassmorphism
- **Architecture microservices** conteneurisée

## 🚀 Démarrage Rapide

### Avec Docker (Recommandé)
```bash
git clone https://github.com/michel97400/App-Generated-Flux-1-1-pro.git
cd App-Generated-Flux-1-1-pro

# Configuration des variables d'environnement
cp BACKEND/.env.example BACKEND/.env
# Éditer BACKEND/.env avec vos clés API

# Démarrage
docker-compose up --build
```

**Accès :**
- 🖥️ Frontend : http://localhost:5173
- 🔧 Backend API : http://localhost:3000

### Développement Local
```bash
# Backend
cd BACKEND && npm install && npm run start:dev

# Frontend (terminal séparé)
cd FRONTEND && npm install && npm run dev
```

## 🏗️ Architecture

```
App-Generated-Flux-1-1-pro/
├── 📁 BACKEND/          # API NestJS + SQLite
│   ├── 🤖 FLUX-1.1-pro  # Génération d'images
│   ├── 💬 Groq AI       # Chat conversationnel
│   └── 🔐 JWT Auth      # Authentification
├── 📁 FRONTEND/         # React + Vite + TypeScript
│   ├── 🎨 Glassmorphism # Design moderne
│   ├── 📱 Responsive    # Mobile-first
│   └── ⚡ PWA Ready     # Performance optimisée
└── 🐳 Docker            # Conteneurisation complète
```

## 🚀 Déploiement Azure

### Via Portail Azure
1. **Container Apps** → **Créer**
2. **Docker Compose** → Importer `docker-compose.prod.yml`
3. **Variables d'environnement** → Configurer les clés API
4. **Déployer** → URL HTTPS automatique

### Variables Requises
```env
AZURE_FLUX_ENDPOINT=https://your-endpoint.openai.azure.com/...
AZURE_FLUX_API_KEY=your-azure-api-key
GROQ_API_KEY=your-groq-api-key
JWT_SECRET=your-secure-jwt-secret
```

## 📚 Documentation

- 📖 **[Frontend README](./FRONTEND/README.md)** - Interface utilisateur
- 🔧 **[Backend Docs](./BACKEND/README.md)** - API et configuration
- 🐳 **[Docker Guide](./README_DOCKER.md)** - Déploiement conteneurisé

## 🎯 Fonctionnalités Clés

### 🤖 IA & Génération
- ✅ Génération d'images FLUX-1.1-pro
- ✅ Prompts prédéfinis et personnalisés
- ✅ Galerie personnelle avec téléchargement
- ✅ Chat IA contextuel

### 🎨 Interface Utilisateur
- ✅ Design glassmorphism moderne
- ✅ Animations fluides et transitions
- ✅ Interface responsive mobile/desktop
- ✅ Navigation intuitive

### 🔒 Sécurité & Performance
- ✅ Authentification JWT sécurisée
- ✅ Validation des données
- ✅ Rate limiting et protection
- ✅ Optimisation des performances

## 🛠️ Technologies

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM pour SQLite
- **Passport** - Authentification
- **Azure AI** - Services IA

### Frontend
- **React 18** - Bibliothèque UI
- **Vite** - Build tool rapide
- **TypeScript** - Type safety
- **React Router** - Navigation

### Infrastructure
- **Docker** - Conteneurisation
- **Azure Container Apps** - Déploiement cloud
- **SQLite** - Base de données

## 🤝 Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour les guidelines.

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

**MIT License** - Libre d'utilisation pour projets personnels et commerciaux.

## 📞 Support

- 🐛 **Issues** : [GitHub Issues](https://github.com/michel97400/App-Generated-Flux-1-1-pro/issues)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/michel97400/App-Generated-Flux-1-1-pro/discussions)
- 📧 **Email** : Contact développeur

---

**⭐ Si ce projet vous plaît, n'hésitez pas à laisser une étoile !**

**Développé avec ❤️ par [Michel97400](https://github.com/michel97400)**