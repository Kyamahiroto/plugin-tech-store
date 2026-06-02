-- ====================================================
-- PLUG-IN TECH STORE - ADMIN SCHEMA MIGRATION
-- ====================================================
-- Execute no SQL Editor do Supabase após o schema principal.

-- 1. Atualizar tabela products com campos para tipo de produto e order bump
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'fisico' CHECK (type IN ('fisico', 'virtual', 'afiliado')),
  ADD COLUMN IF NOT EXISTS affiliate_link TEXT,
  ADD COLUMN IF NOT EXISTS virtual_content TEXT,
  ADD COLUMN IF NOT EXISTS order_bump_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS order_bump_discount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb;

-- 1.2 Atualizar tabela categories com ícone de imagem
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 1.5 Atualizar tabela orders com status inicial e código de rastreio
ALTER TABLE public.orders
  ALTER COLUMN status SET DEFAULT 'received',
  ADD COLUMN IF NOT EXISTS tracking_code TEXT;

-- 2. Tabela de Cupons
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL DEFAULT 'percent' CHECK (type IN ('percent', 'fixed')),
  value NUMERIC NOT NULL DEFAULT 0,
  free_shipping BOOLEAN NOT NULL DEFAULT FALSE,
  first_purchase_only BOOLEAN NOT NULL DEFAULT FALSE,
  non_cumulative BOOLEAN NOT NULL DEFAULT TRUE,
  min_order_value NUMERIC,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin pode gerenciar cupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Público pode ler cupons ativos" ON public.coupons FOR SELECT USING (active = true);

-- Cupons iniciais de exemplo
INSERT INTO public.coupons (code, type, value, free_shipping, first_purchase_only, non_cumulative, min_order_value, max_uses, active)
VALUES
  ('BEMVINDO10', 'percent', 10, false, true, true, 50, 100, true),
  ('FRETEFREE', 'fixed', 0, true, false, true, 100, null, true),
  ('PLUG50', 'fixed', 50, false, false, true, 200, 50, true)
ON CONFLICT (code) DO NOTHING;

-- 3. Tabela de Configurações de Pagamento (única linha)
CREATE TABLE IF NOT EXISTS public.payment_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  pix_discount_percent NUMERIC NOT NULL DEFAULT 5,
  max_installments INTEGER NOT NULL DEFAULT 12,
  installment_min_value NUMERIC NOT NULL DEFAULT 30,
  free_shipping_threshold NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin pode gerenciar pagamentos" ON public.payment_settings FOR ALL USING (true);
CREATE POLICY "Público pode ler configurações de pagamento" ON public.payment_settings FOR SELECT USING (true);

INSERT INTO public.payment_settings (id, pix_discount_percent, max_installments, installment_min_value, free_shipping_threshold)
VALUES ('global', 5, 12, 30, 299)
ON CONFLICT (id) DO NOTHING;

-- 4. Tabela de Usuários Admin (e-mails autorizados)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'Administrador',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin pode gerenciar usuários admin" ON public.admin_users FOR ALL USING (true);

-- Inserir admin padrão (substitua pelo e-mail desejado)
-- INSERT INTO public.admin_users (email, name) VALUES ('seu@email.com', 'Administrador Master');
