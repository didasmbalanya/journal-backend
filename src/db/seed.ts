import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../user/user.entity';
import { JournalEntry } from '../journal/journal.entity';

dotenv.config({ path: '.env.development' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'journal_db',
  entities: [User, JournalEntry],
  synchronize: true,
});

const seedDatabase = async () => {
  await AppDataSource.initialize();
  console.log('Database connected...');

  const userRepository = AppDataSource.getRepository(User);
  const journalRepository = AppDataSource.getRepository(JournalEntry);

  // Ensure at least one user exists

  let user = await userRepository.findOneBy({ email: 'seed@seed.com' });

  if (!user) {
    user = userRepository.create({
      email: 'seed@seed.com',
      password: 'Password@123', // Ensure you hash this if needed
      role: 'user',
    });
    await userRepository.save(user);
  }
  await userRepository.save(user);

  // Create 20 sample journals
  const journals = Array.from({ length: 20 }, (_, i) => {
    return journalRepository.create({
      title: `Sample Journal ${i + 1}`,
      content: `This is a sample content for journal entry ${i + 1}. 
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
      Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
      Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
      Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris. 
      Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. 
      Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue, eros est euismod turpis, id tincidunt sapien risus a quam. 
      Maecenas fermentum consequat mi. Donec fermentum. Pellentesque malesuada nulla a mi. Duis sapien sem, aliquet nec, commodo eget, consequat quis, neque. 
      Aliquam faucibus, elit ut dictum aliquet, felis nisl adipiscing sapien, sed malesuada diam lacus eget erat. 
      Cras mollis scelerisque nunc. Nullam arcu. Aliquam consequat. Curabitur augue lorem, dapibus quis, laoreet et, pretium ac, nisi. 
      Aenean magna nisl, mollis quis, molestie eu, feugiat in, orci. In hac habitasse platea dictumst.`,
      user: user,
    });
  });

  await journalRepository.save(journals);
  console.log('Seeded 20 journals successfully!');

  await AppDataSource.destroy();
};

seedDatabase().catch((error) => {
  console.error('Error seeding database:', error);
});
