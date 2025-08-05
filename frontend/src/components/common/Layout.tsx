'use client'
import { useEffect, useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import AuthModal from './AuthModal'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, login } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const pathname = usePathname()

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
            {/* Navigation Links with Icons & Active States */}
            <div className="hidden md:flex items-center gap-1">
              <Link 
                href="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === '/' 
                    ? 'bg-blue-800 text-white shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-800'
                }`}
                aria-label="Navigate to homepage"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                href="/chat"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === '/chat' 
                    ? 'bg-blue-800 text-white shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-800'
                }`}
                aria-label="Chat with assistant"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>Chat</span>
              </Link>
              
              <Link 
                href="/report"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === '/report' 
                    ? 'bg-blue-800 text-white shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-800'
                }`}
                aria-label="Report an incident"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span>Report</span>
              </Link>
              
              <Link 
                href="/status"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === '/status' 
                    ? 'bg-blue-800 text-white shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-800'
                }`}
                aria-label="Check incident status"
              >
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                <span>Status</span>
              </Link>
              
              {user?.role === 'staff' && (
                <Link 
                  href="/staff"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                    pathname === '/staff' 
                      ? 'bg-blue-800 text-white shadow-lg' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-800'
                  }`}
                  aria-label="Staff dashboard"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-blue-100 hover:text-white p-2 rounded-lg hover:bg-blue-800 transition-colors"
                aria-label="Toggle mobile menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>

            {/* User Info & Auth */}
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm hidden lg:block">
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
      
      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-blue-800 border-t border-blue-700 shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="space-y-1">
              <Link 
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === '/' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              <Link 
                href="/chat"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === '/chat' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Chat Assistant</span>
              </Link>
              
              <Link 
                href="/report"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === '/report' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span>Report Issue</span>
              </Link>
              
              <Link 
                href="/status"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                  pathname === '/status' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:text-white hover:bg-blue-700'
                }`}
              >
                <ClipboardDocumentCheckIcon className="w-5 h-5" />
                <span>Check Status</span>
              </Link>
              
              {user?.role === 'staff' && (
                <Link 
                  href="/staff"
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    pathname === '/staff' 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>Staff Dashboard</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      
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