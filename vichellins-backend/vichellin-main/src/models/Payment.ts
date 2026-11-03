import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Payment extends Model {
  public id!: number;
  public user_id!: number;
  public order_id!: number;
  public amount!: number;
  public payment_method!: string;
  public transaction_id!: string;
  public status!: 'Success' | 'Pending' | 'Failed';
}

Payment.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_method: { type: DataTypes.STRING, allowNull: false },
    transaction_id: { type: DataTypes.STRING, allowNull: false, unique: true },
    status: {
      type: DataTypes.ENUM('Success', 'Pending', 'Failed'),
      defaultValue: 'Pending'
    }
  },
  {
    sequelize,
    modelName: 'Payment',
    timestamps: true
  }
);

export default Payment;
