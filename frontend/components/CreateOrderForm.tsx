'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createOrder, Order, OrderItem } from '../lib/api';

export default function CreateOrderForm() {
  const [storeId, setStoreId] = useState('store-1');
  const [items, setItems] = useState<OrderItem[]>([{ item_id: '', qty: 1 }]);
  const [totalAmount, setTotalAmount] = useState('');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      setCreatedOrder(data);
      setItems([{ item_id: '', qty: 1 }]);
      setTotalAmount('');
    },
  });

  const updateItem = (i: number, field: keyof OrderItem, val: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: field === 'qty' ? Number(val) : val };
    setItems(updated);
  };

  const handleSubmit = () => {
    if (!storeId || !totalAmount) return alert('Fill all fields');
    mutation.mutate({ store_id: storeId, items, total_amount: Number(totalAmount) });
  };

  return (
    <div>
      <div style={{
        background: '#1e1e2e',
        borderRadius: '12px',
        padding: '1.5rem',
        maxWidth: 500,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div>
          <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Store ID</label>
          <input
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            placeholder="store-1"
            style={{ width: '100%', marginTop: '0.3rem', padding: '0.6rem', borderRadius: '8px', border: '1px solid #333', background: '#2a2a3e', color: '#fff' }}
          />
        </div>

        <div>
          <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Items</label>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
              <input
                placeholder="Item ID (e.g. burger)"
                value={item.item_id}
                onChange={(e) => updateItem(i, 'item_id', e.target.value)}
                style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #333', background: '#2a2a3e', color: '#fff' }}
              />
              <input
                type="number"
                placeholder="Qty"
                value={item.qty}
                onChange={(e) => updateItem(i, 'qty', e.target.value)}
                style={{ width: 70, padding: '0.6rem', borderRadius: '8px', border: '1px solid #333', background: '#2a2a3e', color: '#fff' }}
              />
              {items.length > 1 && (
                <button
                  onClick={() => setItems(items.filter((_, j) => j !== i))}
                  style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 0.75rem', cursor: 'pointer' }}
                >✕</button>
              )}
            </div>
          ))}
          <button
            onClick={() => setItems([...items, { item_id: '', qty: 1 }])}
            style={{ marginTop: '0.5rem', background: '#374151', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 1rem', cursor: 'pointer' }}
          >
            + Add Item
          </button>
        </div>

        <div>
          <label style={{ color: '#aaa', fontSize: '0.85rem' }}>Total Amount (₹)</label>
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            placeholder="999"
            style={{ width: '100%', marginTop: '0.3rem', padding: '0.6rem', borderRadius: '8px', border: '1px solid #333', background: '#2a2a3e', color: '#fff' }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          style={{ background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem', fontSize: '1rem', cursor: 'pointer' }}
        >
          {mutation.isPending ? 'Creating...' : 'Create Order'}
        </button>

        {mutation.isError && (
          <p style={{ color: '#ef4444' }}>❌ Error creating order. Check backend.</p>
        )}
      </div>

      {/* Show created order details */}
      {createdOrder && (
        <div style={{
          marginTop: '1.5rem',
          background: '#0f2d0f',
          border: '1px solid #22c55e',
          borderRadius: '12px',
          padding: '1.25rem',
          maxWidth: 500,
        }}>
          <p style={{ color: '#22c55e', fontWeight: 700, marginBottom: '0.75rem' }}>
            ✅ Order Created Successfully!
          </p>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Order ID (copy this for status update):</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <code style={{
              background: '#1a1a2e',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              color: '#60a5fa',
              fontSize: '0.85rem',
              flex: 1,
              wordBreak: 'break-all',
            }}>
              {createdOrder.id}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(createdOrder.id);
                alert('Copied!');
              }}
              style={{ background: '#374151', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Copy ID
            </button>
          </div>
          <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '0.5rem' }}>
            Store: <strong style={{ color: '#fff' }}>{createdOrder.store_id}</strong> |
            Amount: <strong style={{ color: '#fff' }}>₹{createdOrder.total_amount}</strong> |
            Status: <strong style={{ color: '#22c55e' }}>{createdOrder.status}</strong>
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Search <strong style={{ color: '#fff' }}>{createdOrder.store_id}</strong> on Orders List to see it
          </p>
        </div>
      )}
    </div>
  );
}