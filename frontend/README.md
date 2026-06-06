# Order Management System

Full-stack order management with real-time updates.

## Tech Stack
- **Frontend**: Next.js 14, React Query, Socket.IO Client, TypeScript
- **Backend**: Node.js, Express, Socket.IO, Zod, TypeScript
- **Database**: MySQL 8 with indexes on store_id and created_at
- **Infra**: Docker + Docker Compose

## Quick Start (Docker)

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Manual Setup

### Backend
```bash
cd backend
npm install
# create .env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders | Create order |
| GET | /orders?store_id=&page=&limit= | List orders |
| PATCH | /orders/:id/status | Update status |
| POST | /archive-old-orders | Archive orders > 30 days |
| GET | /analytics/orders-per-day | Daily order counts |
| GET | /analytics/revenue-per-store | Revenue by store |
| GET | /analytics/top-items | Top 5 items |

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| join_store | Client → Server | Subscribe to store updates |
| new_order | Server → Client | New order created |
| order_status_updated | Server → Client | Order status changed |