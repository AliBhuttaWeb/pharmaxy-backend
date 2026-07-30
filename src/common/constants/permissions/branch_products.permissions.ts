export const BRANCH_PRODUCTS_PERMISSIONS = {
    BRANCH_PRODUCT_VIEW_LIST: {
        name: 'branch_products.view.list',
        description: 'View branch products listing',
    },

    BRANCH_PRODUCT_VIEW_DETAIL: {
        name: 'branch_products.view.detail',
        description: 'View branch product details',
    },

    BRANCH_PRODUCT_CREATE: {
        name: 'branch_products.create',
        description: 'Add products to branch inventory',
    },

    BRANCH_PRODUCT_UPDATE: {
        name: 'branch_products.update',
        description: 'Update branch product information',
    },

    BRANCH_PRODUCT_DELETE: {
        name: 'branch_products.delete',
        description: 'Remove products from branch inventory',
    },

    BRANCH_PRODUCT_VIEW_STOCK: {
        name: 'branch_products.stock.view',
        description: 'View branch product stock',
    },

    BRANCH_PRODUCT_UPDATE_PRICE: {
        name: 'branch_products.price.update',
        description: 'Update branch product selling price',
    },
} as const;
