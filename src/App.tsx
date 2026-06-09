import { useState, useEffect } from 'react';
import './App.css';
import { Product, CartItem, Order, UserProfile, Category, Banner, StoreSettings, Testimonial, Brand, QuizConfig, SetupResult } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BANNERS, INITIAL_STORE_SETTINGS, INITIAL_TESTIMONIALS, INITIAL_BRANDS, INITIAL_PAYMENT_SETTINGS, INITIAL_QUIZ_CONFIG } from './mockData';
import { supabase } from './lib/supabase';
import { getRankByXP } from './utils/gamification';
import { API_URL } from './utils/api';

// Import Custom Views
import HomeView from './views/HomeView';
import CartView from './views/CartView';
import FavoritesView from './views/FavoritesView';
import OrdersView from './views/OrdersView';
import ProfileView from './views/ProfileView';
import ProductDetailView from './views/ProductDetailView';
import ShopView from './views/ShopView';
import SetupQuizView from './views/SetupQuizView';
import SetupResultView from './views/SetupResultView';
import AdminLoginView from './views/AdminLoginView';
import AdminPanel from './views/AdminPanel';

// Import Navbar Component
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import Icons
import { Compass, Heart, ShoppingCart, Receipt, User } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

function App() {
  // Navigation View State
  const [currentView, setCurrentView] = useState<string>(() => {
    return localStorage.getItem('plugin_view') || 'home';
  });

  const [selectedProductId, setSelectedProductId] = useState<string | null>(() => {
    return localStorage.getItem('plugin_selected_product_id');
  });
  
  const [shopCategory, setShopCategory] = useState<string | null>(null);

  // Sidebar Menu Open State
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Global Shipping Address State
  const [shippingAddress, setShippingAddressState] = useState('Sintonizando portal cósmico...');
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Products state (loads from localStorage or mockData)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('plugin_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Categories state
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('plugin_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  // Banners state
  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('plugin_banners');
    return saved ? JSON.parse(saved) : INITIAL_BANNERS;
  });

  // Store Settings state
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('plugin_store_settings');
    return saved ? JSON.parse(saved) : INITIAL_STORE_SETTINGS;
  });

  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('plugin_testimonials');
    return saved ? JSON.parse(saved) : INITIAL_TESTIMONIALS;
  });

  // Brands state
  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem('plugin_brands');
    return saved ? JSON.parse(saved) : INITIAL_BRANDS;
  });

  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState<import('./types').PaymentSettings>(() => {
    const saved = localStorage.getItem('plugin_payment_settings');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_SETTINGS;
  });

  // Quiz config state
  const [quizConfig, setQuizConfig] = useState<QuizConfig>(() => {
    const saved = localStorage.getItem('plugin_quiz_config');
    return saved ? JSON.parse(saved) : INITIAL_QUIZ_CONFIG;
  });

  // Quiz result state
  const [quizResult, setQuizResult] = useState<SetupResult | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<import('./types').ProductReview[]>(() => {
    const saved = localStorage.getItem('plugin_reviews');
    return saved ? JSON.parse(saved) : [];
  });


  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('plugin_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('plugin_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('plugin_orders');
    return saved ? JSON.parse(saved) : [];
  });

  // User Profile DNA state
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('plugin_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: '',
      species: 'gray',
      homePlanet: 'Retículo II (Setor Cósmico Z)',
      dangerLevel: 'medium',
      walletBalance: 15000
    };
  });

  // Toast alert system state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Database Connection Status Indicator State
  const [dbConnected, setDbConnected] = useState(false);

  // Admin auth state (true session is validated inside AdminLoginView)
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const isAdminRoute = window.location.pathname === '/painel-admin-loja-plugin';

  // Sync shippingAddress with userProfile.address
  useEffect(() => {
    if (userProfile?.address) {
      setShippingAddressState(userProfile.address);
    }
  }, [userProfile?.address]);

  const setShippingAddress = (address: string) => {
    setShippingAddressState(address);
    setUserProfile(prev => ({ ...prev, address }));
  };

  // Load dynamic data from Supabase on mount
  useEffect(() => {
    const fetchDatabase = async () => {
      try {
        // Fetch Categories
        const { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*');
        if (!catError && catData && catData.length > 0) {
          const parsedCategories = catData.map(c => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            iconName: c.icon_name,
            imageUrl: c.image_url
          })) as Category[];
          setCategories(parsedCategories);
          localStorage.setItem('plugin_categories', JSON.stringify(parsedCategories));
        }

        // Fetch Banners
        const { data: bannerData, error: bannerError } = await supabase
          .from('banners')
          .select('*');
        if (!bannerError && bannerData && bannerData.length > 0) {
          const parsedBanners = bannerData.map(b => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle || '',
            badge: b.badge || '',
            price: Number(b.price),
            oldPrice: b.old_price ? Number(b.old_price) : undefined,
            image: b.image,
            buttonText: b.button_text,
            bgStyle: b.bg_style || ''
          })) as Banner[];
          setBanners(parsedBanners);
          localStorage.setItem('plugin_banners', JSON.stringify(parsedBanners));
        }

        // Fetch Products
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*');
        if (!prodError && prodData && prodData.length > 0) {
          const parsedProducts = prodData.map(p => ({
            id: p.id,
            name: p.id === 'prod-headset-x9' ? 'Headset Gamer Alien Pro 7.1' : p.name,
            description: p.description,
            price: Number(p.price),
            oldPrice: p.old_price ? Number(p.old_price) : undefined,
            discount: p.discount || undefined,
            image: p.image,
            category: p.category,
            isNew: !!p.is_new,
            stock: Number(p.stock),
            specs: typeof p.specs === 'string' ? JSON.parse(p.specs) : p.specs,
            funnyReview: typeof p.funny_review === 'string' ? JSON.parse(p.funny_review) : p.funny_review,
            type: p.type,
            affiliateLink: p.affiliate_link,
            virtualContent: p.virtual_content,
            orderBumpId: p.order_bump_id,
            orderBumpDiscount: p.order_bump_discount,
            gallery: typeof p.gallery === 'string' ? JSON.parse(p.gallery) : p.gallery,
            variations: typeof p.variations === 'string' ? JSON.parse(p.variations) : p.variations,
            videoUrl: p.video_url || p.videoUrl,
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags,
            estiloVisual: typeof p.estilo_visual === 'string' ? JSON.parse(p.estilo_visual) : p.estilo_visual,
            prioridade: typeof p.prioridade === 'string' ? JSON.parse(p.prioridade) : p.prioridade,
            perfilRecomendado: typeof p.perfil_recomendado === 'string' ? JSON.parse(p.perfil_recomendado) : p.perfil_recomendado,
            popularidade: p.popularidade ? Number(p.popularidade) : 0
          })) as Product[];
          
          setProducts(parsedProducts);
          localStorage.setItem('plugin_products', JSON.stringify(parsedProducts));
          setDbConnected(true);
        }

        // Fetch Orders (if needed globally, but usually tied to user in real app)
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*');
        if (!orderError && orderData && orderData.length > 0) {
          const parsedOrders = orderData.map(o => ({
            id: o.id,
            date: o.date,
            items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
            total: Number(o.total),
            status: o.status,
            shippingAddress: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
            shippingFee: Number(o.shipping_fee || 0),
            trackingCode: o.tracking_code
          })) as Order[];
          setOrders(parsedOrders);
          localStorage.setItem('plugin_orders', JSON.stringify(parsedOrders));
        }
      } catch (err) {
        console.warn('Erro ao carregar dados do Supabase. Utilizando cache local:', err);
      }
    };

    fetchDatabase();

    // Setup Supabase Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        // User is logged in, extract DNA metadata
        const metadata = session.user.user_metadata;
        setUserProfile(prev => ({
          ...prev,
          email: session.user.email || '',
          name: metadata.name || session.user.email?.split('@')[0] || 'Visitante',
          species: metadata.species || 'gray',
          homePlanet: metadata.homePlanet || 'Planeta Desconhecido',
          dangerLevel: metadata.dangerLevel || 'harmless',
          walletBalance: metadata.walletBalance || 0,
          xp: metadata.xp || prev.xp || 0,
          aliencoins: metadata.aliencoins || prev.aliencoins || 0,
          rank: metadata.rank || prev.rank,
          gamificationState: metadata.gamificationState || prev.gamificationState || { completedTasks: [] },
          isRegistered: true
        }));
      } else {
        // User logged out or no session
        setUserProfile({
          email: '',
          name: '',
          species: 'gray',
          homePlanet: 'Retículo II (Setor Cósmico Z)',
          dangerLevel: 'medium',
          walletBalance: 15000,
          xp: 0,
          aliencoins: 0,
          gamificationState: { completedTasks: [] },
          isRegistered: false
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Gamification: Daily Login Logic
  useEffect(() => {
    if (userProfile?.isRegistered && userProfile?.email && userProfile.gamificationState) {
      const todayDate = new Date().toISOString().split('T')[0];
      const gState = userProfile.gamificationState;
      const lastLogin = gState.lastLogin;

      if (lastLogin !== todayDate) {
        let loginStreak = gState.loginStreak || 0;
        
        if (lastLogin) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayDate = yesterday.toISOString().split('T')[0];
          
          if (lastLogin === yesterdayDate) {
            loginStreak += 1;
          } else {
            loginStreak = 1;
          }
        } else {
          loginStreak = 1;
        }

        // Clean old daily limits
        const newTaskLimits = { ...gState.taskLimits };
        for (const taskId in newTaskLimits) {
          if (newTaskLimits[taskId].date !== todayDate) {
            delete newTaskLimits[taskId];
          }
        }

        let extraXp = 0;
        const completedTasks = [...(gState.completedTasks || [])];
        if (loginStreak >= 7 && !completedTasks.includes('t-log7')) {
          extraXp += 150;
          completedTasks.push('t-log7');
        }
        if (loginStreak >= 30 && !completedTasks.includes('t-log30')) {
          extraXp += 800;
          completedTasks.push('t-log30');
        }

        // Increment task count for 't-log' (Daily Login task visual)
        if (!newTaskLimits['t-log']) newTaskLimits['t-log'] = { count: 0, date: todayDate };
        if (newTaskLimits['t-log'].count < 1) {
           newTaskLimits['t-log'].count += 1;
           extraXp += 20; // 20 XP for daily
        }

        setUserProfile(prev => ({
          ...prev,
          xp: (prev.xp || 0) + extraXp,
          gamificationState: {
            ...gState,
            lastLogin: todayDate,
            loginStreak,
            completedTasks,
            taskLimits: newTaskLimits
          }
        }));

        if (extraXp >= 20) addToast(`Bônus Diário: +20 XP! Frequência: ${loginStreak} dias.`, 'success');
        if (extraXp > 20) addToast(`Missão de Frequência concluída: +${extraXp - 20} XP!`, 'success');
      }
    }
  }, [userProfile?.isRegistered, userProfile?.email, userProfile?.gamificationState?.lastLogin]);

  // Admin Auto-Refresh for Orders
  useEffect(() => {
    if (!adminLoggedIn) return;
    
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase.from('orders').select('*');
        if (!error && data) {
          const parsedOrders = data.map(o => ({
            id: o.id,
            date: o.date,
            items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
            total: Number(o.total),
            status: o.status,
            shippingAddress: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : o.shipping_address,
            shippingFee: Number(o.shipping_fee || 0),
            trackingCode: o.tracking_code
          })) as Order[];
          
          setOrders(prev => {
            if (parsedOrders.length > prev.length) {
              const newOrdersCount = parsedOrders.length - prev.length;
              addToast(`🛸 Você tem ${newOrdersCount} novo(s) pedido(s) aguardando abdução!`, 'success');
            }
            return parsedOrders;
          });
        }
      } catch (err) {
        console.warn('Erro no auto-refresh de pedidos:', err);
      }
    };

    const interval = setInterval(fetchOrders, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [adminLoggedIn]);

  // ----------------------------------------------------
  // ----------------------------------------------------
  // Sync to localStorage
  // ----------------------------------------------------
  const safeSetLocalStorage = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`QuotaExceededError setting localStorage for ${key}`, e);
    }
  };

  useEffect(() => {
    safeSetLocalStorage('plugin_view', currentView);
  }, [currentView]);

  useEffect(() => {
    if (selectedProductId) {
      safeSetLocalStorage('plugin_selected_product_id', selectedProductId);
    } else {
      localStorage.removeItem('plugin_selected_product_id');
    }
  }, [selectedProductId]);

  useEffect(() => {
    safeSetLocalStorage('plugin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeSetLocalStorage('plugin_cart', JSON.stringify(cartItems));

    // Sync cart with Supabase for abandoned cart emails
    if (userProfile?.isRegistered && userProfile?.email) {
      supabase.from('carts').upsert({
        user_email: userProfile.email,
        items: cartItems,
        updated_at: new Date().toISOString(),
        abandonment_email_sent_1h: false,
        abandonment_email_sent_24h: false,
        abandonment_email_sent_72h: false
      }, { onConflict: 'user_email' })
      .then(({ error }) => {
        if (error) console.error('Error syncing cart:', error);
      });
    }
  }, [cartItems, userProfile?.email, userProfile?.isRegistered]);

  // Sync user profile to Supabase users table (for Gamification and Login Tracking)
  useEffect(() => {
    if (userProfile?.isRegistered && userProfile?.email) {
      supabase.from('users').upsert({
        email: userProfile.email,
        name: userProfile.name,
        xp: userProfile.xp || 0,
        aliencoins: userProfile.aliencoins || 0,
        rank: userProfile.rank || getRankByXP(userProfile.xp || 0).name,
        last_login: new Date().toISOString(),
        gamification_state: userProfile.gamificationState || { completedTasks: [] }
      }, { onConflict: 'email' })
      .then(({ error }) => {
        if (error) console.error('Error syncing user:', error);
      });
    }
  }, [
    userProfile?.email, 
    userProfile?.isRegistered, 
    userProfile?.xp, 
    userProfile?.aliencoins, 
    userProfile?.rank,
    userProfile?.gamificationState
  ]);

  // Monitor Rank Up and trigger email
  useEffect(() => {
    if (userProfile?.isRegistered && userProfile?.email) {
      const currentRank = getRankByXP(userProfile.xp || 0).name;
      const storedRank = userProfile.rank || 'Recruta';
      
      if (currentRank !== storedRank && (userProfile.xp || 0) > 0) {
        // Update local rank
        setUserProfile(prev => ({ ...prev, rank: currentRank }));

        // Trigger rank up email
        fetch(`${API_URL}/api/gamification/event`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email: userProfile.email, 
            type: 'rank_up', 
            data: { newRank: currentRank } 
          })
        }).catch(err => console.error('Rank up email error:', err));
        
        addToast(`🎉 Patente promovida para ${currentRank}!`, 'success');
      }
    }
  }, [userProfile?.xp, userProfile?.email, userProfile?.isRegistered, userProfile?.rank]);

  useEffect(() => {
    safeSetLocalStorage('plugin_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    safeSetLocalStorage('plugin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeSetLocalStorage('plugin_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    safeSetLocalStorage('plugin_store_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    safeSetLocalStorage('plugin_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    safeSetLocalStorage('plugin_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    safeSetLocalStorage('plugin_brands', JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    safeSetLocalStorage('plugin_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  // ----------------------------------------------------
  // Toast Helper
  // ----------------------------------------------------
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // ----------------------------------------------------
  // Handler: Logout
  // ----------------------------------------------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('plugin_profile');
    setCurrentView('home');
    addToast('Você saiu da conta. Até logo, Visitante Cósmico! 👽🛸', 'success');
  };

  // ----------------------------------------------------
  // Handlers: Cart
  // ----------------------------------------------------
  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      addToast(`Equipamento ${product.name} esgotado em órbita! 🛰️🌀`, 'error');
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        // Limit to available stock
        const newQty = existing.quantity + 1;
        if (newQty > product.stock) {
          addToast(`Apenas ${product.stock} unidades de ${product.name} estão em nosso carregamento espacial! 🚚`, 'error');
          return prev;
        }
        addToast(`Incrementado: +1 ${product.name} abduzido com sucesso! 🛸`, 'success');
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      
      addToast(`Materializado: ${product.name} abduzido no carrinho! 🛸🛒`, 'success');
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }

    const item = cartItems.find((c) => c.product.id === productId);
    if (item && quantity > item.product.stock) {
      addToast(`Estoque limite cósmico atingido para este item! 🛰️`, 'error');
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cartItems.find((c) => c.product.id === productId);
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    if (item) {
      addToast(`Desintegrado: ${item.product.name} deletado do carrinho! 💥`, 'error');
    }
  };

  // ----------------------------------------------------
  // Handlers: Favorites
  // ----------------------------------------------------
  const handleToggleFavorite = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      if (isFav) {
        if (product) addToast(`Removido dos Favoritos: ${product.name} 💔`, 'error');
        return prev.filter((id) => id !== productId);
      } else {
        if (product) addToast(`Sintonizado nos Favoritos: ${product.name} ❤️🛸`, 'success');
        return [...prev, productId];
      }
    });
  };

  const handleViewProduct = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
  };

  // ----------------------------------------------------
  // Handlers: Promotional Hero Banner Click Router
  // ----------------------------------------------------
  const handleSelectBanner = (bannerId: string) => {
    if (bannerId === 'banner-headset') {
      handleViewProduct('prod-headset-x9');
    } else if (bannerId === 'banner-abduction') {
      handleViewProduct('prod-oculos-vr');
    } else if (bannerId === 'banner-beach') {
      handleViewProduct('prod-stick-retro');
    } else {
      setCurrentView('home');
    }
  };

  // ----------------------------------------------------
  // Handlers: Checkout
  // ----------------------------------------------------
  const handlePlaceOrder = async (newOrder: Order) => {
    // Add to orders state
    setOrders((prev) => [newOrder, ...prev]);
    
    // Decrease stock for products bought
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const itemBought = newOrder.items.find((item) => item.product.id === p.id);
        if (itemBought) {
          return {
            ...p,
            stock: Math.max(0, p.stock - itemBought.quantity)
          };
        }
        return p;
      });
    });

    // Clear active shopping cart
    setCartItems([]);

    try {
      // 1. Insert order to Supabase
      const { error: orderErr } = await supabase.from('orders').insert([{
        id: newOrder.id,
        items: newOrder.items,
        total: newOrder.total,
        status: newOrder.status, // will be 'received'
        shipping_address: newOrder.shippingAddress,
        shipping_fee: newOrder.shippingFee,
        user_email: newOrder.userEmail || userProfile?.email || '',
        user_name: newOrder.userName || userProfile?.name || ''
      }]);
      if (orderErr) throw orderErr;

      // 2. Decrease stock in Supabase for each item
      for (const item of newOrder.items) {
        const currentProd = products.find(p => p.id === item.product.id);
        if (currentProd) {
          const newStock = Math.max(0, currentProd.stock - item.quantity);
          await supabase.from('products')
            .update({ stock: newStock })
            .eq('id', item.product.id);
        }
      }

      // 3. Trigger "Pedido Confirmado" email
      const buyerEmail = newOrder.userEmail || userProfile?.email;
      if (buyerEmail) {
        fetch(`${API_URL}/api/orders/status-change`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: buyerEmail, orderId: newOrder.id, newStatus: 'received' })
        }).catch(err => console.error('Order confirmation email error:', err));
      }

      addToast('Pedido registrado com sucesso na nuvem! 🛸🌌', 'success');
    } catch (err) {
      console.warn('Erro ao salvar pedido no Supabase. Mantendo no cache local:', err);
      addToast('Conectado ao cache local. Execute o script SQL no seu dashboard para sincronizar na nuvem! 🌐⚡', 'error');
    }
  };

  const handleAdvanceOrderStatus = async (orderId: string) => {
    let nextStatus: Order['status'] = 'processing';
    let orderEmail = '';
    let orderTrackingCode = '';
    setOrders((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === orderId) {
          nextStatus = ord.status === 'received' ? 'processing' :
                       ord.status === 'processing' ? 'warp_drive' : 
                       ord.status === 'warp_drive' ? 'delivered' : 'delivered';
          orderEmail = ord.userEmail || '';
          orderTrackingCode = ord.trackingCode || '';
          return {
            ...ord,
            status: nextStatus
          };
        }
        return ord;
      })
    );

    try {
      const { error } = await supabase.from('orders')
        .update({ status: nextStatus })
        .eq('id', orderId);
      if (error) throw error;
      addToast(`Status do pedido ${orderId} atualizado na nuvem! 🛰️`, 'success');

      // Trigger order status email
      if (orderEmail) {
        fetch(`${API_URL}/api/orders/status-change`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: orderEmail, orderId, newStatus: nextStatus, trackingCode: orderTrackingCode })
        }).catch(err => console.error('Email trigger error:', err));
      }
    } catch (err) {
      console.warn('Erro ao avançar status do pedido no Supabase:', err);
      addToast('Conectado ao cache local. Execute o script SQL no seu dashboard para sincronizar na nuvem! 🌐⚡', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status'], trackingCode?: string) => {
    let orderEmail = '';
    setOrders((prev) => prev.map(ord => {
      if (ord.id === orderId) {
        orderEmail = ord.userEmail || '';
        return { ...ord, status: newStatus, trackingCode: trackingCode !== undefined ? trackingCode : ord.trackingCode };
      }
      return ord;
    }));

    try {
      const payload: any = { status: newStatus };
      if (trackingCode !== undefined) {
        payload.tracking_code = trackingCode;
      }
      const { error } = await supabase.from('orders')
        .update(payload)
        .eq('id', orderId);
      if (error) throw error;
      addToast(`Pedido ${orderId} atualizado!`, 'success');

      // Trigger order status email
      if (orderEmail) {
        fetch(`${API_URL}/api/orders/status-change`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: orderEmail, orderId, newStatus, trackingCode: trackingCode || '' })
        }).catch(err => console.error('Email trigger error:', err));
      }
    } catch (err) {
      console.warn('Erro ao atualizar pedido:', err);
      addToast('Conectado ao cache local.', 'error');
    }
  };

  // ----------------------------------------------------
  // Handlers: Admin CRUD panel operations
  // ----------------------------------------------------
  const handleAddProduct = async (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);

    try {
      const { error } = await supabase.from('products').insert([{
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        old_price: newProduct.oldPrice,
        discount: newProduct.discount,
        image: newProduct.image,
        category: newProduct.category,
        is_new: newProduct.isNew,
        stock: newProduct.stock,
        specs: newProduct.specs,
        funny_review: newProduct.funnyReview,
        type: newProduct.type,
        affiliate_link: newProduct.affiliateLink,
        virtual_content: newProduct.virtualContent,
        order_bump_id: newProduct.orderBumpId,
        order_bump_discount: newProduct.orderBumpDiscount,
        gallery: newProduct.gallery || [],
        variations: newProduct.variations || [],
        tags: newProduct.tags || [],
        estilo_visual: newProduct.estiloVisual || [],
        prioridade: newProduct.prioridade || [],
        perfil_recomendado: newProduct.perfilRecomendado || [],
        popularidade: newProduct.popularidade || 0
      }]);
      if (error) throw error;
    } catch (err) {
      console.warn('Erro ao cadastrar produto no Supabase:', err);
      addToast('Conectado ao cache local. Execute o script SQL no seu dashboard para sincronizar na nuvem! 🌐⚡', 'error');
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    try {
      const { error } = await supabase.from('products').update({
        name: updatedProduct.name,
        description: updatedProduct.description,
        price: updatedProduct.price,
        old_price: updatedProduct.oldPrice,
        discount: updatedProduct.discount,
        image: updatedProduct.image,
        category: updatedProduct.category,
        is_new: updatedProduct.isNew,
        stock: updatedProduct.stock,
        specs: updatedProduct.specs,
        funny_review: updatedProduct.funnyReview,
        type: updatedProduct.type,
        affiliate_link: updatedProduct.affiliateLink,
        virtual_content: updatedProduct.virtualContent,
        order_bump_id: updatedProduct.orderBumpId,
        order_bump_discount: updatedProduct.orderBumpDiscount,
        gallery: updatedProduct.gallery || [],
        variations: updatedProduct.variations || [],
        tags: updatedProduct.tags || [],
        estilo_visual: updatedProduct.estiloVisual || [],
        prioridade: updatedProduct.prioridade || [],
        perfil_recomendado: updatedProduct.perfilRecomendado || [],
        popularidade: updatedProduct.popularidade || 0
      }).eq('id', updatedProduct.id);
      if (error) throw error;
    } catch (err) {
      console.warn('Erro ao atualizar produto no Supabase:', err);
      addToast('Conectado ao cache local. Execute o script SQL no seu dashboard para sincronizar na nuvem! 🌐⚡', 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));

    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
    } catch (err) {
      console.warn('Erro ao deletar produto no Supabase:', err);
      addToast('Conectado ao cache local. Execute o script SQL no seu dashboard para sincronizar na nuvem! 🌐⚡', 'error');
    }
  };

  // ----------------------------------------------------
  // Handlers: Categories CRUD
  // ----------------------------------------------------
  const handleAddCategory = async (cat: Category) => {
    setCategories(prev => [cat, ...prev]);
    try {
      const { error } = await supabase.from('categories').insert([{
        id: cat.id,
        name: cat.name,
        icon_name: cat.iconName,
        slug: cat.slug,
        image_url: cat.imageUrl || null
      }]);
      if (error) throw error;
    } catch (err) {
      console.warn('Erro ao cadastrar categoria no Supabase:', err);
      addToast('Conectado ao cache local. Execute o script SQL no seu dashboard para sincronizar na nuvem! 🌐⚡', 'error');
    }
  };

  const handleUpdateCategory = async (cat: Category) => {
    setCategories(prev => prev.map(c => c.id === cat.id ? cat : c));
    try {
      const { error } = await supabase.from('categories').update({
        name: cat.name,
        icon_name: cat.iconName,
        slug: cat.slug,
        image_url: cat.imageUrl || null
      }).eq('id', cat.id);
      if (error) throw error;
    } catch (err) {
      console.warn('Erro ao atualizar categoria no Supabase:', err);
      addToast('Conectado ao cache local. Execute o script SQL no seu dashboard para sincronizar na nuvem! 🌐⚡', 'error');
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    try {
      const { error } = await supabase.from('categories').delete().eq('id', catId);
      if (error) throw error;
    } catch (err) {
      console.warn('Erro ao deletar categoria no Supabase:', err);
      addToast('Conectado ao cache local. Execute o script SQL no seu dashboard para sincronizar na nuvem! 🌐⚡', 'error');
    }
  };

  // Admin logout
  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setAdminLoggedIn(false);
    window.history.pushState({}, '', '/');
    window.location.reload();
  };

  // ----------------------------------------------------
  // View Router (Local state-based SPA router)
  // ----------------------------------------------------
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            products={products}
            categories={categories}
            banners={banners}
            favorites={favorites}
            userProfile={userProfile}
            storeSettings={storeSettings}
            testimonials={testimonials}
            brands={brands}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
            onSelectBanner={handleSelectBanner}
            onSelectProduct={handleViewProduct}
            addToast={addToast}
            onSelectCategoryClick={(slug) => {
              setShopCategory(slug);
              setCurrentView('shop');
            }}
            onOpenAddressModal={() => setShowAddressModal(true)}
          />
        );
      case 'cart':
        return (
          <CartView
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveFromCart}
            onPlaceOrder={handlePlaceOrder}
            addToast={addToast}
            setCurrentView={setCurrentView}
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
          />
        );
      case 'favorites':
        return (
          <FavoritesView
            products={products}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            addToast={addToast}
            setCurrentView={setCurrentView}
          />
        );
      case 'orders':
        return (
          <OrdersView
            orders={orders}
            onAdvanceOrderStatus={handleAdvanceOrderStatus}
            addToast={addToast}
            setCurrentView={setCurrentView}
          />
        );
      case 'profile':
      case 'profile-missions':
        return (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            addToast={addToast}
            onLogout={handleLogout}
            orders={orders}
            initialTab={currentView === 'profile-missions' ? 'missions' : 'profile'}
          />
        );
      case 'admin':
        return null; // now handled via /painel-admin-loja-plugin route
      case 'product-detail':
        return (
          <ProductDetailView
            productId={selectedProductId || ''}
            products={products}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleViewProduct}
            addToast={addToast}
            setCurrentView={setCurrentView}
            paymentSettings={paymentSettings}
            userProfile={userProfile}
            onOpenAddressModal={() => setShowAddressModal(true)}
            reviews={reviews}
            onAddReview={(review) => {
              setReviews(prev => [...prev, review]);
              addToast('✅ Sua avaliação foi enviada e está aguardando aprovação!', 'success');
            }}
          />);
      case 'shop':
        return (
          <ShopView
            products={products}
            categories={categories}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleViewProduct}
            addToast={addToast}
            initialCategory={shopCategory}
            onClearInitialCategory={() => setShopCategory(null)}
          />
        );
      case 'setup-quiz':
        return (
          <SetupQuizView
            products={products}
            categories={categories}
            quizConfig={quizConfig}
            onComplete={(result) => {
              setQuizResult(result);
              setCurrentView('setup-result');
            }}
            onClose={() => setCurrentView('home')}
          />
        );
      case 'setup-result':
        return quizResult ? (
          <SetupResultView
            result={quizResult}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleViewProduct}
            onRetakeQuiz={() => {
              setQuizResult(null);
              setCurrentView('setup-quiz');
            }}
            onGoToShop={() => setCurrentView('shop')}
            addToast={addToast}
          />
        ) : null;
      default:
        setCurrentView('home');
        return null;
    }
  };

  // Cart total item count calculation
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // -------------------------------------------------------
  // ADMIN ROUTE: /painel-admin-loja-plugin
  // -------------------------------------------------------
  if (isAdminRoute) {
    if (!adminLoggedIn) {
      return (
        <>
          <div className="toast-container">
            {toasts.map(t => (
              <div key={t.id} className={`toast-alert ${t.type === 'error' ? 'error' : ''}`}>
                <span className="toast-message">{t.message}</span>
              </div>
            ))}
          </div>
          <AdminLoginView onLoginSuccess={() => setAdminLoggedIn(true)} />
        </>
      );
    }
    return (
      <>
        <div className="toast-container">
          {toasts.map(t => (
            <div key={t.id} className={`toast-alert ${t.type === 'error' ? 'error' : ''}`}>
              <span className="toast-message">{t.message}</span>
            </div>
          ))}
        </div>
        <AdminPanel
          products={products}
          categories={categories}
          banners={banners}
          orders={orders}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateBanners={setBanners}
          onAddCategory={handleAddCategory}
          onUpdateCategory={handleUpdateCategory}
          onDeleteCategory={handleDeleteCategory}
          onAdvanceOrderStatus={handleAdvanceOrderStatus}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          storeSettings={storeSettings}
          testimonials={testimonials}
          brands={brands}
          paymentSettings={paymentSettings}
          onUpdateStoreSettings={setStoreSettings}
          onUpdateTestimonials={(newTestimonials) => {
            setTestimonials(newTestimonials);
            localStorage.setItem('plugin_testimonials', JSON.stringify(newTestimonials));
          }}
          reviews={reviews}
          onUpdateReviews={(newReviews) => {
            setReviews(newReviews);
          }}
          onUpdateBrands={setBrands}
          onUpdatePaymentSettings={setPaymentSettings}
          quizConfig={quizConfig}
          onUpdateQuizConfig={(newConfig) => {
            setQuizConfig(newConfig);
            localStorage.setItem('plugin_quiz_config', JSON.stringify(newConfig));
          }}
          addToast={addToast}
          onLogout={handleAdminLogout}
        />
      </>
    );
  }

  // -------------------------------------------------------
  // MAIN STORE APP
  // -------------------------------------------------------
  return (
    <div className="app-container">
      {/* Toast alert float notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-alert ${t.type === 'error' ? 'error' : ''}`}>
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Main Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        cartCount={totalCartCount}
        cartItems={cartItems}
        userProfile={userProfile}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        dbConnected={dbConnected}
        favoritesCount={favorites.length}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        categories={categories}
        showAddressModal={showAddressModal}
        setShowAddressModal={setShowAddressModal}
      />

      {/* Primary Scrollable View Frame */}
      <main className="main-content">
        {renderCurrentView()}
      </main>

      <Footer paymentMethods={paymentSettings.paymentMethods} addToast={addToast} />

      {/* Bottom Floating Menu for Mobile/Tablet */}
      <nav className="floating-bottom-nav">
        <div className={`bottom-nav-item ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>
          <Compass size={22} /><span>Home</span>
        </div>
        <div className={`bottom-nav-item ${currentView === 'favorites' ? 'active' : ''}`} onClick={() => setCurrentView('favorites')}>
          <Heart size={22} /><span>Favoritos</span>
        </div>
        <div className="floating-cart-item" onClick={() => setCurrentView('cart')}>
          <ShoppingCart size={24} />
          {totalCartCount > 0 && <span className="floating-cart-badge">{totalCartCount}</span>}
        </div>
        <div className={`bottom-nav-item ${currentView === 'orders' ? 'active' : ''}`} onClick={() => setCurrentView('orders')}>
          <Receipt size={22} /><span>Pedidos</span>
        </div>
        <div className={`bottom-nav-item ${currentView === 'profile' ? 'active' : ''}`} onClick={() => setCurrentView('profile')}>
          <User size={22} /><span>Perfil</span>
        </div>
      </nav>
    </div>
  );
}

export default App;
