'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faClipboardList,
  faRotate,
  faChartBar,
  faStore,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Create Order', icon: faPlus },
    { href: '/orders', label: 'Orders List', icon: faClipboardList },
    { href: '/update-status', label: 'Update Status', icon: faRotate },
    { href: '/analytics', label: 'Analytics', icon: faChartBar },
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          borderRadius: '8px',
          width: '34px',
          height: '34px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <FontAwesomeIcon icon={faStore} style={{ color: '#fff', width: '16px', height: '16px' }} />
        </div>
        <span style={{
          color: '#f1f5f9',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '-0.3px',
        }}>
          TMBill
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#fff' : '#94a3b8',
                background: isActive
                  ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                  : 'transparent',
                boxShadow: isActive
                  ? '0 2px 8px rgba(59,130,246,0.4)'
                  : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <FontAwesomeIcon
                icon={link.icon}
                style={{
                  width: '13px',
                  height: '13px',
                  color: isActive ? '#fff' : '#64748b',
                }}
              />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}