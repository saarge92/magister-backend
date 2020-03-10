import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserMigration1583832448783 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE \`users\` (
  \`id\` varchar(250) NOT NULL,
  \`password\` varchar(255) NOT NULL,
  \`email\` varchar(255) NOT NULL,
  \`created_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  \`updated_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`drop table users`);
  }

}
