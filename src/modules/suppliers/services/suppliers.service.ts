import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants';
import {
    CreateSupplierDto,
    FindSuppliersQueryDto,
    UpdateSupplierDto,
    UpdateSupplierStatusDto,
} from '../dtos';
import { SuppliersRepository } from '../repositories/suppliers.repository';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class SuppliersService {
    constructor(private readonly suppliersRepository: SuppliersRepository) {}

    async list(query: FindSuppliersQueryDto) {
        const { limit, page } = query;
        const { records, total } = await this.suppliersRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async get(id: string) {
        const supplier = await this.suppliersRepository.findById(id);

        if (!supplier) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return supplier;
    }

    async create(dto: CreateSupplierDto) {
        const existingSupplier = await this.suppliersRepository.findByName(
            dto.pharmacy_id,
            dto.name,
        );

        if (existingSupplier) {
            throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        await this.suppliersRepository.create(dto);

        return {
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(id: string, dto: UpdateSupplierDto) {
        const supplier = await this.suppliersRepository.findById(id);

        if (!supplier) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (dto.name && dto.name !== supplier.name) {
            const existingSupplier = await this.suppliersRepository.findByName(
                supplier.pharmacy_id,
                dto.name,
            );

            if (existingSupplier && existingSupplier.id !== id) {
                throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
            }
        }

        await this.suppliersRepository.update(id, dto);

        return {
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async updateStatus(id: string, dto: UpdateSupplierStatusDto) {
        const supplier = await this.suppliersRepository.findById(id);

        if (!supplier) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.suppliersRepository.updateStatus(id, dto.status);

        return {
            message: MESSAGES.SUCCESS.STATUS_UPDATED,
        };
    }

    async delete(id: string) {
        const supplier = await this.suppliersRepository.findById(id);

        if (!supplier) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.suppliersRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }
}
