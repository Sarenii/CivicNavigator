'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/hooks/useApi'
import { INCIDENTS_URL, INCIDENT_CATEGORIES_URL } from '../../../handler/apiConfig'
import { handleApiError } from '@/hooks/useApiErrorHandler'
import { toast } from 'sonner'
import type { IncidentResponse } from '../../../types'
import {
  PhotoIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  DocumentTextIcon,
  UserIcon,
  EnvelopeIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface ApiCategory {
  id: string;
  name: string;
  icon?: string;
}

interface IncidentFormData {
  title: string
  description: string
  category: string
  location: string
  contact: string
  photo?: File | null
}

export default function IncidentForm() {
  const { user } = useAuth()
  
  const { useAddItem: createIncident } = useApi<any, IncidentResponse>(INCIDENTS_URL)
  const { useFetchData } = useApi<ApiCategory, any>(INCIDENT_CATEGORIES_URL)
  const { data: categoriesData, isLoading: isLoadingCategories } = useFetchData(1, { page_size: 100 });
  
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [formData, setFormData] = useState<IncidentFormData>({
    title: '',
    description: '',
    category: '',
    location: '',
    contact: user?.email || ''
  })
  const [formErrors, setFormErrors] = useState<Partial<IncidentFormData>>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<IncidentResponse | null>(null)

  useEffect(() => {
    if (categoriesData?.results) {
      const categoryIcons: { [key: string]: string } = {
        'Street Lighting': '💡',
        'Waste Collection': '🗑️',
        'Road Maintenance': '🚧',
        'Water & Sewerage': '💧',
        'Noise Complaint': '🔊',
        'Parking Issues': '🚗',
        'Other': '📝'
      };
      const mappedCategories = categoriesData.results.map(cat => ({
        ...cat,
        icon: categoryIcons[cat.name] || '📝'
      }));
      setCategories(mappedCategories);
    }
  }, [categoriesData]);

  const validateForm = () => {
    const newErrors: Partial<IncidentFormData> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.contact.trim()) newErrors.contact = 'Contact information is required'
    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be smaller than 5MB')
        return
      }
      setFormData({ ...formData, photo: file })
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setFormData({ ...formData, photo: null })
    setPhotoPreview(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      toast.error('Please fill in all required fields.')
      return
    }
    
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('category', formData.category)
    formDataToSend.append('location_description', formData.location)
    formDataToSend.append('reporter_email', formData.contact)
    
    if (user) {
      formDataToSend.append('reporter_name', user.full_name)
    }
    
    if (formData.photo) {
      formDataToSend.append('uploaded_photos', formData.photo)
    }
    
    createIncident.mutate({ item: formDataToSend }, {
      onSuccess: (data) => {
        toast.success('Incident reported successfully!')
        setSuccessData(data)
      },
      onError: (error) => {
        handleApiError(error, 'Failed to submit incident. Please try again.')
      }
    })
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
    setSuccessData(null)
    setFormErrors({})
  }

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-xl p-8 text-center border border-green-200">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Report Submitted!</h2>
          <p className="text-gray-700 mt-2 mb-6 text-lg">Thank you for reporting this issue. We'll review it shortly.</p>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100 mb-8">
            <p className="text-sm font-semibold text-gray-600 mb-1">Reference ID</p>
            <p className="text-3xl font-mono font-bold text-green-700 tracking-wider">{successData.incident_id}</p>
            <p className="text-gray-600 mt-3">Please save this reference number to track your report status.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={resetForm} 
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <DocumentTextIcon className="w-5 h-5" />
              <span>Report Another</span>
            </button>
            <button 
              onClick={() => window.location.href = '/status'} 
              className="px-6 py-3 bg-white border-2 border-green-500 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-all flex items-center justify-center gap-2"
            >
              <MapPinIcon className="w-5 h-5" />
              <span>Check Status</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ExclamationTriangleIcon className="w-8 h-8" />
            Report an Incident
          </h1>
          <p className="text-blue-100 mt-2">Help us improve our community by reporting issues</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-blue-600" />
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium ${formErrors.category ? 'border-red-500' : 'border-gray-300'}`}
              disabled={createIncident.isPending || isLoadingCategories}
            >
              <option value="" className="text-gray-500">{isLoadingCategories ? 'Loading categories...' : 'Select incident category'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="text-gray-900">
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {formErrors.category && <p className="text-red-600 text-sm mt-1 font-medium">{formErrors.category}</p>}
          </div>
          
          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <MapPinIcon className="w-4 h-4 text-blue-600" />
              Location <span className="text-red-500">*</span>
            </label>
            <input
              id="location"
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium ${formErrors.location ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Near Juja City Mall, on the main road"
              disabled={createIncident.isPending}
            />
            {formErrors.location && <p className="text-red-600 text-sm mt-1 font-medium">{formErrors.location}</p>}
          </div>
          
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4 text-blue-600" />
              Title <span className="text-red-500">*</span>
            </label>
            <input 
              id="title" 
              type="text" 
              required 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Brief description of the issue" 
              disabled={createIncident.isPending} 
            />
            {formErrors.title && <p className="text-red-600 text-sm mt-1 font-medium">{formErrors.title}</p>}
          </div>
          
          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <DocumentTextIcon className="w-4 h-4 text-blue-600" />
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              id="description" 
              required 
              rows={4} 
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium resize-none ${formErrors.description ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="Provide as much detail as possible..." 
              disabled={createIncident.isPending} 
            />
            {formErrors.description && <p className="text-red-600 text-sm mt-1 font-medium">{formErrors.description}</p>}
          </div>
          
          {/* Contact Field */}
          <div>
            <label htmlFor="contact" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <EnvelopeIcon className="w-4 h-4 text-blue-600" />
              Your Contact Email <span className="text-red-500">*</span>
            </label>
            <input 
              id="contact" 
              type="email" 
              required 
              value={formData.contact} 
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })} 
              className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium ${formErrors.contact ? 'border-red-500' : 'border-gray-300'}`} 
              placeholder="we'll send updates to this email" 
              disabled={createIncident.isPending} 
            />
            {formErrors.contact && <p className="text-red-600 text-sm mt-1 font-medium">{formErrors.contact}</p>}
          </div>
          
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
              <PhotoIcon className="w-4 h-4 text-blue-600" />
              Photo (Optional)
            </label>
            {!photoPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors">
                <PhotoIcon className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium"><span className="text-blue-600">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={createIncident.isPending} />
              </label>
            ) : (
              <div className="relative">
                <img src={photoPreview} alt="Preview" className="w-full h-56 object-cover rounded-xl border-2 border-gray-200" />
                <button 
                  type="button" 
                  onClick={removePhoto} 
                  className="absolute top-3 right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                  disabled={createIncident.isPending}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={createIncident.isPending || isLoadingCategories}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {createIncident.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  Submit Incident Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}