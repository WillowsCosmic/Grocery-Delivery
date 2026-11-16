import 'dotenv/config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(process.env.SQL_URL);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

connectDB();
