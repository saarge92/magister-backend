import { MigrationInterface, QueryRunner } from 'typeorm';

export class music1583847172551 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE \`musics\` (
    \`id\` varchar(250) NOT NULL,
    \`name\` varchar(255) NOT NULL,
    \`created_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
    \`updated_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
    \`path\` varchar(255) DEFAULT NULL,
    \`user_id\` varchar(250) DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);

    await queryRunner.query(`ALTER TABLE \`musics\`
    ADD PRIMARY KEY (\`id\`),
    ADD KEY \`FK_ed866589032be8516113c2f5f5a\` (\`user_id\`);`);

    await queryRunner.query(`ALTER TABLE \`musics\`
    ADD CONSTRAINT \`FK_ed866589032be8516113c2f5f5a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;
    COMMIT;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`delete table musics`);
  }

}
