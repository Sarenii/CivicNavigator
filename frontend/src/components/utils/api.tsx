import axios, { AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie'; // Import js-cookie
import ApiService from '../../../handler/ApiService';
import { toast } from "sonner";
interface ApiErrorResponse {
    detail?: string;
    [key: string]: unknown;
}

interface AuthResponse {
    access: string;
    refresh: string;
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

  // Try to extract ErrorDetail from the entire response text first
  if (!errorShown) {
    const responseText = JSON.stringify(data);
    const errorDetailPattern = /ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)/g;
    const matches = [...responseText.matchAll(errorDetailPattern)];

    if (matches.length > 0) {
      toast.error("Error", { description: matches[0][1] });
      errorShown = true;
    }
  }

  // Handle string data that might be a representation of an object
  if (!errorShown && typeof data === 'string') {
    try {
      const parsedData = JSON.parse(data);
      error.response.data = parsedData; // Update error.response.data for further processing
    } catch (e) {
      // If it's not JSON, check if it's a Python-like error format
      const errorMatch = data.match(/\[ErrorDetail\(string='([^']+)',\s*code='([^']+)'\)\]/);
      if (errorMatch && errorMatch[1]) {
        toast.error("Error", { description: errorMatch[1] });
        errorShown = true;
      }
    }
  }

  // Handle different HTTP status codes
  if (!errorShown) {
    switch (status) {
      case 400:
        if (typeof data === 'object' && data !== null) {
          for (const [key, value] of Object.entries(data)) {
            if (errorShown) break;

            if (Array.isArray(value) && value.length > 0) {
              const valueStr = JSON.stringify(value[0]);
              const errorMatch = valueStr.match(/string='([^']+)'/);
              if (errorMatch && errorMatch[1]) {
                toast.error(`Validation Error: ${key}`, { description: errorMatch[1] });
                errorShown = true;
                break;
              }

              if (typeof value[0] === 'object' && (value[0] as ApiError).detail) {
                toast.error(`Validation Error: ${key}`, { description: (value[0] as ApiError).detail });
                errorShown = true;
                break;
              } else if (typeof value[0] === 'string') {
                toast.error(`Validation Error: ${key}`, { description: value[0] });
                errorShown = true;
                break;
              } else if (value[0] !== null) {
                toast.error(`Validation Error: ${key}`, { description: String(value[0]) });
                errorShown = true;
                break;
              }
            } else if (value) {
              toast.error(`Validation Error: ${key}`, { description: String(value) });
              errorShown = true;
              break;
            }
          }
        }

        if (!errorShown) {
          toast.error("Invalid Request", { description: customMessage || (data?.detail) || 'Please check your input.' });
          errorShown = true;
        }
        break;

      case 401:
        toast.error('Authentication Required', { description: 'Session expired. Please login again.' });
        errorShown = true;
        // Consider redirecting to login page or triggering a logout action
        break;

      case 403:
        toast.error('Permission Denied', { description: data?.error || 'You do not have permission to perform this action.' });
        errorShown = true;
        break;

      case 404:
        toast.error('Not Found', { description: customMessage || 'The requested resource could not be found.' });
        errorShown = true;
        break;

      case 429:
        toast.error('Too Many Requests', { description: 'You have sent too many requests. Please try again later.' });
        errorShown = true;
        break;

      case 500:
        toast.error('Server Error', { description: 'An internal server error occurred. Please try again later.' });
        errorShown = true;
        break;

      default:
        toast.error('Error', { description: customMessage || (data?.detail) || 'An unexpected error occurred.' });
        errorShown = true;
    }
  }

  console.error('API Error Details:', {
    status,
    data,
    endpoint: error.config?.url,
    method: error.config?.method,
    originalError: error
  });
};

// Create Axios instance
export const api = axios.create({
    baseURL: ApiService.BASE_URL,
    withCredentials: true, // Include cookies in requests
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
        if (isTokenExpired(accessToken) && refreshToken) {
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
