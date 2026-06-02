const express = require('express');
const cors = require('cors');
const { MercadoPagoConfig, Preference } = require('mercadopago');
const { Resend } = require('resend');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Set up Mercado Pago Client
const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const preference = new Preference(client);

// Set up Resend Client
const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/api/create-preference', async (req, res) => {
  try {
    const { items, payer, back_urls, auto_return } = req.body;

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

// RESEND ENDPOINT
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, html } = req.body;

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend cósmico escutando na porta ${PORT}`);
});
