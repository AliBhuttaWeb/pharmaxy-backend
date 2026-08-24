import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { MESSAGES } from '../constants';

import { CreateUserDto, FindUsersQueryDto, UpdateUserDto, UpdateUserStatusDto } from '../dtos';
import { UsersRepository } from '../repositories/users.repository';
import { SubscriptionConstraintService } from '@/modules/subscriptions/services/subscription-constraint.service';
import { AuthenticatedUser } from '@/modules/auth/types';
import { UserBranchesRepository } from '../repositories/user-branches.repository';
import { PrismaService } from '@/database/prisma/prisma.service';
import { resolveUserScope } from '../helpers/resolve-user-scope.helper';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly subscriptionConstraintService: SubscriptionConstraintService,
        private readonly userBranchesRepository: UserBranchesRepository,
        private readonly prismaService: PrismaService,
    ) {}

    private async validateUserUniqueness(dto: CreateUserDto) {
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
    }

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
        const { pharmacyId, branchId } = resolveUserScope(dto, currentUser);

        if (pharmacyId && branchId) {
            const currentUserCount = await this.userBranchesRepository.countByBranchId(branchId);
            await this.subscriptionConstraintService.validateUserLimit(
                pharmacyId,
                currentUserCount,
            );
        }

        await this.validateUserUniqueness(dto);

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const { branch_id, role_scope, ...userDto } = dto;
        return this.prismaService.$transaction(async (tx) => {
            const user = await this.usersRepository.create(
                {
                    ...userDto,
                    pharmacy_id: pharmacyId,
                    password: hashedPassword,
                },
                tx,
            );

            if (branchId) {
                await this.userBranchesRepository.create(
                    {
                        user_id: user.id,
                        branch_id: branchId,
                    },
                    tx,
                );
            }

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
