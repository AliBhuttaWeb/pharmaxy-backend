export const PRODUCTS_PERMISSIONS = {
    PRODUCT_VIEW_LIST: {
        name: 'products.view.list',
        description: 'View products listing',
    },

    PRODUCT_VIEW_DETAIL: {
        name: 'products.view.detail',
        description: 'View product details',
    },

    PRODUCT_CREATE: {
        name: 'products.create',
        description: 'Create products',
    },

    PRODUCT_UPDATE: {
        name: 'products.update',
        description: 'Update products',
    },

    PRODUCT_DELETE: {
        name: 'products.delete',
        description: 'Delete products',
    },

    PRODUCT_IMPORT: {
        name: 'products.import',
        description: 'Import products in bulk',
    },

    PRODUCT_EXPORT: {
        name: 'products.export',
        description: 'Export products data',
    },
} as const;
