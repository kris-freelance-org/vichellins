import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Review extends Model {
  public id!: number;
  public user_id!: number;
  public product_id!: number;
  public rating!: number;
  public comment?: string;
}

Review.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT }
  },
  {
    sequelize,
    modelName: 'Review',
    timestamps: true
  }
);

export default Review;
