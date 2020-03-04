import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity, JoinColumn, ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('musics')
export class Music {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ type: 'varchar', length: 250 })
  public id: string;

  @Column({ name: 'name', nullable: false, length: 255 })
  public name: string;

  @Column({ name: 'path', nullable: true, length: 255 })
  public fileName: string;

  @CreateDateColumn({ name: 'created_date' })
  // tslint:disable-next-line:variable-name
  public created_date: Date;

  @UpdateDateColumn({ nullable: false })
  // tslint:disable-next-line:variable-name
  public updated_date: Date;

  @ManyToOne(type => User, { onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @BeforeInsert()
  public beforeInsert() {
    this.created_date = new Date();
  }
}