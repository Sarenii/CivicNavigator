// components/staff/IncidentFilters.tsx

'use client'
import { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { IncidentFilter, IncidentStatus, IncidentCategory } from '../../../types'

interface IncidentFiltersProps {
  filter: IncidentFilter
  setFilter: (filter: IncidentFilter) => void
  onExport: () => void
}

export default function IncidentFilters({ filter, setFilter, onExport }: IncidentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const availableAreas = [
    'Nairobi CBD', 'Westlands', 'Karen', 'Kilimani', 'Lavington',
    'South C', 'South B', 'Embakasi', 'Kasarani', 'Kileleshwa'
  ]

  const activeFilterCount = filter.status.length + filter.category.length + filter.location_area.length

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
        >
          <FunnelIcon className="w-4 h-4 text-gray-600" />
          <span className="text-gray-900">Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {activeFilterCount}
            </span>
          )}
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
        >
          <ArrowDownTrayIcon className="w-4 h-4 text-gray-600" />
          <span className="text-gray-900">Export</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search incidents by title or ID..."
          value={filter.search || ''}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500 bg-white"
        />
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Status</label>
              <select
                value={filter.status[0] || ''}
                onChange={(e) => setFilter({ 
                  ...filter, 
                  status: e.target.value ? [e.target.value as IncidentStatus] : [] 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="" className="text-gray-700">All Statuses</option>
                <option value="NEW" className="text-gray-900">New</option>
                <option value="IN_PROGRESS" className="text-gray-900">In Progress</option>
                <option value="RESOLVED" className="text-gray-900">Resolved</option>
                <option value="CLOSED" className="text-gray-900">Closed</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Category</label>
              <select
                value={filter.category[0] || ''}
                onChange={(e) => setFilter({ 
                  ...filter, 
                  category: e.target.value ? [e.target.value as IncidentCategory] : [] 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="" className="text-gray-700">All Categories</option>
                <option value="streetlight" className="text-gray-900">Street Lighting</option>
                <option value="waste" className="text-gray-900">Waste Collection</option>
                <option value="road" className="text-gray-900">Road Maintenance</option>
                <option value="water" className="text-gray-900">Water & Sewerage</option>
                <option value="noise" className="text-gray-900">Noise Complaint</option>
                <option value="parking" className="text-gray-900">Parking Issues</option>
                <option value="other" className="text-gray-900">Other</option>
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Area</label>
              <select
                value={filter.location_area[0] || ''}
                onChange={(e) => setFilter({ 
                  ...filter, 
                  location_area: e.target.value ? [e.target.value] : [] 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="" className="text-gray-700">All Areas</option>
                {availableAreas.map(area => (
                  <option key={area} value={area} className="text-gray-900">{area}</option>
                ))}
              </select>
            </div>

            {/* Special */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-800">Special Filters</label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={filter.is_overdue || false}
                  onChange={(e) => setFilter({ ...filter, is_overdue: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                />
                <span className="ml-2 text-sm font-medium text-gray-800">Overdue incidents only</span>
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setFilter({ 
                status: [], category: [], priority: [], assigned_to: [], 
                department: [], location_area: [], search: '', 
                is_overdue: false, is_escalated: false 
              })}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}