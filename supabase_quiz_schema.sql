-- Migration: Adicionar campos do Quiz "Monte seu Setup" na tabela de produtos
-- Execute este script no SQL Editor do seu dashboard do Supabase

ALTER TABLE products
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS estiloVisual TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS prioridade TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS perfilRecomendado TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS popularidade INTEGER DEFAULT 0;

-- Opcional: Para facilitar a busca, podemos criar índices nessas colunas array (se necessário no futuro)
-- CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN (tags);
-- CREATE INDEX IF NOT EXISTS idx_products_perfil ON products USING GIN (perfilRecomendado);

COMMENT ON COLUMN products.tags IS 'Tags para match do quiz (ex: competitivo, rgb, silencioso)';
COMMENT ON COLUMN products.estiloVisual IS 'Estilo estético para o quiz (ex: Cyberpunk, Minimalista Lunar)';
COMMENT ON COLUMN products.prioridade IS 'Prioridades atendidas pelo produto (ex: Performance, Custo-benefício)';
COMMENT ON COLUMN products.perfilRecomendado IS 'Perfis de usuário recomendados (ex: gamer-competitivo, streamer)';
COMMENT ON COLUMN products.popularidade IS 'Pontuação de popularidade (0-100) para critério de desempate no motor de recomendação';
