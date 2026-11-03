import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

// Define attributes for Product model
interface ProductAttributes {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock: number;
  mainImage?: string;
  rightImage?: string;
  leftImage?: string;
  extraImage?: string;
  categoryId?: number; // Add foreign key
}

// Define creation attributes (some are optional)
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'description' | 'stock' | 'rightImage' | 'leftImage' | 'extraImage' | 'categoryId'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public price!: number;
  public description?: string;
  public stock!: number;
  public mainImage?: string;
  public rightImage?: string;
  public leftImage?: string;
  public extraImage?: string;
  public categoryId?: number; // Add foreign key

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations
  public static associate(models: any) {
    Product.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  }
}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.TEXT },
    // category: { type: DataTypes.STRING, allowNull: false }, // Remove old string category
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    mainImage: { type: DataTypes.STRING },
    rightImage: { type: DataTypes.STRING },
    leftImage: { type: DataTypes.STRING },
    extraImage: { type: DataTypes.STRING },
    categoryId: {
      // Add foreign key definition
      type: DataTypes.INTEGER,
      allowNull: true, // Or false if every product MUST have a category
      references: {
        model: 'categories', // table name
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL' // Or 'CASCADE' or 'RESTRICT' depending on desired behavior
    }
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products', // Explicitly set table name
    timestamps: true
  }
);

export default Product;
