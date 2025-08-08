import { toast } from "sonner";
import axios, { AxiosError } from "axios";

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