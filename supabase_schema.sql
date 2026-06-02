-- ====================================================
-- PLUG-IN TECH STORE - ESQUEMA DO BANCO DE DADOS
-- ====================================================
-- Execute este script no SQL Editor do seu projeto Supabase.
-- Caminho: Dashboard do Supabase -> SQL Editor -> Novo Query -> Colar e Executar.

-- Limpeza de tabelas existentes (opcional, para recomeçar limpo)
DROP TABLE IF EXISTS public.orders;
DROP TABLE IF EXISTS public.products;
DROP TABLE IF EXISTS public.banners;
DROP TABLE IF EXISTS public.categories;

-- ----------------------------------------------------
-- 1. TABELA: CATEGORIAS (categories)
-- ----------------------------------------------------
CREATE TABLE public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    image_url TEXT
);

-- Ativar RLS (Row Level Security)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Categorias
CREATE POLICY "Permitir leitura pública de categorias" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Permitir controle total para administradores" ON public.categories FOR ALL USING (true);

-- Inserir dados iniciais de Categorias
INSERT INTO public.categories (id, name, icon_name, slug) VALUES
('cat-audio', 'ÁUDIO', 'Headphones', 'audio'),
('cat-mouses', 'MOUSES', 'Mouse', 'mouses'),
('cat-teclados', 'TECLADOS', 'Keyboard', 'teclados'),
('cat-games', 'GAMES', 'Gamepad', 'games'),
('cat-acessorios', 'PERIFÉRICOS', 'Cpu', 'perifericos');

