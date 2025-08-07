'use client'
import { useAuth } from '@/contexts/AuthContext'
import { ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: 'resident' | 'staff'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Login Required
        </h2>
        <p className="text-gray-600 mb-4">
          Please log in to access this feature.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Homepage
        </button>

      </div>
    )
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Access Denied
        </h2>
        <p className="text-gray-600 mb-4">
          You need {requiredRole} access to view this page.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Homepage
        </button>
      </div>
    )
  }

  return <>{children}</>
}