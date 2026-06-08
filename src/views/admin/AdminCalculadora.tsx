import React, { useState } from 'react';
import { Calculator, DollarSign, Percent } from 'lucide-react';

const AdminCalculadora: React.FC = () => {
  // Configurações Gerais
  const [cotacaoDolar, setCotacaoDolar] = useState<number>(5.15);
  const [custoProdutoDolar, setCustoProdutoDolar] = useState<number>(5.00);
  const [taxaIofSpread, setTaxaIofSpread] = useState<number>(4.7); // 4.7% IOF padrão BR

  // Variáveis Comuns
  const [oscilacaoCambioPercent, setOscilacaoCambioPercent] = useState<number>(10);
  const [impostosPercent, setImpostosPercent] = useState<number>(7);
  const [cartaoPercent, setCartaoPercent] = useState<number>(5);
  const [marketingPercent, setMarketingPercent] = useState<number>(10);
  const [devolucaoPercent, setDevolucaoPercent] = useState<number>(3);
  const [plataformaPercent, setPlataformaPercent] = useState<number>(16);
  const [custoVendaFix, setCustoVendaFix] = useState<number>(0);
  const [custoFreteFix, setCustoFreteFix] = useState<number>(0);
  const [outroCustoFix, setOutroCustoFix] = useState<number>(0);

  // Lado Esquerdo (Calculado por Markup)
  const [markupDesejado, setMarkupDesejado] = useState<number>(3.0);

  // Lado Direito (Calculado por Preço Desejado)
  const [precoDesejado, setPrecoDesejado] = useState<number>(88.94);

  // --- Cálculos ---
  const custoDolarReal = custoProdutoDolar * cotacaoDolar;
  const custoProdutoReais = custoDolarReal * (1 + taxaIofSpread / 100);

  // Deduções (% somadas)
  const totalDeducoesPercent = impostosPercent + cartaoPercent + marketingPercent + devolucaoPercent + plataformaPercent;
  const totalDeducoesFix = custoVendaFix + custoFreteFix + outroCustoFix;

  // Lado 1: Calculado por Markup
  const oscilacaoCambio1 = custoProdutoReais * (oscilacaoCambioPercent / 100);
  const precoCalculado = (custoProdutoReais + oscilacaoCambio1) * markupDesejado;
  const lucroBruto1 = precoCalculado - custoProdutoReais;
  const deducoes1Valor = (precoCalculado * (totalDeducoesPercent / 100)) + totalDeducoesFix;
  const margemContribuicao1 = precoCalculado - custoProdutoReais - deducoes1Valor;

  // Lado 2: Preço Desejado
  const oscilacaoCambio2 = custoProdutoReais * (oscilacaoCambioPercent / 100);
  // Preço Desejado = (Custo + Oscilação) * Markup Calculado
  const markupCalculado = precoDesejado / (custoProdutoReais + oscilacaoCambio2);
  const lucroBruto2 = precoDesejado - custoProdutoReais;
  const deducoes2Valor = (precoDesejado * (totalDeducoesPercent / 100)) + totalDeducoesFix;
  const margemContribuicao2 = precoDesejado - custoProdutoReais - deducoes2Valor;

  // Helper para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Calculator size={28} className="neon-text" />
        <div>
          <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>Calculadora de Precificação</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Simule seus preços e margens de Dropshipping</p>
        </div>
      </div>

      {/* Top Header - Entradas Base */}
      <div style={{ 
        display: 'flex', gap: '24px', flexWrap: 'wrap', 
        backgroundColor: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '32px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="form-group" style={{ minWidth: '180px' }}>
          <label className="cyber-label">Cotação do Dólar HOJE</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="number" step="0.01" className="cyber-input" style={{ paddingLeft: '36px' }}
              value={cotacaoDolar} onChange={(e) => setCotacaoDolar(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="form-group" style={{ minWidth: '180px' }}>
          <label className="cyber-label">Custo do Produto ($)</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="number" step="0.01" className="cyber-input" style={{ paddingLeft: '36px' }}
              value={custoProdutoDolar} onChange={(e) => setCustoProdutoDolar(Number(e.target.value))}
            />
          </div>
        </div>
        <div className="form-group" style={{ minWidth: '180px' }}>
          <label className="cyber-label">Taxa IOF / Spread (%)</label>
          <div style={{ position: 'relative' }}>
            <Percent size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="number" step="0.1" className="cyber-input" style={{ paddingLeft: '36px' }}
              value={taxaIofSpread} onChange={(e) => setTaxaIofSpread(Number(e.target.value))}
            />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '180px', paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>Custo Base em Reais (com IOF)</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-text-white)' }}>{formatCurrency(custoProdutoReais)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Lado Esquerdo - Markup */}
        <div style={{ border: '1px solid var(--color-primary)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'rgba(69, 230, 39, 0.1)', padding: '16px', borderBottom: '1px solid var(--color-primary)' }}>
            <h3 style={{ margin: 0, textAlign: 'center', color: 'var(--color-primary)' }}>Preço Calculado por Markup</h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Custo do Produto em Reais</span>
              <strong>{formatCurrency(custoProdutoReais)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Oscilação de Câmbio</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input type="number" value={oscilacaoCambioPercent} onChange={e => setOscilacaoCambioPercent(Number(e.target.value))} className="cyber-input" style={{ width: '80px', padding: '4px 8px' }} />
                <span>% =</span>
                <span style={{ color: '#ff4444' }}>{formatCurrency(oscilacaoCambio1)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-white)', fontWeight: 'bold' }}>Markup DESEJADO (x)</span>
              <input type="number" step="0.1" value={markupDesejado} onChange={e => setMarkupDesejado(Number(e.target.value))} className="cyber-input" style={{ width: '100px', borderColor: 'var(--color-primary)' }} />
            </div>

            <div style={{ backgroundColor: 'var(--color-primary)', color: '#000', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Preço CALCULADO</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.4rem' }}>{formatCurrency(precoCalculado)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontStyle: 'italic' }}>
              <span>Lucro Bruto</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>{formatCurrency(lucroBruto1)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{formatPercent((lucroBruto1/precoCalculado)*100 || 0)}</span>
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

            {/* Deduções */}
            <h4 style={{ marginBottom: '16px', color: 'var(--color-text-white)' }}>Deduções</h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Impostos</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" value={impostosPercent} onChange={e => setImpostosPercent(Number(e.target.value))} className="cyber-input" style={{ width: '60px', padding: '2px 8px', height: '24px' }} /> %
                <span style={{ color: '#ff4444', width: '80px', textAlign: 'right' }}>{formatCurrency(precoCalculado * (impostosPercent/100))}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>% de Cartão</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" value={cartaoPercent} onChange={e => setCartaoPercent(Number(e.target.value))} className="cyber-input" style={{ width: '60px', padding: '2px 8px', height: '24px' }} /> %
                <span style={{ color: '#ff4444', width: '80px', textAlign: 'right' }}>{formatCurrency(precoCalculado * (cartaoPercent/100))}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>% de Marketing Ads</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" value={marketingPercent} onChange={e => setMarketingPercent(Number(e.target.value))} className="cyber-input" style={{ width: '60px', padding: '2px 8px', height: '24px' }} /> %
                <span style={{ color: '#ff4444', width: '80px', textAlign: 'right' }}>{formatCurrency(precoCalculado * (marketingPercent/100))}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>% Devolução/Canc.</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" value={devolucaoPercent} onChange={e => setDevolucaoPercent(Number(e.target.value))} className="cyber-input" style={{ width: '60px', padding: '2px 8px', height: '24px' }} /> %
                <span style={{ color: '#ff4444', width: '80px', textAlign: 'right' }}>{formatCurrency(precoCalculado * (devolucaoPercent/100))}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Comissão Plataforma</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" value={plataformaPercent} onChange={e => setPlataformaPercent(Number(e.target.value))} className="cyber-input" style={{ width: '60px', padding: '2px 8px', height: '24px' }} /> %
                <span style={{ color: '#ff4444', width: '80px', textAlign: 'right' }}>{formatCurrency(precoCalculado * (plataformaPercent/100))}</span>
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Custo de Venda (R$)</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" value={custoVendaFix} onChange={e => setCustoVendaFix(Number(e.target.value))} className="cyber-input" style={{ width: '80px', padding: '2px 8px', height: '24px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Custo de Frete (R$)</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" value={custoFreteFix} onChange={e => setCustoFreteFix(Number(e.target.value))} className="cyber-input" style={{ width: '80px', padding: '2px 8px', height: '24px' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem' }}>
              <span>Outro Custo (R$)</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input type="number" value={outroCustoFix} onChange={e => setOutroCustoFix(Number(e.target.value))} className="cyber-input" style={{ width: '80px', padding: '2px 8px', height: '24px' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
              <span>Total de Deduções</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ color: '#ff4444' }}>{formatCurrency(deducoes1Valor)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{formatPercent(totalDeducoesPercent + (totalDeducoesFix/precoCalculado*100 || 0))}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Margem de Contribuição</span>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: margemContribuicao1 >= 0 ? 'var(--color-primary)' : '#ff4444' }}>
                  {formatCurrency(margemContribuicao1)}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {formatPercent((margemContribuicao1/precoCalculado)*100 || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito - Preço Desejado */}
        <div style={{ border: '1px solid #4da6ff', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'rgba(77, 166, 255, 0.1)', padding: '16px', borderBottom: '1px solid #4da6ff' }}>
            <h3 style={{ margin: 0, textAlign: 'center', color: '#4da6ff' }}>Cálculo de Preço DESEJADO</h3>
          </div>
          
          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Custo do Produto em Reais</span>
              <strong>{formatCurrency(custoProdutoReais)}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Oscilação de Câmbio</span>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>{formatPercent(oscilacaoCambioPercent)}</span>
                <span style={{ color: '#ff4444' }}>{formatCurrency(oscilacaoCambio2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', alignItems: 'center' }}>
              <span style={{ color: 'var(--color-text-white)', fontWeight: 'bold' }}>Markup CALCULADO (x)</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{markupCalculado.toFixed(2)}</span>
            </div>

            <div style={{ backgroundColor: '#4da6ff', color: '#000', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Preço DESEJADO</span>
              <input 
                type="number" step="0.01" 
                value={precoDesejado} 
                onChange={e => setPrecoDesejado(Number(e.target.value))} 
                style={{ width: '140px', fontSize: '1.4rem', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', border: 'none', textAlign: 'right' }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontStyle: 'italic' }}>
              <span>Lucro Bruto</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span>{formatCurrency(lucroBruto2)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{formatPercent((lucroBruto2/precoDesejado)*100 || 0)}</span>
              </div>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

            {/* Deduções Espelhadas */}
            <h4 style={{ marginBottom: '16px', color: 'var(--color-text-white)' }}>Deduções (Calculadas pelo Preço Desejado)</h4>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Impostos ({formatPercent(impostosPercent)})</span>
              <span style={{ color: '#ff4444' }}>{formatCurrency(precoDesejado * (impostosPercent/100))}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>% de Cartão ({formatPercent(cartaoPercent)})</span>
              <span style={{ color: '#ff4444' }}>{formatCurrency(precoDesejado * (cartaoPercent/100))}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>% de Marketing Ads ({formatPercent(marketingPercent)})</span>
              <span style={{ color: '#ff4444' }}>{formatCurrency(precoDesejado * (marketingPercent/100))}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>% Devolução/Canc. ({formatPercent(devolucaoPercent)})</span>
              <span style={{ color: '#ff4444' }}>{formatCurrency(precoDesejado * (devolucaoPercent/100))}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Comissão Plataforma ({formatPercent(plataformaPercent)})</span>
              <span style={{ color: '#ff4444' }}>{formatCurrency(precoDesejado * (plataformaPercent/100))}</span>
            </div>

            <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '16px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Custo de Venda</span>
              <span style={{ color: '#ff4444' }}>{formatCurrency(custoVendaFix)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
              <span>Custo de Frete</span>
              <span style={{ color: '#ff4444' }}>{formatCurrency(custoFreteFix)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem' }}>
              <span>Outro Custo</span>
              <span style={{ color: '#ff4444' }}>{formatCurrency(outroCustoFix)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 'bold' }}>
              <span>Total de Deduções</span>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ color: '#ff4444' }}>{formatCurrency(deducoes2Valor)}</span>
                <span style={{ color: 'var(--color-text-muted)' }}>{formatPercent(totalDeducoesPercent + (totalDeducoesFix/precoDesejado*100 || 0))}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '8px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Margem de Contribuição</span>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: margemContribuicao2 >= 0 ? '#4da6ff' : '#ff4444' }}>
                  {formatCurrency(margemContribuicao2)}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  {formatPercent((margemContribuicao2/precoDesejado)*100 || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCalculadora;
