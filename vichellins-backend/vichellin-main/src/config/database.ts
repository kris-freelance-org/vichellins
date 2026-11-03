import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  String(process.env.DATABASE_URL),
  process.env.NODE_ENV === 'development'
    ? {}
    : {
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: false,
            rejectUnauthorized: false
          }
        }
      }
);

export default sequelize;
