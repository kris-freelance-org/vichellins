import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Order extends Model {
  public id!: number;
  public user_id!: number;
  public items!: any[];
  public total_amount!: number;
  public payment_status!: 'Pending' | 'Paid' | 'Failed';
  public delivery_status!: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    items: { type: DataTypes.JSONB, allowNull: false },
    total_amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    payment_status: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Failed'),
      defaultValue: 'Pending'
    },
    delivery_status: {
      type: DataTypes.ENUM('Processing', 'Shipped', 'Delivered', 'Cancelled'),
      defaultValue: 'Processing'
    }
  },
  {
    sequelize,
    modelName: 'Order',
    timestamps: true
  }
);

export default Order;
