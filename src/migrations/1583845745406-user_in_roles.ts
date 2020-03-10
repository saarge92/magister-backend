import { MigrationInterface, QueryRunner } from 'typeorm';

export class userInRoles1583845745406 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE \`user_in_roles\` (
  \`id\` varchar(250) NOT NULL,
  \`created_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  \`updated_date\` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  \`roleId\` varchar(255) DEFAULT NULL,
  \`userId\` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`);
    await queryRunner.query('ALTER TABLE `user_in_roles`\n' +
      '  ADD PRIMARY KEY (`id`),\n' +
      '  ADD KEY `FK_e2a7466fcef6ab7760c52e4a48b` (`userId`),\n' +
      '  ADD KEY `FK_32da6ae03df17a95416fbc557a4` (`roleId`);');
    await queryRunner.query(`ALTER TABLE \`user_in_roles\`
    ADD CONSTRAINT \`FK_32da6ae03df17a95416fbc557a4\` FOREIGN KEY (\`roleId\`) REFERENCES \`roles\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
    ADD CONSTRAINT \`FK_e2a7466fcef6ab7760c52e4a48b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE;
    COMMIT;`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`drop table user_in_roles`);
  }

}
