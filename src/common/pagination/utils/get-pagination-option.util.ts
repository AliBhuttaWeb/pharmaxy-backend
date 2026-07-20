import type { PrismaPaginationOptions } from '../types/pagination.type';

export function getPaginationOptions(
  page: number,
  limit: number,
): PrismaPaginationOptions {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}