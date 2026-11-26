import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const SESSION_KEY = 'gestetud.session'

// Compte de démonstration (aucun serveur n'est utilisé dans ce projet).
export const DEMO_ACCOUNT = {
  email: 'admin@ecole.ma',
  password: 'admin123',
  name: 'Admin École',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    else localStorage.removeItem(SESSION_KEY)
  }, [user])

  function login({ email, password }) {
    const okEmail = email.trim().toLowerCase() === DEMO_ACCOUNT.email
    const okPassword = password === DEMO_ACCOUNT.password

    if (!okEmail || !okPassword) {
      return { ok: false, error: 'Email ou mot de passe incorrect.' }
    }

    setUser({ email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name })
    return { ok: true }
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé à l’intérieur de AuthProvider')
  return context
}
