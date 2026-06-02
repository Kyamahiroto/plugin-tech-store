import { Product, QuizAnswers, QuizConfig, QuizCharacter, ScoredProduct, SetupResult } from '../types';

// ====================================================
// QUIZ ENGINE — Motor de Recomendação de Setup
// ====================================================

/**
 * Calcula o score de match de um produto com as respostas do quiz.
 * Score máximo teórico: 115 pontos
 */
export function calculateProductScore(
  product: Product,
  answers: QuizAnswers,
  config: QuizConfig
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Match de perfil recomendado (+30 pts)
  if (product.perfilRecomendado && product.perfilRecomendado.length > 0) {
    const profileMatch = product.perfilRecomendado.some(
      p => p.toLowerCase() === answers.profile.toLowerCase()
    );
    if (profileMatch) {
      score += 30;
      reasons.push('Recomendado para seu perfil');
    }
  }

  // 2. Match de categoria selecionada (+25 pts)
  if (answers.categories.length > 0) {
    const categoryMatch = answers.categories.some(
      cat => cat.toLowerCase() === product.category.toLowerCase()
    );
    if (categoryMatch) {
      score += 25;
      reasons.push('Categoria selecionada');
    }
  }

  // 3. Produto dentro da faixa de orçamento (+20 pts)
  const budgetRange = config.budgetRanges.find(b => b.id === answers.budgetRange);
  if (budgetRange) {
    const inBudget =
      product.price >= budgetRange.min &&
      (budgetRange.max === null || product.price <= budgetRange.max);
    if (inBudget) {
      score += 20;
      reasons.push('Dentro do orçamento');
    } else {
      // Partial credit if close to budget
      const maxPrice = budgetRange.max ?? budgetRange.min * 3;
      const distance = product.price > maxPrice
        ? (product.price - maxPrice) / maxPrice
        : (budgetRange.min - product.price) / budgetRange.min;
      if (distance < 0.3) {
        score += 8;
        reasons.push('Próximo do orçamento');
      }
    }
  }

  // 4. Match de estilo visual (+15 pts)
  if (product.estiloVisual && product.estiloVisual.length > 0) {
    const styleMatch = product.estiloVisual.some(
      s => s.toLowerCase() === answers.visualStyle.toLowerCase()
    );
    if (styleMatch) {
      score += 15;
      reasons.push('Combina com seu estilo');
    }
  }

  // 5. Match de prioridade (+10 pts)
  if (product.prioridade && product.prioridade.length > 0) {
    const priorityMatch = product.prioridade.some(
      p => p.toLowerCase() === answers.priority.toLowerCase()
    );
    if (priorityMatch) {
      score += 10;
      reasons.push('Alinhado com sua prioridade');
    }
  }

  // 6. Bônus de popularidade (até +5 pts)
  if (product.popularidade && product.popularidade > 0) {
    score += Math.round((product.popularidade / 100) * 5);
  }

  // 7. Bônus de estoque (+5 pts se em estoque, -50 se sem)
  if (product.stock > 0) {
    score += 5;
  } else {
    score -= 50;
  }

  // 8. Bônus de desconto (+3 pts se tem desconto)
  if (product.discount && product.discount > 0) {
    score += 3;
    reasons.push(`${product.discount}% OFF`);
  }

  // 9. Bônus de tags compartilhadas (+2 pts por tag relevante)
  if (product.tags && product.tags.length > 0) {
    const relevantTags = getRelevantTagsForProfile(answers.profile);
    const matchingTags = product.tags.filter(t =>
      relevantTags.some(rt => t.toLowerCase().includes(rt.toLowerCase()))
    );
    score += Math.min(matchingTags.length * 2, 6);
  }

  return { score: Math.max(0, score), reasons };
}

/**
 * Returns relevant tags for a given profile type
 */
