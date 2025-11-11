# Étape 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Build l'application
RUN npm run build

# Étape 2: Production
FROM node:20-alpine

WORKDIR /app

# Copier package.json pour les dépendances de production
COPY package*.json ./

# Installer uniquement les dépendances de production
RUN npm ci --omit=dev

# Copier les fichiers buildés depuis l'étape builder
COPY --from=builder /app/dist ./dist

# Créer le dossier pour les uploads
RUN mkdir -p uploads

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/main.js"]
