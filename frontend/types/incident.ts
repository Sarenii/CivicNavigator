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

export interface IncidentLocation {
  type: 'coordinates' | 'text';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  text_description: string;
  landmark?: string;
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
  timestamp: string;
  status: string;
  note: string;
  actor: string;
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

export interface CreateIncidentRequest {
  title: string;
  description: string;
  category: IncidentCategory;
  location: IncidentLocation;
  contact_info: IncidentContact;
  user_id?: string;
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