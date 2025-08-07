import { UserDetails } from "./user";

/**
 * Represents data for user registration.
 */
export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  ward?: string;
  constituency?: string;
  county?: string;
  employee_id?: string;
  department?: string;
}

/**
 * Represents data for user login.
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Represents the JWT token and user details after successful login.
 */
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserDetails;
}

/**
 * Represents data for changing a user's password.
 */
export interface PasswordChangeData {
  old_password: string;
  new_password1: string;
  new_password2: string;
}

/**
 * Represents social authentication URLs.
 */
export interface SocialAuthURLs {
  google: string;
  github: string;
  facebook: string;
}

