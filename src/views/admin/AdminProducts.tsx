import React, { useState } from 'react';
import { Product, Category, ProductType } from '../../types';
import { Plus, Edit2, Trash2, X, Save, Package, Zap, Link } from 'lucide-react';
import { fileToBase64 } from '../../utils/imageUpload';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  onAdd: (p: Product) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const EMPTY: Partial<Product> = {
  name: '', description: '', price: 0, oldPrice: 0, discount: 0,
  stock: 10, isNew: false, image: 'cpu', category: 'audio',
  type: 'fisico', affiliateLink: '', virtualContent: '',
  orderBumpId: '', orderBumpDiscount: 10, gallery: [], variations: [],
  videoUrl: '', specs: {},
  tags: [], estiloVisual: [], prioridade: [], perfilRecomendado: [], popularidade: 0
};

const AdminProducts: React.FC<AdminProductsProps> = ({ products, categories, onAdd, onUpdate, onDelete, addToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>(EMPTY);

  const set = (k: keyof Product, v: any) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
  const openEdit = (p: Product) => { setForm({ ...p, variations: p.variations || [] }); setEditId(p.id); setShowForm(true); };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description) { addToast('Preencha nome e descrição!', 'error'); return; }
    const product: Product = {
      id: editId || `prod-${Date.now()}`,
      name: form.name!, description: form.description!,
      price: Number(form.price), oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      discount: form.discount ? Number(form.discount) : undefined,
      image: form.image || 'cpu',
      category: form.category || 'audio',
      isNew: !!form.isNew, stock: Number(form.stock || 10),
      type: form.type || 'fisico',
      affiliateLink: form.affiliateLink || undefined,
      virtualContent: form.virtualContent || undefined,
      orderBumpId: form.orderBumpId || undefined,
      orderBumpDiscount: form.orderBumpDiscount ? Number(form.orderBumpDiscount) : undefined,
      gallery: form.gallery || [],
      specs: form.specs || {},
      variations: form.variations || [],
      videoUrl: form.videoUrl || undefined,
      tags: form.tags || [],
      estiloVisual: form.estiloVisual || [],
      prioridade: form.prioridade || [],
      perfilRecomendado: form.perfilRecomendado || [],
      popularidade: form.popularidade ? Number(form.popularidade) : 0
    };
    if (editId) { onUpdate(product); addToast('Produto atualizado! ✅', 'success'); }
    else { onAdd(product); addToast('Produto cadastrado! 🚀', 'success'); }
    setShowForm(false);
  };

  const typeColor: Record<ProductType, string> = { fisico: '#45e627', virtual: '#a78bfa', afiliado: '#fb923c' };
  const typeLabel: Record<ProductType, string> = { fisico: 'Físico', virtual: 'Virtual', afiliado: 'Afiliado' };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>📦 Produtos</h2>
        <button className="neon-glow-btn" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={openNew}>
          <Plus size={16} /> Novo Produto
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel">
            <div className="admin-modal-head">
              <h3>{editId ? 'Editar Produto' : 'Novo Produto'}</h3>
              <button onClick={() => setShowForm(false)} className="admin-close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              {/* Type selector */}
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Tipo de Produto *</label>
                  <div className="admin-type-toggle">
                    {(['fisico', 'virtual', 'afiliado'] as ProductType[]).map(t => (
                      <button key={t} type="button"
                        className={`admin-type-btn ${form.type === t ? 'active' : ''}`}
                        style={{ '--type-color': typeColor[t] } as any}
                        onClick={() => set('type', t)}>
                        {t === 'fisico' ? <Package size={14} /> : t === 'virtual' ? <Zap size={14} /> : <Link size={14} />}
                        {typeLabel[t]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Nome *</label>
                  <input className="cyber-input" value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="Nome do produto" required />
                </div>
                <div className="admin-field">
                  <label>Categoria *</label>
                  <select className="cyber-input" value={form.category || ''} onChange={e => set('category', e.target.value)}>
                    {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="admin-field" style={{ marginBottom: '40px' }}>
                <label>Descrição * <small style={{ color: 'var(--color-text-muted)', fontWeight: 'normal' }}>(aceita HTML, imagens, mídias)</small></label>
                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '4px', overflow: 'hidden' }}>
                  <ReactQuill 
                    theme="snow" 
                    value={form.description || ''} 
                    onChange={(val: string) => set('description', val)} 
                    style={{ height: '200px' }}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Imagem Principal (Upload Local) *</label>
                  {form.image && (
                    <img 
                      src={form.image.startsWith('http') || form.image.startsWith('data:') ? form.image : ''} 
                      alt="Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
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
              </div>

              <div className="admin-field">
                <label>Galeria de Imagens (Upload Múltiplo)</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  {(form.gallery || []).map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={img} alt={`Gallery ${i}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                      <button type="button" onClick={() => {
                        const updated = (form.gallery || []).filter((_, idx) => idx !== i);
                        set('gallery', updated);
                      }} style={{ position: 'absolute', top: -5, right: -5, background: 'red', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer' }}><X size={12} /></button>
                    </div>
                  ))}
                </div>
                <input 
                  type="file" 
                  accept="image/*"
                  multiple
                  className="cyber-input" 
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    const bases = await Promise.all(files.map(fileToBase64));
                    set('gallery', [...(form.gallery || []), ...bases]);
                  }} 
                />
              </div>

              {form.type === 'afiliado' && (
                <div className="admin-field">
                  <label>🔗 Link de Afiliado *</label>
                  <input className="cyber-input" value={form.affiliateLink || ''} onChange={e => set('affiliateLink', e.target.value)} placeholder="https://..." />
                </div>
              )}

              {form.type === 'virtual' && (
                <div className="admin-field">
                  <label>📧 Conteúdo Virtual (link/chave enviada por e-mail)</label>
                  <input className="cyber-input" value={form.virtualContent || ''} onChange={e => set('virtualContent', e.target.value)} placeholder="https://download.link ou CHAVE-1234" />
                </div>
              )}

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Preço (R$) *</label>
                  <input className="cyber-input" type="number" min="0" step="0.01" value={form.price || ''} onChange={e => set('price', e.target.value)} required />
                </div>
                <div className="admin-field">
                  <label>Preço Original (R$)</label>
                  <input className="cyber-input" type="number" min="0" step="0.01" value={form.oldPrice || ''} onChange={e => set('oldPrice', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label>Desconto (%)</label>
                  <input className="cyber-input" type="number" min="0" max="100" value={form.discount || ''} onChange={e => set('discount', e.target.value)} />
                </div>
                {form.type !== 'afiliado' && (
                  <div className="admin-field">
                    <label>Estoque</label>
                    <input className="cyber-input" type="number" min="0" value={form.stock || ''} onChange={e => set('stock', e.target.value)} />
                  </div>
                )}
              </div>

              {/* Order Bump */}
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Tipo de Frete Físico</label>
                  <select className="cyber-input" value={form.shippingType || 'estimated'} onChange={e => set('shippingType', e.target.value as any)}>
                    <option value="estimated">📦 Entrega estimada (7 a 12 dias úteis)</option>
                    <option value="national">🚀 Estoque nacional (2 e 5 dias úteis)</option>
                  </select>
                </div>
                <div className="admin-field">
                  <label>🛒 Order Bump (venda cruzada)</label>
                  <select className="cyber-input" value={form.orderBumpId || ''} onChange={e => set('orderBumpId', e.target.value)}>
                    <option value="">Nenhum</option>
                    {products.filter(p => p.id !== editId).map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                {form.orderBumpId && (
                  <div className="admin-field">
                    <label>Desconto Order Bump (%)</label>
                    <input className="cyber-input" type="number" min="0" max="100" value={form.orderBumpDiscount || 10} onChange={e => set('orderBumpDiscount', e.target.value)} />
                  </div>
                )}
              </div>

              {/* Variations list with custom prices and stock */}
              <div className="admin-field" style={{ marginTop: '16px', marginBottom: '16px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold' }}>Variações de Produto (ex: Cor, Voltagem, Modelo)</span>
                  <button
                    type="button"
                    className="neon-glow-btn"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    onClick={() => {
                      const currentVars = form.variations || [];
                      set('variations', [
                        ...currentVars,
                        { id: `var-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, name: '', price: undefined, stock: undefined }
                      ]);
                    }}
                  >
                    + Adicionar Variação
                  </button>
                </label>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                  {(form.variations || []).map((v, idx) => (
                    <div key={v.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        className="cyber-input"
                        placeholder="Nome da Variação (ex: Azul Carbono, 220V)"
                        value={v.name}
                        onChange={(e) => {
                          const updated = [...(form.variations || [])];
                          updated[idx] = { ...v, name: e.target.value };
                          set('variations', updated);
                        }}
                        style={{ flex: 2 }}
                        required
                      />
                      <input
                        className="cyber-input"
                        type="number"
                        step="0.01"
                        placeholder="Preço (R$ Opcional)"
                        value={v.price === undefined ? '' : v.price}
                        onChange={(e) => {
                          const updated = [...(form.variations || [])];
                          updated[idx] = { ...v, price: e.target.value === '' ? undefined : Number(e.target.value) };
                          set('variations', updated);
                        }}
                        style={{ flex: 1.2 }}
                      />
                      <input
                        className="cyber-input"
                        type="number"
                        placeholder="Estoque"
                        value={v.stock === undefined ? '' : v.stock}
                        onChange={(e) => {
                          const updated = [...(form.variations || [])];
                          updated[idx] = { ...v, stock: e.target.value === '' ? undefined : Number(e.target.value) };
                          set('variations', updated);
                        }}
                        style={{ flex: 1 }}
                      />
                      <div style={{ flex: 1.1 }}>
                        <small style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.68rem', marginBottom: '4px' }}>
                          Foto da variaÃ§Ã£o
                        </small>
                        <input
                          type="file"
                          accept="image/*"
                          className="cyber-input"
                          style={{ padding: '4px', fontSize: '0.70rem' }}
                          title="Imagem da Variação"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const base64 = await fileToBase64(file);
                              const updated = [...(form.variations || [])];
                              updated[idx] = { ...v, image: base64 };
                              set('variations', updated);
                            }
                          }}
                        />
                        {v.image && <img src={v.image} alt={v.name || 'Preview da variaÃ§Ã£o'} style={{ width: '42px', height: '42px', objectFit: 'cover', marginTop: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)' }} />}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          set('variations', (form.variations || []).filter((_, i) => i !== idx));
                        }}
                        style={{
                          backgroundColor: 'rgba(255,82,82,0.1)',
                          border: '1px solid #ff5252',
                          color: '#ff5252',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(form.variations || []).length === 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      Nenhuma variação cadastrada para este produto.
                    </span>
                  )}
                </div>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />
              <h4 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>🎬 Mídia do Produto</h4>

              <div className="admin-field">
                <label>URL do Vídeo (YouTube)</label>
                <input className="cyber-input" value={form.videoUrl || ''} onChange={e => set('videoUrl', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />
              <h4 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>📋 Especificações do Produto</h4>

              <div className="admin-field">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontWeight: 'bold' }}>Pares Chave / Valor</label>
                  <button
                    type="button"
                    className="neon-glow-btn"
                    style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    onClick={() => {
                      const currentSpecs = form.specs || {};
                      const key = `Spec-${Object.keys(currentSpecs).length + 1}`;
                      set('specs', { ...currentSpecs, [key]: '' });
                    }}
                  >
                    + Adicionar Spec
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(form.specs || {}).map(([key, val], idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        className="cyber-input"
                        placeholder="Nome (ex: Conexão)"
                        value={key}
                        onChange={(e) => {
                          const entries = Object.entries(form.specs || {});
                          entries[idx] = [e.target.value, val as string];
                          set('specs', Object.fromEntries(entries));
                        }}
                        style={{ flex: 1 }}
                      />
                      <input
                        className="cyber-input"
                        placeholder="Valor (ex: Bluetooth 5.3)"
                        value={val as string}
                        onChange={(e) => {
                          const entries = Object.entries(form.specs || {});
                          entries[idx] = [key, e.target.value];
                          set('specs', Object.fromEntries(entries));
                        }}
                        style={{ flex: 2 }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const entries = Object.entries(form.specs || {}).filter((_, i) => i !== idx);
                          set('specs', Object.fromEntries(entries));
                        }}
                        style={{ backgroundColor: 'rgba(255,82,82,0.1)', border: '1px solid #ff5252', color: '#ff5252', padding: '8px 12px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {Object.keys(form.specs || {}).length === 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                      Nenhuma especificação cadastrada.
                    </span>
                  )}
                </div>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />
              <h4 style={{ marginBottom: '16px', color: 'var(--color-primary)' }}>🤖 Configurações do Quiz "Monte seu Setup"</h4>

              <div className="admin-field">
                <label>Tags (separadas por vírgula)</label>
                <input className="cyber-input" value={(form.tags || []).join(', ')} onChange={e => set('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="ex: competitivo, fps, rgb" />
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Estilos Visuais (separados por vírgula)</label>
                  <input className="cyber-input" value={(form.estiloVisual || []).join(', ')} onChange={e => set('estiloVisual', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="ex: Cyberpunk, RGB Extremo" />
                </div>
                <div className="admin-field">
                  <label>Prioridades (separadas por vírgula)</label>
                  <input className="cyber-input" value={(form.prioridade || []).join(', ')} onChange={e => set('prioridade', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="ex: Performance, Estética" />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Perfis Recomendados (separados por vírgula)</label>
                  <input className="cyber-input" value={(form.perfilRecomendado || []).join(', ')} onChange={e => set('perfilRecomendado', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="ex: gamer-competitivo, streamer" />
                </div>
                <div className="admin-field">
                  <label>Popularidade (0 a 100)</label>
                  <input className="cyber-input" type="number" min="0" max="100" value={form.popularidade || 0} onChange={e => set('popularidade', e.target.value)} />
                </div>
              </div>

              <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input type="checkbox" checked={!!form.isNew} onChange={e => set('isNew', e.target.checked)} />
                  Marcar como NOVO
                </label>
              </div>

              <div className="admin-form-actions">
                <button type="button" className="outline-btn" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="neon-glow-btn" style={{ padding: '12px 28px' }}>
                  <Save size={16} /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead><tr><th>Nome</th><th>Tipo</th><th>Categoria</th><th>Preço</th><th>Estoque</th><th>Order Bump</th><th>Ações</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td><strong>{p.name}</strong></td>
                <td><span className="admin-type-chip" style={{ '--chip-color': typeColor[p.type || 'fisico'] } as any}>{typeLabel[p.type || 'fisico']}</span></td>
                <td>{p.category}</td>
                <td>R$ {p.price.toFixed(2).replace('.', ',')}</td>
                <td>
                  {p.type === 'afiliado' ? '—' : (
                    <div style={{ color: (p.stock || 0) <= 5 ? '#a78bfa' : 'inherit', fontWeight: (p.stock || 0) <= 5 ? 'bold' : 'normal' }}>
                      {p.stock} {(p.stock || 0) <= 5 && <span style={{ fontSize: '0.7rem', display: 'block', color: '#a78bfa' }}>⚠️ Últimas Peças</span>}
                    </div>
                  )}
                </td>
                <td>{p.orderBumpId ? `${products.find(x => x.id === p.orderBumpId)?.name || p.orderBumpId} (-${p.orderBumpDiscount}%)` : '—'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-icon-btn" onClick={() => openEdit(p)} title="Editar"><Edit2 size={15} /></button>
                    <button className="admin-icon-btn danger" onClick={() => { onDelete(p.id); addToast('Produto removido.', 'error'); }} title="Deletar"><Trash2 size={15} /></button>
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

export default AdminProducts;
