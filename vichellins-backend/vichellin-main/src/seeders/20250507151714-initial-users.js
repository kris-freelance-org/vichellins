'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const saltRounds = 10; // Or your preferred salt rounds
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    const userPassword = await bcrypt.hash('user123', saltRounds);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: adminPassword,
          phone: '1234567890',
          street: '123 Admin St',
          city: 'Adminville',
          state: 'AS',
          country: 'Adminland',
          zip: 'A1A1A1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Regular User',
          email: 'user@example.com',
          password: userPassword,
          phone: '0987654321',
          street: '456 User Ave',
          city: 'Userville',
          state: 'US',
          country: 'Userland',
          zip: 'U2U2U2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        // Add more users as needed
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
