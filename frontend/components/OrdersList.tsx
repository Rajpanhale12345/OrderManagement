'use client';
import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, Order } from '../lib/api';
import { getSocket, joinStore } from '../lib/socket';

export default function OrdersList() {
  const [storeId, setStoreId] = useState('store-1');
  const [inputValue, setInputValue] = useState('store-1');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const joinedStoreRef = useRef<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', storeId, page],
    queryFn: () => fetchOrders(storeId, page),
    enabled: !!storeId,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!storeId) return;

    if (joinedStoreRef.current !== storeId) {
      joinStore(storeId);
      joinedStoreRef.current = storeId;
    }

    const socket = getSocket();

    const handleNewOrder = (order: Order) => {
      queryClient.setQueryData(['orders', storeId, 1], (old: any) => {
        if (!old) return old;
        const exists = old.data.some((o: Order) => o.id === order.id);
        if (exists) return old;
        return {
          ...old,
          data: [order, ...old.data.slice(0, old.limit - 1)],
          total: old.total + 1,
        };
      });
    };

    const handleStatusUpdate = (updated: Order) => {
      queryClient.setQueryData(['orders', storeId, page], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((o: Order) =>
            o.id === updated.id ? updated : o
          ),
        };
      });
    };

    socket.on('new_order', handleNewOrder);
    socket.on('order_status_updated', handleStatusUpdate);

    return () => {
      socket.off('new_order', handleNewOrder);
      socket.off('order_status_updated', handleStatusUpdate);
    };
  }, [storeId, page, queryClient]);

  const handleSearch = () => {
    setStoreId(inputValue.trim());
    setPage(1);
  };

  return (
    <div style={{ padding: '1rem' }}>

      {/* Search Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Enter Store ID (e.g. store-1)"
          style={{
            flex: 1, padding: '0.6rem 1rem', borderRadius: '8px',
            border: '1px solid #ccc', fontSize: '1rem',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '0.6rem 1.2rem', background: '#0070f3',
            color: '#fff', border: 'none', borderRadius: '8px',
            cursor: 'pointer', fontSize: '1rem',
          }}
        >
          Search
        </button>
      </div>

      {/* States */}
      {isLoading && <p style={{ color: '#888' }}>Loading orders...</p>}
      {isError && <p style={{ color: 'red' }}>❌ Failed to fetch orders.</p>}
      {!isLoading && !isError && data?.data.length === 0 && (
        <p style={{ color: '#888' }}>
          No orders found for store: <strong>{storeId}</strong>
        </p>
      )}

      {/* Order Cards */}
      {data?.data.map((order) => (
        <div key={order.id} style={{
          background: '#fff',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          marginBottom: '0.75rem',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        }}>

          {/* Status Badge */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.4rem' }}>
            <span style={{
              padding: '2px 12px',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              background:
                order.status === 'PLACED' ? '#dbeafe' :
                order.status === 'PREPARING' ? '#fef9c3' : '#dcfce7',
              color:
                order.status === 'PLACED' ? '#1d4ed8' :
                order.status === 'PREPARING' ? '#92400e' : '#166534',
            }}>
              {order.status}
            </span>
          </div>

          {/* Full Order ID + Copy Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.5rem',
            background: '#f8fafc',
            borderRadius: '6px',
            padding: '0.4rem 0.6rem',
          }}>
            <strong style={{
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              color: '#334155',
              wordBreak: 'break-all',
              flex: 1,
            }}>
              {order.id}
            </strong>
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.id);
                alert('✅ Order ID copied!');
              }}
              style={{
                background: '#374151',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '3px 10px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Copy
            </button>
          </div>

          {/* Order Details */}
          <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
            🏪 Store: <strong>{order.store_id}</strong>
          </p>
          <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
            💰 Amount: <strong>₹{order.total_amount}</strong>
          </p>
          <p style={{ color: '#999', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
            🕐 {new Date(order.created_at).toLocaleString()}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.4rem' }}>
            🛒 Items: {order.items.map((i) => `${i.item_id} x${i.qty}`).join(', ')}
          </p>

        </div>
      ))}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem',
          alignItems: 'center',
        }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              background: page === 1 ? '#e5e7eb' : '#0070f3',
              color: page === 1 ? '#9ca3af' : '#fff',
              border: 'none',
            }}
          >
            ← Prev
          </button>
          <span style={{ color: '#555' }}>
            Page {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              cursor: page === data.totalPages ? 'not-allowed' : 'pointer',
              background: page === data.totalPages ? '#e5e7eb' : '#0070f3',
              color: page === data.totalPages ? '#9ca3af' : '#fff',
              border: 'none',
            }}
          >
            Next →
          </button>
        </div>
      )}

    </div>
  );
}