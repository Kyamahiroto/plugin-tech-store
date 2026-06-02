-- ====================================================
-- PLUG-IN TECH STORE - ADMIN RLS MIGRATION
-- ====================================================
-- Este script substitui as políticas públicas antigas por
-- políticas restritas baseadas no Supabase Auth.
-- 
-- REQUISITOS ANTES DE RODAR:
-- 1. Você deve ter a tabela `admin_users` criada (criamos no script anterior).
-- 2. Insira o e-mail do seu administrador real na tabela `admin_users`:
--    INSERT INTO public.admin_users (email, name) VALUES ('seu-email@aqui.com', 'Admin Master');

-- Função auxiliar para checar se o usuário logado é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE email = auth.jwt() ->> 'email'
      AND active = true
  );
$$;

-- ----------------------------------------------------
-- 1. PRODUTOS (products)
-- ----------------------------------------------------
-- Remove políticas antigas (ignorando erro se não existir)
DROP POLICY IF EXISTS "Permitir leitura pública de produtos" ON public.products;
DROP POLICY IF EXISTS "Permitir controle total de produtos" ON public.products;

-- Cria novas políticas
CREATE POLICY "Leitura pública de produtos" ON public.products 
FOR SELECT USING (true);

CREATE POLICY "Apenas admin modifica produtos" ON public.products 
FOR ALL USING (public.is_admin());

-- ----------------------------------------------------
-- 2. CATEGORIAS (categories)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Permitir leitura pública de categorias" ON public.categories;
DROP POLICY IF EXISTS "Permitir controle total para administradores" ON public.categories;

CREATE POLICY "Leitura pública de categorias" ON public.categories 
FOR SELECT USING (true);

CREATE POLICY "Apenas admin modifica categorias" ON public.categories 
FOR ALL USING (public.is_admin());

-- ----------------------------------------------------
-- 3. BANNERS (banners)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Permitir leitura pública de banners" ON public.banners;
DROP POLICY IF EXISTS "Permitir controle total de banners" ON public.banners;

CREATE POLICY "Leitura pública de banners" ON public.banners 
FOR SELECT USING (true);

CREATE POLICY "Apenas admin modifica banners" ON public.banners 
FOR ALL USING (public.is_admin());

-- ----------------------------------------------------
-- 4. CUPONS (coupons)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Admin pode gerenciar cupons" ON public.coupons;
DROP POLICY IF EXISTS "Público pode ler cupons ativos" ON public.coupons;

CREATE POLICY "Leitura de cupons ativos e não expirados" ON public.coupons 
FOR SELECT USING (
  active = true 
  AND (expires_at IS NULL OR expires_at > now())
);

CREATE POLICY "Apenas admin modifica cupons" ON public.coupons 
FOR ALL USING (public.is_admin());

-- ----------------------------------------------------
-- 5. CONFIGURAÇÕES DE PAGAMENTO (payment_settings)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Admin pode gerenciar pagamentos" ON public.payment_settings;
DROP POLICY IF EXISTS "Público pode ler configurações de pagamento" ON public.payment_settings;

CREATE POLICY "Leitura pública configurações pagamento" ON public.payment_settings 
FOR SELECT USING (true);

CREATE POLICY "Apenas admin modifica configurações pagamento" ON public.payment_settings 
FOR ALL USING (public.is_admin());

-- ----------------------------------------------------
-- 6. USUÁRIOS ADMIN (admin_users)
-- ----------------------------------------------------
DROP POLICY IF EXISTS "Admin pode gerenciar usuários admin" ON public.admin_users;

-- Admin pode ler a tabela (para a função is_admin funcionar, definimos security definer na função, 
-- mas pra listar no painel precisa de política)
CREATE POLICY "Admin gerencia admin_users" ON public.admin_users 
FOR ALL USING (public.is_admin());

-- ----------------------------------------------------
-- 7. PEDIDOS (orders)
-- ----------------------------------------------------
-- Se já houver políticas, excluímos
DROP POLICY IF EXISTS "Público pode inserir pedidos" ON public.orders;
DROP POLICY IF EXISTS "Usuário pode ver seus pedidos" ON public.orders;
DROP POLICY IF EXISTS "Admin pode gerenciar pedidos" ON public.orders;

-- Por enquanto, qualquer um insere pedidos (checkout público)
CREATE POLICY "Público pode inserir pedidos" ON public.orders 
FOR INSERT WITH CHECK (true);

-- No futuro você poderia vincular pedidos ao auth.uid(), mas pra manter compatível:
CREATE POLICY "Qualquer um pode ler pedidos" ON public.orders 
FOR SELECT USING (true);

-- Apenas admins atualizam/deletam pedidos (avançar status)
CREATE POLICY "Apenas admin atualiza pedidos" ON public.orders 
FOR UPDATE USING (public.is_admin());
CREATE POLICY "Apenas admin deleta pedidos" ON public.orders 
FOR DELETE USING (public.is_admin());

-- FIM DO SCRIPT
