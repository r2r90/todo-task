# Test Libheros - Technique

## Contexte

Tout comme Wunderlist ou Google Tasks, les listes de tâches font partie du quotidien des professionnels de tous secteurs confondus.

L'application à développer se compose de deux principales sections :

- **Page d'authentification**
- **Page principale**

---

## Page d'authentification

Il s'agit de la page par défaut pour tout utilisateur non connecté.

Fonctionnalités attendues :
- Connexion via login / mot de passe
- Création de compte via formulaire comprenant :
    - Nom
    - Prénom
    - Adresse email + vérification
    - Mot de passe + confirmation

---

## Page principale

Cette page regroupe trois sous-catégories :

1. **Left sidebar**
2. **Main content**
3. **Right sidebar**

---

### Left sidebar

Bandeau vertical rétractable permettant à l'utilisateur de :
- Créer une nouvelle liste de tâches (nom unique obligatoire)
- Retrouver l'ensemble de ses listes de tâches
- Sélectionner une liste
- Supprimer une liste avec confirmation via modal
  > ⚠️ Le modal avertit que la suppression d'une liste entraîne la suppression des tâches associées.

---

### Main content

Zone principale au centre de la page affichant les tâches de la liste sélectionnée.

Fonctionnalités attendues :
- Création d'une tâche avec :
    - Description courte (obligatoire)
    - Description longue (optionnelle)
    - Date d'échéance (obligatoire)
- Marquer une tâche comme terminée
- Les tâches terminées apparaissent dans la section « Mes tâches terminées » masquée par défaut
    - Cette section doit pouvoir être ouverte pour consulter les tâches terminées
    - Une tâche terminée peut être restaurée dans la liste des tâches à faire

---

### Right sidebar

N'apparaît que lorsque l'utilisateur clique sur une tâche.  
Affiche en détail :  
