import React, { useState, useEffect } from 'react';
import { MapPin, Gift, Heart, Headphones, Mouse, Keyboard, Gamepad, Cpu, Eye, Radio, Sparkles } from 'lucide-react';
import { Product, Category, Banner, UserProfile, StoreSettings, Testimonial, Brand } from '../types';
import HeroSlider from '../components/HeroSlider';
import { FUNNY_MASCOT_QUOTES } from '../mockData';

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
  favorites: string[];
  userProfile: UserProfile;
  storeSettings?: import('../types').StoreSettings;
  testimonials?: import('../types').Testimonial[];
  brands?: import('../types').Brand[];
  onAddToCart: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onSelectBanner: (bannerId: string) => void;
  onSelectProduct: (productId: string) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
  onSelectCategoryClick?: (slug: string) => void;
  onOpenAddressModal?: () => void;
}

// Custom Premium Vector Renderer for Product Images
export const ProductImage: React.FC<{ type: string; colorStyle?: 'green' | 'pink' | 'blue' | 'purple' | 'orange' }> = ({ type, colorStyle = 'green' }) => {
  const getThemeColors = () => {
    switch (colorStyle) {
      case 'pink': return { main: '#f472b6', shadow: 'rgba(244, 114, 182, 0.4)' };
      case 'blue': return { main: '#38bdf8', shadow: 'rgba(56, 189, 248, 0.4)' };
      case 'purple': return { main: '#c084fc', shadow: 'rgba(192, 132, 252, 0.4)' };
      case 'orange': return { main: '#fb923c', shadow: 'rgba(251, 146, 60, 0.4)' };
      case 'green':
      default: return { main: '#45e627', shadow: 'rgba(69, 230, 39, 0.4)' };
    }
  };

  const colors = getThemeColors();

  if (type.startsWith('http') || type.startsWith('/') || type.startsWith('data:')) {
    return (
      <img 
        src={type} 
        alt="Produto" 
        style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 }} 
      />
    );
  }

  switch (type) {
    case 'audio':
      return (
        <div className="cyber-render" style={{ color: colors.main, filter: `drop-shadow(0 0 10px ${colors.shadow})` }}>
          <div className="cyber-render-halo" style={{ borderColor: colors.main, width: '100px', height: '65px' }} />
          <Headphones size={42} strokeWidth={1.5} />
        </div>
      );
    case 'cat-headphones':
      return (
        <div className="cyber-render" style={{ color: '#f472b6', filter: 'drop-shadow(0 0 10px rgba(244, 114, 182, 0.5))' }}>
          <div className="cyber-render-halo pink" style={{ width: '100px', height: '65px' }} />
          <div style={{ position: 'relative' }}>
            <Headphones size={42} strokeWidth={1.5} />
            {/* Cute cat ears */}
            <span style={{ position: 'absolute', top: '-12px', left: '-2px', fontSize: '1rem', transform: 'rotate(-15deg)' }}>📐</span>
            <span style={{ position: 'absolute', top: '-12px', right: '-2px', fontSize: '1rem', transform: 'rotate(65deg) scaleX(-1)' }}>📐</span>
          </div>
        </div>
      );
    case 'keyboard':
      return (
        <div className="cyber-render" style={{ color: '#38bdf8', filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))' }}>
          <div className="cyber-render-halo blue" style={{ width: '110px', height: '60px' }} />
          <Keyboard size={42} strokeWidth={1.5} />
        </div>
      );
    case 'mouse':
      return (
        <div className="cyber-render" style={{ color: colors.main, filter: `drop-shadow(0 0 10px ${colors.shadow})` }}>
          <div className="cyber-render-halo" style={{ borderColor: colors.main, width: '90px', height: '65px' }} />
          <Mouse size={42} strokeWidth={1.5} />
        </div>
      );
    case 'console':
      return (
        <div className="cyber-render" style={{ color: '#fb923c', filter: 'drop-shadow(0 0 10px rgba(251, 146, 60, 0.5))' }}>
          <div className="cyber-render-halo orange" style={{ width: '105px', height: '60px' }} />
          <Gamepad size={42} strokeWidth={1.5} />
        </div>
      );
    case 'vr-headset':
      return (
        <div className="cyber-render" style={{ color: '#c084fc', filter: 'drop-shadow(0 0 10px rgba(192, 132, 252, 0.5))' }}>
          <div className="cyber-render-halo purple" style={{ width: '100px', height: '65px' }} />
          <Eye size={42} strokeWidth={1.5} />
        </div>
      );
    case 'antenna':
      return (
        <div className="cyber-render animate-blink" style={{ color: colors.main, filter: `drop-shadow(0 0 10px ${colors.shadow})` }}>
          <div className="cyber-render-halo" style={{ borderColor: colors.main, width: '100px', height: '65px', animation: 'spinHalo 8s linear infinite' }} />
          <Radio size={42} strokeWidth={1.5} />
        </div>
      );
    default:
      return (
        <div className="cyber-render" style={{ color: colors.main, filter: `drop-shadow(0 0 10px ${colors.shadow})` }}>
          <div className="cyber-render-halo" style={{ borderColor: colors.main, width: '90px', height: '65px' }} />
          <Cpu size={42} strokeWidth={1.5} />
        </div>
      );
  }
};

