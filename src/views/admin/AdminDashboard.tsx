import React from 'react';
import { Order, Product } from '../../types';
import { ShoppingBag, Package, TrendingUp, ArrowUpRight, Star } from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders, products }) => {
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const processingCount = orders.filter(o => o.status === 'processing').length;
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  const stats = [
    { label: 'Receita Total', value: `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`, icon: TrendingUp, color: '#45e627' },
    { label: 'Total de Pedidos', value: orders.length, icon: ShoppingBag, color: '#a78bfa' },
    { label: 'Produtos Ativos', value: products.length, icon: Package, color: '#fb923c' },
    { label: 'Pedidos Entregues', value: deliveredCount, icon: Star, color: '#22c55e' },
  ];

  const recent = [...orders].reverse().slice(0, 5);

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>📊 Dashboard</h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Visão geral da loja</span>
      </div>

      <div className="admin-stats-grid">
        {stats.map(s => (
          <div key={s.label} className="admin-stat-card glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p className="admin-stat-label">{s.label}</p>
                <p className="admin-stat-value" style={{ color: s.color }}>{s.value}</p>
              </div>
              <div className="admin-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>
                <s.icon size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {processingCount > 0 && (
        <div className="admin-alert-banner" style={{ margin: '24px 0' }}>
          <ArrowUpRight size={18} />
          <span><strong>{processingCount} pedido(s)</strong> aguardando processamento</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>📋 Pedidos Recentes</h3>
          {recent.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Nenhum pedido ainda.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recent.map(o => (
                <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{o.shippingAddress.fullName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{new Date(o.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9rem' }}>R$ {o.total.toFixed(2).replace('.', ',')}</p>
                    <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>📦 Top Produtos</h3>
          {products.slice(0, 5).map((p, i) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', borderRadius: '8px', marginBottom: '6px', background: 'rgba(255,255,255,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.7rem', color: 'var(--color-text-muted)', minWidth: '16px' }}>#{i + 1}</span>
                <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{p.name}</p>
              </div>
              <span style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700 }}>R$ {p.price.toFixed(2).replace('.', ',')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
