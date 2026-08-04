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
