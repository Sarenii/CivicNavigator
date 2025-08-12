// components/staff/IncidentTable.tsx

'use client'
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline'
import type { StaffIncident } from '../../../types'

interface IncidentTableProps {
  incidents: StaffIncident[]
  isLoading: boolean
  onViewIncident: (incident: StaffIncident) => void
  onUpdateIncident: (incident: StaffIncident) => void
  page: number
  setPage: (page: number) => void
  totalCount: number
}

export default function IncidentTable({ 
  incidents, 
  isLoading, 
  onViewIncident, 
  onUpdateIncident,
  page,
  setPage,
  totalCount
}: IncidentTableProps) {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'NEW': return 'bg-blue-50 text-blue-700'
      case 'IN_PROGRESS': return 'bg-orange-50 text-orange-700'
      case 'RESOLVED': return 'bg-green-50 text-green-700'
      case 'CLOSED': return 'bg-gray-50 text-gray-700'
      default: return 'bg-gray-50 text-gray-700'
    }
  }

  if (isLoading) {
    return <div className="p-12 text-center">Loading incidents...</div>
  }

  if (incidents.length === 0) {
    return <div className="p-12 text-center">No incidents match your current filter criteria.</div>
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Incident</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
              <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Assigned</th>
              <th className="px-2 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {incidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="text-sm font-semibold text-gray-900">{incident.title}</div>
                  <div className="text-xs text-gray-500">{incident.incident_id}</div>
                </td>
                <td className="px-3 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </td>
                <td className="px-3 py-4 text-sm text-gray-700">{incident.location_description}</td>
                <td className="px-3 py-4 text-sm text-gray-700">{incident.assigned_to_name || 'Unassigned'}</td>
                <td className="px-2 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => onViewIncident(incident)} className="p-1 rounded-lg hover:bg-blue-50">
                      <EyeIcon className="w-4 h-4 text-gray-400" />
                    </button>
                    <button onClick={() => onUpdateIncident(incident)} className="p-1 rounded-lg hover:bg-green-50">
                      <PencilIcon className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="bg-white border-t p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page <span className="font-semibold">{page}</span> of <span className="font-semibold">{totalPages}</span>
            </div>
            <div className="flex gap-2">
                <button 
                  onClick={() => setPage(page - 1)} 
                  disabled={page === 1} 
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setPage(page + 1)} 
                  disabled={page === totalPages} 
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
            </div>
        </div>
      )}
    </div>
  )
}