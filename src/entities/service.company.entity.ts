import {
  BeforeInsert, BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'company_services' })
export class ServiceCompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('varchar', { length: 250 })
  public id: string;

  @Column({ type: 'varchar', name: 'name', nullable: false })
  public name: string;


  @Column({ type: 'varchar', name: 'image_path', nullable: false })
  public image_path: string;

  @Column({ name: 'price', type: 'double', nullable: false, default: 1 })
  public price: number;

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
  public beforeUpdete() {
    this.updated_date = new Date();
  }
}
