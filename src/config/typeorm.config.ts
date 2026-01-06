import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  // Load Entities automatically from the modules
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],

  // DANGEROUS: Synchronize true creates tables automatically.
  // Good for MVP dev, set to FALSE for production (use migrations instead).
  synchronize: process.env.NODE_ENV !== 'production',

  // SSL is REQUIRED for Supabase and most cloud DBs
  ssl: {
    rejectUnauthorized: false,
  },
});
