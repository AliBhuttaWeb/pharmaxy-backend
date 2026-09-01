import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { buildPaginationMeta } from '@/common/pagination';

import { Prisma } from '@gen/prisma/client';

import { CustomersRepository } from '../repositories/customers.repository';

import { CreateCustomerDto, CustomerQueryDto, UpdateCustomerDto } from '../dtos';

import { BranchesService } from '@/modules/branches/services/branches.service';

import { AuthenticatedUser } from '@/modules/auth/types';
import { MESSAGES } from '../constants';

@Injectable()
export class CustomersService {
    constructor(
        private readonly customersRepository: CustomersRepository,

        private readonly branchesService: BranchesService,
    ) {}

    async findMany(branchId: string, query: CustomerQueryDto) {
        const branch = await this.branchesService.findById(branchId);
        const { limit, page } = query;
        const { records, total } = await this.customersRepository.findMany(branch.pharmacy_id, query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const customer = await this.customersRepository.findById(id);

        if (!customer) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return customer;
    }

    async create(pharmacyId: string, dto: CreateCustomerDto, user: AuthenticatedUser) {
        if (dto.phone) {
            const exists = await this.customersRepository.findByPhone(pharmacyId, dto.phone);

            if (exists) {
                throw new ConflictException(MESSAGES.ERROR.PHONE_ALREADY_EXISTS);
            }
        }

        if (dto.email) {
            const exists = await this.customersRepository.findByEmail(pharmacyId, dto.email);

            if (exists) {
                throw new ConflictException(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
            }
        }

        const customerCode = await this.generateCustomerCode(pharmacyId);

        const data: Prisma.CustomerCreateInput = {
            pharmacy: {
                connect: {
                    id: pharmacyId,
                },
            },

            customer_code: customerCode,

            first_name: dto.first_name,

            last_name: dto.last_name,

            phone: dto.phone,

            email: dto.email,

            gender: dto.gender,

            date_of_birth: dto.date_of_birth ? new Date(dto.date_of_birth) : undefined,

            address: dto.address,

            city: dto.city,

            state: dto.state,

            country: dto.country,

            postal_code: dto.postal_code,

            notes: dto.notes,

            is_walk_in: dto.is_walk_in ?? false,

            created_by: user.id,
        };

        return this.customersRepository.create(data);
    }

    async update(id: string, dto: UpdateCustomerDto, user: AuthenticatedUser) {
        const customer = await this.findById(id);

        if (dto.phone && dto.phone !== customer.phone) {
            const exists = await this.customersRepository.findByPhone(
                customer.pharmacy_id,
                dto.phone,
                id,
            );

            if (exists) {
                throw new ConflictException(MESSAGES.ERROR.PHONE_ALREADY_EXISTS);
            }
        }

        if (dto.email && dto.email !== customer.email) {
            const exists = await this.customersRepository.findByEmail(
                customer.pharmacy_id,
                dto.email,
                id,
            );

            if (exists) {
                throw new ConflictException(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
            }
        }

        const data: Prisma.CustomerUpdateInput = {
            ...(dto.first_name && {
                first_name: dto.first_name,
            }),

            ...(dto.last_name !== undefined && {
                last_name: dto.last_name,
            }),

            ...(dto.phone !== undefined && {
                phone: dto.phone,
            }),

            ...(dto.email !== undefined && {
                email: dto.email,
            }),

            ...(dto.gender !== undefined && {
                gender: dto.gender,
            }),

            ...(dto.date_of_birth !== undefined && {
                date_of_birth: dto.date_of_birth ? new Date(dto.date_of_birth) : null,
            }),

            ...(dto.address !== undefined && {
                address: dto.address,
            }),

            ...(dto.city !== undefined && {
                city: dto.city,
            }),

            ...(dto.state !== undefined && {
                state: dto.state,
            }),

            ...(dto.country !== undefined && {
                country: dto.country,
            }),

            ...(dto.postal_code !== undefined && {
                postal_code: dto.postal_code,
            }),

            ...(dto.notes !== undefined && {
                notes: dto.notes,
            }),

            ...(dto.is_walk_in !== undefined && {
                is_walk_in: dto.is_walk_in,
            }),

            updated_by: user.id,
        };

        return this.customersRepository.update(id, data);
    }

    async delete(id: string) {
        await this.findById(id);

        return this.customersRepository.delete(id);
    }

    private async generateCustomerCode(pharmacyId: string) {
        const latest = await this.customersRepository.findLatestCustomer(pharmacyId);

        if (!latest) {
            return 'CUS-000001';
        }

        const lastNumber = Number(latest.customer_code.replace('CUS-', '')) || 0;

        return `CUS-${String(lastNumber + 1).padStart(6, '0')}`;
    }

    async getOrCreateWalkInCustomer(pharmacyId: string) {
        return this.customersRepository.findOrCreateWalkIn(pharmacyId);
    }
}
