import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Admin extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone!: string;
  public resetOtp!: string;
  public resetOtpExpiry!: Date;
  public role!: 'Super Admin' | 'Manager' | 'Staff';
}

Admin.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    resetOtp: { type: DataTypes.STRING, allowNull: true },
    resetOtpExpiry: { type: DataTypes.DATE, allowNull: true },
    role: {
      type: DataTypes.ENUM('Super Admin', 'Manager', 'Staff'),
      defaultValue: 'Staff'
    }
  },
  {
    sequelize,
    modelName: 'Admin',
    timestamps: true
  }
);

export default Admin;
