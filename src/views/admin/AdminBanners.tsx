import React, { useState } from 'react';
import { Banner } from '../../types';
import { Edit2, X, Save } from 'lucide-react';
import { fileToBase64 } from '../../utils/imageUpload';

interface AdminBannersProps {
  banners: Banner[];
  onUpdate: (b: Banner[]) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const AdminBanners: React.FC<AdminBannersProps> = ({ banners, onUpdate, addToast }) => {
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Banner>>({});

  const set = (k: keyof Banner, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openEdit = (b: Banner) => { setForm({ ...b }); setEditId(b.id); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(banners.map(b => b.id === editId ? { ...b, ...form } as Banner : b));
    addToast('Banner atualizado! 🖼️', 'success');
    setEditId(null);
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>🖼️ Banners da Home</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: 0 }}>{banners.length} banners configurados</p>
      </div>

      {editId && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel">
            <div className="admin-modal-head">
              <h3>Editar Banner</h3>
              <button onClick={() => setEditId(null)} className="admin-close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-field">
                <label>Título Principal</label>
                <input className="cyber-input" value={form.title || ''} onChange={e => set('title', e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Subtítulo</label>
                <input className="cyber-input" value={form.subtitle || ''} onChange={e => set('subtitle', e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Badge (ex: "NOVO" ou "LANÇAMENTO")</label>
                <input className="cyber-input" value={form.badge || ''} onChange={e => set('badge', e.target.value)} />
              </div>
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Preço (R$)</label>
                  <input className="cyber-input" type="number" step="0.01" value={form.price || ''} onChange={e => set('price', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Preço Original (R$)</label>
                  <input className="cyber-input" type="number" step="0.01" value={form.oldPrice || ''} onChange={e => set('oldPrice', e.target.value)} />
                </div>
              </div>
              <div className="admin-field">
                <label>Texto do Botão</label>
                <input className="cyber-input" value={form.buttonText || ''} onChange={e => set('buttonText', e.target.value)} />
              </div>
              <div className="admin-field">
                <label>Link do Banner (opcional)</label>
                <input className="cyber-input" value={form.link || ''} onChange={e => set('link', e.target.value)} placeholder="https://... ou #produto-id" />
              </div>
              <div className="admin-field">
                <label>Imagem do Banner (Upload Local)</label>
                {form.image && (
                  <img 
                    src={form.image.startsWith('http') || form.image.startsWith('data:') ? form.image : ''} 
                    alt="Preview" 
                    style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                  />
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  className="cyber-input" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await fileToBase64(file);
                      set('image', base64);
                    }
                  }} 
                />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="outline-btn" onClick={() => setEditId(null)}>Cancelar</button>
                <button type="submit" className="neon-glow-btn" style={{ padding: '12px 28px' }}><Save size={16} /> Salvar Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-banner-grid">
        {banners.map(b => (
          <div key={b.id} className="admin-banner-card glass-panel">
            <div className="admin-banner-preview" style={{ background: b.image ? `url(${b.image}) center/cover` : 'linear-gradient(135deg, rgba(69,230,39,0.08), rgba(155,81,224,0.08))' }}>
              {!b.image && <span style={{ fontSize: '3rem' }}>🛸</span>}
              {b.badge && <span className="badge-neon" style={{ position: 'absolute', top: '10px', left: '10px' }}>{b.badge}</span>}
            </div>
            <div className="admin-banner-info">
              <h4>{b.title}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{b.subtitle}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>R$ {b.price?.toFixed(2).replace('.', ',')}</span>
                {b.oldPrice && <span style={{ textDecoration: 'line-through', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>R$ {b.oldPrice.toFixed(2).replace('.', ',')}</span>}
              </div>
            </div>
            <button className="admin-icon-btn" onClick={() => openEdit(b)} style={{ margin: '0 12px 12px auto' }}>
              <Edit2 size={16} /> Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBanners;
