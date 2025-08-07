// components/staff/IncidentManagement.tsx

'use client'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { StaffIncident, IncidentFilter } from '../../../types'
import IncidentFilters from './IncidentFilters'
import IncidentTable from './IncidentTable'
import IncidentStats from './IncidentStats'
import IncidentDetailModal from './IncidentDetailModal'
import IncidentUpdateModal from './IncidentUpdateModal'
import { getMockIncidents } from '../utils/MockData'

export default function IncidentManagement() {
  const { user } = useAuth()
  const [incidents, setIncidents] = useState<StaffIncident[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<StaffIncident | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
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

  // Mock user areas - in real app, this would come from user context or API
  // For now, we'll assign areas based on user role or use default areas
  const getUserAreas = (user: any) => {
    // You can customize this logic based on your user's role or other properties
    if (user?.role === 'staff') {
      return ['Nairobi CBD', 'Westlands', 'Karen'] // Default areas for staff
    }
    return ['Nairobi CBD'] // Default fallback
  }
  
  const userAreas = user ? getUserAreas(user) : ['Nairobi CBD']

  useEffect(() => {
    loadIncidents()
  }, [])

  const loadIncidents = async () => {
    setIsLoading(true)
    try {
      if (process.env.NODE_ENV === 'development') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIncidents(getMockIncidents())
      } else {
        const response = await fetch('/api/staff/incidents', {
          headers: {
            'Authorization': `Bearer ${user?.id}`, // Using user.id instead of user.token
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const data = await response.json()
          setIncidents(data.incidents)
        }
      }
    } catch (error) {
      console.error('Failed to load incidents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredIncidents = incidents.filter(incident => {
    // Location-based filtering
    const incidentArea = incident.location.ward || incident.location.text_description
    const hasAreaAccess = userAreas.some((area: string) => 
      incidentArea.toLowerCase().includes(area.toLowerCase())
    )
    
    // For now, all staff can view all incidents, but you can add role-based logic here
    const canViewAllIncidents = user?.role === 'staff'
    
    if (!hasAreaAccess && !canViewAllIncidents) {
      return false
    }

    // Apply other filters
    if (filter.search && !incident.title.toLowerCase().includes(filter.search.toLowerCase()) &&
        !incident.incident_id.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    if (filter.status.length > 0 && !filter.status.includes(incident.status)) {
      return false
    }
    if (filter.category.length > 0 && !filter.category.includes(incident.category)) {
      return false
    }
    if (filter.is_overdue && !incident.is_overdue) {
      return false
    }

    return true
  })

  const handleIncidentUpdate = (updatedIncident: StaffIncident) => {
    setIncidents(prev => prev.map(inc => 
      inc.id === updatedIncident.id ? updatedIncident : inc
    ))
    setSelectedIncident(updatedIncident)
  }

  const exportIncidents = () => {
    const csvContent = filteredIncidents.map(inc => 
      `${inc.incident_id},${inc.title},${inc.status},${inc.priority},${inc.location.text_description},${inc.created_at}`
    ).join('\n')
    
    const blob = new Blob([`ID,Title,Status,Priority,Location,Created\n${csvContent}`], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `incidents-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  return (
    <>
      {/* Show modals as full pages if active */}
      {selectedIncident && !showUpdateModal && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdate={() => setShowUpdateModal(true)}
        />
      )}

      {showUpdateModal && selectedIncident && (
        <IncidentUpdateModal
          incident={selectedIncident}
          onClose={() => {
            setShowUpdateModal(false)
            setSelectedIncident(null)
          }}
          onUpdate={handleIncidentUpdate}
        />
      )}

      {/* Main incident management content - hidden when modals are active */}
      {!selectedIncident && !showUpdateModal && (
        <div className="space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Incident Management</h2>
              <p className="text-gray-600">
                {filteredIncidents.length} of {incidents.length} incidents in your assigned areas
              </p>
              <p className="text-sm text-gray-500">Areas: {userAreas.join(', ')}</p>
            </div>
          </div>

          {/* Filters */}
          <IncidentFilters 
            filter={filter} 
            setFilter={setFilter} 
            onExport={exportIncidents}
          />

          {/* Stats */}
          <IncidentStats incidents={incidents} user={user} />

          {/* Table */}
          <IncidentTable
            incidents={filteredIncidents}
            isLoading={isLoading}
            onViewIncident={setSelectedIncident}
            onUpdateIncident={(incident) => {
              setSelectedIncident(incident)
              setShowUpdateModal(true)
            }}
          />
        </div>
      )}
    </>
  )
}