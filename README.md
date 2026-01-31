# Cliniclick - SaaS pour Cliniques & Médecins

## Vue d'ensemble

Cliniclick est une application web complète de gestion de cliniques médicales construite avec **Next.js 14**, **React**, **Prisma** et **MySQL**. Elle permet aux cliniques de gérer les patients, les médecins, les rendez-vous, les consultations et les paiements.

## Objectifs du projet

- Digitaliser la gestion d'une clinique médicale
- Permettre aux cliniques de gérer patients, médecins, rendez-vous et facturation
- Fournir un portail patient pour réserver et consulter documents
- Couvrir tout le cycle de vie du développement logiciel

## Rôles utilisateurs

### 1. Admin (Propriétaire)
- Création et configuration de la clinique
- Gestion des services et tarifs
- Gestion du staff (médecins, réceptionnistes)
- Vue d'ensemble des statistiques

### 2. Médecin
- Gestion de l'agenda/rendez-vous
- Accès aux dossiers patients
- Création de consultations et ordonnances
- Export de prescriptions en PDF

### 3. Réceptionniste
- Gestion des rendez-vous
- Enregistrement des patients
- Gestion de la facturation
- Suivi des paiements

### 4. Patient
- Réservation de rendez-vous
- Consultation du dossier médical
- Téléchargement des ordonnances
- Paiement en ligne via Stripe

## Architecture technique

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Framework**: React 19
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form + Zod validation
- **Authentication**: NextAuth.js v5

### Backend
- **API**: Next.js API Routes
- **Database**: MySQL
- **ORM**: Prisma
- **Security**: bcryptjs, Auth.js
- **Payments**: Stripe API

## Installation

### Prérequis
- Node.js 18+
- MySQL 8+
- npm ou yarn

### Étapes

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer .env.local
cp .env.example .env.local

# 3. Configurer la base de données
npx prisma migrate dev --name init
npx prisma db seed

# 4. Lancer le serveur
npm run dev
```

## Comptes de test

```
Admin:         admin@medflow.tn / admin123
Médecin:       doctor@medflow.tn / doctor123
Réceptionniste: receptionist@medflow.tn / receptionist123
Patient:       patient@medflow.tn / patient123
```

## Structure du projet

```
medflow/
├── app/
│   ├── (auth)/              # Routes d'authentification
│   ├── (dashboard)/         # Dashboards par rôle
│   ├── api/                 # Routes API REST
│   └── globals.css
├── components/              # Composants réutilisables
├── lib/
│   ├── auth.ts             # Configuration NextAuth
│   └── db.ts               # Client Prisma
├── prisma/
│   ├── schema.prisma       # Schéma DB
│   └── seed.ts             # Données test
├── middleware.ts           # RBAC middleware
└── tailwind.config.ts
```

## Schéma de base de données

**Modèles**: User, Patient, Doctor, Appointment, Consultation, Prescription, Invoice, Service, Clinic

Pour plus de détails, voir le [diagramme de classes](./docs/class-diagram.md).

## Authentification & RBAC

- Inscription/Connexion
- JWT sessions
- Contrôle d'accès par rôle
- Redirection automatique

## Modules

1. **Authentification** - Inscription et connexion sécurisée
2. **Patients** - CRUD complet
3. **Rendez-vous** - Gestion agenda
4. **Consultations** - Créer consultations et ordonnances
5. **Factures** - Intégration Stripe
6. **Portail Patient** - Réservation, paiement, téléchargement
7. **Services** - Configuration des services et tarifs
8. **Staff** - Gestion du personnel

## API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/[...nextauth]` - Connexion (NextAuth)

### Patients
- `GET /api/patients` - Liste des patients
- `POST /api/patients` - Créer un patient
- `GET /api/patients/[id]` - Détails d'un patient
- `PUT /api/patients/[id]` - Modifier un patient
- `DELETE /api/patients/[id]` - Supprimer un patient

### Rendez-vous
- `GET /api/appoitments` - Liste des rendez-vous
- `POST /api/appoitments` - Créer un rendez-vous
- `GET /api/appoitments/[id]` - Détails d'un rendez-vous
- `PUT /api/appoitments/[id]` - Modifier un rendez-vous
- `DELETE /api/appoitments/[id]` - Supprimer un rendez-vous

### Consultations
- `GET /api/consultations` - Liste des consultations
- `POST /api/consultations` - Créer une consultation
- `GET /api/consultations/[id]` - Détails d'une consultation

### Prescriptions
- `GET /api/prescriptions` - Liste des prescriptions
- `POST /api/prescriptions` - Créer une prescription
- `GET /api/prescriptions/[id]` - Détails d'une prescription
- `POST /api/prescriptions/[id]/pdf` - Générer PDF

### Factures
- `GET /api/invoices` - Liste des factures
- `POST /api/invoices` - Créer une facture
- `GET /api/invoices/[id]` - Détails d'une facture
- `POST /api/invoices/[id]/pay` - Initier paiement Stripe
- `POST /api/invoices/verify-payment` - Vérifier paiement

### Webhooks
- `POST /api/webhooks/stripe` - Webhook Stripe pour les paiements

### Statistiques
- `GET /api/stats` - Statistiques du dashboard

## Sécurité

- Hachage mots de passe (bcryptjs)
- JWT authentication
- RBAC middleware
- Validation formulaires (Zod)
- Protection routes
- Webhook signature verification (Stripe)

## Documentation

- [Diagrammes UML](./docs/diagrams.md) - Use Case et Class Diagrams
- [Configuration Stripe](./STRIPE_SETUP.md) - Guide de configuration Stripe

## Déploiement

### Vercel

Le moyen le plus simple de déployer votre application Next.js est d'utiliser la [Plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) créée par les créateurs de Next.js.

Consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.

### Variables d'environnement requises

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/medflow"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

## Version

**Version**: 1.0.0  
**Statut**: Production Ready
