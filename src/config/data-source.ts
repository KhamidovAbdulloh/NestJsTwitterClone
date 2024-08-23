import { DataSource, DataSourceOptions } from 'typeorm';
import {config} from 'dotenv'
import { Tweet } from '../db/entities/tweet.entity';
import { User } from '../db/entities/user.entity';
import { Like } from '../db/entities/like.entity';

config()

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Tweet, Like],
  synchronize: true,
};

const dataSource = new DataSource(dataSourceOptions)
dataSource.initialize()
export default dataSource