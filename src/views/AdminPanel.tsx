import React, { useState } from 'react';
import { Product, Category, Banner, Order, ProductReview } from '../types';
import { LayoutDashboard, Package, Tag, Image, FolderOpen, ShoppingBag, CreditCard, LogOut, Menu, X, ShieldCheck, Star } from 'lucide-react';

import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminCoupons from './admin/AdminCoupons';
import AdminBanners from './admin/AdminBanners';
import AdminCategories from './admin/AdminCategories';
import AdminOrders from './admin/AdminOrders';
import AdminPayments from './admin/AdminPayments';
import AdminGamification from './admin/AdminGamification';
import AdminQuizConfig from './admin/AdminQuizConfig';
import AdminMetrics from './admin/AdminMetrics';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminReviews from './admin/AdminReviews';
import AdminCalculadora from './admin/AdminCalculadora';
import { fileToBase64 } from '../utils/imageUpload';

interface AdminPanelProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateBanners: (b: Banner[]) => void;
  onAddCategory: (c: Category) => void;
  onUpdateCategory: (c: Category) => void;
  onDeleteCategory: (id: string) => void;
  onReorderCategories?: (categories: Category[]) => void;
  onAdvanceOrderStatus: (orderId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status'], trackingCode?: string) => void;
  storeSettings?: import('../types').StoreSettings;
  testimonials?: import('../types').Testimonial[];
  brands?: import('../types').Brand[];
  paymentSettings?: import('../types').PaymentSettings;
  quizConfig?: import('../types').QuizConfig;
  onUpdateStoreSettings?: (s: import('../types').StoreSettings) => void;
  onUpdateTestimonials?: (t: import('../types').Testimonial[]) => void;
  onUpdateBrands?: (b: import('../types').Brand[]) => void;
  onUpdatePaymentSettings?: (ps: import('../types').PaymentSettings) => void;
  onUpdateQuizConfig?: (config: import('../types').QuizConfig) => void;
  reviews?: ProductReview[];
  onUpdateReviews?: (reviews: ProductReview[]) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'metrics' | 'products' | 'coupons' | 'banners' | 'categories' | 'orders' | 'payments' | 'gamification' | 'quiz' | 'testimonials' | 'reviews' | 'calculadora' | 'settings';

import { Activity, MessageSquare, Calculator } from 'lucide-react';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { id: 'metrics', label: 'Métricas & BI', icon: <Activity size={18} /> },
  { id: 'products', label: 'Produtos', icon: <Package size={18} /> },
  { id: 'coupons', label: 'Cupons', icon: <Tag size={18} /> },
  { id: 'banners', label: 'Banners', icon: <Image size={18} /> },
  { id: 'categories', label: 'Categorias', icon: <FolderOpen size={18} /> },
  { id: 'orders', label: 'Pedidos', icon: <ShoppingBag size={18} /> },
  { id: 'payments', label: 'Pagamentos', icon: <CreditCard size={18} /> },
  { id: 'gamification', label: 'Gamificação', icon: <Star size={18} /> },
  { id: 'quiz', label: 'Quiz Setup', icon: <Package size={18} /> },
  { id: 'testimonials', label: 'Depoimentos', icon: <MessageSquare size={18} /> },
  { id: 'reviews', label: 'Avaliações', icon: <Star size={18} /> },
  { id: 'calculadora', label: 'Calculadora', icon: <Calculator size={18} /> },
  { id: 'settings', label: 'Config. Loja', icon: <ShieldCheck size={18} /> },
];

