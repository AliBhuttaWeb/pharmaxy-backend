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
import { AuthenticatedUser } from '@/modules/auth/types';
import { ensurePharmacyAccess, getActivePharmacyId, isSuperAdmin } from '@/common/helpers';

@Injectable()
export class SuppliersService {
    constructor(private readonly suppliersRepository: SuppliersRepository) {}

    async list(query: FindSuppliersQueryDto, user?: AuthenticatedUser) {
        if (user) {
            query.pharmacy_id = isSuperAdmin(user.roles)
                ? query.pharmacy_id
                : getActivePharmacyId(user);
        }
        const { limit, page } = query;
        const { records, total } = await this.suppliersRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async get(id: string, user: AuthenticatedUser) {
        const supplier = await this.suppliersRepository.findById(id);

        if (!supplier) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        ensurePharmacyAccess(supplier.pharmacy_id, user);

        return { supplier };
    }

    async create(dto: CreateSupplierDto, user: AuthenticatedUser) {
        const pharmacyId = !isSuperAdmin(user.roles) ? getActivePharmacyId(user) : dto.pharmacy_id;

        const existingSupplier = await this.suppliersRepository.findByName(
            pharmacyId,
            dto.name,
        );

        if (existingSupplier) {
            throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        const supplier = await this.suppliersRepository.create({
            ...dto,
            pharmacy_id: pharmacyId,
        });

        return {
            supplier,
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(id: string, dto: UpdateSupplierDto, user: AuthenticatedUser) {
        const supplier = await this.suppliersRepository.findById(id);

        if (!supplier) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        ensurePharmacyAccess(supplier.pharmacy_id, user);

        if (dto.name && dto.name !== supplier.name) {
            const existingSupplier = await this.suppliersRepository.findByName(
                supplier.pharmacy_id,
                dto.name,
            );

            if (existingSupplier && existingSupplier.id !== id) {
                throw new ConflictException(MESSAGES.ERROR.NAME_ALREADY_EXISTS);
            }
        }

        const updatedSupplier = await this.suppliersRepository.update(id, dto);

        return {
            supplier: updatedSupplier,
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }

    async updateStatus(id: string, dto: UpdateSupplierStatusDto, user: AuthenticatedUser) {
        const supplier = await this.suppliersRepository.findById(id);

        if (!supplier) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        ensurePharmacyAccess(supplier.pharmacy_id, user);

        const updatedSupplier = await this.suppliersRepository.updateStatus(id, dto.status);

        return {
            supplier: updatedSupplier,
            message: MESSAGES.SUCCESS.STATUS_UPDATED,
        };
    }

    async delete(id: string, user: AuthenticatedUser) {
        const supplier = await this.suppliersRepository.findById(id);

        if (!supplier) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        ensurePharmacyAccess(supplier.pharmacy_id, user);

        await this.suppliersRepository.delete(id);

        return {
            message: MESSAGES.SUCCESS.DELETED,
        };
    }
}

