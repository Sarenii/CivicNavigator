/**
 * Represents a user's profile information.
 */
export interface UserProfile {
  bio?: string;
  preferred_language?: string;
  incidents_reported: number;
  incidents_resolved: number;
  questions_asked: number;
}

/**
 * Represents a user role with associated permissions.
 */
export interface UserRole {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}




/**
 * Represents detailed user information.
 */
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number?: string;
  employee_id?: string;
  department?: string;
  ward?: string;
  constituency?: string;
  county?: string;
  location_display: string;
  role: UserRole;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  last_login: string;
  profile?: UserProfile;
}

/**
 * Represents user data for management by administrators.
 */
export interface UserManagement {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  employee_id?: string;
  department?: string;
  role?: UserRole;
  role_name?: string; // write-only field for setting role by name
  is_active: boolean;
  is_approved: boolean;
  is_verified: boolean;
  created_at: string;
  last_login: string;
}

/**
 * Represents user permissions.
 */
export interface UserPermissions {
  user_id: number;
  role?: string;
  permissions: string[];
  is_staff: boolean;
  is_supervisor: boolean;
  is_admin: boolean;
}

/**
 * Represents a request to change a user's role.
 */
export interface UserRoleChangeRequest {
  role_name: string;
}

/**
 * Represents the response after a user role change.
 */
export interface UserRoleChangeResponse {
  message: string;
  user: UserManagement;
}

/**
 * Represents the response for user approval.
 */
export interface UserApprovalResponse {
  message: string;
}
