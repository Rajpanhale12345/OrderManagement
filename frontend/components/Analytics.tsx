'use client';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

const fetchOrdersPerDay = () =>
  api.get('/analytics/orders-per-day').then((r) => r.data);

const fetchRevenuePerStore = () =>
  api.get('/analytics/revenue-per-store').then((r) => r.data);

const fetchTopItems = () =>
  api.get('/analytics/top-items').then((r) => r.data);

export default function Analytics() {
  const { data: ordersPerDay, isLoading: l1 } = useQuery({
    queryKey: ['analytics-orders-per-day'],
    queryFn: fetchOrdersPerDay,
  });

  const { data: revenuePerStore, isLoading: l2 } = useQuery({
    queryKey: ['analytics-revenue-per-store'],
    queryFn: fetchRevenuePerStore,
  });

  const { data: topItems, isLoading: l3 } = useQuery({
    queryKey: ['analytics-top-items'],
    queryFn: fetchTopItems,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Orders Per Day */}
      <div style={cardStyle}>
        <h2 style={headingStyle}>📅 Orders Per Day</h2>
        {l1 && <p style={mutedText}>Loading...</p>}
        {ordersPerDay?.length === 0 && <p style={mutedText}>No data yet</p>}
        {ordersPerDay?.map((row: any) => (
          <div key={row.date} style={rowStyle}>
            <span style={{ color: '#cbd5e1' }}>
              {new Date(row.date).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              })}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: `${Math.min(row.total_orders * 30, 200)}px`,
                height: '10px',
                background: '#3b82f6',
                borderRadius: '999px',
              }} />
              <span style={{ color: '#fff', fontWeight: 600 }}>
                {row.total_orders} orders
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Per Store */}
      <div style={cardStyle}>
        <h2 style={headingStyle}>🏪 Revenue Per Store</h2>
        {l2 && <p style={mutedText}>Loading...</p>}
        {revenuePerStore?.length === 0 && <p style={mutedText}>No data yet</p>}
        {revenuePerStore?.map((row: any) => (
          <div key={row.store_id} style={rowStyle}>
            <div>
              <p style={{ color: '#fff', fontWeight: 600 }}>{row.store_id}</p>
              <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>{row.total_orders} orders</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#22c55e', fontWeight: 700, fontSize: '1.1rem' }}>
                ₹{Number(row.total_revenue).toLocaleString('en-IN')}
              </p>
              <div style={{
                width: `${Math.min(Number(row.total_revenue) / 50, 150)}px`,
                height: '8px',
                background: '#22c55e',
                borderRadius: '999px',
                marginLeft: 'auto',
                marginTop: '4px',
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Top 5 Selling Items */}
      <div style={cardStyle}>
        <h2 style={headingStyle}>🔥 Top 5 Selling Items</h2>
        {l3 && <p style={mutedText}>Loading...</p>}
        {topItems?.length === 0 && <p style={mutedText}>No data yet</p>}
        {topItems?.map((row: any, index: number) => (
          <div key={row.item_id} style={rowStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                background: index === 0 ? '#f59e0b' : index === 1 ? '#9ca3af' : index === 2 ? '#b45309' : '#374151',
                color: '#fff',
                fontWeight: 700,
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                flexShrink: 0,
              }}>
                {index + 1}
              </span>
              <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{row.item_id}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: `${Math.min(row.total_qty * 15, 150)}px`,
                height: '10px',
                background: '#f59e0b',
                borderRadius: '999px',
              }} />
              <span style={{ color: '#fff', fontWeight: 600 }}>{row.total_qty} qty</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// Styles
const cardStyle: React.CSSProperties = {
  background: '#1e1e2e',
  borderRadius: '12px',
  padding: '1.5rem',
};

const headingStyle: React.CSSProperties = {
  color: '#fff',
  marginBottom: '1.25rem',
  fontSize: '1.1rem',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.6rem 0',
  borderBottom: '1px solid #2a2a3e',
};

const mutedText: React.CSSProperties = {
  color: '#6b7280',
  fontSize: '0.9rem',
};