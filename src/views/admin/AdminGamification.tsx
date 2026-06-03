import React, { useState } from 'react';
import { GamificationTask } from '../../types';
import { Target, Zap, ShieldCheck, Star } from 'lucide-react';
import { INITIAL_GAMIFICATION_TASKS } from '../../mockData';

interface AdminGamificationProps {
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const AdminGamification: React.FC<AdminGamificationProps> = ({ addToast }) => {
  const [tasks, setTasks] = useState<GamificationTask[]>(INITIAL_GAMIFICATION_TASKS);

  const handleToggleActive = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
    addToast('Status da missão atualizado.', 'success');
  };

  const handleUpdateRewardXP = (id: string, amount: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, rewardXP: amount } : t));
  };

  const handleUpdateRewardCoins = (id: string, amount: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, rewardCoins: amount } : t));
  };

  const handleSave = () => {
    // In a real app, save to Supabase here
    addToast('Configurações de gamificação salvas com sucesso! 🚀', 'success');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Target size={24} /> Sistema de Gamificação
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Gerencie missões, XP e recompensas de Aliencoins para os visitantes.
          </p>
        </div>
        <button className="neon-glow-btn" onClick={handleSave}>
          <ShieldCheck size={18} /> Salvar Alterações
        </button>
      </div>

      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {tasks.map(task => (
          <div 
            key={task.id}
            style={{ 
              padding: '16px', 
              borderRadius: 'var(--radius-md)', 
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: `1px solid ${task.isActive ? 'var(--color-primary)' : 'rgba(255,255,255,0.1)'}`,
              opacity: task.isActive ? 1 : 0.6,
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <h4 style={{ margin: 0, color: 'var(--color-text-white)' }}>{task.title}</h4>
              <label className="admin-switch">
                <input 
                  type="checkbox" 
                  checked={task.isActive} 
                  onChange={() => handleToggleActive(task.id)}
                />
                <span className="admin-slider"></span>
              </label>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '16px', minHeight: '34px' }}>
              {task.description}
            </p>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="cyber-label" style={{ fontSize: '0.7rem' }}>Recompensas</label>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Star size={16} color="#45e627" />
                  <input 
                    type="number" 
                    className="cyber-input" 
                    value={task.rewardXP || 0}
                    onChange={(e) => handleUpdateRewardXP(task.id, parseInt(e.target.value) || 0)}
                    style={{ padding: '4px 8px', height: '30px', fontSize: '0.85rem', width: '80px' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#45e627' }}>XP</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={16} color="#f59e0b" />
                  <input 
                    type="number" 
                    className="cyber-input" 
                    value={task.rewardCoins || 0}
                    onChange={(e) => handleUpdateRewardCoins(task.id, parseInt(e.target.value) || 0)}
                    style={{ padding: '4px 8px', height: '30px', fontSize: '0.85rem', width: '80px' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b' }}>AC</span>
                </div>
              </div>
              <div>
                <label className="cyber-label" style={{ fontSize: '0.7rem' }}>Frequência</label>
                <div style={{ 
                  padding: '4px 8px', 
                  backgroundColor: 'rgba(255,255,255,0.05)', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  color: 'var(--color-text-muted)',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {task.limit === 'once' ? 'Única' : task.limit === 'daily' ? 'Diária' : task.limit === 'weekly' ? 'Semanal' : 'Ilimitada'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminGamification;
