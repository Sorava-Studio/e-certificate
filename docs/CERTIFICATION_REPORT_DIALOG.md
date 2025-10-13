# Dialog de Rapport de Certification - Documentation

## 📋 Vue d'ensemble

Le dialog de rapport de certification a été complètement restructuré avec une sidebar de navigation et des sections détaillées pour chaque aspect de l'évaluation d'une montre.

## 🎨 Structure du Dialog

### Layout
- **Sidebar gauche** : Navigation entre les sections (width: 256px)
- **Zone principale** : Contenu de la section active
- **Footer** : Boutons d'action (Annuler / Enregistrer)

### Dimensions
- Largeur maximale : `max-w-6xl`
- Hauteur : `80vh`
- Layout flex avec scroll indépendant pour sidebar et contenu

## 📑 Sections Disponibles

### 1. **Infos générales**
Icon: `Info`
- Marque *
- Modèle *
- Référence
- Numéro de série
- Année
- État général *
- Notes générales

### 2. **Accessoires**
Icon: `Package`
- Checkboxes pour accessoires (Boîte, Papiers, Garantie, Manuel, Maillons supplémentaires, Facture)
- État de la boîte
- État des papiers
- Notes sur les accessoires

### 3. **Boîtier**
Icon: `Box`
- État du boîtier *
- État du fond de boîte
- État de la couronne
- État de la lunette
- État du verre
- Notes sur le boîtier

### 4. **Bracelet**
Icon: `Link2`
- État du bracelet *
- État du fermoir
- Largeur entre-cornes (mm)
- Étirement du bracelet
- Notes sur le bracelet

### 5. **Cadran**
Icon: `Clock`
- État du cadran *
- État des aiguilles
- État des index
- État de la luminescence
- Notes sur le cadran

### 6. **Mouvement**
Icon: `Cog`
- Type de mouvement *
- État du mouvement
- Calibre
- Réserve de marche (heures)
- Fréquence (A/h)
- Nombre de rubis
- Notes sur le mouvement

---

**Séparateur visuel**

---

### 7. **Technique**
Icon: `Wrench`
- Étanchéité (m)
- Test d'étanchéité effectué
- Précision cadran en haut (s/j)
- Précision cadran en bas (s/j)
- Précision couronne en haut (s/j)
- Précision couronne en bas (s/j)
- Amplitude (degrés)
- Beat Error (ms)
- Fonctions testées (Date, Jour, Chronographe, GMT, Phase de lune, Alarme)
- Notes techniques

### 8. **Intervention**
Icon: `Wrench`
- Intervention nécessaire *
- Interventions recommandées (Nettoyage, Polissage, Révision, etc.)
- Détails des interventions

### 9. **Marché/Valeur**
Icon: `TrendingUp`
- Prix de vente au détail (€)
- Valeur estimée (€)
- Demande du marché
- Rareté
- Niveau de collection
- Potentiel d'investissement
- Notes sur le marché

### 10. **Score & Commentaire**
Icon: `Award`
- Score d'authenticité (slider 0-100)
- Score de condition (slider 0-100)
- Score de fonctionnalité (slider 0-100)
- Score moyen calculé (automatique)
- Score global final * (slider 0-100)
- Recommandation *
- Commentaire général *

## 🎯 Composants Créés

### Fichiers de sections
```
src/components/partner/report-sections/
├── general-section.tsx
├── accessories-section.tsx
├── case-section.tsx
├── bracelet-section.tsx
├── dial-section.tsx
├── movement-section.tsx
├── technical-section.tsx
├── intervention-section.tsx
├── market-section.tsx
├── score-section.tsx
└── index.ts
```

### Dialog principal
```
src/components/partner/certification-report-dialog.tsx
```

## 🔧 Composants UI Utilisés

- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogTrigger`
- `Button`
- `ScrollArea`
- `Separator`
- `Input`
- `Textarea`
- `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
- `Checkbox`
- `Label`
- `Slider` (nouvellement installé)

## 🎨 Icônes Lucide

Toutes les icônes utilisées proviennent de `lucide-react` et sont professionnelles :
- `Info` - Infos générales
- `Package` - Accessoires
- `Box` - Boîtier
- `Link2` - Bracelet
- `Clock` - Cadran
- `Cog` - Mouvement
- `Wrench` - Technique et Intervention
- `TrendingUp` - Marché/Valeur
- `Award` - Score & Commentaire
- `FileText` - Icône du bouton principal

## 💡 Fonctionnalités

### Navigation
- Clic sur une section dans la sidebar pour changer de contenu
- Section active mise en évidence avec style `primary`
- Séparateur visuel avant la section "Technique"

### Validation
- Champs requis marqués avec `*` et `text-destructive`
- Attribut `required` sur les champs obligatoires
- Validation HTML5 native

### Scores
- Sliders interactifs pour les scores (pas de 5)
- Calcul automatique du score moyen
- Affichage en temps réel des valeurs

### État du formulaire
- État `isSubmitting` pendant l'enregistrement
- Désactivation des boutons pendant la soumission
- Feedback visuel (texte "Enregistrement...")

## 🚀 Utilisation

Le dialog est déclenché depuis `walk-in-missions-list.tsx` pour les missions en cours :

```tsx
<CertificationReportDialog clientName={clientName} />
```

## 📝 TODO

- [ ] Implémenter l'appel API pour sauvegarder le rapport
- [ ] Ajouter la gestion des erreurs
- [ ] Persister les données du formulaire (state management)
- [ ] Ajouter des tooltips pour les champs techniques
- [ ] Implémenter la sauvegarde automatique (draft)
- [ ] Ajouter la validation côté serveur
- [ ] Exporter le rapport en PDF

## 🎨 Style & UX

- Design cohérent avec le reste de l'application
- Responsive (grid adaptatif avec `sm:grid-cols-2`)
- ScrollArea pour navigation fluide
- Séparation visuelle claire entre les sections
- Feedback immédiat sur les actions utilisateur

## ⚡ Performance

- Composants client-side uniquement (`"use client"`)
- Lazy rendering des sections (seule la section active est affichée)
- Pas de re-render inutile grâce à la structure modulaire
