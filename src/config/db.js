import 'dotenv/config';
import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(process.env.SQL_URL, {
  dialect: 'mysql',
  logging: false,
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL successfully!');

    await import('../models/index.js');
    await sequelize.sync();
    console.log('All tables synced successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}
