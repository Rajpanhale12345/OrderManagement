import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import {
  createOrderSchema,
  updateStatusSchema,
  paginationSchema,
} from '../schemas/orderSchema';
import { emitNewOrder, emitStatusUpdate } from '../socket/socketHandler';

function parseItems(items: any) {
  if (typeof items === 'string') return JSON.parse(items);
  return items;
}

export async function createOrder(req: Request, res: Response, next: NextFunction) {
  try {
    const body = createOrderSchema.parse(req.body);
    const id = uuidv4();
    const itemsJson = typeof body.items === 'string' ? body.items : JSON.stringify(body.items);

    await pool.query(
      `INSERT INTO orders (id, store_id, items, total_amount, status) VALUES (?, ?, ?, ?, 'PLACED')`,
      [id, body.store_id, itemsJson, body.total_amount]
    );

    const [rows]: any = await pool.query(`SELECT * FROM orders WHERE id = ?`, [id]);
    const order = { ...rows[0], items: parseItems(rows[0].items) };
    emitNewOrder(order);
    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req: Request, res: Response, next: NextFunction) {
  try {
    const { store_id, page, limit } = paginationSchema.parse(req.query);
    const offset = (page - 1) * limit;

    // Use pool.query with numbers directly in the SQL string — no ? for LIMIT/OFFSET
    const [rows]: any = await pool.query(
      `SELECT * FROM orders WHERE store_id = ? ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      [store_id]
    );

    const [countRows]: any = await pool.query(
      `SELECT COUNT(*) as total FROM orders WHERE store_id = ?`,
      [store_id]
    );

    const total = countRows[0].total;
    const data = rows.map((r: any) => ({ ...r, items: parseItems(r.items) }));

    return res.json({ data, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status } = updateStatusSchema.parse(req.body);

    const [existing]: any = await pool.query(`SELECT * FROM orders WHERE id = ?`, [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await pool.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
    const [updated]: any = await pool.query(`SELECT * FROM orders WHERE id = ?`, [id]);
    const order = { ...updated[0], items: parseItems(updated[0].items) };
    emitStatusUpdate(order);
    return res.json(order);
  } catch (err) {
    next(err);
  }
}