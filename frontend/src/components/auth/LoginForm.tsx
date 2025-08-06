// components/auth/LoginForm.tsx

'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useApi } from '@/hooks/useApi'
import ApiService from '../../../handler/ApiService'
import { toast } from 'sonner'
import { AuthResponse } from '../../../types'
import Cookies from 'js-cookie'


interface LoginFormProps {
  onSwitchToSignup: () => void
  onClose: () => void
}

export default function LoginForm({ onSwitchToSignup, onClose }: LoginFormProps) {
  const { login } = useAuth()
  const { useAddItem: loginApi } = useApi<any, AuthResponse>(ApiService.LOGIN_URL)
 
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'resident' as 'resident' | 'staff'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      loginApi.mutate({
        item: formData as any,
      }, {
        onSuccess: (data: AuthResponse) => {
          // Store tokens in cookies (your api.tsx interceptors will handle the rest)
          Cookies.set('accessToken', data.access, { 
            expires: 1, 
            secure: true, 
            sameSite: 'Strict' 
          })
          Cookies.set('refreshToken', data.refresh, { 
            expires: 7, 
            secure: true, 
            sameSite: 'Strict' 
          })
          
          // Update auth context
          login({
            id: data.user.id.toString(),
            name: `${data.user.first_name} ${data.user.last_name}`,
            email: data.user.email,
            role: data.user.role.name as 'resident' | 'staff'
          })
          
          toast.success('Login successful')
          onClose()
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.non_field_errors?.[0] || 
                              error.response?.data?.detail || 
                              'Login failed'
          setError(errorMessage)
          toast.error(errorMessage)
        }
      })
    } catch (err) {
      setError('Network error. Please try again.')
      toast.error('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="Enter your email"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="login-role" className="block text-sm font-medium text-gray-700 mb-1">
          Login As
        </label>
        <select
          id="login-role"
          required
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value as 'resident' | 'staff' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          disabled={isLoading}
        >
          <option value="resident">Resident</option>
          <option value="staff">Municipal Staff</option>
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-blue-600 hover:text-blue-700 text-sm underline"
        >
          Don't have an account? Sign up
        </button>
      </div>
    </form>
  )
}