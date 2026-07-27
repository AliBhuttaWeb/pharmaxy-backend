export const NEARBY_INVENTORIES_PERMISSIONS = {
    NEARBY_INVENTORIES_SEARCH: {
        name: 'nearby_inventories.search',
        description: 'Search nearby pharmacies for product availability',
    },

    NEARBY_INVENTORIES_VIEW_STORE: {
        name: 'nearby_inventories.store.view',
        description: 'View nearby pharmacy details with available inventory',
    },

    NEARBY_INVENTORIES_RESERVE_ITEM: {
        name: 'nearby_inventories.item.reserve',
        description: 'Reserve item from nearby pharmacy inventory',
    },
} as const;
