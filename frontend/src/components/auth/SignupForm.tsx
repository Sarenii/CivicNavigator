// components/auth/SignupForm.tsx

'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon, EyeSlashIcon, UserIcon } from '@heroicons/react/24/outline'
import { useApi } from '@/hooks/useApi'
import ApiService from '../../../handler/ApiService'
import { toast } from 'sonner'
import { AuthResponse } from '../../../types'
import Cookies from 'js-cookie'
import { extractAuthErrorMessage } from '@/components/utils/api'
import { USER_ROLES, ROLE_DISPLAY_NAMES } from '../../../types/user'

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
    password1: '',
    password2: '',
    phone_number: '',
    accountType: 'resident' as 'resident' | 'staff',
    // Staff-specific fields
    employee_id: '',
    department: '',
    ward: '',
    constituency: '',
    county: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side validation
    if (formData.password1 !== formData.password2) {
      setError('Passwords do not match')
      toast.error('Passwords do not match')
      return
    }

    if (formData.password1.length < 8) {
      setError('Password must be at least 8 characters')
      toast.error('Password must be at least 8 characters')
      return
    }

    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      setError('First name and last name are required')
      toast.error('First name and last name are required')
      return
    }

    // Staff-specific validation
    if (formData.accountType === 'staff') {
      if (!formData.employee_id.trim()) {
        setError('Employee ID is required for staff accounts')
        toast.error('Employee ID is required for staff accounts')
        return
      }
      if (!formData.department.trim()) {
        setError('Department is required for staff accounts')
        toast.error('Department is required for staff accounts')
        return
      }
    }

    setIsLoading(true)

    try {
      // Prepare data for API (match Django's CustomRegisterSerializer)
      const registrationData: any = {
        email: formData.email.trim(),
        password1: formData.password1,
        password2: formData.password2,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        phone_number: formData.phone_number.trim() || "",
      }

      // Add staff-specific fields if user is staff
      // Backend automatically assigns STAFF role if employee_id is provided
      if (formData.accountType === 'staff') {
        registrationData.employee_id = formData.employee_id.trim()
        registrationData.department = formData.department.trim()
        registrationData.ward = formData.ward.trim() || "Unknown"
        registrationData.constituency = formData.constituency.trim() || "Unknown"
        registrationData.county = formData.county.trim() || "Nairobi"
      }

      console.log('Registration data being sent:', registrationData) // Debug log

      registerApi.mutate({
        item: registrationData as any,
      }, {
        onSuccess: (data: AuthResponse) => {
          if (data.access && data.refresh) {
            // Store tokens and auto-login
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
            
            // Update auth context
            login(formData.email, formData.password1)
            
            const roleDisplay = formData.accountType === 'staff' 
              ? ROLE_DISPLAY_NAMES[USER_ROLES.STAFF] 
              : ROLE_DISPLAY_NAMES[USER_ROLES.RESIDENT]
            
            toast.success(`Registration successful! Welcome to CitizenNavigator as ${roleDisplay}.`)
            onClose()
          } else {
            // Email verification required
            toast.success('Registration successful! Please check your email to verify your account.')
            onSwitchToLogin()
          }
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
      {/* Name Fields - Enhanced */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="first_name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            First Name
          </label>
          <div className="relative">
            <input
              id="first_name"
              type="text"
              required
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
              placeholder="First name"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="last_name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Last Name
          </label>
          <div className="relative">
            <input
              id="last_name"
              type="text"
              required
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
              placeholder="Last name"
              disabled={isLoading}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Email Field - Enhanced */}
      <div className="space-y-1 sm:space-y-2">
        <label htmlFor="signup-email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            id="signup-email"
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

      {/* Phone Number Field - Enhanced */}
      <div className="space-y-1 sm:space-y-2">
        <label htmlFor="phone_number" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
          Phone Number <span className="text-gray-500 font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <input
            id="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            placeholder="e.g., +254712345678"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <div className="w-2 h-2 bg-gray-400 rounded-full opacity-60"></div>
          </div>
        </div>
      </div>

             {/* Account Type Selection - Enhanced */}
       <div className="space-y-1 sm:space-y-2">
         <label htmlFor="accountType" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
           Account Type
         </label>
         <div className="relative">
           <select
             id="accountType"
             required
             value={formData.accountType}
             onChange={(e) => setFormData({ ...formData, accountType: e.target.value as 'resident' | 'staff' })}
             className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-all duration-200 bg-white/80 backdrop-blur-sm appearance-none text-sm sm:text-base"
             disabled={isLoading}
           >
             <option value="resident">{ROLE_DISPLAY_NAMES[USER_ROLES.RESIDENT]}</option>
             <option value="staff">{ROLE_DISPLAY_NAMES[USER_ROLES.STAFF]}</option>
           </select>
           <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
             <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
           </div>
         </div>
         <p className="text-xs text-gray-500 mt-1">
           {formData.accountType === 'staff' 
             ? 'Staff accounts require employee ID and department information.'
             : 'Resident accounts are for general public users.'
           }
         </p>
       </div>

      {/* Staff-specific fields (only shown if accountType is staff) */}
      {formData.accountType === 'staff' && (
        <>
          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="employee_id" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Employee ID
            </label>
            <div className="relative">
              <input
                id="employee_id"
                type="text"
                required
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                placeholder="Enter your employee ID"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="department" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Department
            </label>
            <div className="relative">
              <input
                id="department"
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                placeholder="Enter your department"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="ward" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Ward
            </label>
            <div className="relative">
              <input
                id="ward"
                type="text"
                value={formData.ward}
                onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                placeholder="Enter your ward"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="constituency" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              Constituency
            </label>
            <div className="relative">
              <input
                id="constituency"
                type="text"
                value={formData.constituency}
                onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                placeholder="Enter your constituency"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <label htmlFor="county" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
              County
            </label>
            <div className="relative">
              <input
                id="county"
                type="text"
                value={formData.county}
                onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
                placeholder="Enter your county"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Password Fields - Enhanced */}
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="signup-password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              value={formData.password1}
              onChange={(e) => setFormData({ ...formData, password1: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
              placeholder="Create a password (min 8 characters)"
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

        <div className="space-y-1 sm:space-y-2">
          <label htmlFor="confirm-password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.password2}
              onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 transition-all duration-200 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
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
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-800 hover:to-emerald-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm sm:text-base"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </div>
        ) : (
          <span>Create Account</span>
        )}
      </button>

      {/* Switch to Login - Enhanced */}
      <div className="text-center pt-2 sm:pt-4">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium underline hover:no-underline transition-all duration-200"
        >
          Already have an account? Login
        </button>
      </div>
    </form>
  )
}