# 🎨 Backend NestJS - FLUX-1.1-pro

Backend NestJS pour la génération d'images avec FLUX-1.1-pro via Azure AI Foundry.

## 🚀 Démarrage Rapide

### 1. Installation

```bash
npm install
```

### 2. Configuration

Le fichier `.env` contient déjà vos credentials Azure :

```env
AZURE_FLUX_ENDPOINT=https://generate-pics.services.ai.azure.com/...
AZURE_FLUX_API_KEY=votre_cle_api
PORT=3000
```

### 3. Lancement

```bash
# Mode développement (avec rechargement automatique)
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

Le serveur démarre sur **http://localhost:3000** 🎉

---

## 📡 API Endpoints

### 1. **POST** `/flux/generate`

Génère une ou plusieurs images.

**Request:**
```json
{
  "prompt": "Un chat astronaute dans l'espace",
  "size": "1024x1024",
  "n": 1,
  "quality": "standard"
}
```

**Response:**
```json
{
  "created": 1234567890,
  "images": [
    {
      "index": 0,
      "b64_json": "iVBORw0KGgo...",
      "revised_prompt": "Un chat astronaute dans l'espace"
    }
  ]
}
```

**Exemple cURL:**
```bash
curl -X POST http://localhost:3000/flux/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Un magnifique coucher de soleil",
    "size": "1024x1024"
  }'
```

---

### 2. **POST** `/flux/generate-and-save`

Génère une image et la sauvegarde localement.

**Request:**
```json
{
  "prompt": "Un dragon majestueux",
  "size": "1792x1024"
}
```

**Response:**
```json
{
  "path": "./uploads/image_1730476800000.png",
  "size": 524288
}
```

---

### 3. **POST** `/flux/health`

Vérifie que le service est opérationnel.

**Response:**
```json
{
  "status": "ok",
  "service": "FLUX-1.1-pro",
  "timestamp": "2025-11-01T10:00:00.000Z"
}
```

---

## 📋 Paramètres

### GenerateImageDto

| Champ | Type | Requis | Défaut | Valeurs possibles |
|-------|------|--------|--------|-------------------|
| `prompt` | string | ✅ Oui | - | Texte descriptif |
| `size` | string | ❌ Non | "1024x1024" | "1024x1024", "1792x1024", "1024x1792" |
| `n` | number | ❌ Non | 1 | 1-10 |
| `quality` | string | ❌ Non | "standard" | "standard", "hd" |

---

## 🧪 Tests avec cURL

### Génération simple
```bash
curl -X POST http://localhost:3000/flux/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Un chat mignon"}'
```

### Génération avec sauvegarde
```bash
curl -X POST http://localhost:3000/flux/generate-and-save \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Un paysage de montagne", "size": "1792x1024"}'
```

### Health check
```bash
curl -X POST http://localhost:3000/flux/health
```

---

## 📁 Structure du Projet

```
src/
├── flux/
│   ├── dto/
│   │   ├── generate-image.dto.ts    # Validation des entrées
│   │   └── image-response.dto.ts    # Interface de réponse
│   ├── flux.controller.ts           # Routes API
│   ├── flux.service.ts              # Logique métier
│   └── flux.module.ts               # Module NestJS
├── app.module.ts                     # Module principal
└── main.ts                           # Point d'entrée
```

---

## 🔒 Sécurité

- ✅ Variables d'environnement pour les credentials
- ✅ Validation automatique des DTOs
- ✅ Gestion centralisée des erreurs
- ✅ CORS activé (à configurer pour production)

---

## 🛠️ Scripts Disponibles

```bash
# Développement
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint
npm run format
```

---

## 📦 Dépendances Principales

- **@nestjs/common** - Framework NestJS
- **@nestjs/axios** - Client HTTP
- **@nestjs/config** - Configuration
- **class-validator** - Validation des DTOs
- **class-transformer** - Transformation des données

---

## ❗ Résolution des Problèmes

### Erreur 401 (Unauthorized)
➡️ Vérifiez votre `AZURE_FLUX_API_KEY` dans `.env`

### Erreur 404 (Not Found)
➡️ Vérifiez votre `AZURE_FLUX_ENDPOINT` dans `.env`

### Port déjà utilisé
```bash
# Changez le port dans .env
PORT=3001
```

---

## 🎯 Prochaines Étapes

1. ✅ Tester les endpoints avec cURL ou Postman
2. 📚 Ajouter Swagger pour la documentation interactive
3. 🎨 Créer un frontend pour interagir avec l'API
4. 🔐 Ajouter l'authentification JWT
5. 📊 Ajouter des métriques et monitoring

---

## 📚 Documentation

- [NestJS Documentation](https://docs.nestjs.com/)
- [Azure AI Foundry](https://learn.microsoft.com/azure/ai-foundry/)

---

**🎉 Backend prêt à générer des images avec FLUX-1.1-pro !**
