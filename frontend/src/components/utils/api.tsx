import axios, { AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Import js-cookie
import ApiService from '../../../handler/ApiService';
import { toast } from "sonner";
import { AuthResponse } from '../../../types';

interface ApiErrorResponse {
    detail?: string;
    [key: string]: unknown;
}

interface DecodedToken {
    exp: number;
}

// Redirect to login
const redirectToLogin = () => {
    Cookies.remove('accessToken'); // Remove tokens from cookies
    Cookies.remove('refreshToken');
    // use Next.js router for smoother client-side navigation
    //   const router = useRouter()
    //   router.push("/login")};
}



interface ApiError {
  detail?: string;
  [key: string]: any;
}

// Helper function to extract authentication error messages
export const extractAuthErrorMessage = (error: any): string => {
  if (!error || !error.response) {
    return 'Network error. Please check your connection.';
  }

  const { data, status } = error.response;

  // Helper function to extract error message from various Django formats
  const extractMessage = (data: any): string | null => {
    // Handle Django REST framework ErrorDetail format
    if (typeof data === 'string') {
      // Try to parse JSON first
      try {
        const parsed = JSON.parse(data);
        return extractMessage(parsed);
      } catch {
        // Check for ErrorDetail pattern
        const errorMatch = data.match(/ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)/);
        if (errorMatch && errorMatch[1]) {
          return errorMatch[1];
        }
        // Check for array of ErrorDetail
        const arrayMatch = data.match(/\[ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)\]/);
        if (arrayMatch && arrayMatch[1]) {
          return arrayMatch[1];
        }
        return data;
      }
    }

    // Handle object responses
    if (typeof data === 'object' && data !== null) {
      // Check for detail field first (common in DRF)
      if (data.detail) {
        return String(data.detail);
      }

      // Check for non_field_errors (Django REST Auth)
      if (data.non_field_errors && Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return String(data.non_field_errors[0]);
      }

      // Check for field-specific errors in order of priority
      const fieldPriority = ['email', 'password', 'password1', 'password2', 'first_name', 'last_name', 'phone_number'];
      
      for (const field of fieldPriority) {
        if (data[field] && Array.isArray(data[field]) && data[field].length > 0) {
          const firstError = data[field][0];
          if (typeof firstError === 'string') {
            return firstError;
          }
          if (typeof firstError === 'object' && firstError.detail) {
            return String(firstError.detail);
          }
          // Check for ErrorDetail format in arrays
          const errorStr = JSON.stringify(firstError);
          const errorMatch = errorStr.match(/string='([^']+)'/);
          if (errorMatch && errorMatch[1]) {
            return errorMatch[1];
          }
          return String(firstError);
        }
      }

      // Check any other field errors
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) && value.length > 0) {
          const firstError = value[0];
          if (typeof firstError === 'string') {
            return firstError;
          }
          if (typeof firstError === 'object' && firstError.detail) {
            return String(firstError.detail);
          }
          // Check for ErrorDetail format in arrays
          const errorStr = JSON.stringify(firstError);
          const errorMatch = errorStr.match(/string='([^']+)'/);
          if (errorMatch && errorMatch[1]) {
            return errorMatch[1];
          }
          return String(firstError);
        } else if (value && typeof value === 'string') {
          return value;
        }
      }
    }

    return null;
  };

  // Extract the actual error message
  const actualErrorMessage = extractMessage(data);

  // Return specific error messages based on status if no actual message found
  if (actualErrorMessage) {
    return actualErrorMessage;
  }

  // Fallback messages based on status codes
  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid email or password.';
    case 403:
      return 'Account is deactivated. Contact support.';
    case 404:
      return 'Service not found.';
    case 409:
      return 'Account already exists with this email.';
    case 422:
      return 'Validation error. Please check your input.';
    case 429:
      return 'Too many requests. Please wait a moment.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
};

