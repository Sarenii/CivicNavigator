// components/staff/IncidentDetailModal.tsx

'use client'
import { 
  XMarkIcon, 
  PencilIcon, 
  MapPinIcon, 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  TagIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { StaffIncident, IncidentStatus } from '../../../types'
import { LockClosedIcon } from '@heroicons/react/24/solid'

interface IncidentDetailModalProps {
  incident: StaffIncident
  onClose: () => void
  onUpdate: () => void
}

export default function IncidentDetailModal({ incident, onClose, onUpdate }: IncidentDetailModalProps) {
  const getStatusIcon = (status: IncidentStatus) => {
    switch (status) {
      case 'NEW': return <ClockIcon className="w-4 h-4 text-blue-600" />
      case 'IN_PROGRESS': return <ExclamationTriangleIcon className="w-4 h-4 text-orange-600" />
      case 'RESOLVED': return <CheckCircleIcon className="w-4 h-4 text-green-700" />
      case 'CLOSED': return <CheckCircleIcon className="w-4 h-4 text-gray-600" />
      default: return <ClockIcon className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-50 text-green-700 border-green-200'
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'URGENT': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
             <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Back to Incident</span>
          </button>
        </div>
    
        <button
          onClick={onUpdate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
          Update Incident
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Card Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{incident.title}</h1>
              <p className="text-gray-600 mb-4">{incident.description}</p>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  {getStatusIcon(incident.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(incident.status)}`}>
                    {incident.status_display}
                  </span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(incident.priority)}`}>
                  {incident.priority_display} Priority
                </span>
                {incident.tags && incident.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <TagIcon className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-1 flex-wrap">
                      {incident.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">{incident.incident_id}</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-8">
          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Category & Department</h3>
                <div className="space-y-1">
                  <p className="text-gray-600">{incident.category_display}</p>
                  <p className="text-sm text-gray-500">{incident.department.name}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Reporter Contact</h3>
                <div className="text-gray-600 text-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    <span>{incident.reporter.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                    <span>{incident.reporter.email}</span>
                  </div>
                  {incident.reporter.phone && (
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400" />
                      <span>{incident.reporter.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Location Details</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{incident.location.ward}</p>
                      <p>{incident.location.text_description}</p>
                      <p className="text-xs text-gray-500">
                        {incident.location.constituency}, {incident.location.county}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Assignment</h3>
                <div className="text-gray-600 text-sm">
                  {incident.assigned_to ? (
                    <div className="space-y-1">
                      <p className="font-medium">{incident.assigned_to.name}</p>
                      <p>{incident.assigned_to.department}</p>
                      {incident.assigned_to.email && (
                        <p className="text-xs">{incident.assigned_to.email}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">Not assigned</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Timeline</h3>
                <div className="text-gray-600 text-sm space-y-1">
                  <p><span className="font-medium">Created:</span> {new Date(incident.created_at).toLocaleString()}</p>
                  <p><span className="font-medium">Updated:</span> {new Date(incident.updated_at).toLocaleString()}</p>
                  {incident.estimated_resolution && (
                    <p><span className="font-medium">Est. Resolution:</span> {new Date(incident.estimated_resolution).toLocaleString()}</p>
                  )}
                  {incident.actual_resolution && (
                    <p><span className="font-medium">Resolved:</span> {new Date(incident.actual_resolution).toLocaleString()}</p>
                  )}
                  <p><span className="font-medium">Days Open:</span> {incident.days_open}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incident.public_notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Public Notes
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">{incident.public_notes}</p>
                </div>
              </div>
            )}

            {incident.internal_notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ExclamationCircleIcon className="w-4 h-4" />
                  Internal Notes
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">{incident.internal_notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Resolution Notes */}
          {incident.resolution_notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-700" />
                Resolution Notes
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">{incident.resolution_notes}</p>
              </div>
            </div>
          )}

          {/* Activity History */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              Activity History
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {incident.history.map((entry) => (
                <div key={entry.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(entry.status as IncidentStatus)}`}>
                    {getStatusIcon(entry.status as IncidentStatus)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                      <span className="font-medium text-gray-900">{entry.status_display}</span>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                      {entry.is_public && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Public</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">{entry.notes}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Updated by: {entry.updated_by.name} ({entry.updated_by.role})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}