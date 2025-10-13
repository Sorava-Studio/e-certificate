# 🚶 Walk-in Client Management System

## Vue d'ensemble

Ce système permet aux partenaires d'enregistrer et de gérer les clients qui se présentent directement en boutique (walk-in clients). Chaque client enregistré crée automatiquement une mission qui apparaît dans la section "Mes Missions" du partenaire.

## 📋 Fonctionnalités

### 1. Enregistrement de Client Walk-in

Les partenaires peuvent enregistrer de nouveaux clients via un formulaire dialog accessible depuis la page "Walk-in Client".

**Champs requis:**
- Prénom
- Nom
- Email
- Téléphone

**Champs optionnels:**
- Adresse
- Ville
- Code postal
- Pays

### 2. Gestion des Missions

Quand un client walk-in est enregistré, une mission est automatiquement créée avec le statut "pending". Les missions peuvent avoir les statuts suivants:

- **pending** (En attente) - Mission nouvellement créée
- **in_progress** (En cours) - Mission en cours de traitement
- **completed** (Terminée) - Mission complétée
- **cancelled** (Annulée) - Mission annulée

### 3. Workflow des Missions

1. Le partenaire enregistre un client walk-in
2. Une mission est créée avec le statut "pending"
3. Le partenaire peut démarrer la mission (passage à "in_progress")
4. Le partenaire peut terminer la mission (passage à "completed")

## 🗄️ Structure de Base de Données

### Tables créées

#### `walk_in_client`
```sql
- id (text, primary key)
- first_name (text, not null)
- last_name (text, not null)
- email (text, not null)
- phone (text, not null)
- address (text, nullable)
- city (text, nullable)
- postal_code (text, nullable)
- country (text, nullable)
- created_at (timestamp, not null)
- updated_at (timestamp, not null)
- partner_id (text, foreign key -> user.id)
```

#### `walk_in_mission`
```sql
- id (text, primary key)
- client_id (text, foreign key -> walk_in_client.id)
- partner_id (text, foreign key -> user.id)
- status (mission_status enum, default 'pending')
- notes (text, nullable)
- created_at (timestamp, not null)
- updated_at (timestamp, not null)
- completed_at (timestamp, nullable)
```

#### Enum `mission_status`
```sql
- pending
- in_progress
- completed
- cancelled
```

## 📁 Fichiers Créés/Modifiés

### Schéma de Base de Données
- `src/db/schema/enums/mission-status.ts` - Enum pour les statuts de mission
- `src/db/schema/tables/walk-in-client.ts` - Tables walk_in_client et walk_in_mission

### Server Actions
- `src/app/actions/walk-in-client.ts` - Actions serveur pour gérer les clients et missions
  - `createWalkInClient()` - Créer un client et sa mission
  - `getWalkInMissions()` - Récupérer les missions du partenaire
  - `updateMissionStatus()` - Mettre à jour le statut d'une mission

### Composants
- `src/components/partner/walk-in-client-dialog.tsx` - Dialog de création de client
- `src/components/partner/walk-in-missions-list.tsx` - Liste des missions (composant serveur)
- `src/components/partner/walk-in-missions-client.tsx` - Wrapper client pour gérer les interactions

### Pages
- `src/app/dashboard/partner/walk-in-client/page.tsx` - Page d'enregistrement des clients
- `src/app/dashboard/partner/missions/page.tsx` - Page de gestion des missions
- `src/app/dashboard/partner/page.tsx` - Dashboard avec statistiques en temps réel

## 🔄 Flux de Données

1. **Création de Client:**
   ```
   WalkInClientDialog -> createWalkInClient() -> DB (walk_in_client + walk_in_mission)
   ```

2. **Affichage des Missions:**
   ```
   PartnerMissionsPage -> getWalkInMissions() -> WalkInMissionsClient -> WalkInMissionsList
   ```

3. **Mise à Jour de Statut:**
   ```
   WalkInMissionsClient -> updateMissionStatus() -> DB -> router.refresh()
   ```

## 🎨 Interface Utilisateur

### Dashboard Partner
- Affiche les statistiques en temps réel:
  - Nombre de missions actives
  - Nombre de missions complétées
  - Nombre total de clients walk-in
- Affiche les 3 dernières missions dans "Activité Récente"

### Page Walk-in Client
- Bouton "Nouveau Client Walk-in" dans le header
- Dialog modal avec formulaire de création
- Empty state quand aucun client n'est enregistré

### Page Mes Missions
- Cards affichant chaque mission avec:
  - Informations du client
  - Badge de statut coloré
  - Boutons d'action (Démarrer/Terminer)
  - Date de création
- Empty state quand aucune mission n'existe

## 🔐 Sécurité

- Toutes les actions serveur vérifient l'authentification
- Seuls les utilisateurs avec le rôle "partner" ou "admin" peuvent accéder
- Les missions sont filtrées par `partner_id` (un partenaire ne voit que ses missions)
- Cascade delete configuré (si un partenaire est supprimé, ses clients et missions le sont aussi)

## 🚀 Prochaines Étapes

Pour étendre cette fonctionnalité:

1. Ajouter un champ de type de service/certification à la mission
2. Permettre l'upload de documents/photos pour chaque mission
3. Ajouter un système de notification pour les changements de statut
4. Créer des rapports statistiques détaillés
5. Permettre l'ajout de notes/commentaires sur les missions
6. Implémenter un système de facturation lié aux missions complétées
