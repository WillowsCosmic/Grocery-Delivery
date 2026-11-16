import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Base User fields 
const baseUserFields = {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.ENUM('Customer', 'Admin', 'DeliveryPartner'),
    allowNull: false,
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

// Customer Model
export const Customer = sequelize.define('Customer', {
  ...baseUserFields,
  phone: {
    type: DataTypes.STRING, 
    allowNull: false,
    unique: true,
  },
  role: {
    type: DataTypes.ENUM('Customer'),
    defaultValue: 'Customer',
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

// DeliveryPartner Model
export const DeliveryPartner = sequelize.define('DeliveryPartner', {
  ...baseUserFields,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('DeliveryPartner'),
    defaultValue: 'DeliveryPartner',
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  branchId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Branches',
      key: 'id',
    },
  },
});

// Admin Model
export const Admin = sequelize.define('Admin', {
  ...baseUserFields,
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('Admin'),
    defaultValue: 'Admin',
  },
});
