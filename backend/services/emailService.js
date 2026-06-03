const { Resend } = require('resend');

// If running in development without a key, we log instead of throw so local tests don't crash hard
const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');
const SENDER_EMAIL = 'Equipe Plug-in <nao-responda@lojaplugin.store>';

// =====================================
// BASE HTML TEMPLATE
// =====================================
const getBaseTemplate = (title, content, btnText, btnLink) => `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      background-color: #050505;
      color: #e0e0e0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
      background-color: #050505;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo {
      font-size: 24px;
      font-weight: 900;
      color: #fff;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .logo span {
      color: #45e627;
    }
    .box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(69, 230, 39, 0.2);
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 0 20px rgba(69, 230, 39, 0.05);
    }
    h1 {
      color: #fff;
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    p {
      line-height: 1.6;
      margin-bottom: 20px;
      font-size: 15px;
    }
    .btn-container {
      text-align: center;
      margin-top: 30px;
    }
    .btn {
      display: inline-block;
      background: #45e627;
      color: #000 !important;
      text-decoration: none;
      padding: 14px 28px;
      font-weight: bold;
      border-radius: 6px;
      font-size: 16px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">PLUG-IN <span>TECH</span></div>
    </div>
    <div class="box">
      <h1>${title}</h1>
      ${content}
      ${btnText && btnLink ? `
      <div class="btn-container">
        <a href="${btnLink}" class="btn">${btnText}</a>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      Esta é uma transmissão oficial da nave-mãe. <br>
      © ${new Date().getFullYear()} Plug-in Tech Store. Todos os direitos intergalácticos reservados.
    </div>
  </div>
</body>
</html>
`;

// =====================================
// FUNNEL: REGISTRATION
// =====================================

const sendVerificationCode = async (email, code) => {
  const content = `
    <p>Alerte as defesas: uma nova nave está tentando acoplar.</p>
    <p>Para confirmar sua identidade e finalizar o registro na nossa tripulação, utilize o código de acesso abaixo:</p>
    <div style="background: rgba(69, 230, 39, 0.1); border: 1px dashed #45e627; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #45e627;">${code}</span>
    </div>
    <p>Este código expira em 15 minutos terrestres.</p>
  `;
  
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: '🛸 Código de Autenticação Intergaláctica',
    html: getBaseTemplate('Verificação de Cadastro', content)
  });
};

const sendWelcome = async (email, name) => {
  const content = `
    <p>Saudações, <strong>${name}</strong>!</p>
    <p>Você acaba de ser oficialmente aceito na nossa tripulação. Prepare-se para explorar as melhores tecnologias do universo.</p>
    
    <h3 style="color: #45e627; margin-top: 30px;">O que são Aliencoins?</h3>
    <p>Nossa moeda oficial. Você ganha Aliencoins comprando produtos, cumprindo missões e subindo de patente. Troque por cupons e produtos reais!</p>
    
    <h3 style="color: #45e627;">XP e Rankings</h3>
    <p>Acumule XP para subir de ranking. Quanto maior sua patente, melhores os benefícios na nossa loja.</p>

    <div style="background: rgba(167, 139, 250, 0.1); border-left: 4px solid #a78bfa; padding: 15px; margin-top: 20px;">
      <strong>🎁 Bônus Detectado:</strong> Complete seu perfil agora mesmo e ganhe +100 XP instantaneamente!
    </div>
  `;
  
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: `Bem-vindo à tripulação, ${name} 👽`,
    html: getBaseTemplate('Missão Inicial Concluída', content, 'Completar Meu Perfil', 'https://lojaplugin.store/profile')
  });
};

// =====================================
// FUNNEL: ORDERS
// =====================================

const sendOrderConfirmed = async (email, order) => {
  const content = `
    <p>Recebemos a confirmação do seu pedido <strong>#${order.id.slice(0,8).toUpperCase()}</strong>.</p>
    <p>Sua nave já recebeu a missão de separar os equipamentos. Você pode acompanhar o status a qualquer momento no seu painel de controle.</p>
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: '🚀 Pedido confirmado! Sua nave já recebeu a missão.',
    html: getBaseTemplate('Pedido Confirmado', content, 'Acompanhar Missão', 'https://lojaplugin.store/profile')
  });
};

