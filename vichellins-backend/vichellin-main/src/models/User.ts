import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public phone?: string;
  public street?: string;
  public city?: string;
  public state?: string;
  public country?: string;
  public zip?: string;
  public resetOtp!: string;
  public resetOtpExpiry!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    zip: { type: DataTypes.STRING },
    resetOtp: { type: DataTypes.STRING, allowNull: true },
    resetOtpExpiry: { type: DataTypes.DATE, allowNull: true }
  },
  {
    sequelize,
    modelName: 'User',
    timestamps: true
  }
);

export default User;
