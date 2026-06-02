import React, { useState } from 'react';
import { Product, Category } from '../types';
import { Plus, Edit2, Trash2, ShieldCheck, Cpu, RefreshCw, BarChart2 } from 'lucide-react';

interface AdminViewProps {
  products: Product[];
  categories: Category[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const AdminView: React.FC<AdminViewProps> = ({
  products,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  addToast
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(120);
  const [oldPrice, setOldPrice] = useState(180);
  const [category, setCategory] = useState('audio');
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(10);
  const [isNew, setIsNew] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice(100);
    setOldPrice(0);
    setCategory('audio');
    setDiscount(0);
    setStock(10);
    setIsNew(false);
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setOldPrice(product.oldPrice || 0);
    setCategory(product.category);
    setDiscount(product.discount || 0);
    setStock(product.stock);
    setIsNew(!!product.isNew);
    addToast(`Carregando dados de ${product.name} para sintonização! 📡`, 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      addToast('Preencha os campos obrigatórios terráqueo!', 'error');
      return;
    }

    const priceNum = Number(price);
    const oldPriceNum = oldPrice > 0 ? Number(oldPrice) : undefined;
    const discountNum = discount > 0 ? Number(discount) : undefined;
    const stockNum = Number(stock);

    if (editingId) {
      // Edit existing product
      const updatedProduct: Product = {
        id: editingId,
        name,
        description,
        price: priceNum,
        oldPrice: oldPriceNum,
        image: category === 'audio' ? 'audio' : 
               category === 'teclados' ? 'keyboard' : 
               category === 'mouses' ? 'mouse' : 
               category === 'games' ? 'console' : 'cpu',
        category,
        discount: discountNum,
        isNew,
        stock: stockNum,
        specs: {
          'Conexão': 'Wi-Fi interestelar',
          'Sintonização': 'Frequência Gravitacional'
        }
      };

      onUpdateProduct(updatedProduct);
      addToast(`Periférico ${name} sintonizado com sucesso na órbita! 🛰️💎`, 'success');
    } else {
      // Create new product
      const newProduct: Product = {
        id: `prod-${Math.floor(100000 + Math.random() * 900000)}`,
        name,
        description,
        price: priceNum,
        oldPrice: oldPriceNum,
        image: category === 'audio' ? 'audio' : 
               category === 'teclados' ? 'keyboard' : 
               category === 'mouses' ? 'mouse' : 
               category === 'games' ? 'console' : 'cpu',
        category,
        discount: discountNum,
        isNew,
        stock: stockNum,
        specs: {
          'Conexão': 'Wi-Fi interestelar',
          'Sintonização': 'Frequência Gravitacional'
        }
      };

      onAddProduct(newProduct);
      addToast(`Novo periférico ${name} materializado na loja! 🛸⚡`, 'success');
    }

    resetForm();
  };

  const handleDelete = (productId: string, productName: string) => {
    if (window.confirm(`Tem certeza que deseja apagar o produto "${productName}" da galáxia?`)) {
      onDeleteProduct(productId);
      addToast(`Produto "${productName}" desintegrado com feixe de laser! 💥💥`, 'error');
    }
  };

  // Stats summaries
  const totalInStock = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStock = products.filter(p => p.stock <= 0).length;

  return (
    <div className="view-container animate-fade-in">
      <div className="offers-title-row" style={{ marginBottom: '16px' }}>
        <h2 className="section-title">
          Painel Administrativo [SNEAK PEEK]
        </h2>
        <span className="badge-neon" style={{ borderColor: 'var(--color-primary)' }}>
          🛸 Modo Administrador Geral
        </span>
      </div>

      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '24px', lineHeight: '1.4' }}>
        Aqui você pode gerenciar o banco de dados local do e-commerce. Qualquer produto que você cadastrar, editar ou deletar abaixo será <strong>imediatamente atualizado na página inicial</strong> em tempo real!
      </p>

      {/* Admin Quick Statistics Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Stat 1 */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="gift-cards-icon" style={{ width: '40px', height: '40px', background: 'var(--color-primary-dim)' }}>
            <Cpu size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block' }}>Produtos Cadastrados:</span>
            <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)' }}>{products.length}</strong>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="gift-cards-icon" style={{ width: '40px', height: '40px', color: '#c084fc', border: '1.5px solid var(--color-purple)', background: 'rgba(155, 81, 224, 0.15)' }}>
            <BarChart2 size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block' }}>Estoque em Órbita:</span>
            <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: '#c084fc' }}>{totalInStock} unidades</strong>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="gift-cards-icon" style={{ width: '40px', height: '40px', color: 'var(--color-danger)', border: '1.5px solid var(--color-danger)', background: 'rgba(255, 59, 48, 0.15)' }}>
            <ShieldCheck size={18} />
          </div>
          <div>
            <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', display: 'block' }}>Esgotados em Hiper-espaço:</span>
            <strong style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', color: 'var(--color-danger)' }}>{outOfStock}</strong>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-layout">
        {/* Form panel */}
        <div className="admin-form-box">
          <h3 className="checkout-summary-title" style={{ fontSize: '1.05rem', marginBottom: '18px' }}>
            🛰️ {editingId ? 'Editar Periférico' : 'Cadastrar Periférico'}
          </h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Nome do Equipamento *</label>
              <input
                type="text"
                className="form-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mouse Alien Laser Pro"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descrição Cósmica *</label>
              <textarea
                className="form-input"
                required
                rows={3}
                style={{ resize: 'vertical' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Insira detalhes técnicos divertidos..."
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  className="form-input"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preço Antigo (Sem desconto)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Categoria de Linha *</label>
                <select
                  className="form-input"
                  style={{ backgroundColor: 'var(--color-bg-input)' }}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.slug} style={{ backgroundColor: 'var(--color-bg-dark)' }}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Estoque (Qtd)*</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  required
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Desconto (%)</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  className="form-input"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', height: '100%', paddingTop: '28px' }}>
                <input
                  type="checkbox"
                  id="isAdminNew"
                  accent-color="var(--color-primary)"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={isNew}
                  onChange={(e) => setIsNew(e.target.checked)}
                />
                <label htmlFor="isAdminNew" className="form-label" style={{ cursor: 'pointer', margin: 0 }}>
                  Exibir selo "NOVO"
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              {editingId && (
                <button
                  type="button"
                  className="outline-btn"
                  style={{ flex: 1, padding: '12px' }}
                  onClick={resetForm}
                >
                  Cancelar
                </button>
              )}
              
              <button type="submit" className="neon-glow-btn" style={{ flex: editingId ? 1.5 : 1, padding: '12px' }}>
                {editingId ? <RefreshCw size={14} /> : <Plus size={14} />}
                {editingId ? 'Salvar Alterações' : 'Cadastrar Periférico'}
              </button>
            </div>
          </form>
        </div>

        {/* Catalog list table */}
        <div className="admin-products-table-box">
          <h3 className="checkout-summary-title" style={{ fontSize: '1.05rem', border: 'none', marginBottom: '8px' }}>
            🛰️ Varredura dos Produtos Ativos
          </h3>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Lista carregada do state local</span>
          
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Estoque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="admin-product-row">
                  <td style={{ fontWeight: '700' }}>
                    {p.name}
                    {p.isNew && <span style={{ color: 'var(--color-primary)', fontSize: '0.6rem', display: 'block', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>[NOVO]</span>}
                  </td>
                  <td>R$ {p.price.toFixed(2).replace('.', ',')}</td>
                  <td style={{ textTransform: 'uppercase', fontSize: '0.72rem', color: 'var(--color-primary)' }}>{p.category}</td>
                  <td>
                    <span style={{ color: p.stock <= 0 ? 'var(--color-danger)' : 'inherit' }}>
                      {p.stock} un
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions-cell">
                      <button
                        className="admin-cell-btn edit"
                        onClick={() => handleEditClick(p)}
                        title="Sintonizar dados"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        className="admin-cell-btn delete"
                        onClick={() => handleDelete(p.id, p.name)}
                        title="Desintegrar produto"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminView;
