// components/staff/IncidentManagement.tsx

'use client'
import { useState, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useApi } from '@/hooks/useApi'
import { INCIDENTS_URL } from '../../../handler/apiConfig'
import type { StaffIncident, IncidentFilter } from '../../../types'
import IncidentFilters from './IncidentFilters'
import IncidentTable from './IncidentTable'
import IncidentStats from './IncidentStats'
import IncidentDetailModal from './IncidentDetailModal'
import IncidentUpdateModal from './IncidentUpdateModal'

export default function IncidentManagement() {
  const { user } = useAuth()
  const [selectedIncident, setSelectedIncident] = useState<StaffIncident | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  const [filter, setFilter] = useState<IncidentFilter>({
    status: [],
    category: [],
    priority: [],
    assigned_to: [],
    department: [],
    location_area: [],
    search: '',
    is_overdue: false,
    is_escalated: false
  })

  const { useFetchData } = useApi<StaffIncident, any>(INCIDENTS_URL)
  
  const apiParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (filter.search) params.search = filter.search;
    if (filter.status?.length) params.status = filter.status[0];
    if (filter.category?.length) params.category = filter.category[0];
    if (filter.priority?.length) params.priority = filter.priority[0];
    return params;
  }, [filter]);

  const { data: incidentData, isLoading, error } = useFetchData(page, apiParams);
  const incidents = incidentData?.results || [];
  const totalCount = incidentData?.count || 0;

  const handleViewIncident = (incident: StaffIncident) => {
    setSelectedIncident(incident);
    setIsDetailModalOpen(true);
  };

  const handleUpdateIncident = (incident: StaffIncident) => {
    setSelectedIncident(incident);
    setIsUpdateModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedIncident(null);
    setIsDetailModalOpen(false);
    setIsUpdateModalOpen(false);
  };

  const handleUpdateSuccess = () => {
    handleModalClose();
  };

  const exportIncidents = () => {
    const csvContent = incidents.map(inc => 
      `"${inc.incident_id}","${inc.title}","${inc.status}","${inc.priority}","${inc.location}","${inc.created_at}"`
    ).join('\n')
    
    const blob = new Blob([`ID,Title,Status,Priority,Location,Created\n${csvContent}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incidents-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url);
  }

  if (isDetailModalOpen && selectedIncident) {
    return (
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={handleModalClose}
        onSwitchToUpdate={() => {
            setIsDetailModalOpen(false);
            setIsUpdateModalOpen(true);
        }}
      />
    );
  }

  if (isUpdateModalOpen && selectedIncident) {
    return (
      <IncidentUpdateModal
        incident={selectedIncident}
        onClose={handleModalClose}
        onUpdateSuccess={handleUpdateSuccess}
      />
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Incident Management</h2>
          <p className="text-gray-600">
            Displaying {incidents.length} of {totalCount} total incidents.
          </p>
        </div>
      </div>

      <IncidentFilters 
        filter={filter} 
        setFilter={setFilter} 
        onExport={exportIncidents}
      />

      <IncidentStats incidents={incidents} user={user} />

      <IncidentTable
        incidents={incidents}
        isLoading={isLoading}
        onViewIncident={handleViewIncident}
        onUpdateIncident={handleUpdateIncident}
        page={page}
        setPage={setPage}
        totalCount={totalCount}
      />
    </div>
  )
}