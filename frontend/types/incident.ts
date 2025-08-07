// types/incident.ts

export type IncidentCategory = 
  | 'streetlight' 
  | 'waste' 
  | 'road' 
  | 'water' 
  | 'noise' 
  | 'parking' 
  | 'other';

export type IncidentStatus = 
  | 'NEW' 
  | 'IN_PROGRESS' 
  | 'RESOLVED' 
  | 'CLOSED';

export type IncidentPriority = 
  | 'LOW' 
  | 'MEDIUM' 
  | 'HIGH' 
  | 'URGENT';

export interface IncidentLocation {
  type: 'coordinates' | 'text';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  text_description: string;
  landmark?: string;
  ward?: string;
  constituency?: string;
  county?: string;
}

export interface IncidentContact {
  email?: string;
  phone?: string;
  name?: string;
}

export interface IncidentFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  contact: string;
  photo?: File | null;
}

export interface IncidentResponse {
  incident_id: string;
  status: 'NEW';
  message: string;
}

export interface IncidentHistoryEntry {
  id: string;
  timestamp: string;
  status: IncidentStatus;
  status_display: string;
  notes: string;
  updated_by: {
    id: string;
    name: string;
    role: string;
  };
  is_public: boolean;
  attachments?: any[];
}

export interface IncidentDetail {
  incident_id: string;
  status: IncidentStatus;
  last_update: string;
  title: string;
  category: string;
  location: string;
  created_date: string;
  history: IncidentHistoryEntry[];
}

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  assigned_areas: string[]; // List of wards/areas they can manage
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  contact_email?: string;
}

export interface Reporter {
  name?: string;
  email?: string;
  phone?: string;
  user_id?: string;
}

export interface AssignedTo {
  id: string;
  name: string;
  department: string;
  email?: string;
}

// Enhanced incident interface for staff management
export interface StaffIncident {
  id: string;
  incident_id: string;
  reference_number: string;
  title: string;
  description: string;
  category: IncidentCategory;
  category_display: string;
  status: IncidentStatus;
  status_display: string;
  priority: IncidentPriority;
  priority_display: string;
  location: IncidentLocation;
  contact_info: IncidentContact;
  created_at: string;
  updated_at: string;
  estimated_resolution?: string;
  actual_resolution?: string;
  reporter: Reporter;
  assigned_to?: AssignedTo;
  department: Department;
  attachments: any[];
  history: IncidentHistoryEntry[];
  assigned_to_name?: string;
  days_open: number;
  is_overdue: boolean;
  is_escalated?: boolean;
  resolution_notes?: string;
  public_notes?: string;
  internal_notes?: string;
  tags?: string[];
  related_incidents?: string[];
}

export interface IncidentFilter {
  status: IncidentStatus[];
  category: IncidentCategory[];
  priority: IncidentPriority[];
  assigned_to: string[];
  department: string[];
  location_area: string[];
  search: string;
  date_range?: {
    start: string;
    end: string;
  };
  is_overdue?: boolean;
  is_escalated?: boolean;
}

export interface CreateIncidentRequest {
  title: string;
  description: string;
  category: IncidentCategory;
  location: IncidentLocation;
  contact_info: IncidentContact;
  user_id?: string;
  priority?: IncidentPriority;
  attachments?: File[];
}

export interface UpdateIncidentRequest {
  status?: IncidentStatus;
  priority?: IncidentPriority;
  assigned_to?: string;
  notes?: string;
  is_public_note?: boolean;
  estimated_resolution?: string;
  tags?: string[];
  internal_notes?: string;
}

export interface StatusLookupRequest {
  incident_id: string;
}

export interface StatusLookupResponse {
  incident: IncidentDetail;
  last_update: string;
  status_message: string;
}

export interface IncidentFormProps {
  onSubmit: (data: IncidentFormData) => Promise<void>;
  isLoading?: boolean;
}

export interface StatusLookupProps {
  onLookup: (incidentId: string) => Promise<void>;
  isLoading?: boolean;
  result?: StatusLookupResponse;
  error?: string;
}

export interface IncidentManagementProps {
  userAreas?: string[];
  userDepartment?: string;
  canAssignIncidents?: boolean;
  canUpdatePriority?: boolean;
  canViewAllIncidents?: boolean;
}

// Analytics and reporting types
export interface IncidentStats {
  total_incidents: number;
  new_incidents: number;
  in_progress_incidents: number;
  resolved_incidents: number;
  overdue_incidents: number;
  avg_resolution_time: number;
  incidents_by_category: Record<IncidentCategory, number>;
  incidents_by_area: Record<string, number>;
  trending_issues: {
    category: IncidentCategory;
    count: number;
    change_percentage: number;
  }[];
}

export interface IncidentExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  filters: IncidentFilter;
  include_history?: boolean;
  include_attachments?: boolean;
  date_range: {
    start: string;
    end: string;
  };
}