-- ----------------------------------------------------
-- 2. TABELA: PRODUTOS (products)
-- ----------------------------------------------------
CREATE TABLE public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    old_price NUMERIC,
    discount INTEGER,
    image TEXT NOT NULL,
    category TEXT REFERENCES public.categories(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
    is_new BOOLEAN DEFAULT FALSE,
    stock INTEGER DEFAULT 0,
    specs JSONB DEFAULT '{}'::jsonb,
    funny_review JSONB,
    type TEXT DEFAULT 'fisico',
    affiliate_link TEXT,
    virtual_content TEXT,
    order_bump_id TEXT,
    order_bump_discount INTEGER,
    gallery JSONB DEFAULT '[]'::jsonb,
    variations JSONB DEFAULT '[]'::jsonb,
    tags JSONB DEFAULT '[]'::jsonb,
    estilo_visual JSONB DEFAULT '[]'::jsonb,
    prioridade JSONB DEFAULT '[]'::jsonb,
    perfil_recomendado JSONB DEFAULT '[]'::jsonb,
    popularidade INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Produtos
CREATE POLICY "Permitir leitura pública de produtos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir controle total de produtos" ON public.products FOR ALL USING (true);

-- Inserir dados iniciais de Produtos
INSERT INTO public.products (id, name, description, price, old_price, discount, image, category, is_new, stock, specs, funny_review) VALUES
(
  'prod-headset-x9',
  'Headset Gamer Alienígena X-9',
  'Isolamento acústico absoluto contra ruídos de motores a dobra e turbinas de UFOs. LED verde exclusivo no tom exato da nave-mãe.',
  189.90,
  299.00,
  36,
  'headset',
  'audio',
  false,
  12,
  '{"Conexão": "Ultra-frequência Quântica & USB-C", "Iluminação": "RGB Verde Radioativo (#45e627)", "Isolamento": "Blindagem Eletromagnética de Titânio", "Drivers": "50mm de Plasma Sonoro"}',
  '{"author": "G’kar de Órion", "text": "O isolamento é tão bom que minha esposa gritou que a nave estava pegando fogo e eu continuei jogando meu simulador de buraco negro. Recomendo muito!", "rating": 5}'
),
(
  'prod-stick-retro',
  'Console Stick 4K Wireless Retro',
  'Vem com mais de 10.000 clássicos terráqueos antigos. Passatempo perfeito para longas viagens espaciais de 50 anos-luz.',
  187.50,
  250.00,
  25,
  'console',
  'games',
  false,
  8,
  '{"Resolução": "4K Upscaling Interestelar", "Controles": "2x Sem Fio via Telepatia (2.4GHz)", "Jogos inclusos": "10.000+ simuladores terráqueos", "Garantia": "3 séculos terrestres"}',
  '{"author": "Zog do Pântano", "text": "Finalmente entendi por que os humanos passavam o dia apertando botões. Esse negócio de Mario Bros é altamente hipnótico. Quase atrasei a invasão.", "rating": 4}'
),
(
  'prod-orelha-gato',
  'Fone Bluetooth Orelha de Gato Cyber',
  'Design fofo com orelhas luminosas. Emitem ondas eletromagnéticas de baixa frequência que pacificam felinos terráqueos.',
  149.90,
  199.90,
  25,
  'cat-headphones',
  'audio',
  true,
  15,
  '{"Bluetooth": "V5.3 Cósmico de Baixa Latência", "Orelhas": "LED RGB Sincronizado com Batimentos", "Bateria": "48h de reprodução interestelar", "Microfone": "Condensador com cancelamento de chiado cósmico"}',
  '{"author": "Capitã Zorla", "text": "Perfeito! As luzes nas orelhas combinam com o brilho dos meus três olhos. Os humanos acham super fofo quando desço do disco voador usando ele.", "rating": 5}'
),
(
  'prod-teclado-glow',
  'Teclado Mecânico CyberGlow RGB',
  'Switch mecânico com barulho satisfatório audível em toda a Via Láctea. Keycaps transparentes com tratamento anti-radiação gama.',
  299.90,
  380.00,
  21,
  'keyboard',
  'teclados',
  false,
  5,
  '{"Switches": "Blue Switch Mecânico (Clique Estelar)", "Layout": "ABNT2 Terráqueo Padrão", "Cabo": "Malha de Kevlar Trançado Contra Mordidas de Slimes", "Anti-Ghosting": "100% das teclas simultâneas"}',
  '{"author": "Marlon, o Reptiliano", "text": "O clique mecânico é extremamente satisfatório para redigir relatórios de monitoramento da Terra. Dá até vontade de digitar mais rápido.", "rating": 5}'
),
(
  'prod-mouse-radar',
  'Mouse Gamer Alien Radar 12k DPI',
  'Sensor óptico espacial ultrapreciso que lê até partículas subatômicas. Formato ergonômico ideal para quem tem de 3 a 6 dedos na mão.',
  115.00,
  160.00,
  28,
  'mouse',
  'mouses',
  false,
  20,
  '{"Resolução": "12.000 DPI Customizáveis", "Sensor": "PixArt StarScanner V4", "Botões": "7 programáveis por telepatia", "Peso": "75g (super leve, flutua em gravidade zero)"}',
  '{"author": "Blinky (4 Braços)", "text": "A ergonomia é maravilhosa! Serve perfeitamente nos meus dois tentáculos direitos. Os botões laterais facilitam muito o desvio de asteroides no Elite Dangerous.", "rating": 5}'
),
(
  'prod-antena-extraterrestre',
  'Antena de Sintonização de Wi-Fi Interestelar',
  'Amplifique seu sinal de Wi-Fi conectando-se diretamente aos satélites de monitoramento alienígena ocultos na órbita terrestre. Velocidade infinita!',
  89.90,
  120.00,
  25,
  'antenna',
  'perifericos',
  false,
  7,
  '{"Frequência": "GHz Cósmicos Infinitos", "Alcance": "Até a órbita da Lua", "Instalação": "Basta apontar para o céu à meia-noite", "Compatibilidade": "Roteadores terráqueos convencionais"}',
  '{"author": "Terráqueo Paranoico", "text": "Comprei e agora minha internet baixa 500GB por segundo. Só sinto uma leve coceira na nuca e ouço uns sussurros em código binário de vez em quando, mas vale super a pena!", "rating": 4}'
),
(
  'prod-oculos-vr',
  'Óculos VR Holográfico de Simulação da Terra',
  'Cansado do espaço sideral? Coloque este headset de realidade virtual e simule tarefas cotidianas chatas como pagar boletos, pegar trânsito ou lavar louça.',
  499.00,
  650.00,
  23,
  'vr-headset',
  'games',
  true,
  3,
  '{"Lentes": "Super AMOLED Micro-Holográficas", "Simulador": "Experiência Burocrática de Classe 4", "Acessórios": "Simulador de cheiro de chuva e café morno", "Resolução": "Realidade Tangível de 360°"}',
  '{"author": "Xylar-7", "text": "Uau! A simulação de pegar fila na lotérica é extremamente realista! Fiquei com raiva em menos de 2 minutos. Excelente produto para experimentar o sofrimento terráqueo.", "rating": 5}'
);

-- ----------------------------------------------------
-- 3. TABELA: BANNERS (banners)
-- ----------------------------------------------------
CREATE TABLE public.banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT,
    badge TEXT,
    price NUMERIC NOT NULL,
    old_price NUMERIC,
    image TEXT NOT NULL,
    button_text TEXT NOT NULL,
    bg_style TEXT
);

