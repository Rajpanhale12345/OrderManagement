
import { Server } from 'socket.io';

let io: Server;

export function initSocket(server: any) {
  io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join a store-specific room for filtered events
    socket.on('join_store', (store_id: string) => {
      socket.join(`store_${store_id}`);
      console.log(`Socket ${socket.id} joined store_${store_id}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function emitNewOrder(order: any) {
  if (!io) return;
  io.to(`store_${order.store_id}`).emit('new_order', order);
}

export function emitStatusUpdate(order: any) {
  if (!io) return;
  io.to(`store_${order.store_id}`).emit('order_status_updated', order);
}