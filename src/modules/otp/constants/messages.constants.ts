export const MESSAGES = {
    SUCCESS: {
        OTP_SENT: 'OTP has been sent successfully. Please check your inbox.',
        OTP_VERIFIED: 'OTP verified successfully.',
        OTP_RESENT: 'A new OTP has been sent successfully. Please check your inbox.',
    },

    ERROR: {
        INVALID_OTP: 'The OTP code you entered is invalid.',
        OTP_EXPIRED: 'The OTP has expired. Please request a new one.',
        OTP_ALREADY_VERIFIED: 'This destination has already been verified.',
        MAX_ATTEMPTS_EXCEEDED: 'Maximum verification attempts exceeded. Please request a new OTP.',
        RESEND_LIMIT_EXCEEDED:
            'You have exceeded the maximum number of OTP requests. Please try again after 24 hours.',
        USER_NOT_FOUND: 'No account found for the provided destination.',
    },
} as const;
