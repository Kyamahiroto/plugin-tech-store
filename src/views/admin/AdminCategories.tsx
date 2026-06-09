import React, { useState } from 'react';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, X, Save, ArrowUp, ArrowDown } from 'lucide-react';
import { fileToBase64 } from '../../utils/imageUpload';

interface AdminCategoriesProps {
  categories: Category[];
  onAdd: (c: Category) => void;
  onUpdate: (c: Category) => void;
  onDelete: (id: string) => void;
  onReorder?: (categories: Category[]) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const EMPTY: Partial<Category> = { name: '', iconName: 'Cpu', slug: '', imageUrl: '' };
const ICON_OPTIONS = ['Headphones', 'Mouse', 'Keyboard', 'Gamepad2', 'Cpu', 'Monitor', 'Wifi', 'Speaker', 'Smartphone'];

const AdminCategories: React.FC<AdminCategoriesProps> = ({ categories, onAdd, onUpdate, onDelete, onReorder, addToast }) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Category>>(EMPTY);

  const orderedCategories = [...categories].sort((a, b) => (a.orderIndex ?? 9999) - (b.orderIndex ?? 9999));
  const set = (k: keyof Category, v: string | number | undefined) => setForm(f => ({ ...f, [k]: v }));

  const openNew = () => {
    setForm(EMPTY);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (c: Category) => {
    setForm({ ...c });
    setEditId(c.id);
    setShowForm(true);
  };

  const moveCategory = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= orderedCategories.length) return;

    const next = [...orderedCategories];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onReorder?.(next.map((category, orderIndex) => ({ ...category, orderIndex })));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.slug) {
      addToast('Nome e slug sao obrigatorios!', 'error');
      return;
    }

    const cat: Category = {
      id: editId || `cat-${Date.now()}`,
      name: form.name,
      iconName: form.iconName || 'Cpu',
      slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
      imageUrl: form.imageUrl || undefined,
      orderIndex: editId ? form.orderIndex : categories.length
    };

    if (editId) {
      onUpdate(cat);
      addToast('Categoria atualizada!', 'success');
    } else {
      onAdd(cat);
      addToast('Categoria criada!', 'success');
    }

    setShowForm(false);
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>Categorias</h2>
        <button className="neon-glow-btn" style={{ padding: '10px 20px', fontSize: '0.85rem' }} onClick={openNew}>
          <Plus size={16} /> Nova Categoria
        </button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-head">
              <h3>{editId ? 'Editar Categoria' : 'Nova Categoria'}</h3>
              <button onClick={() => setShowForm(false)} className="admin-close-btn"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-field">
                <label>Nome da Categoria *</label>
                <input className="cyber-input" value={form.name || ''} onChange={e => set('name', e.target.value)} placeholder="Ex: TECLADOS" required />
              </div>
              <div className="admin-field">
                <label>Slug (URL) *</label>
                <input className="cyber-input" value={form.slug || ''} onChange={e => set('slug', e.target.value.toLowerCase())} placeholder="Ex: teclados" required />
                <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Sem espacos, letras minusculas</small>
              </div>
              <div className="admin-field">
                <label>Icone (Lucide)</label>
                <select className="cyber-input" value={form.iconName || 'Cpu'} onChange={e => set('iconName', e.target.value)}>
                  {ICON_OPTIONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <div className="admin-field">
                <label>Imagem Personalizada (Upload Local)</label>
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    style={{ width: '72px', height: '72px', objectFit: 'cover', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', marginBottom: '8px' }}
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
                      set('imageUrl', base64);
                    }
                  }}
                />
                <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Se preenchida, substitui o icone Lucide.</small>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="outline-btn" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="neon-glow-btn" style={{ padding: '12px 28px' }}><Save size={16} /> Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ordem</th>
              <th>Nome</th>
              <th>Slug</th>
              <th>Imagem/Icone</th>
              <th>Produtos</th>
              <th>Acoes</th>
            </tr>
          </thead>
          <tbody>
            {orderedCategories.map((c, idx) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button className="admin-icon-btn" type="button" disabled={idx === 0} onClick={() => moveCategory(idx, -1)} title="Subir categoria">
                      <ArrowUp size={14} />
                    </button>
                    <button className="admin-icon-btn" type="button" disabled={idx === orderedCategories.length - 1} onClick={() => moveCategory(idx, 1)} title="Descer categoria">
                      <ArrowDown size={14} />
                    </button>
                  </div>
                </td>
                <td><strong>{c.name}</strong></td>
                <td><code style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }}>{c.slug}</code></td>
                <td>{c.imageUrl ? <img src={c.imageUrl} alt={c.name} style={{ width: '34px', height: '34px', objectFit: 'cover', borderRadius: '4px' }} /> : c.iconName}</td>
                <td>-</td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-icon-btn" onClick={() => openEdit(c)}><Edit2 size={15} /></button>
                    <button className="admin-icon-btn danger" onClick={() => { onDelete(c.id); addToast('Categoria removida.', 'error'); }}><Trash2 size={15} /></button>
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

export default AdminCategories;
