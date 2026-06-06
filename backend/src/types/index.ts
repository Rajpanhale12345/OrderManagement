export interface OrderItem {
  item_id: string;
  qty: number;
}

export interface Order {
  id: string;
  store_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'PLACED' | 'PREPARING' | 'COMPLETED';
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}