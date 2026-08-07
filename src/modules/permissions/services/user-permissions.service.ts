import { Injectable, NotFoundException } from '@nestjs/common';

import { MESSAGES } from '@/common/constants';

import { UserPermissionsRepository } from '../repositories/user-permissions.repository';

@Injectable()
export class UserPermissionsService {
    constructor(private readonly userPermissionsRepository: UserPermissionsRepository) {}

    async findUserPermissions(userId: string) {
        return this.userPermissionsRepository.findUserPermissions(userId);
    }
}
