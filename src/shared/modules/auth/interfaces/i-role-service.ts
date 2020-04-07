/**
 * Interface-contract for role service implemenetation
 * @copyright Serdar Durdyev
 */
import { User } from '../../../../entities/user.entity';

export interface IRoleService {
  addUserToRole(roleName: string, user: User);

  addUserToRoleByUserId(roleName: string, userId: string);

  isUserInRole(roleName: string, user: User): Promise<boolean>;

  recordUserInRoleExists(roleId: string, userId: string): Promise<boolean>;
}