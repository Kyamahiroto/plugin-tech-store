import React, { useState } from 'react';
import { Testimonial } from '../../types';
import { Plus, Edit2, Trash2, Save, X, Star } from 'lucide-react';
import { fileToBase64 } from '../../utils/imageUpload';

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onAdd: (t: Testimonial) => void;
  onUpdate: (t: Testimonial) => void;
  onDelete: (id: string) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({ testimonials, onAdd, onUpdate, onDelete, addToast }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});

  const resetForm = () => {
    setEditingId(null);
    setFormData({});
  };

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({ ...t });
  };

  const handleSave = () => {
    if (!formData.authorName || !formData.content || !formData.rating) {
      addToast('Nome, conteúdo e estrelas são obrigatórios!', 'error');
      return;
    }
    
    if (editingId === 'new') {
      const newTestimonial: Testimonial = {
        id: `testim-${Date.now()}`,
        authorName: formData.authorName,
        content: formData.content,
        rating: formData.rating,
        date: formData.date || new Date().toISOString().split('T')[0],
        authorImage: formData.authorImage,
        productImage: formData.productImage,
      };
      onAdd(newTestimonial);
      addToast('Depoimento adicionado com sucesso!', 'success');
    } else {
      onUpdate(formData as Testimonial);
      addToast('Depoimento atualizado com sucesso!', 'success');
    }
    resetForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'authorImage' | 'productImage') => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setFormData(prev => ({ ...prev, [field]: base64 }));
      } catch (err) {
        addToast('Erro ao ler a imagem.', 'error');
      }
    }
  };

  return (
    <div className="admin-content" style={{ padding: '24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: 'var(--color-primary)' }}>Gerenciar Depoimentos</h2>
        <button 
          className="cyber-button-small"
          onClick={() => { setEditingId('new'); setFormData({ rating: 5, date: new Date().toISOString().split('T')[0] }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Adicionar Novo
        </button>
      </div>

      {editingId && (
        <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <h3 style={{ marginBottom: '16px' }}>{editingId === 'new' ? 'Novo Depoimento' : 'Editar Depoimento'}</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label className="cyber-label">Nome do Autor</label>
              <input 
                type="text" 
                className="cyber-input" 
                value={formData.authorName || ''} 
                onChange={(e) => setFormData({...formData, authorName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="cyber-label">Data (YYYY-MM-DD)</label>
              <input 
                type="date" 
                className="cyber-input" 
                value={formData.date || ''} 
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="cyber-label">Depoimento</label>
            <textarea 
              className="cyber-input" 
              rows={3}
              value={formData.content || ''} 
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="cyber-label">Estrelas (1-5)</label>
              <input 
                type="number" 
                min="1" max="5" 
                className="cyber-input" 
                value={formData.rating || 5} 
                onChange={(e) => setFormData({...formData, rating: Number(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label className="cyber-label">Foto de Perfil</label>
              <input 
                type="file" 
                accept="image/*"
                className="cyber-input" 
                style={{ padding: '6px' }}
                onChange={(e) => handleImageUpload(e, 'authorImage')}
              />
              {formData.authorImage && <img src={formData.authorImage} alt="Preview" style={{ marginTop: '8px', width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />}
            </div>
            <div className="form-group">
              <label className="cyber-label">Imagem do Produto</label>
              <input 
                type="file" 
                accept="image/*"
                className="cyber-input" 
                style={{ padding: '6px' }}
                onChange={(e) => handleImageUpload(e, 'productImage')}
              />
              {formData.productImage && <img src={formData.productImage} alt="Preview" style={{ marginTop: '8px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="cyber-button-small" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-primary)', color: '#000' }}>
              <Save size={16} /> Salvar
            </button>
            <button className="cyber-button-small" onClick={resetForm} style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'transparent', border: '1px solid var(--color-danger)' }}>
              <X size={16} /> Cancelar
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
        {testimonials.map(t => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {t.authorImage ? (
                <img src={t.authorImage} alt={t.authorName} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {t.authorName.charAt(0)}
                </div>
              )}
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-text-white)' }}>{t.authorName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>{t.date}</div>
                <div style={{ display: 'flex', gap: '2px', color: '#fbbf24' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} fill={i < t.rating ? 'currentColor' : 'transparent'} />
                  ))}
                </div>
                <div style={{ fontSize: '0.85rem', marginTop: '8px', fontStyle: 'italic', maxWidth: '500px' }}>"{t.content}"</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {t.productImage && (
                <img src={t.productImage} alt="Produto" style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => handleEdit(t)} style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}><Edit2 size={18} /></button>
                <button onClick={() => onDelete(t.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer' }}><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
            Nenhum depoimento encontrado.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTestimonials;
