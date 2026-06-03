export interface RankLevel {
  id: string;
  name: string;
  xpRequired: number;
  icon: string;
  color: string;
}

export const RANKS: RankLevel[] = [
  { id: 'rank-0', name: 'Humano', xpRequired: 0, icon: '🧑', color: '#a3a3a3' },
  { id: 'rank-1', name: 'Explorador', xpRequired: 1000, icon: '🔭', color: '#38bdf8' },
  { id: 'rank-2', name: 'Piloto', xpRequired: 3000, icon: '🚀', color: '#fb923c' },
  { id: 'rank-3', name: 'Caçador Estelar', xpRequired: 7000, icon: '🎯', color: '#f472b6' },
  { id: 'rank-4', name: 'Comandante', xpRequired: 15000, icon: '⭐', color: '#45e627' },
  { id: 'rank-5', name: 'General Cósmico', xpRequired: 30000, icon: '⚔️', color: '#eab308' },
  { id: 'rank-6', name: 'Imperador Galáctico', xpRequired: 60000, icon: '👑', color: '#c084fc' }
];

export const getAliencoinPurchaseBonus = (xp: number = 0): number => {
  const rank = getRankByXP(xp);
  switch (rank.id) {
    case 'rank-1': return 0.02; // +2%
    case 'rank-2': return 0.03; // +3%
    case 'rank-3': return 0.04; // +4%
    case 'rank-4': return 0.05; // +5%
    case 'rank-5': return 0.06; // Assumido progressão
    case 'rank-6': return 0.08; // Assumido progressão
    default: return 0;
  }
};

export const getRankByXP = (xp: number = 0): RankLevel => {
  let currentRank = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.xpRequired) {
      currentRank = rank;
    } else {
      break;
    }
  }
  return currentRank;
};

export const getNextRank = (xp: number = 0): RankLevel | null => {
  for (const rank of RANKS) {
    if (xp < rank.xpRequired) {
      return rank;
    }
  }
  return null; // Max rank reached
};

export const convertAliencoinsToBRL = (coins: number = 0): number => {
  // 100 Aliencoins = R$1.00
  return coins / 100;
};

export const calculateMaxAliencoinDiscount = (totalOrderValue: number, userCoins: number = 0): number => {
  const maxDiscountValue = totalOrderValue * 0.15; // 15% max
  const maxCoinsAllowed = maxDiscountValue * 100;
  return Math.min(userCoins, maxCoinsAllowed);
};
