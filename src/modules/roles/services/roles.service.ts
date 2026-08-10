import { Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '../constants/messages.constants';

import { FindRolesQueryDto, UpdateRolePermissionsDto } from '../dtos';

import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class RolesService {
    constructor(private readonly rolesRepository: RolesRepository) {}

    list(query: FindRolesQueryDto) {
        return this.rolesRepository.findMany(query);
    }

    async get(id: string) {
        const role = await this.rolesRepository.findById(id);

        if (!role) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return { role };
    }

    async getPermissions(roleId: string) {
        const role = await this.rolesRepository.findByIdWithPermissions(roleId);

        if (!role) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return {
            permissions: role.role_permissions.map(({ permission }) => permission),
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
