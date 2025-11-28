import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Order, OrderStatus } from '../entities/order';
import { OrderItem } from '../entities/orderItem';
import { Product } from '../entities/product';

const orderRepository = AppDataSource.getRepository(Order);
const orderItemRepository = AppDataSource.getRepository(OrderItem);
const productRepository = AppDataSource.getRepository(Product);

export const orderController = {
 
  createOrder: async (req: Request, res: Response) => {
    try {
      const { items, shippingAddress, billingAddress, customerName, customerEmail, customerPhone, paymentMethod, notes } = req.body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Order must contain at least one item' });
      }

      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      
      for (const item of items) {
        const product = await productRepository.findOne({ where: { id: item.productId } });
        if (!product) {
          return res.status(404).json({ message: `Product not found: ${item.productId}` });
        }

        if (product.quantity < item.quantity) {
          return res.status(400).json({ 
            message: `Insufficient stock for ${product.name}. Available: ${product.quantity}, Requested: ${item.quantity}` 
          });
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        const orderItem = orderItemRepository.create({
          product: product,
          productName: product.name,
          quantity: item.quantity,
          unitPrice: product.price,
          total: itemTotal
        });

        orderItems.push(orderItem);

      
        product.quantity -= item.quantity;
        await productRepository.save(product);
      }

      const tax = subtotal * 0.1; 
      const shippingCost = 50; 
      const total = subtotal + tax + shippingCost;

      const orderNumber = 'ORD' + Date.now();

     
      const order = orderRepository.create({
        orderNumber,
        items: orderItems,
        subtotal,
        tax,
        shippingCost,
        total,
        shippingAddress,
        billingAddress: billingAddress || shippingAddress,
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod,
        notes
      });

      const result = await orderRepository.save(order);
      res.status(201).json(result);

    } catch (error) {
      console.log('Error creating order:', error);
      res.status(500).json({ message: 'Error creating order' });
    }
  },

  getAllOrders: async (req: Request, res: Response) => {
    try {
      const orders = await orderRepository.find({
        relations: ['items', 'items.product'],
        order: { createdAt: 'DESC' }
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching orders' });
    }
  },

  getOrderById: async (req: Request, res: Response) => {
    try {
      const order = await orderRepository.findOne({
        where: { id: req.params.id },
        relations: ['items', 'items.product']
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching order' });
    }
  },

  updateOrderStatus: async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      
      if (!Object.values(OrderStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }

      const order = await orderRepository.findOne({
        where: { id: req.params.id },
        relations: ['items', 'items.product']
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = status;
      const result = await orderRepository.save(order);

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error updating order status' });
    }
  },

  cancelOrder: async (req: Request, res: Response) => {
    try {
      const order = await orderRepository.findOne({
        where: { id: req.params.id },
        relations: ['items', 'items.product']
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.status === OrderStatus.DELIVERED) {
        return res.status(400).json({ message: 'Cannot cancel delivered order' });
      }

      
      for (const item of order.items) {
        const product = await productRepository.findOne({ 
          where: { id: item.product.id } 
        });
        if (product) {
          product.quantity += item.quantity;
          await productRepository.save(product);
        }
      }

      order.status = OrderStatus.CANCELLED;
      const result = await orderRepository.save(order);

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error cancelling order' });
    }
  },

  
  deleteOrder: async (req: Request, res: Response) => {
    try {
      const order = await orderRepository.findOne({
        where: { id: req.params.id }
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      await orderRepository.softDelete(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting order' });
    }
  }
};