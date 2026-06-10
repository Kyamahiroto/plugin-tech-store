import React, { useState } from 'react';
import { CartItem, Order, UserProfile } from '../types';
import { Trash2, Plus, Minus, ShieldAlert, Sparkles, Orbit, CreditCard, QrCode, Brain, ArrowLeft, Check } from 'lucide-react';
import { ProductImage } from './HomeView';
import AuthWall from '../components/AuthWall';
import { calculateMaxAliencoinDiscount, getAliencoinPurchaseBonus } from '../utils/gamification';
import { createMercadoPagoPreference } from '../utils/mercadoPago';
import { sendEmail } from '../utils/email';

interface CartViewProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (order: Order) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
  setCurrentView: (view: string) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const CartView: React.FC<CartViewProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  addToast,
  setCurrentView,
  userProfile,
  onUpdateProfile
}) => {
  // Step 1: Cart, Step 2: Shipping, Step 3: Payment
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'telepathy'>('pix');
  const [orderBumpAdded, setOrderBumpAdded] = useState(false);
  const [useAliencoins, setUseAliencoins] = useState(false);
  const [useWalletBalance, setUseWalletBalance] = useState(false);

  // Order bump product definition
  const orderBumpProduct: import('../types').CartItem = {
    product: {
      id: 'prod-cabo-rgb',
      name: 'Cabo USB-C Galáctico RGB 2m',
      description: 'Cabo trançado em nylon de alta resistência com iluminação RGB sincronizada com seu setup.',
      price: 29.90,
      oldPrice: 79.90,
      image: 'antenna',
      category: 'acessorios',
      stock: 99
    },
    quantity: 1
  };

  // Step 2 Address states
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');

  const nationalItems = cartItems.filter(item => item.product.shippingType === 'national');
  const estimatedItems = cartItems.filter(item => item.product.shippingType !== 'national');
  const hasNational = nationalItems.length > 0;
  const hasEstimated = estimatedItems.length > 0;

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const orderBumpPrice = orderBumpAdded ? orderBumpProduct.product.price : 0;
  
  // Shipping fee is 15.00 if ANY item is national. Otherwise free.
  const shippingFee = hasNational ? 15.00 : 0.00;
  
  let deliveryEstimateStr = '';
  if (hasNational && hasEstimated) {
    deliveryEstimateStr = 'Misto (3-7 dias e 8-15 dias)';
  } else if (hasNational) {
    deliveryEstimateStr = '3 a 7 dias úteis';
  } else {
    deliveryEstimateStr = '8 a 15 dias úteis';
  }
  
  const baseTotalBrl = subtotal + shippingFee + orderBumpPrice;
  const maxAliencoins = calculateMaxAliencoinDiscount(baseTotalBrl, userProfile.aliencoins || 0);
  const aliencoinDiscountBrl = useAliencoins ? maxAliencoins / 100 : 0;
  
  const walletAvailable = userProfile.walletBalance || 0;
  const maxWalletDiscount = Math.min(walletAvailable, baseTotalBrl - aliencoinDiscountBrl);
  const walletDiscountBrl = useWalletBalance ? maxWalletDiscount : 0;
  
  const totalBrl = baseTotalBrl - aliencoinDiscountBrl - walletDiscountBrl;

  const handleNextStep = () => {
    if (checkoutStep === 1) {
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (!fullName.trim() || !street.trim() || !city.trim()) {
        addToast('Preencha as coordenadas de destino interestelar, terráqueo!', 'error');
        return;
      }
      setCheckoutStep(3);
    }
  };

  const handlePrevStep = () => {
    if (checkoutStep === 2) {
      setCheckoutStep(1);
    } else if (checkoutStep === 3) {
      setCheckoutStep(2);
    }
  };

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    if (checkoutStep === 3 && !isProcessingPayment) {
      handleCheckoutSubmit({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [checkoutStep]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      addToast('Seu carrinho está flutuando vazio no espaço! 🌌🌀', 'error');
      return;
    }

    if (!fullName || !street || !city) {
      addToast('Preencha as coordenadas de destino interestelar, terráqueo!', 'error');
      return;
    }

    // Create a new simulated order
    const allItems = orderBumpAdded
      ? [...cartItems, orderBumpProduct]
      : [...cartItems];

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      items: allItems,
      total: totalBrl,
      status: 'processing',
      shippingAddress: {
        fullName,
        street,
        city,
        portalName: deliveryEstimateStr
      },
      shippingFee
    };

    if (paymentMethod === 'pix' || paymentMethod === 'card') {
      setIsProcessingPayment(true);
      try {
        // Envia email de confirmação via Resend
        await sendEmail(
          userProfile.email || 'cliente@terracosmica.com',
          'Sua compra na Plug-in Tech Store está quase pronta!',
          `<h1>Saudações, ${fullName}!</h1><p>Recebemos o seu pedido intergaláctico. Complete o pagamento para receber seus periféricos: ${cartItems.map(i => i.product.name).join(', ')}.</p>`
        ).catch(e => console.warn('Falha no email (ignorado)', e));

        const initPoint = await createMercadoPagoPreference(
          cartItems,
          fullName,
          userProfile.email || '',
          shippingFee,
          orderBumpAdded ? orderBumpProduct : null,
          useAliencoins,
          useWalletBalance,
          userProfile.walletBalance || 0,
          userProfile.aliencoins || 0
        );
        window.location.href = initPoint;
        return;
      } catch (err) {
        setIsProcessingPayment(false);
        addToast('Erro ao redirecionar para o Mercado Pago. Tente novamente.', 'error');
        return;
      }
    }

    onPlaceOrder(newOrder);

    // Envia email de confirmação via Resend (para pagamentos diretos)
    sendEmail(
      userProfile.email || 'cliente@terracosmica.com',
      'Pedido Confirmado - Plug-in Tech Store',
      `<h1>Sintonização Concluída, ${fullName}!</h1><p>Seu pagamento via Telepatia foi processado. Seus itens: ${cartItems.map(i => i.product.name).join(', ')} já estão sendo despachados.</p>`
    ).catch(e => console.warn('Falha no email (ignorado)', e));

    // Gamification & Wallet Updates (for telepathy/free)
    const nextWallet = (userProfile.walletBalance || 0) - (useWalletBalance ? maxWalletDiscount : 0);
    let currentCoins = (userProfile.aliencoins || 0) - (useAliencoins ? maxAliencoins : 0);
    const currentXp = userProfile.xp || 0;

    // Cálculo de Cashback
    const baseCoins = Math.floor(totalBrl * 2); // 2 Aliencoins por R$1 gasto
    const rankBonusPct = getAliencoinPurchaseBonus(currentXp);
    const rankBonusCoins = Math.floor(baseCoins * rankBonusPct);
    
    let extraBonusCoins = 0;
    if (totalBrl > 1000) extraBonusCoins = 500;
    else if (totalBrl > 500) extraBonusCoins = 200;

    // Verificar primeira compra
    let firstPurchaseBonus = 0;
    const completedTasks = userProfile.gamificationState?.completedTasks || [];
    if (!completedTasks.includes('t-comp1')) {
      firstPurchaseBonus = 300;
      completedTasks.push('t-comp1');
    }

    const earnedCoins = baseCoins + rankBonusCoins + extraBonusCoins + firstPurchaseBonus;
    currentCoins += earnedCoins;
    
    // Conceder um pouco de XP pela compra
    const nextXp = currentXp + 150;

    onUpdateProfile({
      ...userProfile,
      walletBalance: nextWallet,
      aliencoins: currentCoins,
      xp: nextXp,
      gamificationState: {
        ...userProfile.gamificationState,
        completedTasks
      }
    });

    if (useWalletBalance && maxWalletDiscount > 0) addToast(`-R$ ${maxWalletDiscount.toFixed(2)} da Carteira Digital aplicados!`, 'success');
    if (useAliencoins && maxAliencoins > 0) addToast(`-${maxAliencoins} Aliencoins aplicados! 🚀`, 'success');
    if (earnedCoins > 0) addToast(`+${earnedCoins} Aliencoins recebidos de Cashback! 💰`, 'success');

    addToast('Pedido abduzido com sucesso! Rastreamento ativado. 🛸✨', 'success');
    setCurrentView('orders');
  };

  if (cartItems.length === 0) {
    return (
      <div className="view-container animate-fade-in" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="cyber-render animate-ufo" style={{ width: '120px', height: '120px', margin: '0 auto 20px auto', color: 'var(--color-primary)' }}>
          <div className="cyber-render-halo" style={{ width: '140px', height: '80px' }} />
          <Orbit size={48} strokeWidth={1.2} />
        </div>
        <h2 className="neon-text" style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Seu carrinho flutua vazio</h2>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '460px', margin: '0 auto 24px auto', fontSize: '0.9rem' }}>
          Não deixe as naves cargueiras alienígenas partirem vazias! Abduza alguns dos nossos mouses gamer ou headsets gamer espaciais hoje mesmo.
        </p>
        <button
          className="neon-glow-btn"
          style={{ padding: '12px 28px', margin: '0 auto' }}
          onClick={() => setCurrentView('home')}
        >
          EXPLORAR CATÁLOGO
        </button>
      </div>
    );
  }

  return (
    <div className="view-container animate-fade-in">
      <h2 className="section-title" style={{ marginBottom: '20px' }}>Finalização de Compra</h2>

      {/* Step Progress Tracker */}
      <div className="checkout-progress-bar">
        <div className={`checkout-step-node ${checkoutStep >= 1 ? 'active' : ''} ${checkoutStep > 1 ? 'completed' : ''}`} onClick={() => setCheckoutStep(1)}>
          <div className="step-badge">
            {checkoutStep > 1 ? <Check size={14} /> : '1'}
          </div>
          <span className="step-title">🛒 Carrinho</span>
        </div>
        <div className={`checkout-step-line ${checkoutStep >= 2 ? 'active' : ''}`} />
        <div className={`checkout-step-node ${checkoutStep >= 2 ? 'active' : ''} ${checkoutStep > 2 ? 'completed' : ''}`} onClick={() => userProfile.name && setCheckoutStep(2)}>
          <div className="step-badge">
            {checkoutStep > 2 ? <Check size={14} /> : '2'}
          </div>
          <span className="step-title">🚀 Envio</span>
        </div>
        <div className={`checkout-step-line ${checkoutStep >= 3 ? 'active' : ''}`} />
        <div className={`checkout-step-node ${checkoutStep >= 3 ? 'active' : ''}`} onClick={() => userProfile.name && fullName && street && city && setCheckoutStep(3)}>
          <div className="step-badge">
            3
          </div>
          <span className="step-title">💳 Pagamento</span>
        </div>
      </div>
      
      <div className="cart-view-container">
        {/* Left Side: Dynamic step contents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* STEP 1: REVIEW CART ITEMS */}
          {checkoutStep === 1 && (
            <>
            <div className="cart-items-list animate-fade-in">
              <h3 className="checkout-summary-title" style={{ fontSize: '1rem', border: 'none', marginBottom: '14px' }}>
                📦 Revisar Periféricos no Carrinho
              </h3>
              {cartItems.map((item) => {
                let imageCode = item.product.image;
                if (item.product.id === 'prod-orelha-gato') {
                  imageCode = 'cat-headphones';
                }
                return (
                  <div key={item.product.id} className="cart-item-row">
                    <div className="cart-item-image-box">
                      <ProductImage type={imageCode} colorStyle={item.product.category === 'teclados' ? 'blue' : 'green'} />
                    </div>
                    
                    <div className="cart-item-info">
                      <span className="cart-item-category">{item.product.category}</span>
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <div className="cart-item-price">
                        R$ {item.product.price.toFixed(2).replace('.', ',')}
                      </div>
                    </div>

                    <div className="cart-item-quantity-controls">
                      <button
                        className="cart-qty-btn"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        title="Diminuir quantidade"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        title="Aumentar quantidade"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      className="cart-item-delete"
                      onClick={() => onRemoveItem(item.product.id)}
                      title="Excluir do carrinho interestelar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ORDER BUMP — horizontal strip, completely distinct from product card style */}
            {!cartItems.some(i => i.product.id === 'prod-cabo-rgb') && (
              <div className={`order-bump-strip ${orderBumpAdded ? 'accepted' : ''}`}>
                <div className="order-bump-flag">🔥 OFERTA EXCLUSIVA — SÓ AGORA!</div>
                <div className="order-bump-body">
                  <div className="order-bump-icon-box">
                    <span style={{ fontSize: '2.4rem' }}>🔌</span>
                  </div>
                  <div className="order-bump-details">
                    <span className="order-bump-title">Cabo USB-C Galáctico RGB 2m</span>
                    <span className="order-bump-desc">Nylon trançado + LED RGB sincronizado. Compatível com todos os periféricos do seu setup alienígena!</span>
                    <div className="order-bump-pricing">
                      <span className="order-bump-old">De R$ 79,90</span>
                      <span className="order-bump-new">Por R$ 29,90</span>
                      <span className="order-bump-pct">62% OFF</span>
                    </div>
                  </div>
                  <label className="order-bump-toggle-label">
                    <input
                      type="checkbox"
                      checked={orderBumpAdded}
                      onChange={(e) => {
                        setOrderBumpAdded(e.target.checked);
                        addToast(e.target.checked
                          ? 'Cabo RGB adicionado ao pedido! ⚡🔌'
                          : 'Cabo RGB removido do pedido.', e.target.checked ? 'success' : 'error');
                      }}
                      style={{ display: 'none' }}
                    />
                    <div className={`bump-toggle-btn ${orderBumpAdded ? 'on' : ''}`}>
                      {orderBumpAdded ? '✓ ADICIONADO' : '+ ADICIONAR'}
                    </div>
                  </label>
                </div>
              </div>
            )}
            </>
          )}

          {/* STEP 2: ADDRESS & PORTAL SHIPPING */}
          {checkoutStep === 2 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {!userProfile.name ? (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 className="neon-text" style={{ fontSize: '1.2rem', marginBottom: '8px', textAlign: 'center' }}>
                    🧬 Identificação Genética Requerida
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', textAlign: 'center', marginBottom: '24px' }}>
                    Identifique-se para podermos mapear as coordenadas e calibrar o portal de teletransporte quântico para sua casa.
                  </p>
                  <AuthWall context="cart" />
                </div>
              ) : (
                <>
                  {/* Address coordinates */}
                  <div className="checkout-summary-box" style={{ background: 'var(--color-bg-card)', padding: '24px' }}>
                    <h3 className="checkout-summary-title" style={{ fontSize: '1rem', border: 'none', marginBottom: '16px' }}>
                      📡 Coordenadas de Envio (Destino)
                    </h3>
                    
                    <div className="form-group">
                      <label className="form-label">Nome Completo do Terráqueo</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Endereço de Abdução (Rua, Número)</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Cidade e Estado de Frequência</label>
                      <input
                        type="text"
                        className="form-input"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '12px' }}>
                      <ShieldAlert size={14} className="neon-text" style={{ flexShrink: 0 }} />
                      <span>Garantimos que sua residência não será acidentalmente abduzida durante o teletransporte quântico.</span>
                    </div>
                  </div>

                  {/* Computed Shipping Display */}
                  <div className="shipping-options-box">
                    <h3 className="checkout-summary-title" style={{ fontSize: '1rem', border: 'none', marginBottom: '14px' }}>
                      🛸 Despacho Interestelar Automático
                    </h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                      Os portais são abertos automaticamente de acordo com a origem do artefato.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {nationalItems.length > 0 && (
                        <div className="shipping-option-card active" style={{ cursor: 'default' }}>
                          <div className="shipping-option-details" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div className="shipping-option-name" style={{ color: 'var(--color-primary)' }}>🚀 Estoque nacional</div>
                              <div className="shipping-option-price">R$ 15,00</div>
                            </div>
                            <div className="shipping-option-desc" style={{ marginTop: '4px' }}>
                              <span style={{ color: '#fff' }}>3 a 7 dias úteis</span>
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              Itens neste envio: {nationalItems.map(i => i.product.name).join(', ')}
                            </div>
                          </div>
                        </div>
                      )}

                      {estimatedItems.length > 0 && (
                        <div className="shipping-option-card active" style={{ cursor: 'default' }}>
                          <div className="shipping-option-details" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div className="shipping-option-name" style={{ color: 'var(--color-warning)' }}>📦 Entrega estimada</div>
                              <div className="shipping-option-price">GRÁTIS</div>
                            </div>
                            <div className="shipping-option-desc" style={{ marginTop: '4px' }}>
                              <span style={{ color: '#fff' }}>8 a 15 dias úteis</span>
                            </div>
                            <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              Itens neste envio: {estimatedItems.map(i => i.product.name).join(', ')}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 3: REDIRECT ANIMATION */}
          {checkoutStep === 3 && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', justifyContent: 'center', padding: '40px 0' }}>
              <div className="cyber-render animate-ufo" style={{ width: '80px', height: '80px', color: 'var(--color-primary)' }}>
                <div className="cyber-render-halo" />
                <Orbit size={40} />
              </div>
              <h3 className="neon-text" style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                Preparando Portal de Pagamento...
              </h3>
              <p style={{ color: 'var(--color-text-muted)', textAlign: 'center', fontSize: '0.9rem' }}>
                Você está sendo abduzido para o ambiente seguro do Mercado Pago.
              </p>
            </div>
          )}

        </div>

        {/* Right Side: Persistent Order Summary */}
        <div className="checkout-summary-box">
          <h3 className="checkout-summary-title">Resumo do Pedido</h3>
          
          <div className="checkout-row">
            <span>Subtotal de periféricos</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          
          <div className="checkout-row">
            <span>Despacho Quântico</span>
            <span>{shippingFee === 0 ? 'Grátis' : `R$ ${shippingFee.toFixed(2).replace('.', ',')}`}</span>
          </div>

          <div className="checkout-row" style={{ fontStyle: 'italic', fontSize: '0.72rem', color: 'var(--color-primary)' }}>
            <span>🚚 Coordenada estimada de entrega:</span>
            <span>{deliveryEstimateStr}</span>
          </div>

          {maxAliencoins > 0 && checkoutStep >= 2 && (
            <div className="checkout-row aliencoin-discount" style={{ marginTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '12px', color: 'var(--color-warning)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input 
                  type="checkbox" 
                  checked={useAliencoins} 
                  onChange={(e) => setUseAliencoins(e.target.checked)} 
                  style={{ accentColor: 'var(--color-warning)' }}
                />
                Aplicar Aliencoins (Máx 15%)
              </label>
              {useAliencoins && (
                <span>- R$ {aliencoinDiscountBrl.toFixed(2).replace('.', ',')}</span>
              )}
            </div>
          )}

          {walletAvailable > 0 && checkoutStep >= 2 && (
            <div className="checkout-row wallet-discount" style={{ marginTop: '12px', borderTop: '1px dashed rgba(255,255,255,0.1)', paddingTop: '12px', color: '#a78bfa' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input 
                  type="checkbox" 
                  checked={useWalletBalance} 
                  onChange={(e) => setUseWalletBalance(e.target.checked)} 
                  style={{ accentColor: '#a78bfa' }}
                />
                Usar Saldo da Carteira (R$ {walletAvailable.toFixed(2).replace('.', ',')})
              </label>
              {useWalletBalance && (
                <span>- R$ {maxWalletDiscount.toFixed(2).replace('.', ',')}</span>
              )}
            </div>
          )}

          <div className="checkout-row total-row">
            <span>Total da Compra</span>
            <div style={{ textAlign: 'right' }}>
              <span className="checkout-total-price">
                R$ {totalBrl.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Action buttons depending on step */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {checkoutStep === 1 && (
              <button 
                onClick={handleNextStep}
                className="neon-glow-btn"
                style={{ width: '100%', padding: '14px' }}
              >
                PROSSEGUIR PARA ENVIO 🚀
              </button>
            )}

            {checkoutStep === 2 && (
              <>
                {!userProfile.name ? (
                  <button 
                    disabled 
                    className="outline-btn"
                    style={{ width: '100%', padding: '14px', opacity: 0.5, cursor: 'not-allowed' }}
                  >
                    IDENTIFIQUE-SE PARA AVANÇAR 👽
                  </button>
                ) : (
                  <button 
                    onClick={handleNextStep}
                    className="neon-glow-btn"
                    style={{ width: '100%', padding: '14px' }}
                  >
                    AVANÇAR PARA PAGAMENTO 💳
                  </button>
                )}
                <button 
                  onClick={handlePrevStep}
                  className="outline-btn"
                  style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <ArrowLeft size={14} /> Voltar ao Carrinho
                </button>
              </>
            )}

            {checkoutStep === 3 && (
              <>
                <button 
                  disabled
                  className="neon-glow-btn"
                  style={{ width: '100%', padding: '14px', opacity: 0.8 }}
                >
                  PROCESSANDO...
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;
