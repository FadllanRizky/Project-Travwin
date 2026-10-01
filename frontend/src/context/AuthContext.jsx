import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

const STORAGE_KEY = 'travwin_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('traveloka_user')
      if (raw) {
        setUser(JSON.parse(raw))
        localStorage.setItem(STORAGE_KEY, raw)
        localStorage.removeItem('traveloka_user')
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('traveloka_user')
    }
  }, [])

  const login = async ({ username, password }) => {
    const data = await api('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    const profile = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      token: data.token,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    setUser(profile)
    return profile
  }

  const register = async ({ fullName, email, phoneNumber, username, password }) => {
    const createdUser = await api('/api/v1/users', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, phoneNumber }),
    })
    const credential = await api('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        userId: createdUser.id,
        username,
        email,
        passwordHash: password,
        isActive: true,
      }),
    })
    const profile = {
      userId: credential.userId ?? createdUser.id,
      username: credential.username,
      email: credential.email,
      fullName: createdUser.fullName,
      token: `JWT-${credential.username}-${credential.userId}`,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    setUser(profile)
    return profile
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('traveloka_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}