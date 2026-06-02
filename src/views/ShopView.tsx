import React, { useState, useMemo } from 'react';
import { Product, Category } from '../types';
import { Heart, Search, Filter, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { ProductImage } from './HomeView';

interface ShopViewProps {
  products: Product[];
  categories: Category[];
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
  initialCategory?: string | null;
  onClearInitialCategory?: () => void;
}

const ShopView: React.FC<ShopViewProps> = ({
  products,
  categories,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  initialCategory,
  onClearInitialCategory
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategory ? [initialCategory] : []);
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<'recent' | 'price_asc' | 'price_desc' | 'name_asc'>('recent');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Toggle category
  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev => 
      prev.includes(slug) ? prev.filter(c => c !== slug) : [...prev, slug]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setPriceRange({ min: '', max: '' });
    setSortBy('recent');
    if (onClearInitialCategory) onClearInitialCategory();
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    // Price range filter
    const min = parseFloat(priceRange.min);
    const max = parseFloat(priceRange.max);
    
    if (!isNaN(min)) {
      result = result.filter(p => p.price >= min);
    }
    if (!isNaN(max)) {
      result = result.filter(p => p.price <= max);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'recent':
        default:
          // Simulate recent by using isNew flag or just keeping default order
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
      }
    });

    return result;
  }, [products, searchQuery, selectedCategories, priceRange, sortBy]);

  return (
    <div className="view-container animate-fade-in">
      <div className="shop-header" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="section-title" style={{ margin: 0 }}>Catálogo Intergaláctico</h2>
        <button 
          className="outline-btn mobile-filter-btn" 
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          style={{ display: 'none' }} // We will handle this with CSS
        >
          <Filter size={16} /> Filtros
        </button>
      </div>

      <div className="shop-layout" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className={`shop-sidebar glass-panel ${isMobileFiltersOpen ? 'open' : ''}`}>
          <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <SlidersHorizontal size={18} className="neon-text" /> Filtros
            </h3>
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-display)' }}>Limpar Tudo</button>
          </div>

          <div className="filter-group">
            <h4 className="filter-title">Busca</h4>
            <div className="cyber-input-wrapper" style={{ marginTop: '12px' }}>
              <input
                type="text"
                className="cyber-input"
                style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                placeholder="Ex: Mouse alien..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="cyber-input-btn" style={{ width: '32px', height: '32px', right: '6px' }}>
                <Search size={14} />
              </div>
            </div>
          </div>

          <div className="filter-group" style={{ marginTop: '24px' }}>
            <h4 className="filter-title">Categorias</h4>
            <div className="filter-options" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
              {categories.map(cat => (
                <label key={cat.id} className="filter-checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--color-text-muted)', transition: 'color 0.2s' }}>
                  <div className="custom-checkbox-wrapper" style={{ position: 'relative', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <input 
                      type="checkbox" 
                      checked={selectedCategories.includes(cat.slug)}
                      onChange={() => toggleCategory(cat.slug)}
                      style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer', zIndex: 2 }}
                    />
                    <div className={`checkbox-bg ${selectedCategories.includes(cat.slug) ? 'checked' : ''}`} style={{ position: 'absolute', width: '100%', height: '100%', border: '1.5px solid var(--color-primary)', borderRadius: '4px', background: selectedCategories.includes(cat.slug) ? 'var(--color-primary)' : 'transparent', transition: 'all 0.2s' }}></div>
                    {selectedCategories.includes(cat.slug) && <Check size={12} color="#000" style={{ position: 'relative', zIndex: 1 }} />}
                  </div>
                  <span style={{ color: selectedCategories.includes(cat.slug) ? '#fff' : 'inherit' }}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group" style={{ marginTop: '24px' }}>
            <h4 className="filter-title">Preço (R$)</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '12px' }}>
              <input 
                type="number" 
                className="cyber-input" 
                placeholder="Min" 
                value={priceRange.min}
                onChange={e => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              />
              <span style={{ color: 'var(--color-text-muted)' }}>-</span>
              <input 
                type="number" 
                className="cyber-input" 
                placeholder="Max" 
                value={priceRange.max}
                onChange={e => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                style={{ padding: '8px 12px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

        </aside>

        {/* RIGHT CONTENT: PRODUCT GRID & SORTING */}
        <div className="shop-content" style={{ flex: 1 }}>
          <div className="shop-controls-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', background: 'var(--color-bg-input)', padding: '12px 20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="results-count" style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Mostrando <strong style={{ color: '#fff' }}>{filteredProducts.length}</strong> periféricos alienígenas
            </div>
            
            <div className="sort-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-display)' }}>ORDENAR POR:</span>
              <div className="cyber-select-box" style={{ position: 'relative' }}>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="cyber-select"
                  style={{ appearance: 'none', background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '8px 32px 8px 16px', borderRadius: 'var(--radius-full)', fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="recent">MAIS RECENTES</option>
                  <option value="price_asc">MENOR PREÇO</option>
                  <option value="price_desc">MAIOR PREÇO</option>
                  <option value="name_asc">NOME (A-Z)</option>
                </select>
                <ChevronDown size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-primary)', pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product) => {
                const isFav = favorites.includes(product.id);
                // Determine image category code
                let imageCode = product.image;
                if (product.id === 'prod-orelha-gato') {
                  imageCode = 'cat-headphones';
                }
                
                // Map aesthetic color styles
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
                  <div key={product.id} className="product-card">
                    {/* Product Badges */}
                    <div className="product-card-badges">
                      {product.discount && (
                        <span className="badge-warning">-{product.discount}%</span>
                      )}
                      {product.isNew && (
                        <span className="badge-neon">NOVO</span>
                      )}
                    </div>

                    {/* Favorite Toggle */}
                    <button
                      className={`favorite-card-btn ${isFav ? 'favorited' : ''}`}
                      onClick={() => onToggleFavorite(product.id)}
                      title={isFav ? 'Remover dos Favoritos' : 'Favoritar produto'}
                    >
                      <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                    </button>

                    {/* Product Visual */}
                    <div className="product-image-frame" style={{ cursor: 'pointer' }} onClick={() => onSelectProduct(product.id)}>
                      <ProductImage type={imageCode} colorStyle={aestheticColor} />
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                      <h3 className="product-title" style={{ cursor: 'pointer' }} onClick={() => onSelectProduct(product.id)}>{product.name}</h3>
                      <p className="product-desc" style={{ cursor: 'pointer', WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }} onClick={() => onSelectProduct(product.id)}>{product.description}</p>
                      
                      <div className="product-pricing">
                        <div className="product-price-row">
                          <span className="product-price">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </span>
                          {product.oldPrice && (
                            <span className="product-old-price">
                              R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                            </span>
                          )}
                        </div>
                        <div className="pix-discount-badge">
                          <span className="pix-badge-icon">⚡</span>
                          <span>PIX com <strong>5% OFF</strong> = R$ {(product.price * 0.95).toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          💳 Em até <strong style={{ color: '#fff' }}>12x</strong> de <strong style={{ color: '#fff' }}>R$ {(product.price / 12).toFixed(2).replace('.', ',')}</strong>
                        </div>
                      </div>

                      <button
                        className="outline-btn product-add-btn"
                        onClick={() => onAddToCart(product)}
                      >
                        ADICIONAR
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 24px',
              backgroundColor: 'var(--color-bg-card)',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{ fontSize: '3rem', filter: 'grayscale(1)', opacity: 0.5 }}>🛸</span>
              <h3 style={{ marginTop: '16px', color: '#fff' }}>Nenhum sinal detectado</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>
                Sua busca não retornou artefatos alienígenas. Tente ajustar os filtros ou redefina sua busca.
              </p>
              <button 
                onClick={clearFilters} 
                className="neon-glow-btn" 
                style={{ marginTop: '24px', padding: '10px 24px', margin: '24px auto 0' }}
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopView;
