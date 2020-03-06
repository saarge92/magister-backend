import { ConnectionOptions } from 'typeorm';

export function getConnectionParameters(entities: Array<any>): ConnectionOptions {
  return {
    ...connectionParameters,
    entities: [...entities],
    name: connectionName,
  };
}

export const connectionName = 'magister-test';

export const connectionParameters: any = {
  type: 'mysql',
  database: 'magister',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  dropSchema: false,
  synchronize: false,
  logging: false,
};
