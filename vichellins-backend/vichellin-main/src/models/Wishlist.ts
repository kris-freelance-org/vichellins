import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Wishlist extends Model {
  public id!: number;
  public user_id!: number;
  public product_id!: number;
}

Wishlist.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    modelName: 'Wishlist',
    timestamps: true
  }
);

export default Wishlist;
