'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { updateStatus } from '../lib/api';

const STATUSES = ['PLACED', 'PREPARING', 'COMPLETED'] as const;

export default function UpdateStatus() {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<typeof STATUSES[number]>('PREPARING');

  const mutation = useMutation({
    mutationFn: () => updateStatus(orderId, status),
    onSuccess: (data) => alert(`Order ${data.id.slice(0, 8)} updated to ${data.status}`),
  });

  return (
    <div className="card" style={{ maxWidth: 400 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label>Order ID</label>
        <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Paste full order UUID" />

        <label>New Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>

        <button onClick={() => mutation.mutate()} disabled={!orderId || mutation.isPending}>
          {mutation.isPending ? 'Updating...' : 'Update Status'}
        </button>
        {mutation.isError && <p style={{ color: 'red' }}>Error updating status</p>}
      </div>
    </div>
  );
}