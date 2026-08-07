import { Injectable } from '@nestjs/common';

import { RolePermissionsRepository } from '../repositories/role-permissions.repository';

@Injectable()
export class RolePermissionsService {
    constructor(private readonly rolePermissionsRepository: RolePermissionsRepository) {}

    findUserRolePermissions(userId: string) {
        return this.rolePermissionsRepository.findUserRolePermissions(userId);
    }
}
