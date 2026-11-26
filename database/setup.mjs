// Applique database/schema.sql à la base Turso configurée dans .env
// Usage : bun database/setup.mjs
import { readFileSync } from 'node:fs'
import { createClient } from '@libsql/client'

const url = process.env.VITE_TURSO_DATABASE_URL
const authToken = process.env.VITE_TURSO_AUTH_TOKEN

if (!url || !authToken) {
  console.error('Variables VITE_TURSO_DATABASE_URL / VITE_TURSO_AUTH_TOKEN manquantes dans .env')
  process.exit(1)
}

const client = createClient({ url, authToken })

const sql = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8')
const statements = sql
  .split('\n')
  .filter((line) => !line.trim().startsWith('--'))
  .join('\n')
  .split(';')
  .map((statement) => statement.trim())
  .filter(Boolean)

for (const statement of statements) {
  await client.execute(statement)
}

const tables = await client.execute("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")
console.log('Tables :', tables.rows.map((row) => row.name).join(', '))

const count = await client.execute('SELECT COUNT(*) AS total FROM students')
console.log('Étudiants en base :', count.rows[0].total)
