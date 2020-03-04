import { ConnectionOptions } from 'typeorm';

export function getConnectionParameters(entities: Array<any>): ConnectionOptions {
  return {
    type: 'mysql',
    database: 'magister',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: null,
    dropSchema: false,
    entities: [...entities],
    synchronize: false,
    logging: false,
    name: connectionName,
  };
}

export const connectionName = 'magister-test';