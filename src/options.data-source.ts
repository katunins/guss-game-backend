import { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

export const optionsDataSource: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  synchronize: false,
  entities: ['dist/**/**/*.entity.js'],
  migrations: ['dist/migrations/**/*.js'],
};
