import { MigrationInterface, QueryRunner } from 'typeorm';

export class order1583849113015 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE \`orders\` (
      \`id\` varchar(250) NOT NULL,
      \`info_order\` varchar(255) NOT NULL,
      \`user_id\` varchar(255) DEFAULT NULL,
      \`total_qty\` int(11) NOT NULL,
      \`total_sum\` double NOT NULL,
      \`created_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
      \`updated_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await queryRunner.query(`ALTER TABLE \`orders\`
    ADD PRIMARY KEY (\`id\`),
    ADD KEY \`FK_199e32a02ddc0f47cd93181d8fd\` (\`user_id\`);`);

    await queryRunner.query(`ALTER TABLE \`orders\`
    ADD CONSTRAINT \`FK_199e32a02ddc0f47cd93181d8fd\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;
    COMMIT;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`drop table orders`);
  }

}
