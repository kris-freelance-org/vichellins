import { sequelize } from './models';

sequelize
  .sync({ alter: true }) // WARNING: This will reset the database
  .then(() => console.log('Database & tables created!'))
  .catch((err) => console.error('Sync Error:', err))
  .finally(() => {
    sequelize.close();
    process.exit(0);
  });
