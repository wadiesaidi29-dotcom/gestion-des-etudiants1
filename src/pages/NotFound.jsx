import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound-card">
        <span className="notfound-code">404</span>
        <h1>Page introuvable</h1>
        <p>La page demandée n’existe pas ou a été déplacée.</p>
        <div className="notfound-actions">
          <Link className="btn btn-ghost" to="/">Accueil</Link>
          <Link className="btn btn-primary" to="/dashboard">Tableau de bord</Link>
        </div>
      </div>
    </div>
  )
}
