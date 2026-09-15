import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { MESSAGES } from '../constants';

import { CreateUserDto, FindUsersQueryDto, UpdateUserDto, UpdateUserStatusDto } from '../dtos';
import { UsersRepository } from '../repositories/users.repository';
import { SubscriptionConstraintService } from '@/modules/subscriptions/services/subscription-constraint.service';
import { AuthenticatedUser } from '@/modules/auth/types';
import { UserBranchesRepository } from '../repositories/user-branches.repository';
import { PrismaService } from '@/database/prisma/prisma.service';
import { resolveUserScope } from '../helpers/resolve-user-scope.helper';
import { buildPaginationMeta } from '@/common/pagination';
import { PermissionsService } from '@/modules/permissions/services/permissions.service';
import { RolesService } from '@/modules/roles/services/roles.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly subscriptionConstraintService: SubscriptionConstraintService,
        private readonly userBranchesRepository: UserBranchesRepository,
        private readonly prismaService: PrismaService,
        private readonly permissionsService: PermissionsService,
        private readonly rolesService: RolesService,
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
        const { limit, page } = query;
        const { records, total } = await this.usersRepository.findMany(query);
        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });
        return { records, pagination };
    }

    async get(id: string) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return { user };
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

        const role = await this.rolesService.findById(dto.role_id);
        if (!role) {
            throw new NotFoundException(MESSAGES.ERROR.ROLE_NOT_FOUND);
        }

        const creatorRoleIds = currentUser.roles.map((r) => r.id);
        const isChildRole = await this.rolesService.isChildRole(creatorRoleIds, role);
        if (!isChildRole) {
            throw new ForbiddenException(MESSAGES.ERROR.ROLE_MUST_BE_CHILD);
        }

        if (role.role_scope !== dto.role_scope) {
            throw new BadRequestException(MESSAGES.ERROR.ROLE_SCOPE_MISMATCH);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const {
            branch_id,
            role_scope,
            role_id,
            permission_ids,
            permissions_modified,
            ...userDto
        } = dto;
        const user = await this.prismaService.$transaction(async (tx) => {
            const createdUser = await this.usersRepository.create(
                {
                    ...userDto,
                    pharmacy_id: pharmacyId,
                    password: hashedPassword,
                },
                tx,
            );

            await this.usersRepository.createUserRole(createdUser.id, role_id, tx);

            if (branchId) {
                await this.userBranchesRepository.create(
                    {
                        user_id: createdUser.id,
                        branch_id: branchId,
                    },
                    tx,
                );
            }

            return this.usersRepository.findById(createdUser.id, tx);
        });

        const permissionsModified = Boolean(permissions_modified);
        await this.permissionsService.syncUserPermissionOverrides(
            user!.id,
            [role_id],
            permission_ids ?? [],
            permissionsModified,
        );

        return {
            user,
            message: MESSAGES.SUCCESS.CREATED,
        };
    }

    async update(id: string, dto: UpdateUserDto, currentUser?: AuthenticatedUser) {
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

        const { permission_ids, permissions_modified, role_id, ...updateDto } = dto;

        let roleIds = user.user_roles.map((ur) => ur.role_id);

        if (role_id) {
            const role = await this.rolesService.findById(role_id);
            if (!role) {
                throw new NotFoundException(MESSAGES.ERROR.ROLE_NOT_FOUND);
            }

            if (currentUser) {
                const creatorRoleIds = currentUser.roles.map((r) => r.id);
                const isChildRole = await this.rolesService.isChildRole(creatorRoleIds, role);
                if (!isChildRole) {
                    throw new ForbiddenException(MESSAGES.ERROR.ROLE_MUST_BE_CHILD);
                }
            }

            await this.prismaService.$transaction(async (tx) => {
                await this.usersRepository.deleteUserRoles(id, tx);
                await this.usersRepository.createUserRole(id, role_id, tx);
            });

            roleIds = [role_id];
        }

        const updatedUser = await this.usersRepository.update(id, updateDto);

        const permissionsModified = Boolean(permissions_modified);
        if (permissionsModified) {
            await this.permissionsService.syncUserPermissionOverrides(
                id,
                roleIds,
                permission_ids ?? [],
                permissionsModified,
            );
        }

        return {
            user: updatedUser,
            message: MESSAGES.SUCCESS.UPDATED,
        };
    }


    async updateStatus(id: string, dto: UpdateUserStatusDto) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        const updatedUser = await this.usersRepository.update(id, {
            status: dto.status,
        });
        return {
            user: updatedUser,
            message: MESSAGES.SUCCESS.STATUS_UPDATED,
        };
    }

    async delete(id: string) {
        const user = await this.usersRepository.findById(id);

        if (!user) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        await this.usersRepository.delete(id);
        return { message: MESSAGES.SUCCESS.DELETED };
    }
}
