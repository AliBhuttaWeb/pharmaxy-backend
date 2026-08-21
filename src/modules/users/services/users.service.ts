import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { MESSAGES } from '../constants';

import { CreateUserDto, FindUsersQueryDto, UpdateUserDto, UpdateUserStatusDto } from '../dtos';
import { UsersRepository } from '../repositories/users.repository';
import { SubscriptionConstraintService } from '@/modules/subscriptions/services/subscription-constraint.service';
import { AuthenticatedUser } from '@/modules/auth/types';
import { isSuperAdmin } from '@/common/helpers';
import { UserBranchesRepository } from '../repositories/user-branches.repository';
import { PrismaService } from '@/database/prisma/prisma.service';
import { MESSAGES as PHARMACY_MESSAGES } from '@modules/pharmacies/constants';
import { MESSAGES as BRANCHES_MESSAGES } from '@modules/branches/constants';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly subscriptionConstraintService: SubscriptionConstraintService,
        private readonly userBranchesRepository: UserBranchesRepository,
        private readonly prismaService: PrismaService,
    ) {}

    async list(query: FindUsersQueryDto) {
        return this.usersRepository.findMany(query);
    }

    async get(id: string) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return user;
    }

    async create(dto: CreateUserDto, currentUser: AuthenticatedUser) {
        const isUserSuperAdmin = isSuperAdmin(currentUser.roles);
        const targetPharmacyId = isUserSuperAdmin
            ? (dto.pharmacy_id ?? currentUser.pharmacy_id)
            : currentUser.pharmacy_id;

        const targetBranchId = isUserSuperAdmin
            ? (dto.branch_id ?? currentUser.branch_id)
            : currentUser.branch_id;

        if (!targetPharmacyId) {
            throw new Error(PHARMACY_MESSAGES.ERROR.PHARMACY_ID_REQUIRED);
        }

        if (!targetBranchId) {
            throw new Error(BRANCHES_MESSAGES.ERROR.BRANCH_ID_REQUIRED);
        }

        const currentUserCount = await this.userBranchesRepository.countByBranchId(targetBranchId);
        await this.subscriptionConstraintService.validateUserLimit(
            targetPharmacyId,
            currentUserCount,
        );

        const existingEmail = await this.usersRepository.findByEmail(dto.email);

        if (existingEmail) {
            throw new ConflictException(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
        }

        if (dto.phone) {
            const existingPhone = await this.usersRepository.findByPhone(dto.phone);

            if (existingPhone) {
                throw new ConflictException(MESSAGES.ERROR.PHONE_ALREADY_EXISTS);
            }
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        return this.prismaService.$transaction(async (tx) => {
            const user = await this.usersRepository.create(
                {
                    ...dto,
                    pharmacy_id: targetPharmacyId,
                    password: hashedPassword,
                },
                tx,
            );

            await this.userBranchesRepository.create(
                {
                    user_id: user.id,
                    branch_id: targetBranchId,
                },
                tx,
            );

            return user;
        });
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (dto.email && dto.email !== user.email) {
            const existingEmail = await this.usersRepository.findByEmail(dto.email);

            if (existingEmail) {
                throw new ConflictException(MESSAGES.ERROR.EMAIL_ALREADY_EXISTS);
            }
        }

        if (dto.phone && dto.phone !== user.phone) {
            const existingPhone = await this.usersRepository.findByPhone(dto.phone);

            if (existingPhone) {
                throw new ConflictException(MESSAGES.ERROR.PHONE_ALREADY_EXISTS);
            }
        }

        return this.usersRepository.update(id, dto);
    }

    async updateStatus(id: string, dto: UpdateUserStatusDto) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return this.usersRepository.update(id, {
            status: dto.status,
        });
    }

    async delete(id: string) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return this.usersRepository.delete(id);
    }
}
