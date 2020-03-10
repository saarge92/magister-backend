import { MigrationInterface, QueryRunner } from 'typeorm';

// tslint:disable-next-line:class-name
export class serviceCompanyCreate1581411650164 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE \`company_services\` (
  \`name\` varchar(255) NOT NULL,
  \`image_path\` varchar(255) NOT NULL,
  \`created_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  \`updated_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  \`id\` varchar(250) NOT NULL,
  \`price\` double NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`drop table company_services`);
  }

}
