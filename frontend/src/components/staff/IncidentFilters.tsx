// components/staff/IncidentFilters.tsx

'use client'
import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { INCIDENT_CATEGORIES_URL } from '../../../handler/apiConfig'
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import type { IncidentFilter, IncidentStatus, IncidentCategory, IncidentPriority } from '../../../types'

interface IncidentFiltersProps {
  filter: IncidentFilter
  setFilter: (filter: IncidentFilter) => void
  onExport: () => void
}

interface ApiCategory {
  id: string;
  name: string;
}

export default function IncidentFilters({ filter, setFilter, onExport }: IncidentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<ApiCategory[]>([])

  const { useFetchData } = useApi<ApiCategory, any>(INCIDENT_CATEGORIES_URL)
  const { data: categoriesData, isLoading: isLoadingCategories } = useFetchData(1, { page_size: 100 });

  useEffect(() => {
    if (categoriesData?.results) {
      setCategories(categoriesData.results);
    }
  }, [categoriesData]);

  const activeFilterCount = (filter.status?.length || 0) + (filter.category?.length || 0)

  const handleFilterChange = (key: keyof IncidentFilter, value: any) => {
    setFilter({ ...filter, [key]: value });
  };
  
  const clearFilters = () => {
    setFilter({ 
      status: [], 
      category: [], 
      priority: [], 
      assigned_to: [], 
      department: [], 
      location_area: [], 
      search: '', 
      is_overdue: false, 
      is_escalated: false 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium"
        >
          <FunnelIcon className="w-4 h-4 text-gray-600" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{activeFilterCount}</span>
          )}
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium"
        >
          <ArrowDownTrayIcon className="w-4 h-4 text-gray-600" />
          <span>Export</span>
        </button>
      </div>

      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search incidents by title or ID..."
          value={filter.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={filter.status?.[0] || ''}
                onChange={(e) => handleFilterChange('status', e.target.value ? [e.target.value as IncidentStatus] : [])}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Statuses</option>
                <option value="NEW">New</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Category</label>
              <select
                value={filter.category?.[0] || ''}
                onChange={(e) => handleFilterChange('category', e.target.value ? [e.target.value as IncidentCategory] : [])}
                className="w-full p-2 border rounded-lg"
                disabled={isLoadingCategories}
              >
                <option value="">{isLoadingCategories ? 'Loading...' : 'All Categories'}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Priority</label>
              <select
                value={filter.priority?.[0] || ''}
                onChange={(e) => handleFilterChange('priority', e.target.value ? [e.target.value as IncidentPriority] : [])}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">All Priorities</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={clearFilters} className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
              Clear All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}