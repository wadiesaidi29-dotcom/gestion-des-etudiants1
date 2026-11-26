import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteStudent } from '../store/students.js'
import { useStudent } from '../store/useStudents.js'
import { databaseError } from '../lib/db.js'
import StatusBadge from '../components/StatusBadge.jsx'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function age(dateNaissance) {
  if (!dateNaissance) return null
  const born = new Date(dateNaissance)
  if (Number.isNaN(born.getTime())) return null
  const diff = Date.now() - born.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))
}

export default function StudentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { student, loading, error } = useStudent(id)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState('')

  async function handleDelete() {
    const confirmed = window.confirm(
      `Supprimer définitivement la fiche de ${student.prenom} ${student.nom} ?`,
    )
    if (!confirmed) return

    setDeleting(true)
    setActionError('')
    try {
      await deleteStudent(student.id)
      navigate('/etudiants', { replace: true })
    } catch (err) {
      setActionError(databaseError(err))
      setDeleting(false)
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
          <p>Aucune fiche ne correspond à l’identifiant <code>{id}</code>.</p>
          <Link className="btn btn-primary" to="/etudiants">Retour à la liste</Link>
        </div>
      </div>
    )
  }

  const years = age(student.dateNaissance)

  return (
    <div className="page">
      <nav className="breadcrumb">
        <Link to="/etudiants">Étudiants</Link>
        <span>/</span>
        <span>{student.prenom} {student.nom}</span>
      </nav>

      <header className="page-head">
        <div className="head-identity">
          <span className="avatar lg">{student.prenom?.charAt(0)}</span>
          <div>
            <h1>{student.prenom} {student.nom}</h1>
            <p>{student.filiere} · {student.niveau} <StatusBadge statut={student.statut} /></p>
          </div>
        </div>
        <div className="page-actions">
          <Link className="btn btn-ghost" to="/etudiants">Retour</Link>
          <Link className="btn btn-outline" to={`/etudiants/${student.id}/modifier`}>Modifier</Link>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Suppression…' : 'Supprimer'}
          </button>
        </div>
      </header>

      {actionError && <div className="alert alert-error">{actionError}</div>}

      <div className="detail-grid">
        <section className="card">
          <div className="card-head"><h2>Informations personnelles</h2></div>
          <dl className="info-list">
            <div><dt>Nom complet</dt><dd>{student.prenom} {student.nom}</dd></div>
            <div><dt>Email</dt><dd><a className="link" href={`mailto:${student.email}`}>{student.email}</a></dd></div>
            <div><dt>Téléphone</dt><dd>{student.telephone ? <a className="link" href={`tel:${student.telephone}`}>{student.telephone}</a> : '—'}</dd></div>
            <div><dt>Date de naissance</dt><dd>{formatDate(student.dateNaissance)}{years !== null ? ` (${years} ans)` : ''}</dd></div>
            <div><dt>Ville</dt><dd>{student.ville || '—'}</dd></div>
          </dl>
        </section>

        <section className="card">
          <div className="card-head"><h2>Parcours académique</h2></div>
          <dl className="info-list">
            <div><dt>Filière</dt><dd>{student.filiere}</dd></div>
            <div><dt>Niveau</dt><dd>{student.niveau}</dd></div>
            <div><dt>Statut</dt><dd><StatusBadge statut={student.statut} /></dd></div>
            <div><dt>Date d’inscription</dt><dd>{formatDate(student.dateInscription)}</dd></div>
            <div><dt>Identifiant</dt><dd className="mono">{student.id}</dd></div>
          </dl>
        </section>
      </div>
    </div>
  )
}
