// components/staff/IncidentFilters.tsx
'use client'

import { useState, useEffect } from 'react'
import { useApi } from '@/hooks/useApi'
import { INCIDENT_CATEGORIES_URL } from '../../../handler/apiConfig'
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import type { IncidentFilter, IncidentStatus, IncidentCategory, IncidentPriority } from '../../../types'

// Constants for filter options
const STATUS_OPTIONS: { value: IncidentStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
]

const PRIORITY_OPTIONS: { value: IncidentPriority; label: string }[] = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
]

interface ApiCategory {
  id: string;
  name: string;
}

interface IncidentFiltersProps {
  filter: IncidentFilter
  setFilter: (filter: IncidentFilter) => void
  onExport: () => void
}

export default function IncidentFilters({ filter, setFilter, onExport }: IncidentFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const { useFetchData } = useApi<ApiCategory, unknown>(INCIDENT_CATEGORIES_URL)
  const { data: categoriesData, isLoading: isLoadingCategories } = useFetchData(1, { page_size: 100 })

  useEffect(() => {
    if (categoriesData?.results) {
      setCategories(categoriesData.results)
    }
  }, [categoriesData])

  // Calculate active filter count
  const activeFilterCount = Object.entries(filter).reduce((count, [key, value]) => {
    if (key === 'search') return count // Don't count search as a filter
    if (Array.isArray(value)) return count + value.length
    return count + (value ? 1 : 0)
  }, 0)

  const handleSingleSelectFilterChange = (key: keyof IncidentFilter, value: string) => {
    // For single-select filters, we convert to array for consistency with the API
    setFilter({ ...filter, [key]: value ? [value] : [] })
  }

  const clearFilters = () => {
    setFilter({ 
      ...filter, // Preserve existing filter properties
      status: [], 
      category: [], 
      priority: [], 
      assigned_to: [], 
      department: [], 
      location_area: [], 
      is_overdue: false, 
      is_escalated: false 
    })
  }

  return (
    <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          >
            <FunnelIcon className="w-4 h-4 text-gray-600" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
          
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Clear all filters"
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
        
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          aria-label="Export incidents"
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
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search incidents"
        />
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showFilters ? 'mt-4 opacity-100' : 'mt-0 opacity-0 h-0'
        }`}
      >
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status-filter"
                value={filter.status?.[0] || ''}
                onChange={(e) => handleSingleSelectFilterChange('status', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <div className="relative">
                <select
                  id="category-filter"
                  value={filter.category?.[0] || ''}
                  onChange={(e) => handleSingleSelectFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
                  disabled={isLoadingCategories}
                >
                  <option value="">{isLoadingCategories ? 'Loading...' : 'All Categories'}</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {isLoadingCategories && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                id="priority-filter"
                value={filter.priority?.[0] || ''}
                onChange={(e) => handleSingleSelectFilterChange('priority', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Priorities</option>
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={clearFilters} 
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}