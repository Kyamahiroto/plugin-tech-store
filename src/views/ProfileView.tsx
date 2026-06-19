import React, { useState } from 'react';
import { UserProfile, Order } from '../types';
import { ALIEN_SPECIES, INITIAL_GAMIFICATION_TASKS } from '../mockData';
import { Coins, Globe, ShieldAlert, LogOut, Package, MapPin, Search, Zap, Star, Calendar, Users } from 'lucide-react';
import AuthWall from '../components/AuthWall';
import { getRankByXP, getNextRank } from '../utils/gamification';
import { fileToBase64 } from '../utils/imageUpload';
import AddressForm from '../components/AddressForm';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  addToast: (msg: string, type?: 'success' | 'error') => void;
  onLogout?: () => void;
  orders?: Order[];
  initialTab?: ProfileTab;
}

type ProfileTab = 'profile' | 'orders' | 'tracking' | 'missions';

const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  addToast,
  onLogout,
  orders = [],
  initialTab = 'profile'
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);
  const [name, setName] = useState(userProfile.name);
  const [homePlanet, setHomePlanet] = useState(userProfile.homePlanet);
  const [email, setEmail] = useState(userProfile.email || '');
  const [address, setAddress] = useState(userProfile.address || '');
  const [password, setPassword] = useState(userProfile.password || '');
  const [trackingCode, setTrackingCode] = useState('');

  const renderEmojiAvatar = (avatarString: string, baseFontSize: string) => {
    return <span style={{ fontSize: baseFontSize, display: 'inline-block', lineHeight: 1 }}>{avatarString}</span>;
  };

  const getSpeciesPlanetDefault = (speciesId: string) => {
    switch (speciesId) {
      case 'custom': return 'Planeta Origem do Holograma';
      case 'gray': return 'Retículo II (Setor Cósmico Z)';
      case 'reptilian': return 'Zeta Reticuli Prime';
      case 'human_girl_rocket':
      case 'human_boy_rocket':
        return 'Terra (Sub-Setor 3)';
      default: return 'Espaço Sideral';
    }
  };

  const getThreatLevelText = (speciesId: string) => {
    switch (speciesId) {
      case 'custom': return { label: 'Visitante Desconhecido (Não identificado)', color: 'var(--color-warning)' };
      case 'gray': return { label: 'Ameaça Média (Pode abduzir gados)', color: 'var(--color-warning)' };
      case 'reptilian': return { label: 'Crítico (Controla bancos centrais terrestres)', color: 'var(--color-danger)' };
      case 'human_girl_rocket':
      case 'human_boy_rocket':
        return { label: 'Inofensivo (Fácil de abduzir com feixes de luz)', color: 'var(--color-primary)' };
      default: return { label: 'Inofensivo', color: 'var(--color-primary)' };
    }
  };

  const getWalletCreditsDefault = (speciesId: string) => {
    switch (speciesId) {
      case 'custom': return 1000;
      case 'gray': return 15000;
      case 'reptilian': return 99999999;
      case 'human_girl_rocket':
      case 'human_boy_rocket':
        return 150;
      default: return 500;
    }
  };

  const handleSpeciesChange = (speciesId: UserProfile['species']) => {
    if (speciesId === 'custom') {
      document.getElementById('custom-avatar-file-input')?.click();
      onUpdateProfile({ ...userProfile, species: 'custom' });
      return;
    }
    const defaultPlanet = getSpeciesPlanetDefault(speciesId);
    const credits = getWalletCreditsDefault(speciesId);
    const updatedProfile: UserProfile = {
      ...userProfile,
      name,
      species: speciesId,
      homePlanet: defaultPlanet,
      dangerLevel: speciesId === 'reptilian' ? 'galaxy_destroyer' :
                   speciesId === 'gray' ? 'medium' : 'harmless',
      walletBalance: credits
    };
    setHomePlanet(defaultPlanet);
    onUpdateProfile(updatedProfile);
    addToast(`Espécie alterada! DNA mutado para ${ALIEN_SPECIES.find(s => s.id === speciesId)?.name} 🛸⚡`, 'success');
  };

  const handleNameChange = (newName: string) => {
    setName(newName);
    onUpdateProfile({ ...userProfile, name: newName });
  };

  const threat = getThreatLevelText(userProfile.species);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'processing': return { label: 'Em Processamento', color: 'var(--color-warning)', icon: '⚙️' };
      case 'warp_drive': return { label: 'A Caminho (Warp Drive)', color: 'var(--color-primary)', icon: '🚀' };
      case 'delivered': return { label: 'Entregue', color: '#10b981', icon: '✅' };
      default: return { label: status, color: 'var(--color-text-muted)', icon: '📦' };
    }
  };

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Meu Perfil', icon: <Globe size={16} /> },
    { id: 'orders', label: 'Meus Pedidos', icon: <Package size={16} /> },
    { id: 'tracking', label: 'Rastreio', icon: <MapPin size={16} /> },
    { id: 'missions', label: 'Missões', icon: <Coins size={16} /> },
  ];

  return (
    <div className="view-container animate-fade-in">
      {!userProfile.name ? (
        <AuthWall context="profile" />
      ) : (
        // --- LOGGED IN USER PROFILE ---
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 className="section-title" style={{ margin: 0 }}>Minha Conta</h2>
        {userProfile.name && (
          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: 'rgba(255, 59, 48, 0.1)',
              border: '1px solid rgba(255, 59, 48, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 59, 48, 0.2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 59, 48, 0.1)')}
          >
            <LogOut size={16} />
            Sair da Conta
          </button>
        )}
      </div>

      {/* Profile Tab Navigation */}
      <div className="profile-tabs-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`profile-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: MEU PERFIL ─── */}
      {activeTab === 'profile' && (
        <div className="profile-editor-container" style={{ marginTop: '24px' }}>
          {/* Left: Gamification Dashboard */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Meu Progresso */}
            <div className="checkout-summary-box" style={{ width: '100%', position: 'static' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 600 }}>Meu Progresso</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div 
                  className="sidebar-profile-avatar" 
                  style={{ width: '70px', height: '70px', fontSize: '3rem', flexShrink: 0, border: '3px solid var(--color-primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', borderRadius: '50%' }}
                  onClick={() => document.getElementById('custom-avatar-file-input')?.click()}
                >
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    renderEmojiAvatar(ALIEN_SPECIES.find(s => s.id === userProfile.species)?.avatar || '👽', '3rem')
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: getRankByXP(userProfile.xp || 0).color }}>{getRankByXP(userProfile.xp || 0).name}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Nível {Math.floor((userProfile.xp || 0) / 1000) + 1}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{ALIEN_SPECIES.find(s => s.id === userProfile.species)?.name}</div>
                </div>
              </div>
              
              {/* GAMIFICATION XP PROGRESS */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#a855f7', fontWeight: 700 }}>
                    {getRankByXP(userProfile.xp || 0).icon} NÍVEL {Math.floor((userProfile.xp || 0) / 1000) + 1}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                    {userProfile.xp || 0} / {getNextRank(userProfile.xp || 0)?.xpRequired || (userProfile.xp || 0)} XP
                  </span>
                </div>
                
                {getNextRank(userProfile.xp || 0) ? (
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', left: 0, top: 0, height: '100%', 
                      width: `${Math.min(100, Math.max(0, ((userProfile.xp || 0) / getNextRank(userProfile.xp || 0)!.xpRequired) * 100))}%`,
                      backgroundColor: 'var(--color-primary)',
                      boxShadow: `0 0 10px var(--color-primary)`,
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-primary)', borderRadius: '4px', boxShadow: `0 0 10px var(--color-primary)` }} />
                )}
                
                {getNextRank(userProfile.xp || 0) && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: '8px', textAlign: 'center' }}>
                    Faltam {getNextRank(userProfile.xp || 0)!.xpRequired - (userProfile.xp || 0)} XP <span style={{ color: 'var(--color-primary)' }}>para o Nível {Math.floor((userProfile.xp || 0) / 1000) + 2}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Aliencoins Card */}
            <div className="checkout-summary-box" style={{ width: '100%', position: 'static', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Aliencoins</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)', fontSize: '2rem', fontWeight: 800 }}>
                <Coins size={28} /> {userProfile.aliencoins || 0}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>R$ {((userProfile.aliencoins || 0) / 100).toFixed(2).replace('.', ',')} de desconto</div>
            </div>

            {/* Como ganhar Aliencoins */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Como ganhar Aliencoins</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => setActiveTab('missions')}>Ver todas &gt;</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {INITIAL_GAMIFICATION_TASKS.filter(t => t.limit === 'daily' || t.limit === 'unlimited').slice(0, 4).map((task, index) => (
                  <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: 'var(--color-primary)' }}>{task.id.includes('comp') ? <Package size={18} /> : task.id.includes('aval') ? <Star size={18} /> : task.id.includes('log') ? <Calendar size={18} /> : task.id.includes('share') ? <Users size={18} /> : <Coins size={18} />}</span>
                      <span style={{ fontSize: '0.9rem' }}>{task.title}</span>
                    </div>
                    <div style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      +{task.rewardCoins || Math.floor((task.rewardXP || 0) / 10)} <Coins size={14} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missões em Destaque */}
            <div style={{ marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Missões em Destaque</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', cursor: 'pointer' }} onClick={() => setActiveTab('missions')}>Ver todas &gt;</span>
              </div>
              <div className="checkout-summary-box" style={{ position: 'static', width: '100%', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid rgba(69, 230, 39, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                  <Zap size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px' }}>Missão da Semana</div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.4, marginBottom: '8px' }}>Compre R$ 250,00 em produtos e ganhe 50 Aliencoins!</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}><span style={{ color: 'var(--color-primary)' }}>R$ 150,00</span> / R$ 250,00</div>
                </div>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(69, 230, 39, 0.1)', border: '1px solid var(--color-primary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontWeight: 800, flexShrink: 0 }}>
                  <Coins size={16} /> 50
                </div>
              </div>
            </div>

            {/* Resgate suas Aliencoins Banner */}
            <div style={{ 
              background: 'linear-gradient(90deg, rgba(11, 15, 25, 1) 0%, rgba(20, 40, 20, 1) 100%)', 
              border: '1px solid rgba(69, 230, 39, 0.3)', 
              borderRadius: 'var(--radius-md)', 
              padding: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              position: 'relative',
              overflow: 'hidden',
              marginTop: '8px'
            }}>
              <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>Resgate suas Aliencoins</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Descontos exclusivos esperando por você!</div>
              </div>
              <div style={{ position: 'relative', zIndex: 2, color: 'var(--color-warning)' }}>
                <Coins size={40} />
              </div>
              <div style={{ position: 'absolute', right: '-10px', opacity: 0.1, transform: 'scale(1.5)', color: 'var(--color-warning)' }}>
                <Coins size={100} />
              </div>
            </div>

            {/* Logout button */}
            {userProfile.name && (
              <button
                onClick={onLogout}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  background: 'rgba(255, 59, 48, 0.08)',
                  border: '1px solid rgba(255, 59, 48, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-danger)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 59, 48, 0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 59, 48, 0.08)')}
              >
                <LogOut size={16} />
                Sair da Conta
              </button>
            )}
          </div>

          {/* Right: Profile Customizer Forms */}
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="checkout-summary-title" style={{ border: 'none', marginBottom: '20px' }}>
              🛸 Sintonizar DNA do Cliente
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
              <div className="form-group">
                <label className="form-label">Nome Registrado na Galáxia</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Zog o Terrível, Marlon Reptiliano..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Coordenadas Planetárias Convencionais</label>
                <input
                  type="text"
                  className="form-input"
                  value={homePlanet}
                  onChange={(e) => {
                    setHomePlanet(e.target.value);
                    onUpdateProfile({ ...userProfile, homePlanet: e.target.value });
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">E-mail de Comunicação</label>
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    onUpdateProfile({ ...userProfile, email: e.target.value });
                  }}
                  placeholder="Ex: zog@universo.com"
                />
              </div>

              <div className="form-group" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--color-primary)' }}>Endereço de Teletransporte (Entrega)</h4>
                <AddressForm 
                  initialAddress={address} 
                  onAddressChange={(newAddr) => {
                    setAddress(newAddr);
                    onUpdateProfile({ ...userProfile, address: newAddr });
                  }} 
                  compact 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Senha (Biometria)</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    onUpdateProfile({ ...userProfile, password: e.target.value });
                  }}
                  placeholder="********"
                />
              </div>

            </div>

            <h3 className="checkout-summary-title" style={{ border: 'none', marginBottom: '14px', fontSize: '1rem' }}>
              👽 Escolha sua Espécie de Mascote/DNA
            </h3>

            <div className="profile-species-grid">
              {ALIEN_SPECIES.map((spec) => (
                <div
                  key={spec.id}
                  className={`species-option-card ${userProfile.species === spec.id ? 'selected' : ''}`}
                  onClick={() => {
                    handleSpeciesChange(spec.id as UserProfile['species']);
                    if (spec.id === 'custom') {
                      document.getElementById('custom-avatar-file-input')?.click();
                    }
                  }}
                >
                  <div className="species-avatar-large" style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '50px' }}>
                    {spec.id === 'custom' && userProfile.avatarUrl ? (
                      <div style={{ width: '45px', height: '45px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--color-primary)', boxShadow: '0 0 10px rgba(69, 230, 39, 0.3)' }}>
                        <img src={userProfile.avatarUrl} alt="Custom Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      renderEmojiAvatar(spec.avatar, '2.5rem')
                    )}
                  </div>
                  <div className="species-name">{spec.name}</div>
                  <div className="species-desc">{spec.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB: MISSÕES ─── */}
      {activeTab === 'missions' && (
        <div style={{ marginTop: '24px' }}>
          <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 className="checkout-summary-title" style={{ border: 'none', marginBottom: '14px', fontSize: '1.2rem', color: 'var(--color-primary)' }}>
              🎯 Central de Missões Intergalácticas
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Conclua tarefas, ganhe Aliencoins para usar como descontos em compras ou acumule XP para subir de rank. As missões de Rank são vitais para a sua progressão no império Plug-in!
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {INITIAL_GAMIFICATION_TASKS.filter(t => t.isActive).map(task => {
                const isCompleted = task.limit === 'once' && userProfile.gamificationState?.completedTasks?.includes(task.id);
                return (
                  <div 
                    key={task.id} 
                    style={{ 
                      padding: '16px', 
                      backgroundColor: 'rgba(0,0,0,0.3)', 
                      border: `1px solid ${isCompleted ? 'rgba(69, 230, 39, 0.3)' : 'rgba(255,255,255,0.08)'}`, 
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      opacity: isCompleted ? 0.7 : 1
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', color: isCompleted ? 'var(--color-text-muted)' : 'var(--color-text-white)', textDecoration: isCompleted ? 'line-through' : 'none' }}>
                          {task.title}
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          {task.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column', alignItems: 'flex-end' }}>
                        {task.rewardXP && (
                          <div style={{ 
                            padding: '4px 8px', 
                            backgroundColor: 'rgba(69, 230, 39, 0.1)',
                            color: '#45e627',
                            border: '1px solid rgba(69, 230, 39, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                          }}>
                            + {task.rewardXP} XP
                          </div>
                        )}
                        {task.rewardCoins && (
                          <div style={{ 
                            padding: '4px 8px', 
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.8rem',
                            fontWeight: 800,
                            whiteSpace: 'nowrap'
                          }}>
                            + {task.rewardCoins} AC
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: '4px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        Frequência: {task.limit === 'once' ? 'Única' : task.limit === 'daily' ? `Diária ${task.maxPerDay ? `(Máx ${task.maxPerDay}x)` : ''}` : task.limit === 'weekly' ? 'Semanal' : task.limit === 'monthly' ? 'Mensal' : 'Ilimitada'}
                      </span>
                      {isCompleted && task.limit === 'once' ? (
                        <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>✓ Concluída</span>
                      ) : (
                        <span style={{ color: 'var(--color-warning)' }}>⏳ Em progresso</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ─── TAB: MEUS PEDIDOS ─── */}
      {activeTab === 'orders' && (
        <div style={{ marginTop: '24px' }}>
          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
              <Package size={56} style={{ margin: '0 auto 16px', opacity: 0.3, display: 'block' }} />
              <h3 style={{ marginBottom: '8px', fontSize: '1.1rem' }}>Nenhum pedido por aqui ainda</h3>
              <p style={{ fontSize: '0.85rem' }}>Suas compras interestelares aparecerão aqui após finalizadas. 🛸</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => {
                const status = getStatusLabel(order.status);
                return (
                  <div
                    key={order.id}
                    className="checkout-summary-box"
                    style={{ position: 'static', width: '100%' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                          Pedido #{order.id.slice(0, 8).toUpperCase()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {order.date ? new Date(order.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Data não disponível'}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '20px', background: `${status.color}18`, border: `1px solid ${status.color}44`, color: status.color, fontWeight: '600' }}>
                        {status.icon} {status.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>
                            {item.quantity}x {item.product.name}
                          </span>
                          <span style={{ color: 'var(--color-primary)', fontWeight: '600' }}>
                            R$ {(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Total do Pedido</span>
                      <strong style={{ color: 'var(--color-primary)', fontSize: '1rem' }}>
                        R$ {order.total.toFixed(2)}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: RASTREIO ─── */}
      {activeTab === 'tracking' && (
        <div style={{ marginTop: '24px' }}>
          <div className="checkout-summary-box" style={{ position: 'static', width: '100%', marginBottom: '24px' }}>
            <h3 className="checkout-summary-title" style={{ border: 'none', marginBottom: '16px' }}>
              🔭 Rastrear Entrega Interestelar
            </h3>
            <p style={{ fontSize: '0.83rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Insira o código de rastreamento recebido no e-mail de confirmação do pedido para localizar sua entrega.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: BR1234567890BR"
                value={trackingCode}
                onChange={e => setTrackingCode(e.target.value.toUpperCase())}
                style={{ flex: 1, letterSpacing: '0.05em' }}
              />
              <button
                className="btn-primary"
                style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', backgroundColor: 'var(--color-primary)', color: '#000000', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
                onClick={() => {
                  if (!trackingCode.trim()) {
                    addToast('Insira um código de rastreamento! 🛸', 'error');
                    return;
                  }
                  addToast(`Rastreando "${trackingCode}"... aguarde o sinal do teletransporte! 📡`, 'success');
                }}
              >
                <Search size={15} />
                Rastrear
              </button>
            </div>
          </div>

          {/* Tracking Timeline (static visual reference) */}
          <div className="checkout-summary-box" style={{ position: 'static', width: '100%' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '20px', color: 'var(--color-text-muted)' }}>
              Status do Último Pedido
            </h4>
            {orders.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                Sem pedidos para rastrear ainda. 🌌
              </p>
            ) : (
              <div className="tracking-timeline">
                {[
                  { key: 'processing', label: 'Pedido Confirmado', desc: 'Seu pedido foi recebido e está sendo preparado.', icon: '📋' },
                  { key: 'warp_drive', label: 'Em Trânsito (Warp Drive)', desc: 'Seu pedido saiu para entrega via portal espacial.', icon: '🚀' },
                  { key: 'delivered', label: 'Entregue', desc: 'Pacote materializado no seu endereço com sucesso!', icon: '✅' },
                ].map((step, idx) => {
                  const lastOrder = orders[0];
                  const statuses = ['processing', 'warp_drive', 'delivered'];
                  const currentIdx = statuses.indexOf(lastOrder.status);
                  const stepIdx = statuses.indexOf(step.key);
                  const isDone = stepIdx <= currentIdx;
                  const isCurrent = stepIdx === currentIdx;

                  return (
                    <div key={step.key} className={`tracking-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                      <div className="tracking-step-icon">
                        {isDone ? step.icon : <span style={{ opacity: 0.3 }}>{step.icon}</span>}
                      </div>
                      <div className="tracking-step-content">
                        <div className="tracking-step-label">{step.label}</div>
                        <div className="tracking-step-desc">{step.desc}</div>
                      </div>
                      {idx < 2 && <div className={`tracking-step-line ${isDone && stepIdx < currentIdx ? 'done' : ''}`} />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
        </>
      )}

      {/* Avatar file input hidden */}
      <input 
        type="file" 
        id="custom-avatar-file-input" 
        style={{ display: 'none' }} 
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const base64 = await fileToBase64(file);
            onUpdateProfile({ ...userProfile, species: 'custom', avatarUrl: base64 });
            addToast('Holograma atualizado com sucesso!', 'success');
          }
        }}
      />
    </div>
  );
};

export default ProfileView;