const AdminPanel: React.FC<AdminPanelProps> = ({
  products, categories, banners, orders,
  onAddProduct, onUpdateProduct, onDeleteProduct,
  onUpdateBanners, onAddCategory, onUpdateCategory, onDeleteCategory,
  onReorderCategories, onAdvanceOrderStatus, onUpdateOrderStatus, addToast, onLogout,
  storeSettings, paymentSettings, quizConfig, testimonials, reviews, onUpdateStoreSettings, onUpdatePaymentSettings, onUpdateQuizConfig, onUpdateTestimonials, onUpdateReviews
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentStoreSettings = storeSettings || {
    row1Title: 'Ofertas do Dia',
    row1ProductIds: products.slice(0, 4).map(p => p.id),
    row2Title: 'Hardware Alienigena',
    row2ProductIds: products.slice(2, 6).map(p => p.id),
    row3Title: 'Acessorios Essenciais',
    row3ProductIds: products.slice(4, 8).map(p => p.id),
    gridImages: { image1: '', image2: '', image3: '' }
  };

  const updateStoreSettings = (patch: Partial<import('../types').StoreSettings>) => {
    onUpdateStoreSettings?.({ ...currentStoreSettings, ...patch });
  };

  const renderProductPicker = (
    label: string,
    keyName: 'row1ProductIds' | 'row2ProductIds' | 'row3ProductIds'
  ) => {
    const selectedIds = currentStoreSettings[keyName] || [];

    return (
      <div className="form-group">
        <label className="cyber-label">{label} ({selectedIds.length} selecionados)</label>
        <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', padding: '10px', display: 'grid', gap: '8px', background: 'rgba(0,0,0,0.18)' }}>
          {products.map(product => {
            const checked = selectedIds.includes(product.id);
            return (
              <label key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '8px', borderRadius: '6px', background: checked ? 'rgba(69,230,39,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${checked ? 'rgba(69,230,39,0.25)' : 'rgba(255,255,255,0.05)'}` }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const nextIds = e.target.checked
                      ? [...selectedIds, product.id]
                      : selectedIds.filter(id => id !== product.id);
                    updateStoreSettings({ [keyName]: nextIds } as Partial<import('../types').StoreSettings>);
                  }}
                />
                <span style={{ flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</span>
                <small style={{ color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>R$ {product.price.toFixed(2).replace('.', ',')}</small>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard orders={orders} products={products} />;
      case 'metrics': return <AdminMetrics orders={orders} products={products} />;
      case 'products': return <AdminProducts products={products} categories={categories} onAdd={onAddProduct} onUpdate={onUpdateProduct} onDelete={onDeleteProduct} addToast={addToast} />;
      case 'coupons': return <AdminCoupons addToast={addToast} />;
      case 'banners': return <AdminBanners banners={banners} onUpdate={onUpdateBanners} addToast={addToast} />;
      case 'categories': return <AdminCategories categories={categories} onAdd={onAddCategory} onUpdate={onUpdateCategory} onDelete={onDeleteCategory} onReorder={onReorderCategories} addToast={addToast} />;
      case 'orders': return <AdminOrders orders={orders} onAdvanceStatus={onAdvanceOrderStatus} onUpdateStatus={onUpdateOrderStatus} />;
      case 'payments': return <AdminPayments addToast={addToast} paymentSettings={paymentSettings!} onUpdatePaymentSettings={onUpdatePaymentSettings!} />;
      case 'gamification': return <AdminGamification addToast={addToast} />;
      case 'quiz': return <AdminQuizConfig quizConfig={quizConfig!} onUpdateConfig={onUpdateQuizConfig!} addToast={addToast} />;
      case 'testimonials': 
        return (
          <AdminTestimonials 
            testimonials={testimonials || []} 
            onAdd={(t) => onUpdateTestimonials?.([...(testimonials || []), t])} 
            onUpdate={(t: any) => onUpdateTestimonials?.((testimonials || []).map(test => test.id === t.id ? t : test))}
            onDelete={(id) => onUpdateTestimonials?.((testimonials || []).filter(test => test.id !== id))}
            addToast={addToast} 
          />
        );
      case 'reviews':
        return (
          <AdminReviews
            reviews={reviews || []}
            products={products}
            onApprove={(id) => onUpdateReviews?.((reviews || []).map(r => r.id === id ? { ...r, status: 'approved' as const } : r))}
            onReject={(id) => onUpdateReviews?.((reviews || []).map(r => r.id === id ? { ...r, status: 'rejected' as const } : r))}
            onDelete={(id) => onUpdateReviews?.((reviews || []).filter(r => r.id !== id))}
            onAdd={(r) => onUpdateReviews?.([...(reviews || []), r])}
            addToast={addToast}
          />
        );
      case 'calculadora':
        return <AdminCalculadora />;
      case 'settings': 
        return (
          <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
            <h2 style={{ marginBottom: '24px', color: 'var(--color-primary)' }}>Configurações de Layout da Loja</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '32px' }}>Personalize os títulos das seções, gerencie as marcas parceiras e aprove depoimentos de alienígenas nesta área.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
              <div className="form-group">
                <label className="cyber-label">Título da Linha 1</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={currentStoreSettings.row1Title || ''} 
                  onChange={(e) => updateStoreSettings({ row1Title: e.target.value })}
                />
              </div>
              {renderProductPicker('Produtos da Linha 1', 'row1ProductIds')}
              <div className="form-group">
                <label className="cyber-label">Título da Linha 2</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={currentStoreSettings.row2Title || ''} 
                  onChange={(e) => updateStoreSettings({ row2Title: e.target.value })}
                />
              </div>
              {renderProductPicker('Produtos da Linha 2', 'row2ProductIds')}
              <div className="form-group">
                <label className="cyber-label">Título da Linha 3</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={currentStoreSettings.row3Title || ''} 
                  onChange={(e) => updateStoreSettings({ row3Title: e.target.value })}
                />
              </div>
              {renderProductPicker('Produtos da Linha 3', 'row3ProductIds')}

              <h3 style={{ marginTop: '16px', color: 'var(--color-text-white)' }}>Banners da Home (3 Imagens)</h3>
              
              <div className="form-group">
                <label className="cyber-label">Imagem 1 (Upload)</label>
                {currentStoreSettings.gridImages?.image1 && <img src={currentStoreSettings.gridImages.image1} alt="Preview 1" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />}
                <input 
                  type="file" 
                  accept="image/*"
                  className="cyber-input" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await fileToBase64(file);
                      updateStoreSettings({ gridImages: { ...currentStoreSettings.gridImages, image1: base64 } });
                    }
                  }}
                />
                <label className="cyber-label" style={{ marginTop: '8px' }}>Link Imagem 1 (Opcional)</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={currentStoreSettings.gridImages?.link1 || ''} 
                  onChange={(e) => updateStoreSettings({ gridImages: { ...currentStoreSettings.gridImages, link1: e.target.value } })}
                />
              </div>

              <div className="form-group">
                <label className="cyber-label">Imagem 2 (Upload)</label>
                {currentStoreSettings.gridImages?.image2 && <img src={currentStoreSettings.gridImages.image2} alt="Preview 2" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />}
                <input 
                  type="file" 
                  accept="image/*"
                  className="cyber-input" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await fileToBase64(file);
                      updateStoreSettings({ gridImages: { ...currentStoreSettings.gridImages, image2: base64 } });
                    }
                  }}
                />
                <label className="cyber-label" style={{ marginTop: '8px' }}>Link Imagem 2 (Opcional)</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={currentStoreSettings.gridImages?.link2 || ''} 
                  onChange={(e) => updateStoreSettings({ gridImages: { ...currentStoreSettings.gridImages, link2: e.target.value } })}
                />
              </div>

              <div className="form-group">
                <label className="cyber-label">Imagem 3 (Upload)</label>
                {currentStoreSettings.gridImages?.image3 && <img src={currentStoreSettings.gridImages.image3} alt="Preview 3" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />}
                <input 
                  type="file" 
                  accept="image/*"
                  className="cyber-input" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await fileToBase64(file);
                      updateStoreSettings({ gridImages: { ...currentStoreSettings.gridImages, image3: base64 } });
                    }
                  }}
                />
                <label className="cyber-label" style={{ marginTop: '8px' }}>Link Imagem 3 (Opcional)</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={currentStoreSettings.gridImages?.link3 || ''} 
                  onChange={(e) => updateStoreSettings({ gridImages: { ...currentStoreSettings.gridImages, link3: e.target.value } })}
                />
              </div>
              
              <button 
                className="neon-glow-btn" 
                style={{ alignSelf: 'flex-start', marginTop: '16px' }}
                onClick={() => addToast('Configurações cósmicas salvas com sucesso!', 'success')}
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-panel-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="admin-sidebar-logo">
          <ShieldCheck size={24} className="neon-text" />
          {sidebarOpen && (
            <div>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '0.9rem', lineHeight: 1 }}>PLUG-IN</p>
              <p style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', letterSpacing: '1px' }}>ADMIN PANEL</p>
            </div>
          )}
          <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`admin-nav-item ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => setActiveTab(t.id)}
              title={!sidebarOpen ? t.label : undefined}
            >
              {t.icon}
              {sidebarOpen && <span>{t.label}</span>}
            </button>
          ))}
        </nav>

        <button className="admin-nav-item admin-logout-btn" onClick={onLogout} title={!sidebarOpen ? 'Sair' : undefined}>
          <LogOut size={18} />
          {sidebarOpen && <span>Sair do Painel</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="admin-topbar-title">{TABS.find(t => t.id === activeTab)?.label}</h1>
            <p className="admin-topbar-sub">Plug-in Tech Store · Painel Administrativo</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '6px 14px', background: 'rgba(69,230,39,0.1)', border: '1px solid rgba(69,230,39,0.3)', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', color: 'var(--color-primary)', fontFamily: 'var(--font-display)' }}>
              ● ONLINE
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>admin@plugin.store</span>
          </div>
        </div>

        <div className="admin-content-area">
          {renderTab()}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
