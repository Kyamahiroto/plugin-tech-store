const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { Resend } = require('resend');
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
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Bloqueado pela política CORS do servidor cósmico.'), false);
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

// Set up Resend Client
const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { items, payer, back_urls, auto_return } = req.body;

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
      auto_return
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
// START SERVER
// ========================================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend cósmico escutando na porta ${PORT}`);
});
