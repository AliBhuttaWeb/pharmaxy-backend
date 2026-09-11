import { Injectable } from '@nestjs/common';

import { Prisma } from '@gen/prisma/client';
import { PrismaService } from '@/database/prisma/prisma.service';

import { CreateManufacturerDto, FindManufacturersQueryDto, UpdateManufacturerDto } from '../dtos';

@Injectable()
export class ManufacturersRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findMany(query: FindManufacturersQueryDto) {
        const { search, page, limit, sort_by, sort_order } = query;

        const where: Prisma.ManufacturerWhereInput = {
            deleted_at: null,

            ...(search && {
                OR: [
                    {
                        name: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                    {
                        description: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }),
        };

        const sortableFields = ['name', 'created_at', 'updated_at'] as const;
        type SortableField = (typeof sortableFields)[number];

        const field: SortableField =
            sort_by && sortableFields.includes(sort_by as SortableField)
                ? (sort_by as SortableField)
                : 'created_at';

        const orderBy: Prisma.ManufacturerOrderByWithRelationInput = {
            [field]: sort_order || 'desc',
        };

        const isPaginated = page !== undefined && limit !== undefined;

        if (!isPaginated) {
            const records = await this.prisma.manufacturer.findMany({
                where,
                orderBy,
            });
            return { records };
        }

        const [records, total] = await this.prisma.$transaction([
            this.prisma.manufacturer.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.manufacturer.count({
                where,
            }),
        ]);

        return {
            records,
            total,
        };
    }

    findById(id: string) {
        return this.prisma.manufacturer.findFirst({
            where: {
                id,
                deleted_at: null,
            },
        });
    }

    findByName(name: string) {
        return this.prisma.manufacturer.findFirst({
            where: {
                name,
                deleted_at: null,
            },
        });
    }

    create(dto: CreateManufacturerDto) {
        return this.prisma.manufacturer.create({
            data: dto,
        });
    }

    update(id: string, dto: UpdateManufacturerDto) {
        return this.prisma.manufacturer.update({
            where: {
                id,
            },
            data: dto,
        });
    }

    delete(id: string) {
        return this.prisma.manufacturer.update({
            where: {
                id,
            },
            data: {
                deleted_at: new Date(),
            },
        });
    }
}
