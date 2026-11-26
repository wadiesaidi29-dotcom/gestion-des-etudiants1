-- Schéma de la table des étudiants (Turso / libSQL)
-- À exécuter une seule fois dans la console SQL de votre base Turso.

CREATE TABLE IF NOT EXISTS students (
  id               TEXT PRIMARY KEY,
  nom              TEXT NOT NULL,
  prenom           TEXT NOT NULL,
  email            TEXT NOT NULL UNIQUE,
  telephone        TEXT,
  date_naissance   TEXT NOT NULL,   -- AAAA-MM-JJ
  filiere          TEXT NOT NULL,
  niveau           TEXT NOT NULL,
  ville            TEXT,
  statut           TEXT NOT NULL,   -- Actif | Suspendu | Diplômé
  date_inscription TEXT NOT NULL,   -- AAAA-MM-JJ
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_students_nom ON students (nom);

-- La table est créée vide : ajoutez vos étudiants depuis l'application
-- (page « Ajouter un étudiant ») ou avec des requêtes INSERT.
