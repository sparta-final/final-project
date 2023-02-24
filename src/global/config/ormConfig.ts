import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// TODO: TypeOrmModuleOptions의 속성들을 찾아서 채워넣기
function ormConfig(): TypeOrmModuleOptions {
  const commonConf = {
    ENTITIES: [__dirname, '../entities/*.ts'],
  };
  const ormconfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: commonConf.ENTITIES,
    synchronize: true,
    logging: true,
    charset: 'utf8mb4',
    keepConnectionAlive: true,
  };
  return ormconfig;
}

export { ormConfig };
