import React from 'react';
import { MessageCircle } from 'lucide-react';

interface FooterProps {
  paymentMethods?: string[];
  addToast: (msg: string, type?: 'success' | 'error') => void;
}

const Footer: React.FC<FooterProps> = ({ paymentMethods = [], addToast }) => {
  return (
    <footer style={{
      marginTop: '80px',
      padding: '64px 32px 32px 32px',
      borderTop: '1px solid rgba(69, 230, 39, 0.2)',
      backgroundColor: '#0a0a0a',
      color: 'var(--color-text-muted)',
      width: '100vw',
      position: 'relative',
      left: '50%',
      right: '50%',
      marginLeft: '-50vw',
      marginRight: '-50vw'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px',
        marginBottom: '48px',
        textAlign: 'left'
      }}>
        {/* Logo & Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Plug-In Logo" style={{ height: '45px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-text-white)', fontFamily: 'var(--font-display)', letterSpacing: '1px', lineHeight: 1 }}>
                PLUG-IN
              </span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Tech Store
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--color-text-muted)' }}>
            A melhor e mais veloz loja de tecnologia interestelar da galáxia. Abduzimos os intermediários para trazer periféricos diretamente da nave-mãe.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            © {new Date().getFullYear()} Plug-in Tech Store. Todos os direitos reservados de acordo com o Tratado de Paz da Federação Galáctica.
          </p>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ color: 'var(--color-text-white)', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Navegação</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem' }}>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link" onClick={() => addToast('Página Sobre Nós em desenvolvimento na próxima órbita.', 'success')}>Sobre Nós</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link" onClick={() => addToast('Página de Contato em desenvolvimento na próxima órbita.', 'success')}>Contato</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link" onClick={() => addToast('Políticas Interestelares integradas.', 'success')}>Política de Privacidade</span>
            <span style={{ cursor: 'pointer', transition: 'color 0.2s' }} className="footer-link" onClick={() => addToast('Termos de Uso vigentes.', 'success')}>Termos de Uso</span>
          </div>
        </div>

        {/* WhatsApp / Support */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h4 style={{ color: 'var(--color-text-white)', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Fale Conosco</h4>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>
            Dúvidas cósmicas ou problemas com o teletransporte de produtos? Sintonize nosso suporte de plantão!
          </p>
          <a 
            href="https://wa.me/5500000000000" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#25D366',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s, boxShadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 211, 102, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(37, 211, 102, 0.4)';
            }}
          >
            <MessageCircle size={18} />
            CHAT DO WHATSAPP
          </a>
        </div>

        {/* Forms of Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h4 style={{ color: 'var(--color-text-white)', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Formas de Pagamento</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
            Aceitamos as moedas mais estáveis da galáxia terrestre:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {paymentMethods.map((payment) => (
              <span
                key={payment}
                style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(69, 230, 39, 0.3)',
                  color: 'var(--color-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 0 5px rgba(69, 230, 39, 0.1)'
                }}
              >
                {payment}
              </span>
            ))}
            {paymentMethods.length === 0 && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Nenhuma forma selecionada</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
