export const ROLE_SCOPES = {
    GLOBAL: 'GLOBAL', // Not tied to a specific pharmacy or branch
    PHARMACY: 'PHARMACY', // Tied to a specific pharmacy
    BRANCH: 'BRANCH', // Tied to a specific branch
    USER: 'USER', // Individual user-level scope
} as const;
