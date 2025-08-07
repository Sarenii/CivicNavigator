// components/staff/IncidentStats.tsx

import { StaffIncident } from '../../../types'

interface IncidentStatsProps {
  incidents: StaffIncident[]
  user: any
}

export default function IncidentStats({ incidents, user }: IncidentStatsProps) {
  const stats = {
    new: incidents.filter(i => i.status === 'NEW').length,
    inProgress: incidents.filter(i => i.status === 'IN_PROGRESS').length,
    resolved: incidents.filter(i => i.status === 'RESOLVED').length,
    overdue: incidents.filter(i => i.is_overdue).length,
    assignedToMe: incidents.filter(i => i.assigned_to?.name === user?.name).length
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
        <div className="text-sm text-gray-600">New</div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
        <div className="text-sm text-gray-600">In Progress</div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
        <div className="text-sm text-gray-600">Resolved</div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
        <div className="text-sm text-gray-600">Overdue</div>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-2xl font-bold text-purple-600">{stats.assignedToMe}</div>
        <div className="text-sm text-gray-600">Assigned to Me</div>
      </div>
    </div>
  )
}