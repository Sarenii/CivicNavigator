'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/hooks/useApi'
// CORRECTED: Using absolute path aliases for consistency and proper module resolution.
import { INCIDENTS_URL, INCIDENT_CATEGORIES_URL } from '../../../handler/apiConfig'
import { handleApiError } from '@/hooks/useApiErrorHandler'
import { toast } from 'sonner'
import type { IncidentResponse } from '../../../types'
import {
  PhotoIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

// This interface matches the data from your IncidentCategorySerializer
interface ApiCategory {
  id: string; // This is the UUID the backend needs
  name: string;
  icon?: string;
}

interface IncidentFormData {
  title: string
  description: string
  category: string // This will hold the selected category's UUID
  location: string
  contact: string
  photo?: File | null
}

export default function IncidentForm() {
  const { user } = useAuth()
  
  // --- API Hooks ---
  const { useAddItem: createIncident } = useApi<any, IncidentResponse>(INCIDENTS_URL)
  const { useFetchData } = useApi<ApiCategory, any>(INCIDENT_CATEGORIES_URL)
  const { data: categoriesData, isLoading: isLoadingCategories } = useFetchData(1, { page_size: 100 });

  // --- State ---
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

  // --- Effects ---
  // This effect runs when the categories are fetched from your API
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

  // --- Handlers ---
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
    
    // These fields match your IncidentCreateSerializer
    formDataToSend.append('title', formData.title)
    formDataToSend.append('description', formData.description)
    
    // **FIX 1: Send the category UUID, not its name.**
    formDataToSend.append('category', formData.category) 

    // **FIX 2: Send the location string under the 'location_description' key.**
    formDataToSend.append('location_description', formData.location) 
    
    // These fields are for reporter info, which your serializer also accepts
    formDataToSend.append('reporter_email', formData.contact)
    if (user) {
      formDataToSend.append('reporter_name', user.full_name)
    }

    // This field is for file uploads
    if (formData.photo) {
      // Your serializer expects 'uploaded_photos' for new images
      formDataToSend.append('uploaded_photos', formData.photo)
    }
    
    console.log("Submitting FormData to backend:", Object.fromEntries(formDataToSend.entries()));

    createIncident.mutate({ item: formDataToSend }, {
      onSuccess: (data) => {
        // DEBUGGING: Check the console to see the exact structure of the response from the backend.
        console.log("Data received on success:", data);
        
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

  // --- Render Logic ---
  if (successData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Report Submitted!</h2>
          <p className="text-gray-600 mt-2 mb-6">{successData.message}</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm font-semibold text-gray-600">Reference ID</p>
            <p className="text-2xl font-mono font-bold text-gray-800 tracking-wider">{successData.incident_id}</p>
          </div>
          <div className="mt-6 flex gap-4 justify-center">
            <button onClick={resetForm} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Report Another</button>
            <button onClick={() => window.location.href = '/status'} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Check Status</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Incident</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
            <select
              id="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg ${formErrors.category ? 'border-red-300' : 'border-gray-300'}`}
              disabled={createIncident.isPending || isLoadingCategories}
            >
              <option value="">{isLoadingCategories ? 'Loading categories...' : 'Select incident category'}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {formErrors.category && <p className="text-red-600 text-sm mt-1">{formErrors.category}</p>}
          </div>

          {/* Location Field */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-900 mb-2">Location Description *</label>
            <input
              id="location"
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg ${formErrors.location ? 'border-red-300' : 'border-gray-300'}`}
              placeholder="e.g., Near Juja City Mall, on the main road"
              disabled={createIncident.isPending}
            />
            {formErrors.location && <p className="text-red-600 text-sm mt-1">{formErrors.location}</p>}
          </div>
          
          {/* Other fields like Title, Description, Contact, Photo remain the same */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">Title *</label>
            <input id="title" type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={`w-full px-4 py-3 border rounded-lg ${formErrors.title ? 'border-red-300' : 'border-gray-300'}`} placeholder="Brief description of the issue" disabled={createIncident.isPending} />
            {formErrors.title && <p className="text-red-600 text-sm mt-1">{formErrors.title}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">Detailed Description *</label>
            <textarea id="description" required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={`w-full px-4 py-3 border rounded-lg resize-none ${formErrors.description ? 'border-red-300' : 'border-gray-300'}`} placeholder="Provide as much detail as possible..." disabled={createIncident.isPending} />
            {formErrors.description && <p className="text-red-600 text-sm mt-1">{formErrors.description}</p>}
          </div>
          <div>
            <label htmlFor="contact" className="block text-sm font-semibold text-gray-900 mb-2">Your Contact Email *</label>
            <input id="contact" type="email" required value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className={`w-full px-4 py-3 border rounded-lg ${formErrors.contact ? 'border-red-300' : 'border-gray-300'}`} placeholder="we'll send updates to this email" disabled={createIncident.isPending} />
            {formErrors.contact && <p className="text-red-600 text-sm mt-1">{formErrors.contact}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Photo (Optional)</label>
            {!photoPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600"><span className="font-semibold">Click to upload</span></p>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} disabled={createIncident.isPending} />
              </label>
            ) : (
              <div className="relative"><img src={photoPreview} alt="Preview" className="w-full h-48 object-cover rounded-lg" /><button type="button" onClick={removePhoto} className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full" disabled={createIncident.isPending}><XMarkIcon className="w-4 h-4" /></button></div>
            )}
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={createIncident.isPending || isLoadingCategories}
              className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {createIncident.isPending ? 'Submitting...' : 'Submit Incident Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
