import { User } from "src/entities/user.entity";

/**
 * Interface-contract for role service implemenetation
 * @copyright Serdar Durdyev 
 */
export interface IRoleService {
    addUserToRole(roleName: string, user: User);

    addUserToRoleByUserId(roleName: string, userId: string);

    isUserInRole(roleName: string, user: User): Promise<boolean>;

    recordUserInRoleExists(roleId: string, userId: string): Promise<boolean>;
}