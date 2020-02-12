import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity, JoinTable, OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('varchar', { length: 250 })
  public id: string;

  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  public password: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false, unique: true })
  public email: string;

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

  @JoinTable({
    name: 'user_in_roles', joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  public roles: Role[];
}