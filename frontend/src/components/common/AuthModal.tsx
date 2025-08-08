'use client'
import { useState } from 'react'
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline'
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
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        // Close modal if clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      {/* Enhanced Background with Theme Matching */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 backdrop-blur-sm">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-30"></div>
        
        {/* Floating Elements - Matching Landing Page */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-cyan-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-indigo-200/40 rounded-full blur-lg animate-pulse delay-1500"></div>
        <div className="absolute bottom-20 right-1/3 w-16 h-16 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Modal Container - Enhanced with Theme and Better Responsiveness */}
      <div 
        className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl my-8"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl transform rotate-1 scale-105 opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-3xl transform -rotate-1 scale-110 opacity-40"></div>
        
        {/* Main Modal Content */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
          {/* Header with Enhanced Design */}
          <div className="relative p-4 sm:p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-blue-200/50 rounded-full blur-sm"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-200/50 rounded-full blur-sm"></div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                    {activeTab === 'login' ? 'Welcome Back' : 'Join CitizenNavigator'}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {activeTab === 'login' ? 'Sign in to continue' : 'Create your account'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Close authentication modal"
              >
                <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold transition-all duration-300 relative text-sm sm:text-base ${
                activeTab === 'login'
                  ? 'text-blue-600 bg-white shadow-sm border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <span className="relative z-10">Login</span>
              {activeTab === 'login' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-semibold transition-all duration-300 relative text-sm sm:text-base ${
                activeTab === 'signup'
                  ? 'text-green-700 bg-white shadow-sm border-b-2 border-green-700'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <span className="relative z-10">Sign Up</span>
              {activeTab === 'signup' && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-xl"></div>
              )}
            </button>
          </div>

          {/* Form Content with Enhanced Styling */}
          <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white to-blue-50/30">
            <div className="relative">
              {/* Subtle Background Pattern */}
              <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,white)] opacity-20"></div>
              
              {/* Form Container */}
              <div className="relative">
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

          {/* Enhanced Footer */}
          <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {activeTab === 'login' 
                  ? 'Secure authentication powered by CitizenNavigator'
                  : 'Join thousands of citizens using our platform'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Floating Stats Badge - Matching Landing Page */}
        <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-3 sm:p-4 border border-gray-100 hidden sm:block">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Secure & Private</div>
          </div>
        </div>
      </div>
    </div>
  )
}