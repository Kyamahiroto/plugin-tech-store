import { Product, Category, Banner, QuizConfig } from './types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-audio', name: 'ÁUDIO', iconName: 'Headphones', slug: 'audio' },
  { id: 'cat-mouses', name: 'MOUSES', iconName: 'Mouse', slug: 'mouses' },
  { id: 'cat-teclados', name: 'TECLADOS', iconName: 'Keyboard', slug: 'teclados' },
  { id: 'cat-games', name: 'GAMES', iconName: 'Gamepad', slug: 'games' },
  { id: 'cat-acessorios', name: 'PERIFÉRICOS', iconName: 'Cpu', slug: 'perifericos' },
  { id: 'cat-giftcard', name: 'GIFT CARDS', iconName: 'Gift', slug: 'giftcard' }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'banner-headset',
    title: 'HEADSET GAMER',
    subtitle: 'Com LED RGB e áudio imersivo 7.1 espacial',
    badge: 'OFERTA ALIENÍGENA',
    price: 189.90,
    oldPrice: 299.00,
    image: '/layout_mockup.png', // The layout image has the exact headset! We'll use a cropped CSS frame or showcase
    buttonText: 'COMPRAR AGORA',
    bgStyle: 'gradient-green-black'
  },
  {
    id: 'banner-abduction',
    title: 'DISPOSITIVO DE ABDUÇÃO',
    subtitle: 'Garantia de 12.000 anos-luz contra quebras interestelares.',
    badge: 'LANÇAMENTO INTERGALÁCTICO',
    price: 799.00,
    oldPrice: 1200.00,
    image: '/mascot_maintenance.png',
    buttonText: 'ABDUZIR AGORA',
    bgStyle: 'gradient-purple-black'
  },
  {
    id: 'banner-beach',
    title: 'COMBO RELAX DO MARCIANO',
    subtitle: 'Tudo o que você precisa para curtir uma praia solar em Urano.',
    badge: 'PROMOÇÃO DE VERÃO',
    price: 349.90,
    oldPrice: 450.00,
    image: '/mascot_beach.png',
    buttonText: 'GARANTIR COMBO',
    bgStyle: 'gradient-orange-black'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-headset-x9',
    name: 'Headset Gamer Alien Pro 7.1',
    description: 'Isolamento acústico absoluto contra ruídos de motores a dobra e turbinas de UFOs. LED verde exclusivo no tom exato da nave-mãe.',
    price: 189.90,
    oldPrice: 299.00,
    discount: 36,
    image: 'headset',
    category: 'audio',
    isNew: false,
    stock: 12,
    specs: {
      'Conexão': 'Ultra-frequência Quântica & USB-C',
      'Iluminação': 'RGB Verde Radioativo (#45e627)',
      'Isolamento': 'Blindagem Eletromagnética de Titânio',
      'Drivers': '50mm de Plasma Sonoro'
    },
    funnyReview: {
      author: 'G’kar de Órion',
      text: 'O isolamento é tão bom que minha esposa gritou que a nave estava pegando fogo e eu continuei jogando meu simulador de buraco negro. Recomendo muito!',
      rating: 5
    },
    tags: ['competitivo', 'fps', 'imersivo', 'led', 'rgb'],
    estiloVisual: ['RGB Extremo', 'Cyberpunk'],
    prioridade: ['Performance', 'Imersão'],
    perfilRecomendado: ['gamer-competitivo', 'streamer'],
    popularidade: 90
  },
  {
    id: 'prod-stick-retro',
    name: 'Console Stick 4K Wireless Retro',
    description: 'Vem com mais de 10.000 clássicos terráqueos antigos. Passatempo perfeito para longas viagens espaciais de 50 anos-luz.',
    price: 187.50,
    oldPrice: 250.00,
    discount: 25,
    image: 'console',
    category: 'games',
    stock: 8,
    specs: {
      'Resolução': '4K Upscaling Interestelar',
      'Controles': '2x Sem Fio via Telepatia (2.4GHz)',
      'Jogos inclusos': '10.000+ simuladores terráqueos',
      'Garantia': '3 séculos terrestres'
    },
    funnyReview: {
      author: 'Zog do Pântano',
      text: 'Finalmente entendi por que os humanos passavam o dia apertando botões. Esse negócio de Mario Bros é altamente hipnótico. Quase atrasei a invasão.',
      rating: 4
    },
    tags: ['retro', 'casual', 'wireless', 'multimedia', 'diversão'],
    estiloVisual: ['Retrô Espacial', 'Minimalista Lunar'],
    prioridade: ['Custo-benefício', 'Diversão'],
    perfilRecomendado: ['gamer-casual', 'console-gamer', 'iniciante'],
    popularidade: 75
  },
  {
    id: 'prod-orelha-gato',
    name: 'Fone Bluetooth Orelha de Gato Cyber',
    description: 'Design fofo com orelhas luminosas. Emitem ondas eletromagnéticas de baixa frequência que pacificam felinos terráqueos.',
    price: 149.90,
    oldPrice: 199.90,
    discount: 25,
    isNew: true,
    image: 'cat-headphones',
    category: 'audio',
    stock: 15,
    specs: {
      'Bluetooth': 'V5.3 Cósmico de Baixa Latência',
      'Orelhas': 'LED RGB Sincronizado com Batimentos',
      'Bateria': '48h de reprodução interestelar',
      'Microfone': 'Condensador com cancelamento de chiado cósmico'
    },
    funnyReview: {
      author: 'Capitã Zorla',
      text: 'Perfeito! As luzes nas orelhas combinam com o brilho dos meus três olhos. Os humanos acham super fofo quando desço do disco voador usando ele.',
      rating: 5
    },
    tags: ['bluetooth', 'fofo', 'rgb', 'casual', 'streaming'],
    estiloVisual: ['RGB Extremo', 'Kawaii Cósmico'],
    prioridade: ['Estética', 'Conforto'],
    perfilRecomendado: ['streamer', 'criador-conteudo', 'gamer-casual'],
    popularidade: 85
  },
  {
    id: 'prod-teclado-glow',
    name: 'Teclado Mecânico CyberGlow RGB',
    description: 'Switch mecânico com barulho satisfatório audível em toda a Via Láctea. Keycaps transparentes com tratamento anti-radiação gama.',
    price: 299.90,
    oldPrice: 380.00,
    discount: 21,
    image: 'keyboard',
    category: 'teclados',
    stock: 5,
    specs: {
      'Switches': 'Blue Switch Mecânico (Clique Estelar)',
      'Layout': 'ABNT2 Terráqueo Padrão',
      'Cabo': 'Malha de Kevlar Trançado Contra Mordidas de Slimes',
      'Anti-Ghosting': '100% das teclas simultâneas'
    },
    funnyReview: {
      author: 'Marlon, o Reptiliano',
      text: 'O clique mecânico é extremamente satisfatório para redigir relatórios de monitoramento da Terra. Dá até vontade de digitar mais rápido.',
      rating: 5
    },
    tags: ['mecânico', 'rgb', 'competitivo', 'produtividade', 'premium'],
    estiloVisual: ['RGB Extremo', 'Cyberpunk'],
    prioridade: ['Performance', 'Durabilidade'],
    perfilRecomendado: ['gamer-competitivo', 'trabalho-remoto', 'entusiasta-tech'],
    popularidade: 88
  },
  {
    id: 'prod-mouse-radar',
    name: 'Mouse Gamer Alien Radar 12k DPI',
    description: 'Sensor óptico espacial ultrapreciso que lê até partículas subatômicas. Formato ergonômico ideal para quem tem de 3 a 6 dedos na mão.',
    price: 115.00,
    oldPrice: 160.00,
    discount: 28,
    image: 'mouse',
    category: 'mouses',
    stock: 20,
    specs: {
      'Resolução': '12.000 DPI Customizáveis',
      'Sensor': 'PixArt StarScanner V4',
      'Botões': '7 programáveis por telepatia',
      'Peso': '75g (super leve, flutua em gravidade zero)'
    },
    funnyReview: {
      author: 'Blinky (4 Braços)',
      text: 'A ergonomia é maravilhosa! Serve perfeitamente nos meus dois tentáculos direitos. Os botões laterais facilitam muito o desvio de asteroides no Elite Dangerous.',
      rating: 5
    },
    tags: ['competitivo', 'fps', 'ergonômico', 'precisão', 'leve'],
    estiloVisual: ['Stealth Alienígena', 'Cyberpunk'],
    prioridade: ['Performance', 'Precisão'],
    perfilRecomendado: ['gamer-competitivo', 'entusiasta-tech'],
    popularidade: 82
  },
  {
    id: 'prod-antena-extraterrestre',
    name: 'Antena de Sintonização de Wi-Fi Interestelar',
    description: 'Amplifique seu sinal de Wi-Fi conectando-se diretamente aos satélites de monitoramento alienígena ocultos na órbita terrestre. Velocidade infinita!',
    price: 89.90,
    oldPrice: 120.00,
    discount: 25,
    image: 'antenna',
    category: 'perifericos',
    stock: 7,
    specs: {
      'Frequência': 'GHz Cósmicos Infinitos',
      'Alcance': 'Até a órbita da Lua',
      'Instalação': 'Basta apontar para o céu à meia-noite',
      'Compatibilidade': 'Roteadores terráqueos convencionais'
    },
    funnyReview: {
      author: 'Terráqueo Paranoico',
      text: 'Comprei e agora minha internet baixa 500GB por segundo. Só sinto uma leve coceira na nuca e ouço uns sussurros em código binário de vez em quando, mas vale super a pena!',
      rating: 4
    },
    tags: ['wifi', 'conectividade', 'essencial', 'escritório'],
    estiloVisual: ['Minimalista Lunar', 'Stealth Alienígena'],
    prioridade: ['Custo-benefício', 'Conectividade'],
    perfilRecomendado: ['trabalho-remoto', 'estudante', 'iniciante'],
    popularidade: 60
  },
  {
    id: 'prod-oculos-vr',
    name: 'Óculos VR Holográfico de Simulação da Terra',
    description: 'Cansado do espaço sideral? Coloque este headset de realidade virtual e simule tarefas cotidianas chatas como pagar boletos, pegar trânsito ou lavar louça.',
    price: 499.00,
    oldPrice: 650.00,
    discount: 23,
    image: 'vr-headset',
    category: 'games',
    stock: 3,
    specs: {
      'Lentes': 'Super AMOLED Micro-Holográficas',
      'Simulador': 'Experiência Burocrática de Classe 4',
      'Acessórios': 'Simulador de cheiro de chuva e café morno',
      'Resolução': 'Realidade Tangível de 360°'
    },
    funnyReview: {
      author: 'Xylar-7',
      text: 'Uau! A simulação de pegar fila na lotérica é extremamente realista! Fiquei com raiva em menos de 2 minutos. Excelente produto para experimentar o sofrimento terráqueo.',
      rating: 5
    },
    tags: ['vr', 'imersivo', 'premium', 'inovação', 'gaming'],
    estiloVisual: ['Cyberpunk', 'RGB Extremo'],
    prioridade: ['Imersão', 'Inovação'],
    perfilRecomendado: ['entusiasta-tech', 'criador-conteudo', 'gamer-casual'],
    popularidade: 70
  },
  {
    id: 'prod-gift-steam',
    name: 'Gift Card Steam R$ 50',
    description: 'Crédito digital de R$ 50 para adicionar na sua carteira Steam e comprar seus jogos terráqueos favoritos.',
    price: 50.00,
    image: 'steam',
    category: 'giftcard',
    stock: 99,
    specs: { 'Entrega': 'Instantânea via portal cósmico' },
    tags: ['digital', 'gaming', 'steam', 'presente'],
    estiloVisual: ['Minimalista Lunar'],
    prioridade: ['Custo-benefício'],
    perfilRecomendado: ['gamer-competitivo', 'gamer-casual'],
    popularidade: 65
  },
  {
    id: 'prod-gift-xbox',
    name: 'Gift Card Xbox R$ 100',
    description: 'Adicione R$ 100 de saldo na sua conta do Xbox Live/Game Pass para jogar clássicos do espaço.',
    price: 100.00,
    image: 'console',
    category: 'giftcard',
    stock: 99,
    specs: { 'Entrega': 'Instantânea via portal cósmico' },
    tags: ['digital', 'console', 'xbox', 'presente'],
    estiloVisual: ['Minimalista Lunar'],
    prioridade: ['Diversão'],
    perfilRecomendado: ['console-gamer', 'gamer-casual'],
    popularidade: 60
  },
  {
    id: 'prod-gift-spotify',
    name: 'Gift Card Spotify R$ 30',
    description: 'Adicione crédito no Spotify para escutar as melhores frequências de rádio e podcasts da galáxia.',
    price: 30.00,
    image: 'audio',
    category: 'giftcard',
    stock: 99,
    specs: { 'Entrega': 'Instantânea via portal cósmico' },
    tags: ['digital', 'música', 'streaming', 'presente'],
    estiloVisual: ['Minimalista Lunar'],
    prioridade: ['Custo-benefício'],
    perfilRecomendado: ['gamer-casual', 'criador-conteudo'],
    popularidade: 55
  },
  {
    id: 'prod-gift-netflix',
    name: 'Gift Card Netflix R$ 70',
    description: 'Créditos para assinar Netflix e maratonar séries interestelares sobre naves espaciais e planetas distantes.',
    price: 70.00,
    image: 'vr-headset',
    category: 'giftcard',
    stock: 99,
    specs: { 'Entrega': 'Instantânea via portal cósmico' },
    tags: ['digital', 'streaming', 'filme', 'presente'],
    estiloVisual: ['Minimalista Lunar'],
    prioridade: ['Diversão'],
    perfilRecomendado: ['gamer-casual'],
    popularidade: 50
  }
];

