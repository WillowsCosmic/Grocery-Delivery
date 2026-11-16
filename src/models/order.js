import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Counter from './counter.js';

// Helper to increment sequence value in MySQL
async function getNextSequenceValue(sequenceName) {
  const [counter] = await Counter.findOrCreate({
    where: { name: sequenceName },
    defaults: { sequence_value: 0 },
  });

  await counter.increment('sequence_value', { by: 1 });
  await counter.reload();
  return counter.sequence_value;
}

const Order = sequelize.define(
  'Order',
  {
    orderId: {
      type: DataTypes.STRING,
      unique: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'id',
      },
    },
    deliveryPartnerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'DeliveryPartners',
        key: 'id',
      },
    },
    branchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Branches',
        key: 'id',
      },
    },
    // Flattened deliveryLocation
    deliveryLatitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deliveryLongitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Flattened pickupLocation
    pickupLatitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pickupLongitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pickupAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Flattened deliveryPersonLocation
    deliveryPersonLatitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    deliveryPersonLongitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    deliveryPersonAddress: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('available', 'confirmed', 'arriving', 'delivered', 'cancelled'),
      defaultValue: 'available',
    },
    totalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate: async (order) => {
        const sequenceValue = await getNextSequenceValue('orderId');
        order.orderId = `ORDR${sequenceValue.toString().padStart(5, '0')}`;
      },
    },
  }
);

// Separate table for Order Items (replaces the items array in Mongoose)
export const OrderItem = sequelize.define('OrderItem', {
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders',
      key: 'id',
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id',
    },
  },
  count: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Order;
