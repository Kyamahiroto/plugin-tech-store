import React, { useState } from 'react';
import { Coupon, CouponType } from '../../types';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const INITIAL_COUPONS: Coupon[] = [
  { id: 'c1', code: 'BEMVINDO10', type: 'percent', value: 10, freeShipping: false, firstPurchaseOnly: true, nonCumulative: true, usedCount: 0, active: true },
  { id: 'c2', code: 'FRETEFREE', type: 'fixed', value: 0, freeShipping: true, firstPurchaseOnly: false, nonCumulative: true, usedCount: 0, active: true },
  { id: 'c3', code: 'PLUG50', type: 'fixed', value: 50, freeShipping: false, firstPurchaseOnly: false, nonCumulative: true, minOrderValue: 200, usedCount: 0, active: true },
];

const EMPTY_COUPON: Partial<Coupon> = {
  code: '', type: 'percent', value: 10, freeShipping: false,
  firstPurchaseOnly: false, nonCumulative: true, usedCount: 0, active: true
};

interface AdminCouponsProps {
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const AdminCoupons: React.FC<AdminCouponsProps> = ({ addToast }) => {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Coupon>>(EMPTY_COUPON);

  const set = (k: keyof Coupon, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => { setForm(EMPTY_COUPON); setEditId(null); setShowForm(true); };
  const openEdit = (c: Coupon) => { setForm({ ...c }); setEditId(c.id); setShowForm(true); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code) { addToast('Informe o código do cupom!', 'error'); return; }
    const coupon: Coupon = {
      id: editId || `coupon-${Date.now()}`,
      code: form.code!.toUpperCase(),
      type: form.type as CouponType || 'percent',
      value: Number(form.value || 0),
      freeShipping: !!form.freeShipping,
      firstPurchaseOnly: !!form.firstPurchaseOnly,
      nonCumulative: !!form.nonCumulative,
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : undefined,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      usedCount: form.usedCount || 0,
      active: !!form.active,
      expiresAt: form.expiresAt || undefined
    };
    if (editId) setCoupons(prev => prev.map(c => c.id === editId ? coupon : c));
    else setCoupons(prev => [...prev, coupon]);
    addToast(`Cupom ${coupon.code} ${editId ? 'atualizado' : 'criado'}! 🎟️`, 'success');
    setShowForm(false);
  };

  const toggleActive = (id: string) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>🎟️ Cupons de Desconto</h2>
        <button className="neon-glow-btn" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={openNew}>
          <Plus size={16} /> Novo Cupom
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel">
            <div className="admin-modal-head">
              <h3>{editId ? 'Editar Cupom' : 'Novo Cupom'}</h3>
              <button onClick={() => setShowForm(false)} className="admin-close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Código do Cupom *</label>
                  <input className="cyber-input" value={form.code || ''} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="PLUGIN10" required style={{ fontFamily: 'var(--font-display)', letterSpacing: '2px' }} />
                </div>
                <div className="admin-field">
                  <label>Tipo de Desconto</label>
                  <select className="cyber-input" value={form.type || 'percent'} onChange={e => set('type', e.target.value)}>
                    <option value="percent">Percentual (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>{form.type === 'percent' ? 'Desconto (%)' : 'Desconto (R$)'}</label>
                  <input className="cyber-input" type="number" min="0" value={form.value || ''} onChange={e => set('value', e.target.value)} />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Valor Mínimo do Pedido (R$)</label>
                  <input className="cyber-input" type="number" min="0" value={form.minOrderValue || ''} onChange={e => set('minOrderValue', e.target.value)} placeholder="0 = sem mínimo" />
                </div>
                <div className="admin-field">
                  <label>Máximo de Usos</label>
                  <input className="cyber-input" type="number" min="0" value={form.maxUses || ''} onChange={e => set('maxUses', e.target.value)} placeholder="Em branco = ilimitado" />
                </div>
                <div className="admin-field">
                  <label>Expira em</label>
                  <input className="cyber-input" type="date" value={form.expiresAt || ''} onChange={e => set('expiresAt', e.target.value)} />
                </div>
              </div>

              <div className="admin-checks-row">
                {[
                  { k: 'freeShipping', label: '🚚 Frete Grátis' },
                  { k: 'firstPurchaseOnly', label: '👾 Apenas 1ª Compra' },
                  { k: 'nonCumulative', label: '🚫 Não Cumulativo' },
                  { k: 'active', label: '✅ Ativo' },
                ].map(({ k, label }) => (
                  <label key={k} className="admin-check-label">
                    <input type="checkbox" checked={!!(form as any)[k]} onChange={e => set(k as keyof Coupon, e.target.checked)} />
                    {label}
                  </label>
                ))}
              </div>

              <div className="admin-form-actions">
                <button type="button" className="outline-btn" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="neon-glow-btn" style={{ padding: '12px 28px' }}>
                  <Save size={16} /> Salvar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Código</th><th>Tipo</th><th>Valor</th><th>Regras</th><th>Usos</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c.id} style={{ opacity: c.active ? 1 : 0.5 }}>
                <td><code style={{ fontFamily: 'var(--font-display)', color: 'var(--color-warning)', letterSpacing: '1px', fontSize: '0.85rem' }}>{c.code}</code></td>
                <td>{c.type === 'percent' ? `${c.value}% OFF` : `R$ ${c.value} OFF`}</td>
                <td>{c.freeShipping ? '+ Frete Grátis' : c.type === 'percent' ? `${c.value}%` : `R$ ${c.value}`}</td>
                <td style={{ fontSize: '0.78rem' }}>
                  {c.firstPurchaseOnly && <span className="admin-rule-tag">1ª Compra</span>}
                  {c.nonCumulative && <span className="admin-rule-tag">Não Acum.</span>}
                  {c.minOrderValue && <span className="admin-rule-tag">Mín R${c.minOrderValue}</span>}
                </td>
                <td>{c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}</td>
                <td>
                  <button className={`admin-status-toggle ${c.active ? 'on' : 'off'}`} onClick={() => toggleActive(c.id)}>
                    {c.active ? 'Ativo' : 'Inativo'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-icon-btn" onClick={() => openEdit(c)}><Edit2 size={15} /></button>
                    <button className="admin-icon-btn danger" onClick={() => { setCoupons(prev => prev.filter(x => x.id !== c.id)); addToast('Cupom removido.', 'error'); }}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
