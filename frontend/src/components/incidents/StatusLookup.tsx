'use client'
import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlayIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface IncidentStatus {
  incident_id: string
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  last_update: string
  title: string
  category: string
  location: string
  created_date: string
  history: {
    timestamp: string
    status: string
    note: string
    actor: string
  }[]
}

export default function StatusLookup() {
  const [referenceId, setReferenceId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [incidentData, setIncidentData] = useState<IncidentStatus | null>(null)
  const [error, setError] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'text-blue-600 bg-blue-100'
      case 'IN_PROGRESS': return 'text-orange-600 bg-orange-100'
      case 'RESOLVED': return 'text-green-600 bg-green-100'
      case 'CLOSED': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW': return <ClockIcon className="w-4 h-4" />
      case 'IN_PROGRESS': return <PlayIcon className="w-4 h-4" />
      case 'RESOLVED': return <CheckCircleIcon className="w-4 h-4" />
      case 'CLOSED': return <DocumentTextIcon className="w-4 h-4" />
      default: return <ExclamationCircleIcon className="w-4 h-4" />
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!referenceId.trim()) {
      setError('Please enter a reference ID')
      return
    }

    setIsSearching(true)
    setError('')
    setIncidentData(null)

    try {
      // Development mode - simulate API response
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Mock incident data
        if (referenceId.toUpperCase().startsWith('INC-')) {
          const mockData: IncidentStatus = {
            incident_id: referenceId.toUpperCase(),
            status: Math.random() > 0.5 ? 'IN_PROGRESS' : 'RESOLVED',
            last_update: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            title: 'Broken Streetlight on Moi Avenue',
            category: 'streetlight',
            location: 'Moi Avenue, near KCB Bank',
            created_date: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
            history: [
              {
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'NEW',
                note: 'Incident reported and assigned to Infrastructure Department',
                actor: 'System'
              },
              {
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'IN_PROGRESS',
                note: 'Maintenance crew dispatched to assess the issue',
                actor: 'Jane Mwangi - Infrastructure'
              }
            ]
          }
          setIncidentData(mockData)
        } else {
          setError('Incident not found. Please check your reference ID and try again.')
        }
        return
      }

      // Production API call
      const response = await fetch(`/api/incidents/${referenceId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setIncidentData(data)
      } else if (response.status === 404) {
        setError('Incident not found. Please check your reference ID and try again.')
      } else {
        setError('Error retrieving incident status. Please try again.')
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6">
      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MagnifyingGlassIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Check Incident Status</h1>
            <p className="text-sm sm:text-base text-gray-600">Track the progress of your reported incident</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value.toUpperCase())}
              placeholder="Enter reference ID (e.g., INC-123456)"
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              disabled={isSearching}
            />
          </div>
          <button
            type="submit"
            disabled={isSearching || !referenceId.trim()}
            className="w-full sm:w-auto px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Incident Details */}
      {incidentData && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {incidentData.title}
              </h2>
              <p className="text-gray-600">ID: {incidentData.incident_id}</p>
            </div>
            
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm ${getStatusColor(incidentData.status)}`}>
              {getStatusIcon(incidentData.status)}
              {incidentData.status.replace('_', ' ')}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Category</h3>
              <p className="text-gray-600 capitalize">{incidentData.category.replace('_', ' ')}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-600">{incidentData.location}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
              <p className="text-gray-600">{formatDate(incidentData.created_date)}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Last Updated</h3>
              <p className="text-gray-600">{formatDate(incidentData.last_update)}</p>
            </div>
          </div>

          {/* Status History */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Status History</h3>
            <div className="space-y-4">
              {incidentData.history.map((entry, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(entry.status)}`}>
                    {getStatusIcon(entry.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                      <span className="font-medium text-gray-900 capitalize">
                        {entry.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{entry.note}</p>
                    <p className="text-xs text-gray-500 mt-1">Updated by: {entry.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setReferenceId('')
                setIncidentData(null)
                setError('')
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Search Another
            </button>
            <button
              onClick={() => window.location.href = '/report'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Report New Issue
            </button>
          </div>
        </div>
      )}
    </div>
  )
}