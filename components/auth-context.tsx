'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  role: 'salesperson' | 'customer'
  sharedLink?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, role: 'salesperson' | 'customer', sharedLink?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = (email: string, role: 'salesperson' | 'customer', sharedLink?: string) => {
    setUser({
      id: Math.random().toString(36).slice(2),
      email,
      role,
      sharedLink
    })
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

