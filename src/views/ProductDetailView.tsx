import React, { useState, useEffect, useRef } from 'react';
import { Heart, Truck, Star, Zap, Play, ChevronLeft, X, CreditCard } from 'lucide-react';
import { Product, PaymentSettings, UserProfile, ProductReview } from '../types';
import { ProductImage } from './HomeView';
import DOMPurify from 'dompurify';

interface ProductDetailViewProps {
  productId: string;
  products: Product[];
  favorites: string[];
  onToggleFavorite: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
  setCurrentView: (view: string) => void;
  paymentSettings?: PaymentSettings;
  userProfile?: UserProfile;
  onOpenAddressModal?: () => void;
  reviews?: ProductReview[];
  onAddReview?: (r: ProductReview) => void;
}

// Alien funny phrases
const alienPhrases = [
  "Olha que legal! 👽",
  "Isso é do outro mundo! 🛸",
  "Essa tech alienígena tá demais! 🔥",
  "Comprei 3 pro meu planeta! 🌍",
  "Nem na Área 51 tem isso! 🛸",
  "Tecnologia de primeiro mundo! ✨",
  "Meu radar detectou qualidade! 📡",
  "Abdução de preço baixo! 💰",
  "Provado e aprovado por aliens! 👾",
  "Na minha galáxia isso custa o dobro! 🌌"
];

