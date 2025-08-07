// components/staff/IncidentUpdateModal.tsx

'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ArrowLeftIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { StaffIncident, IncidentStatus, IncidentPriority, UpdateIncidentRequest } from '../../../types'

interface IncidentUpdateModalProps {
  incident: StaffIncident
  onClose: () => void
  onUpdate: (updatedIncident: StaffIncident) => void
}

export default function IncidentUpdateModal({ incident, onClose, onUpdate }: IncidentUpdateModalProps) {
  const { user } = useAuth()
  const [updating, setUpdating] = useState(false)
  const [updateData, setUpdateData] = useState<UpdateIncidentRequest>({
    notes: '',
    is_public_note: true
  })

  // Reusable classes for all inputs for a consistent, larger look
  const inputClasses = "block w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-base placeholder:text-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-600 focus:ring-2 focus:ring-blue-200";

  const availableStaff = [
    { id: '1', name: 'Mike Ochieng', department: 'Infrastructure' },
    { id: '2', name: 'Jane Mwangi', department: 'Sanitation' },
    { id: '3', name: 'Peter Kimani', department: 'Water Services' },
    { id: '4', name: 'Sarah Wanjiku', department: 'Transport' }
  ]

  const getStatusColor = (status: IncidentStatus) => {
    switch (status) {
      case 'NEW': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'IN_PROGRESS': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200'
      case 'CLOSED': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: IncidentPriority) => {
    switch (priority) {
      case 'LOW': return 'bg-green-50 text-green-700 border-green-200'
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200'
      case 'URGENT': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleUpdate = async () => {
    if (!updateData.notes?.trim()) return

    setUpdating(true)
    try {
      // Mock update - in real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const updatedIncident: StaffIncident = {
        ...incident,
        status: updateData.status || incident.status,
        status_display: updateData.status?.replace('_', ' ') || incident.status_display,
        priority: updateData.priority || incident.priority,
        priority_display: updateData.priority || incident.priority_display,
        assigned_to: updateData.assigned_to ? 
          availableStaff.find(s => s.id === updateData.assigned_to) : incident.assigned_to,
        assigned_to_name: updateData.assigned_to ?
          availableStaff.find(s => s.id === updateData.assigned_to)?.name : incident.assigned_to_name,
        updated_at: new Date().toISOString(),
        estimated_resolution: updateData.estimated_resolution || incident.estimated_resolution,
        history: [
          ...incident.history,
          {
            id: `${incident.history.length + 1}`,
            timestamp: new Date().toISOString(),
            status: updateData.status || incident.status,
            status_display: updateData.status?.replace('_', ' ') || incident.status_display,
            notes: updateData.notes,
            updated_by: {
              id: user?.id || '1',
              name: user?.name || 'Current User',
              role: 'staff'
            },
            is_public: updateData.is_public_note || false
          }
        ]
      }
      
      onUpdate(updatedIncident)
      onClose()
    } catch (error) {
      console.error('Failed to update incident:', error)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back to Incident</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Card Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Update Incident</h1>
              <p className="text-gray-600 mb-4">{incident.title}</p>
              <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-md">
                {incident.incident_id}
              </span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-8">
          {/* Current Status Display */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4 text-sm uppercase tracking-wide">Current Status</h3>
            <div className="flex items-center gap-4 flex-wrap">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(incident.status)}`}>
                {incident.status_display}
              </span>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(incident.priority)}`}>
                {incident.priority_display} Priority
              </span>
            </div>
          </div>

          {/* Update Form */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={updateData.status || incident.status}
                  onChange={(e) => setUpdateData({ ...updateData, status: e.target.value as IncidentStatus })}
                  className={inputClasses}
                >
                  <option value="NEW">New</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={updateData.priority || incident.priority}
                  onChange={(e) => setUpdateData({ ...updateData, priority: e.target.value as IncidentPriority })}
                  className={inputClasses}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To Staff Member
              </label>
              <select
                value={updateData.assigned_to || incident.assigned_to?.id || ''}
                onChange={(e) => setUpdateData({ ...updateData, assigned_to: e.target.value })}
                className={inputClasses}
              >
                <option value="">Not Assigned</option>
                {availableStaff.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name} - {staff.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Estimated Resolution */}
            {(updateData.status === 'IN_PROGRESS' || incident.status === 'IN_PROGRESS') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Resolution Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={updateData.estimated_resolution || ''}
                  onChange={(e) => setUpdateData({ ...updateData, estimated_resolution: e.target.value })}
                  className={inputClasses}
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Notes <span className="text-red-600">*</span>
              </label>
              <textarea
                value={updateData.notes || ''}
                onChange={(e) => setUpdateData({ ...updateData, notes: e.target.value })}
                rows={5}
                className={inputClasses}
                placeholder="Describe what action was taken or what the next steps are..."
                required
              />
            </div>

            {/* Public Note Checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <input
                type="checkbox"
                id="public_note"
                checked={updateData.is_public_note || false}
                onChange={(e) => setUpdateData({ ...updateData, is_public_note: e.target.checked })}
                className="mt-1 h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <label htmlFor="public_note" className="text-sm font-medium text-gray-800 cursor-pointer">
                  Share notes with reporter
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  When checked, this note will be visible to the original reporter.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={updating || !updateData.notes?.trim()}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    <span>Update Incident</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}