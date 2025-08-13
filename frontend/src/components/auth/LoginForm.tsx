// components/auth/LoginForm.tsx

'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useApi } from '@/hooks/useApi'
import ApiService from '../../../handler/ApiService'
import { toast } from 'sonner'
import { AuthResponse } from '../../../types'
import Cookies from 'js-cookie'
import { extractAuthErrorMessage } from '@/components/utils/api'
import { USER_ROLES, ROLE_DISPLAY_NAMES } from '../../../types/user'

interface LoginFormProps {
  onSwitchToSignup: () => void
  onClose: () => void
}

export default function LoginForm({ onSwitchToSignup, onClose }: LoginFormProps) {
  const { login } = useAuth()
  const { useAddItem: loginApi } = useApi<any, AuthResponse>(ApiService.LOGIN_URL)
 
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Development mode - quick test login
  const handleTestLogin = (testRole: 'resident' | 'staff') => {
    const mockUser = {
      id: '1',
      name: testRole === 'staff' ? 'John Staff' : 'Jane Resident',
      email: testRole === 'staff' ? 'staff@test.com' : 'resident@test.com',
      role: testRole
    }
    
    // Call login with email and password for the mock user
    login('test@example.com', 'password')
    const roleDisplay = testRole === 'staff' 
      ? ROLE_DISPLAY_NAMES[USER_ROLES.STAFF] 
      : ROLE_DISPLAY_NAMES[USER_ROLES.RESIDENT]
    toast.success(`Logged in as ${roleDisplay}`)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Development mode - use mock login if no email/password
      if (process.env.NODE_ENV === 'development' && (!formData.email || !formData.password)) {
        await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
        handleTestLogin('resident')
        return
      }

      loginApi.mutate({
        item: formData as any
      }, {
        onSuccess: (data: AuthResponse) => {
          // Store tokens in cookies
          Cookies.set('accessToken', data.access, { 
            expires: 1, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict' 
          })
          Cookies.set('refreshToken', data.refresh, { 
            expires: 7, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'Strict' 
          })
          
          // Update auth context with user data
          login(formData.email, formData.password)
          
          toast.success('Login successful')
          onClose()
        },
        onError: (error: any) => {
          // Extract actual backend error message
          const errorMessage = extractAuthErrorMessage(error)
          setError(errorMessage)
          toast.error(errorMessage)
        }
      })
    } catch (err) {
      const errorMessage = 'Network error. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Development Mode Quick Login - Enhanced */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
            <h4 className="text-xs sm:text-sm font-semibold text-yellow-800">Development Mode - Quick Login</h4>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => handleTestLogin('resident')}
              className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xs sm:text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Login as {ROLE_DISPLAY_NAMES[USER_ROLES.RESIDENT]}
            </button>
            <button
              type="button"
              onClick={() => handleTestLogin('staff')}
              className="flex-1 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-700 to-green-800 text-white rounded-xl text-xs sm:text-sm font-medium hover:from-green-800 hover:to-green-900 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Login as {ROLE_DISPLAY_NAMES[USER_ROLES.STAFF]}
            </button>
          </div>
          <p className="text-xs text-yellow-700 mt-2 text-center">Or fill the form below for real login</p>
        </div>
      )}

      {/* Email Field - Enhanced */}
      <div className="space-y-1 sm:space-y-2">
        <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            placeholder="Enter your email"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="w-2 h-2 bg-blue-500 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>

      {/* Password Field - Enhanced */}
      <div className="space-y-1 sm:space-y-2">
        <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1 sm:mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Error Display - Enhanced */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-3 sm:p-4" role="alert">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-700 text-xs sm:text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Submit Button - Enhanced */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-sm sm:text-base"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Signing in...</span>
          </div>
        ) : (
          <span>Sign In</span>
        )}
      </button>

      {/* Switch to Signup - Enhanced */}
      <div className="text-center pt-2 sm:pt-4">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium underline hover:no-underline transition-all duration-200"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  )
}