// components/staff/IncidentList.tsx
'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { INCIDENTS_URL } from '../../../handler/apiConfig'
import { handleApiError } from '@/hooks/useApiErrorHandler'
import { toast } from 'sonner'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PlayIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Incident {
  id: string;
  incident_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category_name: string;
  subcategory_name?: string;
  created_by_name: string;
  assigned_to_name?: string;
  location_description: string;
  location_display?: string;
  age_in_hours: number;
  is_overdue: boolean;
  sla_due_date: string;
  created_at: string;
  updated_at: string;
}

export default function IncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<Incident[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [priorityFilter, setPriorityFilter] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  
  const { useFetchData } = useApi<Incident, any>(INCIDENTS_URL)
  const { data: incidentsData, error } = useFetchData(1, { page_size: 100 })

  useEffect(() => {
    if (incidentsData?.results) {
      setIncidents(incidentsData.results)
      setFilteredIncidents(incidentsData.results)
      setIsLoading(false)
    }
  }, [incidentsData])

  useEffect(() => {
    if (error) {
      handleApiError(error, 'Failed to retrieve incidents.')
      setIsLoading(false)
    }
  }, [error])

  useEffect(() => {
    let result = incidents
    
    if (searchTerm) {
      result = result.filter(incident => 
        incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.incident_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    if (statusFilter) {
      result = result.filter(incident => incident.status === statusFilter)
    }
    
    if (priorityFilter) {
      result = result.filter(incident => incident.priority === priorityFilter)
    }
    
    setFilteredIncidents(result)
  }, [incidents, searchTerm, statusFilter, priorityFilter])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-orange-100 text-orange-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'acknowledged': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new': return <ClockIcon className="w-4 h-4" />
      case 'in_progress': return <PlayIcon className="w-4 h-4" />
      case 'resolved': return <CheckCircleIcon className="w-4 h-4" />
      case 'closed': return <DocumentTextIcon className="w-4 h-4" />
      case 'acknowledged': return <ExclamationCircleIcon className="w-4 h-4" />
      default: return <ExclamationCircleIcon className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setPriorityFilter('')
  }

  const handleViewDetails = (incidentId: string) => {
    // Navigate to incident details page
    window.location.href = `/incidents/${incidentId}`
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Incidents</h1>
            <p className="text-gray-600 mt-1">Manage and track reported incidents</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-800 font-medium">
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="acknowledged">Acknowledged</option>
            </select>
          </div>
          
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        {(searchTerm || statusFilter || priorityFilter) && (
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredIncidents.length} of {incidents.length} incidents
            </p>
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Incidents List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.length > 0 ? (
              filteredIncidents.map((incident) => (
                <div 
                  key={incident.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-gray-900">{incident.title}</h3>
                        <span className="text-sm font-medium text-gray-500">{incident.incident_id}</span>
                        {incident.is_overdue && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                            Overdue
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">{incident.description}</p>
                    </div>
                    <button 
                      onClick={() => handleViewDetails(incident.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Status</p>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium ${getStatusColor(incident.status)}`}>
                        {getStatusIcon(incident.status)}
                        <span className="capitalize">{incident.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">Priority</p>
                      <span className={`inline-block px-2.5 py-1 rounded-full font-medium capitalize ${getPriorityColor(incident.priority)}`}>
                        {incident.priority}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">Category</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {incident.category_name}
                        {incident.subcategory_name && (
                          <span className="text-gray-600 font-normal"> / {incident.subcategory_name}</span>
                        )}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">Location</p>
                      <p className="font-medium text-gray-900 truncate">
                        {incident.location_description || incident.location_display || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Reported By</p>
                      <p className="font-medium text-gray-900">{incident.created_by_name}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">Assigned To</p>
                      <p className="font-medium text-gray-900">
                        {incident.assigned_to_name || <span className="text-gray-500">Unassigned</span>}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">Created</p>
                      <p className="font-medium text-gray-900">{formatDate(incident.created_at)}</p>
                    </div>
                    
                    <div>
                      <p className="text-gray-500 mb-1">Last Updated</p>
                      <p className="font-medium text-gray-900">{formatDate(incident.updated_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ExclamationCircleIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No incidents found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}