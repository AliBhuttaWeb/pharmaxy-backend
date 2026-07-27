import { Injectable } from '@nestjs/common';
import { PermissionEffect } from '@prisma/client';

import { PrismaService } from '@/database/prisma/prisma.service';

import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly permissionsRepository: PermissionsRepository,
    ) {}

    async syncUserPermissionOverrides(
        userId: string,
        roleIds: string[],
        selectedPermissionIds: string[],
    ): Promise<void> {
        // ---------------------------------------------------------------------
        // Load current state
        // ---------------------------------------------------------------------

        const rolePermissions = await this.permissionsRepository.getRolePermissions(roleIds);

        const userPermissionOverrides =
            await this.permissionsRepository.getUserPermissionOverrides(userId);

        const selectedPermissions = new Set(selectedPermissionIds);

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
}
