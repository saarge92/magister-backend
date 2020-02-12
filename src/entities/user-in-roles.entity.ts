import {
  BeforeInsert,
  BeforeUpdate, Column, CreateDateColumn,
  Entity, JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity({ name: 'user_in_roles' })
export class UserInRoles {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('varchar', { length: 250 })
  public id: string;

  @ManyToOne(type => User, { onDelete: 'NO ACTION', onUpdate: 'CASCADE' })
  // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: User;

  @ManyToOne(type => Role, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  public role: Role;

  @Column({ nullable: true, name: 'roleId' })
  public roleId: string;

  @Column({ nullable: true, name: 'userId' })
  public userId: string;

  @CreateDateColumn({ name: 'created_date' })
  // tslint:disable-next-line:variable-name
  public created_date: Date;

  @UpdateDateColumn({ nullable: false })
  // tslint:disable-next-line:variable-name
  public updated_date: Date;

  @BeforeInsert()
  public beforeInsert() {
    this.created_date = new Date();
  }

  @BeforeUpdate()
  public beforeUpdate() {
    this.updated_date = new Date();
  }
}