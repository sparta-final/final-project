import { Calculate } from './../entities/Calculate';
import { Users } from './../entities/Users';
import { UserGym } from './../entities/UserGym';
import { Reviews } from './../entities/Reviews';
import { GymImg } from './../entities/GymImg';
import { Gym } from './../entities/Gym';
import { FeedsImg } from './../entities/FeedsImg';
import { Feeds } from './../entities/Feeds';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Busienssusers } from '../entities/Busienssusers';
import { Comments } from '../entities/Comments';
import { Payments } from '../entities/Payments';
import { Adminusers } from '../entities/adminusers';
import { truncate } from 'fs';

// TODO: TypeOrmModuleOptions의 속성들을 찾아서 채워넣기
function ormConfig(): TypeOrmModuleOptions {
  const commonConf = {
    ENTITIES: [Busienssusers, Adminusers, Comments, Feeds, FeedsImg, Gym, GymImg, Payments, Reviews, UserGym, Users, Calculate],
  };
  const ormconfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: commonConf.ENTITIES,
    synchronize: false,
    logging: true,
    charset: 'utf8mb4',
    keepConnectionAlive: true,
  };
  return ormconfig;
}

export { ormConfig };
