import { CartItem } from '../types';
import { API_URL } from './api';

export const createMercadoPagoPreference = async (
  cartItems: CartItem[], 
  payerName: string,
  payerEmail: string,
  shippingFee: number,
  orderBumpItem?: CartItem | null,
  useAliencoins: boolean = false,
  useWalletBalance: boolean = false,
  walletAvailable: number = 0,
  aliencoinsAvailable: number = 0
) => {
  // Format items for Backend (Sending ONLY id and quantity to prevent price manipulation)
  const items = cartItems.map(item => ({
    id: item.product.id,
    quantity: item.quantity
  }));

  if (orderBumpItem) {
    items.push({
      id: orderBumpItem.product.id,
      quantity: orderBumpItem.quantity
    });
  }

  const preference = {
    items,
    shippingFee,
    useAliencoins,
    useWalletBalance,
    walletAvailable,
    aliencoinsAvailable,
    payer: {
      name: payerName.split(' ')[0] || 'Terráqueo',
      surname: payerName.split(' ').slice(1).join(' ') || 'Anônimo',
      email: payerEmail || 'cliente@terracosmica.com'
    },
    back_urls: {
      success: 'https://lojaplugin.store/',
      failure: 'https://lojaplugin.store/',
      pending: 'https://lojaplugin.store/'
    },
    auto_return: 'approved',
    payment_methods: {
      installments: 12
    }
  };

  try {
    const response = await fetch(`${API_URL}/api/create-preference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preference)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend Error:', errorData);
      throw new Error('Falha ao gerar o link de pagamento interestelar no backend.');
    }

    const data = await response.json();
    return data.init_point; // URL for redirect
  } catch (error) {
    console.error('Erro na integração do Mercado Pago (Backend):', error);
    throw error;
  }
};
