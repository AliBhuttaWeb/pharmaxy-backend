export const MESSAGES = {
    SUCCESS: {
        FETCHED: 'Product retrieved successfully.',
        FETCHED_LIST: 'Products retrieved successfully.',
        CREATED: 'Product created successfully.',
        UPDATED: 'Product updated successfully.',
        DELETED: 'Product deleted successfully.',
    },

    ERROR: {
        NOT_FOUND: 'Product not found.',
        BARCODE_ALREADY_EXISTS: 'Product with this barcode already exists.',
        MANUFACTURER_NOT_FOUND: 'Manufacturer not found.',
        PRODUCT_TYPE_NOT_FOUND: 'Product type not found.',
        RETAIL_CATEGORY_NOT_FOUND: 'Retail category not found.',
        DOSAGE_FORM_NOT_FOUND: 'Dosage form not found.',
    },
} as const;
