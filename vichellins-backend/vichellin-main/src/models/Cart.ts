import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Cart extends Model {
  public id!: number;
  public user_id!: number;
  public product_id!: number;
  public quantity!: number;
}

Cart.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }
  },
  {
    sequelize,
    modelName: 'Cart',
    timestamps: true
  }
);

export default Cart;