export const FUNNY_MASCOT_QUOTES = [
  "Abduzimos o intermediário para oferecer os menores preços da galáxia!",
  "Garantia de 300 anos-luz ou o seu dinheiro de volta em cristais de Urano.",
  "Atenção: Não lamber os headsets gamer. O LED verde é atrativo, mas radioativo.",
  "Nosso frete via Portal Quântico é tão rápido que o produto chega ontem.",
  "Seu pedido está sendo embalado com todo cuidado contra contaminação por radiação cósmica.",
  "Nosso suporte técnico é feito por alienígenas altamente qualificados e telepatas. Sabemos o que quebrou antes de você ligar.",
  "Se encontrar preços mais baixos em Marte, cobrimos a oferta na hora!"
];

export const ALIEN_SPECIES = [
  {
    id: 'custom',
    name: 'Enviar Sua Foto',
    description: 'Faça upload de um holograma de foto personalizada do seu próprio dispositivo.',
    avatar: '📸',
    bonus: 'Holograma customizado ativado!'
  },
  {
    id: 'gray',
    name: 'Gray (Mestre do Código)',
    description: 'Pele cinza, olhos gigantes e cérebro superdesenvolvido. Excelente em debugar códigos e abduzir gados nas horas vagas.',
    avatar: '👽',
    bonus: 'Ganha 10% de desconto fictício na loja!'
  },
  {
    id: 'reptilian',
    name: 'Reptiliano (Dono do E-commerce)',
    description: 'Dono secreto de metade das corporações da Terra. Tem sangue frio, pálpebras verticais e sabe exatamente o que você quer comprar.',
    avatar: '🦎',
    bonus: 'Frete grátis via portal espacial vitalício!'
  },
  {
    id: 'human_girl_rocket',
    name: 'Humano Comum (Fácil de Abduzir)',
    description: 'Menina terráquea a bordo de um foguete experimental. Muito fácil de ser atraída por feixes de luz tratora neon!',
    avatar: '👩‍🚀',
    bonus: 'Bônus: 100% de velocidade de escape gravitacional!'
  },
  {
    id: 'human_boy_rocket',
    name: 'Humano Comum (Fácil de Abduzir)',
    description: 'Menino terráqueo a bordo de um foguete experimental. Muito fácil de ser atraído por feixes de luz tratora neon!',
    avatar: '👨‍🚀',
    bonus: 'Bônus: 100% de velocidade de escape gravitacional!'
  }
];



