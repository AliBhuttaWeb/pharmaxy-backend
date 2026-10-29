import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants/messages.constants';
import { FindRolesQueryDto, UpdateRolePermissionsDto } from '../dtos';
import { RolesRepository } from '../repositories/roles.repository';
import { buildPaginationMeta } from '@/common/pagination';
import type { AuthenticatedUser } from '@/modules/auth/types';
import { groupPermissionsByModule } from '@/modules/permissions/helpers/permissions.helper';
import { PermissionsService } from '@/modules/permissions/services/permissions.service';
import { isSuperAdmin } from '@/common/helpers';

@Injectable()
export class RolesService {
    constructor(
        private readonly rolesRepository: RolesRepository,
        private readonly permissionsService: PermissionsService,
    ) {}

    async list(query: FindRolesQueryDto, currentUser: AuthenticatedUser) {
        const { page, limit } = query;
        let allowedRoleIds: string[] | undefined;

        if (!isSuperAdmin(currentUser.roles)) {
            const parentRoleIds = (currentUser.roles ?? []).map((r) => r.id);
            allowedRoleIds = await this.rolesRepository.findChildRoleIds(parentRoleIds);
        }

        const { records, total } = await this.rolesRepository.findMany(query, allowedRoleIds);

        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return { records, pagination };
    }

    async listSignup(query: FindRolesQueryDto) {
        const { page, limit } = query;
        const { records, total } = await this.rolesRepository.findMany(query, undefined, {
            signupOnly: true,
        });

        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return { records, pagination };
    }

    async getChildRoles(currentUser: AuthenticatedUser, query?: FindRolesQueryDto) {
        return this.list(query ?? {}, currentUser);
    }

    findChildRoleIds(parentRoleIds: string[]) {
        return this.rolesRepository.findChildRoleIds(parentRoleIds);
    }

    getSelfAndChildRoleIds(parentRoleIds: string[]) {
        return this.rolesRepository.getSelfAndChildRoleIds(parentRoleIds);
    }

    findById(id: string) {
        return this.rolesRepository.findById(id);
    }

    isChildRole(
        parentRoleIds: string[],
        targetRole: { id: string; parent_id?: string | null; name?: string },
    ) {
        return this.rolesRepository.isChildRole(parentRoleIds, targetRole);
    }

    isSelfOrChildRole(
        parentRoleIds: string[],
        targetRole: { id: string; parent_id?: string | null; name?: string },
    ) {
        return this.rolesRepository.isSelfOrChildRole(parentRoleIds, targetRole);
    }

    async get(id: string, currentUser: AuthenticatedUser) {
        const role = await this.rolesRepository.findById(id);

        if (!role) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (!isSuperAdmin(currentUser.roles)) {
            const parentRoleIds = (currentUser.roles ?? []).map((r) => r.id);
            const isSelfOrChild = await this.rolesRepository.isSelfOrChildRole(parentRoleIds, role);
            if (!isSelfOrChild) {
                throw new ForbiddenException(MESSAGES.ERROR.ROLE_VIEW_FORBIDDEN);
            }
        }

        return { role };
    }

    async getPermissions(roleId: string, currentUser: AuthenticatedUser) {
        const role = await this.rolesRepository.findByIdWithPermissions(roleId);

        if (!role) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (!isSuperAdmin(currentUser.roles)) {
            const parentRoleIds = (currentUser.roles ?? []).map((r) => r.id);
            const isSelfOrChild = await this.rolesRepository.isSelfOrChildRole(parentRoleIds, role);
            if (!isSelfOrChild) {
                throw new ForbiddenException(MESSAGES.ERROR.ROLE_PERMISSION_VIEW_FORBIDDEN);
            }
        }

        const permissions = role.role_permissions.map(({ permission }) => permission);

        return { permissions: groupPermissionsByModule(permissions) };
    }

    async replacePermissions(
        roleId: string,
        dto: UpdateRolePermissionsDto,
        currentUser: AuthenticatedUser,
    ) {
        const role = await this.rolesRepository.findById(roleId);

        if (!role) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        if (!isSuperAdmin(currentUser.roles)) {
            const parentRoleIds = (currentUser.roles ?? []).map((r) => r.id);
            const isChild = await this.rolesRepository.isChildRole(parentRoleIds, role);
            if (!isChild) {
                throw new ForbiddenException(MESSAGES.ERROR.ROLE_PERMISSION_UPDATE_FORBIDDEN);
            }

            if (dto.permission_ids?.length) {
                const allowedRoleIds =
                    await this.rolesRepository.getSelfAndChildRoleIds(parentRoleIds);
                const allowedPermissionIds =
                    await this.permissionsService.getRolePermissions(allowedRoleIds);

                for (const permissionId of dto.permission_ids) {
                    if (!allowedPermissionIds.has(permissionId)) {
                        throw new ForbiddenException(
                            MESSAGES.ERROR.ROLE_ASSIGN_PERMISSION_FORBIDDEN,
                        );
                    }
                }
            }
        }

        const updatedRole = await this.rolesRepository.replacePermissions(
            roleId,
            dto.permission_ids,
        );

        return {
            permissions: updatedRole.role_permissions.map(({ permission }) => permission),
        };
    }
}
