export interface UserProfile {
  bio: string;
  preferred_language: string;
  incidents_reported: number;
  incidents_resolved: number;
  questions_asked: number;
}

export interface UserRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  employee_id: string | null;
  department: string;
  ward: string;
  constituency: string;
  county: string;
  location_display: string;
  role: UserRole;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  last_login: string | null;
  profile: UserProfile;
}
