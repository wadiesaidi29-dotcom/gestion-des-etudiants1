import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LogoMark from '../components/LogoMark.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/dashboard'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (user) return <Navigate to={redirectTo} replace />

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.email.trim() || !form.password) {
      setError('Veuillez renseigner votre email et votre mot de passe.')
      return
    }
    const result = login(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="auth">
      <div className="auth-aside">
        <Link to="/" className="brand brand-light">
          <span className="brand-mark"><LogoMark /></span>
          <div className="brand-text">
            <strong>GestÉtud</strong>
            <small>Gestion des étudiants</small>
          </div>
        </Link>
        <h2>Bienvenue sur votre espace de gestion.</h2>
        <p>Connectez-vous pour accéder au tableau de bord et gérer les fiches étudiantes.</p>
        <ul className="auth-list">
          <li>Recherche instantanée</li>
          <li>Création et mise à jour des fiches</li>
          <li>Suivi des statuts et des filières</li>
        </ul>
      </div>

      <div className="auth-panel">
        <div className="auth-mobile-brand brand brand-dark">
          <span className="brand-mark"><LogoMark /></span>
          <div className="brand-text">
            <strong>GestÉtud</strong>
            <small>Gestion des étudiants</small>
          </div>
        </div>

        <div className="auth-card">
          <h1>Connexion</h1>
          <p className="auth-sub">Accédez à l’application avec votre compte.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                placeholder="vous@ecole.ma"
              />
            </div>

            <div className="field">
              <label htmlFor="password">Mot de passe</label>
              <div className="password-row">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
            </div>

            {error && <p className="alert alert-error">{error}</p>}

            <button type="submit" className="btn btn-primary btn-block btn-lg">Se connecter</button>
          </form>

          <p className="auth-hint">Accès réservé au personnel de l’établissement.</p>

          <p className="auth-back"><Link to="/">← Retour à l’accueil</Link></p>
        </div>
      </div>
    </div>
  )
}
