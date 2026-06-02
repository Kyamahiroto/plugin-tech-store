import React, { useState } from 'react';
import { Product, Category, QuizConfig, QuizAnswers, SetupResult } from '../types';
import { generateSetupResult } from '../utils/quizEngine';
import { ChevronLeft, ChevronRight, Rocket, X, Check } from 'lucide-react';

interface SetupQuizViewProps {
  products: Product[];
  categories: Category[];
  quizConfig: QuizConfig;
  onComplete: (result: SetupResult) => void;
  onClose: () => void;
}

const STEPS = [
  { title: 'Qual é a sua missão?', subtitle: 'Selecione o perfil que mais combina com você.', type: 'single' as const },
  { title: 'O que sua nave precisa?', subtitle: 'Escolha as categorias que te interessam.', type: 'multi' as const },
  { title: 'Qual o orçamento da expedição?', subtitle: 'Por item. Cada peça do seu setup.', type: 'single' as const },
  { title: 'Qual a estética da nave?', subtitle: 'O visual importa. Escolha seu estilo.', type: 'single' as const },
  { title: 'O que é mais importante?', subtitle: 'Uma prioridade define sua missão.', type: 'single' as const }
];

const SetupQuizView: React.FC<SetupQuizViewProps> = ({
  products,
  categories,
  quizConfig,
  onComplete,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    profile: '',
    categories: [],
    budgetRange: '',
    visualStyle: '',
    priority: ''
  });
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [isGenerating, setIsGenerating] = useState(false);

  // Particle effect
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5
    }))
  );

  const canProceed = () => {
    switch (currentStep) {
      case 0: return answers.profile !== '';
      case 1: return answers.categories.length > 0;
      case 2: return answers.budgetRange !== '';
      case 3: return answers.visualStyle !== '';
      case 4: return answers.priority !== '';
      default: return false;
    }
  };

  const goNext = () => {
    if (!canProceed()) return;
    if (currentStep === STEPS.length - 1) {
      handleFinish();
      return;
    }
    setDirection('next');
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setAnimating(false);
    }, 300);
  };

  const goPrev = () => {
    if (currentStep === 0) return;
    setDirection('prev');
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setAnimating(false);
    }, 300);
  };

  const handleFinish = () => {
    setIsGenerating(true);
    // Simulate processing with a short delay for dramatic effect
    setTimeout(() => {
      const result = generateSetupResult(answers, products, quizConfig);
      onComplete(result);
    }, 1800);
  };

  const selectSingle = (field: keyof QuizAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (slug: string) => {
    setAnswers(prev => ({
      ...prev,
      categories: prev.categories.includes(slug)
        ? prev.categories.filter(c => c !== slug)
        : [...prev.categories, slug]
    }));
  };

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  // Loading / generating screen
  if (isGenerating) {
    return (
      <div className="quiz-container">
        <div className="quiz-particles">
          {particles.map(p => (
            <div key={p.id} className="quiz-particle" style={{
              left: `${p.x}%`, top: `${p.y}%`,
              width: `${p.size}px`, height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`
            }} />
          ))}
        </div>
        <div className="quiz-generating">
          <div className="quiz-generating-icon">🛸</div>
          <h2 className="quiz-generating-title">Analisando frequências cósmicas...</h2>
          <p className="quiz-generating-sub">Calibrando recomendações para seu perfil.</p>
          <div className="quiz-generating-bar">
            <div className="quiz-generating-bar-fill" />
          </div>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    const stepClass = `quiz-step-content ${animating ? (direction === 'next' ? 'slide-out-left' : 'slide-out-right') : 'slide-in'}`;

    switch (currentStep) {
      case 0: // Profile selection
        return (
          <div className={stepClass}>
            <div className="quiz-options-grid">
              {quizConfig.profiles.map(profile => (
                <button
                  key={profile.id}
                  className={`quiz-option-card ${answers.profile === profile.id ? 'selected' : ''}`}
                  onClick={() => selectSingle('profile', profile.id)}
                >
                  <span className="quiz-option-icon">{profile.icon}</span>
                  <span className="quiz-option-label">{profile.label}</span>
                  <span className="quiz-option-desc">{profile.description}</span>
                  {answers.profile === profile.id && (
                    <div className="quiz-option-check"><Check size={16} /></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 1: // Category selection (multi)
        return (
          <div className={stepClass}>
            <div className="quiz-options-grid quiz-options-categories">
              {categories.map(cat => (
                <button
                  key={cat.slug}
                  className={`quiz-option-card ${answers.categories.includes(cat.slug) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(cat.slug)}
                >
                  <span className="quiz-option-icon">{
                    cat.iconName === 'Headphones' ? '🎧' :
                    cat.iconName === 'Mouse' ? '🖱️' :
                    cat.iconName === 'Keyboard' ? '⌨️' :
                    cat.iconName === 'Gamepad' ? '🎮' :
                    cat.iconName === 'Cpu' ? '🖥️' :
                    cat.iconName === 'Gift' ? '🎁' : '📦'
                  }</span>
                  <span className="quiz-option-label">{cat.name}</span>
                  {answers.categories.includes(cat.slug) && (
                    <div className="quiz-option-check"><Check size={16} /></div>
                  )}
                </button>
              ))}
            </div>
            <p className="quiz-multi-hint">Selecione uma ou mais categorias</p>
          </div>
        );

      case 2: // Budget
        return (
          <div className={stepClass}>
            <div className="quiz-options-grid quiz-options-budget">
              {quizConfig.budgetRanges.map(budget => (
                <button
                  key={budget.id}
                  className={`quiz-option-card ${answers.budgetRange === budget.id ? 'selected' : ''}`}
                  onClick={() => selectSingle('budgetRange', budget.id)}
                >
                  <span className="quiz-option-icon">{budget.icon}</span>
                  <span className="quiz-option-label">{budget.label}</span>
                  {answers.budgetRange === budget.id && (
                    <div className="quiz-option-check"><Check size={16} /></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 3: // Visual style
        return (
          <div className={stepClass}>
            <div className="quiz-options-grid">
              {quizConfig.visualStyles.map(style => (
                <button
                  key={style.id}
                  className={`quiz-option-card ${answers.visualStyle === style.id ? 'selected' : ''}`}
                  onClick={() => selectSingle('visualStyle', style.id)}
                >
                  <span className="quiz-option-icon">{style.icon}</span>
                  <span className="quiz-option-label">{style.label}</span>
                  <span className="quiz-option-desc">{style.description}</span>
                  {answers.visualStyle === style.id && (
                    <div className="quiz-option-check"><Check size={16} /></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 4: // Priority
        return (
          <div className={stepClass}>
            <div className="quiz-options-grid">
              {quizConfig.priorities.map(priority => (
                <button
                  key={priority.id}
                  className={`quiz-option-card ${answers.priority === priority.id ? 'selected' : ''}`}
                  onClick={() => selectSingle('priority', priority.id)}
                >
                  <span className="quiz-option-icon">{priority.icon}</span>
                  <span className="quiz-option-label">{priority.label}</span>
                  <span className="quiz-option-desc">{priority.description}</span>
                  {answers.priority === priority.id && (
                    <div className="quiz-option-check"><Check size={16} /></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="quiz-container">
      {/* Floating particles */}
      <div className="quiz-particles">
        {particles.map(p => (
          <div key={p.id} className="quiz-particle" style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: `${p.size}px`, height: `${p.size}px`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`
          }} />
        ))}
      </div>

      {/* Top bar */}
      <div className="quiz-topbar">
        <div className="quiz-topbar-left">
          <Rocket size={20} className="quiz-topbar-icon" />
          <span className="quiz-topbar-title">Monte seu Setup</span>
        </div>
        <button className="quiz-close-btn" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="quiz-progress-wrapper">
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="quiz-progress-steps">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`quiz-progress-dot ${i <= currentStep ? 'active' : ''} ${i === currentStep ? 'current' : ''}`}
            />
          ))}
        </div>
        <span className="quiz-progress-label">Etapa {currentStep + 1} de {STEPS.length}</span>
      </div>

      {/* Step header */}
      <div className="quiz-step-header">
        <h2 className="quiz-step-title">{STEPS[currentStep].title}</h2>
        <p className="quiz-step-subtitle">{STEPS[currentStep].subtitle}</p>
      </div>

      {/* Step content */}
      {renderStepContent()}

      {/* Navigation */}
      <div className="quiz-nav-buttons">
        <button
          className="quiz-nav-btn quiz-nav-prev"
          onClick={goPrev}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={18} />
          Voltar
        </button>

        <button
          className={`quiz-nav-btn quiz-nav-next ${!canProceed() ? 'disabled' : ''}`}
          onClick={goNext}
          disabled={!canProceed()}
        >
          {currentStep === STEPS.length - 1 ? (
            <>
              <Rocket size={18} />
              Gerar Meu Setup
            </>
          ) : (
            <>
              Continuar
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SetupQuizView;
