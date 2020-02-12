import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity, JoinTable, ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ type: 'varchar', length: 250 })
  public id: string;

  @Column({ name: 'name', nullable: false, length: 255 })
  public name: string;

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
}
