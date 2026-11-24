import Product from '../../models/product.js';

export const getProductsByCategoryId = async (req, reply) => {
  const { categoryId } = req.params;

  try {
    const products = await Product.findAll({
      where: { categoryId },
      attributes: { exclude: ['categoryId'] },
    });

    return reply.send(products);
  } catch (error) {
    return reply.status(500).send({ message: 'An error occurred', error });
  }
};
