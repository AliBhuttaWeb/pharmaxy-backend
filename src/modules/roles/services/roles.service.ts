import { Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants/messages.constants';

import { FindRolesQueryDto, UpdateRolePermissionsDto } from '../dtos';

import { RolesRepository } from '../repositories/roles.repository';
import { buildPaginationMeta } from '@/common/pagination';
import type { AuthenticatedUser } from '@/modules/auth/types';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) {}

    async list(query: FindRolesQueryDto) {
        const { page, limit } = query;
        const { records, total } = await this.rolesRepository.findMany(query);

        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return { records, pagination };
    }

    async getChildRoles(currentUser: AuthenticatedUser, query?: FindRolesQueryDto) {
        const parentRoleIds = (currentUser.roles ?? []).map((r) => r.id);
        const childRoleIds = await this.rolesRepository.findChildRoleIds(parentRoleIds);

        const { page, limit } = query ?? {};
        const { records, total } = await this.rolesRepository.findMany(query, childRoleIds);

        if (!total || !page || !limit) return { records };
        const pagination = buildPaginationMeta({ currentPage: page, limit, totalRecords: total });

        return { records, pagination };
    }

    findChildRoleIds(parentRoleIds: string[]) {
        return this.rolesRepository.findChildRoleIds(parentRoleIds);
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

    async get(id: string) {
        const role = await this.rolesRepository.findById(id);

        if (!role) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return { role };
    }

    async getPermissions(roleId: string) {
        const result = await this.rolesRepository.findRoleAndDescendantsWithPermissions(roleId);

        if (!result) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        const { role, children } = result;

        const rolePermissions = role.role_permissions.map(({ permission }) => permission);

        const childPermissionsMap = new Map<string, (typeof rolePermissions)[number]>();
        for (const child of children) {
            for (const { permission } of child.role_permissions) {
                if (!childPermissionsMap.has(permission.id)) {
                    childPermissionsMap.set(permission.id, permission);
                }
            }
        }
        const childPermissions = Array.from(childPermissionsMap.values());

        return {
            role_permissions: rolePermissions,
            child_permissions: childPermissions,
        };
    }

    async replacePermissions(roleId: string, dto: UpdateRolePermissionsDto) {
        await this.get(roleId);
        const role = await this.rolesRepository.replacePermissions(roleId, dto.permission_ids);

        return {
            permissions: role.role_permissions.map(({ permission }) => permission),
        };
    }
}
