import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StudentForm from '../components/StudentForm.jsx'
import { createStudent } from '../store/students.js'
import { databaseError } from '../lib/db.js'

export default function StudentNew() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(values) {
    setSaving(true)
    setError('')
    try {
      const student = await createStudent(values)
      navigate(`/etudiants/${student.id}`, { replace: true })
    } catch (err) {
      setError(databaseError(err))
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/etudiants">Étudiants</Link>
        <span>/</span>
        <span>Nouvel étudiant</span>
      </nav>

      <header className="page-head">
        <div>
          <h1>Ajouter un étudiant</h1>
          <p>Renseignez les informations de la nouvelle fiche. Les champs marqués * sont obligatoires.</p>
        </div>
      </header>

      <StudentForm
        submitLabel="Créer l’étudiant"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/etudiants')}
        submitting={saving}
        error={error}
      />
    </div>
  )
}
