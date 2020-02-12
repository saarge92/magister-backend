import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../../../entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../../../../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInRoles } from '../../../../entities/user-in-roles.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>,
              @InjectRepository(User) private readonly userRepository: Repository<User>,
              @InjectRepository(UserInRoles) private readonly userInRolesRepository: Repository<UserInRoles>) {
  }

  /**
   * Add user to role
   * @param roleName Name of role
   * @param user User for role add
   */
  public async addUserToRole(roleName: string, user: User) {
    const existedRole = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!existedRole) {
      throw new HttpException('Невозможно добавить пользователя в роль', 409);
    }
    const existRecord = await this.recordUserInRoleExists(existedRole.id, user.id);
    if (!existRecord) {
      const newRecordUserInRole = new UserInRoles();
      newRecordUserInRole.role = existedRole;
      newRecordUserInRole.user = user;
      await this.userInRolesRepository.insert(newRecordUserInRole);
    }
  }

  /**
   * Add user into role
   * @param roleName Name of role to add
   * @param userId User id to role
   */
  public async addUserToRoleByUserId(roleName: string, userId: string) {
    const existedRole = await this.roleRepository.findOne({ where: { name: roleName } });
    if (!existedRole) {
      throw new HttpException('Невозможно добавить пользователя в роль', 409);
    }
    const existedUser = await this.userRepository.findOne(userId);
    if (!existedUser) throw new HttpException('User with such id not found', HttpStatus.CONFLICT);
    const existedRecord = await this.recordUserInRoleExists(existedRole.id, existedUser.id);
    if (!existedRecord) {
      const newUserInRoleRecord = new UserInRoles();
      newUserInRoleRecord.roleId = existedRole.id;
      newUserInRoleRecord.userId = userId;
      await this.userInRolesRepository.save(newUserInRoleRecord);
    }
  }

  /**
   * Check if user
   * @param roleId
   * @param userId
   */
  private async recordUserInRoleExists(roleId: string, userId: string): Promise<boolean> {
    const existRecord = await this.userInRolesRepository.findOne({
      where: {
        roleId,
        userId,
      },
    });
    return existRecord != null;
  }
}