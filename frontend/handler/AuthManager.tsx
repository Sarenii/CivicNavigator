import { handleApiError, extractAuthErrorMessage, api } from '../src/components/utils/api';
import { toast } from 'sonner';
import Cookies from 'js-cookie';
import ApiService from './ApiService';
import { User } from '../types/user';
import { apiPlain } from '../src/components/utils/api';
export interface AuthResponse {
  access: string;
  refresh: string;
  user: Partial<User>;
}

class AuthManager {
  async login(email: string, password: string): Promise<AuthResponse | undefined> {
    try {
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
      
      // Use the improved error extraction
      const errorMessage = extractAuthErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  async register(email: string, password1: string, password2: string, employee_id?: string, department?: string): Promise<AuthResponse | undefined> {
    try {
      const registrationData: any = {
        email, 
        password1, 
        password2
      }

      // Add staff-specific fields if provided
      if (employee_id) {
        registrationData.employee_id = employee_id
      }
      if (department) {
        registrationData.department = department
      }

      const response = await apiPlain.post<AuthResponse>(ApiService.REGISTRATION_URL, registrationData);
      
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
      // Use the improved error extraction
      const errorMessage = extractAuthErrorMessage(error);
      throw new Error(errorMessage);
    }
  }

  async refreshToken(): Promise<AuthResponse | undefined> {
    try {
      const refreshToken = Cookies.get('refreshToken');
      if (!refreshToken) throw new Error('No refresh token found');
      
      const response = await api.post<AuthResponse>(ApiService.TOKEN_REFRESH_URL, { 
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
        await api.post(ApiService.LOGOUT_URL, { refresh: refreshToken });
      }
      
      // Remove tokens from cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      
      // Redirect to landing page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      handleApiError(error);
      
      // Redirect to landing page even on error
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }

  async changePassword(new_password1: string, new_password2: string): Promise<void> {
    try {
      await api.post(ApiService.PASSWORD_CHANGE_URL, { 
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
      await api.post(ApiService.RESEND_EMAIL_VERIFICATION_URL, { email });
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
      await api.post(ApiService.PASSWORD_RESET_URL, { email });
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
      const response = await api.post(ApiService.VERIFY_EMAIL_URL, { key });
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
      await api.post(ApiService.PASSWORD_RESET_CONFIRM_URL, { 
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
      const response = await api.get(ApiService.USER_DETAILS_URL);
      return response.data;
    } catch (error: any) {
      console.error('Get user error:', error);
      
      // If unauthorized, try to refresh token
      if (error.response?.status === 401) {
        try {
          await this.refreshToken();
          const retryResponse = await api.get(ApiService.USER_DETAILS_URL);
          return retryResponse.data;        
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/';
          }
        }
      }
      
      handleApiError(error);
      throw error;
    }
  }

  async updateUser(userId: string, formData: FormData): Promise<any> {
    try {
      const response = await api.patch(`${ApiService.USER_DETAILS_URL}${userId}/`, formData, {
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
      await api.delete(`${ApiService.USER_DETAILS_URL}${userId}/`);
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