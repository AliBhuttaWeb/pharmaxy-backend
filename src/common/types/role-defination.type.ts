import { RoleScope } from './role-scopes.type';
import { SignupScope } from './singup-scopes.type';

export type RoleDefinition = {
    name: string;
    description: string;
    roleScope: RoleScope;
    signupScopes: SignupScope[];
};
