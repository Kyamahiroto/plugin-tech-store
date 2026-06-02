import React from 'react';
import { Product } from '../types';
import { Trash2, ShoppingCart, Heart, Star, Smile } from 'lucide-react';
import { ProductImage } from './HomeView';

interface FavoritesViewProps {
  products: Product[];
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
  setCurrentView: (view: string) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({
  products,
  favorites,
  onToggleFavorite,
  onAddToCart,
  addToast,
  setCurrentView
}) => {
  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  if (favoriteProducts.length === 0) {
    return (
      <div className="view-container animate-fade-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="cyber-render" style={{ width: '120px', height: '120px', margin: '0 auto 20px auto', color: 'var(--color-primary)' }}>
          <div className="cyber-render-halo" style={{ width: '130px', height: '80px' }} />
          <Heart size={44} strokeWidth={1.5} className="animate-blink" />
        </div>
        <h2 className="neon-text" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Lista de Desejos Vazia</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '460px', margin: '0 auto 24px auto', fontSize: '0.9rem' }}>
          Você ainda não sintonizou nenhum item favorito. Explore o nosso catálogo alienígena e marque com um coração aquilo que você deseja abduzir primeiro.
        </p>
        <button
          className="neon-glow-btn"
          style={{ padding: '12px 28px', margin: '0 auto' }}
          onClick={() => setCurrentView('home')}
        >
          EXPLORAR PROMOÇÕES
        </button>
      </div>
    );
  }

  return (
    <div className="view-container animate-fade-in">
      <h2 className="section-title" style={{ marginBottom: '24px' }}>Meus Favoritos Interestelares</h2>
      
      <div className="product-grid">
        {favoriteProducts.map((product) => {
          let imageCode = product.image;
          if (product.id === 'prod-orelha-gato') {
            imageCode = 'cat-headphones';
          }
          
          return (
            <div key={product.id} className="product-card" style={{ paddingBottom: '12px' }}>
              {/* Product Card Badges */}
              <div className="product-card-badges">
                {product.discount && (
                  <span className="badge-warning">-{product.discount}%</span>
                )}
                {product.isNew && (
                  <span className="badge-neon">NOVO</span>
                )}
              </div>

              {/* Remove button */}
              <button
                className="favorite-card-btn favorited"
                onClick={() => {
                  onToggleFavorite(product.id);
                  addToast(`Removido dos favoritos! 💔`, 'error');
                }}
                title="Remover dos Favoritos"
                style={{ top: '12px', right: '12px' }}
              >
                <Trash2 size={16} />
              </button>

              {/* Product Visual */}
              <div className="product-image-frame">
                <ProductImage type={imageCode} colorStyle={product.category === 'teclados' ? 'blue' : 'green'} />
              </div>

              {/* Info */}
              <div className="product-info" style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <h3 className="product-title" style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{product.name}</h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                  <span className="badge-neon" style={{ fontSize: '0.6rem', padding: '2px 6px' }}>{product.category}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>Membro Galáctico</span>
                </div>

                <div className="product-pricing" style={{ marginBottom: '10px' }}>
                  <div className="product-price-row">
                    <span className="product-price">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    {product.oldPrice && (
                      <span className="product-old-price" style={{ fontSize: '0.75rem' }}>
                        R$ {product.oldPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Comical review teaser */}
                {product.funnyReview && (
                  <div style={{
                    backgroundColor: 'var(--color-bg-input)',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '0.72rem',
                    lineHeight: '1.3',
                    borderLeft: '2px solid var(--color-primary)',
                    marginBottom: '14px',
                    fontStyle: 'italic',
                    color: 'var(--color-text-muted)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: '700', fontStyle: 'normal', marginBottom: '2px' }}>
                      <Smile size={10} />
                      <span>{product.funnyReview.author}</span>
                      <div style={{ display: 'flex', marginLeft: 'auto' }}>
                        {[...Array(product.funnyReview.rating)].map((_, i) => (
                          <Star key={i} size={8} fill="var(--color-primary)" stroke="none" />
                        ))}
                      </div>
                    </div>
                    "{product.funnyReview.text}"
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  <button
                    className="neon-glow-btn"
                    style={{ flex: 1, padding: '10px 14px', fontSize: '0.72rem', borderRadius: 'var(--radius-md)' }}
                    onClick={() => onAddToCart(product)}
                  >
                    <ShoppingCart size={14} />
                    ABDUZIR
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesView;
