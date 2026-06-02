import React, { useState, useEffect } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminLoginViewProps {
  onLoginSuccess: () => void;
}

// We no longer use hardcoded credentials here.
// Users must log in with their Supabase Auth credentials.

const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already logged in on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Double check admin role
        const { data } = await supabase.from('admin_users').select('id').eq('email', session.user.email).single();
        if (data) {
          onLoginSuccess();
        } else {
          await supabase.auth.signOut();
        }
      }
    };
    checkSession();
  }, [onLoginSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Authenticate with Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw new Error('Credenciais inválidas ou erro no servidor galáctico.');
      if (!authData.user) throw new Error('Falha na autenticação.');

      // 2. Verify if the user is an admin
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('id, active')
        .eq('email', authData.user.email)
        .single();

      if (adminError || !adminData) {
        // Sign out immediately if not admin
        await supabase.auth.signOut();
        throw new Error('Acesso negado. Esta conta não possui privilégios de Administrador.');
      }

      if (!adminData.active) {
        await supabase.auth.signOut();
        throw new Error('Acesso negado. Conta de Administrador desativada.');
      }

      // Success
      onLoginSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao conectar ao banco de dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-bg">
      <div className="admin-login-grid-overlay" />

      <div className="admin-login-card glass-panel-neon animate-slide-up">
        {/* Logo & Header */}
        <div className="admin-login-header">
          <div className="admin-login-icon-ring">
            <ShieldCheck size={32} strokeWidth={1.5} />
          </div>
          <h1 className="admin-login-title">PLUG-IN ADMIN</h1>
          <p className="admin-login-subtitle">Painel de Controle da Galáxia</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field-group">
            <label className="admin-field-label">
              <Mail size={14} /> E-mail do Administrador
            </label>
            <input
              type="email"
              className="cyber-input"
              placeholder="admin@plugin.store"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ padding: '12px 16px', fontSize: '0.95rem' }}
            />
          </div>

          <div className="admin-field-group" style={{ position: 'relative' }}>
            <label className="admin-field-label">
              <Lock size={14} /> Senha Secreta
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              className="cyber-input"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ padding: '12px 44px 12px 16px', fontSize: '0.95rem' }}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: '14px', bottom: '14px', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="admin-login-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button
            type="submit"
            className="neon-glow-btn"
            disabled={loading}
            style={{ width: '100%', padding: '14px', fontSize: '0.95rem', marginTop: '8px', gap: '10px' }}
          >
            {loading ? (
              <>
                <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
                Autenticando...
              </>
            ) : (
              <>
                <Zap size={18} />
                ACESSAR PAINEL
              </>
            )}
          </button>
        </form>

        <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '20px', textAlign: 'center' }}>
          Acesso restrito · Plug-in Tech Store Admin v2.0
        </p>
      </div>
    </div>
  );
};

export default AdminLoginView;
