import { api } from '../src/components/utils/api';
import axios from 'axios';
import { User } from '../types';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { handleApiError } from '../src/components/utils/api';
import ApiService from './ApiService';

export interface AuthResponse {
  access: string;
  refresh: string;
  user: Partial<User>;
}

export const apiPlain = axios.create({
  baseURL: ApiService.BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    // 'Access-Control-Allow-Origin': BASE_URL,
    // 'Access-Control-Allow-Credentials': 'true',
  },
});

// Add request interceptor to include auth token
apiPlain.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
apiPlain.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          const refreshResponse = await axios.post(`${ApiService.BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const { access } = refreshResponse.data;
          Cookies.set('accessToken', access, { expires: 1 });
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiPlain(originalRequest);        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

class AuthManager {
  async login(email: string, password: string): Promise<AuthResponse | undefined> {
    try {
        // Clear tokens synchronously before making the API call
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');

        const response = await apiPlain.post<AuthResponse>(ApiService.LOGIN_URL, { 
          email, 
          password 
        });

        if (response.data) {
          // Store new tokens after successful login in cookies
          Cookies.set('accessToken', response.data.access, { 
            expires: 1, // 1 day expiration
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });
          Cookies.set('refreshToken', response.data.refresh, { 
            expires: 7, // 7 days expiration
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
          });

          return response.data;
        }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Django REST Auth error responses
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.non_field_errors) {
          throw new Error(errorData.non_field_errors[0] || 'Invalid credentials');
        } else if (errorData.email) {
          throw new Error(errorData.email[0] || 'Invalid email format');
        } else if (errorData.password) {
          throw new Error(errorData.password[0] || 'Invalid password');
        }
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 403) {
        throw new Error('Account is deactivated. Contact support.');
      }
      
      throw error;
    }
  }

  async register(email: string, password1: string, password2: string, role: string): Promise<AuthResponse | undefined> {
    try {
      const response = await apiPlain.post<AuthResponse>(ApiService.REGISTRATION_URL, { 
        email, 
        password1, 
        password2, 
        role 
      });
      
      if (response.data) {
        // Store new tokens after successful registration in cookies
        Cookies.set('accessToken', response.data.access, { 
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        Cookies.set('refreshToken', response.data.refresh, { 
          expires: 7,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        
        return response.data;
      }
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse | undefined> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');
      
      const response = await apiPlain.post<AuthResponse>(ApiService.TOKEN_REFRESH_URL, { 
        refresh: refreshToken 
      });
      
      if (response.data?.access) {
        // Store the new access token in cookies
        Cookies.set('accessToken', response.data.access, { 
          expires: 1,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
        return response.data;
      }
    } catch (error) {
      // Refresh failed, clear tokens and redirect to login
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      handleApiError(error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (refreshToken) {
        await apiPlain.post(ApiService.LOGOUT_URL, { refresh: refreshToken });
      }
      
      toast.success('Logout successful');
      
      // Remove tokens from cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
        // Small delay to show toast then redirect
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }, 1000);
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      handleApiError(error);
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }

  async changePassword(new_password1: string, new_password2: string): Promise<void> {
    try {
      await apiPlain.post(ApiService.PASSWORD_CHANGE_URL, { 
        new_password1, 
        new_password2 
      });
      toast.success('Password changed successfully');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }

  async resendEmail(email: string): Promise<void> {
    try {
      await apiPlain.post(ApiService.RESEND_EMAIL_VERIFICATION_URL, { email });
      toast.success('Verification email sent successfully');
    } catch (error: any) {
      console.error('Resend email error:', error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.detail) {
          throw new Error(errorData.detail);
        } else if (errorData.email) {
          throw new Error(errorData.email[0] || 'Invalid email address');
        }
      } else if (error.response?.status === 404) {
        throw new Error('No account found with this email address');
      }
      
      throw error;
    }  }

  async resetPassword(email: string): Promise<void> {
    try {
      await apiPlain.post(ApiService.PASSWORD_RESET_URL, { email });
      toast.success('Password reset email sent successfully');
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.email) {
          throw new Error(errorData.email[0] || 'Invalid email address');
        }
      } else if (error.response?.status === 404) {
        throw new Error('No account found with this email address');
      }
      
      throw error;
    }
  }
  async verifyEmailWithKey(key: string): Promise<void> {
    try {
      const response = await apiPlain.post(ApiService.VERIFY_EMAIL_URL, { key });
      toast.success('Email verified successfully!');
      return response.data;
    } catch (error: any) {
      console.error('Email verification error:', error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.detail) {
          throw new Error(errorData.detail);
        }
      }
      
      throw new Error('Email verification failed. Please try again.');
    }
  }


  async confirmPasswordReset(uid: string, token: string, new_password1: string, new_password2: string): Promise<void> {
    try {
      await apiPlain.post(ApiService.PASSWORD_RESET_CONFIRM_URL, { 
        uid, 
        token, 
        new_password1, 
        new_password2 
      });
      toast.success('Password reset successfully!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.new_password1) {
          throw new Error(errorData.new_password1[0] || 'Invalid password');
        } else if (errorData.new_password2) {
          throw new Error(errorData.new_password2[0] || 'Passwords do not match');
        } else if (errorData.token) {
          throw new Error('This password reset link has expired or is invalid');
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        }
      }
      
      throw error;
    }
  }

  async getUser(): Promise<User | undefined> {
    try {
      const response = await apiPlain.get(ApiService.USER_DETAILS_URL);
      return response.data;
    } catch (error: any) {
      console.error('Get user error:', error);
      
      // If unauthorized, try to refresh token
      if (error.response?.status === 401) {
        try {
          await this.refreshToken();
          const retryResponse = await apiPlain.get(ApiService.USER_DETAILS_URL);
          return retryResponse.data;        
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
      
      handleApiError(error);
      throw error;
    }
  }

  async updateUser(userId: string, formData: FormData): Promise<any> {
    try {
      const response = await apiPlain.patch(`${ApiService.USER_DETAILS_URL}${userId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('User updated successfully');
      return response.data;
    } catch (error) {
      console.error('Failed to update user:', error);
      handleApiError(error, "Failed to update user");
      throw error;
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await apiPlain.delete(`${ApiService.USER_DETAILS_URL}${userId}/`);
      toast.success('User deleted successfully');
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  }


  // Check if user is authenticated
  isAuthenticated(): boolean {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    return !!(accessToken || refreshToken);
  }

  // Get current user from stored tokens
  getCurrentUserFromToken(): Partial<User> | null {
    try {
      const accessToken = Cookies.get('accessToken');
      if (accessToken) {
        // Decode JWT token to get user info (basic implementation)
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        return {
          id: payload.user_id,
          email: payload.email,
          role: payload.role,
        };
      }
    } catch (error) {
      console.error('Error decoding token:', error);
    }
    return null;
  }

  // Clear all authentication data
  clearAuth(): void {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
  }
}

const authManager = new AuthManager();
export default authManager;