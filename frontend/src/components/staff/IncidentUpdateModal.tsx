// components/staff/IncidentUpdateModal.tsx

'use client'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/components/utils/api'
import { useApi } from '@/hooks/useApi'
import { INCIDENTS_URL } from '../../../handler/apiConfig'
import { handleApiError } from '@/hooks/useApiErrorHandler'
import { toast } from 'sonner'
import type { StaffIncident, IncidentDetail, IncidentUpdateData, IncidentStatus, IncidentPriority, IncidentStatusUpdateCreateData } from '../../../types'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface IncidentUpdateModalProps {
  incident: StaffIncident
  onClose: () => void
  onUpdateSuccess: () => void
}

export default function IncidentUpdateModal({ incident, onClose, onUpdateSuccess }: IncidentUpdateModalProps) {
  const queryClient = useQueryClient();

  const { useUpdateItem: updateIncidentMutation } = useApi<any, IncidentDetail>(INCIDENTS_URL)

  const updateStatusMutation = useMutation({
    mutationFn: (payload: IncidentStatusUpdateCreateData) => 
      api.post(`${INCIDENTS_URL}${incident.id}/update-status/`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INCIDENTS_URL] });
    },
    onError: (error) => {
        handleApiError(error, 'Failed to update incident status.');
    }
  });

  const [priority, setPriority] = useState<IncidentPriority>(incident.priority as IncidentPriority);
  const [status, setStatus] = useState<IncidentStatus>(incident.status as IncidentStatus);
  const [notes, setNotes] = useState('');

  const isUnchanged = priority === incident.priority && status === incident.status && !notes.trim();

  const handleUpdate = async () => {
    if (!notes.trim()) {
      toast.warning('Update notes are required to submit any change.');
      return;
    }

    const promises = [];

    if (priority !== incident.priority) {
      const priorityPayload: Partial<IncidentUpdateData> = { priority: priority.toLowerCase() as IncidentPriority };
      promises.push(
        updateIncidentMutation.mutateAsync({ id: incident.id, item: priorityPayload })
      );
    }

    if (status !== incident.status) {
      const statusPayload: IncidentStatusUpdateCreateData = {
        new_status: status.toLowerCase(),
        notes: notes,
        // CORRECTED: Use 'status', which is a valid choice in your models.py
        change_type: 'status' 
      };
      promises.push(
        updateStatusMutation.mutateAsync(statusPayload)
      );
    } 
    else if (notes.trim() && priority === incident.priority) {
       const statusPayload: IncidentStatusUpdateCreateData = {
        new_status: status.toLowerCase(),
        notes: notes,
        // CORRECTED: Use 'general', the default choice in your models.py
        change_type: 'general'
      };
      promises.push(
        updateStatusMutation.mutateAsync(statusPayload)
      );
    }

    if (promises.length === 0) {
        toast.info("No changes to submit.");
        return;
    }

    try {
        await Promise.all(promises);
        toast.success(`Incident #${incident.incident_id} updated successfully.`);
        onUpdateSuccess();
    } catch (error) {
        console.error("One or more updates failed", error);
    }
  }

  const isMutating = updateIncidentMutation.isPending || updateStatusMutation.isPending;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <button onClick={onClose} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="font-medium">Back to List</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Update Incident</h1>
          <p className="text-gray-600 mt-1">{incident.title}</p>
          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded-md mt-2 inline-block">{incident.incident_id}</span>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as IncidentStatus)}
                className="w-full p-3 border rounded-xl"
                disabled={isMutating}
              >
                {/* These values will be converted to lowercase before sending */}
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as IncidentPriority)}
                className="w-full p-3 border rounded-xl"
                disabled={isMutating}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Update Notes <span className="text-red-600">*</span></label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              className="w-full p-3 border rounded-xl"
              placeholder="Describe the action taken..."
              required
              disabled={isMutating}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg border" disabled={isMutating}>Cancel</button>
            <button onClick={handleUpdate} disabled={isMutating || isUnchanged} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 flex items-center gap-2">
              {isMutating ? 'Updating...' : 'Update Incident'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}