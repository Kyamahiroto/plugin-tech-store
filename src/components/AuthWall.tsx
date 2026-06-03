import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, User, Sparkles, AlertTriangle, Loader2, KeyRound, ShieldCheck, ArrowLeft } from 'lucide-react';
import { API_URL } from '../utils/api';

interface AuthWallProps {
  title?: string;
  subtitle?: string;
  onSuccess?: () => void;
  context?: 'cart' | 'profile';
}

// Recovery has 3 steps: 'email' -> 'code' -> 'new_password'
type RecoveryStep = 'email' | 'code' | 'new_password';

const AuthWall: React.FC<AuthWallProps> = ({ 
  title = 'Identificação Intergaláctica Necessária',
  subtitle = 'Para garantir a rota do teletransporte, confirme suas credenciais na federação cósmica.',
  onSuccess,
  context = 'profile'
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Register verification states
  const [isVerifyingRegister, setIsVerifyingRegister] = useState(false);
  const [registerCode, setRegisterCode] = useState('');

  // Recovery states
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<RecoveryStep>('email');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const clearMessages = () => { setErrorMsg(''); setSuccessMsg(''); };

  // ---- STEP 1: Send OTP code to email ----
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email) {
      setErrorMsg('Precisamos da sua frequência (E-mail) para enviar o código cósmico.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: undefined, // We handle via OTP, no redirect needed
      });

      if (error) {
        setErrorMsg(`Falha ao lançar sonda: ${error.message}`);
      } else {
        setSuccessMsg('');
        setRecoveryStep('code');
      }
    } catch {
      setErrorMsg('Interferência solar. Tente novamente em breve.');
    }
    setLoading(false);
  };

  // ---- STEP 2: Verify the 6-digit OTP code ----
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Insira o código de 6 dígitos enviado ao seu e-mail cósmico.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'recovery',
      });

      if (error) {
        if (error.message.includes('expired') || error.message.includes('invalid')) {
          setErrorMsg('Código inválido ou expirado. O sinal da nave mãe se dissipou. Solicite um novo.');
        } else {
          setErrorMsg(`Erro de verificação: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      // Code is valid — proceed to new password
      setRecoveryStep('new_password');
    } catch {
      setErrorMsg('Falha de comunicação com a nave mãe. Tente novamente.');
    }
    setLoading(false);
  };

  // ---- STEP 3: Set new password ----
  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('Seu novo código secreto deve ter pelo menos 6 caracteres holográficos.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMsg('Os códigos secretos não batem. A federação galáctica está confusa.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });

      if (error) {
        setErrorMsg(`Falha ao reconfigurar DNA: ${error.message}`);
        setLoading(false);
        return;
      }

      // Password updated — reset all recovery state and go back to login
      setSuccessMsg('Código secreto atualizado com sucesso! Bem-vindo de volta à federação. 🛸');
      setTimeout(() => {
        setIsRecovering(false);
        setRecoveryStep('email');
        setOtpCode('');
        setNewPassword('');
        setNewPasswordConfirm('');
        setIsLogin(true);
        clearMessages();
      }, 3000);
    } catch {
      setErrorMsg('Anomalia no banco de dados alienígena. Tente novamente.');
    }
    setLoading(false);
  };

  // ---- REGISTER VERIFICATION ----
  const handleSendRegisterCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email || !password || !name) {
      setErrorMsg('Preencha os campos obrigatórios (Nome, E-mail, Senha) terráqueo!');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Sua senha secreta deve ter pelo menos 6 caracteres holográficos.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || 'Erro ao comunicar com a nave central.');
        setLoading(false);
        return;
      }
      
      setIsVerifyingRegister(true);
      setSuccessMsg('Código enviado! Verifique sua caixa de entrada.');
    } catch (err) {
      setErrorMsg('Falha de conexão com a base. Servidor online?');
    }
    setLoading(false);
  };

  const handleVerifyRegisterCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!registerCode || registerCode.length < 6) {
      setErrorMsg('Insira o código de 6 dígitos.');
      return;
    }

    setLoading(true);
    try {
      // 1. Verify code
      const res = await fetch(`${API_URL}/api/auth/verify-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: registerCode })
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrorMsg(data.error || 'Código inválido.');
        setLoading(false);
        return;
      }

      // 2. Finalize Supabase Signup
      const { data: supaData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            species: 'gray',
            homePlanet: 'Terra (Indefinido)',
            dangerLevel: 'harmless',
            walletBalance: 500, // They will get +100 XP from welcome email logic later
            xp: 100 // Starting XP bonus
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          setErrorMsg('Este e-mail já foi abduzido anteriormente. Tente entrar na conta.');
        } else {
          setErrorMsg(`Anomalia no sistema: ${error.message}`);
        }
        setLoading(false);
        return;
      }

      // 3. Trigger Welcome Email
      fetch(`${API_URL}/api/auth/welcome`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      }).catch(err => console.error('Failed to trigger welcome email:', err));

      if (supaData.session === null) {
        setSuccessMsg('Abdução completa! Você precisará confirmar seu email via link do Supabase se exigido.');
      } else {
        if (onSuccess) onSuccess();
      }

    } catch (err) {
      setErrorMsg('Falha na comunicação final com a nave mãe.');
    }
    setLoading(false);
  };

  // ---- MAIN LOGIN ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!email || !password) {
      setErrorMsg('Preencha os campos obrigatórios, terráqueo!');
      return;
    }

    if (!isLogin && !name) {
      setErrorMsg('Precisamos saber como a nave deve te chamar (Nome).');
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMsg('As coordenadas secretas (E-mail ou Senha) não conferem com os registros alienígenas.');
          } else {
            setErrorMsg(`Erro cósmico: ${error.message}`);
          }
          setLoading(false);
          return;
        }

        if (onSuccess) onSuccess();

      }
    } catch {
      setErrorMsg('Falha de comunicação com a nave mãe. Tente novamente mais tarde.');
    }

    setLoading(false);
  };

  // ---- RECOVERY PANEL RENDERER ----
  const renderRecovery = () => {
    if (recoveryStep === 'email') {
      return (
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📡</div>
          <h3 className="neon-text" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Recuperação de Memória</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Digite sua frequência (E-mail). Vamos lançar uma sonda com um <strong>código secreto de 6 dígitos</strong> para o seu e-mail cósmico.
          </p>

          <form onSubmit={handleSendOtp} className="auth-form">
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Frequência (E-mail)</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="marciano@galaxia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {errorMsg && <div className="auth-alert error animate-shake"><AlertTriangle size={16} /><span>{errorMsg}</span></div>}

            <button type="submit" className="neon-glow-btn auth-submit-btn" disabled={loading}>
              {loading ? <Loader2 size={18} className="spin-anim" /> : 'LANÇAR SONDA DE RECUPERAÇÃO 📡'}
            </button>
            <button type="button" className="auth-back-btn" onClick={() => { setIsRecovering(false); clearMessages(); }}>
              <ArrowLeft size={15} /> Voltar ao Teletransporte
            </button>
          </form>
        </div>
      );
    }

    if (recoveryStep === 'code') {
      return (
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔑</div>
          <h3 className="neon-text" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Código Intergaláctico</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            A sonda chegou! Digite o <strong>código de 6 dígitos</strong> que enviamos para <span style={{ color: 'var(--color-primary)' }}>{email}</span>.
          </p>

          <form onSubmit={handleVerifyOtp} className="auth-form">
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Código Cósmico (6 dígitos)</label>
              <div className="input-with-icon">
                <KeyRound size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input otp-input"
                  placeholder="000000"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={loading}
                  style={{ letterSpacing: '0.5em', fontSize: '1.4rem', textAlign: 'center', paddingLeft: '14px' }}
                />
              </div>
            </div>

            {errorMsg && <div className="auth-alert error animate-shake"><AlertTriangle size={16} /><span>{errorMsg}</span></div>}

            <button type="submit" className="neon-glow-btn auth-submit-btn" disabled={loading}>
              {loading ? <Loader2 size={18} className="spin-anim" /> : 'VERIFICAR CÓDIGO'}
            </button>
            <button type="button" className="auth-back-btn" onClick={() => { setRecoveryStep('email'); clearMessages(); setOtpCode(''); }}>
              <ArrowLeft size={15} /> Reenviar código
            </button>
          </form>
        </div>
      );
    }

    if (recoveryStep === 'new_password') {
      return (
        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛡️</div>
          <h3 className="neon-text" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Novo Código Secreto</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Identidade verificada! Agora defina seu novo código secreto para acesso à federação.
          </p>

          <form onSubmit={handleSetNewPassword} className="auth-form">
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Novo Código Secreto</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Confirmar Código Secreto</label>
              <div className="input-with-icon">
                <ShieldCheck size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repita o código"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {errorMsg && <div className="auth-alert error animate-shake"><AlertTriangle size={16} /><span>{errorMsg}</span></div>}
            {successMsg && <div className="auth-alert success animate-fade-in"><Sparkles size={16} /><span>{successMsg}</span></div>}

            <button type="submit" className="neon-glow-btn auth-submit-btn" disabled={loading}>
              {loading ? <Loader2 size={18} className="spin-anim" /> : 'RECONFIGURAR DNA 🧬'}
            </button>
          </form>
        </div>
      );
    }
  };

  return (
    <div className="auth-wall-container animate-fade-in">
      <div className="auth-wall-header">
        <div className="auth-wall-avatar">
          {isRecovering ? '🔐' : context === 'cart' ? '🛸' : '👽'}
        </div>
        <h2 className="neon-text">{isRecovering ? 'Central de Recuperação' : title}</h2>
        <p className="auth-wall-subtitle">{isRecovering ? 'Sistema de restauração de DNA alienígena' : subtitle}</p>
      </div>

      <div className="auth-wall-card glass-panel" style={{ padding: '36px 28px', minHeight: '420px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        {loading && !isLogin && !isRecovering ? (
          // --- ABDUCTION ANIMATION (REGISTER LOADING) ---
          <div className="abduction-animation-container animate-fade-in">
            <div className="ufo">🛸</div>
            <div className="tractor-beam"></div>
            <div className="human">🧍</div>
            <h3 className="neon-text" style={{ marginTop: '24px', fontSize: '1.2rem' }}>Criando conta...</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '8px' }}>
              Transferindo seu DNA para os servidores da nave mãe.
            </p>
          </div>
        ) : isRecovering ? (
          // --- RECOVERY MULTI-STEP ---
          <div style={{ width: '100%' }}>
            {renderRecovery()}
          </div>
        ) : isVerifyingRegister ? (
          // --- REGISTER OTP VERIFICATION ---
          <div className="animate-fade-in" style={{ textAlign: 'center', width: '100%' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>👽</div>
            <h3 className="neon-text" style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Autenticação Requerida</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '24px' }}>
              Enviamos um código de confirmação para <span style={{ color: 'var(--color-primary)' }}>{email}</span>. Insira-o abaixo para concluir o cadastro.
            </p>

            <form onSubmit={handleVerifyRegisterCode} className="auth-form">
              <div className="form-group" style={{ textAlign: 'left' }}>
                <label className="form-label">Código de Verificação (6 dígitos)</label>
                <div className="input-with-icon">
                  <KeyRound size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input otp-input"
                    placeholder="000000"
                    maxLength={6}
                    value={registerCode}
                    onChange={(e) => setRegisterCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    disabled={loading}
                    style={{ letterSpacing: '0.5em', fontSize: '1.4rem', textAlign: 'center', paddingLeft: '14px' }}
                  />
                </div>
              </div>

              {errorMsg && <div className="auth-alert error animate-shake"><AlertTriangle size={16} /><span>{errorMsg}</span></div>}
              {successMsg && <div className="auth-alert success animate-fade-in"><Sparkles size={16} /><span>{successMsg}</span></div>}

              <button type="submit" className="neon-glow-btn auth-submit-btn" disabled={loading}>
                {loading ? <Loader2 size={18} className="spin-anim" /> : 'CONCLUIR ABDUÇÃO 🛸'}
              </button>
              <button type="button" className="auth-back-btn" onClick={() => { setIsVerifyingRegister(false); clearMessages(); setRegisterCode(''); }}>
                <ArrowLeft size={15} /> Voltar e alterar e-mail
              </button>
            </form>
          </div>
        ) : (
          // --- LOGIN / REGISTER TABS ---
          <div className="animate-fade-in" style={{ width: '100%' }}>
            <div className="auth-tabs">
              <button 
                className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(true); clearMessages(); }}
              >
                Entrar (Teletransporte)
              </button>
              <button 
                className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => { setIsLogin(false); clearMessages(); }}
              >
                Cadastrar (Abdução)
              </button>
            </div>

            <form onSubmit={isLogin ? handleSubmit : handleSendRegisterCode} className="auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Nome Registrado na Galáxia</label>
                  <div className="input-with-icon">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: Zog o Terrível..."
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Frequência (E-mail)</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    className="form-input"
                    placeholder="marciano@galaxia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Código Secreto (Senha)</label>
                <div className="input-with-icon">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    className="form-input"
                    placeholder="******"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {errorMsg && <div className="auth-alert error animate-shake"><AlertTriangle size={16} /><span>{errorMsg}</span></div>}
              {successMsg && <div className="auth-alert success animate-fade-in"><Sparkles size={16} /><span>{successMsg}</span></div>}

              <button type="submit" className="neon-glow-btn auth-submit-btn" disabled={loading}>
                {loading ? (
                  <Loader2 size={18} className="spin-anim" />
                ) : (
                  isLogin ? 'INICIAR TELETRANSPORTE' : 'ABDUZIR CONTA'
                )}
              </button>
            </form>
          </div>
        )}
      </div>
      
      {/* Comical Footer Note */}
      <div className="auth-wall-footer">
        {!isRecovering && (
          isLogin ? (
            <p>
              Esqueceu a senha? Infelizmente os apagadores de memória do MIB passaram por aqui. Terá que lembrar sozinho.{' '}
              <br/>
              <span 
                style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                onClick={() => { setIsRecovering(true); setRecoveryStep('email'); clearMessages(); }}
              >
                (Mentira, é só clicar aqui)
              </span>
            </p>
          ) : (
            <p>Ao se cadastrar, você concorda em não processar a federação galáctica em caso de abdução acidental durante a madrugada.</p>
          )
        )}
      </div>
    </div>
  );
};

export default AuthWall;
