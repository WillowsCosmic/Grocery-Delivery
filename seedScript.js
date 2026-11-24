import 'dotenv/config';
import { sequelize } from './src/config/db.js';
import { Category, Product } from './src/models/index.js';
import { categories, products } from './seedData.js';

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Clear existing products first (due to foreign key constraint), then categories
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });

    // Insert categories and build a name -> id map
    const categoryDocs = await Category.bulkCreate(categories);

    const categoryMap = categoryDocs.reduce((map, category) => {
      map[category.name] = category.id;
      return map;
    }, {});

    // Attach the SQL foreign key (categoryId) to each product
    const productWithCategoryIds = products.map((product) => ({
      ...product,
      categoryId: categoryMap[product.category],
    }));

    await Product.bulkCreate(productWithCategoryIds);

    console.log('DATABASE SEEDED SUCCESSFULLY');
  } catch (error) {
    console.error('Error Seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