function getRelevantTagsForProfile(profile: string): string[] {
  const profileTagMap: Record<string, string[]> = {
    'gamer-competitivo': ['competitivo', 'fps', 'esports', 'performance', 'precisão', 'low-latency'],
    'gamer-casual': ['casual', 'conforto', 'versatil', 'multimedia'],
    'streamer': ['streaming', 'microfone', 'rgb', 'câmera', 'qualidade'],
    'trabalho-remoto': ['escritório', 'ergonomico', 'produtividade', 'silencioso', 'conforto'],
    'estudante': ['custo-beneficio', 'portátil', 'essencial', 'basico'],
    'criador-conteudo': ['criação', 'design', 'audio', 'edição', 'qualidade'],
    'entusiasta-tech': ['premium', 'inovação', 'modding', 'custom', 'avançado'],
    'console-gamer': ['console', 'wireless', 'compatível', 'controle'],
    'iniciante': ['basico', 'fácil', 'custo-beneficio', 'iniciante', 'essencial']
  };
  return profileTagMap[profile] || [];
}

/**
 * Filtra, pontua e ordena produtos por relevância.
 */
export function getRecommendations(
  products: Product[],
  answers: QuizAnswers,
  config: QuizConfig
): ScoredProduct[] {
  const scored: ScoredProduct[] = products
    .filter(p => p.stock > 0) // Exclude out-of-stock
    .map(product => {
      const { score, reasons } = calculateProductScore(product, answers, config);
      return { product, score, matchReasons: reasons };
    })
    .sort((a, b) => b.score - a.score);

  return scored;
}

/**
 * Seleciona um comentário contextual do personagem
 */
export function getCharacterComment(
  characters: QuizCharacter[],
  profile: string,
  budgetId: string
): { character: QuizCharacter; text: string } {
  // Pick a random character
  const character = characters[Math.floor(Math.random() * characters.length)];

  // Try to find contextual comment
  const profileComments = character.comments[profile] || [];
  const budgetComments = character.comments[budgetId] || [];
  const generalComments = character.comments['geral'] || [];

  const allComments = [...profileComments, ...budgetComments, ...generalComments];

  if (allComments.length === 0) {
    return {
      character,
      text: 'Setup analisado com sucesso! Minhas antenas aprovam essa configuração. 🛸'
    };
  }

  const text = allComments[Math.floor(Math.random() * allComments.length)];
  return { character, text };
}

/**
 * Gera o nome temático do setup baseado no perfil e orçamento
 */
export function getSetupName(
  profile: string,
  budgetId: string,
  config: QuizConfig
): { name: string; subtitle: string; classification: string } {
  const profileName = config.setupNames[profile] || 'Setup Personalizado';

  const classificationMap: Record<string, string> = {
    'budget-low': 'Classe Lunar',
    'budget-medium': 'Classe Marte',
    'budget-high': 'Classe Júpiter',
    'budget-premium': 'Classe Nebulosa',
    'budget-unlimited': 'Classe Buraco Negro'
  };

  const subtitleMap: Record<string, string> = {
    'budget-low': 'Eficiente e poderoso como um satélite de reconhecimento.',
    'budget-medium': 'Equilíbrio perfeito entre custo e performance estelar.',
    'budget-high': 'Alto desempenho para missões de nível intergaláctico.',
    'budget-premium': 'Tecnologia de ponta direto do núcleo da nave-mãe.',
    'budget-unlimited': 'Sem limites. O universo é pequeno pra esse setup.'
  };

  return {
    name: profileName,
    subtitle: subtitleMap[budgetId] || 'Um setup customizado para sua missão.',
    classification: classificationMap[budgetId] || 'Classe Estelar'
  };
}

/**
 * Gera o resultado completo do quiz
 */
export function generateSetupResult(
  answers: QuizAnswers,
  products: Product[],
  config: QuizConfig
): SetupResult {
  const recommendations = getRecommendations(products, answers, config);

  const { name, subtitle, classification } = getSetupName(
    answers.profile,
    answers.budgetRange,
    config
  );

  const budgetRange = config.budgetRanges.find(b => b.id === answers.budgetRange);
  const visualStyle = config.visualStyles.find(v => v.id === answers.visualStyle);
  const priority = config.priorities.find(p => p.id === answers.priority);

  const { character, text } = getCharacterComment(
    config.characters,
    answers.profile,
    answers.budgetRange
  );

  return {
    name,
    subtitle,
    classification,
    profile: answers.profile,
    budgetLabel: budgetRange?.label || '',
    visualStyle: visualStyle?.label || '',
    priority: priority?.label || '',
    products: recommendations,
    characterComment: { character, text }
  };
}
