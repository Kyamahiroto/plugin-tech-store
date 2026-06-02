import React, { useState } from 'react';
import { Order } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AdminOrdersProps {
  orders: Order[];
  onAdvanceStatus: (orderId: string) => void;
  onUpdateStatus: (orderId: string, newStatus: Order['status'], trackingCode?: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  received: '📥 Recebido',
  processing: '⚙️ Processando',
  warp_drive: '🚀 Em Trânsito',
  delivered: '✅ Entregue',
  abducted: '👽 Abduzido'
};

const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onAdvanceStatus, onUpdateStatus }) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // Tab can be 'active' or 'completed'
  const [mainTab, setMainTab] = useState<'active'|'completed'>('active');
  const [filter, setFilter] = useState('all');

  // Tracking code state for each expanded order
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  const isCompleted = (status: string) => status === 'delivered' || status === 'abducted';

  // Filter logic
  let filtered = orders.filter(o => mainTab === 'active' ? !isCompleted(o.status) : isCompleted(o.status));
  if (filter !== 'all') {
    filtered = filtered.filter(o => o.status === filter);
  }

  const handleTrackingChange = (orderId: string, val: string) => {
    setTrackingInputs(prev => ({ ...prev, [orderId]: val }));
  };

  const saveUpdates = (order: Order, newStatus: Order['status']) => {
    const code = trackingInputs[order.id] !== undefined ? trackingInputs[order.id] : order.trackingCode;
    onUpdateStatus(order.id, newStatus, code);
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <h2>📋 Pedidos</h2>
          <div className="admin-tabs">
            <button className={`admin-tab ${mainTab === 'active' ? 'active' : ''}`} onClick={() => { setMainTab('active'); setFilter('all'); }}>
              Ativos
            </button>
            <button className={`admin-tab ${mainTab === 'completed' ? 'active' : ''}`} onClick={() => { setMainTab('completed'); setFilter('all'); }}>
              Finalizados
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {mainTab === 'active' ? (
            ['all', 'received', 'processing', 'warp_drive'].map(s => (
              <button key={s} className={`admin-filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                {s === 'all' ? 'Todos Ativos' : STATUS_LABELS[s]}
              </button>
            ))
          ) : (
            ['all', 'delivered', 'abducted'].map(s => (
              <button key={s} className={`admin-filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                {s === 'all' ? 'Todos Finalizados' : STATUS_LABELS[s]}
              </button>
            ))
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty-state">
          <span>📭</span>
          <p>Nenhum pedido encontrado</p>
        </div>
      ) : (
        <div className="admin-orders-list">
          {filtered.map(order => (
            <div key={order.id} className="admin-order-card glass-panel">
              <div className="admin-order-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>#{order.id.slice(-8).toUpperCase()}</span>
                  <span style={{ fontWeight: 700 }}>{order.shippingAddress.fullName}</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{new Date(order.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>R$ {order.total.toFixed(2).replace('.', ',')}</span>
                  <span className={`admin-status-chip status-${order.status}`}>{STATUS_LABELS[order.status]}</span>
                  {order.status !== 'abducted' && order.status !== 'delivered' && (
                    <button className="neon-glow-btn" style={{ padding: '6px 14px', fontSize: '0.75rem' }}
                      onClick={e => { e.stopPropagation(); onAdvanceStatus(order.id); }}>
                      Avançar →
                    </button>
                  )}
                  {expanded === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {expanded === order.id && (
                <div className="admin-order-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>ENDEREÇO</p>
                      <p>{order.shippingAddress.street}, {order.shippingAddress.city}</p>
                      <p style={{ fontSize: '0.85rem' }}>Portal: {order.shippingAddress.portalName}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>PAGAMENTO</p>
                      <p>{order.paymentMethod || 'Não informado'}</p>
                      {order.couponCode && <p style={{ color: 'var(--color-warning)', fontSize: '0.85rem' }}>Cupom: {order.couponCode}</p>}
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label className="admin-field-label">Status do Pedido</label>
                      <select 
                        className="cyber-input"
                        value={order.status}
                        onChange={(e) => saveUpdates(order, e.target.value as Order['status'])}
                      >
                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                          <option key={key} value={key} style={{ background: '#121214' }}>{label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="admin-field-label">Código de Rastreio</label>
                      <input 
                        type="text" 
                        className="cyber-input" 
                        placeholder="Ex: BR123456789BR"
                        value={trackingInputs[order.id] !== undefined ? trackingInputs[order.id] : (order.trackingCode || '')}
                        onChange={e => handleTrackingChange(order.id, e.target.value)}
                      />
                    </div>
                    <div>
                      <button 
                        className="neon-glow-btn" 
                        onClick={() => saveUpdates(order, order.status)}
                      >
                        Salvar Rastreio
                      </button>
                    </div>
                  </div>
                  <table className="admin-table" style={{ marginTop: 0 }}>
                    <thead><tr><th>Produto</th><th>Qtd</th><th>Preço Unit.</th><th>Subtotal</th></tr></thead>
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={i}>
                          <td>{item.product.name}</td>
                          <td>{item.quantity}</td>
                          <td>R$ {item.product.price.toFixed(2).replace('.', ',')}</td>
                          <td>R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '24px', marginTop: '12px', fontSize: '0.9rem' }}>
                    <span>Frete: R$ {order.shippingFee.toFixed(2).replace('.', ',')}</span>
                    <strong>Total: R$ {order.total.toFixed(2).replace('.', ',')}</strong>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
