# Utilisation des Services et Tarifs dans MedFlow

## Utilisation Actuelle

### 1. Création Automatique de Facture après Consultation

Lorsqu'un médecin crée une consultation, le système génère automatiquement une facture en utilisant le prix d'un service :

**Fichier**: `app/api/consultations/route.ts` (lignes 142-190)

```typescript
// Get default service price or use a default amount
const defaultService = await prisma.service.findFirst({
  where: {
    clinicId: consultation.appointment.clinicId,
    isActive: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
})

const invoiceAmount = defaultService 
  ? Number(defaultService.price) 
  : 50.00 // Default consultation fee in TND
```

**Comportement**:
- Le système cherche le premier service actif de la clinique
- Utilise le prix de ce service comme montant de la facture
- Si aucun service n'est trouvé, utilise 50 TND par défaut

### 2. Gestion des Services par l'Admin

L'admin peut créer, modifier et gérer les services via `/admin/services`:
- Créer des services avec nom, description et prix
- Activer/désactiver des services
- Modifier les prix des services

## Limitations Actuelles

1. **Création manuelle de facture** : Le réceptionniste doit entrer le montant manuellement, les services ne sont pas proposés
2. **Pas de sélection de service** : Aucune possibilité de choisir un service spécifique lors de la création d'une facture
3. **Service par défaut uniquement** : Le système prend toujours le premier service trouvé, pas de logique de sélection intelligente
4. **Pas d'association service-consultation** : Les consultations ne sont pas liées à un service spécifique

## Améliorations Recommandées

### 1. Sélection de Service lors de la Création de Facture

Permettre au réceptionniste de sélectionner un service lors de la création d'une facture, avec le prix pré-rempli automatiquement.

### 2. Association Service-Consultation

Permettre au médecin de sélectionner un service lors de la création d'une consultation, ce qui déterminera le montant de la facture générée.

### 3. Services par Spécialité

Associer des services à des spécialités médicales pour une sélection plus intelligente.

### 4. Historique des Services Utilisés

Traçabilité des services utilisés pour chaque patient/consultation.

