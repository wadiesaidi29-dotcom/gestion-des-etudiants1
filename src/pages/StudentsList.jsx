import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteStudent } from '../store/students.js'
import { useStudents } from '../store/useStudents.js'
import { databaseError } from '../lib/db.js'
import { FILIERES, STATUTS } from '../data/options.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function StudentsList() {
  const { students, loading, error, reload } = useStudents()
  const [query, setQuery] = useState('')
  const [filiere, setFiliere] = useState('')
  const [statut, setStatut] = useState('')
  const [notice, setNotice] = useState('')
  const [actionError, setActionError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return students
      .filter((s) => {
        if (!q) return true
        const haystack = [s.nom, s.prenom, s.email, s.ville, s.filiere, s.niveau].join(' ').toLowerCase()
        return haystack.includes(q)
      })
      .filter((s) => !filiere || s.filiere === filiere)
      .filter((s) => !statut || s.statut === statut)
      .sort((a, b) => a.nom.localeCompare(b.nom, 'fr'))
  }, [students, query, filiere, statut])

  const hasFilters = Boolean(query || filiere || statut)

  async function handleDelete(student) {
    const confirmed = window.confirm(
      `Supprimer définitivement la fiche de ${student.prenom} ${student.nom} ?`,
    )
    if (!confirmed) return

    setDeletingId(student.id)
    setActionError('')
    try {
      await deleteStudent(student.id)
      setNotice(`La fiche de ${student.prenom} ${student.nom} a été supprimée.`)
      await reload()
    } catch (err) {
      setNotice('')
      setActionError(databaseError(err))
    } finally {
      setDeletingId(null)
    }
  }

  function resetFilters() {
    setQuery('')
    setFiliere('')
    setStatut('')
  }

  const alerts = actionError || error

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Liste des étudiants</h1>
          <p>
            {loading
              ? 'Chargement…'
              : `${students.length} étudiant(s) enregistré(s) · ${filtered.length} affiché(s)`}
          </p>
        </div>
        <div className="page-actions">
          <Link className="btn btn-primary" to="/etudiants/nouveau">+ Nouvel étudiant</Link>
        </div>
      </header>

      {notice && (
        <div className="alert alert-success alert-dismissible">
          <span>{notice}</span>
          <button type="button" className="link" onClick={() => setNotice('')}>Fermer</button>
        </div>
      )}

      {alerts && <div className="alert alert-error">{alerts}</div>}

      <section className="card toolbar">
        <div className="search">
          <span className="search-icon">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par nom, email, filière ou ville…"
            aria-label="Rechercher un étudiant"
          />
        </div>
        <select value={filiere} onChange={(event) => setFiliere(event.target.value)} aria-label="Filtrer par filière">
          <option value="">Toutes les filières</option>
          {FILIERES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        <select value={statut} onChange={(event) => setStatut(event.target.value)} aria-label="Filtrer par statut">
          <option value="">Tous les statuts</option>
          {STATUTS.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
        {hasFilters && (
          <button type="button" className="btn btn-ghost" onClick={resetFilters}>Réinitialiser</button>
        )}
      </section>

      {loading ? (
        <div className="card"><p className="empty">Chargement des étudiants…</p></div>
      ) : (
        <section className="card table-card">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">☰</span>
              <h3>{students.length === 0 ? 'Aucun étudiant dans la base' : 'Aucun étudiant trouvé'}</h3>
              <p>
                {students.length === 0
                  ? 'Ajoutez votre premier étudiant pour commencer votre liste.'
                  : 'Modifiez votre recherche ou ajoutez un nouvel étudiant.'}
              </p>
              <div className="empty-actions">
                {hasFilters && <button type="button" className="btn btn-outline" onClick={resetFilters}>Effacer les filtres</button>}
                <Link className="btn btn-primary" to="/etudiants/nouveau">+ Nouvel étudiant</Link>
              </div>
            </div>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Filière</th>
                    <th>Niveau</th>
                    <th>Ville</th>
                    <th>Statut</th>
                    <th className="th-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="cell-student">
                          <span className="avatar sm">{student.prenom?.charAt(0)}</span>
                          <div>
                            <strong>{student.prenom} {student.nom}</strong>
                            <small>{student.email}</small>
                          </div>
                        </div>
                      </td>
                      <td>{student.filiere}</td>
                      <td>{student.niveau}</td>
                      <td>{student.ville || '—'}</td>
                      <td><StatusBadge statut={student.statut} /></td>
                      <td>
                        <div className="row-actions">
                          <Link className="btn btn-ghost btn-sm" to={`/etudiants/${student.id}`}>Voir</Link>
                          <Link className="btn btn-outline btn-sm" to={`/etudiants/${student.id}/modifier`}>Modifier</Link>
                          <button
                            type="button"
                            className="btn btn-danger-ghost btn-sm"
                            onClick={() => handleDelete(student)}
                            disabled={deletingId === student.id}
                          >
                            {deletingId === student.id ? 'Suppression…' : 'Supprimer'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
