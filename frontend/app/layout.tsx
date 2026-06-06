import type { Metadata } from 'next';
import QueryProvider from '../providers/QueryProvider';
import Navbar from '../components/Navbar';
import './globals.css';

export const metadata: Metadata = { title: 'Order Management' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navbar />
          <main style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}