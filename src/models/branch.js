import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Branch = sequelize.define('Branch', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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

export default Branch;
