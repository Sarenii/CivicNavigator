'use client'
import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { INCIDENTS_URL } from '../../../handler/apiConfig'
import { handleApiError } from '@/hooks/useApiErrorHandler'
import { toast } from 'sonner'
import type { IncidentDetail } from '../../../types'
import { 
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function StatusLookup() {
  const [referenceId, setReferenceId] = useState('')
  const [searchParams, setSearchParams] = useState<Record<string, string> | null>(null)

  // --- API Hook ---
  const { useFetchData } = useApi<IncidentDetail, any>(INCIDENTS_URL)
  const { 
    data: searchResult, 
    isLoading: isSearching, 
    error,
    isSuccess // Flag from react-query to know when a fetch is successful
  } = useFetchData(1, searchParams || {});

  // --- Derived State ---
  const incidentData = searchResult?.results?.[0] || null;

  // --- Effects ---
  // This effect handles the "not found" toast message with a clear explanation.
  useEffect(() => {
    if (isSuccess && searchParams && (!searchResult?.results || searchResult.results.length === 0)) {
      // CORRECTED: Provide a more descriptive error message to the user.
      toast.error('Incident Not Found', {
        description: 'Please check the reference ID. Note: you can only look up incidents that you have reported.',
      });
    }
  }, [isSuccess, searchResult, searchParams]);
  
  // This effect handles API errors.
  useEffect(() => {
    if (error) {
      handleApiError(error, 'Failed to retrieve incident status.')
      setSearchParams(null) // Clear search on error
    }
  }, [error])

  // --- Handlers ---
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!referenceId.trim()) {
      toast.warning('Please enter a reference ID.')
      return
    }
    setSearchParams({ search: referenceId.trim() })
  }

  const resetSearch = () => {
    setReferenceId('')
    setSearchParams(null)
  }

  // --- Helper Functions ---
  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW': return 'text-blue-600 bg-blue-100'
      case 'IN_PROGRESS': return 'text-orange-600 bg-orange-100'
      case 'RESOLVED': return 'text-green-700 bg-green-100'
      case 'CLOSED': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW': return <ClockIcon className="w-4 h-4" />
      case 'IN_PROGRESS': return <PlayIcon className="w-4 h-4" />
      case 'RESOLVED': return <CheckCircleIcon className="w-4 h-4" />
      case 'CLOSED': return <DocumentTextIcon className="w-4 h-4" />
      default: return <ExclamationCircleIcon className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  }

  // --- Render Logic ---
  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Check Incident Status</h1>
            <p className="text-sm text-gray-600">Track the progress of your reported incident</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={referenceId}
            onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
            placeholder="Enter reference ID (e.g., INC-123456)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !referenceId.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Loading Skeleton */}
      {isSearching && (
        <div className="bg-white rounded-xl shadow-sm border p-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      )}

      {/* Incident Details */}
      {incidentData && !isSearching && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{incidentData.title}</h2>
              <p className="text-gray-600">ID: {incidentData.incident_id}</p>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${getStatusColor(incidentData.status)}`}>
              {getStatusIcon(incidentData.status)}
              {incidentData.status.replace('_', ' ').toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
              <p className="text-gray-600 capitalize">{incidentData.category_name?.replace('_', ' ') || 'N/A'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{incidentData.location_description}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Reported On</h3>
              <p className="text-gray-600">{formatDate(incidentData.created_at)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Last Updated</h3>
              <p className="text-gray-600">{formatDate(incidentData.updated_at)}</p>
            </div>
          </div>

          {incidentData.history && incidentData.history.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Status History</h3>
              <div className="space-y-4">
                {incidentData.history.map((entry, index) => (
                  <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(entry.status)}`}>
                      {getStatusIcon(entry.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-gray-900 capitalize">{entry.status.replace('_', ' ')}</span>
                        <span className="text-sm text-gray-700">{formatDate(entry.timestamp)}</span>
                      </div>
                      <p className="text-gray-900 text-sm">{entry.note}</p>
                      <p className="text-xs text-gray-700 mt-1">By: {entry.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row gap-3">
            <button onClick={resetSearch} className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50">
              Search Another
            </button>
            <button onClick={() => window.location.href = '/report'} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Report New Issue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
