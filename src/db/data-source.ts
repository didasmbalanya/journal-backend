import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../user/user.entity';
import { JournalEntry } from '../journal/journal.entity';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: '.env.development' });
}
dotenv.config({ path: '.env' });

console.log('Connecting to DB at:', process.env.DB_NAME);

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, JournalEntry],
  migrations: ['src/db/migrations/*.ts'],
  // ssl: { rejectUnauthorized: false },
});
