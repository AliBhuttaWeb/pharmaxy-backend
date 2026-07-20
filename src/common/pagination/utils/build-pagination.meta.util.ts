import type { PaginationMeta } from '../types/pagination.type';

type BuildPaginationMetaParams = {
  currentPage: number;
  limit: number;
  totalRecords: number;
};

export function buildPaginationMeta({
  currentPage,
  limit,
  totalRecords,
}: BuildPaginationMetaParams): PaginationMeta {
  const totalPages = Math.ceil(totalRecords / limit);

  return {
    currentPage,
    limit,
    totalRecords,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
}