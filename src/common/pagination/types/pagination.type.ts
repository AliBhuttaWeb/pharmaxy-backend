import type { Prisma } from '@prisma/client';

export type PaginationMeta = {
    currentPage: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
};

export type PaginatedData<T> = {
    items: T[];
    pagination: PaginationMeta;
};

export type PrismaPaginationOptions = {
    skip: number;
    take: number;
};