const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productId,
  products,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onSelectProduct,
  addToast,
  setCurrentView,
  paymentSettings,
  userProfile,
  onOpenAddressModal,
  reviews = [],
  onAddReview
}) => {
  const [addonChecked, setAddonChecked] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);
  const [showInstallments, setShowInstallments] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, content: '' });
  const [alienPhrase, setAlienPhrase] = useState(alienPhrases[0]);
  const alienRef = useRef<HTMLDivElement>(null);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImage(null);
    setSelectedVariationId(null);
  }, [productId]);

  // Rotate alien phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setAlienPhrase(alienPhrases[Math.floor(Math.random() * alienPhrases.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="view-container animate-fade-in" style={{ textAlign: 'center', padding: '60px 24px' }}>
        <h3 className="neon-text">Produto Abduzido por Forças Ocultas!</h3>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
          Este ID de produto se dissipou na poeira cósmica ou foi comprado por habitantes de Alfa Centauri.
        </p>
        <button 
          className="neon-glow-btn" 
          style={{ marginTop: '24px', padding: '12px 24px' }}
          onClick={() => setCurrentView('home')}
        >
          Voltar à Loja
        </button>
      </div>
    );
  }

  const isFav = favorites.includes(product.id);
  const activeVariation = product.variations?.find(v => v.id === selectedVariationId);
  const currentPrice = activeVariation?.price ?? product.price;

  // Payment settings
  const maxInstallments = paymentSettings?.maxInstallments || 12;
  const installmentMinValue = paymentSettings?.installmentMinValue || 10;

  // Calculate max installments for this product
  const calcMaxInstallments = (price: number) => {
    let n = maxInstallments;
    while (n > 1 && price / n < installmentMinValue) n--;
    return n;
  };

  const productMaxInstallments = calcMaxInstallments(currentPrice);

  // Cross-sell mousepad setup
  const addonMousepad: Product = {
    id: 'prod-mousepad-addon',
    name: 'Mousepad Galáctico XL',
    description: 'Tecido de microfibra cósmica com bordas costuradas e LED verde.',
    price: 44.85,
    oldPrice: 110.00,
    image: 'mouse',
    category: 'acessorios',
    stock: 99
  };

  const handleBuyNow = () => {
    onAddToCart(product);
    if (addonChecked) {
      onAddToCart(addonMousepad);
      addToast('Mousepad Galáctico XL adicionado ao combo! 🌌⚡', 'success');
    }
    addToast(`${product.name} adicionado ao carrinho! Teletransportando... 🛒⚡`, 'success');
    setCurrentView('cart');
  };

  // Real specs (no fallback)
  const productSpecs = product.specs ? Object.entries(product.specs) : [];

  // Check if gallery has real items
  const hasGallery = product.gallery && product.gallery.length > 0;
  const hasVideo = !!product.videoUrl;

  // Get YouTube embed URL
  const getYouTubeEmbed = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  // Recommendations logic
  const recommendations = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="view-container animate-fade-in product-detail-page" style={{ paddingBottom: '80px' }}>
      
      {/* Back button header */}
      <div className="detail-back-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setCurrentView('home')}
          className="auth-back-btn" 
          style={{ width: 'auto', display: 'flex', gap: '8px', padding: '8px 16px', background: 'rgba(255, 255, 255, 0.03)' }}
        >
          <ChevronLeft size={18} /> Voltar à Loja
        </button>
      </div>

      <div className="product-detail-layout">
        
        {/* LEFT COLUMN: Media Gallery */}
        <div className="product-media-gallery">
          <div className="main-display-frame glass-panel">
            <span className="limited-offer-badge">OFERTA LIMITADA</span>
            
            <button
              className={`favorite-card-btn detail-fav-btn ${isFav ? 'favorited' : ''}`}
              onClick={() => onToggleFavorite(product.id)}
              title={isFav ? 'Remover dos favoritos' : 'Favoritar'}
            >
              <Heart size={22} fill={isFav ? 'currentColor' : 'none'} />
            </button>

            <div className="main-image-viewport">
              <ProductImage type={selectedImage || (product.id === 'prod-orelha-gato' ? 'cat-headphones' : product.image)} colorStyle={product.category === 'teclados' ? 'blue' : product.category === 'games' ? 'orange' : 'green'} />
            </div>
          </div>

          {/* Thumbnail strip — only if gallery or video exists */}
          {(hasGallery || hasVideo) && (
            <div className="thumbnail-gallery-row">
              <div className={`thumbnail-box ${!selectedImage ? 'active' : ''}`} onClick={() => setSelectedImage(null)}>
                <ProductImage type={product.image} colorStyle="green" />
              </div>
              {hasGallery && product.gallery!.map((imgUrl, idx) => (
                <div key={idx} className={`thumbnail-box ${selectedImage === imgUrl ? 'active' : ''}`} onClick={() => setSelectedImage(imgUrl)}>
                  <ProductImage type={imgUrl} colorStyle="green" />
                </div>
              ))}
              {hasVideo && (
                <div className="thumbnail-box play-thumbnail" onClick={() => setShowVideoModal(true)}>
                  <div className="play-icon-circle">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Info & Buy */}
        <div className="product-detail-info">
          
          <div className="product-category-brand">
            ALIEN SERIES // PRO
          </div>

          <h1 className="product-detail-title">{product.name}</h1>
          {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
            <div style={{ background: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', padding: '6px 12px', borderRadius: '4px', display: 'inline-block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '16px', border: '1px solid rgba(167, 139, 250, 0.3)' }}>
              ⚠️ ÚLTIMAS PEÇAS (Restam apenas {product.stock} no estoque)
            </div>
          )}

          {/* Star review bar */}
          <div className="detail-rating-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <div className="stars-wrapper" style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map(i => {
                const approvedReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');
                const avgRating = approvedReviews.length > 0 
                  ? approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length 
                  : 0;
                
                return (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={avgRating >= i ? 'var(--color-primary)' : 'none'} 
                    color={avgRating >= i ? 'var(--color-primary)' : 'rgba(255,255,255,0.3)'} 
                  />
                );
              })}
            </div>
            <span className="rating-count" style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              ({reviews.filter(r => r.productId === product.id && r.status === 'approved').length} avaliações)
            </span>
          </div>

          {/* Variations selector */}
          {product.variations && product.variations.length > 0 && (
            <div className="product-variations-box" style={{ marginBottom: '24px' }}>
              <h4 style={{ color: 'var(--color-primary)', fontSize: '0.9rem', marginBottom: '12px' }}>Selecione a Variação:</h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {product.variations.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariationId(v.id);
                      if (v.image) setSelectedImage(v.image);
                    }}
                    className={`variation-btn ${selectedVariationId === v.id ? 'active' : ''}`}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedVariationId === v.id ? 'rgba(69,230,39,0.1)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${selectedVariationId === v.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
                      color: selectedVariationId === v.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Price display section */}
          <div className="detail-pricing-box">
            {product.oldPrice && (
              <div className="detail-old-price">
                R$ {product.oldPrice.toFixed(2).replace('.', ',')}
              </div>
            )}
            <div className="detail-current-price-row">
              <span className="detail-current-price">
                R$ {currentPrice.toFixed(2).replace('.', ',')}
              </span>
              {product.discount && (
                <span className="detail-discount-badge">{product.discount}% OFF</span>
              )}
            </div>
            <div className="detail-installments">
              ou {productMaxInstallments}x de R$ {(currentPrice / productMaxInstallments).toFixed(2).replace('.', ',')} sem juros
            </div>
            <button
              onClick={() => setShowInstallments(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-primary)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                textDecoration: 'underline',
                padding: '4px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <CreditCard size={14} /> Ver todas as parcelas
            </button>
            <div className="detail-pix-line">
              <span>⚡</span>
              <span>No PIX: <strong style={{ color: 'var(--color-primary)' }}>R$ {(currentPrice * 0.95).toFixed(2).replace('.', ',')}</strong> <small>(5% de desconto)</small></span>
            </div>
          </div>

          {/* Payment & Shipping Badges */}
          <div className="payment-shipping-grid">
            <div className="payment-badge">
              <span className="badge-icon">💳</span>
              <span>PIX / Cartão</span>
            </div>
            <div className="payment-badge">
              <span className="badge-icon">🔒</span>
              <span>Compra Segura</span>
            </div>
            <div className="payment-badge">
              <span className="badge-icon">🔄</span>
              <span>Devolução Grátis</span>
            </div>
          </div>

          {/* Shipping Delivery Box */}
          <div className="shipping-delivery-box" style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Truck size={18} color="var(--color-primary)" />
              <strong style={{ fontSize: '0.95rem' }}>Opções de Entrega</strong>
            </div>
            {!userProfile?.address ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Calcule o prazo de entrega para sua região.</span>
                <button 
                  onClick={() => {
                    if (onOpenAddressModal) {
                      onOpenAddressModal();
                    } else {
                      window.scrollTo(0, 0);
                    }
                  }}
                  style={{ background: 'var(--color-primary)', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Sintonizar Endereço
                </button>
              </div>
            ) : (
              <div style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', borderLeft: '3px solid var(--color-primary)' }}>
                {product.shippingType === 'national' ? (
                  <>
                    <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>🚀 Estoque nacional</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Receba entre <strong>2 e 5 dias úteis</strong> no endereço: <br/><small style={{opacity:0.7}}>{userProfile.address}</small></div>
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>📦 Entrega estimada</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Receba em <strong>7 a 12 dias úteis</strong> no endereço: <br/><small style={{opacity:0.7}}>{userProfile.address}</small></div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Up-sell Offer Checkbox */}
          <div className="cross-sell-addon-box">
            <label className="cross-sell-label">
              <div className="addon-img-frame">
                <ProductImage type="mouse" colorStyle="green" />
              </div>
              <div className="addon-details">
                <span className="addon-title">Leve também o Mousepad Galáctico XL</span>
                <span className="addon-price">+ R$ 44,85 <small>(60% de desconto)</small></span>
              </div>
              <div className="addon-checkbox-wrapper">
                <input 
                  type="checkbox" 
                  checked={addonChecked} 
                  onChange={(e) => setAddonChecked(e.target.checked)} 
                  className="addon-checkbox"
                />
                <span className="custom-checkbox"></span>
              </div>
            </label>
          </div>

          {/* CTA Buy Button */}
          <button 
            onClick={handleBuyNow}
            className="neon-glow-btn buy-now-huge-btn"
          >
            <Zap size={20} fill="currentColor" /> COMPRAR AGORA
          </button>

          {/* Specifications — only if real specs exist */}
          {productSpecs.length > 0 && (
            <div className="specifications-container">
              <h3 className="specs-title-accent">Especificações</h3>
              
              <ul className="specs-bullets-list">
                {productSpecs.map(([key, val], idx) => {
                  let bulletIcon = '📺';
                  if (key.toLowerCase().includes('luz') || key.toLowerCase().includes('iluminação')) bulletIcon = '💡';
                  if (key.toLowerCase().includes('design') || key.toLowerCase().includes('ergonomia')) bulletIcon = '🏃';
                  if (key.toLowerCase().includes('microfone') || key.toLowerCase().includes('audio')) bulletIcon = '🎤';
                  if (key.toLowerCase().includes('conexão') || key.toLowerCase().includes('bluetooth')) bulletIcon = '📡';
                  if (key.toLowerCase().includes('bateria') || key.toLowerCase().includes('autonomia')) bulletIcon = '🔋';
                  if (key.toLowerCase().includes('peso') || key.toLowerCase().includes('dimensão')) bulletIcon = '📏';
                  
                  return (
                    <li key={idx} className="spec-bullet-item">
                      <span className="spec-bullet-icon">{bulletIcon}</span>
                      <span className="spec-bullet-text"><strong>{key}:</strong> {val}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

        </div>

      </div>

      {/* ============================================== */}
      {/* DESCRIPTION SECTION — Below the 2-column layout */}
      {/* ============================================== */}
      {product.description && (
        <div className="product-description-section" style={{ marginTop: '60px' }}>
          <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '24px' }}>📝 Descrição do Produto</h3>
          <div className="product-description-layout">
            {/* Left: Rich description */}
            <div className="product-description-content glass-panel" style={{ padding: '24px', flex: 3 }}>
              <div 
                className="rich-description"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
                style={{ 
                  color: 'var(--color-text-muted)', 
                  lineHeight: '1.8', 
                  fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Right: Alien mascot floating */}
            <div className="alien-mascot-column" ref={alienRef} style={{ flex: 1, minWidth: '180px' }}>
              <div className="alien-mascot-sticky" style={{ position: 'sticky', top: '100px' }}>
                <div className="alien-ufo-animation">
                  <div className="ufo-body" style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 10px var(--color-primary))' }}>🛸</div>
                </div>
                <div className="alien-speech-bubble" style={{ marginTop: '10px' }}>
                  <span>{alienPhrase}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* REVIEWS SECTION                               */}
      {/* ============================================== */}
      <div className="product-reviews-section" style={{ marginTop: '60px' }}>
        <h3 className="section-title" style={{ fontSize: '1.2rem', marginBottom: '24px' }}>⭐ Avaliações de Clientes</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.filter(r => r.productId === product.id && r.status === 'approved').length > 0 ? (
              reviews.filter(r => r.productId === product.id && r.status === 'approved').map(review => (
                <div key={review.id} className="glass-panel" style={{ padding: '20px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {review.authorImage ? (
                        <img src={review.authorImage} alt={review.authorName} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000', fontSize: '1.1rem' }}>
                          {review.authorName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{review.authorName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{new Date(review.date).toLocaleDateString('pt-BR')}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} fill={review.rating >= i ? '#f59e0b' : 'none'} color={review.rating >= i ? '#f59e0b' : 'rgba(255,255,255,0.3)'} />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>"{review.content}"</p>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--color-text-muted)', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)' }}>
                Nenhuma avaliação para este produto ainda. Seja o primeiro a avaliar!
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="review-form-container glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>Deixe sua avaliação</h4>
            
            {userProfile?.isRegistered ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                if (onAddReview && reviewForm.content.trim()) {
                  onAddReview({
                    id: `rev-${Date.now()}`,
                    productId: product.id,
                    authorName: userProfile.name,
                    authorImage: userProfile.avatarUrl,
                    content: reviewForm.content,
                    rating: reviewForm.rating,
                    date: new Date().toISOString(),
                    status: 'pending'
                  });
                  setReviewForm({ rating: 5, content: '' });
                }
              }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Sua nota</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1,2,3,4,5].map(i => (
                      <Star 
                        key={i} 
                        size={24} 
                        fill={reviewForm.rating >= i ? '#f59e0b' : 'none'} 
                        color={reviewForm.rating >= i ? '#f59e0b' : 'rgba(255,255,255,0.3)'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: i }))}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '8px', color: 'var(--color-text-muted)' }}>Comentário</label>
                  <textarea 
                    className="cyber-input" 
                    rows={4} 
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="O que achou do produto?"
                    style={{ resize: 'vertical' }}
                    required
                  />
                </div>
                <button type="submit" className="neon-glow-btn" style={{ width: '100%', padding: '12px' }}>
                  Enviar Avaliação
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', fontSize: '0.9rem' }}>
                  Você precisa estar logado na sua conta intergaláctica para deixar uma avaliação.
                </p>
                <button className="outline-btn" style={{ width: '100%' }} onClick={() => addToast('Vá para o Perfil para fazer login/cadastro.', 'error')}>
                  Fazer Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete your Setup Section */}
      <div className="recommendations-section" style={{ marginTop: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', justifyContent: 'space-between' }}>
          <h3 className="section-title" style={{ margin: 0, fontSize: '1.2rem' }}>Complete seu Setup</h3>
          <span 
            onClick={() => { setCurrentView('home'); }} 
            style={{ color: 'var(--color-primary)', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 'bold' }}
          >
            Ver Todos
          </span>
        </div>

        <div className="product-grid recommendation-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {recommendations.map(p => (
            <div 
              key={p.id} 
              className="product-card" 
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectProduct(p.id)}
            >
              <div className="product-image-frame" style={{ height: '140px' }}>
                <ProductImage type={p.image} colorStyle={p.category === 'teclados' ? 'blue' : p.category === 'games' ? 'orange' : 'green'} />
              </div>
              <div className="product-info" style={{ padding: '16px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {p.category}
                </span>
                <h4 style={{ margin: '6px 0', fontSize: '0.88rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</h4>
                <div style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  R$ {p.price.toFixed(2).replace('.', ',')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================== */}
      {/* INSTALLMENTS POPUP MODAL                       */}
      {/* ============================================== */}
      {showInstallments && (
        <div className="admin-modal-overlay" style={{ zIndex: 1000 }} onClick={() => setShowInstallments(false)}>
          <div className="admin-modal glass-panel" style={{ maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-head">
              <h3>💳 Parcelas no Cartão</h3>
              <button onClick={() => setShowInstallments(false)} className="admin-close-btn"><X size={20} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ textAlign: 'left', padding: '8px', color: 'var(--color-primary)', fontSize: '0.8rem' }}>Parcelas</th>
                    <th style={{ textAlign: 'right', padding: '8px', color: 'var(--color-primary)', fontSize: '0.8rem' }}>Valor/Parcela</th>
                    <th style={{ textAlign: 'right', padding: '8px', color: 'var(--color-primary)', fontSize: '0.8rem' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: productMaxInstallments }, (_, i) => i + 1).map(n => {
                    const perInstallment = currentPrice / n;
                    if (perInstallment < installmentMinValue && n > 1) return null;
                    return (
                      <tr key={n} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '10px 8px', fontSize: '0.85rem' }}>
                          {n}x {n <= 12 ? <span style={{ color: 'var(--color-primary)', fontSize: '0.7rem' }}>sem juros</span> : ''}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '0.85rem' }}>
                          R$ {perInstallment.toFixed(2).replace('.', ',')}
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          R$ {currentPrice.toFixed(2).replace('.', ',')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(69,230,39,0.05)', borderRadius: '8px', border: '1px solid rgba(69,230,39,0.15)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                ⚡ No <strong style={{ color: 'var(--color-primary)' }}>PIX</strong> você paga <strong style={{ color: 'var(--color-primary)' }}>R$ {(currentPrice * 0.95).toFixed(2).replace('.', ',')}</strong> (5% de desconto)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================== */}
      {/* VIDEO MODAL                                     */}
      {/* ============================================== */}
      {showVideoModal && hasVideo && (
        <div className="admin-modal-overlay" style={{ zIndex: 1000 }} onClick={() => setShowVideoModal(false)}>
          <div className="admin-modal glass-panel" style={{ maxWidth: '720px', padding: 0 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-head" style={{ padding: '12px 16px' }}>
              <h3>🎬 Vídeo do Produto</h3>
              <button onClick={() => setShowVideoModal(false)} className="admin-close-btn"><X size={20} /></button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={getYouTubeEmbed(product.videoUrl!)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vídeo do Produto"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetailView;
