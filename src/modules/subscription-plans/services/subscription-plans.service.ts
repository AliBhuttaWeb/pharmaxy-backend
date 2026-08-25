import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import { Prisma } from '@gen/prisma/client';

import { SubscriptionPlansRepository } from '../repositories/subscription-plans.repository';

import {
    CreateSubscriptionPlanDto,
    SubscriptionPlanQueryDto,
    UpdateSubscriptionPlanDto,
    UpdateSubscriptionPlanStatusDto,
} from '../dtos';

import { SUBSCRIPTION_PLAN_MESSAGES } from '../constants';
import { buildPaginationMeta } from '@/common/pagination';

@Injectable()
export class SubscriptionPlansService {
    constructor(private readonly subscriptionPlansRepository: SubscriptionPlansRepository) {}

    async findMany(query: SubscriptionPlanQueryDto) {
        const { page, limit } = query;
        const { records, total } = await this.subscriptionPlansRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async findById(id: string) {
        const plan = await this.subscriptionPlansRepository.findById(id);

        if (!plan) {
            throw new NotFoundException(SUBSCRIPTION_PLAN_MESSAGES.ERROR.NOT_FOUND);
        }

        return plan;
    }

    async create(dto: CreateSubscriptionPlanDto) {
        const exists = await this.subscriptionPlansRepository.findByName(dto.name);

        if (exists) {
            throw new ConflictException(SUBSCRIPTION_PLAN_MESSAGES.ERROR.NAME_ALREADY_EXISTS);
        }

        const data: Prisma.SubscriptionPlanCreateInput = {
            name: dto.name,

            description: dto.description,

            billing_cycle: dto.billing_cycle,

            price: dto.price,

            max_branches: dto.max_branches,

            max_users_per_branch: dto.max_users,

            report_history_months: dto.report_history_months,

            allow_nearby_inventory: dto.allow_nearby_inventory ?? false,

            allow_quick_sale: dto.allow_quick_sale ?? false,

            is_active: dto.is_active ?? true,
        };

        return this.subscriptionPlansRepository.create(data);
    }

    async update(id: string, dto: UpdateSubscriptionPlanDto) {
        const plan = await this.findById(id);

        if (dto.name && dto.name !== plan.name) {
            const exists = await this.subscriptionPlansRepository.findByName(dto.name, id);

            if (exists) {
                throw new ConflictException(SUBSCRIPTION_PLAN_MESSAGES.ERROR.NAME_ALREADY_EXISTS);
            }
        }

        const data: Prisma.SubscriptionPlanUpdateInput = {
            ...(dto.name !== undefined && {
                name: dto.name,
            }),

            ...(dto.description !== undefined && {
                description: dto.description,
            }),

            ...(dto.billing_cycle !== undefined && {
                billing_cycle: dto.billing_cycle,
            }),

            ...(dto.price !== undefined && {
                price: dto.price,
            }),

            ...(dto.max_branches !== undefined && {
                max_branches: dto.max_branches,
            }),

            ...(dto.max_users !== undefined && {
                max_users: dto.max_users,
            }),

            ...(dto.report_history_months !== undefined && {
                report_history_months: dto.report_history_months,
            }),

            ...(dto.allow_nearby_inventory !== undefined && {
                allow_nearby_inventory: dto.allow_nearby_inventory,
            }),

            ...(dto.allow_quick_sale !== undefined && {
                allow_quick_sale: dto.allow_quick_sale,
            }),

            ...(dto.is_active !== undefined && {
                is_active: dto.is_active,
            }),
        };

        return this.subscriptionPlansRepository.update(id, data);
    }

    async updateStatus(id: string, dto: UpdateSubscriptionPlanStatusDto) {
        await this.findById(id);
        return this.subscriptionPlansRepository.updateStatus(id, dto.is_active);
    }
}
