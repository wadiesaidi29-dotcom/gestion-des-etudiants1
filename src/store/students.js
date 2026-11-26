import { db, SETUP_MESSAGE } from '../lib/db.js'

const COLUMNS =
  'id, nom, prenom, email, telephone, date_naissance, filiere, niveau, ville, statut, date_inscription'

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `etd-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

function requireDb() {
  if (!db) throw new Error(SETUP_MESSAGE)
  return db
}

function fromRow(row) {
  return {
    id: row.id,
    nom: row.nom,
    prenom: row.prenom,
    email: row.email,
    telephone: row.telephone ?? '',
    dateNaissance: row.date_naissance ?? '',
    filiere: row.filiere,
    niveau: row.niveau,
    ville: row.ville ?? '',
    statut: row.statut,
    dateInscription: row.date_inscription ?? '',
  }
}

export async function getStudents() {
  const result = await requireDb().execute(
    `SELECT ${COLUMNS} FROM students ORDER BY nom COLLATE NOCASE ASC, prenom COLLATE NOCASE ASC`,
  )
  return result.rows.map(fromRow)
}

export async function getStudent(id) {
  const result = await requireDb().execute({
    sql: `SELECT ${COLUMNS} FROM students WHERE id = ?`,
    args: [id],
  })
  return result.rows[0] ? fromRow(result.rows[0]) : null
}

export async function createStudent(data) {
  const student = { ...data, id: uid() }
  await requireDb().execute({
    sql: `INSERT INTO students
            (id, nom, prenom, email, telephone, date_naissance, filiere, niveau, ville, statut, date_inscription)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      student.id,
      student.nom,
      student.prenom,
      student.email,
      student.telephone || null,
      student.dateNaissance,
      student.filiere,
      student.niveau,
      student.ville || null,
      student.statut,
      student.dateInscription,
    ],
  })
  return student
}

export async function updateStudent(id, data) {
  await requireDb().execute({
    sql: `UPDATE students SET
            nom = ?, prenom = ?, email = ?, telephone = ?, date_naissance = ?,
            filiere = ?, niveau = ?, ville = ?, statut = ?, date_inscription = ?
          WHERE id = ?`,
    args: [
      data.nom,
      data.prenom,
      data.email,
      data.telephone || null,
      data.dateNaissance,
      data.filiere,
      data.niveau,
      data.ville || null,
      data.statut,
      data.dateInscription,
      id,
    ],
  })
  return getStudent(id)
}

export async function deleteStudent(id) {
  await requireDb().execute({ sql: 'DELETE FROM students WHERE id = ?', args: [id] })
}
