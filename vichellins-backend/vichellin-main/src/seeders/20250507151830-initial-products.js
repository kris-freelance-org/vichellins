'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Fetch category IDs to ensure referential integrity
    const categories = await queryInterface.sequelize.query(`SELECT id, name FROM categories;`, { type: queryInterface.sequelize.QueryTypes.SELECT });

    const categoryMap = categories.reduce((acc, category) => {
      acc[category.name] = category.id;
      return acc;
    }, {});

    const productsData = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        price: 199.99,
        description: 'Immersive sound experience with active noise cancellation. Long battery life.',
        stock: 50,
        mainImage: 'uploads/products/placeholder_headphones_main.jpg',
        rightImage: 'uploads/products/placeholder_headphones_right.jpg',
        leftImage: 'uploads/products/placeholder_headphones_left.jpg',
        extraImage: 'uploads/products/placeholder_headphones_extra.jpg',
        categoryId: categoryMap['Electronics'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'The Great Gatsby - Hardcover',
        price: 12.5,
        description: 'Classic novel by F. Scott Fitzgerald. Beautiful hardcover edition.',
        stock: 120,
        mainImage: 'uploads/products/placeholder_gatsby_main.jpg',
        categoryId: categoryMap['Books'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "Men's Classic Cotton T-Shirt",
        price: 25.0,
        description: 'Comfortable and durable 100% cotton t-shirt. Various colors available.',
        stock: 200,
        mainImage: 'uploads/products/placeholder_tshirt_main.jpg',
        categoryId: categoryMap['Clothing'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Stainless Steel Cooking Pot Set',
        price: 89.99,
        description: '5-piece stainless steel cookware set. Non-stick and dishwasher safe.',
        stock: 75,
        mainImage: 'uploads/products/placeholder_pots_main.jpg',
        categoryId: categoryMap['Home & Kitchen'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Professional Yoga Mat',
        price: 35.0,
        description: 'Eco-friendly, non-slip yoga mat for all types of practice.',
        stock: 90,
        mainImage: 'uploads/products/placeholder_yogamat_main.jpg',
        categoryId: categoryMap['Sports & Outdoors'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      // Add more products, ensuring categoryId matches an existing category
    ];

    await queryInterface.bulkInsert('products', productsData, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
