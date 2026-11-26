import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useStudents } from '../store/useStudents.js'
import StatusBadge from '../components/StatusBadge.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const { students, loading, error } = useStudents()

  const stats = useMemo(() => {
    const total = students.length
    const actifs = students.filter((s) => s.statut === 'Actif').length
    const diplomes = students.filter((s) => s.statut === 'Diplômé').length
    const suspendus = students.filter((s) => s.statut === 'Suspendu').length

    const currentMonth = new Date().toISOString().slice(0, 7)
    const nouveaux = students.filter((s) => (s.dateInscription || '').startsWith(currentMonth)).length

    const parFiliere = Object.entries(
      students.reduce((acc, s) => {
        acc[s.filiere] = (acc[s.filiere] || 0) + 1
        return acc
      }, {}),
    ).sort((a, b) => b[1] - a[1])

    return { total, actifs, diplomes, suspendus, nouveaux, parFiliere }
  }, [students])

  const recent = useMemo(
    () => [...students].sort((a, b) => (b.dateInscription || '').localeCompare(a.dateInscription || '')).slice(0, 5),
    [students],
  )

  const maxFiliere = Math.max(1, ...stats.parFiliere.map(([, count]) => count))

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Bonjour {user?.name?.split(' ')[0] ?? 'Admin'} 👋</h1>
          <p>Voici l’état actuel de votre établissement.</p>
        </div>
        <div className="page-actions">
          <Link className="btn btn-outline" to="/etudiants">Liste des étudiants</Link>
          <Link className="btn btn-primary" to="/etudiants/nouveau">+ Nouvel étudiant</Link>
        </div>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="card"><p className="empty">Chargement des données…</p></div>
      ) : (
        <>
          <section className="stat-grid">
            <article className="stat-card">
              <span className="stat-label">Total étudiants</span>
              <strong className="stat-value">{stats.total}</strong>
              <small>Fiches enregistrées</small>
            </article>
            <article className="stat-card">
              <span className="stat-label">Actifs</span>
              <strong className="stat-value text-success">{stats.actifs}</strong>
              <small>Inscrits en cours de formation</small>
            </article>
            <article className="stat-card">
              <span className="stat-label">Diplômés</span>
              <strong className="stat-value text-info">{stats.diplomes}</strong>
              <small>Formation terminée</small>
            </article>
            <article className="stat-card">
              <span className="stat-label">Nouveaux ce mois</span>
              <strong className="stat-value">{stats.nouveaux}</strong>
              <small>Inscriptions du mois</small>
            </article>
          </section>

          <section className="dash-columns">
            <article className="card">
              <div className="card-head">
                <h2>Répartition par filière</h2>
                <span className="muted">{stats.parFiliere.length} filières</span>
              </div>
              {stats.parFiliere.length === 0 ? (
                <p className="empty">Aucun étudiant enregistré.</p>
              ) : (
                <ul className="bar-list">
                  {stats.parFiliere.map(([filiere, count]) => (
                    <li key={filiere}>
                      <div className="bar-head">
                        <span>{filiere}</span>
                        <strong>{count}</strong>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(count / maxFiliere) * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="card">
              <div className="card-head">
                <h2>Dernières inscriptions</h2>
                <Link className="link" to="/etudiants">Tout voir</Link>
              </div>
              {recent.length === 0 ? (
                <p className="empty">Aucune inscription.</p>
              ) : (
                <ul className="recent-list">
                  {recent.map((student) => (
                    <li key={student.id}>
                      <Link to={`/etudiants/${student.id}`} className="recent-item">
                        <span className="avatar sm">{student.prenom?.charAt(0)}</span>
                        <div className="recent-meta">
                          <strong>{student.prenom} {student.nom}</strong>
                          <small>{student.filiere} · {student.niveau}</small>
                        </div>
                        <StatusBadge statut={student.statut} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        </>
      )}
    </div>
  )
}
