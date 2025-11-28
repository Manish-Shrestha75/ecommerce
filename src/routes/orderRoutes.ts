import { Router } from 'express';
import { orderController } from '../controllers/orderController';

const router = Router();

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id/cancel', orderController.cancelOrder);
router.delete('/:id', orderController.deleteOrder);

export default router;