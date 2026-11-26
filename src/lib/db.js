import { createClient } from '@libsql/client/web'

const url = (import.meta.env.VITE_TURSO_DATABASE_URL ?? '').trim()
const authToken = (import.meta.env.VITE_TURSO_AUTH_TOKEN ?? '').trim()

export const isDatabaseConfigured = Boolean(url && authToken)

// Client HTTP : fonctionne directement dans le navigateur, sans backend.
export const db = isDatabaseConfigured ? createClient({ url, authToken }) : null

export const SETUP_MESSAGE =
  'Base de données non connectée : renseignez VITE_TURSO_DATABASE_URL et VITE_TURSO_AUTH_TOKEN dans le fichier .env, puis redémarrez le serveur.'

export function databaseError(error) {
  const message = String(error?.message ?? '')

  if (/UNIQUE constraint failed: students\.email/i.test(message)) {
    return 'Cet email est déjà utilisé par un autre étudiant.'
  }
  if (/no such table/i.test(message)) {
    return 'La table « students » est introuvable. Exécutez le script database/schema.sql dans votre base Turso.'
  }
  if (/401|unauthorized|invalid token|jwt|auth token/i.test(message)) {
    return 'Identifiants de la base invalides. Vérifiez VITE_TURSO_DATABASE_URL et VITE_TURSO_AUTH_TOKEN.'
  }
  if (/fetch|network|failed to fetch|offline/i.test(message)) {
    return 'Connexion à la base impossible. Vérifiez votre connexion internet.'
  }

  return message || 'Une erreur est survenue avec la base de données.'
}
