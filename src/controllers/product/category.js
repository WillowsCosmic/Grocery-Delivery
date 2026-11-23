import Category from '../../models/category.js';

export const getAllCategories = async (req, reply) => {
  try {
    const categories = await Category.findAll();
    return reply.send(categories);
  } catch (error) {
    return reply.status(500).send({ message: 'An error occurred', error });
  }
};