-- Ativar RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Banners
CREATE POLICY "Permitir leitura pública de banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Permitir controle total de banners" ON public.banners FOR ALL USING (true);

-- Inserir dados iniciais de Banners
INSERT INTO public.banners (id, title, subtitle, badge, price, old_price, image, button_text, bg_style) VALUES
(
  'banner-headset',
  'HEADSET GAMER',
  'Com LED RGB e áudio imersivo 7.1 espacial',
  'OFERTA ALIENÍGENA',
  189.90,
  299.00,
  '/layout_mockup.png',
  'COMPRAR AGORA',
  'gradient-green-black'
),
(
  'banner-abduction',
  'DISPOSITIVO DE ABDUÇÃO',
  'Garantia de 12.000 anos-luz contra quebras interestelares.',
  'LANÇAMENTO INTERGALÁCTICO',
  799.00,
  1200.00,
  '/mascot_maintenance.png',
  'ABDUZIR AGORA',
  'gradient-purple-black'
),
(
  'banner-beach',
  'COMBO RELAX DO MARCIANO',
  'Tudo o que você precisa para curtir uma praia solar em Urano.',
  'PROMOÇÃO DE VERÃO',
  349.90,
  450.00,
  '/mascot_beach.png',
  'GARANTIR COMBO',
  'gradient-orange-black'
);

-- ----------------------------------------------------
-- 4. TABELA: PEDIDOS (orders)
-- ----------------------------------------------------
CREATE TABLE public.orders (
    id TEXT PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'processing',
    shipping_address JSONB NOT NULL,
    shipping_fee NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para Pedidos (leitura e inserção livre na loja SPA)
CREATE POLICY "Permitir inserção de pedidos" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir leitura de pedidos" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Permitir atualização de pedidos" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Permitir deleção de pedidos" ON public.orders FOR DELETE USING (true);

-- ----------------------------------------------------
-- 5. TABELA: USUÁRIOS (users)
-- ----------------------------------------------------
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    xp INTEGER DEFAULT 0,
    aliencoins INTEGER DEFAULT 0,
    rank TEXT DEFAULT 'Recruta',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir leitura e escrita do próprio usuário" ON public.users FOR ALL USING (true);

-- ----------------------------------------------------
-- 6. TABELA: CÓDIGOS DE VERIFICAÇÃO (verification_codes)
-- ----------------------------------------------------
CREATE TABLE public.verification_codes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir uso global temporário" ON public.verification_codes FOR ALL USING (true);

-- ----------------------------------------------------
-- 7. TABELA: CARRINHOS (carts)
-- ----------------------------------------------------
CREATE TABLE public.carts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email TEXT UNIQUE REFERENCES public.users(email) ON UPDATE CASCADE ON DELETE CASCADE,
    items JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    abandonment_email_sent_1h BOOLEAN DEFAULT FALSE,
    abandonment_email_sent_24h BOOLEAN DEFAULT FALSE,
    abandonment_email_sent_72h BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir controle do carrinho" ON public.carts FOR ALL USING (true);
