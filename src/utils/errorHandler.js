/**
 * Custom error classes for API handling
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

/**
 * Handle API errors and return user-friendly messages
 * @param {Error} error - The error to handle
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (error instanceof NetworkError) {
    return 'Network connection failed. Please check your internet connection.';
  }
  
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your message and try again.';
      case 401:
        return 'Authentication failed. Please refresh the page.';
      case 403:
        return 'Access denied. You may not have permission to perform this action.';
      case 404:
        return 'Service not found. The chat service may be unavailable.';
      case 429:
        return 'Too many requests. Please wait a moment before trying again.';
      case 500:
        return 'Server error. Please try again in a few moments.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  // Generic error handling
  if (error.message.includes('fetch')) {
    return 'Unable to connect to the chat service. Please try again.';
  }
  
  return error.message || 'Something went wrong. Please try again.';
};