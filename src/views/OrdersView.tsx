import React from 'react';
import { Order } from '../types';
import { Package, Truck, CheckCircle2, Zap } from 'lucide-react';

interface OrdersViewProps {
  orders: Order[];
  onAdvanceOrderStatus: (orderId: string) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
  setCurrentView: (view: string) => void;
}

const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onAdvanceOrderStatus,
  addToast,
  setCurrentView
}) => {
  
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'received':
        return <span className="badge-neon" style={{ borderColor: '#f39c12', color: '#f39c12', backgroundColor: 'rgba(243, 156, 18, 0.08)' }}>📥 Recebido pela Nave-Mãe</span>;
      case 'processing':
        return <span className="badge-neon">⚙️ Em Processamento</span>;
      case 'warp_drive':
        return <span className="badge-purple" style={{ textShadow: '0 0 5px rgba(155, 81, 224, 0.4)' }}>🚀 Em Trânsito Quântico</span>;
      case 'delivered':
        return <span className="badge-neon" style={{ borderColor: '#45e627', color: '#45e627', backgroundColor: 'rgba(69, 230, 39, 0.08)' }}>✅ Entregue via Feixe de Luz</span>;
      default:
        return <span className="badge-neon">🛸 Processando</span>;
    }
  };

  const getStepStatus = (currentStatus: Order['status'], stepIndex: number) => {
    // Milestones: 0 = received, 1 = processing, 2 = warp_drive, 3 = delivered
    const statusMap = {
      'received': 0,
      'processing': 1,
      'warp_drive': 2,
      'delivered': 3,
      'abducted': 0
    };

    const activeIndex = statusMap[currentStatus] || 0;

    if (activeIndex > stepIndex) return 'completed';
    if (activeIndex === stepIndex) return 'active';
    return 'pending';
  };

  const getWarpButtonLabel = (status: Order['status']) => {
    switch (status) {
      case 'received': return 'Iniciar Processamento ⚙️';
      case 'processing': return 'Acionar Hiper-espaço 🚀';
      case 'warp_drive': return 'Liberar Feixe de Entrega ✅';
      case 'delivered': return 'Pedido Finalizado Cósmicamente! 🌌';
      default: return 'Acelerar Dobra Espacial 🚀';
    }
  };

  const handleAdvanceStatus = (orderId: string, currentStatus: Order['status']) => {
    if (currentStatus === 'delivered') {
      addToast('Este pacote já pousou no seu quintal interestelar! 🪐🏡', 'success');
      return;
    }
    
    onAdvanceOrderStatus(orderId);
    
    if (currentStatus === 'received') {
      addToast('Iniciando processamento das suas mercadorias espaciais! ⚙️', 'success');
    } else if (currentStatus === 'processing') {
      addToast('Turbinas aquecidas! Entrando em velocidade de dobra de 50.000 anos-luz! 🚀', 'success');
    } else if (currentStatus === 'warp_drive') {
      addToast('Fenda quântica aberta! Pacote teletransportado com sucesso! ✅', 'success');
    }
  };

  if (orders.length === 0) {
    return (
      <div className="view-container animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
        {/* Humorous beach sunbathing alien mascot visual */}
        <div style={{ maxWidth: '380px', margin: '0 auto 24px auto', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'var(--color-bg-card)' }}>
          <img 
            src="/mascot_beach.png" 
            alt="Mascote na Praia" 
            style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} 
          />
          <div style={{ padding: '14px', fontSize: '0.78rem', color: 'var(--color-primary)', fontStyle: 'italic', borderTop: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(0,0,0,0.3)' }}>
            🛸 "Nenhum pedido no radar por enquanto... Curtindo meu drink de plasma sob o sol quântico."
          </div>
        </div>

        <h2 className="neon-text" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Rastreador Sem Sinais</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 24px auto', fontSize: '0.9rem', lineHeight: '1.4' }}>
          Nosso despachante alienígena está descansando nas praias artificiais de Netuno. Compre qualquer periférico na loja para colocá-lo de volta ao trabalho na nave mãe!
        </p>
        <button
          className="neon-glow-btn"
          style={{ padding: '12px 28px', margin: '0 auto' }}
          onClick={() => setCurrentView('home')}
        >
          COMPRAR MOUSE OU TECLADO
        </button>
      </div>
    );
  }

  return (
    <div className="view-container animate-fade-in">
      <h2 className="section-title" style={{ marginBottom: '24px' }}>Meus Pedidos Cósmicos</h2>

      {orders.map((order) => (
        <div key={order.id} className="order-tracking-card">
          <div className="order-card-header">
            <div>
              <span className="order-id">{order.id}</span>
              <span className="order-date" style={{ marginLeft: '12px' }}>🛰️ Emitido em: {order.date}</span>
            </div>
            <div>
              {getStatusBadge(order.status)}
            </div>
          </div>

          {/* Stepper tracker */}
          <div className="order-tracking-stepper">
            {/* Step 1: Processing */}
            <div className={`order-step-node ${getStepStatus(order.status, 1)}`}>
              <div className="order-step-icon-circle">
                <Package size={14} />
              </div>
              <span className="order-step-name">Nave-Mãe</span>
              <span className="order-step-fun-status">Em Separação</span>
            </div>

            {/* Step 2: Warp Drive */}
            <div className={`order-step-node ${getStepStatus(order.status, 2)}`}>
              <div className="order-step-icon-circle">
                <Truck size={14} />
              </div>
              <span className="order-step-name">Em Trânsito</span>
              <span className="order-step-fun-status">Velocidade Quântica</span>
            </div>

            {/* Step 3: Delivered */}
            <div className={`order-step-node ${getStepStatus(order.status, 3)}`}>
              <div className="order-step-icon-circle">
                <CheckCircle2 size={14} />
              </div>
              <span className="order-step-name">Feixe de Luz</span>
              <span className="order-step-fun-status">Entregue</span>
            </div>
          </div>

          {order.trackingCode && (
            <div style={{ marginTop: '16px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(69, 230, 39, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '4px' }}>CÓDIGO DE RASTREIO GALÁCTICO</span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontFamily: 'var(--font-display)', letterSpacing: '1px' }}>{order.trackingCode}</span>
              </div>
              <a 
                href={`https://rastreamento.correios.com.br/app/index.php`} 
                target="_blank" 
                rel="noreferrer"
                className="neon-glow-btn"
                style={{ padding: '6px 12px', fontSize: '0.75rem' }}
              >
                Acompanhar
              </a>
            </div>
          )}

          {/* Comical dispatch warp accelerator button! */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '20px' }}>
            <button
              className={`outline-btn ${order.status === 'delivered' ? 'disabled-button' : ''}`}
              style={{
                fontSize: '0.8rem',
                padding: '10px 24px',
                borderColor: order.status === 'delivered' ? 'rgba(255, 255, 255, 0.1)' : 'var(--color-primary)',
                color: order.status === 'delivered' ? 'var(--color-text-muted)' : 'var(--color-primary)',
                cursor: order.status === 'delivered' ? 'default' : 'pointer'
              }}
              onClick={() => handleAdvanceStatus(order.id, order.status)}
              disabled={order.status === 'delivered'}
            >
              <Zap size={14} className={order.status !== 'delivered' ? 'animate-blink' : ''} />
              {getWarpButtonLabel(order.status)}
            </button>
          </div>

          {/* Sub Items bought */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            <h4 style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase' }}>
              Pacotes Abduzidos:
            </h4>
            
            <div className="order-details-table">
              {order.items.map((item) => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', padding: '6px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.02)' }}>
                  <span>
                    {item.product.name} <strong style={{ color: 'var(--color-primary)' }}>x{item.quantity}</strong>
                  </span>
                  <span style={{ fontWeight: '700' }}>
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}

              <div className="order-details-summary-row">
                <span style={{ color: 'var(--color-text-muted)' }}>Método de Entrega:</span>
                <span>📡 {order.shippingAddress.portalName}</span>
              </div>

              <div className="order-details-summary-row" style={{ fontWeight: '800', border: 'none', padding: '4px 0' }}>
                <span style={{ color: 'var(--color-text-white)' }}>Total Pago:</span>
                <span className="neon-text" style={{ fontSize: '0.9rem' }}>
                  R$ {order.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersView;
