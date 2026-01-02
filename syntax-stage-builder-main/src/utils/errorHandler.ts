/**
 * User-friendly error message utility
 * Translates technical errors into messages users can understand
 */

export interface UserFriendlyError {
    title: string;
    message: string;
    action?: string;
    variant: 'destructive' | 'warning' | 'info';
}

export function getUserFriendlyError(error: any): UserFriendlyError {
    // Network/Connection errors
    if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.name === 'TypeError') {
        return {
            title: 'Connection Lost',
            message: 'Please check your internet connection and try again.',
            action: 'Retry',
            variant: 'destructive'
        };
    }

    // Get status code
    const status = error.status || error.statusCode || (error.response?.status);

    // Handle specific status codes
    switch (status) {
        case 429:
            return {
                title: 'Too Many Requests',
                message: 'Our service is temporarily busy. Please wait a moment and try again.',
                action: 'Try Again Later',
                variant: 'warning'
            };

        case 503:
        case 504:
            return {
                title: 'Service Temporarily Unavailable',
                message: 'We\'re experiencing high traffic. Please try again in a few moments.',
                action: 'Retry',
                variant: 'warning'
            };

        case 500:
        case 502:
            return {
                title: 'Server Error',
                message: 'Something went wrong on our end. Our team has been notified.',
                action: 'Try Again',
                variant: 'destructive'
            };

        case 404:
            return {
                title: 'Not Found',
                message: 'The requested resource could not be found. It may have been moved or deleted.',
                action: 'Go Back',
                variant: 'warning'
            };

        case 403:
            return {
                title: 'Access Denied',
                message: 'You don\'t have permission to access this resource.',
                action: 'Sign In',
                variant: 'warning'
            };

        case 401:
            return {
                title: 'Authentication Required',
                message: 'Please sign in to continue.',
                action: 'Sign In',
                variant: 'info'
            };

        case 400:
            return {
                title: 'Invalid Request',
                message: error.message || 'Please check your input and try again.',
                variant: 'warning'
            };

        case 408:
            return {
                title: 'Request Timeout',
                message: 'The request took too long. Please try again.',
                action: 'Retry',
                variant: 'warning'
            };

        default:
            // Check for specific error messages
            const errorMsg = error.message?.toLowerCase() || '';

            if (errorMsg.includes('timeout')) {
                return {
                    title: 'Request Timeout',
                    message: 'The request took too long. Please check your connection and try again.',
                    action: 'Retry',
                    variant: 'warning'
                };
            }

            if (errorMsg.includes('quota') || errorMsg.includes('limit')) {
                return {
                    title: 'Service Limit Reached',
                    message: 'You\'ve reached the usage limit. Please try again later.',
                    action: 'Try Again Later',
                    variant: 'warning'
                };
            }

            if (errorMsg.includes('cors')) {
                return {
                    title: 'Connection Error',
                    message: 'Unable to connect to the server. Please try again.',
                    action: 'Retry',
                    variant: 'destructive'
                };
            }

            // Generic fallback
            return {
                title: 'Something Went Wrong',
                message: 'An unexpected error occurred. Please try again.',
                action: 'Retry',
                variant: 'destructive'
            };
    }
}

/**
 * Format error for toast notification
 */
export function getErrorToastConfig(error: any) {
    const friendlyError = getUserFriendlyError(error);

    return {
        title: friendlyError.title,
        description: friendlyError.message,
        variant: friendlyError.variant,
        action: friendlyError.action
    };
}

/**
 * Check if error is a network/connection error
 */
export function isNetworkError(error: any): boolean {
    return (
        error.message?.includes('Failed to fetch') ||
        error.message?.includes('NetworkError') ||
        error.name === 'TypeError' ||
        !navigator.onLine
    );
}

/**
 * Check if error is a server error (5xx)
 */
export function isServerError(error: any): boolean {
    const status = error.status || error.statusCode || error.response?.status;
    return status >= 500 && status < 600;
}

/**
 * Check if error is a client error (4xx)
 */
export function isClientError(error: any): boolean {
    const status = error.status || error.statusCode || error.response?.status;
    return status >= 400 && status < 500;
}
