import { z } from 'zod';

export const createOrderSchema = z.object({
  store_id: z.string().min(1, 'store_id is required'),
  items: z
    .array(
      z.object({
        item_id: z.string().min(1),
        qty: z.number().int().positive(),
      })
    )
    .min(1, 'At least one item is required'),
  total_amount: z.number().positive('total_amount must be positive'),
});

export const updateStatusSchema = z.object({
  status: z.enum(['PLACED', 'PREPARING', 'COMPLETED']),
});

export const paginationSchema = z.object({
  store_id: z.string().min(1, 'store_id is required'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});