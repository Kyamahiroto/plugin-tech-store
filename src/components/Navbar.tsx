import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Menu, Heart, Receipt, User, X, Compass, LogOut, Package, MapPin, Search } from 'lucide-react';
import { Product, UserProfile } from '../types';
import { getRankByXP } from '../utils/gamification';
import AddressForm from './AddressForm';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  cartCount: number;
  cartItems?: import('../types').CartItem[];
  userProfile: UserProfile;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  dbConnected?: boolean;
  favoritesCount?: number;
  onLogout?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  products?: Product[];
  onSelectProduct?: (productId: string) => void;
  onSelectCategoryClick?: (slug: string | null) => void;
  shippingAddress?: string;
  setShippingAddress?: (address: string) => void;
  categories?: import('../types').Category[];
  showAddressModal?: boolean;
  setShowAddressModal?: (show: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  cartCount,
  cartItems = [],
  userProfile,
  sidebarOpen,
  setSidebarOpen,

  favoritesCount = 0,
  onLogout,
  searchQuery = '',
  setSearchQuery,
  products = [],
  onSelectProduct,
  onSelectCategoryClick,
  shippingAddress = '',
  setShippingAddress,
  categories = [],
  showAddressModal: externalShowAddressModal,
  setShowAddressModal: externalSetShowAddressModal
}) => {
  const [profilePopupOpen, setProfilePopupOpen] = useState(false);
  const [internalShowAddressModal, setInternalShowAddressModal] = useState(false);
  const [cartPopupOpen, setCartPopupOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const cartPopupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const showAddressModal = externalShowAddressModal !== undefined ? externalShowAddressModal : internalShowAddressModal;
  const setShowAddressModal = externalSetShowAddressModal || setInternalShowAddressModal;
  const [tempAddress, setTempAddress] = useState(shippingAddress || '');
  const popupTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setTempAddress(shippingAddress || '');
  }, [shippingAddress]);

  const renderEmojiAvatar = (avatarString: string, baseFontSize: string) => {
    return <span style={{ fontSize: baseFontSize, display: 'inline-block', lineHeight: 1 }}>{avatarString}</span>;
  };

  const getSpeciesAvatar = (species: string) => {
    switch (species) {
      case 'custom': return '📸';
      case 'gray': return '👽';
      case 'reptilian': return '🦎';
      case 'human_girl_rocket': return '👩‍🚀';
      case 'human_boy_rocket': return '👨‍🚀';
      default: return '👽';
    }
  };

  const getSpeciesPlanet = (species: string) => {
    switch (species) {
      case 'custom': return 'Planeta Holograma';
      case 'gray': return 'Retículo II';
      case 'reptilian': return 'Zeta Reticuli';
      case 'human_girl_rocket':
      case 'human_boy_rocket':
        return 'Terra (Abdução Fácil)';
      default: return 'Espaço Profundo';
    }
  };

  const handlePopupMouseEnter = () => {
    if (popupTimeout.current) clearTimeout(popupTimeout.current);
    setProfilePopupOpen(true);
  };

  const handlePopupMouseLeave = () => {
    popupTimeout.current = setTimeout(() => {
      setProfilePopupOpen(false);
    }, 300);
  };

  const handleCartMouseEnter = () => {
    if (cartPopupTimeout.current) clearTimeout(cartPopupTimeout.current);
    setCartPopupOpen(true);
  };

  const handleCartMouseLeave = () => {
    cartPopupTimeout.current = setTimeout(() => {
      setCartPopupOpen(false);
    }, 300);
  };

  const searchSuggestions = searchQuery.trim()
    ? products
        .filter(product => {
          const q = searchQuery.trim().toLowerCase();
          return product.name.toLowerCase().includes(q) || product.description.toLowerCase().includes(q);
        })
        .slice(0, 6)
    : [];

  const openShopSearch = () => {
    setCurrentView('shop');
    setSearchFocused(false);
  };

  const headerCategories = categories.slice(0, 9);


  const mobileMenu = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'shop', label: 'Loja Completa', icon: Compass },
    { id: 'favorites', label: 'Favoritos', icon: Heart },
    { id: 'orders', label: 'Pedidos', icon: Receipt },
    { id: 'profile', label: 'Perfil', icon: User }
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <div className="nav-logo" onClick={() => setCurrentView('home')}>
            <img src="/logo.png" alt="Plug-In Logo" className="nav-logo-img" />
            <div className="nav-logo-text">
              PLUG-IN
              <span className="store-sub">TECH STORE</span>
            </div>
          </div>

          {/* Header Search & Shipping Address */}
          <div className="header-search-desktop">
            <div 
              className="header-shipping" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => {
                setShowAddressModal(true);
              }}
            >
              <MapPin size={20} color="var(--color-primary)" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', lineHeight: 1.2 }}>Enviar para</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.2 }}>
                  {shippingAddress || 'Sintonizando...'}
                </span>
              </div>
            </div>

            <div className="cyber-input-wrapper" style={{ maxWidth: '600px', flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Busque por alienwares, naves, implantes..."
                className="cyber-input"
                style={{ padding: '10px 20px', paddingRight: '48px', height: '42px', backgroundColor: 'rgba(0,0,0,0.5)' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery?.(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') openShopSearch();
                }}
              />
              <button 
                className="cyber-input-btn" 
                style={{ height: '34px', width: '34px', right: '4px' }}
                onClick={openShopSearch}
              >
                <Search size={16} />
              </button>
              {searchFocused && searchSuggestions.length > 0 && (
                <div className="header-search-suggestions">
                  {searchSuggestions.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      className="header-search-suggestion"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelectProduct?.(product.id);
                        setSearchFocused(false);
                      }}
                    >
                      <span className="header-search-suggestion-name">{product.name}</span>
                      <span className="header-search-suggestion-price">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    className="header-search-suggestion view-all"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      openShopSearch();
                    }}
                  >
                    Ver todos os resultados
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Right Actions */}
          <div className="nav-actions">

            {/* Desktop Profile/Login Widget */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              
              <div
                className="desktop-profile-widget"
                style={{ position: 'relative' }}
                onMouseEnter={handlePopupMouseEnter}
                onMouseLeave={handlePopupMouseLeave}
              >
              {userProfile.name ? (
                <div 
                  className="nav-profile-active"
                  onClick={() => setCurrentView('profile')}
                  title="Acessar Painel do Perfil"
                >
                  <div className="nav-profile-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {userProfile.avatarUrl ? (
                      <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      renderEmojiAvatar(getSpeciesAvatar(userProfile.species), '1.1rem')
                    )}
                  </div>
                  <div className="nav-profile-text">
                    <span className="nav-profile-welcome">Olá,</span>
                    <span className="nav-profile-name">{userProfile.name}</span>
                  </div>
                </div>
              ) : (
                <div 
                  className="nav-profile-guest"
                  onClick={() => setCurrentView('profile')}
                  title="Entre ou Cadastre seu Perfil Espacial"
                >
                  <div className="nav-profile-avatar guest">
                    👽
                  </div>
                  <span className="nav-profile-login-btn">Entre ou Cadastre-se</span>
                </div>
              )}

              {/* Hover Dropdown Popup */}
              {profilePopupOpen && (
                <div className="profile-hover-popup">
                  <div className="profile-hover-popup-arrow" />
                  <button
                    className="profile-popup-item"
                    onClick={() => { setCurrentView('profile'); setProfilePopupOpen(false); }}
                  >
                    <User size={15} />
                    Meu Perfil
                  </button>
                  <button
                    className="profile-popup-item"
                    onClick={() => { setCurrentView('orders'); setProfilePopupOpen(false); }}
                  >
                    <Package size={15} />
                    Meus Pedidos
                  </button>
                  <button
                    className="profile-popup-item"
                    onClick={() => { setCurrentView('tracking'); setProfilePopupOpen(false); }}
                  >
                    <MapPin size={15} />
                    Rastreio
                  </button>
                  <div className="profile-popup-divider" />
                  <button
                    className="profile-popup-item danger"
                    onClick={() => { onLogout?.(); setProfilePopupOpen(false); }}
                  >
                    <LogOut size={15} />
                    Sair da Conta
                  </button>
                </div>
              )}
              </div>

              {/* GAMIFICATION HUD */}
              {userProfile.name && (
                  <div 
                  className="gamification-hud" 
                  onClick={() => setCurrentView('profile-missions')}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '8px', 
                    backgroundColor: 'rgba(0,0,0,0.4)', padding: '6px 12px', 
                    borderRadius: 'var(--radius-full)', border: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer'
                  }}
                  title={`Rank: ${getRankByXP(userProfile.xp || 0).name} - Clique para ver missões`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.2rem', filter: `drop-shadow(0 0 5px ${getRankByXP(userProfile.xp || 0).color})` }}>
                      {getRankByXP(userProfile.xp || 0).icon}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontSize: '0.55rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1, marginBottom: '2px' }}>Seu nível:</span>
                      <span style={{ fontSize: '0.65rem', color: getRankByXP(userProfile.xp || 0).color, textTransform: 'uppercase', letterSpacing: '0.5px', lineHeight: 1, fontWeight: 800 }}>
                        {getRankByXP(userProfile.xp || 0).name}
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-warning)', lineHeight: 1, marginTop: '2px' }}>
                        {userProfile.aliencoins || 0} <span style={{ fontSize: '0.6rem', color: 'var(--color-text-muted)' }}>Aliencoins</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Favorites Heart Button */}
            <button 
              className="nav-btn-icon" 
              onClick={() => setCurrentView('favorites')}
              title="Visualizar Favoritos"
              style={{ position: 'relative' }}
            >
              <Heart 
                size={22} 
                style={{
                  color: currentView === 'favorites' ? 'var(--color-primary)' : 'inherit',
                  fill: currentView === 'favorites' ? 'var(--color-primary)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              />
              {favoritesCount > 0 && (
                <span className="cart-badge" style={{ backgroundColor: 'var(--color-primary)', color: '#000' }}>
                  {favoritesCount}
                </span>
              )}
            </button>

            <div
              style={{ position: 'relative' }}
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
            >
              <button 
                className="nav-btn-icon" 
                onClick={() => setCurrentView('cart')}
                title="Visualizar Carrinho"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              {/* Hover Cart Popup */}
              {cartPopupOpen && (
                <div className="cart-hover-popup" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '320px',
                  backgroundColor: 'var(--color-bg-card)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  marginTop: '8px',
                  zIndex: 1000,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                }}>
                  <div style={{ position: 'absolute', top: '-6px', right: '16px', width: '12px', height: '12px', backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid rgba(255,255,255,0.1)', borderLeft: '1px solid rgba(255,255,255,0.1)', transform: 'rotate(45deg)' }} />
                  
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>Seu Carrinho</h4>
                  
                  {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      Seu carrinho está vazio 🛸
                    </div>
                  ) : (
                    <>
                      <div style={{ maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', paddingRight: '4px' }}>
                        {cartItems.map(item => (
                          <div key={item.product.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                              {item.product.image.startsWith('http') || item.product.image.startsWith('data:') ? (
                                <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <ShoppingCart size={16} color="var(--color-text-muted)" />
                                </div>
                              )}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.8rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>{item.quantity}x R$ {item.product.price.toFixed(2).replace('.', ',')}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontWeight: 'bold' }}>
                        <span>Total:</span>
                        <span style={{ color: 'var(--color-primary)' }}>
                          R$ {cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0).toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      <button 
                        style={{ width: '100%', padding: '10px', backgroundColor: 'var(--color-primary)', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => {
                          setCurrentView('cart');
                          setCartPopupOpen(false);
                        }}
                      >
                        Ir para o Checkout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button 
              className="hamburger-btn" 
              onClick={() => setSidebarOpen(true)}
              title="Abrir Menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Categories Subheader */}
      <div className="header-categories-bar">
        <div className="header-categories-inner" style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', gap: '12px' }}>
          <div className="header-categories-list" style={{ display: 'flex', gap: '12px', overflow: 'hidden', padding: '10px 0', flex: 1, minWidth: 0 }}>
             <div 
                className="header-category-item" 
                style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0 }}
                onClick={() => {
                  onSelectCategoryClick?.(null);
                  setCurrentView('shop');
                }}
             >
                <Menu size={16} /> Todos os Departamentos
             </div>
             {headerCategories.map(c => (
               <div 
                 key={c.id} 
                 className="header-category-item" 
                 style={{ fontSize: '0.85rem', color: 'var(--color-text-white)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color 0.2s' }}
                 onClick={() => {
                   onSelectCategoryClick?.(c.slug);
                   setCurrentView('shop');
                 }}
                 onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                 onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-white)'}
               >
                 {c.name}
               </div>
             ))}
          </div>
          <div className="header-setup-banner" onClick={() => setCurrentView('setup-quiz')} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', backgroundColor: 'var(--color-primary-dim)', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-primary)', flexShrink: 0 }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>Monte seu Setup</span>
            <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🛸</span>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile Sidebar Drawer */}
      <div className={`sidebar-drawer ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="nav-logo-text" style={{ fontSize: '1rem' }}>
            PLUG-IN <span className="store-sub">TECH STORE</span>
          </div>
          <button className="nav-btn-icon" onClick={() => setSidebarOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="sidebar-menu">
          {mobileMenu.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`sidebar-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </div>
            );
          })}

          {/* Logout in mobile sidebar */}
          {userProfile.name && (
            <>
              <div className="profile-popup-divider" style={{ margin: '8px 16px' }} />
              <div
                className="sidebar-item"
                style={{ color: 'var(--color-danger)' }}
                onClick={() => { onLogout?.(); setSidebarOpen(false); }}
              >
                <LogOut size={20} />
                <span>Sair da Conta</span>
              </div>
            </>
          )}
        </div>

        {/* Profile indicator at bottom of sidebar */}
        <div 
          className="sidebar-profile-card"
          onClick={() => {
            setCurrentView('profile');
            setSidebarOpen(false);
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="sidebar-profile-avatar" style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              userProfile.name ? renderEmojiAvatar(getSpeciesAvatar(userProfile.species), '1.8rem') : '👽'
            )}
          </div>
          <div className="sidebar-profile-info">
            <h4>{userProfile.name || 'Entre ou Cadastre-se'}</h4>
            <p>{userProfile.name ? getSpeciesPlanet(userProfile.species) : 'Sintonizar DNA de Cliente 🧬'}</p>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="admin-modal-overlay" style={{ zIndex: 9999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAddressModal(false)}>
          <div className="admin-modal glass-panel" style={{ maxWidth: '400px', width: '90%', backgroundColor: '#1a1a1a', borderRadius: '12px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-head" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>📍 Sintonizar Endereço</h3>
              <button onClick={() => setShowAddressModal(false)} className="admin-close-btn"><X size={20} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Insira seu CEP para calcularmos o teletransporte dos seus produtos.
              </p>
              <AddressForm
                initialAddress={tempAddress}
                onAddressChange={setTempAddress}
                onSave={() => {
                  if (setShippingAddress) setShippingAddress(tempAddress);
                  setShowAddressModal(false);
                }}
                onCancel={() => setShowAddressModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
