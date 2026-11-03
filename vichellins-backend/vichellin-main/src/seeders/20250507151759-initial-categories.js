'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'categories',
      [
        {
          name: 'Electronics',
          description: 'Gadgets, devices, and all things electronic.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Books',
          description: 'Novels, textbooks, and a variety of reads.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Clothing',
          description: 'Apparel for all ages and occasions.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Home & Kitchen',
          description: 'Appliances, decor, and essentials for your home.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Sports & Outdoors',
          description: 'Equipment and gear for an active lifestyle.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        // Add more categories as needed
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
