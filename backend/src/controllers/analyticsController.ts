import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';

// POST /archive-old-orders
export async function archiveOldOrders(_req: Request, res: Response, next: NextFunction) {
  try {
    const [result]: any = await pool.execute(`
      INSERT INTO orders_archive (id, store_id, items, total_amount, status, created_at)
      SELECT id, store_id, items, total_amount, status, created_at
      FROM orders
      WHERE created_at < NOW() - INTERVAL 30 DAY
    `);

    await pool.execute(`
      DELETE FROM orders WHERE created_at < NOW() - INTERVAL 30 DAY
    `);

    return res.json({ archived: result.affectedRows });
  } catch (err) {
    next(err);
  }
}

// GET /analytics/orders-per-day
export async function ordersPerDay(_req: Request, res: Response, next: NextFunction) {
  try {
    const [rows]: any = await pool.execute(`
      SELECT DATE(created_at) as date, COUNT(*) as total_orders
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET /analytics/revenue-per-store
export async function revenuePerStore(_req: Request, res: Response, next: NextFunction) {
  try {
    const [rows]: any = await pool.execute(`
      SELECT store_id, SUM(total_amount) as total_revenue, COUNT(*) as total_orders
      FROM orders
      GROUP BY store_id
      ORDER BY total_revenue DESC
    `);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}

// GET /analytics/top-items
export async function topSellingItems(_req: Request, res: Response, next: NextFunction) {
  try {
    const [rows]: any = await pool.execute(`
      SELECT 
        JSON_UNQUOTE(JSON_EXTRACT(item.value, '$.item_id')) AS item_id,
        SUM(CAST(JSON_UNQUOTE(JSON_EXTRACT(item.value, '$.qty')) AS UNSIGNED)) AS total_qty
      FROM orders,
      JSON_TABLE(items, '$[*]' COLUMNS (value JSON PATH '$')) AS item
      GROUP BY item_id
      ORDER BY total_qty DESC
      LIMIT 5
    `);
    return res.json(rows);
  } catch (err) {
    next(err);
  }
}