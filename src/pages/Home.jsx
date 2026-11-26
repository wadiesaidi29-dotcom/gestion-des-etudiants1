import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LogoMark from '../components/LogoMark.jsx'

const FEATURES = [
  { icon: '▦', title: 'Tableau de bord', text: 'Vue d’ensemble des effectifs, des filières et des statuts.' },
  { icon: '☰', title: 'Liste et recherche', text: 'Retrouvez un étudiant par nom, email, filière ou ville.' },
  { icon: '＋', title: 'Ajout et modification', text: 'Créez ou mettez à jour une fiche complète en quelques secondes.' },
  { icon: '✕', title: 'Suppression sécurisée', text: 'Supprimez une fiche avec une confirmation explicite.' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div className="home">
      <header className="home-topbar">
        <div className="brand brand-dark">
          <span className="brand-mark"><LogoMark /></span>
          <div className="brand-text">
            <strong>GestÉtud</strong>
            <small>Gestion des étudiants</small>
          </div>
        </div>
        <nav className="home-nav">
          {!user && <Link className="btn btn-ghost" to="/login">Connexion</Link>}
          <Link className="btn btn-primary" to={user ? '/dashboard' : '/login'}>
            {user ? 'Tableau de bord' : 'Accéder à l’application'}
          </Link>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">Projet A — Application React</span>
          <h1>Gérez les étudiants de votre établissement, simplement.</h1>
          <p>
            Une application complète pour consulter, ajouter, modifier et supprimer
            les fiches étudiantes, avec recherche instantanée et tableau de bord.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary btn-lg" to={user ? '/dashboard' : '/login'}>
              {user ? 'Ouvrir le tableau de bord' : 'Se connecter'}
            </Link>
            <Link className="btn btn-outline btn-lg" to="/etudiants">Voir la liste</Link>
          </div>
          <dl className="hero-stats">
            <div><dt>Modules</dt><dd>9</dd></div>
            <div><dt>Routes</dt><dd>8</dd></div>
            <div><dt>Stack</dt><dd>React</dd></div>
          </dl>
        </div>

        <div className="hero-card">
          <div className="hero-card-head">
            <span className="dot dot-red" /><span className="dot dot-yellow" /><span className="dot dot-green" />
          </div>
          <div className="hero-card-body">
            <div className="mini-row">
              <span className="avatar sm">Y</span>
              <div><strong>Yasmine El Amrani</strong><small>Développement Digital · 2ème année</small></div>
              <span className="badge badge-success">Actif</span>
            </div>
            <div className="mini-row">
              <span className="avatar sm">O</span>
              <div><strong>Omar Benali</strong><small>Infrastructure Digitale · 3ème année</small></div>
              <span className="badge badge-success">Actif</span>
            </div>
            <div className="mini-row">
              <span className="avatar sm">S</span>
              <div><strong>Salma Haddad</strong><small>Design Graphique · 1ère année</small></div>
              <span className="badge badge-info">Diplômé</span>
            </div>
            <div className="mini-row">
              <span className="avatar sm">M</span>
              <div><strong>Mehdi Ouazzani</strong><small>Gestion des Entreprises · 3ème année</small></div>
              <span className="badge badge-warning">Suspendu</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        {FEATURES.map((feature) => (
          <article key={feature.title} className="feature-card">
            <span className="feature-icon">{feature.icon}</span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <footer className="home-footer">
        <p>GestÉtud — Projet A · Application de gestion des étudiants</p>
        <p>React · Vite · React Router</p>
      </footer>
    </div>
  )
}
