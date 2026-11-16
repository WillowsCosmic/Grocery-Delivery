import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Counter = sequelize.define('Counter', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  sequence_value: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Counter;
