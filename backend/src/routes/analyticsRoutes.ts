import { Router } from 'express';
import {
  archiveOldOrders,
  ordersPerDay,
  revenuePerStore,
  topSellingItems,
} from '../controllers/analyticsController';

const router = Router();

router.post('/archive-old-orders', archiveOldOrders);
router.get('/analytics/orders-per-day', ordersPerDay);
router.get('/analytics/revenue-per-store', revenuePerStore);
router.get('/analytics/top-items', topSellingItems);

export default router;