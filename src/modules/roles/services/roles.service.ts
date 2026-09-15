import { Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants/messages.constants';

import { FindRolesQueryDto, UpdateRolePermissionsDto } from '../dtos';

import { RolesRepository } from '../repositories/roles.repository';
import { buildPaginationMeta } from '@/common/pagination';

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

        const childRoles = children.map((child) => ({
            id: child.id,
            name: child.name,
            description: child.description,
            role_scope: child.role_scope,
            signup_scope: child.signup_scope,
            parent_id: child.parent_id,
            permissions: child.role_permissions.map(({ permission }) => permission),
        }));

        return {
            role_permissions: rolePermissions,
            child_permissions: childPermissions,
            child_roles: childRoles,
            permissions: rolePermissions,
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
