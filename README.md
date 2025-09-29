# France Travail Extension

Une extension Chrome qui automatise l'enregistrement des démarches de recherche d'emploi sur le site France Travail.

## 🎯 Fonctionnalités

- **Enregistrement automatique** : Enregistre automatiquement vos candidatures sur France Travail
- **Interface intuitive** : Bouton flottant qui s'intègre discrètement sur les sites d'emploi
- **Configuration simple** : Configuration du token d'authentification via popup
- **Support multi-sites** : Fonctionne sur HelloWork et autres sites d'emploi

## 🚀 Installation

### Installation manuelle (développement)

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/hollitizz/francetravail-extension.git
   cd francetravail-extension
   ```

2. Ouvrez Chrome et allez sur `chrome://extensions/`

3. Activez le "Mode développeur" (en haut à droite)

4. Cliquez sur "Charger l'extension non empaquetée"

5. Sélectionnez le dossier du projet

## ⚙️ Configuration

### 1. Obtenir votre token France Travail

1. Connectez-vous sur [candidat.francetravail.fr](https://candidat.francetravail.fr/)
2. Ouvrez les outils de développement (F12)
3. Allez dans l'onglet "Network" / "Réseau"
4. Actualisez la page
5. Cherchez une requête vers l'API France Travail
6. Dans les headers de la requête, copiez la valeur du header `Authorization`

### 2. Configurer l'extension

1. Cliquez sur l'icône de l'extension dans la barre d'outils Chrome
2. Collez votre token dans le champ prévu
3. Cliquez sur "Sauvegarder"

## 📖 Utilisation

1. Naviguez sur un site d'emploi supporté (ex: HelloWork)
2. Un bouton flottant France Travail apparaît en bas à droite
3. Cliquez sur le bouton pour l'ouvrir
4. Remplissez les informations :
   - **Nom de l'entreprise** : Le nom de l'entreprise qui recrute
   - **Nom du métier** : L'intitulé du poste
5. Cliquez sur "Envoyer"
6. La démarche est automatiquement enregistrée sur France Travail

## 🏗️ Architecture

### Structure des fichiers

```
francetravail-extension/
├── manifest.json          # Configuration de l'extension
├── background.js          # Script d'arrière-plan (API calls, storage)
├── popup/
│   ├── popup.html        # Interface de configuration
│   └── popup.js          # Logique du popup
├── scripts/
│   └── content.js        # Script injecté dans les pages web
├── style.css             # Styles pour l'interface utilisateur
├── images/               # Assets graphiques
└── README.md            # Documentation
```

### Composants principaux

#### Background Script (`background.js`)

- Gère les appels API vers France Travail
- Stockage sécurisé des tokens
- Communication avec les content scripts

#### Content Script (`content.js`)

- Interface utilisateur flottante
- Détection automatique des sites supportés
- Collecte des données de candidature

#### Popup (`popup.js` / `popup.html`)

- Configuration du token d'authentification
- Interface de gestion des paramètres

## 🔧 API France Travail

L'extension utilise l'API officielle France Travail :

**Endpoint** : `https://api.francetravail.fr/exp-demarcheretouremploi/v2/demarches`

**Méthode** : POST

**Headers requis** :

- `Authorization: Bearer {token}`
- `Content-Type: application/json;charset=UTF-8`
- `pe-nom-application: pn118-dreusager`
- `typeauth: /individu`

## 🛡️ Sécurité

- Les tokens sont stockés localement de manière sécurisée
- Aucune donnée n'est transmise à des tiers
- Communications chiffrées avec l'API France Travail

## 🌐 Sites supportés

Actuellement testé et fonctionnel sur :

- HelloWork (hellowork.com)
- Welcome to the jungle (welcometothejungle.com)

_Extensible à d'autres sites d'emploi_

## 🔄 États de l'interface

L'extension propose plusieurs états visuels :

- **Collapsed** : Bouton compact en bas à droite
- **Expanded** : Formulaire ouvert pour saisie
- **Loading** : Indicateur de traitement en cours
- **Success** : Confirmation d'enregistrement
- **Error** : Notification d'erreur

## 🚨 Résolution des problèmes

### Token invalide

- Vérifiez que votre token est correctement copié
- Assurez-vous que votre session France Travail est active
- Régénérez un nouveau token si nécessaire

### Bouton non visible

- Vérifiez que vous êtes sur un site supporté
- Actualisez la page
- Vérifiez que l'extension est bien activée

### Erreur de soumission

- Vérifiez votre connexion internet
- Assurez-vous que tous les champs sont remplis
- Vérifiez la validité de votre token

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## ⚠️ Avertissement

Cette extension est un outil non officiel. L'utilisation de cette extension est sous votre propre responsabilité. Assurez-vous de respecter les conditions d'utilisation de France Travail.

## 📞 Support

Pour toute question ou problème, ouvrez une issue sur GitHub ou contactez le développeur.

---

_Développé avec ❤️ pour simplifier les démarches de recherche d'emploi_