const sendPaymentApproved = async (email, order) => {
  const content = `
    <p>Os créditos galácticos foram transferidos com sucesso para o seu pedido <strong>#${order.id.slice(0,8).toUpperCase()}</strong>.</p>
    <p>Você pode acompanhar o status da preparação e rastreio direto pelo seu perfil da loja.</p>
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: '✅ Pagamento confirmado',
    html: getBaseTemplate('Pagamento Aprovado', content, 'Acompanhar Missão', 'https://lojaplugin.store/profile')
  });
};

const sendOrderShipped = async (email, trackingCode) => {
  const content = `
    <p>Sua encomenda foi injetada no hiperespaço e já está viajando pela galáxia rumo à Terra.</p>
    ${trackingCode ? `<p>Código de rastreio: <strong>${trackingCode}</strong></p>` : ''}
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: '📦 Sua encomenda já está viajando pela galáxia',
    html: getBaseTemplate('Pedido Enviado', content, 'Acompanhar Encomenda', 'https://lojaplugin.store/profile')
  });
};

// =====================================
// FUNNEL: GAMIFICATION
// =====================================

const sendRankUp = async (email, newRank) => {
  const content = `
    <p>Nossos sensores detectaram um aumento massivo na sua experiência.</p>
    <p>Você acaba de ser promovido para a patente de <strong>${newRank}</strong>! Acesse seu painel para descobrir novos benefícios.</p>
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: `⭐ Você acaba de se tornar um ${newRank}`,
    html: getBaseTemplate('Promoção Confirmada', content, 'Ver Benefícios', 'https://lojaplugin.store/profile')
  });
};

const sendMissionCompleted = async (email, missionName, reward) => {
  const content = `
    <p>Você completou a missão: <strong>${missionName}</strong></p>
    <p>As recompensas foram transferidas para sua conta: ${reward}</p>
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: 'Missão concluída! Recompensas entregues',
    html: getBaseTemplate('Sucesso na Missão', content, 'Ver Painel', 'https://lojaplugin.store/profile')
  });
};

// =====================================
// FUNNEL: CART ABANDONMENT
// =====================================

const sendAbandonedCart1h = async (email) => {
  const content = `
    <p>Detectamos que alguns equipamentos de alta tecnologia ficaram esquecidos no compartimento de carga da sua nave.</p>
    <p>Seus itens ainda estão reservados, mas não garantimos que continuem em estoque por muito tempo!</p>
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: 'Esqueceu algo na nave?',
    html: getBaseTemplate('Sistemas em Alerta', content, 'Recuperar Equipamentos', 'https://lojaplugin.store/cart')
  });
};

// =====================================
// FUNNEL: POST-DELIVERY
// =====================================

const sendDeliveryCompleted = async (email) => {
  const content = `
    <p>Sua missão foi concluída com sucesso! Todos os equipamentos foram teletransportados para o destino final.</p>
    <p>Esperamos que você esteja satisfeito com a tecnologia intergaláctica adquirida.</p>
    <div style="background: rgba(167, 139, 250, 0.1); border-left: 4px solid #a78bfa; padding: 15px; margin-top: 20px;">
      <strong>🌟 Ganhe XP!</strong> Avalie os produtos que você comprou e receba bônus de experiência.
    </div>
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: '🎉 Sua missão foi concluída',
    html: getBaseTemplate('Entrega Concluída', content, 'Avaliar Produtos', 'https://lojaplugin.store')
  });
};

// =====================================
// FUNNEL: PASSWORD RESET
// =====================================

const sendPasswordReset = async (email, resetLink) => {
  const content = `
    <p>Recebemos uma solicitação para redefinir sua senha interplañétaria.</p>
    <p>Se você não fez essa solicitação, pode ignorar este e-mail. Caso contrário, clique no botão abaixo.</p>
  `;
  return resend.emails.send({
    from: SENDER_EMAIL,
    to: email,
    subject: 'Redefina sua senha interplañétaria',
    html: getBaseTemplate('Recuperação de Senha', content, 'Redefinir Senha', resetLink || 'https://lojaplugin.store')
  });
};

// Export all methods
module.exports = {
  resend,
  getBaseTemplate,
  sendVerificationCode,
  sendWelcome,
  sendOrderConfirmed,
  sendPaymentApproved,
  sendOrderShipped,
  sendDeliveryCompleted,
  sendPasswordReset,
  sendRankUp,
  sendMissionCompleted,
  sendAbandonedCart1h
};

