export const MESSAGES = Object.freeze({
    AUTH: {
        SUCCESS: {
            LOGIN: 'Login successful.',
            LOGOUT: 'Logout successful.',
            REGISTER: 'Registration completed successfully.',
            PASSWORD_CHANGED: 'Password changed successfully.',
            PASSWORD_RESET: 'Password reset successfully.',
            PASSWORD_RESET_LINK_SENT: 'Password reset link sent successfully.',
            EMAIL_VERIFIED: 'Email verified successfully.',
            TOKEN_REFRESHED: 'Token refreshed successfully.',
        },

        ERROR: {
            ACCOUNT_DELETED: 'It seems your account has been deleted.',
            ACCOUNT_DISABLED: 'Your account has been disabled.',
            ACCOUNT_LOCKED: 'Your account has been locked.',
            ACCOUNT_NOT_VERIFIED: 'Your account is not verified.',
            INVALID_CREDENTIALS: 'Invalid email or password.',
            INVALID_TOKEN: 'Invalid token.',
            TOKEN_EXPIRED: 'Token has expired.',
            ACCESS_DENIED: 'Access denied.',
            INVALID_OLD_PASSWORD: 'Current password is incorrect.',
            INVALID_REFRESH_TOKEN: 'Refresh token is invalid.',
            EMAIL_NOT_VERIFIED: 'Please verify your email address before signing in.',
            PHONE_NOT_VERIFIED: 'Please verify your phone number before signing in.',
            UNAUTHORIZED: "You're not unauthorized person to perform this action.",
            FORBIDDEN: "You're not allowed to perform this action.",
        },
    },

    USERS: {
        SUCCESS: {
            CREATED: 'User created successfully.',
            UPDATED: 'User updated successfully.',
            DELETED: 'User deleted successfully.',
            FETCHED: 'User retrieved successfully.',
            LIST_FETCHED: 'Users retrieved successfully.',
        },

        ERROR: {
            NOT_FOUND: 'User not found.',
            ALREADY_EXISTS: 'User already exists.',
            EMAIL_ALREADY_EXISTS: 'Email already exists.',
            PHONE_ALREADY_EXISTS: 'Phone number already exists.',
        },
    },

    ROLES: {
        SUCCESS: {
            CREATED: 'Role created successfully.',
            UPDATED: 'Role updated successfully.',
            DELETED: 'Role deleted successfully.',
            FETCHED: 'Role retrieved successfully.',
            LIST_FETCHED: 'Roles retrieved successfully.',
        },

        ERROR: {
            NOT_FOUND: 'Role not found.',
            ALREADY_EXISTS: 'Role already exists.',
        },
    },

    PERMISSIONS: {
        SUCCESS: {
            FETCHED: 'Permissions retrieved successfully.',
        },

        ERROR: {
            NOT_FOUND: 'Permission not found.',
            DENIED: 'You do not have permission to perform this action.',
        },
    },

    COMMON: {
        SUCCESS: {
            CREATED: 'Created successfully.',
            UPDATED: 'Updated successfully.',
            DELETED: 'Deleted successfully.',
            FETCHED: 'Data retrieved successfully.',
            LIST_FETCHED: 'Data retrieved successfully.',
            UPLOADED: 'Uploaded successfully.',
            IMPORTED: 'Imported successfully.',
            EXPORTED: 'Exported successfully.',
            COMPLETED: 'Operation completed successfully.',
        },

        ERROR: {
            BAD_REQUEST: 'Invalid request.',
            UNAUTHORIZED: 'Unauthorized.',
            FORBIDDEN: 'You do not have permission to perform this action.',
            NOT_FOUND: 'Resource not found.',
            CONFLICT: 'Resource already exists.',
            VALIDATION_FAILED: 'Validation failed.',
            TOO_MANY_REQUESTS: 'Too many requests. Please try again later.',
            INTERNAL_SERVER_ERROR: 'Something went wrong.',
            SERVICE_UNAVAILABLE: 'Service is temporarily unavailable.',
        },
    },
} as const);