export const handleApiError = (error: any, customMessage?: string) => {
  let errorShown = false;

  if (!axios.isAxiosError(error)) {
    toast.error("Error", { description: customMessage || "An unexpected error occurred." });
    console.error('API Error: Non-Axios error', error);
    return;
  }

  // Network or axios cancellation errors
  if (!error.response) {
    toast.error("Network Error", { description: error.message || 'Please check your internet connection.' });
    console.error('API Error: Network or Cancellation', error);
    return;
  }

  const { status, data } = error.response;

  // Helper function to extract error message from various Django formats
  const extractErrorMessage = (data: any): string | null => {
    // Handle Django REST framework ErrorDetail format
    if (typeof data === 'string') {
      // Try to parse JSON first
      try {
        const parsed = JSON.parse(data);
        return extractErrorMessage(parsed);
      } catch {
        // Check for ErrorDetail pattern
        const errorMatch = data.match(/ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)/);
        if (errorMatch && errorMatch[1]) {
          return errorMatch[1];
        }
        // Check for array of ErrorDetail
        const arrayMatch = data.match(/\[ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)\]/);
        if (arrayMatch && arrayMatch[1]) {
          return arrayMatch[1];
        }
        return data;
      }
    }

    // Handle object responses
    if (typeof data === 'object' && data !== null) {
      // Check for detail field first (common in DRF)
      if (data.detail) {
        return String(data.detail);
      }

      // Check for non_field_errors (Django REST Auth)
      if (data.non_field_errors && Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return String(data.non_field_errors[0]);
      }

      // Check for field-specific errors
      for (const [key, value] of Object.entries(data)) {
        if (Array.isArray(value) && value.length > 0) {
          const firstError = value[0];
          if (typeof firstError === 'string') {
            return firstError;
          }
          if (typeof firstError === 'object' && firstError.detail) {
            return String(firstError.detail);
          }
          // Check for ErrorDetail format in arrays
          const errorStr = JSON.stringify(firstError);
          const errorMatch = errorStr.match(/string='([^']+)'/);
          if (errorMatch && errorMatch[1]) {
            return errorMatch[1];
          }
          return String(firstError);
        } else if (value && typeof value === 'string') {
          return value;
        }
      }
    }

    return null;
  };

  // Extract the actual error message
  const actualErrorMessage = extractErrorMessage(data);

  // Handle different HTTP status codes with actual backend messages
  switch (status) {
    case 400:
      if (actualErrorMessage) {
        toast.error("Validation Error", { description: actualErrorMessage });
      } else {
        toast.error("Invalid Request", { description: customMessage || 'Please check your input.' });
      }
      break;

    case 401:
      if (actualErrorMessage) {
        toast.error("Authentication Error", { description: actualErrorMessage });
      } else {
        toast.error('Authentication Required', { description: 'Session expired. Please login again.' });
      }
      break;

    case 403:
      if (actualErrorMessage) {
        toast.error("Permission Denied", { description: actualErrorMessage });
      } else {
        toast.error('Permission Denied', { description: 'You do not have permission to perform this action.' });
      }
      break;

    case 404:
      if (actualErrorMessage) {
        toast.error("Not Found", { description: actualErrorMessage });
      } else {
        toast.error("Not Found", { description: 'The requested resource was not found.' });
      }
      break;

    case 409:
      if (actualErrorMessage) {
        toast.error("Conflict", { description: actualErrorMessage });
      } else {
        toast.error("Conflict", { description: 'The request conflicts with the current state.' });
      }
      break;

    case 422:
      if (actualErrorMessage) {
        toast.error("Validation Error", { description: actualErrorMessage });
      } else {
        toast.error("Validation Error", { description: 'The provided data is invalid.' });
      }
      break;

    case 429:
      toast.error("Too Many Requests", { description: 'Please wait a moment before trying again.' });
      break;

    case 500:
      if (actualErrorMessage) {
        toast.error("Server Error", { description: actualErrorMessage });
      } else {
        toast.error("Server Error", { description: 'An internal server error occurred. Please try again later.' });
      }
      break;

    case 502:
    case 503:
    case 504:
      toast.error("Service Unavailable", { description: 'The service is temporarily unavailable. Please try again later.' });
      break;

    default:
      if (actualErrorMessage) {
        toast.error("Error", { description: actualErrorMessage });
      } else {
        toast.error("Error", { description: customMessage || `An error occurred (${status}).` });
      }
      break;
  }

  // Log the full error for debugging
  console.error('API Error:', {
    status,
    data,
    actualErrorMessage,
    fullError: error
  });
};

// Create Axios instance
export const api = axios.create({
    baseURL: ApiService.BASE_URL,
    withCredentials: true, // Include cookies in requests
});
export const apiPlain = axios.create({
  baseURL: ApiService.BASE_URL
});
// Function to check if a token is expired
const isTokenExpired = (token: string | undefined): boolean => {
    if (!token) return true;
    try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.exp * 1000 < Date.now(); // Convert seconds to milliseconds
    } catch (error) {
        return true;
    }
};

// Token refresh queue handler
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Add subscriber to queue
const subscribeTokenRefresh = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// Notify subscribers when token is refreshed
const onRefreshed = (newToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
};

// Request Interceptor
api.interceptors.request.use(
    async (config: AxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        let accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        // If access token is expired, try to refresh it
        if (isTokenExpired(accessToken) && refreshToken && !isTokenExpired(refreshToken)) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const response = await axios.post<AuthResponse>(ApiService.TOKEN_REFRESH_URL, { refresh: refreshToken }, { withCredentials: true });

                    if (response.status === 200) {
                        accessToken = response.data.access;
                        Cookies.set('accessToken', accessToken, { expires: 1, secure: true, sameSite: 'Strict' }); // Store new accessToken
                        onRefreshed(accessToken); // Notify waiting requests
                    } else {
                        redirectToLogin();
                    }
                } catch (refreshError) {
                    console.error('Token refresh failed:', refreshError);
                    redirectToLogin();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Queue requests while refreshing and continue once token is refreshed
            return new Promise((resolve) => {
                subscribeTokenRefresh((newToken: string) => {
                    if (config.headers) {
                        config.headers.Authorization = `Bearer ${newToken}`;
                    }
                    resolve(config as InternalAxiosRequestConfig);
                });
            });
        }

        // Attach access token to headers if available
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config as InternalAxiosRequestConfig;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest: (AxiosRequestConfig & { _retry?: boolean }) | undefined = error.config;
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // If request fails due to expired token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = Cookies.get('refreshToken');
            if (!refreshToken || isTokenExpired(refreshToken)) {
                redirectToLogin();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post<AuthResponse>(ApiService.TOKEN_REFRESH_URL, { refresh: refreshToken }, { withCredentials: true });

                if (response.status === 200) {
                    const newAccessToken = response.data.access;
                    Cookies.set('accessToken', newAccessToken, { expires: 1, secure: true, sameSite: 'Strict' }); // Store new token

                    // Retry original request with new token
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                redirectToLogin();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
