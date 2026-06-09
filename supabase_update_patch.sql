-- ====================================================
-- PLUG-IN TECH STORE - PATCH SEGURO PARA BANCO EXISTENTE
-- ====================================================
-- Execute este arquivo no SQL Editor do Supabase.
-- Nao execute o supabase_schema.sql completo em um banco ja em uso.

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'fisico' CHECK (type IN ('fisico', 'virtual', 'afiliado')),
  ADD COLUMN IF NOT EXISTS affiliate_link TEXT,
  ADD COLUMN IF NOT EXISTS virtual_content TEXT,
  ADD COLUMN IF NOT EXISTS order_bump_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS order_bump_discount INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gallery JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS variations JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS estilo_visual JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS prioridade JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS perfil_recomendado JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS popularidade INTEGER DEFAULT 0;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

INSERT INTO public.categories (id, name, icon_name, slug, order_index)
VALUES ('cat-pcs', 'PCs', 'Cpu', 'pcs', 0)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.orders
  ALTER COLUMN status SET DEFAULT 'received',
  ADD COLUMN IF NOT EXISTS tracking_code TEXT;

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
DROP POLICY IF EXISTS "Admin pode gerenciar cupons" ON public.coupons;
DROP POLICY IF EXISTS "Publico pode ler cupons ativos" ON public.coupons;
DROP POLICY IF EXISTS "Público pode ler cupons ativos" ON public.coupons;
CREATE POLICY "Admin pode gerenciar cupons" ON public.coupons FOR ALL USING (true);
CREATE POLICY "Publico pode ler cupons ativos" ON public.coupons FOR SELECT USING (active = true);

INSERT INTO public.coupons (code, type, value, free_shipping, first_purchase_only, non_cumulative, min_order_value, max_uses, active)
VALUES
  ('BEMVINDO10', 'percent', 10, false, true, true, 50, 100, true),
  ('FRETEFREE', 'fixed', 0, true, false, true, 100, null, true),
  ('PLUG50', 'fixed', 50, false, false, true, 200, 50, true)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.payment_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  pix_discount_percent NUMERIC NOT NULL DEFAULT 5,
  max_installments INTEGER NOT NULL DEFAULT 12,
  installment_min_value NUMERIC NOT NULL DEFAULT 30,
  free_shipping_threshold NUMERIC,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin pode gerenciar pagamentos" ON public.payment_settings;
DROP POLICY IF EXISTS "Publico pode ler configuracoes de pagamento" ON public.payment_settings;
DROP POLICY IF EXISTS "Público pode ler configurações de pagamento" ON public.payment_settings;
CREATE POLICY "Admin pode gerenciar pagamentos" ON public.payment_settings FOR ALL USING (true);
CREATE POLICY "Publico pode ler configuracoes de pagamento" ON public.payment_settings FOR SELECT USING (true);

INSERT INTO public.payment_settings (id, pix_discount_percent, max_installments, installment_min_value, free_shipping_threshold)
VALUES ('global', 5, 12, 30, 299)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.admin_users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'Administrador',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admin pode gerenciar usuarios admin" ON public.admin_users;
DROP POLICY IF EXISTS "Admin pode gerenciar usuários admin" ON public.admin_users;
CREATE POLICY "Admin pode gerenciar usuarios admin" ON public.admin_users FOR ALL USING (true);
