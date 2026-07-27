import { PermissionEffect } from '@prisma/client';

export type PermissionOverrideAction =
    | {
          type: 'DELETE';
          id: string;
      }
    | {
          type: 'UPSERT';
          permissionId: string;
          effect: PermissionEffect;
      };
