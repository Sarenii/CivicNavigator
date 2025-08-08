"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import type { User } from "../../types"
import authManager from "../../handler/AuthManager"
import { toast } from "sonner"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Check if user has valid tokens
      if (authManager.isAuthenticated()) {
        setIsAuthenticated(true)
        
        // Try to get user data from server
        try {
          const userData = await authManager.getUser()
          if (userData) {
            setUser(userData as User)
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          // If we can't get user data, clear auth state
          authManager.clearAuth()
          setIsAuthenticated(false)
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      authManager.clearAuth()
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await authManager.login(email, password)
      
      if (response && response.user) {
        setUser(response.user as User)
        setIsAuthenticated(true)
        
        // Fetch complete user data
        try {
          const completeUserData = await authManager.getUser()
          if (completeUserData) {
            setUser(completeUserData as User)
          }
        } catch (error) {
          console.error('Failed to fetch complete user data:', error)
        }
        
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      setIsAuthenticated(false)
      setUser(null)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authManager.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
    }
  }
  const refreshUser = async () => {
    try {
      if (isAuthenticated) {
        const userData = await authManager.getUser()
        if (userData) {
          setUser(userData as User)
        }
      }
    } catch (error: any) {
      console.error('Failed to refresh user data:', error)
      // If refresh fails, might need to re-authenticate
      if (error.response?.status === 401) {
        setUser(null)
        setIsAuthenticated(false)
        authManager.clearAuth()
      }
    }
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
    updateUser,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}