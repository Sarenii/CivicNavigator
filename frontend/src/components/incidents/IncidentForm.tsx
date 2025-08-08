'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  PhotoIcon, 
  MapPinIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface IncidentFormData {
  title: string
  description: string
  category: string
  location: string
  contact: string
  photo?: File | null
}

interface IncidentResponse {
  incident_id: string
  status: 'NEW'
  message: string
}

export default function IncidentForm() {
  const { user } = useAuth()
  const [formData, setFormData] = useState<IncidentFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    contact: user?.email || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<IncidentResponse | null>(null)
  const [errors, setErrors] = useState<Partial<IncidentFormData>>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const categories = [
    { value: 'streetlight', label: 'Street Lighting', icon: '💡' },
    { value: 'waste', label: 'Waste Collection', icon: '🗑️' },
    { value: 'road', label: 'Road Maintenance', icon: '🚧' },
    { value: 'water', label: 'Water & Sewerage', icon: '💧' },
    { value: 'noise', label: 'Noise Complaint', icon: '🔊' },
    { value: 'parking', label: 'Parking Issues', icon: '🚗' },
    { value: 'other', label: 'Other', icon: '📝' }
  ]

  const validateForm = () => {
    const newErrors: Partial<IncidentFormData> = {}

    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.contact.trim()) newErrors.contact = 'Contact information is required'
    
    // Email validation if contact looks like email
    if (formData.contact.includes('@') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact)) {
      newErrors.contact = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo must be smaller than 5MB')
        return
      }

      setFormData({ ...formData, photo: file })
      
      // Create preview
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setFormData({ ...formData, photo: null })
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      // Development mode - simulate API response
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const mockResponse: IncidentResponse = {
          incident_id: `INC-${Date.now().toString().slice(-6)}`,
          status: 'NEW',
          message: 'Your incident has been successfully reported and assigned to the appropriate department.'
        }
        
        setSubmitResult(mockResponse)
        return
      }

      // Production API call
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('contact', formData.contact)
      formDataToSend.append('user_id', user?.id || '')
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo)
      }

      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user?.id}`
        },
        body: formDataToSend
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitResult(result)
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to submit incident')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      location: '',
      contact: user?.email || ''
    })
    setPhotoPreview(null)
    setSubmitResult(null)
    setErrors({})
  }

  // Show success screen if incident was submitted
  if (submitResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8 text-green-700" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Incident Reported Successfully!
          </h2>
          
          <p className="text-gray-600 mb-6">
            {submitResult.message}
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">Reference ID</h3>
            <div className="text-2xl font-mono font-bold text-blue-700">
              {submitResult.incident_id}
            </div>
            <p className="text-sm text-blue-600 mt-2">
              Save this ID to check your incident status
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetForm}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Report Another Issue
            </button>
            <button
              onClick={() => window.location.href = '/status'}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Check Status
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Report Incident</h1>
            <p className="text-sm sm:text-base text-gray-600">Help us improve your community</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
              Incident Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-sm sm:text-base ${
                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Brief description of the issue"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">
              Category *
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${
                errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select incident category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Provide detailed information about the incident..."
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">
              Location *
            </label>
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="location"
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                  errors.location ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Street address, landmark, or coordinates"
                disabled={isSubmitting}
              />
            </div>
            {errors.location && (
              <p className="text-red-600 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact" className="block text-sm font-semibold text-gray-900 mb-2">
              Contact Information *
            </label>
            <input
              id="contact"
              type="text"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${
                errors.contact ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Email address or phone number"
              disabled={isSubmitting}
            />
            {errors.contact && (
              <p className="text-red-600 text-sm mt-1">{errors.contact}</p>
            )}
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Photo (Optional)
            </label>
            
            {!photoPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={isSubmitting}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Incident photo preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  disabled={isSubmitting}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Report...
                </div>
              ) : (
                'Submit Incident Report'
              )}
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Reporting Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about the location (street name, landmarks)</li>
            <li>• Include photos when possible for faster resolution</li>
            <li>• Provide accurate contact info for updates</li>
            <li>• You'll receive a reference ID to track progress</li>
          </ul>
        </div>
      </div>
    </div>
  )
}