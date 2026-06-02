import React, { useState } from 'react';
import { PaymentSettings } from '../../types';
import { Save, CreditCard, Percent, Truck, Layers } from 'lucide-react';

interface AdminPaymentsProps {
  paymentSettings: PaymentSettings;
  onUpdatePaymentSettings: (ps: PaymentSettings) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const INSTALLMENT_OPTIONS = [1,2,3,4,6,8,10,12,18,24];
const AVAILABLE_PAYMENT_METHODS = ['💳 Cartão de Crédito', '📱 PIX', '🏦 Boleto Bancário', '💰 Carteira Plug-in', 'PIX ⚡', 'VISA 💳', 'MASTER 💳', 'BOLETO 📄', 'PAYPAL 🪐'];

const AdminPayments: React.FC<AdminPaymentsProps> = ({ paymentSettings, onUpdatePaymentSettings, addToast }) => {
  const [settings, setSettings] = useState<PaymentSettings>(paymentSettings);
  
  const set = (k: keyof PaymentSettings, v: any) => setSettings(s => ({ ...s, [k]: v }));

  const togglePaymentMethod = (method: string) => {
    setSettings(prev => {
      const methods = prev.paymentMethods || [];
      if (methods.includes(method)) {
        return { ...prev, paymentMethods: methods.filter(m => m !== method) };
      } else {
        return { ...prev, paymentMethods: [...methods, method] };
      }
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdatePaymentSettings(settings);
    addToast('Configurações de pagamento salvas! 💳', 'success');
  };

  const installmentsPreview = () => {
    const prices = [99.9, 199.9, 499.9];
    return prices.map(price => {
      const validInstallments = [];
      for (let i = 1; i <= settings.maxInstallments; i++) {
        if ((price / i) >= settings.installmentMinValue) {
          validInstallments.push(i);
        }
      }
      return { price, max: validInstallments[validInstallments.length - 1] || 1 };
    });
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>💳 Configurações de Pagamento</h2>
      </div>

      <form onSubmit={handleSave}>
        <div className="admin-payment-grid">
          {/* PIX Settings */}
          <div className="admin-payment-card glass-panel">
            <div className="admin-payment-card-header">
              <Percent size={20} className="neon-text" />
              <h3>Desconto no PIX</h3>
            </div>
            <div className="admin-field" style={{ marginTop: '16px' }}>
              <label>Percentual de desconto no PIX (%)</label>
              <input className="cyber-input" type="number" min="0" max="50" step="0.5"
                value={settings.pixDiscountPercent}
                onChange={e => set('pixDiscountPercent', parseFloat(e.target.value))} />
            </div>
            <div className="admin-payment-preview">
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Preview:</p>
              {[99.9, 199.9, 499.9].map(p => (
                <div key={p} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>R$ {p.toFixed(2).replace('.', ',')}</span>
                  <span style={{ color: 'var(--color-primary)' }}>→ R$ {(p * (1 - settings.pixDiscountPercent / 100)).toFixed(2).replace('.', ',')} no PIX</span>
                </div>
              ))}
            </div>
          </div>

          {/* Installments */}
          <div className="admin-payment-card glass-panel">
            <div className="admin-payment-card-header">
              <Layers size={20} className="neon-text" />
              <h3>Parcelamento</h3>
            </div>
            <div className="admin-form-row" style={{ marginTop: '16px' }}>
              <div className="admin-field">
                <label>Máximo de parcelas</label>
                <select className="cyber-input" value={settings.maxInstallments} onChange={e => set('maxInstallments', parseInt(e.target.value))}>
                  {INSTALLMENT_OPTIONS.map(n => <option key={n} value={n}>{n}x</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label>Valor mínimo por parcela (R$)</label>
                <input className="cyber-input" type="number" min="1" step="1"
                  value={settings.installmentMinValue}
                  onChange={e => set('installmentMinValue', parseFloat(e.target.value))} />
              </div>
            </div>
            <div className="admin-payment-preview">
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Preview de parcelas máximas:</p>
              {installmentsPreview().map(({ price, max }) => (
                <div key={price} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>R$ {price.toFixed(2).replace('.', ',')}</span>
                  <span style={{ color: 'var(--color-primary)' }}>Até {max}x de R$ {(price / max).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Free Shipping */}
          <div className="admin-payment-card glass-panel">
            <div className="admin-payment-card-header">
              <Truck size={20} className="neon-text" />
              <h3>Frete Grátis</h3>
            </div>
            <div className="admin-field" style={{ marginTop: '16px' }}>
              <label>Valor mínimo para frete grátis (R$)</label>
              <input className="cyber-input" type="number" min="0" step="1"
                value={settings.freeShippingThreshold || ''}
                onChange={e => set('freeShippingThreshold', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="Em branco = nunca grátis" />
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '12px', lineHeight: '1.5' }}>
              Pedidos acima de <strong style={{ color: '#fff' }}>R$ {settings.freeShippingThreshold?.toFixed(2).replace('.', ',') || '—'}</strong> terão frete grátis automaticamente na finalização.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="admin-payment-card glass-panel">
            <div className="admin-payment-card-header">
              <CreditCard size={20} className="neon-text" />
              <h3>Métodos Aceitos</h3>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {AVAILABLE_PAYMENT_METHODS.map(m => (
                <label key={m} className="admin-check-label" style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={(settings.paymentMethods || []).includes(m)}
                    onChange={() => togglePaymentMethod(m)}
                  />
                  {m}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="submit" className="neon-glow-btn" style={{ padding: '14px 32px', fontSize: '0.95rem' }}>
            <Save size={18} /> Salvar Configurações
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPayments;
