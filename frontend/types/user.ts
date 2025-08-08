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
 * Backend role constants to match UserRole.ROLE_CHOICES
 */
export const USER_ROLES = {
  RESIDENT: 'resident',
  STAFF: 'staff',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
} as const;

export type UserRoleName = typeof USER_ROLES[keyof typeof USER_ROLES];

/**
 * Role display names to match backend choices
 */
export const ROLE_DISPLAY_NAMES = {
  [USER_ROLES.RESIDENT]: 'Resident',
  [USER_ROLES.STAFF]: 'Staff Member',
  [USER_ROLES.SUPERVISOR]: 'Supervisor',
  [USER_ROLES.ADMIN]: 'Administrator',
  [USER_ROLES.SUPER_ADMIN]: 'Super Administrator'
} as const;

/**
 * Represents user details returned by the backend UserDetailsSerializer.
 * This matches the fields returned by the backend authentication endpoints.
 */
export type UserDetails = User;


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
