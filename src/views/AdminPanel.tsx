import React, { useState } from 'react';
import { Product, Category, Banner, Order } from '../types';
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
  addToast: (msg: string, type?: 'success' | 'error') => void;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'metrics' | 'products' | 'coupons' | 'banners' | 'categories' | 'orders' | 'payments' | 'gamification' | 'quiz' | 'testimonials' | 'settings';

import { Activity, MessageSquare } from 'lucide-react';

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
  { id: 'settings', label: 'Config. Loja', icon: <ShieldCheck size={18} /> }, // Using ShieldCheck as icon for settings
];

const AdminPanel: React.FC<AdminPanelProps> = ({
  products, categories, banners, orders,
  onAddProduct, onUpdateProduct, onDeleteProduct,
  onUpdateBanners, onAddCategory, onUpdateCategory, onDeleteCategory,
  onAdvanceOrderStatus, onUpdateOrderStatus, addToast, onLogout,
  storeSettings, paymentSettings, quizConfig, testimonials, onUpdateStoreSettings, onUpdatePaymentSettings, onUpdateQuizConfig, onUpdateTestimonials
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <AdminDashboard orders={orders} products={products} />;
      case 'metrics': return <AdminMetrics orders={orders} products={products} />;
      case 'products': return <AdminProducts products={products} categories={categories} onAdd={onAddProduct} onUpdate={onUpdateProduct} onDelete={onDeleteProduct} addToast={addToast} />;
      case 'coupons': return <AdminCoupons addToast={addToast} />;
      case 'banners': return <AdminBanners banners={banners} onUpdate={onUpdateBanners} addToast={addToast} />;
      case 'categories': return <AdminCategories categories={categories} onAdd={onAddCategory} onUpdate={onUpdateCategory} onDelete={onDeleteCategory} addToast={addToast} />;
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
                  value={storeSettings?.row1Title || ''} 
                  onChange={(e) => onUpdateStoreSettings?.({...storeSettings!, row1Title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="cyber-label">Título da Linha 2</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={storeSettings?.row2Title || ''} 
                  onChange={(e) => onUpdateStoreSettings?.({...storeSettings!, row2Title: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="cyber-label">Título da Linha 3</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={storeSettings?.row3Title || ''} 
                  onChange={(e) => onUpdateStoreSettings?.({...storeSettings!, row3Title: e.target.value})}
                />
              </div>

              <h3 style={{ marginTop: '16px', color: 'var(--color-text-white)' }}>Banners da Home (3 Imagens)</h3>
              
              <div className="form-group">
                <label className="cyber-label">Imagem 1 (Upload)</label>
                {storeSettings?.gridImages?.image1 && <img src={storeSettings.gridImages.image1} alt="Preview 1" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />}
                <input 
                  type="file" 
                  accept="image/*"
                  className="cyber-input" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await fileToBase64(file);
                      onUpdateStoreSettings?.({...storeSettings!, gridImages: {...storeSettings!.gridImages, image1: base64}});
                    }
                  }}
                />
                <label className="cyber-label" style={{ marginTop: '8px' }}>Link Imagem 1 (Opcional)</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={storeSettings?.gridImages?.link1 || ''} 
                  onChange={(e) => onUpdateStoreSettings?.({...storeSettings!, gridImages: {...storeSettings!.gridImages, link1: e.target.value}})}
                />
              </div>

              <div className="form-group">
                <label className="cyber-label">Imagem 2 (Upload)</label>
                {storeSettings?.gridImages?.image2 && <img src={storeSettings.gridImages.image2} alt="Preview 2" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />}
                <input 
                  type="file" 
                  accept="image/*"
                  className="cyber-input" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await fileToBase64(file);
                      onUpdateStoreSettings?.({...storeSettings!, gridImages: {...storeSettings!.gridImages, image2: base64}});
                    }
                  }}
                />
                <label className="cyber-label" style={{ marginTop: '8px' }}>Link Imagem 2 (Opcional)</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={storeSettings?.gridImages?.link2 || ''} 
                  onChange={(e) => onUpdateStoreSettings?.({...storeSettings!, gridImages: {...storeSettings!.gridImages, link2: e.target.value}})}
                />
              </div>

              <div className="form-group">
                <label className="cyber-label">Imagem 3 (Upload)</label>
                {storeSettings?.gridImages?.image3 && <img src={storeSettings.gridImages.image3} alt="Preview 3" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} />}
                <input 
                  type="file" 
                  accept="image/*"
                  className="cyber-input" 
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const base64 = await fileToBase64(file);
                      onUpdateStoreSettings?.({...storeSettings!, gridImages: {...storeSettings!.gridImages, image3: base64}});
                    }
                  }}
                />
                <label className="cyber-label" style={{ marginTop: '8px' }}>Link Imagem 3 (Opcional)</label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  value={storeSettings?.gridImages?.link3 || ''} 
                  onChange={(e) => onUpdateStoreSettings?.({...storeSettings!, gridImages: {...storeSettings!.gridImages, link3: e.target.value}})}
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
