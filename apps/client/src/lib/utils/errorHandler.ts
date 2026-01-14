// Centralized error handling utility for API responses

interface RTKQueryError {
  status?: number;
  data?: {
    error?: string;
    message?: string;
  };
}

interface FetchError {
  message?: string;
}

/**
 * Extracts a user-friendly error message from RTK Query or Fetch errors
 * @param error - The error object from RTK Query or fetch
 * @param fallback - Default message if no specific error is found
 * @returns User-friendly error message
 */
export function getErrorMessage(
  error: unknown,
  fallback: string = "An unexpected error occurred. Please try again."
): string {
  if (\!error) return fallback;

  // Handle RTK Query errors
  const rtkError = error as RTKQueryError;
  if (rtkError.data?.error) {
    return rtkError.data.error;
  }
  if (rtkError.data?.message) {
    return rtkError.data.message;
  }

  // Handle fetch errors
  const fetchError = error as FetchError;
  if (fetchError.message) {
    return fetchError.message;
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

/**
 * Maps specific error patterns to user-friendly messages
 * @param error - The error object
 * @returns User-friendly error message
 */
export function getFriendlyErrorMessage(error: unknown): string {
  const message = getErrorMessage(error, "").toLowerCase();

  // Authentication errors
  if (message.includes("unauthorized") || message.includes("not authenticated")) {
    return "Please log in to continue.";
  }
  if (message.includes("forbidden") || message.includes("not authorized")) {
    return "You don't have permission to perform this action.";
  }

  // Validation errors
  if (message.includes("invalid") || message.includes("validation")) {
    return "Please check your input and try again.";
  }

  // Network errors
  if (message.includes("network") || message.includes("fetch")) {
    return "Network error. Please check your connection and try again.";
  }

  // Not found errors
  if (message.includes("not found") || message.includes("404")) {
    return "The requested resource was not found.";
  }

  // Server errors
  if (message.includes("server error") || message.includes("500")) {
    return "Server error. Please try again later.";
  }

  // Return original message if no pattern matches
  return getErrorMessage(error);
}

/**
 * Checks if an error is a specific type
 * @param error - The error object
 * @param type - Error type to check for
 * @returns Whether the error matches the type
 */
export function isErrorType(error: unknown, type: "auth" | "validation" | "network" | "server"): boolean {
  const message = getErrorMessage(error, "").toLowerCase();

  switch (type) {
    case "auth":
      return message.includes("unauthorized") || message.includes("forbidden") || message.includes("not authenticated");
    case "validation":
      return message.includes("invalid") || message.includes("validation");
    case "network":
      return message.includes("network") || message.includes("fetch");
    case "server":
      return message.includes("server") || message.includes("500");
    default:
      return false;
  }
}

