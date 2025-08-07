/**
 * Represents an incident category.
 */
export interface IncidentCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  default_priority: string;
  default_sla_hours: number;
  auto_assign_department?: string;
  requires_photo: boolean;
  requires_location_verification: boolean;
  is_active: boolean;
  display_order: number;
  subcategories: IncidentSubCategory[];
  incident_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents an incident subcategory.
 */
export interface IncidentSubCategory {
  id: number;
  category: number;
  category_name: string;
  name: string;
  description?: string;
  priority_override?: string;
  sla_override_hours?: number;
  effective_priority: string;
  effective_sla_hours: number;
  is_active: boolean;
  display_order: number;
  incident_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a photo attached to an incident.
 */
export interface IncidentPhoto {
  id: number;
  photo: string;
  photo_url: string;
  caption?: string;
  is_primary: boolean;
  file_size: number;
  width: number;
  height: number;
  photo_latitude?: number;
  photo_longitude?: number;
  photo_timestamp?: string;
  created_at: string;
}

/**
 * Represents a tag associated with an incident.
 */
export interface IncidentTag {
  id: number;
  name: string;
  description?: string;
  color?: string;
  is_active: boolean;
  incident_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents an update to an incident's status.
 */
export interface IncidentStatusUpdate {
  id: number;
  old_status: string;
  new_status: string;
  changed_by?: number;
  changed_by_name: string;
  notes?: string;
  change_type: string;
  notification_sent: boolean;
  notification_sent_at?: string;
  created_at: string;
}

/**
 * Represents a comment on an incident.
 */
export interface IncidentComment {
  id: number;
  comment: string;
  is_internal: boolean;
  is_public: boolean;
  parent_comment?: number;
  created_by?: number;
  created_by_name: string;
  replies: IncidentComment[];
  created_at: string;
  updated_at: string;
}

/**
 * Represents a simplified view of an incident for lists.
 */
export interface IncidentList {
  id: string;
  incident_id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  category_name: string;
  subcategory_name?: string;
  assigned_to_name?: string;
  created_by_name?: string;
  location_description?: string;
  location_display: string;
  ward?: string;
  constituency?: string;
  county?: string;
  age_in_hours: number;
  is_overdue: boolean;
  sla_due_date?: string;
  primary_photo?: IncidentPhoto;
  tag_names: string[];
  source: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a detailed view of an incident.
 */
export interface IncidentDetail {
  id: string;
  incident_id: string;
  title: string;
  description?: string;
  category: IncidentCategory;
  subcategory?: IncidentSubCategory;
  location_description?: string;
  location_display: string;
  ward?: string;
  constituency?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  location_accuracy?: number;
  reporter_name?: string;
  reporter_email?: string;
  reporter_phone?: string;
  is_anonymous: boolean;
  allow_contact: boolean;
  status: string;
  priority: string;
  assigned_to?: UserDetails;
  assigned_department?: string;
  assigned_at?: string;
  assigned_by?: number;
  acknowledged_at?: string;
  acknowledged_by?: number;
  resolved_at?: string;
  resolved_by?: UserDetails;
  resolution_notes?: string;
  closed_at?: string;
  closed_by?: UserDetails;
  sla_due_date?: string;
  sla_breached: boolean;
  estimated_resolution_date?: string;
  source: string;
  source_reference?: string;
  satisfaction_rating?: number;
  satisfaction_feedback?: string;
  duplicate_of?: string;
  is_public: boolean;
  internal_notes?: string;
  photos: IncidentPhoto[];
  comments: IncidentComment[];
  status_updates: IncidentStatusUpdate[];
  tags: {
    id: number;
    name: string;
    color?: string;
    added_by?: string;
    added_at: string;
  }[];
  age_in_hours: number;
  is_overdue: boolean;
  time_to_resolution?: number;
  created_by?: UserDetails;
  created_at: string;
  updated_at: string;
}

/**
 * Represents data for creating a new incident.
 */
export interface IncidentCreateData {
  title: string;
  description: string;
  category: number;
  subcategory?: number;
  location_description?: string;
  ward?: string;
  constituency?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  location_accuracy?: number;
  reporter_name?: string;
  reporter_email?: string;
  reporter_phone?: string;
  is_anonymous: boolean;
  allow_contact: boolean;
  priority?: string;
  source?: string;
  source_reference?: string;
  uploaded_photos?: File[]; // This will be handled as File objects in frontend
  photo_captions?: string[];
  tags?: string[];
}

/**
 * Represents data for updating an existing incident.
 */
export interface IncidentUpdateData {
  title?: string;
  description?: string;
  category?: number;
  subcategory?: number;
  location_description?: string;
  ward?: string;
  constituency?: string;
  county?: string;
  latitude?: number;
  longitude?: number;
  location_accuracy?: number;
  reporter_name?: string;
  reporter_email?: string;
  reporter_phone?: string;
  allow_contact?: boolean;
  priority?: string;
  estimated_resolution_date?: string;
  resolution_notes?: string;
  internal_notes?: string;
}

/**
 * Represents data for creating an incident status update.
 */
export interface IncidentStatusUpdateCreateData {
  new_status: string;
  notes?: string;
  change_type: string;
}

/**
 * Represents data for assigning an incident.
 */
export interface IncidentAssignmentData {
  assigned_to?: number;
  notes?: string;
}

/**
 * Represents data for bulk updating incidents.
 */
export interface IncidentBulkUpdateData {
  incident_ids: string[];
  updates: {
    status?: string;
    priority?: string;
    assigned_to?: number;
  };
}

/**
 * Represents incident metrics.
 */
export interface IncidentMetrics {
  date: string;
  total_incidents: number;
  new_incidents: number;
  resolved_incidents: number;
  closed_incidents: number;
  overdue_incidents: number;
  avg_acknowledgment_time?: number;
  avg_resolution_time?: number;
  sla_met_count: number;
  sla_breached_count: number;
  sla_compliance_rate: number;
  high_priority_count: number;
  medium_priority_count: number;
  low_priority_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents incident statistics.
 */
export interface IncidentStats {
  total_incidents: number;
  status_distribution: { [key: string]: number };
  priority_distribution: { [key: string]: number };
  category_distribution: { [key: string]: number };
  overdue_incidents: number;
  avg_resolution_time_hours?: number;
  sla_breach_rate: number;
}

/**
 * Represents an incident performance report.
 */
export interface IncidentPerformanceReport {
  period: any;
  summary: any;
  category_performance: any[];
  department_performance: any[];
}

import { UserDetails } from "./user";