const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { Resend } = require('resend');
const emailService = require('./services/emailService.cjs');
require('dotenv').config();

const app = express();

// ========================================
// SECURITY MIDDLEWARE
// ========================================

// Helmet: sets security HTTP headers (X-Content-Type-Options, X-Frame-Options, etc.)
app.use(helmet());

// CORS: restrict origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'https://lojaplugin.store'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    // Allow Vercel preview URLs automatically
    if (origin && origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // Instead of throwing an error that causes a 500, we pass false so CORS headers are not set
    return callback(null, false);
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

// Rate Limiting: prevent brute-force and DDoS
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                  // max 100 requests per windowMs per IP
  message: { error: 'Muitas requisições. Aguarde antes de tentar novamente. 🛸' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(generalLimiter);

// Stricter limiter for email endpoint (prevent spam)
const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,                   // max 10 emails per hour per IP
  message: { error: 'Limite de envio de e-mails atingido. Tente novamente mais tarde.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parser with size limit to prevent payload attacks
app.use(express.json({ limit: '1mb' }));

// ========================================
// API CLIENTS
// ========================================

// Set up Mercado Pago Client
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const preference = new Preference(client);

// Set up Resend Client (Moved to emailService.js, keeping local for webhooks if needed)
const resend = emailService.resend;

// ========================================
// ROUTES
// ========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// MERCADO PAGO: Create payment preference
app.post('/api/create-preference', async (req, res) => {
  try {
    const { items, payer, back_urls, auto_return, payment_methods } = req.body;

    // Input validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Lista de itens inválida.' });
    }

    if (!payer || !payer.email) {
      return res.status(400).json({ error: 'Dados do pagador inválidos.' });
    }

    // Validate each item has required fields
    for (const item of items) {
      if (!item.title || typeof item.unit_price !== 'number' || item.unit_price <= 0) {
        return res.status(400).json({ error: 'Item com dados inválidos.' });
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ error: 'Quantidade de item inválida.' });
      }
    }

    const body = {
      items,
      payer,
      back_urls,
      auto_return,
      ...(payment_methods && { payment_methods })
    };

    const response = await preference.create({ body });
    
    // We return the init_point directly as we did in the frontend logic
    res.json({ init_point: response.init_point });
  } catch (error) {
    console.error('Error creating MercadoPago preference:', error);
    res.status(500).json({ error: 'Falha ao gerar o link de pagamento interestelar.' });
  }
});

// RESEND: Send email (with stricter rate limit)
app.post('/api/send-email', emailLimiter, async (req, res) => {
  try {
    const { to, subject, html } = req.body;

    // Input validation
    if (!to || typeof to !== 'string') {
      return res.status(400).json({ error: 'Destinatário de e-mail inválido.' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({ error: 'Formato de e-mail inválido.' });
    }

    if (!subject || typeof subject !== 'string' || subject.length > 200) {
      return res.status(400).json({ error: 'Assunto do e-mail inválido ou muito longo.' });
    }

    if (!html || typeof html !== 'string' || html.length > 50000) {
      return res.status(400).json({ error: 'Corpo do e-mail inválido ou muito grande.' });
    }

    const data = await resend.emails.send({
      from: 'Plug-in Tech Store <onboarding@resend.dev>',
      to: [to],
      subject: subject,
      html: html
    });

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    res.status(500).json({ error: 'Falha ao enviar e-mail intergaláctico.' });
  }
});

// ========================================
// ERROR HANDLING
// ========================================

// Catch unhandled errors to prevent stack trace leaks
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

// ========================================
// EMAIL FUNNEL & AUTH ROUTES
// ========================================

// Generate and send verification code
app.post('/api/auth/send-code', emailLimiter, async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-mail obrigatório' });

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  try {
    const response = await emailService.sendVerificationCode(email, code);
    
    // Check if Resend returned an error object (Resend SDK v3 behavior)
    if (response && response.error) {
      console.error('Resend API Error:', response.error);
      return res.status(500).json({ 
        error: `Erro no Resend: ${response.error.message || 'Falha ao enviar email.'}` 
      });
    }

    res.json({ success: true, message: 'Código enviado com sucesso.', devCode: code }); // Passing devCode just for testing locally, remove in prod
  } catch (error) {
    console.error('Error sending code exception:', error);
    res.status(500).json({ error: error.message || 'Erro ao enviar código de verificação' });
  }
});

// Verify code endpoint
app.post('/api/auth/verify-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'E-mail e código são obrigatórios' });

  // In a real scenario, verify against the 'verification_codes' table:
  // const { data } = await supabase.from('verification_codes').select('*').eq('email', email).eq('code', code).single();
  // if (!data) return error.
  
  // For now, we simulate success if the code is 6 digits. The frontend is responsible for the final Supabase Auth creation.
  if (code.length === 6) {
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Código inválido' });
  }
});

// Welcome email endpoint
app.post('/api/auth/welcome', async (req, res) => {
  const { email, name } = req.body;
  if (!email || !name) return res.status(400).json({ error: 'E-mail e nome são obrigatórios' });

  try {
    await emailService.sendWelcome(email, name);
    res.json({ success: true });
  } catch (error) {
    console.error('Welcome email error:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mail de boas-vindas' });
  }
});

// Gamification triggers
app.post('/api/gamification/event', async (req, res) => {
  const { email, type, data } = req.body;
  if (!email || !type) return res.status(400).json({ error: 'Faltam parâmetros' });

  try {
    if (type === 'rank_up') {
      await emailService.sendRankUp(email, data.newRank);
    } else if (type === 'mission_completed') {
      await emailService.sendMissionCompleted(email, data.missionName, data.reward);
    }
    // Handle others: xp_gained, aliencoins_received
    res.json({ success: true });
  } catch (error) {
    console.error('Gamification email error:', error);
    res.status(500).json({ error: 'Erro ao disparar alerta de gamificação' });
  }
});

// Order status change → triggers purchase funnel emails
app.post('/api/orders/status-change', async (req, res) => {
  const { email, orderId, newStatus, trackingCode } = req.body;
  if (!email || !orderId || !newStatus) {
    return res.status(400).json({ error: 'Faltam parâmetros (email, orderId, newStatus)' });
  }

  const order = { id: orderId };

  try {
    switch (newStatus) {
      case 'received':
        await emailService.sendOrderConfirmed(email, order);
        break;
      case 'processing':
        await emailService.sendPaymentApproved(email, order);
        break;
      case 'warp_drive':
        await emailService.sendOrderShipped(email, trackingCode || '');
        break;
      case 'delivered':
        await emailService.sendDeliveryCompleted(email);
        break;
    }
    res.json({ success: true, message: `Email de ${newStatus} enviado para ${email}` });
  } catch (error) {
    console.error('Order status email error:', error);
    res.status(500).json({ error: 'Erro ao enviar e-mail de status do pedido' });
  }
});

// CRON JOB ENDPOINT (Called hourly by Vercel Cron or cron-job.org)
app.get('/api/cron/email-funnel', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET || 'secret'}`) {
    return res.status(401).json({ error: 'Acesso negado' });
  }

  // TODO: Query Supabase carts where updated_at < 1 hour ago and abandonment_email_sent_1h is false
  // await emailService.sendAbandonedCart1h(user.email);
  
  res.json({ success: true, message: 'Funil processado' });
});

// ========================================
// SERVER STARTUP (local dev only)
// ========================================

const PORT = process.env.PORT || 3001;

// Only call app.listen when running directly (local dev)
// When imported by Vercel, we just export the app
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend cósmico escutando na porta ${PORT}`);
  });
}

module.exports = app;
