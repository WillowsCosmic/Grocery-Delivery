import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT, // FLOAT supports decimal prices like 49.99
    allowNull: false,
  },
  discountPrice: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.STRING, // Kept as STRING for values like "500g" or "1L"
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id',
    },
  },
});

export default Product;
