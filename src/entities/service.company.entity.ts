import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'company_service' })
export class ServiceCompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  @PrimaryColumn('varchar', { length: 36 })
  public id: string;

  @Column({ type: 'varchar', name: 'name', nullable: false })
  public name: string;


  @Column({ type: 'varchar', name: 'image_path', nullable: false })
  public image_path: string;

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
