// components/staff/IncidentTable.tsx

'use client'
import { useState } from 'react'
import { 
  EyeIcon, 
  PencilIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon, 
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import { StaffIncident, IncidentStatus, IncidentPriority } from '../../../types'


interface IncidentTableProps {
  incidents: StaffIncident[]
  isLoading: boolean
  onViewIncident: (incident: StaffIncident) => void
  onUpdateIncident: (incident: StaffIncident) => void
}

export default function IncidentTable({ 
  incidents, 
  isLoading, 
  onViewIncident, 
  onUpdateIncident 
}: IncidentTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case 'NEW': return <ClockIcon className="w-4 h-4 text-blue-600" />
      case 'IN_PROGRESS': return <ExclamationTriangleIcon className="w-4 h-4 text-orange-600" />
      case 'RESOLVED': return <CheckCircleIcon className="w-4 h-4 text-green-600" />
      case 'CLOSED': return <XCircleIcon className="w-4 h-4 text-gray-600" />
      default: return <ClockIcon className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'NEW': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'IN_PROGRESS': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'RESOLVED': return 'bg-green-50 text-green-700 border-green-200'
      case 'CLOSED': return 'bg-gray-50 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const getPriorityColor = (priority: IncidentPriority) => {
    switch (priority) {
      case 'LOW': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
      case 'HIGH': return 'bg-orange-50 text-orange-700 ring-orange-600/20'
      case 'URGENT': return 'bg-red-50 text-red-700 ring-red-600/20'
      default: return 'bg-gray-50 text-gray-700 ring-gray-600/20'
    }
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'streetlight': return '💡'
      case 'waste': return '🗑️'
      case 'road': return '🚧'
      case 'water': return '💧'
      case 'noise': return '🔊'
      case 'parking': return '🚗'
      default: return '📝'
    }
  }

  // Pagination
  const totalPages = Math.ceil(incidents.length / itemsPerPage)
  const paginatedIncidents = incidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading incidents...</h3>
        <p className="text-gray-500">Please wait while we fetch the latest incident data</p>
      </div>
    )
  }

  if (incidents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
          <ClockIcon className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No incidents found</h3>
        <p className="text-gray-500">No incidents match your current filter criteria</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-2/5">
                Incident
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                Status
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/5">
                Location
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/6">
                Assigned
              </th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {paginatedIncidents.map((incident, index) => (
              <tr 
                key={incident.id} 
                className="hover:bg-gray-50 transition-colors duration-150 group"
              >
                {/* Incident Details */}
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded shrink-0">
                        {incident.incident_id}
                      </span>
                      {incident.is_overdue && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 shrink-0">
                          ⏰ Overdue
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {incident.title}
                      </h4>
                      <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 flex-wrap">
                        <span className="text-sm">{getCategoryEmoji(incident.category)}</span>
                        <span className="truncate max-w-[80px]">{incident.category_display}</span>
                        <span>•</span>
                        <span className="truncate max-w-[60px]">{incident.reporter.name}</span>
                        <span>•</span>
                        <span className="shrink-0">
                          {incident.days_open}d old
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-3 py-4">
                  <div className="flex items-center gap-1">
                    {getStatusIcon(incident.status)}
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)} truncate max-w-[100px]`}>
                      {incident.status_display}
                    </span>
                  </div>
                </td>

                {/* Location */}
                <td className="px-3 py-4">
                  <div className="flex items-start gap-1">
                    <MapPinIcon className="w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]" title={incident.location.ward || 'Unknown Ward'}>
                        {incident.location.ward || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]" title={incident.location.text_description}>
                        {incident.location.text_description}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Assignment */}
                <td className="px-3 py-4">
                  <div className="flex items-center gap-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                      incident.assigned_to 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {incident.assigned_to 
                        ? incident.assigned_to.name.charAt(0).toUpperCase()
                        : <UserIcon className="w-3 h-3" />
                      }
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-[80px]" title={incident.assigned_to?.name || 'Unassigned'}>
                        {incident.assigned_to?.name || 'Unassigned'}
                      </div>
                      {incident.assigned_to && (
                        <div className="text-xs text-gray-500 truncate max-w-[80px]" title={incident.assigned_to.department}>
                          {incident.assigned_to.department}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-2 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onViewIncident(incident)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onUpdateIncident(incident)}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                      title="Update Incident"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-700">
              <span>Showing</span>
              <span className="font-semibold mx-1">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>
              <span>to</span>
              <span className="font-semibold mx-1">
                {Math.min(currentPage * itemsPerPage, incidents.length)}
              </span>
              <span>of</span>
              <span className="font-semibold mx-1">{incidents.length}</span>
              <span>results</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`inline-flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                        page === currentPage
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}