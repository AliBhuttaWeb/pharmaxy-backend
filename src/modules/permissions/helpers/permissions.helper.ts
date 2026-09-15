import * as permissions from '@/common/constants/permissions';

type PermissionKey = keyof typeof permissions;

export type PermissionModule = PermissionKey extends `${infer Module}_PERMISSIONS` ? Module : never;

function getPermissionConstantKey(module: PermissionModule): `${PermissionModule}_PERMISSIONS` {
    return `${module}_PERMISSIONS`;
}

export function getPermissions(...modules: PermissionModule[]) {
    return modules.flatMap((module) => {
        const key = getPermissionConstantKey(module);

        return Object.values(permissions[key]);
    });
}

export function getAllPermissions() {
    return Object.entries(permissions)
        .filter(([key]) => key.endsWith('_PERMISSIONS'))
        .flatMap(([, value]) => Object.values(value));
}

export function getPermissionNames(...permissionGroups: Record<string, { name: string }>[]) {
    return permissionGroups.map((permission) => permission.name);
}

export function getSpecificPermissions(...permissionList: { name: string }[]) {
    return permissionList;
}

export interface PermissionItem {
    id: string;
    name: string;
    description: string | null;
    module: string;
}

export interface GroupedPermissionItem {
    id: string;
    name: string;
    description: string | null;
}

export type GroupedPermissions = Record<string, GroupedPermissionItem[]>;

export function groupPermissionsByModule(permissions: PermissionItem[]): GroupedPermissions {
    const sorted = [...permissions].sort((a, b) => {
        const moduleCompare = a.module.localeCompare(b.module);
        if (moduleCompare !== 0) return moduleCompare;
        return a.name.localeCompare(b.name);
    });

    const grouped: GroupedPermissions = {};

    for (const permission of sorted) {
        const moduleName = permission.module;
        if (!grouped[moduleName]) {
            grouped[moduleName] = [];
        }
        grouped[moduleName].push({
            id: permission.id,
            name: permission.name,
            description: permission.description,
        });
    }

    return grouped;
}
