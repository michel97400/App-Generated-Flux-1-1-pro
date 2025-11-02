# 🎨 FLUX-1.1-pro - Générateur d'Images Azure AI Foundry

Générez des images de haute qualité avec FLUX-1.1-pro via Azure AI Foundry. Code d'inférence complet, prêt à l'emploi !

## ⚡ Démarrage Rapide (3 minutes)

```bash
# 1. Installer les dépendances
pip install -r requirements.txt

# 2. Éditer BACKEND/test_rapide.py avec vos credentials Azure

# 3. Lancer !
python BACKEND/test_rapide.py
```

**📖 Guide détaillé** : Voir [`BACKEND/DEMARRAGE_RAPIDE.md`](BACKEND/DEMARRAGE_RAPIDE.md)

---

## 🎯 Fonctionnalités

✅ Génération d'images avec FLUX-1.1-pro  
✅ Sauvegarde locale des images  
✅ Support de multiples tailles (1024x1024, 1792x1024, etc.)  
✅ Gestion d'erreurs complète  
✅ Documentation détaillée  
✅ Exemples prêts à l'emploi  

---

## 📦 Structure du Projet

```
App-Generated-Flux-1-1-pro/
│
├── BACKEND/
│   ├── model.py                 # 🎯 Module principal (API complète)
│   ├── test_rapide.py           # ⚡ Test minimal (démarrage rapide)
│   ├── exemple_simple.py        # 📚 Exemples multiples
│   ├── DEMARRAGE_RAPIDE.md      # 🚀 Guide de démarrage
│   ├── README_FLUX.md           # 📖 Documentation complète
│   └── .env.example             # 🔧 Template de configuration
│
├── requirements.txt             # 📦 Dépendances Python
├── README.md                    # 📄 Ce fichier
└── .gitignore                   # 🔒 Fichiers à exclure de Git
```

---

## 💻 Utilisation

### Exemple Simple

```python
from BACKEND.model import FluxImageGenerator

# Initialiser avec vos credentials Azure
generator = FluxImageGenerator(
    endpoint="https://votre-endpoint.inference.ai.azure.com",
    api_key="votre_cle_api"
)

# Générer une image
result = generator.generate_image(
    prompt="Un chat astronaute dans l'espace, style réaliste",
    size="1024x1024"
)

# Récupérer l'URL
print(result['images'][0]['url'])
```

### Sauvegarder Localement

```python
generator.generate_and_save(
    prompt="Un dragon volant au-dessus d'un château médiéval",
    output_path="./output/dragon.png",
    size="1024x1024",
    quality="hd"
)
```

---

## 🔧 Configuration

### Option 1 : Direct dans le code

```python
generator = FluxImageGenerator(
    endpoint="https://xxx.inference.ai.azure.com",
    api_key="votre_cle_api"
)
```

### Option 2 : Variables d'environnement (Recommandé)

Créez un fichier `.env` dans `BACKEND/` :

```env
AZURE_INFERENCE_ENDPOINT=https://xxx.inference.ai.azure.com
AZURE_INFERENCE_CREDENTIAL=votre_cle_api
```

Puis dans le code :
```python
generator = FluxImageGenerator()  # Utilise automatiquement .env
```

---

## 📋 Prérequis

- **Python 3.8+**
- **Azure AI Foundry** avec FLUX-1.1-pro déployé
- **Endpoint URL** et **API Key** de votre déploiement

### Installation des dépendances

```bash
pip install azure-ai-inference azure-core requests
```

Ou simplement :
```bash
pip install -r requirements.txt
```

---

## 🔑 Obtenir vos Credentials Azure

1. Connectez-vous à [Azure AI Foundry](https://ai.azure.com/)
2. Naviguez vers votre projet
3. Sélectionnez votre déploiement FLUX-1.1-pro
4. Copiez :
   - **Endpoint URL** (ex: `https://xxx.inference.ai.azure.com`)
   - **API Key**

---

## 📚 Documentation

| Fichier | Description |
|---------|-------------|
| [`BACKEND/DEMARRAGE_RAPIDE.md`](BACKEND/DEMARRAGE_RAPIDE.md) | Guide de démarrage rapide |
| [`BACKEND/README_FLUX.md`](BACKEND/README_FLUX.md) | Documentation complète |
| [`BACKEND/test_rapide.py`](BACKEND/test_rapide.py) | Test minimal |
| [`BACKEND/exemple_simple.py`](BACKEND/exemple_simple.py) | Exemples détaillés |

---

## ❗ Résolution des Problèmes

### Import Error

```bash
pip install --upgrade azure-ai-inference azure-core requests
```

### HTTP 401 (Unauthorized)

➡️ Vérifiez que votre API Key est correcte et active

### HTTP 404 (Not Found)

➡️ Vérifiez que l'endpoint est correct et que FLUX-1.1-pro est déployé

### HTTP 429 (Too Many Requests)

➡️ Limite de taux atteinte. Attendez quelques secondes.

---

## 🎓 Exemples d'Utilisation

### Générer une image simple

```bash
python BACKEND/test_rapide.py
```

### Explorer tous les exemples

```bash
python BACKEND/exemple_simple.py
```

### Utiliser le module complet

```bash
python BACKEND/model.py
```

---

## 🔒 Sécurité

- ✅ Utilisez des variables d'environnement pour les credentials
- ✅ Ajoutez `.env` à votre `.gitignore`
- ❌ Ne committez jamais vos clés API
- ✅ Utilisez Azure Key Vault en production

---

## 🚀 Prochaines Étapes

1. ✅ Installez les dépendances
2. ✅ Configurez vos credentials Azure
3. ✅ Testez avec `test_rapide.py`
4. 📚 Explorez les exemples dans `exemple_simple.py`
5. 🔨 Intégrez dans votre application

---

## 📞 Support & Ressources

- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-foundry/)
- [Azure AI Inference SDK](https://learn.microsoft.com/python/api/azure-ai-inference/)
- [FLUX Models](https://blackforestlabs.ai/)

---

## 📝 Licence

Ce code est fourni tel quel pour utilisation avec Azure AI Foundry et FLUX-1.1-pro.

---

**🎉 Prêt à générer des images incroyables ? Lancez `test_rapide.py` !**
