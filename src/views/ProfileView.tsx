import React, { useState } from 'react';
import { UserProfile, Order } from '../types';
import { ALIEN_SPECIES, INITIAL_GAMIFICATION_TASKS } from '../mockData';
import { Coins, Globe, ShieldAlert, LogOut, Package, MapPin, Search, Zap } from 'lucide-react';
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
          {/* Left: DNA Status Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="checkout-summary-box" style={{ width: '100%', position: 'static' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div 
                  className="sidebar-profile-avatar" 
                  style={{ width: '80px', height: '80px', fontSize: '3.5rem', margin: '0 auto 12px auto', border: '3.5px solid var(--color-primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  onClick={() => document.getElementById('custom-avatar-file-input')?.click()}
                >
                  {userProfile.avatarUrl ? (
                    <img src={userProfile.avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    renderEmojiAvatar(ALIEN_SPECIES.find(s => s.id === userProfile.species)?.avatar || '👽', '3.5rem')
                  )}
                </div>
                <h3 className="neon-text" style={{ fontSize: '1.2rem' }}>{name || 'Visitante Cósmico'}</h3>
                <span className="badge-neon" style={{ fontSize: '0.65rem', marginTop: '6px' }}>
                  🧬 {ALIEN_SPECIES.find(s => s.id === userProfile.species)?.name}
                </span>

                {/* GAMIFICATION XP PROGRESS */}
                <div style={{ marginTop: '24px', textAlign: 'left' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: getRankByXP(userProfile.xp || 0).color, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {getRankByXP(userProfile.xp || 0).icon} {getRankByXP(userProfile.xp || 0).name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      {userProfile.xp || 0} XP
                    </span>
                  </div>
                  
                  {getNextRank(userProfile.xp || 0) ? (
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                      <div style={{ 
                        position: 'absolute', left: 0, top: 0, height: '100%', 
                        width: `${Math.min(100, Math.max(0, ((userProfile.xp || 0) / getNextRank(userProfile.xp || 0)!.xpRequired) * 100))}%`,
                        backgroundColor: getRankByXP(userProfile.xp || 0).color,
                        boxShadow: `0 0 10px ${getRankByXP(userProfile.xp || 0).color}`,
                        transition: 'width 0.5s ease-out'
                      }} />
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '8px', backgroundColor: getRankByXP(userProfile.xp || 0).color, borderRadius: '4px', boxShadow: `0 0 10px ${getRankByXP(userProfile.xp || 0).color}` }} />
                  )}
                  
                  {getNextRank(userProfile.xp || 0) && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginTop: '6px', textAlign: 'right' }}>
                      Faltam {getNextRank(userProfile.xp || 0)!.xpRequired - (userProfile.xp || 0)} XP para {getNextRank(userProfile.xp || 0)!.name}
                    </div>
                  )}

                  <button 
                    style={{ 
                      marginTop: '16px', 
                      width: '100%', 
                      fontSize: '0.85rem', 
                      fontWeight: '800',
                      padding: '12px', 
                      backgroundColor: 'var(--color-primary)',
                      color: '#000000',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      boxShadow: '0 0 15px rgba(69, 230, 39, 0.4)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      transition: 'all 0.2s ease'
                    }} 
                    onClick={() => setActiveTab('missions')}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    🚀 Central de Missões
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Globe size={18} className="neon-text" />
                  <div style={{ fontSize: '0.78rem' }}>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.65rem' }}>Planeta Natal:</span>
                    <strong>{homePlanet}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Zap size={18} className="neon-text" style={{ color: 'var(--color-warning)' }} />
                  <div style={{ fontSize: '0.78rem' }}>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.65rem' }}>Aliencoins (Cashback):</span>
                    <strong style={{ color: 'var(--color-warning)' }}>
                      {userProfile.aliencoins || 0} AC 
                      <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', marginLeft: '6px', fontWeight: 'normal' }}>
                        (≈ R$ {((userProfile.aliencoins || 0) / 100).toFixed(2)})
                      </span>
                    </strong>
                  </div>
                </div>


                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <ShieldAlert size={18} style={{ color: threat.color }} />
                  <div style={{ fontSize: '0.78rem' }}>
                    <span style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.65rem' }}>Ameaça Cósmica:</span>
                    <strong style={{ color: threat.color }}>{threat.label}</strong>
                  </div>
                </div>
              </div>

              {/* Logout button (mobile-friendly, inside card) */}
              {userProfile.name && (
                <button
                  onClick={onLogout}
                  style={{
                    marginTop: '20px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    background: 'rgba(255, 59, 48, 0.08)',
                    border: '1px solid rgba(255, 59, 48, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--color-danger)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255, 59, 48, 0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255, 59, 48, 0.08)')}
                >
                  <LogOut size={15} />
                  Sair da Conta
                </button>
              )}
            </div>
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
                const isCompleted = task.limit === 'once' && (userProfile.xp || 0) > task.rewardAmount;
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
                      gap: '12px'
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
                      <div style={{ 
                        padding: '6px 10px', 
                        backgroundColor: task.rewardType === 'xp' ? 'rgba(69, 230, 39, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: task.rewardType === 'xp' ? '#45e627' : '#f59e0b',
                        border: `1px solid ${task.rewardType === 'xp' ? 'rgba(69, 230, 39, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        whiteSpace: 'nowrap'
                      }}>
                        + {task.rewardAmount} {task.rewardType === 'xp' ? 'XP' : 'AC'}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: '4px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        Frequência: {task.limit === 'once' ? 'Única' : task.limit === 'daily' ? 'Diária' : task.limit === 'weekly' ? 'Semanal' : 'Ilimitada / Repetível'}
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
                style={{ padding: '10px 20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}
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
    </div>
  );
};

export default ProfileView;
