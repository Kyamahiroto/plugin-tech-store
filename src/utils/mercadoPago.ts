import { CartItem } from '../types';
import { API_URL } from './api';

export const createMercadoPagoPreference = async (
  cartItems: CartItem[], 
  payerName: string,
  payerEmail: string,
  shippingFee: number,
  orderBumpItem?: CartItem | null
) => {
  // Format items for Mercado Pago
  const items = cartItems.map(item => ({
    title: item.product.name,
    description: item.product.description.substring(0, 250),
    picture_url: item.product.image.startsWith('http') ? item.product.image : '',
    category_id: item.product.category,
    quantity: item.quantity,
    currency_id: 'BRL',
    unit_price: Number(item.product.price.toFixed(2))
  }));

  if (orderBumpItem) {
    items.push({
      title: orderBumpItem.product.name,
      description: orderBumpItem.product.description.substring(0, 250),
      picture_url: orderBumpItem.product.image.startsWith('http') ? orderBumpItem.product.image : '',
      category_id: orderBumpItem.product.category,
      quantity: orderBumpItem.quantity,
      currency_id: 'BRL',
      unit_price: Number(orderBumpItem.product.price.toFixed(2))
    });
  }

  // Add shipping fee as an item if greater than 0
  if (shippingFee > 0) {
    items.push({
      title: 'Taxa de Entrega',
      description: 'Custo do portal de despacho interestelar',
      picture_url: '',
      category_id: 'shipping',
      quantity: 1,
      currency_id: 'BRL',
      unit_price: Number(shippingFee.toFixed(2))
    });
  }

  const preference = {
    items,
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
