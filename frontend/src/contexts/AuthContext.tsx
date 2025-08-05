'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Role = 'resident' | 'staff'
type User = { 
  id: string
  role: Role
  name: string
  email: string
} | null

interface AuthContextType {
  user: User
  login: (userData: { role: Role; id: string; name: string; email: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {}
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null)

  const login = (userData: { role: Role; id: string; name: string; email: string }) => {
    setUser(userData)
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}