import sequelize from '../config/database';
import User from './User';
import Product from './Product';
import Order from './Order';
import OrderItem from './OrderItem';
import Cart from './Cart';
import Review from './Review';
import Payment from './Payment';
import Admin from './Admin';
import Wishlist from './Wishlist';
import Category from './Category';

// Define relationships
User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

User.hasMany(Cart, { foreignKey: 'user_id' });
Cart.belongsTo(User, { foreignKey: 'user_id' });
Cart.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Wishlist, { foreignKey: 'user_id' });
Wishlist.belongsTo(User, { foreignKey: 'user_id' });
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Payment, { foreignKey: 'user_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

Order.hasOne(Payment, { foreignKey: 'order_id' });
Payment.belongsTo(Order, { foreignKey: 'order_id' });

// Product <-> Category Relationship
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Product.hasMany(Wishlist, { foreignKey: 'product_id', as: 'wishlist' });
Product.hasMany(Cart, { foreignKey: 'product_id', as: 'cart' });

export { sequelize, User, Product, Order, OrderItem, Cart, Review, Payment, Admin, Wishlist, Category };
