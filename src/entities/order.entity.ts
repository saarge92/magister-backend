import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * Entity for saving data about order request
 * @copyright Serdar Durdyev
 */
@Entity({ name: 'order' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn({ type: 'varchar', length: 250 })
  public id: string;

  @Column({ name: 'info_order', type: 'varchar', length: 255, nullable: false })
  public info_order: string;

  @ManyToOne(type => User, { onDelete: 'SET NULL', onUpdate: 'CASCADE', lazy: true })
  @JoinColumn({ name: 'user_id' })
  public user: User;

  @Column({ name: 'user_id', type: 'varchar', nullable: true })
  public user_id: string;

  @Column({ name: 'total_qty', type: 'int', nullable: false })
  public total_qty: number;

  @Column({ name: 'total_sum', type: 'double', nullable: false })
  public total_price: number;

  @CreateDateColumn({ name: 'created_date' })
  // tslint:disable-next-line:variable-name
  public created_date: Date;

  @UpdateDateColumn({ nullable: false })
  // tslint:disable-next-line:variable-name
  public updated_date: Date;
}
