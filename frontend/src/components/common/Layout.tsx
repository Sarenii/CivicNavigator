// components/common/Layout.tsx

'use client'
import { useEffect, useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import AuthModal from './AuthModal'
import NotificationsDropdown from './Notifications'
import { useNotifications } from '@/hooks/useNotifications'
import { Notification } from '../../../types/notifications'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const pathname = usePathname()

  // Notifications hook
  const {
    notifications = [], // Default to empty array
    unreadCount = 0,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    addNotification
  } = useNotifications()

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification.id)
    }
    
    // Navigate to action URL if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    }
    
    // Close dropdown
    setShowNotifications(false)
  }

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

  // Close mobile menu when route changes
  useEffect(() => {
    setShowMobileMenu(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-xl border-b border-blue-700/50" role="navigation">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
              className="text-xl font-bold hover:text-blue-200 transition-colors flex items-center gap-2"
              aria-label="CitizenNavigator home"
          >
              <div className="w-8 h-8 bg-gradient-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center">
                <HomeIcon className="w-5 h-5" />
              </div>
              CitizenNavigator
          </Link>
          
            <div className="flex items-center gap-2">
            {/* Navigation Links with Icons & Active States */}
            <div className="hidden md:flex items-center gap-1">
              <Link 
                href="/"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === '/' 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
                aria-label="Navigate to homepage"
              >
                <HomeIcon className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                href="/chat"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === '/chat' 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
                aria-label="Chat with assistant"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                <span>Chat</span>
              </Link>
              
              <Link 
                href="/report"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === '/report' 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
                aria-label="Report an incident"
              >
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span>Report</span>
              </Link>
              
              <Link 
                href="/status"
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === '/status' 
                      ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                }`}
                aria-label="Check incident status"
              >
                <ClipboardDocumentCheckIcon className="w-4 h-4" />
                <span>Status</span>
              </Link>
              
                {/* Staff Dashboard - Only show for staff users */}
              {user?.role?.name === 'staff' && (
                <Link 
                  href="/staff"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    pathname === '/staff' 
                        ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm' 
                        : 'text-blue-100 hover:text-white hover:bg-white/10 backdrop-blur-sm'
                  }`}
                  aria-label="Staff dashboard"
                >
                  <Cog6ToothIcon className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>
              )}
            </div>

              {/* User Info & Notifications */}
              {user ? (
                <div className="flex items-center gap-2">
                  {/* Notifications */}
                  <NotificationsDropdown
                    notifications={notifications}
                    isOpen={showNotifications}
                    onToggle={() => setShowNotifications(!showNotifications)}
                    onClose={() => setShowNotifications(false)}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onDeleteNotification={deleteNotification}
                    onNotificationClick={handleNotificationClick}
                  />

                  {/* User Info */}
                  <div className="hidden lg:flex items-center gap-3 px-3 py-2 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">
                        {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{user.full_name}</div>
                      <div className="text-xs text-blue-200 capitalize">{user.role?.name || 'User'}</div>
                    </div>
            </div>

                <button
                  onClick={logout}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-200 backdrop-blur-sm font-medium text-sm shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white rounded-xl transition-all duration-200 font-medium text-sm shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-300"
                  aria-label="Login to CitizenNavigator"
              >
                Login
              </button>
            )}

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="text-blue-100 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                  aria-label="Toggle mobile menu"
                >
                  {showMobileMenu ? (
                    <XMarkIcon className="w-6 h-6" />
                  ) : (
                    <Bars3Icon className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="md:hidden bg-gradient-to-r from-blue-800 to-indigo-800 border-t border-blue-700/50 shadow-2xl backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              <Link 
                href="/"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === '/' 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              
              <Link 
                href="/chat"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === '/chat' 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Chat Assistant</span>
              </Link>
              
              <Link 
                href="/report"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === '/report' 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                <span>Report Issue</span>
              </Link>
              
              <Link 
                href="/status"
                onClick={() => setShowMobileMenu(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  pathname === '/status' 
                    ? 'bg-white/20 text-white shadow-lg' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                <ClipboardDocumentCheckIcon className="w-5 h-5" />
                <span>Check Status</span>
              </Link>
              
              {/* Staff Dashboard Mobile - Only show for staff users */}
              {user?.role?.name === 'staff' && (
                <Link 
                  href="/staff"
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    pathname === '/staff' 
                      ? 'bg-white/20 text-white shadow-lg' 
                      : 'text-blue-100 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                  <span>Staff Dashboard</span>
                </Link>
              )}

              {/* Mobile User Info */}
              {user && (
                <div className="mt-4 pt-4 border-t border-blue-700/50">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-bold text-white">
                        {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{user.full_name}</div>
                      <div className="text-xs text-blue-200 capitalize">{user.role?.name || 'User'}</div>
                    </div>
                    {unreadCount > 0 && (
                      <div className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <main className="container mx-auto p-6" role="main">
        {children}
      </main>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}