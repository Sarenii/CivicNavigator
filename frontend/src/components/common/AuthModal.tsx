'use client'
import { useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import LoginForm from '../auth/LoginForm'
import SignupForm from '../auth/SignupForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login')

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {activeTab === 'login' ? 'Login' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded"
            aria-label="Close authentication modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
              activeTab === 'signup'
                ? 'text-green-700 border-b-2 border-green-700 bg-green-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <LoginForm 
              onSwitchToSignup={() => setActiveTab('signup')}
              onClose={onClose}
            />
          ) : (
            <SignupForm 
              onSwitchToLogin={() => setActiveTab('login')}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  )
}