export const INITIAL_BRANDS = [
  { id: 'b1', name: 'LG', imageUrl: 'https://logodownload.org/wp-content/uploads/2014/05/lg-logo-1.png' },
  { id: 'b2', name: 'Intel', imageUrl: 'https://logodownload.org/wp-content/uploads/2014/05/intel-logo-1.png' },
  { id: 'b3', name: 'Logitech', imageUrl: 'https://logodownload.org/wp-content/uploads/2018/03/logitech-logo-1.png' },
  { id: 'b4', name: 'Corsair', imageUrl: 'https://logodownload.org/wp-content/uploads/2018/01/corsair-logo-1.png' },
  { id: 'b5', name: 'HyperX', imageUrl: 'https://logodownload.org/wp-content/uploads/2019/08/hyperx-logo-1.png' },
  { id: 'b6', name: 'Razer', imageUrl: 'https://logodownload.org/wp-content/uploads/2014/05/razer-logo-1.png' },
  { id: 'b7', name: 'Lenovo', imageUrl: 'https://logodownload.org/wp-content/uploads/2014/09/lenovo-logo-1.png' },
  { id: 'b8', name: 'Samsung', imageUrl: 'https://logodownload.org/wp-content/uploads/2014/04/samsung-logo-1.png' }
];

export const INITIAL_STORE_SETTINGS = {
  row1Title: 'Ofertas do Dia',
  row1ProductIds: ['prod-headset-x9', 'prod-stick-retro', 'prod-orelha-gato', 'prod-mouse-radar'],
  row2Title: 'Novidades Interestelares',
  row2ProductIds: ['prod-teclado-glow', 'prod-antena-extraterrestre', 'prod-oculos-vr'],
  row3Title: 'Produtos em Alta por até R$100',
  row3ProductIds: ['prod-mouse-radar', 'prod-antena-extraterrestre'],
  gridImages: {
    image1: '/layout_mockup.png', // Fallback to existing layout mockup image
    image2: '/mascot_maintenance.png',
    image3: '/mascot_beach.png'
  }
};

