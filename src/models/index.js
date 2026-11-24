import Branch from "./branch.js";
import Category from "./category.js";
import Counter from "./counter.js";
import Order,{OrderItem} from "./order.js";
import Product from "./product.js";
import {Customer,DeliveryPartner,Admin} from "./user.js";

// 1. Category <-> Product
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// 2. Branch <-> DeliveryPartner
Branch.hasMany(DeliveryPartner, { foreignKey: 'branchId', as: 'deliveryPartners' });
DeliveryPartner.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// 3. Customer <-> Order
Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

// 4. DeliveryPartner <-> Order
DeliveryPartner.hasMany(Order, { foreignKey: 'deliveryPartnerId', as: 'orders' });
Order.belongsTo(DeliveryPartner, { foreignKey: 'deliveryPartnerId', as: 'deliveryPartner' });

// 5. Branch <-> Order
Branch.hasMany(Order, { foreignKey: 'branchId', as: 'orders' });
Order.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' });

// 6. Order <-> OrderItem <-> Product
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'item' });

export{
    Product,
    Category,
    Branch,
    Order,
    OrderItem,
    Counter,
    Customer,
    DeliveryPartner,
    Admin
}