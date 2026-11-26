import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LogoMark from './LogoMark.jsx'

const LINKS = [
  { to: '/dashboard', label: 'Tableau de bord', icon: '▦' },
  { to: '/etudiants', label: 'Liste des étudiants', icon: '☰', end: true },
  { to: '/etudiants/nouveau', label: 'Ajouter un étudiant', icon: '+' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark"><LogoMark /></span>
          <div className="brand-text">
            <strong>GestÉtud</strong>
            <small>Gestion des étudiants</small>
          </div>
        </div>

        <nav className="nav">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <span className="avatar">{user?.name?.charAt(0) ?? 'A'}</span>
            <div className="user-meta">
              <strong>{user?.name}</strong>
              <small>Administrateur</small>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-block" onClick={handleLogout}>
            Se déconnecter
          </button>
        </div>
      </aside>

      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
