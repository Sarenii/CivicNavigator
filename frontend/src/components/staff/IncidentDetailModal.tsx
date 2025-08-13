// components/staff/IncidentDetailModal.tsx

'use client'
import { useApi } from '@/hooks/useApi'
import { INCIDENTS_URL } from '../../../handler/apiConfig'
import type { StaffIncident, IncidentDetail } from '../../../types'
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'

interface IncidentDetailModalProps {
  incident: StaffIncident 
  onClose: () => void
  onSwitchToUpdate: () => void
}

export default function IncidentDetailModal({ incident, onClose, onSwitchToUpdate }: IncidentDetailModalProps) {
  const { useFetchById } = useApi<any, IncidentDetail>(INCIDENTS_URL);
  const { data: detailedIncident, isLoading, error } = useFetchById(incident.id);

  const displayIncident = detailedIncident || incident;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back to List</span>
        </button>
        <button onClick={onSwitchToUpdate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <PencilIcon className="w-4 h-4" />
          Update Incident
        </button>
      </div>

      {isLoading && <div className="p-8 text-center">Loading full details...</div>}
      {error && <div className="p-8 text-center text-red-500">Could not load details.</div>}
      
      {displayIncident && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h1 className="text-2xl font-bold">{displayIncident.title}</h1>
          <p className="text-gray-700">{displayIncident.incident_id}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Status</h3>
              <p>{displayIncident.status}</p>
            </div>
            <div>
              <h3 className="font-semibold">Priority</h3>
              <p>{displayIncident.priority}</p>
            </div>
            <div>
              <h3 className="font-semibold">Category</h3>
              <p>{displayIncident.category_name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Location</h3>
              <p>{displayIncident.location_description}</p>
            </div>
          </div>
          {/* You can add more detailed fields here from the `detailedIncident` object, e.g., history */}
        </div>
      )}
    </div>
  )
}