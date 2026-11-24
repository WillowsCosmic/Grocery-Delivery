import {
  Branch,
  Customer,
  DeliveryPartner,
  Order,
  OrderItem,
} from '../../models/index.js';

export const createOrder = async (req, reply) => {
  try {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;

    const customerData = await Customer.findByPk(userId);
    const branchData = await Branch.findByPk(branch);

    if (!customerData) {
      return reply.status(404).send({ message: 'Customer not found' });
    }
    if (!branchData) {
      return reply.status(404).send({ message: 'Branch not found' });
    }

    // 1. Create the main Order row in MySQL
    const savedOrder = await Order.create({
      customerId: userId,
      branchId: branch,
      totalPrice,
      deliveryLatitude: customerData.latitude || 0,
      deliveryLongitude: customerData.longitude || 0,
      deliveryAddress: customerData.address || 'No Address Available',
      pickupLatitude: branchData.latitude || 0,
      pickupLongitude: branchData.longitude || 0,
      pickupAddress: branchData.address || 'No Address Available',
    });

    // 2. Insert all ordered products into the OrderItems table
    if (items && items.length > 0) {
      const orderItemsData = items.map((item) => ({
        orderId: savedOrder.id,
        productId: item.item || item.id, // Supports either product ID key from frontend
        count: item.count,
      }));
      await OrderItem.bulkCreate(orderItemsData);
    }

    // 3. Reload order with its items attached so the response matches Mongoose
    const fullOrder = await Order.findByPk(savedOrder.id, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    return reply.status(201).send(fullOrder);
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ message: 'Failed to create order', error });
  }
};

export const confirmOrder = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;

    // Fixed: look up delivery partner using userId (not orderId)
    const deliveryPerson = await DeliveryPartner.findByPk(userId);
    if (!deliveryPerson) {
      return reply.status(404).send({ message: 'Delivery Person not found' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return reply.status(404).send({ message: 'Order not found' });
    }
    if (order.status !== 'available') {
      return reply.status(400).send({ message: 'Order is not available' });
    }

    order.status = 'confirmed';
    order.deliveryPartnerId = userId;
    order.deliveryPersonLatitude = deliveryPersonLocation?.latitude ?? null;
    order.deliveryPersonLongitude = deliveryPersonLocation?.longitude ?? null;
    order.deliveryPersonAddress = deliveryPersonLocation?.address || '';

    await order.save();
    req.server.io.to(orderId).emit('orderConfirmed', order);

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to confirm order', error });
  }
};

export const updateOrderStatus = async (req, reply) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { status, deliveryPersonLocation } = req.body;

    // Fixed: look up delivery partner using userId (not orderId)
    const deliveryPerson = await DeliveryPartner.findByPk(userId);
    if (!deliveryPerson) {
      return reply.status(404).send({ message: 'Delivery Person not found' });
    }

    const order = await Order.findByPk(orderId);
    if (!order) {
      return reply.status(404).send({ message: 'Order not found' });
    }

    if (['cancelled', 'delivered'].includes(order.status)) {
      return reply.status(400).send({ message: 'Order cannot be updated' });
    }

    // Compare numeric/string IDs safely in SQL
    if (Number(order.deliveryPartnerId) !== Number(userId)) {
      return reply.status(403).send({ message: 'Unauthorized' });
    }

    order.status = status;
    if (deliveryPersonLocation) {
      order.deliveryPersonLatitude = deliveryPersonLocation.latitude ?? order.deliveryPersonLatitude;
      order.deliveryPersonLongitude = deliveryPersonLocation.longitude ?? order.deliveryPersonLongitude;
      order.deliveryPersonAddress = deliveryPersonLocation.address ?? order.deliveryPersonAddress;
    }

    await order.save();
    req.server.io.to(orderId).emit('liveTackingUpdates', order);

    return reply.send(order);
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to update order status', error });
  }
};

export const getOrders = async (req, reply) => {
  try {
    const { status, customerId, deliveryPartnerId, branchId } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }
    if (customerId) {
      where.customerId = customerId;
    }
    if (deliveryPartnerId) {
      where.deliveryPartnerId = deliveryPartnerId;
    }
    if (branchId) {
      where.branchId = branchId;
    }

    const orders = await Order.findAll({
      where,
      include: [
        { model: Customer, as: 'customer' },
        { model: Branch, as: 'branch' },
        { model: DeliveryPartner, as: 'deliveryPartner' },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'item' }],
        },
      ],
    });
    return reply.send(orders);
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to update order status', error });
  }
};
export const getOrderById = async (req, reply) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        { model: Customer, as: 'customer' },
        { model: Branch, as: 'branch' },
        { model: DeliveryPartner, as: 'deliveryPartner' },
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'item' }],
        },
      ],
    });

    if (!order) {
      return reply.status(404).send({ message: 'Order not found' });
    }

    return reply.send(order);
  } catch (error) {
    return reply
      .status(500)
      .send({ message: 'Failed to retrieve order', error });
  }
};

