'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create the 'categories' table
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add the 'categoryId' column to the 'products' table
    await queryInterface.addColumn('products', 'categoryId', {
      type: Sequelize.INTEGER,
      allowNull: true, // Match your model definition
      references: {
        model: 'categories', // Name of the target table
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL' // Match your model definition
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'categoryId' column from 'products'
    // It's important to remove the column before dropping the table it references
    await queryInterface.removeColumn('products', 'categoryId');

    // Drop the 'categories' table
    await queryInterface.dropTable('categories');
  }
};
