# TourismPro – Frontend Angular

Frontend Angular 17 complet pour le backend Django Tourism System.

## 🚀 Installation

```bash
# 1. Extraire le ZIP et copier le dossier src dans votre projet Angular
# ou créer un nouveau projet :
npm install -g @angular/cli
ng new tourism-frontend --standalone --routing --style=css

# 2. Remplacer le dossier src/ par celui fourni

# 3. Installer les dépendances
npm install

# 4. Démarrer (avec proxy vers Django)
ng serve --proxy-config proxy.conf.json
```

## ⚙️ Configuration

Modifier `src/environments/environment.ts` :
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api'  // URL de votre backend Django
};
```

## 📁 Structure

```
src/app/
├── core/
│   ├── guards/         # auth, admin, guest guards
│   ├── interceptors/   # JWT interceptor + refresh
│   ├── models/         # interfaces TypeScript
│   └── services/       # auth, tour, booking, review, tourism, destination
├── shared/
│   └── components/     # toast, star-rating, confirm-modal
├── layout/
│   ├── shell/          # conteneur principal
│   ├── navbar/         # barre de navigation
│   └── sidebar/        # menu latéral
└── features/
    ├── auth/           # login, register, profile
    ├── dashboard/      # tableau de bord
    ├── activities/     # list, detail, form
    ├── schedules/      # list, form
    ├── bookings/       # list, detail
    ├── reviews/        # list + modération
    ├── destinations/   # countries, cities, destinations
    ├── hotels/         # hotels, tourism-destinations, bookings
    └── users/          # admin: list, detail
```

## 🔐 Rôles

| Rôle    | Accès                                              |
|---------|----------------------------------------------------|
| Admin   | Tout, y compris gestion utilisateurs et modération |
| Guide   | Créer/modifier activités et plannings              |
| Tourist | Réserver, laisser des avis                         |

## 🌐 API Backend

Le frontend consomme ces endpoints Django REST Framework :
- `/api/auth/` – Authentification JWT, utilisateurs, profils, rôles
- `/api/destinations/` – Pays, villes
- `/api/tour/` – Catégories, activités, plannings, images
- `/api/bookings/` – Réservations, paiements
- `/api/reviews/` – Avis (avec modération)
- `/api/tourism/` – Destinations touristiques, hôtels, réservations hôtels

## ✅ Fonctionnalités

- 🔐 Auth JWT avec auto-refresh token
- 📊 Dashboard adaptatif selon le rôle
- 🏄 CRUD complet des activités avec galerie photos
- 📅 Gestion des plannings (créneaux)
- 🎫 Réservations avec paiement multi-méthodes
- ⭐ Avis avec modération admin
- 🌍 Gestion pays/villes/destinations
- 🏨 Module hôtelier complet
- 👥 Gestion des utilisateurs (admin)
- 🔔 Notifications toast
- 📱 Interface responsive
