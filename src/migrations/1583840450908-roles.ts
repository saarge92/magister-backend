import { MigrationInterface, QueryRunner } from 'typeorm';

export class roles1583840450908 implements MigrationInterface {
  name = 'roles1583840450908';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE \`roles\` (
  \`id\` varchar(250) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`created_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  \`updated_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('roles');
  }

}