const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  banners,
  favorites,
  userProfile,
  storeSettings,
  testimonials,
  brands,
  onAddToCart,
  onToggleFavorite,
  onSelectBanner,
  onSelectProduct,
  addToast,
  onSelectCategoryClick,
  onOpenAddressModal
}) => {
  const [mascotQuoteIndex, setMascotQuoteIndex] = useState(0);
  const [displayLocation, setDisplayLocation] = useState('Sintonizando sua base...');
  const [giftCardFilter, setGiftCardFilter] = useState<'all' | 'games' | 'apps'>('all');

  useEffect(() => {
    // 1. Try from user profile address
    if (userProfile?.address) {
      // Basic regex to find Cidade/UF - e.g. "..., Cidade/UF - ..."
      // For AddressForm, it outputs "Rua, 123 - Bairro, Cidade/UF - CEP"
      const match = userProfile.address.match(/(?:,\s*|\-\s*)([^,-]+)\/([A-Z]{2})\s*-/);
      if (match && match[1] && match[2]) {
        setDisplayLocation(`${match[1].trim()}, ${match[2]}`);
        return;
      }
      // If it doesn't match the regex but has address, just try to get the first part or default
      setDisplayLocation('Base Espacial do Cliente');
      return;
    }

    // 2. Try fetching from IP
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.city && data.region_code) {
          setDisplayLocation(`${data.city}, ${data.region_code}`);
        } else {
          setDisplayLocation('Sintonize sua localização');
        }
      })
      .catch(() => {
        setDisplayLocation('Sintonize sua localização');
      });
  }, [userProfile?.address]);

  // Rotate mascot quote on click
  const handleMascotClick = () => {
    setMascotQuoteIndex((prev) => (prev + 1) % FUNNY_MASCOT_QUOTES.length);
    addToast('Mascote respondeu telepaticamente! 🧠👽', 'success');
  };

  // Toggle dynamic location
  const handleLocationClick = () => {
    if (onOpenAddressModal) {
      onOpenAddressModal();
    } else {
      addToast('Recurso de teletransporte não está disponível no momento. 🛸', 'error');
    }
  };

  // Filter products based on category selector
  // No longer needed as we navigate to Shop

  // Render Category Icon dynamically
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Headphones': return <Headphones size={24} />;
      case 'Mouse': return <Mouse size={24} />;
      case 'Keyboard': return <Keyboard size={24} />;
      case 'Gamepad': return <Gamepad size={24} />;
      default: return <Cpu size={24} />;
    }
  };

  const renderProductCard = (product: Product, asCarouselItem = false) => {
    const isFav = favorites.includes(product.id);
    let imageCode = product.image;
    if (product.id === 'prod-orelha-gato') imageCode = 'cat-headphones';
    
    let aestheticColor: 'green' | 'pink' | 'blue' | 'purple' | 'orange' = 'green';
    if (product.category === 'audio') {
      aestheticColor = product.id === 'prod-orelha-gato' ? 'pink' : 'green';
    } else if (product.category === 'teclados') {
      aestheticColor = 'blue';
    } else if (product.category === 'mouses') {
      aestheticColor = 'green';
    } else if (product.category === 'games') {
      aestheticColor = product.id === 'prod-oculos-vr' ? 'purple' : 'orange';
    }

    return (
      <div 
        key={product.id} 
        className="product-card"
        style={asCarouselItem ? { flex: '0 0 280px', scrollSnapAlign: 'start' } : undefined}
      >
        <div className="product-card-badges">
          {product.discount && <span className="badge-warning">-{product.discount}%</span>}
          {product.isNew && <span className="badge-neon">NOVO</span>}
        </div>

        <button
          className={`favorite-card-btn ${isFav ? 'favorited' : ''}`}
          onClick={() => onToggleFavorite(product.id)}
          title={isFav ? 'Remover dos Favoritos' : 'Favoritar produto'}
        >
          <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
        </button>

        <div className="product-image-frame" style={{ cursor: 'pointer' }} onClick={() => onSelectProduct(product.id)}>
          <ProductImage type={imageCode} colorStyle={aestheticColor} />
        </div>

        <div className="product-info">
          <h3 className="product-title" style={{ cursor: 'pointer' }} onClick={() => onSelectProduct(product.id)}>{product.name}</h3>
          <p className="product-desc" style={{ cursor: 'pointer' }} onClick={() => onSelectProduct(product.id)}>{product.description}</p>
          
          <div className="product-pricing">
            <div className="product-price-row">
              <span className="product-price">R$ {product.price.toFixed(2).replace('.', ',')}</span>
              {product.oldPrice && <span className="product-old-price">R$ {product.oldPrice.toFixed(2).replace('.', ',')}</span>}
            </div>
            <div className="pix-discount-badge">
              <span className="pix-badge-icon">⚡</span>
              <span>PIX com <strong>5% OFF</strong> = R$ {(product.price * 0.95).toFixed(2).replace('.', ',')}</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              💳 Em até <strong style={{ color: '#fff' }}>12x</strong> de <strong style={{ color: '#fff' }}>R$ {(product.price / 12).toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>

          <button className="outline-btn product-add-btn" onClick={() => onAddToCart(product)}>
            ADICIONAR
          </button>
        </div>
      </div>
    );
  };

  // Safe destructure with fallbacks
  const settings: StoreSettings = storeSettings || {
    row1Title: 'Ofertas do Dia', row1ProductIds: products.slice(0, 4).map(p => p.id),
    row2Title: 'Hardware Alienígena', row2ProductIds: products.slice(2, 6).map(p => p.id),
    row3Title: 'Acessórios Essenciais', row3ProductIds: products.slice(4, 8).map(p => p.id),
    gridImages: { image1: '/banner1.png', image2: '/banner2.png', image3: '/banner3.png' }
  };

  const currentBrands: Brand[] = brands || [];
  const currentTestimonials: Testimonial[] = testimonials || [];

  return (
    <div className="view-container animate-fade-in">
      {/* Top Banner Ticker Scroll */}
      <div className="top-ticker">
        <div className="ticker-wrap">
          <div className="ticker-content">
            🛸 Frete grátis para todo o Brasil via portal de dobra cósmica! &nbsp; ⚡ PIX COM 5% DE DESCONTO EM TODOS OS PRODUTOS! &nbsp; 👽 Abduza descontos incríveis na melhor loja de tecnologia interestelar da galáxia! &nbsp; 🚀 Garantia interestelar de 300 anos-luz! &nbsp; 💳 PIX COM 5% DE DESCONTO — COMPRE AGORA! &nbsp; 🛰️ Sintonizando sinal com o satélite alienígena secreto...
          </div>
        </div>
      </div>

      <div style={{ height: '16px' }} />

      {/* Hero Slide Banners */}
      <HeroSlider banners={banners} onActionClick={onSelectBanner} />

      {/* Categories Horizontal Carousel */}
      <div className="categories-section">
        <div className="categories-container">
          <div
            className={`category-pill active`}
            onClick={() => onSelectCategoryClick?.(null as any)}
          >
            <div className="category-icon-box">
              <Sparkles size={24} />
            </div>
            <span className="category-name">TODOS</span>
          </div>
          
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-pill`}
              onClick={() => onSelectCategoryClick?.(cat.slug)}
            >
              <div className="category-icon-box">
                {cat.imageUrl ? (
                  <img src={cat.imageUrl} alt={cat.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                ) : (
                  renderCategoryIcon(cat.iconName)
                )}
              </div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Default Home View Layout */}
      <>
        {/* ROW 1 */}
          <div className="offers-title-row">
            <h2 className="section-title">{settings.row1Title}</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🛸 {userProfile.name}
              </span>
              <div className="location-badge" onClick={handleLocationClick} title="Clique para redefinir coordenadas cósmicas de entrega" style={{ cursor: 'pointer' }}>
                <MapPin size={16} />
                <span>{displayLocation}</span>
              </div>
            </div>
          </div>
          <div className="product-carousel" style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '24px', marginBottom: '16px' }}>
            {products.filter(p => settings.row1ProductIds.includes(p.id)).map(p => renderProductCard(p, true))}
          </div>

          {/* 3 IMAGE BANNERS GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
            {[
              { img: settings.gridImages.image1, link: settings.gridImages.link1 },
              { img: settings.gridImages.image2, link: settings.gridImages.link2 },
              { img: settings.gridImages.image3, link: settings.gridImages.link3 }
            ].map((banner, idx: number) => (
              <a 
                key={idx} 
                href={banner.link || '#'} 
                target={banner.link?.startsWith('http') ? '_blank' : '_self'}
                rel={banner.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={{ 
                  display: 'block', 
                  borderRadius: 'var(--radius-md)', 
                  overflow: 'hidden', 
                  height: '200px', 
                  backgroundColor: 'var(--color-bg-card)', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  cursor: banner.link ? 'pointer' : 'default',
                  textDecoration: 'none'
                }}
              >
                <img src={banner.img} alt={`Banner ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x200/171717/45e627?text=Banner+Img'; }} />
              </a>
            ))}
          </div>

          {/* ROW 2 */}
          <h2 className="section-title" style={{ marginBottom: '24px' }}>{settings.row2Title}</h2>
          <div className="product-carousel" style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '24px', marginBottom: '16px' }}>
            {products.filter(p => settings.row2ProductIds.includes(p.id)).map(p => renderProductCard(p, true))}
          </div>

          {/* BRANDS ROW */}
          <h2 className="section-title" style={{ marginBottom: '24px' }}>Marcas</h2>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '32px', scrollbarWidth: 'none' }}>
            {currentBrands.map((b: Brand) => (
              <div 
                key={b.id} 
                onClick={() => onSelectCategoryClick && onSelectCategoryClick('marcas')}
                style={{ 
                  flex: '0 0 120px', 
                  height: '80px', 
                  backgroundColor: 'var(--color-bg-card)', 
                  borderRadius: 'var(--radius-md)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  border: '1px solid rgba(255,255,255,0.05)', 
                  padding: '16px',
                  cursor: 'pointer'
                }}
              >
                 {b.imageUrl ? <img src={b.imageUrl} alt={b.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'grayscale(100%) brightness(200%)' }} /> : <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{b.name}</span>}
              </div>
            ))}
          </div>

          {/* ROW 3 */}
          <h2 className="section-title" style={{ marginBottom: '24px' }}>{settings.row3Title}</h2>
          <div className="product-carousel" style={{ display: 'flex', gap: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory', paddingBottom: '24px', marginBottom: '16px' }}>
            {products.filter(p => settings.row3ProductIds.includes(p.id)).map(p => renderProductCard(p, true))}
          </div>
          
        </>

      {/* REDESIGNED GIFT CARDS SECTION (2 COLUMNS) */}
      <div className="gift-cards-section-container" style={{ marginBottom: '64px' }}>
        {/* Column 1: Info & Promotional Text */}
        <div className="gift-cards-promo-box">
          {/* Subtle neon accent */}
          <div style={{
            position: 'absolute', top: '-50px', left: '-50px', width: '150px', height: '150px',
            background: 'radial-gradient(circle, rgba(69, 230, 39, 0.2) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '42px', height: '42px', backgroundColor: 'rgba(69, 230, 39, 0.1)', border: '1px solid var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Gift size={22} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '2px', color: 'var(--color-primary)', textTransform: 'uppercase' }}>Canal de Telepatia</span>
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900, lineHeight: 1.2, marginBottom: '16px' }}>GIFT CARDS IMEDIATOS</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '24px' }}>
            Entrega digital instantânea via canal de telepatia criptografada direto na sua caixa de e-mail ou painel cósmico. Steam, Xbox, Netflix, Spotify e muito mais sem taxas de dobra espacial!
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', flex: 1 }}>
              <div style={{ fontWeight: 800, color: '#45e627', fontSize: '1.1rem' }}>⚡ 0s</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Tempo de Entrega</div>
            </div>
            <div style={{ padding: '12px 18px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', flex: 1 }}>
              <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.1rem' }}>💸 0%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Taxa de Serviço</div>
            </div>
          </div>
        </div>

        {/* Column 2: Horizontal Carousel with Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Mini Horizontal Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-white)' }}>Catálogo Expresso</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['all', 'games', 'apps'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setGiftCardFilter(filter)}
                  style={{
                    padding: '6px 14px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid',
                    borderColor: giftCardFilter === filter ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)',
                    backgroundColor: giftCardFilter === filter ? 'rgba(69,230,39,0.1)' : 'transparent',
                    color: giftCardFilter === filter ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    transition: 'all 0.2s'
                  }}
                >
                  {filter === 'all' ? 'Todos' : filter === 'games' ? 'Games' : 'Apps'}
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal Product Carousel */}
          <div 
            className="product-carousel" 
            style={{ 
              display: 'flex', 
              gap: '20px', 
              overflowX: 'auto', 
              scrollSnapType: 'x mandatory', 
              paddingBottom: '16px',
              minHeight: '260px'
            }}
          >
            {products
              .filter(p => {
                if (p.category !== 'giftcard') return false;
                if (giftCardFilter === 'games') return p.id.includes('steam') || p.id.includes('xbox');
                if (giftCardFilter === 'apps') return p.id.includes('spotify') || p.id.includes('netflix');
                return true;
              })
              .map(p => renderProductCard(p, true))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS CAROUSEL */}
      <div style={{ margin: '48px 0' }}>
        <h2 className="section-title" style={{ marginBottom: '24px' }}>Depoimentos Interestelares</h2>
        <div 
          style={{ 
            display: 'flex', gap: '20px', overflowX: 'auto', scrollSnapType: 'x mandatory',
            paddingBottom: '16px', scrollbarWidth: 'none', cursor: 'grab'
          }}
        >
          {currentTestimonials.map((t: Testimonial) => (
            <div key={t.id} style={{ 
              flex: '0 0 320px', maxWidth: '85vw', scrollSnapAlign: 'start',
              backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)', 
              border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden',
              display: 'flex', flexDirection: 'column'
            }}>
              {/* Product/Review Image */}
              {t.productImage && (
                <div style={{ width: '100%', height: '200px', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                  <img 
                    src={t.productImage} 
                    alt={`Avaliação de ${t.authorName}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
              )}

              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                {/* Stars */}
                <div style={{ display: 'flex', gap: '3px', color: 'var(--color-warning)', marginBottom: '12px', fontSize: '1rem' }}>
                  {Array.from({length: t.rating}).map((_, i) => <span key={i}>★</span>)}
                  {Array.from({length: 5 - t.rating}).map((_, i) => <span key={`e-${i}`} style={{ opacity: 0.2 }}>★</span>)}
                </div>

                {/* Review text */}
                <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '0.88rem', marginBottom: '16px', lineHeight: 1.5, flex: 1 }}>
                  "{t.content}"
                </p>

                {/* Author info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden',
                    backgroundColor: 'rgba(69,230,39,0.1)', border: '2px solid rgba(69,230,39,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 
                  }}>
                    {t.authorImage 
                      ? <img src={t.authorImage} alt={t.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> 
                      : '👽'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{t.authorName}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)' }}>{t.date}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>



    </div>
  );
};

export default HomeView;
