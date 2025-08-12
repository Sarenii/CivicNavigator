// components/staff/StaffDashboard.tsx

'use client'
import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ClipboardDocumentListIcon, 
  BookOpenIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import IncidentManagement from './IncidentManagement'
import KBManagement from './kb/KBManagement' 


type TabType = 'incidents' | 'knowledge-base' | 'analytics' | 'settings'

export default function StaffDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('incidents')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Only staff members can access this dashboard
  if (!user || user.role?.name !== 'staff') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Access Denied   
        </h2>
        <p className="text-gray-600">
          You need staff access to view this page.
        </p>
      </div>
    )
  }

  const navigation = [
    {
      id: 'incidents' as TabType,
      name: 'Incidents',
      icon: ClipboardDocumentListIcon,
      description: 'Manage and track incidents',
      badge: '12' // Example badge
    },
    {
      id: 'knowledge-base' as TabType,
      name: 'Knowledge Base',
      icon: BookOpenIcon,
      description: 'Manage KB articles'
    },
    {
      id: 'analytics' as TabType,
      name: 'Analytics',
      icon: ChartBarIcon,
      description: 'View reports and metrics'
    },
    {
      id: 'settings' as TabType,
      name: 'Settings',
      icon: Cog6ToothIcon,
      description: 'System configuration'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'incidents':
        return <IncidentManagement />
      case 'knowledge-base':
        return <KBManagement />
      case 'analytics':
      case 'analytics':
        return (
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600">Track performance metrics and generate insights</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Analytics dashboard will be implemented here.
              </p>
            </div>
          </div>
        )
      case 'settings':
        return (
          <div className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-600">Configure system preferences and permissions</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Cog6ToothIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                System settings will be implemented here.
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                <HomeIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CitizenNavigator</h1>
                <p className="text-sm text-gray-500">Staff Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900 truncate">
                  {user.first_name}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  {user.role?.name || 'User'} • Online
                </p>
              </div>
              <BellIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Main Menu
            </p>
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSidebarOpen(false)
                  }}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
                    <div>
                      <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {item.name}
                      </p>
                      <p className={`text-sm ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-lg
                      ${isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-600'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 p-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigation.find(item => item.id === activeTab)?.name}
                </h2>
                <p className="text-gray-600">
                  {navigation.find(item => item.id === activeTab)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="h-full">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  )
}