import React, { useState } from 'react';
import { QuizConfig } from '../../types';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface AdminQuizConfigProps {
  quizConfig: QuizConfig;
  onUpdateConfig: (config: QuizConfig) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const AdminQuizConfig: React.FC<AdminQuizConfigProps> = ({ quizConfig, onUpdateConfig, addToast }) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'budgets' | 'styles' | 'priorities' | 'characters'>('profiles');

  const [form, setForm] = useState<any>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openNew = () => {
    if (activeTab === 'budgets') {
      setForm({ id: '', label: '', min: 0, max: null, icon: '💰' });
    } else if (activeTab === 'characters') {
      setForm({ id: '', name: '', avatar: '👽', personality: 'sarcastic', comments: {} });
    } else {
      setForm({ id: '', label: '', icon: '✨', description: '' });
    }
    setEditIndex(null);
  };

  const openEdit = (item: any, index: number) => {
    setForm({ ...item });
    setEditIndex(index);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.id) {
      addToast('ID é obrigatório', 'error');
      return;
    }

    const updatedConfig = { ...quizConfig };
    
    let arrayToUpdate: any[];
    if (activeTab === 'profiles') arrayToUpdate = [...updatedConfig.profiles];
    else if (activeTab === 'budgets') arrayToUpdate = [...updatedConfig.budgetRanges];
    else if (activeTab === 'styles') arrayToUpdate = [...updatedConfig.visualStyles];
    else if (activeTab === 'priorities') arrayToUpdate = [...updatedConfig.priorities];
    else arrayToUpdate = [...updatedConfig.characters];

    if (editIndex !== null) {
      arrayToUpdate[editIndex] = form;
    } else {
      arrayToUpdate.push(form);
    }

    if (activeTab === 'profiles') updatedConfig.profiles = arrayToUpdate;
    else if (activeTab === 'budgets') updatedConfig.budgetRanges = arrayToUpdate;
    else if (activeTab === 'styles') updatedConfig.visualStyles = arrayToUpdate;
    else if (activeTab === 'priorities') updatedConfig.priorities = arrayToUpdate;
    else updatedConfig.characters = arrayToUpdate;

    onUpdateConfig(updatedConfig);
    setForm(null);
    addToast('Configuração atualizada com sucesso!', 'success');
  };

  const handleDelete = (index: number) => {
    if (!confirm('Tem certeza que deseja deletar?')) return;
    const updatedConfig = { ...quizConfig };
    
    if (activeTab === 'profiles') updatedConfig.profiles = updatedConfig.profiles.filter((_, i) => i !== index);
    else if (activeTab === 'budgets') updatedConfig.budgetRanges = updatedConfig.budgetRanges.filter((_, i) => i !== index);
    else if (activeTab === 'styles') updatedConfig.visualStyles = updatedConfig.visualStyles.filter((_, i) => i !== index);
    else if (activeTab === 'priorities') updatedConfig.priorities = updatedConfig.priorities.filter((_, i) => i !== index);
    else updatedConfig.characters = updatedConfig.characters.filter((_, i) => i !== index);

    onUpdateConfig(updatedConfig);
    addToast('Item deletado', 'error');
  };

  const renderList = () => {
    let list: any[];
    if (activeTab === 'profiles') list = quizConfig.profiles;
    else if (activeTab === 'budgets') list = quizConfig.budgetRanges;
    else if (activeTab === 'styles') list = quizConfig.visualStyles;
    else if (activeTab === 'priorities') list = quizConfig.priorities;
    else list = quizConfig.characters;

    return (
      <div className="admin-table-wrapper" style={{ marginTop: '20px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ícone</th>
              <th>ID</th>
              <th>Nome / Label</th>
              {activeTab === 'budgets' ? <th>Faixa (Min-Max)</th> : <th>Descrição / Tipo</th>}
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, idx) => (
              <tr key={idx}>
                <td style={{ fontSize: '1.5rem' }}>{item.icon || item.avatar}</td>
                <td><span className="admin-type-chip" style={{ '--chip-color': '#a78bfa' } as any}>{item.id}</span></td>
                <td><strong>{item.label || item.name}</strong></td>
                {activeTab === 'budgets' ? (
                  <td>R$ {item.min} - {item.max ? `R$ ${item.max}` : 'Sem limite'}</td>
                ) : (
                  <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.description || item.personality}
                  </td>
                )}
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="admin-icon-btn" onClick={() => openEdit(item, idx)}><Edit2 size={15} /></button>
                    <button className="admin-icon-btn danger" onClick={() => handleDelete(idx)}><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="admin-section">
      <div className="admin-section-header">
        <h2>🤖 Configurações do Quiz</h2>
        <button className="neon-glow-btn" onClick={openNew}>
          <Plus size={16} /> Novo Item
        </button>
      </div>

      <div className="admin-tabs" style={{ marginBottom: '20px', display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '10px' }}>
        <button className={`admin-tab ${activeTab === 'profiles' ? 'active' : ''}`} onClick={() => setActiveTab('profiles')}>Perfis</button>
        <button className={`admin-tab ${activeTab === 'budgets' ? 'active' : ''}`} onClick={() => setActiveTab('budgets')}>Orçamentos</button>
        <button className={`admin-tab ${activeTab === 'styles' ? 'active' : ''}`} onClick={() => setActiveTab('styles')}>Estilos Visuais</button>
        <button className={`admin-tab ${activeTab === 'priorities' ? 'active' : ''}`} onClick={() => setActiveTab('priorities')}>Prioridades</button>
        <button className={`admin-tab ${activeTab === 'characters' ? 'active' : ''}`} onClick={() => setActiveTab('characters')}>Personagens</button>
      </div>

      {renderList()}

      {form && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel">
            <div className="admin-modal-head">
              <h3>{editIndex !== null ? 'Editar' : 'Novo'} {activeTab}</h3>
              <button onClick={() => setForm(null)} className="admin-close-btn"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-field">
                  <label>ID Único * (ex: gamer-pro)</label>
                  <input className="cyber-input" value={form.id} onChange={e => setForm({...form, id: e.target.value})} required disabled={editIndex !== null} />
                </div>
                <div className="admin-field">
                  <label>Ícone / Avatar (Emoji)</label>
                  <input className="cyber-input" value={form.icon || form.avatar || ''} onChange={e => setForm({...form, [activeTab === 'characters' ? 'avatar' : 'icon']: e.target.value})} />
                </div>
              </div>

              <div className="admin-field">
                <label>Nome / Label *</label>
                <input className="cyber-input" value={form.label || form.name || ''} onChange={e => setForm({...form, [activeTab === 'characters' ? 'name' : 'label']: e.target.value})} required />
              </div>

              {activeTab === 'budgets' ? (
                <div className="admin-form-row">
                  <div className="admin-field">
                    <label>Valor Mínimo (R$)</label>
                    <input className="cyber-input" type="number" min="0" value={form.min} onChange={e => setForm({...form, min: Number(e.target.value)})} required />
                  </div>
                  <div className="admin-field">
                    <label>Valor Máximo (R$) (Deixe vazio para sem limite)</label>
                    <input className="cyber-input" type="number" min="0" value={form.max === null ? '' : form.max} onChange={e => setForm({...form, max: e.target.value === '' ? null : Number(e.target.value)})} />
                  </div>
                </div>
              ) : activeTab === 'characters' ? (
                <div className="admin-field">
                  <label>Personalidade</label>
                  <select className="cyber-input" value={form.personality} onChange={e => setForm({...form, personality: e.target.value})}>
                    <option value="sarcastic">Sarcástico</option>
                    <option value="hyper">Hiperativo</option>
                    <option value="technical">Técnico/Analítico</option>
                  </select>
                </div>
              ) : (
                <div className="admin-field">
                  <label>Descrição</label>
                  <textarea className="cyber-input" rows={2} value={form.description || ''} onChange={e => setForm({...form, description: e.target.value})} style={{ resize: 'vertical' }} />
                </div>
              )}

              {activeTab === 'characters' && (
                <div className="admin-field" style={{ marginTop: '10px' }}>
                  <label style={{ color: 'var(--color-primary)' }}>⚠️ Comentários (Avançado)</label>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    Os comentários do personagem são gerenciados via código no momento para evitar erros de sintaxe JSON.
                  </p>
                </div>
              )}

              <div className="admin-form-actions" style={{ marginTop: '24px' }}>
                <button type="button" className="outline-btn" onClick={() => setForm(null)}>Cancelar</button>
                <button type="submit" className="neon-glow-btn">
                  <Save size={16} /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizConfig;
