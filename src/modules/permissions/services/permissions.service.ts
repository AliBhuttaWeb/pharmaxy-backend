import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PermissionEffect } from '@gen/prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { PermissionsRepository } from '../repositories/permissions.repository';
import { MESSAGES } from '../constants/messages.constants';
import { FindPermissionsQueryDto } from '../dtos';
import { UserPermissionsService } from './user-permissions.service';
import { RolePermissionsService } from './role-permissions.service';

@Injectable()
export class PermissionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly permissionsRepository: PermissionsRepository,
        private readonly userPermissionsService: UserPermissionsService,
        private readonly rolePermissionsService: RolePermissionsService,
    ) {}

    async syncUserPermissionOverrides(
        userId: string,
        roleIds: string[],
        selectedPermissionIds: string[],
        permissionsModified: boolean,
    ): Promise<void> {
        if (!permissionsModified) {
            return;
        }

        // ---------------------------------------------------------------------
        // Load current state
        // ---------------------------------------------------------------------

        const rolePermissions = await this.permissionsRepository.getRolePermissions(roleIds);

        const userPermissionOverrides =
            await this.permissionsRepository.getUserPermissionOverrides(userId);

        const selectedPermissions = new Set(selectedPermissionIds);

        if (selectedPermissions.size !== selectedPermissionIds.length) {
            throw new BadRequestException(MESSAGES.ERROR.DUPLICATE_PERMISSION_IDS);
        }

        // ---------------------------------------------------------------------
        // Determine required changes
        // ---------------------------------------------------------------------

        const permissionUniverse = new Set<string>([
            ...rolePermissions,
            ...selectedPermissions,
            ...userPermissionOverrides.keys(),
        ]);

        const deleteIds: string[] = [];

        const upserts: Array<{
            permissionId: string;
            effect: PermissionEffect;
        }> = [];

        for (const permissionId of permissionUniverse) {
            const inherited = rolePermissions.has(permissionId);

            const selected = selectedPermissions.has(permissionId);

            const existingOverride = userPermissionOverrides.get(permissionId);

            /**
             * User matches inherited permission.
             * Any existing override is no longer required.
             */
            if (inherited === selected) {
                if (existingOverride) {
                    deleteIds.push(existingOverride.id);
                }

                continue;
            }

            /**
             * User differs from inherited permission.
             *
             * Role ✓ User ✗ => DENY
             * Role ✗ User ✓ => ALLOW
             */
            const requiredEffect = inherited ? PermissionEffect.DENY : PermissionEffect.ALLOW;

            /**
             * Override already exists with the correct effect.
             */
            if (existingOverride && existingOverride.effect === requiredEffect) {
                continue;
            }

            upserts.push({
                permissionId,
                effect: requiredEffect,
            });
        }

        if (!deleteIds.length && !upserts.length) {
            return;
        }

        // ---------------------------------------------------------------------
        // Persist changes
        // ---------------------------------------------------------------------

        await this.prisma.transaction(async (tx) => {
            await this.permissionsRepository.deletePermissionOverrides(deleteIds, tx);

            for (const permission of upserts) {
                const existingOverride = userPermissionOverrides.get(permission.permissionId);

                if (existingOverride) {
                    await this.permissionsRepository.updatePermissionOverride(
                        existingOverride.id,
                        permission.effect,
                        tx,
                    );

                    continue;
                }

                await this.permissionsRepository.createPermissionOverride(
                    userId,
                    permission.permissionId,
                    permission.effect,
                    tx,
                );
            }
        });
    }

    list(query: FindPermissionsQueryDto) {
        return this.permissionsRepository.findMany(query);
    }

    async get(id: string) {
        const permission = await this.permissionsRepository.findById(id);

        if (!permission) {
            throw new NotFoundException(MESSAGES.ERROR.NOT_FOUND);
        }

        return permission;
    }

    async getUserPermissions(userId: string): Promise<string[]> {
        const [rolePermissions, userPermissions] = await Promise.all([
            this.rolePermissionsService.findUserRolePermissions(userId),
            this.userPermissionsService.findUserPermissions(userId),
        ]);

        const permissions = new Set<string>();

        // Inherited permissions
        for (const userRole of rolePermissions) {
            for (const rolePermission of userRole.role.role_permissions) {
                permissions.add(rolePermission.permission.name);
            }
        }

        // Direct overrides
        for (const userPermission of userPermissions) {
            switch (userPermission.effect) {
                case PermissionEffect.ALLOW:
                    permissions.add(userPermission.permission.name);
                    break;

                case PermissionEffect.DENY:
                    permissions.delete(userPermission.permission.name);
                    break;
            }
        }

        return [...permissions];
    }
}
