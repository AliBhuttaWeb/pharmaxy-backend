export const ROLE_SCOPES = {
    GLOBAL: 'global', // Not tied to a specific pharmacy or branch
    PHARMACY: 'pharmacy', // Tied to a specific pharmacy
    BRANCH: 'branch', // Tied to a specific branch
    USER: 'user', // Individual user-level scope
} as const;
