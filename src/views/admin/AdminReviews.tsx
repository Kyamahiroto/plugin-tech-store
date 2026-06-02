import React, { useState } from 'react';
import { ProductReview, Product } from '../../types';
import { Check, X, Trash2, Plus, Star } from 'lucide-react';

interface AdminReviewsProps {
  reviews: ProductReview[];
  products: Product[];
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
  onDelete: (reviewId: string) => void;
  onAdd: (review: ProductReview) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const EMPTY_FORM = {
  productId: '',
  authorName: '',
  authorImage: '',
  content: '',
  rating: 5,
};

const StarRating: React.FC<{ rating: number; onChange?: (r: number) => void; size?: number }> = ({
  rating, onChange, size = 16
}) => {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={size}
          fill={(hover || rating) >= i ? '#f59e0b' : 'transparent'}
          color={(hover || rating) >= i ? '#f59e0b' : 'rgba(255,255,255,0.3)'}
          style={{ cursor: onChange ? 'pointer' : 'default', transition: 'color 0.15s' }}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange?.(i)}
        />
      ))}
    </div>
  );
};

const AdminReviews: React.FC<AdminReviewsProps> = ({
  reviews, products, onApprove, onReject, onDelete, onAdd, addToast
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter);
  const pendingCount = reviews.filter(r => r.status === 'pending').length;

  const getProductName = (id: string) =>
    products.find(p => p.id === id)?.name || id;

  const statusColor: Record<string, string> = {
    pending: '#f59e0b',
    approved: '#45e627',
    rejected: '#ff5252',
  };
  const statusLabel: Record<string, string> = {
    pending: '⏳ Pendente',
    approved: '✅ Aprovada',
    rejected: '❌ Rejeitada',
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productId) { addToast('Selecione um produto.', 'error'); return; }
    if (!form.authorName.trim()) { addToast('Informe o nome do autor.', 'error'); return; }
    if (!form.content.trim()) { addToast('Informe o conteúdo da avaliação.', 'error'); return; }

    const newReview: ProductReview = {
      id: `rev-admin-${Date.now()}`,
      productId: form.productId,
      authorName: form.authorName,
      authorImage: form.authorImage || undefined,
      content: form.content,
      rating: form.rating,
      date: new Date().toISOString(),
      status: 'approved', // admin-created reviews go straight to approved
    };
    onAdd(newReview);
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
    addToast('✅ Avaliação adicionada e já aprovada!', 'success');
  };

  return (
    <div className="admin-section">
      {/* Header */}
      <div className="admin-section-header">
        <div>
          <h2>⭐ Avaliações de Produtos</h2>
          {pendingCount > 0 && (
            <span style={{
              background: '#f59e0b', color: '#000', borderRadius: '999px',
              padding: '2px 10px', fontSize: '0.8rem', fontWeight: 'bold', marginLeft: '10px'
            }}>
              {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button className="neon-glow-btn" style={{ padding: '10px 20px', fontSize: '0.85rem' }}
          onClick={() => setShowForm(true)}>
          <Plus size={16} /> Adicionar Avaliação
        </button>
      </div>

      {/* Filter tabs */}
      <div className="admin-tabs" style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
          <button key={f}
            className={`admin-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Todas' : statusLabel[f]}
            <span style={{
              marginLeft: '6px', background: 'rgba(255,255,255,0.1)',
              borderRadius: '999px', padding: '1px 7px', fontSize: '0.75rem'
            }}>
              {f === 'all' ? reviews.length : reviews.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="admin-table-wrapper">
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
            Nenhuma avaliação encontrada nesta categoria.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Autor</th>
                <th>Nota</th>
                <th>Avaliação</th>
                <th>Data</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(review => (
                <tr key={review.id}>
                  <td>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {getProductName(review.productId)}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {review.authorImage ? (
                        <img src={review.authorImage} alt={review.authorName}
                          style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: 'var(--color-primary)', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.85rem', fontWeight: 'bold', color: '#000'
                        }}>
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span style={{ fontSize: '0.85rem' }}>{review.authorName}</span>
                    </div>
                  </td>
                  <td><StarRating rating={review.rating} /></td>
                  <td>
                    <span style={{
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      fontSize: '0.82rem', color: 'var(--color-text-muted)',
                      maxWidth: '220px'
                    }}>
                      {review.content}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {new Date(review.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <span className="admin-type-chip"
                      style={{ '--chip-color': statusColor[review.status] } as any}>
                      {statusLabel[review.status]}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {review.status === 'pending' && (
                        <>
                          <button className="admin-icon-btn"
                            style={{ color: '#45e627', borderColor: '#45e627' }}
                            title="Aprovar"
                            onClick={() => { onApprove(review.id); addToast('✅ Avaliação aprovada!', 'success'); }}>
                            <Check size={15} />
                          </button>
                          <button className="admin-icon-btn danger"
                            title="Rejeitar"
                            onClick={() => { onReject(review.id); addToast('Avaliação rejeitada.', 'error'); }}>
                            <X size={15} />
                          </button>
                        </>
                      )}
                      {review.status === 'approved' && (
                        <button className="admin-icon-btn danger"
                          title="Rejeitar aprovação"
                          onClick={() => { onReject(review.id); addToast('Avaliação rejeitada.', 'error'); }}>
                          <X size={15} />
                        </button>
                      )}
                      {review.status === 'rejected' && (
                        <button className="admin-icon-btn"
                          style={{ color: '#45e627', borderColor: '#45e627' }}
                          title="Re-aprovar"
                          onClick={() => { onApprove(review.id); addToast('✅ Avaliação re-aprovada!', 'success'); }}>
                          <Check size={15} />
                        </button>
                      )}
                      <button className="admin-icon-btn danger"
                        title="Excluir"
                        onClick={() => { onDelete(review.id); addToast('Avaliação excluída.', 'error'); }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Review Modal */}
      {showForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel">
            <div className="admin-modal-head">
              <h3>✏️ Adicionar Avaliação Manual</h3>
              <button className="admin-close-btn" onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddManual} className="admin-form">
              <div className="admin-field">
                <label>Produto *</label>
                <select className="cyber-input" value={form.productId}
                  onChange={e => setForm(f => ({ ...f, productId: e.target.value }))} required>
                  <option value="">Selecione um produto...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-row">
                <div className="admin-field">
                  <label>Nome do Autor *</label>
                  <input className="cyber-input"
                    value={form.authorName}
                    onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))}
                    placeholder="Ex: João Silva" required />
                </div>
                <div className="admin-field">
                  <label>URL da Foto do Autor</label>
                  <input className="cyber-input"
                    value={form.authorImage}
                    onChange={e => setForm(f => ({ ...f, authorImage: e.target.value }))}
                    placeholder="https://..." />
                </div>
              </div>

              <div className="admin-field">
                <label>Nota *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                  <StarRating
                    rating={form.rating}
                    onChange={r => setForm(f => ({ ...f, rating: r }))}
                    size={24}
                  />
                  <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{form.rating}/5</span>
                </div>
              </div>

              <div className="admin-field">
                <label>Texto da Avaliação *</label>
                <textarea className="cyber-input" rows={4}
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Descreva a experiência com o produto..."
                  style={{ resize: 'vertical' }}
                  required />
              </div>

              <div style={{
                background: 'rgba(69,230,39,0.08)', border: '1px solid rgba(69,230,39,0.2)',
                borderRadius: 'var(--radius-sm)', padding: '10px 14px',
                fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '8px'
              }}>
                💡 Avaliações adicionadas pelo admin são <strong>aprovadas automaticamente</strong> e aparecem imediatamente no produto.
              </div>

              <div className="admin-form-actions">
                <button type="button" className="outline-btn" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="neon-glow-btn" style={{ padding: '12px 28px' }}>
                  <Plus size={16} /> Publicar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
