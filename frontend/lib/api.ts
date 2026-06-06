import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

export interface OrderItem { item_id: string; qty: number; }

export interface Order {
  id: string;
  store_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'PLACED' | 'PREPARING' | 'COMPLETED';
  created_at: string;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const createOrder = (payload: {
  store_id: string;
  items: OrderItem[];
  total_amount: number;
}) => api.post<Order>('/orders', payload).then((r) => r.data);

export const fetchOrders = (store_id: string, page = 1, limit = 10) =>
  api.get<PaginatedOrders>('/orders', { params: { store_id, page, limit } }).then((r) => r.data);

export const updateStatus = (id: string, status: Order['status']) =>
  api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data);