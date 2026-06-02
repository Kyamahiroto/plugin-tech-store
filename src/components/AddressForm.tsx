import React, { useState, useEffect } from 'react';
import { fetchAddressByCep } from '../utils/addressUtils';

interface AddressFormProps {
  initialAddress?: string;
  onAddressChange: (formattedAddress: string) => void;
  onSave?: () => void;
  onCancel?: () => void;
  compact?: boolean;
}

const parseAddress = (addressStr: string) => {
  if (!addressStr) return { cep: '', logradouro: '', numero: '', complemento: '', bairro: '', localidade: '', uf: '' };
  // Expected format: Logradouro, 123, Complemento - Bairro, Localidade/UF - CEP
  const match = addressStr.match(/^(.*),\s*([^,]*)(?:,\s*(.*))?\s*-\s*(.*),\s*(.*)\/(.*)\s*-\s*(.*)$/);
  if (match) {
    return {
      logradouro: match[1]?.trim() || '',
      numero: match[2]?.trim() || '',
      complemento: match[3]?.trim() || '',
      bairro: match[4]?.trim() || '',
      localidade: match[5]?.trim() || '',
      uf: match[6]?.trim() || '',
      cep: match[7]?.trim() || ''
    };
  }
  return { cep: '', logradouro: addressStr, numero: '', complemento: '', bairro: '', localidade: '', uf: '' };
};

const AddressForm: React.FC<AddressFormProps> = ({ initialAddress = '', onAddressChange, onSave, onCancel, compact = false }) => {
  const [data, setData] = useState(parseAddress(initialAddress));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Format address whenever data changes
    if (data.logradouro || data.cep) {
      const parts = [
        data.logradouro,
        data.numero ? `, ${data.numero}` : '',
        data.complemento ? `, ${data.complemento}` : '',
        data.bairro || data.localidade || data.uf ? ' - ' : '',
        data.bairro,
        data.localidade && data.bairro ? ', ' : '',
        data.localidade,
        data.uf ? `/${data.uf}` : '',
        data.cep ? ` - ${data.cep}` : ''
      ];
      onAddressChange(parts.join(''));
    }
  }, [data]);

  const handleCepBlur = async () => {
    if (data.cep.length >= 8) {
      setLoading(true);
      const res = await fetchAddressByCep(data.cep);
      setLoading(false);
      if (res) {
        setData(prev => ({
          ...prev,
          logradouro: res.logradouro,
          bairro: res.bairro,
          localidade: res.localidade,
          uf: res.uf
        }));
      }
    }
  };

  const update = (field: keyof typeof data, value: string) => setData(prev => ({ ...prev, [field]: value }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <div className="form-group" style={{ flex: '1 1 120px' }}>
          <label className="form-label">CEP</label>
          <input type="text" className="form-input" placeholder="00000-000" value={data.cep} onChange={e => update('cep', e.target.value)} onBlur={handleCepBlur} />
          {loading && <small style={{ color: 'var(--color-primary)' }}>Buscando...</small>}
        </div>
        <div className="form-group" style={{ flex: '1 1 80px' }}>
          <label className="form-label">UF</label>
          <input type="text" className="form-input" placeholder="SP" value={data.uf} onChange={e => update('uf', e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Endereço (Logradouro)</label>
        <input type="text" className="form-input" placeholder="Rua, Avenida, etc." value={data.logradouro} onChange={e => update('logradouro', e.target.value)} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <div className="form-group" style={{ flex: '1 1 80px' }}>
          <label className="form-label">Número</label>
          <input type="text" className="form-input" placeholder="123" value={data.numero} onChange={e => update('numero', e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: '2 1 120px' }}>
          <label className="form-label">Complemento</label>
          <input type="text" className="form-input" placeholder="Apto, Bloco..." value={data.complemento} onChange={e => update('complemento', e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        <div className="form-group" style={{ flex: '1 1 120px' }}>
          <label className="form-label">Bairro</label>
          <input type="text" className="form-input" placeholder="Bairro" value={data.bairro} onChange={e => update('bairro', e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: '1 1 120px' }}>
          <label className="form-label">Cidade</label>
          <input type="text" className="form-input" placeholder="Cidade" value={data.localidade} onChange={e => update('localidade', e.target.value)} />
        </div>
      </div>
      {!compact && (onSave || onCancel) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px' }}>
          {onCancel && <button className="outline-btn" style={{ flex: 1, padding: '10px' }} onClick={onCancel}>Cancelar</button>}
          {onSave && <button className="neon-glow-btn" style={{ flex: 1, padding: '10px', backgroundColor: 'var(--color-primary)', border: 'none', color: '#000' }} onClick={onSave}>Salvar Endereço</button>}
        </div>
      )}
    </div>
  );
};

export default AddressForm;