export const INITIAL_TESTIMONIALS: import('./types').Testimonial[] = [
  {
    id: 'testim-1',
    authorName: 'Capitão Zorla',
    date: '2026-05-15',
    content: 'Comprei o fone de orelha de gato e a qualidade de som na galáxia de Andrômeda é perfeita.',
    rating: 5,
    productImage: 'https://placehold.co/100x100/171717/45e627?text=Fone'
  },
  {
    id: 'testim-2',
    authorName: 'Blinky',
    date: '2026-05-10',
    content: 'Meu teclado anterior quebrou após bater na dobra espacial. Esse novo aguenta tudo!',
    rating: 5
  }
];

export const INITIAL_GAMIFICATION_TASKS: import('./types').GamificationTask[] = [
  { id: 't1', title: 'Cadastro na plataforma', description: 'Crie sua conta para acessar o ecossistema.', rewardType: 'xp', rewardAmount: 200, isActive: true, limit: 'once' },
  { id: 't2', title: 'Primeira compra', description: 'Realize sua primeira aquisição de tecnologia.', rewardType: 'xp', rewardAmount: 500, isActive: true, limit: 'once' },
  { id: 't3', title: 'Login diário', description: 'Sintonize nossos canais todos os dias.', rewardType: 'coins', rewardAmount: 10, isActive: true, limit: 'daily' },
  { id: 't4', title: 'Avaliação de produto', description: 'Compartilhe sua sabedoria sobre os equipamentos.', rewardType: 'xp', rewardAmount: 100, isActive: true, limit: 'unlimited' },
  { id: 't5', title: 'Indicar amigo', description: 'Traga um terráqueo para a nossa frota.', rewardType: 'coins', rewardAmount: 500, isActive: true, limit: 'unlimited' },
  { id: 't6', title: 'Completar perfil', description: 'Atualize seus dados galácticos.', rewardType: 'xp', rewardAmount: 150, isActive: true, limit: 'once' },
  { id: 't7', title: 'Compartilhar produto', description: 'Espalhe a palavra alienígena.', rewardType: 'coins', rewardAmount: 50, isActive: true, limit: 'weekly' }
];

