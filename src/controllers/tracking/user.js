import { Customer, DeliveryPartner } from '../../models/index.js';

export const updateUser = async (req, reply) => {
  try {
    const { userId, role } = req.user;
    const updateData = req.body;

    // Look up the user in the exact table matching their JWT role
    let user;
    if (role === 'Customer') {
      user = await Customer.findByPk(userId);
    } else if (role === 'DeliveryPartner') {
      user = await DeliveryPartner.findByPk(userId);
    } else {
      return reply.status(400).send({ message: 'Invalid user role' });
    }

    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    
    const updatedUser = await user.update(updateData);

    return reply.send({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    return reply.status(500).send({ message: 'Failed to update user', error });
  }
};
