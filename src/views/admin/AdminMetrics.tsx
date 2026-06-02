import React, { useState, useMemo } from 'react';
import { Order, Product } from '../../types';
import { BarChart3, TrendingUp, DollarSign, Package, MapPin, BrainCircuit, Calendar, PieChart } from 'lucide-react';

interface AdminMetricsProps {
  orders: Order[];
  products: Product[];
}

const AdminMetrics: React.FC<AdminMetricsProps> = ({ orders }) => {
  const [timeRange, setTimeRange] = useState<'7' | '30' | 'all'>('all');

  // Filter orders by time
  const filteredOrders = useMemo(() => {
    const now = new Date().getTime();
    return orders.filter(o => {
      if (timeRange === 'all') return true;
      const orderDate = new Date(o.date).getTime();
      const diffDays = Math.ceil(Math.abs(now - orderDate) / (1000 * 60 * 60 * 24));
      return diffDays <= parseInt(timeRange);
    });
  }, [orders, timeRange]);

  // Calculate top-level KPIs
  const { totalRevenue, totalItems } = useMemo(() => {
    let rev = 0;
    let items = 0;
    filteredOrders.forEach(o => {
      rev += o.total;
      o.items.forEach(i => {
        items += i.quantity;
      });
    });
    return { totalRevenue: rev, totalItems: items };
  }, [filteredOrders]);

  const totalOrders = filteredOrders.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Calculate Top Products
  const topProducts = useMemo(() => {
    const map: Record<string, { name: string; quantity: number; revenue: number }> = {};
    filteredOrders.forEach(o => {
      o.items.forEach(i => {
        if (!map[i.product.id]) {
          map[i.product.id] = { name: i.product.name, quantity: 0, revenue: 0 };
        }
        map[i.product.id].quantity += i.quantity;
        map[i.product.id].revenue += i.product.price * i.quantity;
      });
    });
    return Object.values(map).sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  }, [filteredOrders]);

  // Calculate Sales by Category
  const categorySales = useMemo(() => {
    const map: Record<string, number> = {};
    filteredOrders.forEach(o => {
      o.items.forEach(i => {
        const cat = i.product.category || 'Outros';
        map[cat] = (map[cat] || 0) + i.quantity;
      });
    });
    const sorted = Object.entries(map).sort((a, b) => b[1] - a[1]);
    return sorted;
  }, [filteredOrders]);

  // Calculate Sales by Region
  const regionSales = useMemo(() => {
    const map: Record<string, { orders: number; revenue: number }> = {};
    filteredOrders.forEach(o => {
      const city = o.shippingAddress?.city || 'Desconhecida';
      if (!map[city]) map[city] = { orders: 0, revenue: 0 };
      map[city].orders += 1;
      map[city].revenue += o.total;
    });
    return Object.entries(map).sort((a, b) => b[1].orders - a[1].orders).slice(0, 5);
  }, [filteredOrders]);

  // Format currency
  const formatBRL = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;

  // AI Strategic Insights
  const aiInsights = useMemo(() => {
    const insights: string[] = [];
    if (totalOrders === 0) {
      insights.push("Não há dados suficientes no período selecionado para gerar insights.");
      return insights;
    }

    if (avgTicket < 150) {
      insights.push(`O ticket médio atual está em ${formatBRL(avgTicket)}. Sugerimos criar promoções de "Order Bump" ou oferecer Frete Grátis acima de R$ 200 para aumentar o valor por pedido.`);
    }

    if (categorySales.length > 0) {
      const topCat = categorySales[0];
      const percent = Math.round((topCat[1] / totalItems) * 100);
      if (percent > 50) {
        insights.push(`A categoria "${topCat[0]}" representa ${percent}% das suas vendas. Crie combos ("Compre Junto") unindo essa categoria aos produtos de menor saída.`);
      }
    }

    if (regionSales.length > 0) {
      const topRegion = regionSales[0];
      if (topRegion[1].orders > totalOrders * 0.4) {
        insights.push(`Forte concentração de vendas em ${topRegion[0]} (${topRegion[1].orders} pedidos). Pode ser interessante buscar parcerias de logística ou campanhas de marketing localizadas para esta região.`);
      }
    }

    if (insights.length === 0) {
      insights.push("Seus indicadores estão equilibrados no momento. Continue monitorando as campanhas atuais.");
    }

    return insights;
  }, [totalOrders, avgTicket, categorySales, totalItems, regionSales]);

  return (
    <div className="admin-section">
      <div className="admin-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>📊 Métricas & BI</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Centro de inteligência e performance da loja</p>
        </div>
        <div className="metrics-filters">
          <Calendar size={16} />
          <select 
            className="cyber-input" 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value as any)}
            style={{ width: '150px', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <option value="7">Últimos 7 dias</option>
            <option value="30">Últimos 30 dias</option>
            <option value="all">Todo o Período</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="metrics-kpi-grid">
        <div className="metrics-kpi-card">
          <div className="metrics-kpi-icon" style={{ color: '#45e627', background: 'rgba(69,230,39,0.1)' }}><DollarSign size={24} /></div>
          <div className="metrics-kpi-info">
            <span className="metrics-kpi-label">Faturamento Total</span>
            <span className="metrics-kpi-value">{formatBRL(totalRevenue)}</span>
          </div>
        </div>
        <div className="metrics-kpi-card">
          <div className="metrics-kpi-icon" style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.1)' }}><TrendingUp size={24} /></div>
          <div className="metrics-kpi-info">
            <span className="metrics-kpi-label">Ticket Médio</span>
            <span className="metrics-kpi-value">{formatBRL(avgTicket)}</span>
          </div>
        </div>
        <div className="metrics-kpi-card">
          <div className="metrics-kpi-icon" style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.1)' }}><ShoppingCart size={24} /></div>
          <div className="metrics-kpi-info">
            <span className="metrics-kpi-label">Total de Pedidos</span>
            <span className="metrics-kpi-value">{totalOrders}</span>
          </div>
        </div>
        <div className="metrics-kpi-card">
          <div className="metrics-kpi-icon" style={{ color: '#f59e0b', background: 'rgba(245,158,11,0.1)' }}><Package size={24} /></div>
          <div className="metrics-kpi-info">
            <span className="metrics-kpi-label">Itens Vendidos</span>
            <span className="metrics-kpi-value">{totalItems}</span>
          </div>
        </div>
      </div>

      <div className="metrics-dashboard-grid">
        {/* Top Products Chart */}
        <div className="metrics-panel">
          <h3 className="metrics-panel-title"><BarChart3 size={18} /> Produtos Mais Vendidos</h3>
          {topProducts.length > 0 ? (
            <div className="metrics-bar-chart">
              {topProducts.map((p, idx) => {
                const maxQty = topProducts[0].quantity;
                const percent = Math.max((p.quantity / maxQty) * 100, 5); // min 5% visual
                return (
                  <div key={idx} className="metrics-bar-row">
                    <div className="metrics-bar-info">
                      <span className="metrics-bar-name" title={p.name}>{p.name}</span>
                      <span className="metrics-bar-val">{p.quantity} un. ({formatBRL(p.revenue)})</span>
                    </div>
                    <div className="metrics-bar-track">
                      <div className="metrics-bar-fill" style={{ width: `${percent}%`, backgroundColor: '#45e627' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
             <div className="metrics-empty">Nenhum dado de vendas no período.</div>
          )}
        </div>

        {/* Categories Breakdown */}
        <div className="metrics-panel">
          <h3 className="metrics-panel-title"><PieChart size={18} /> Vendas por Categoria</h3>
          {categorySales.length > 0 ? (
            <div className="metrics-bar-chart">
              {categorySales.map(([cat, qty], idx) => {
                const percent = Math.round((qty / totalItems) * 100);
                const colors = ['#a78bfa', '#3b82f6', '#f59e0b', '#ec4899', '#14b8a6', '#f43f5e'];
                const color = colors[idx % colors.length];
                return (
                  <div key={cat} className="metrics-bar-row">
                    <div className="metrics-bar-info">
                      <span className="metrics-bar-name" style={{ textTransform: 'capitalize' }}>{cat}</span>
                      <span className="metrics-bar-val">{qty} un. ({percent}%)</span>
                    </div>
                    <div className="metrics-bar-track">
                      <div className="metrics-bar-fill" style={{ width: `${percent}%`, backgroundColor: color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="metrics-empty">Nenhuma categoria vendida.</div>
          )}
        </div>

        {/* Regions */}
        <div className="metrics-panel">
          <h3 className="metrics-panel-title"><MapPin size={18} /> Principais Regiões (Cidades)</h3>
          {regionSales.length > 0 ? (
            <div className="metrics-bar-chart">
              {regionSales.map(([city, data]) => {
                const maxOrders = regionSales[0][1].orders;
                const percent = Math.max((data.orders / maxOrders) * 100, 5);
                return (
                  <div key={city} className="metrics-bar-row">
                    <div className="metrics-bar-info">
                      <span className="metrics-bar-name">{city}</span>
                      <span className="metrics-bar-val">{data.orders} pedidos ({formatBRL(data.revenue)})</span>
                    </div>
                    <div className="metrics-bar-track">
                      <div className="metrics-bar-fill" style={{ width: `${percent}%`, backgroundColor: '#3b82f6' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="metrics-empty">Nenhum pedido registrado no período.</div>
          )}
        </div>

        {/* AI Insights (Strategic Recommendations) */}
        <div className="metrics-panel metrics-ai-panel">
          <h3 className="metrics-panel-title metrics-ai-title">
            <BrainCircuit size={20} className="metrics-ai-icon" /> 
            Insights Estratégicos Inteligentes
          </h3>
          <div className="metrics-ai-content">
            <p className="metrics-ai-subtitle">Nossa IA analisou os dados atuais e sugere:</p>
            <ul className="metrics-ai-list">
              {aiInsights.map((insight, i) => (
                <li key={i}>
                  <div className="metrics-ai-bullet"></div>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lucide icon replacement since ShoppingCart wasn't imported at top
import { ShoppingCart } from 'lucide-react';

export default AdminMetrics;
