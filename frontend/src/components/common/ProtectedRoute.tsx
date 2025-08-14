'use client'
import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'
import { ExclamationTriangleIcon, LockClosedIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'resident' | 'staff'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <LockClosedIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
            <p className="text-blue-100">Please log in to access this feature</p>
          </div>
          
          <div className="p-6">
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100">
              <p className="text-blue-800 text-center">
                This area is for registered users only. Please sign in to continue.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.href = '/login'}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                <LockClosedIcon className="w-5 h-5" />
                <span>Sign In</span>
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Homepage</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (requiredRole && user.role?.name !== requiredRole) {
    // Create a friendly role name for display
    const roleDisplay = requiredRole === 'staff' ? 'Staff Member' : 'Resident'
    
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
            <p className="text-amber-100">This area requires special permissions</p>
          </div>
          
          <div className="p-6">
            <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-100">
              <p className="text-amber-800 text-center">
                You need <span className="font-bold">{roleDisplay}</span> access to view this page.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.location.href = '/'}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
              >
                <ArrowLeftIcon className="w-5 h-5" />
                <span>Go to Homepage</span>
              </button>
              
              {user.role?.name === 'resident' && requiredRole === 'staff' && (
                <button
                  onClick={() => window.location.href = '/staff/login'}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-amber-300 text-amber-700 font-semibold rounded-lg hover:bg-amber-50 transition-all"
                >
                  <LockClosedIcon className="w-5 h-5" />
                  <span>Staff Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}