export const INITIAL_PAYMENT_SETTINGS: import('./types').PaymentSettings = {
  id: 'global',
  pixDiscountPercent: 5,
  maxInstallments: 12,
  installmentMinValue: 30,
  freeShippingThreshold: 299,
  paymentMethods: ['PIX ⚡', 'VISA 💳', 'MASTER 💳', 'BOLETO 📄', 'PAYPAL 🪐']
};

// ====================================================
// QUIZ "MONTE SEU SETUP" — CONFIGURAÇÃO PADRÃO
// ====================================================
export const INITIAL_QUIZ_CONFIG: QuizConfig = {
  profiles: [
    { id: 'gamer-competitivo', label: 'Gamer Competitivo', icon: '🎯', description: 'FPS, MOBA, e-sports. Preciso é pouco.' },
    { id: 'gamer-casual', label: 'Gamer Casual', icon: '🎮', description: 'Jogo por diversão, sem stress.' },
    { id: 'streamer', label: 'Streamer / Content', icon: '📺', description: 'Lives, vídeos e conteúdo são minha vida.' },
    { id: 'trabalho-remoto', label: 'Trabalho Remoto', icon: '💼', description: 'Home office produtivo e confortável.' },
    { id: 'estudante', label: 'Estudante Galáctico', icon: '📚', description: 'Preciso do essencial sem gastar muito.' },
    { id: 'criador-conteudo', label: 'Criador de Conteúdo', icon: '🎨', description: 'Design, edição de vídeo e áudio.' },
    { id: 'entusiasta-tech', label: 'Entusiasta de Tech', icon: '🔬', description: 'Quero o melhor da tecnologia.' },
    { id: 'console-gamer', label: 'Console Gamer', icon: '🕹️', description: 'Xbox, PlayStation, Switch é meu foco.' },
    { id: 'iniciante', label: 'Iniciante no Universo', icon: '🌱', description: 'Estou começando e preciso de orientação.' }
  ],

  budgetRanges: [
    { id: 'budget-low', label: 'Até R$ 150', min: 0, max: 150, icon: '💵' },
    { id: 'budget-medium', label: 'R$ 150 a R$ 350', min: 150, max: 350, icon: '💰' },
    { id: 'budget-high', label: 'R$ 350 a R$ 700', min: 350, max: 700, icon: '💎' },
    { id: 'budget-premium', label: 'R$ 700 a R$ 1.500', min: 700, max: 1500, icon: '🏆' },
    { id: 'budget-unlimited', label: 'Sem limites!', min: 0, max: null, icon: '🚀' }
  ],

  visualStyles: [
    { id: 'rgb-extremo', label: 'RGB Extremo', icon: '🌈', description: 'Luzes piscando em tudo!' },
    { id: 'cyberpunk', label: 'Cyberpunk', icon: '🤖', description: 'Dark mode com neon intenso.' },
    { id: 'minimalista-lunar', label: 'Minimalista Lunar', icon: '🌙', description: 'Clean, discreto e elegante.' },
    { id: 'retro-espacial', label: 'Retrô Espacial', icon: '👾', description: 'Nostalgia dos arcades.' },
    { id: 'stealth-alienigena', label: 'Stealth Alienígena', icon: '🛸', description: 'Furtivo, preto total.' },
    { id: 'kawaii-cosmico', label: 'Kawaii Cósmico', icon: '🌸', description: 'Fofura intergaláctica.' }
  ],

  priorities: [
    { id: 'performance', label: 'Performance', icon: '⚡', description: 'Velocidade e precisão acima de tudo.' },
    { id: 'custo-beneficio', label: 'Custo-Benefício', icon: '⚖️', description: 'Máximo resultado com menor investimento.' },
    { id: 'estetica', label: 'Estética', icon: '✨', description: 'Visual do setup é o que mais importa.' },
    { id: 'conforto', label: 'Conforto', icon: '🛋️', description: 'Ergonomia e conforto para longas sessões.' },
    { id: 'imersao', label: 'Imersão', icon: '🎧', description: 'Quero me sentir dentro do jogo.' },
    { id: 'durabilidade', label: 'Durabilidade', icon: '🛡️', description: 'Precisa durar uma era intergaláctica.' },
    { id: 'inovacao', label: 'Inovação', icon: '🔮', description: 'Tecnologia de ponta e tendências.' },
    { id: 'diversao', label: 'Diversão', icon: '🎉', description: 'O importante é se divertir!' }
  ],

  characters: [
    {
      id: 'kraag',
      name: 'KRAAG',
      avatar: '👽',
      personality: 'sarcastic',
      comments: {
        'gamer-competitivo': [
          'Hmm... um guerreiro digital. Eu já destruí galáxias inteiras com menos equipamento que esse.',
          'Boa escolha, terráqueo. Esse setup não vai te salvar de mim no ranked, mas é um começo.'
        ],
        'gamer-casual': [
          'Jogando por diversão? Na minha espécie isso é considerado crime. Mas aprovo.',
          'Setup perfeito pra quem quer relaxar enquanto o universo entra em colapso.'
        ],
        'streamer': [
          'Vai transmitir? Cuidado pra não revelar coordenadas do seu planeta acidentalmente.',
          'Esses equipamentos vão fazer você brilhar mais que uma supernova em live.'
        ],
        'budget-low': [
          'Econômico como um foguete movido a pedal. Mas eficiente!',
          'Nem toda nave precisa ser uma Star Destroyer. Às vezes um pod racer resolve.'
        ],
        'budget-premium': [
          'Agora sim! Equipamento digno de um comandante da frota.',
          'Com esse orçamento eu montava uma base inteira em Marte. Mas seu setup tá bom.'
        ],
        'budget-unlimited': [
          'SEM LIMITES?! *antenas tremendo* Isso é o que eu gosto de ouvir!',
          'Finalmente alguém que entende que tecnologia boa não tem preço. Só tem valor.'
        ],
        'geral': [
          'Setup analisado. Minhas antenas captaram boa energia nessa configuração.',
          'Se eu fosse invadir a Terra com esse setup, faria em grande estilo.',
          'Aprovado pelo conselho intergaláctico de tecnologia. (Mentira, eu sou o conselho.)'
        ]
      }
    },
    {
      id: 'z1p',
      name: 'Z1P',
      avatar: '🤖',
      personality: 'hyper',
      comments: {
        'gamer-competitivo': [
          'AAAA SETUP DE COMPETIÇÃO! *circuitos acelerando* VAI SER LENDÁRIO!',
          'Meus sensores indicam: 99.7% de chance de você dominar o servidor com isso!'
        ],
        'trabalho-remoto': [
          'PRODUTIVIDADE MÁXIMA! Esse setup vai fazer você trabalhar na velocidade da luz!',
          'Home office? Mais como HOME SPACESHIP OFFICE! Adorei!'
        ],
        'estudante': [
          'Estudar com estilo! Meus processadores aprovam esse investimento em conhecimento!',
          'INTELIGÊNCIA + TECNOLOGIA = COMBO PERFEITO! *beep boop*'
        ],
        'budget-low': [
          'Pouco dinheiro, MÁXIMA EFICIÊNCIA! Isso é ENGENHARIA PURA!',
          'Quem precisa de muito quando tem SABEDORIA na escolha?! GENIAL!'
        ],
        'budget-medium': [
          'EQUILÍBRIO PERFEITO! Como o balanceamento de um giroscópio quântico!',
          'Nem pouco nem muito — EXATAMENTE O NECESSÁRIO! *pisca LED feliz*'
        ],
        'geral': [
          'INCRÍVEL! Meus circuitos estão PIRANDO com esse setup!',
          'EU APROVARIA ESSE SETUP MIL VEZES! E olha que meu clock é de 999GHz!',
          '*beep boop* Setup SENSACIONAL detectado! Parabéns, humano!'
        ]
      }
    },
    {
      id: 'vega',
      name: 'VEGA',
      avatar: '🧬',
      personality: 'technical',
      comments: {
        'gamer-competitivo': [
          'Análise completa: taxa de resposta otimizada. DPI e refresh rate adequados ao perfil competitivo.',
          'Configuração sólida. Latência minimizada. Performance estimada: acima do percentil 85.'
        ],
        'criador-conteudo': [
          'Especificações compatíveis com workflows de edição. Color accuracy aceitável.',
          'Setup bem calibrado para produção de conteúdo. Recomendo monitor IPS adicional futuramente.'
        ],
        'entusiasta-tech': [
          'Componentes de última geração selecionados. Relação especificação/preço: otimizada.',
          'Setup com headroom para upgrades futuros. Arquitetura escalável aprovada.'
        ],
        'budget-high': [
          'Faixa de investimento ideal para relação performance/custo. Escolha racional.',
          'Orçamento bem alocado. Distribuição entre categorias: equilibrada.'
        ],
        'budget-premium': [
          'Investimento premium justificado pela qualidade dos componentes selecionados.',
          'Análise de ROI: equipamentos premium possuem vida útil 2.3x superior. Lógico.'
        ],
        'geral': [
          'Análise concluída. Compatibilidade entre componentes: 100%. Setup aprovado.',
          'Dados processados. Recomendações calibradas com base em 47 variáveis. Resultado: ótimo.',
          'Setup coerente com o perfil identificado. Probabilidade de satisfação: 94.2%.'
        ]
      }
    }
  ],

  setupNames: {
    'gamer-competitivo': 'Setup Guerreiro Digital',
    'gamer-casual': 'Setup Relax Intergaláctico',
    'streamer': 'Setup Broadcast Estelar',
    'trabalho-remoto': 'Setup Produtividade Orbital',
    'estudante': 'Setup Explorador Iniciante',
    'criador-conteudo': 'Setup Criativo Nebulosa',
    'entusiasta-tech': 'Setup Vanguarda Tecnológica',
    'console-gamer': 'Setup Console Command',
    'iniciante': 'Setup Primeiro Contato'
  }
};
