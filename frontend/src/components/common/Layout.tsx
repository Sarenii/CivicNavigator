'use client'
import { useEffect, useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import AuthModal from './AuthModal'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, login } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  // Accessibility setup for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@axe-core/react').then(({ default: axe }) => {
        axe(React, ReactDOM, 1000)
      }).catch(() => {
        // Silently fail if axe-core fails to load
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-900 text-white p-4 shadow-sm" role="navigation">
        <div className="container mx-auto flex justify-between items-center">
          <Link 
            href="/" 
            className="text-xl font-bold hover:text-blue-200 transition-colors"
            aria-label="CivicNavigator home"
          >
            CivicNavigator
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Navigation Links */}
            <div className="hidden md:flex gap-4">
              <Link 
                href="/chat" 
                className="hover:text-blue-200 transition-colors"
                aria-label="Chat with assistant"
              >
                Chat
              </Link>
              <Link 
                href="/report" 
                className="hover:text-blue-200 transition-colors"
                aria-label="Report an incident"
              >
                Report
              </Link>
              <Link 
                href="/status" 
                className="hover:text-blue-200 transition-colors"
                aria-label="Check incident status"
              >
                Status
              </Link>
              {user?.role === 'staff' && (
                <Link 
                  href="/staff" 
                  className="hover:text-blue-200 transition-colors"
                  aria-label="Staff dashboard"
                >
                  Dashboard
                </Link>
              )}
            </div>

            {/* User Info & Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {user.name} 
                  <span className="text-blue-300">({user.role})</span>
                </span>
                <button
                  onClick={logout}
                  className="text-sm bg-blue-800 px-3 py-1 rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
                aria-label="Login to CivicNavigator"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto p-4" role="main">
        {children}
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}