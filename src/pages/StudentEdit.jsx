import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import StudentForm from '../components/StudentForm.jsx'
import { updateStudent } from '../store/students.js'
import { useStudent } from '../store/useStudents.js'
import { databaseError } from '../lib/db.js'

export default function StudentEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { student, loading, error } = useStudent(id)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function handleSubmit(values) {
    setSaving(true)
    setSaveError('')
    try {
      await updateStudent(id, values)
      navigate(`/etudiants/${id}`, { replace: true })
    } catch (err) {
      setSaveError(databaseError(err))
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="card"><p className="empty">Chargement de la fiche…</p></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
        <Link className="btn btn-outline" to="/etudiants">Retour à la liste</Link>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="page">
        <div className="card empty-state">
          <span className="empty-icon">?</span>
          <h3>Étudiant introuvable</h3>
          <p>Impossible de modifier une fiche inexistante.</p>
          <Link className="btn btn-primary" to="/etudiants">Retour à la liste</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/etudiants">Étudiants</Link>
        <span>/</span>
        <Link to={`/etudiants/${student.id}`}>{student.prenom} {student.nom}</Link>
        <span>/</span>
        <span>Modifier</span>
      </nav>

      <header className="page-head">
        <div>
          <h1>Modifier la fiche</h1>
          <p>{student.prenom} {student.nom} · {student.filiere}</p>
        </div>
      </header>

      <StudentForm
        initialValues={student}
        submitLabel="Enregistrer les modifications"
        onSubmit={handleSubmit}
        onCancel={() => navigate(`/etudiants/${student.id}`)}
        submitting={saving}
        error={saveError}
      />
    </div>
  )
}
