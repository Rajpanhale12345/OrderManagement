## 📡 API Documentation

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create a new order |
| GET | `/orders?store_id=&page=&limit=` | Get paginated orders by store |
| PATCH | `/orders/:id/status` | Update order status |

#### POST /orders — Request Body
```json
{
  "store_id": "store-1",
  "items": [
    { "item_id": "burger", "qty": 2 },
    { "item_id": "fries", "qty": 1 }
  ],
  "total_amount": 599
}
```

#### PATCH /orders/:id/status — Request Body
```json
{
  "status": "PREPARING"
}
```

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/archive-old-orders` | Archive orders older than 30 days |
| GET | `/analytics/orders-per-day` | Orders count per day |
| GET | `/analytics/revenue-per-store` | Total revenue per store |
| GET | `/analytics/top-items` | Top 5 selling items |

## ⚡ WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join_store` | Client → Server | Subscribe to store room |
| `new_order` | Server → Client | Emitted when order is created |
| `order_status_updated` | Server → Client | Emitted when status changes |

## 🗄️ Database Schema

```sql
orders (
  id VARCHAR(36) PRIMARY KEY,
  store_id VARCHAR(100),     -- INDEX
  items JSON,
  total_amount DECIMAL(10,2),
  status ENUM('PLACED','PREPARING','COMPLETED'),
  created_at TIMESTAMP       -- INDEX
)

orders_archive (
  -- same columns + archived_at TIMESTAMP
)
```

## 🎯 Design Decisions

- **JSON items column** — avoids N+1 queries by storing items inside the order row
- **Socket.IO rooms** — store-based filtering so clients only receive relevant events
- **React Query** — handles caching, background refetching, and optimistic updates
- **Zod validation** — runtime type safety on all API inputs