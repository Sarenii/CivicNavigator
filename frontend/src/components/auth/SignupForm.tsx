// components/auth/SignupForm.tsx

'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import { useApi } from '@/hooks/useApi'
import ApiService from '../../../handler/ApiService'
import { toast } from 'sonner'
import { AuthResponse } from '../../../types'
import Cookies from 'js-cookie'


interface SignupFormProps {
  onSwitchToLogin: () => void
  onClose: () => void
}

export default function SignupForm({ onSwitchToLogin, onClose }: SignupFormProps) {
  const { login } = useAuth()
  const { useAddItem: registerApi } = useApi<any, AuthResponse>(ApiService.REGISTRATION_URL)
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    role: 'resident' as 'resident' | 'staff'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      toast.error('Password must be at least 6 characters')
      return
    }

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('First name and last name are required')
      toast.error('First name and last name are required')
      return
    }

    setIsLoading(true)

    try {
      // Prepare data for API (match Django's actual User model)
      const registrationData: any = {
        // No username field - your model uses email as USERNAME_FIELD
        email: formData.email.trim(),
        password1: formData.password,
        password2: formData.confirmPassword,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim() || "",
        role: formData.role
      }

      // Only add location fields if user is staff (since model allows blank=True)
      if (formData.role === 'staff') {
        registrationData.employee_id = "TEMP_ID" // Will be updated later
        registrationData.department = "General"
        registrationData.ward = ""
        registrationData.constituency = ""
        registrationData.county = "Nairobi"
      }

      console.log('Registration data being sent:', registrationData) // Debug log

      // Only add these fields for staff users
      if (formData.role === 'staff') {
        registrationData.ward = "Unknown"
        registrationData.constituency = "Unknown"
        registrationData.county = "Nairobi"
        registrationData.employee_id = "TEMP_ID"
        registrationData.department = "General"
      }

      registerApi.mutate({
        item: registrationData as any,
      }, {
        onSuccess: (data: AuthResponse) => {
          if (data.access && data.refresh) {
            // Store tokens and auto-login
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
            
            toast.success('Registration successful! Welcome to CitizenNavigator.')
            onClose()
          } else {
            // Email verification required
            toast.success('Registration successful! Please check your email to verify your account.')
            onSwitchToLogin()
          }
        },
        onError: (error: any) => {
          const errorMessage = 
            error.response?.data?.email?.[0] ||
            error.response?.data?.password?.[0] ||
            error.response?.data?.first_name?.[0] ||
            error.response?.data?.last_name?.[0] ||
            error.response?.data?.phone_number?.[0] ||
            error.response?.data?.non_field_errors?.[0] ||
            'Registration failed'
          
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="First name"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            required
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Last name"
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="signup-email"
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
        <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number (Optional)
        </label>
        <input
          id="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          placeholder="e.g., +254712345678"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Account Type
        </label>
        <select
          id="role"
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

      <div>
        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Create a password (min 6 characters)"
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
        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Confirm your password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg" role="alert">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:bg-green-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-700 text-sm underline"
        >
          Already have an account? Login
        </button>
      </div>
    </form>
  )
}