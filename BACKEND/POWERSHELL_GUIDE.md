# 🚀 Guide PowerShell - API FLUX

## Démarrer le serveur

```powershell
cd BACKEND
npm run start:dev
```

Le serveur démarre sur **http://localhost:3000**

---

## 📡 Commandes PowerShell pour tester l'API

### 1. Health Check

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/flux/health" -Method POST -ContentType "application/json"
```

**Résultat:**
```json
{
  "status": "ok",
  "service": "FLUX-1.1-pro",
  "timestamp": "2025-11-01T22:00:00.000Z"
}
```

---

### 2. Générer une image simple

```powershell
$body = @{
    prompt = "Un chat astronaute dans l'espace"
    size = "1024x1024"
    n = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/flux/generate" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

---

### 3. Générer et sauvegarder une image en base64

```powershell
# Générer l'image
$body = @{
    prompt = "Un paysage de montagne magnifique"
    size = "1024x1024"
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3000/flux/generate" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Sauvegarder l'image
$imageBytes = [Convert]::FromBase64String($result.images[0].b64_json)
[IO.File]::WriteAllBytes(".\mon-image.png", $imageBytes)

Write-Host "✅ Image sauvegardée: mon-image.png"
```

---

### 4. Générer avec sauvegarde automatique

```powershell
$body = @{
    prompt = "Un dragon majestueux"
    size = "1792x1024"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/flux/generate-and-save" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

---

### 5. Générer plusieurs images

```powershell
$body = @{
    prompt = "Une forêt enchantée"
    size = "1024x1024"
    n = 3  # 3 images
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:3000/flux/generate" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

Write-Host "Nombre d'images générées: $($result.images.Count)"
```

---

## 🧪 Script de test automatique

Exécutez le script complet:

```powershell
.\test-api.ps1
```

Ce script teste:
- ✅ Health check
- ✅ Génération simple
- ✅ Génération avec sauvegarde

---

## 📝 Exemples de Prompts

```powershell
# Style réaliste
$body = @{ prompt = "Un coucher de soleil sur l'océan, photorealistic, 8k" } | ConvertTo-Json

# Style cartoon
$body = @{ prompt = "Un chat mignon, style cartoon, coloré" } | ConvertTo-Json

# Style artistique
$body = @{ prompt = "Une ville cyberpunk, néons, style anime" } | ConvertTo-Json

# Paysage
$body = @{ prompt = "Montagnes enneigées au lever du soleil, haute qualité" } | ConvertTo-Json
```

---

## 🎨 Paramètres disponibles

| Paramètre | Type | Valeurs | Description |
|-----------|------|---------|-------------|
| `prompt` | string | texte | Description de l'image |
| `size` | string | "1024x1024"<br>"1792x1024"<br>"1024x1792" | Taille de l'image |
| `n` | number | 1-10 | Nombre d'images |
| `quality` | string | "standard"<br>"hd" | Qualité |

---

## ❗ Gestion des erreurs

### Erreur: Impossible de se connecter

```powershell
# Vérifier que le serveur est démarré
curl http://localhost:3000
```

### Erreur 400: Bad Request

```powershell
# Vérifier votre JSON
$body = @{
    prompt = "Votre prompt ici"  # prompt est REQUIS
    size = "1024x1024"
} | ConvertTo-Json

# Afficher le JSON avant envoi
Write-Host $body
```

### Erreur 401: Unauthorized

➡️ Vérifiez `AZURE_FLUX_API_KEY` dans `.env`

### Erreur 404: Not Found

➡️ Vérifiez `AZURE_FLUX_ENDPOINT` dans `.env`

---

## 💡 Astuces PowerShell

### Formater le résultat JSON

```powershell
$result = Invoke-RestMethod -Uri "http://localhost:3000/flux/health" -Method POST
$result | ConvertTo-Json -Depth 10
```

### Mesurer le temps d'exécution

```powershell
Measure-Command {
    $body = @{ prompt = "Test" } | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/flux/generate" -Method POST -Body $body -ContentType "application/json"
}
```

### Boucle de génération

```powershell
$prompts = @(
    "Un chat",
    "Un chien", 
    "Un oiseau"
)

foreach ($prompt in $prompts) {
    $body = @{ prompt = $prompt } | ConvertTo-Json
    $result = Invoke-RestMethod -Uri "http://localhost:3000/flux/generate" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Généré: $prompt"
}
```

---

## 🔗 Ressources

- Serveur: http://localhost:3000
- API FLUX: http://localhost:3000/flux
- Health: http://localhost:3000/flux/health

---

**🎉 Prêt à générer des images avec PowerShell !**
