import React, { useMemo, useState } from 'react';
import { Calculator, DollarSign, Percent, TrendingUp, AlertTriangle } from 'lucide-react';

const AdminCalculadora: React.FC = () => {
  const [custoProdutoUsd, setCustoProdutoUsd] = useState(0);
  const [cotacaoDolar, setCotacaoDolar] = useState(0);
  const [iofSpreadPercent, setIofSpreadPercent] = useState(0);
  const [freteFornecedorUsd, setFreteFornecedorUsd] = useState(0);
  const [seguroUsd, setSeguroUsd] = useState(0);

  const [impostoImportacaoPercent, setImpostoImportacaoPercent] = useState(0);
  const [icmsPercent, setIcmsPercent] = useState(0);
  const [freteCliente, setFreteCliente] = useState(0);
  const [embalagem, setEmbalagem] = useState(0);
  const [custoOperacional, setCustoOperacional] = useState(0);

  const [taxaGatewayPercent, setTaxaGatewayPercent] = useState(0);
  const [taxaGatewayFixa, setTaxaGatewayFixa] = useState(0);
  const [taxaPlataformaPercent, setTaxaPlataformaPercent] = useState(0);
  const [impostoVendaPercent, setImpostoVendaPercent] = useState(0);
  const [perdasPercent, setPerdasPercent] = useState(0);

  const [cacDesejado, setCacDesejado] = useState(0);
  const [margemLiquidaAlvo, setMargemLiquidaAlvo] = useState(0);
  const [precoTeste, setPrecoTeste] = useState(0);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number.isFinite(value) ? value : 0);

  const formatPercent = (value: number) => `${(Number.isFinite(value) ? value : 0).toFixed(2)}%`;

  const calc = useMemo(() => {
    const custoCompraUsd = custoProdutoUsd + freteFornecedorUsd + seguroUsd;
    const custoCompraBruto = custoCompraUsd * cotacaoDolar;
    const custoCompraComCambio = custoCompraBruto * (1 + iofSpreadPercent / 100);
    const impostoImportacao = custoCompraComCambio * (impostoImportacaoPercent / 100);
    const icms = (custoCompraComCambio + impostoImportacao) * (icmsPercent / 100);
    const custoProdutoEntregue = custoCompraComCambio + impostoImportacao + icms;
    const custosFixosOperacao = freteCliente + embalagem + custoOperacional + taxaGatewayFixa;
    const custoFixoTotal = custoProdutoEntregue + custosFixosOperacao + cacDesejado;
    const taxasVariaveisPercent = taxaGatewayPercent + taxaPlataformaPercent + impostoVendaPercent + perdasPercent;
    const divisorPreco = 1 - (taxasVariaveisPercent + margemLiquidaAlvo) / 100;
    const precoSugerido = divisorPreco > 0 ? custoFixoTotal / divisorPreco : 0;

    const calcularResultado = (preco: number) => {
      const taxasVariaveis = preco * (taxasVariaveisPercent / 100);
      const lucroLiquido = preco - custoProdutoEntregue - custosFixosOperacao - cacDesejado - taxasVariaveis;
      const margemLiquida = preco > 0 ? (lucroLiquido / preco) * 100 : 0;
      const markup = custoProdutoEntregue > 0 ? preco / custoProdutoEntregue : 0;
      const roiProduto = (custoProdutoEntregue + custosFixosOperacao + cacDesejado) > 0
        ? (lucroLiquido / (custoProdutoEntregue + custosFixosOperacao + cacDesejado)) * 100
        : 0;
      const lucroAntesAds = preco - custoProdutoEntregue - custosFixosOperacao - taxasVariaveis;
      const cacMaximo = Math.max(0, lucroAntesAds);
      const roasEquilibrio = cacMaximo > 0 ? preco / cacMaximo : 0;

      return {
        taxasVariaveis,
        lucroLiquido,
        margemLiquida,
        markup,
        roiProduto,
        lucroAntesAds,
        cacMaximo,
        roasEquilibrio
      };
    };

    return {
      custoCompraUsd,
      custoCompraComCambio,
      impostoImportacao,
      icms,
      custoProdutoEntregue,
      custosFixosOperacao,
      taxasVariaveisPercent,
      precoSugerido,
      sugerido: calcularResultado(precoSugerido),
      teste: calcularResultado(precoTeste)
    };
  }, [
    custoProdutoUsd,
    freteFornecedorUsd,
    seguroUsd,
    cotacaoDolar,
    iofSpreadPercent,
    impostoImportacaoPercent,
    icmsPercent,
    freteCliente,
    embalagem,
    custoOperacional,
    taxaGatewayFixa,
    cacDesejado,
    taxaGatewayPercent,
    taxaPlataformaPercent,
    impostoVendaPercent,
    perdasPercent,
    margemLiquidaAlvo,
    precoTeste
  ]);

  const NumberField = ({
    label,
    value,
    onChange,
    icon = 'money',
    step = '0.01'
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    icon?: 'money' | 'percent';
    step?: string;
  }) => (
    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <span className="cyber-label">{label}</span>
      <div style={{ position: 'relative' }}>
        {icon === 'percent' ? (
          <Percent size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        ) : (
          <DollarSign size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
        )}
        <input
          type="number"
          step={step}
          className="cyber-input"
          style={{ paddingLeft: '34px' }}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </label>
  );

  const Metric = ({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'good' | 'bad' | 'blue' }) => {
    const color = tone === 'good' ? 'var(--color-primary)' : tone === 'bad' ? '#ff5252' : tone === 'blue' ? '#4da6ff' : '#fff';
    return (
      <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
        <div style={{ color, fontWeight: 800, fontSize: '1.05rem' }}>{value}</div>
      </div>
    );
  };

  const ResultPanel = ({ title, price, result, accent }: {
    title: string;
    price: number;
    result: typeof calc.sugerido;
    accent: string;
  }) => (
    <div style={{ border: `1px solid ${accent}`, borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ background: `${accent}1a`, borderBottom: `1px solid ${accent}`, padding: '14px 16px' }}>
        <h3 style={{ margin: 0, color: accent, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} /> {title}
        </h3>
      </div>
      <div style={{ padding: '16px', display: 'grid', gap: '12px' }}>
        <Metric label="Preco de venda" value={formatCurrency(price)} tone="blue" />
        <Metric label="Lucro liquido por pedido" value={formatCurrency(result.lucroLiquido)} tone={result.lucroLiquido >= 0 ? 'good' : 'bad'} />
        <Metric label="Margem liquida" value={formatPercent(result.margemLiquida)} tone={result.margemLiquida >= margemLiquidaAlvo ? 'good' : 'bad'} />
        <Metric label="Markup sobre custo entregue" value={`${result.markup.toFixed(2)}x`} />
        <Metric label="ROI operacional" value={formatPercent(result.roiProduto)} tone={result.roiProduto >= 0 ? 'good' : 'bad'} />
        <Metric label="CAC maximo para empatar" value={formatCurrency(result.cacMaximo)} tone="blue" />
        <Metric label="ROAS minimo para empatar" value={`${result.roasEquilibrio.toFixed(2)}x`} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <Calculator size={28} className="neon-text" />
        <div>
          <h2 style={{ color: 'var(--color-primary)', margin: 0 }}>Calculadora de Precificacao Dropshipping</h2>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Calcule custo entregue, preco ideal, lucro, CAC maximo e ROAS de equilibrio.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <NumberField label="Custo do produto (USD)" value={custoProdutoUsd} onChange={setCustoProdutoUsd} />
        <NumberField label="Frete fornecedor (USD)" value={freteFornecedorUsd} onChange={setFreteFornecedorUsd} />
        <NumberField label="Seguro/outros (USD)" value={seguroUsd} onChange={setSeguroUsd} />
        <NumberField label="Cotacao do dolar" value={cotacaoDolar} onChange={setCotacaoDolar} />
        <NumberField label="IOF + spread cambial (%)" value={iofSpreadPercent} onChange={setIofSpreadPercent} icon="percent" step="0.1" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <NumberField label="Imposto importacao (%)" value={impostoImportacaoPercent} onChange={setImpostoImportacaoPercent} icon="percent" step="0.1" />
        <NumberField label="ICMS estimado (%)" value={icmsPercent} onChange={setIcmsPercent} icon="percent" step="0.1" />
        <NumberField label="Frete ao cliente (R$)" value={freteCliente} onChange={setFreteCliente} />
        <NumberField label="Embalagem/etiqueta (R$)" value={embalagem} onChange={setEmbalagem} />
        <NumberField label="Operacao por pedido (R$)" value={custoOperacional} onChange={setCustoOperacional} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <NumberField label="Gateway/cartao (%)" value={taxaGatewayPercent} onChange={setTaxaGatewayPercent} icon="percent" step="0.1" />
        <NumberField label="Gateway fixo (R$)" value={taxaGatewayFixa} onChange={setTaxaGatewayFixa} />
        <NumberField label="Plataforma/checkout (%)" value={taxaPlataformaPercent} onChange={setTaxaPlataformaPercent} icon="percent" step="0.1" />
        <NumberField label="Imposto sobre venda (%)" value={impostoVendaPercent} onChange={setImpostoVendaPercent} icon="percent" step="0.1" />
        <NumberField label="Perdas/devolucoes (%)" value={perdasPercent} onChange={setPerdasPercent} icon="percent" step="0.1" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '24px', padding: '16px', background: 'rgba(69,230,39,0.055)', border: '1px solid rgba(69,230,39,0.16)', borderRadius: '10px' }}>
        <NumberField label="CAC/ads estimado (R$)" value={cacDesejado} onChange={setCacDesejado} />
        <NumberField label="Margem liquida alvo (%)" value={margemLiquidaAlvo} onChange={setMargemLiquidaAlvo} icon="percent" step="0.1" />
        <NumberField label="Preco manual para testar (R$)" value={precoTeste} onChange={setPrecoTeste} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <Metric label="Compra total em USD" value={`US$ ${calc.custoCompraUsd.toFixed(2)}`} />
        <Metric label="Custo com cambio" value={formatCurrency(calc.custoCompraComCambio)} />
        <Metric label="Imposto importacao" value={formatCurrency(calc.impostoImportacao)} tone="bad" />
        <Metric label="ICMS estimado" value={formatCurrency(calc.icms)} tone="bad" />
        <Metric label="Custo entregue" value={formatCurrency(calc.custoProdutoEntregue)} tone="blue" />
        <Metric label="Taxas variaveis" value={formatPercent(calc.taxasVariaveisPercent)} />
      </div>

      {margemLiquidaAlvo + calc.taxasVariaveisPercent >= 100 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '8px', background: 'rgba(255,82,82,0.1)', color: '#ffb4b4', marginBottom: '20px', border: '1px solid rgba(255,82,82,0.25)' }}>
          <AlertTriangle size={18} />
          A soma da margem alvo com as taxas variaveis chegou a 100% ou mais. Reduza taxas/margem para calcular um preco viavel.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <ResultPanel title="Preco sugerido pela margem alvo" price={calc.precoSugerido} result={calc.sugerido} accent="var(--color-primary)" />
        <ResultPanel title="Simulacao com preco manual" price={precoTeste} result={calc.teste} accent="#4da6ff" />
      </div>
    </div>
  );
};

export default AdminCalculadora;
