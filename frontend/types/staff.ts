/**
 * Represents a department within the organization.
 */
export interface Department {
  id: number;
  name: string;
  description?: string;
  parent?: number;
  full_path: string;
  head_of_department?: number;
  head_of_department_name: string;
  email?: string;
  phone?: string;
  address?: string;
  service_areas: string[];
  service_areas_list: string[];
  wards_covered: string[];
  wards_list: string[];
  constituencies_covered: string[];
  constituencies_list: string[];
  is_active: boolean;
  auto_assignment_enabled: boolean;
  total_staff: number;
  active_incidents: number;
  avg_resolution_time_hours?: number;
  children_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a staff member's schedule.
 */
export interface StaffSchedule {
  id: number;
  staff_member: number;
  staff_member_name: string;
  schedule_type: string;
  schedule_type_display: string;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  is_all_day: boolean;
  is_recurring: boolean;
  recurrence_pattern?: string;
  is_available_for_incidents: boolean;
  max_concurrent_incidents?: number;
  location?: string;
  is_remote: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a work log entry for a staff member.
 */
export interface WorkLog {
  id: number;
  staff_member: number;
  staff_member_name: string;
  log_type: string;
  log_type_display: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  related_incident?: string;
  related_incident_id?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  is_verified: boolean;
  verified_by?: number;
  verified_by_name?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents an assignment of a staff member to an incident.
 */
export interface StaffAssignment {
  id: number;
  incident: string;
  incident_id: string;
  staff_member: number;
  staff_member_name: string;
  assignment_type: string;
  assignment_type_display: string;
  status: string;
  status_display: string;
  assigned_by?: number;
  assigned_by_name: string;
  assigned_at: string;
  acknowledged_at?: string;
  accepted_at?: string;
  declined_at?: string;
  completed_at?: string;
  assignment_notes?: string;
  response_notes?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents performance metrics for a staff member.
 */
export interface StaffPerformanceMetrics {
  id: number;
  staff_member: number;
  staff_member_name: string;
  period_start: string;
  period_end: string;
  period_type: string;
  period_type_display: string;
  total_incidents_assigned: number;
  total_incidents_completed: number;
  total_incidents_overdue: number;
  completion_rate: number;
  avg_response_time_hours?: number;
  avg_resolution_time_hours?: number;
  total_work_hours: number;
  satisfaction_rating_avg?: number;
  satisfaction_response_count: number;
  complaint_count: number;
  incidents_per_hour: number;
  sla_compliance_rate: number;
  knowledge_articles_created: number;
  training_sessions_attended: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a bulk action performed by staff.
 */
export interface BulkAction {
  id: number;
  action_id: string;
  action_type: string;
  action_type_display: string;
  description?: string;
  executed_by?: number;
  executed_by_name: string;
  target_count: number;
  processed_count: number;
  success_count: number;
  error_count: number;
  progress_percentage: number;
  status: string;
  status_display: string;
  started_at?: string;
  completed_at?: string;
  action_params?: any;
  results?: any;
  error_log?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a generated report.
 */
export interface Report {
  id: number;
  report_id: string;
  title: string;
  report_type: string;
  report_type_display: string;
  description?: string;
  generated_by?: number;
  generated_by_name: string;
  report_params?: any;
  date_range_start: string;
  date_range_end: string;
  report_format: string;
  report_format_display: string;
  file_path?: string;
  file_size?: number;
  file_size_mb: number;
  status: string;
  status_display: string;
  generation_started_at?: string;
  generation_completed_at?: string;
  expires_at?: string;
  is_expired: boolean;
  download_count: number;
  last_downloaded_at?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents data for bulk assignment of staff to incidents.
 */
export interface BulkAssignmentData {
  incident_ids: number[];
  staff_member_id: number;
  assignment_type: string;
  assignment_notes?: string;
  estimated_hours?: number;
}

/**
 * Represents data for bulk status updates of incidents.
 */
export interface BulkStatusUpdateData {
  incident_ids: number[];
  new_status: string;
  update_notes?: string;
  notify_stakeholders: boolean;
}

/**
 * Represents data for generating a report.
 */
export interface ReportGenerationData {
  title: string;
  report_type: string;
  description?: string;
  date_range_start: string;
  date_range_end: string;
  report_format: string;
  report_params?: any;
}
// types/staff.ts

import { IncidentDetail, IncidentStatus, IncidentCategory } from './incident'

// ===============================
// Staff Incident Management Types
// ===============================

export interface StaffIncidentFilter {
  status?: IncidentStatus[]
  category?: IncidentCategory[]
  assigned_to?: string
  date_from?: string
  date_to?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  search?: string
}

export interface IncidentUpdateData {
  status?: IncidentStatus
  notes?: string
  assigned_to?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  resolution_notes?: string
}

export interface StaffMember {
  id: string
  name: string
  email: string
  department: string
  is_active: boolean
}

export interface IncidentListItem extends IncidentDetail {
  assigned_to_name?: string
  days_open: number
  is_overdue: boolean
}

// ===============================
// Component Props
// ===============================

export interface StaffIncidentListProps {
  incidents: IncidentListItem[]
  isLoading: boolean
  onIncidentSelect: (incident: IncidentListItem) => void
  onStatusUpdate: (incidentId: string, updates: IncidentUpdateData) => void
  filter: StaffIncidentFilter
  onFilterChange: (filter: StaffIncidentFilter) => void
}

export interface IncidentDetailViewProps {
  incident: IncidentListItem | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updates: IncidentUpdateData) => void
  isUpdating: boolean
}

export interface IncidentFilterBarProps {
  filter: StaffIncidentFilter
  onFilterChange: (filter: StaffIncidentFilter) => void
  onClearFilters: () => void
}

// ===============================
// API Response Types
// ===============================

export interface StaffIncidentResponse {
  results: IncidentListItem[]
  count: number
  next: string | null
  previous: string | null
}

export interface IncidentUpdateResponse {
  success: boolean
  incident: IncidentListItem
  message: string
}

/**
 * Represents a full Knowledge Base article document.
 * This is the source of truth, matching the backend model.
 */
export interface KBArticle {
  id: string;
  title: string;
  body: string;
  tags: string[];
  source: string;
  last_updated: string;
}

/**
 * Represents the data required to create or update a KB article.
 * Used as the payload for POST/PUT API requests.
 */
export type KBArticlePayload = Omit<KBArticle, 'id' | 'last_updated'> & {
  id?: string; // ID is optional, present for updates but not for creation
};
