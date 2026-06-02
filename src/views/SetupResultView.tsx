import React from 'react';
import { SetupResult, Product } from '../types';
import { ShoppingCart, ExternalLink, RotateCcw, Compass, Star, Zap, Shield, ChevronRight } from 'lucide-react';

interface SetupResultViewProps {
  result: SetupResult;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  onRetakeQuiz: () => void;
  onGoToShop: () => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const SetupResultView: React.FC<SetupResultViewProps> = ({
  result,
  onAddToCart,
  onSelectProduct,
  onRetakeQuiz,
  onGoToShop,
  addToast
}) => {
  const topProducts = result.products.filter(sp => sp.score > 0).slice(0, 8);
  const secondaryProducts = result.products.filter(sp => sp.score > 0).slice(8, 14);
  const totalSetupPrice = topProducts.reduce((sum, sp) => sum + sp.product.price, 0);

  const getScoreColor = (score: number) => {
    if (score >= 70) return '#45e627';
    if (score >= 40) return '#f0c040';
    return '#a78bfa'; // Changed from red to purple as requested
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Match Perfeito';
    if (score >= 40) return 'Boa Opção';
    return 'Opção Válida';
  };

  const handleAddToCart = (product: Product) => {
    if (product.type === 'afiliado' && product.affiliateLink) {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
      return;
    }
    onAddToCart(product);
    addToast(`${product.name} adicionado ao carrinho! 🛒`, 'success');
  };

  return (
    <div className="setup-result-container">
      {/* Hero Section */}
      <div className="setup-result-hero">
        <div className="setup-result-hero-bg" />
        <div className="setup-result-hero-content">
          <div className="setup-result-badge">
            <Shield size={14} />
            <span>{result.classification}</span>
          </div>
          <h1 className="setup-result-title">{result.name}</h1>
          <p className="setup-result-subtitle">{result.subtitle}</p>

          <div className="setup-result-tags">
            <span className="setup-result-tag">
              <Zap size={13} /> {result.visualStyle}
            </span>
            <span className="setup-result-tag">
              <Star size={13} /> {result.priority}
            </span>
            <span className="setup-result-tag">
              💰 {result.budgetLabel}
            </span>
          </div>

          {topProducts.length > 0 && (
            <div className="setup-result-total">
              <span className="setup-result-total-label">Valor estimado do setup:</span>
              <span className="setup-result-total-price">
                R$ {totalSetupPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
          )}
        </div>

        {/* Character comment */}
        <div className="setup-character-bubble">
          <div className="setup-character-avatar">
            {result.characterComment.character.avatar}
          </div>
          <div className="setup-character-speech">
            <span className="setup-character-name">{result.characterComment.character.name}</span>
            <p className="setup-character-text">"{result.characterComment.text}"</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {topProducts.length > 0 ? (
        <section className="setup-result-section">
          <h2 className="setup-result-section-title">
            <Zap size={20} />
            Produtos Recomendados para Você
          </h2>
          <div className="setup-result-products-list">
            {topProducts.map((sp, idx) => {
              const p = sp.product;
              const isAffiliate = p.type === 'afiliado';
              return (
                <div key={p.id} className={`setup-product-card-ranked ${idx === 0 ? 'top-pick' : ''}`} style={{ animationDelay: `${idx * 0.08}s` }}>
                  
                  {/* Rank Indicator */}
                  <div className="setup-product-rank-badge">
                    <span>#{idx + 1}</span>
                    <small>{idx === 0 ? 'Escolha Ideal' : 'Excelente Opção'}</small>
                  </div>

                  {/* Left Side: Image */}
                  <div className="setup-product-image" onClick={() => onSelectProduct(p.id)}>
                    <div className="setup-product-image-placeholder">
                      {p.image === 'headset' ? '🎧' :
                       p.image === 'console' ? '🎮' :
                       p.image === 'cat-headphones' ? '🐱🎧' :
                       p.image === 'keyboard' ? '⌨️' :
                       p.image === 'mouse' ? '🖱️' :
                       p.image === 'antenna' ? '📡' :
                       p.image === 'vr-headset' ? '🥽' :
                       p.image === 'steam' ? '🎮' :
                       p.image === 'audio' ? '🎵' :
                       p.image?.startsWith('http') ? '' : '📦'}
                    </div>
                    {p.image?.startsWith('http') && (
                      <img src={p.image} alt={p.name} className="setup-product-img-real" />
                    )}
                    
                    {/* Affiliate / New badges over image */}
                    <div className="setup-product-badges">
                      {p.isNew && <span className="badge badge-new">NOVO</span>}
                      {p.discount && p.discount > 0 && <span className="badge badge-discount-purple">-{p.discount}%</span>}
                    </div>
                  </div>

                  {/* Right Side: Info */}
                  <div className="setup-product-info">
                    {isAffiliate && (
                      <div className="affiliate-badge" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
                        <ExternalLink size={11} />
                        Parceiro Oficial
                      </div>
                    )}
                    
                    <h3 className="setup-product-name" onClick={() => onSelectProduct(p.id)}>{p.name}</h3>

                    {/* Match Score & Reasons */}
                    <div className="setup-product-match-area">
                      <div className="setup-product-score" style={{ '--score-color': getScoreColor(sp.score) } as any}>
                        <div className="setup-product-score-bar" style={{ width: `${Math.min(sp.score, 100)}%`, backgroundColor: getScoreColor(sp.score) }} />
                        <span className="setup-product-score-label">{getScoreLabel(sp.score)}</span>
                        <span className="setup-product-score-value">{sp.score}pts</span>
                      </div>
                      
                      <div className="setup-product-reasons">
                        {sp.matchReasons.slice(0, 3).map((reason, i) => (
                          <span key={i} className="setup-product-reason">✓ {reason}</span>
                        ))}
                      </div>
                    </div>

                    <div className="setup-product-footer">
                      {/* Price */}
                      <div className="setup-product-price-row">
                        {p.oldPrice && (
                          <span className="setup-product-old-price">
                            R$ {p.oldPrice.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                        <span className="setup-product-price">
                          R$ {p.price.toFixed(2).replace('.', ',')}
                        </span>
                      </div>

                      {/* Action button */}
                      <div className="setup-product-action-wrapper">
                        {isAffiliate ? (
                          <button
                            className="setup-product-btn setup-product-btn-affiliate"
                            onClick={() => handleAddToCart(p)}
                          >
                            <ExternalLink size={15} />
                            Ver no parceiro
                          </button>
                        ) : (
                          <button
                            className="setup-product-btn setup-product-btn-buy"
                            onClick={() => handleAddToCart(p)}
                          >
                            <ShoppingCart size={15} />
                            Adicionar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="setup-result-section">
          <div className="setup-result-empty">
            <span style={{ fontSize: '3rem' }}>🔭</span>
            <h3>Nenhum produto encontrado para esse perfil</h3>
            <p>Tente ajustar suas preferências ou explore nossa loja completa.</p>
          </div>
        </section>
      )}

      {/* Secondary recommendations */}
      {secondaryProducts.length > 0 && (
        <section className="setup-result-section">
          <h2 className="setup-result-section-title">
            <Compass size={20} />
            Também combina com seu setup
          </h2>
          <div className="setup-result-secondary-grid">
            {secondaryProducts.map((sp) => {
              const p = sp.product;
              return (
                <div key={p.id} className="setup-secondary-card" onClick={() => onSelectProduct(p.id)}>
                  <div className="setup-secondary-icon">
                    {p.image === 'headset' ? '🎧' :
                     p.image === 'console' ? '🎮' :
                     p.image === 'keyboard' ? '⌨️' :
                     p.image === 'mouse' ? '🖱️' :
                     p.image === 'antenna' ? '📡' : '📦'}
                  </div>
                  <div className="setup-secondary-info">
                    <span className="setup-secondary-name">{p.name}</span>
                    <span className="setup-secondary-price">R$ {p.price.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <ChevronRight size={16} className="setup-secondary-arrow" />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom Actions */}
      <div className="setup-result-actions">
        <button className="setup-result-action-btn setup-retake" onClick={onRetakeQuiz}>
          <RotateCcw size={18} />
          Refazer Quiz
        </button>
        <button className="setup-result-action-btn setup-explore" onClick={onGoToShop}>
          <Compass size={18} />
          Explorar Loja Completa
        </button>
      </div>
    </div>
  );
};

export default SetupResultView;
