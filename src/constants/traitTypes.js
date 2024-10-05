export const TRAIT_TYPES = {
  MACHIAVELLIANISM: 'MACHIAVELLIANISM',
  NARCISSISM: 'NARCISSISM',
  PSYCHOPATHY: 'PSYCHOPATHY',
  SADISM: 'SADISM'
};

export const TRAIT_DESCRIPTIONS = {
  MACHIAVELLIANISM: 'Tendency to manipulate and exploit others for personal gain',
  NARCISSISM: 'Excessive self-love, grandiosity, and need for admiration',
  PSYCHOPATHY: 'Lack of empathy, impulsivity, and antisocial behavior',
  SADISM: 'Deriving pleasure from inflicting pain or humiliation on others'
};

export const TRAIT_COLORS = {
  MACHIAVELLIANISM: '#4a90e2',
  NARCISSISM: '#e74c3c',
  PSYCHOPATHY: '#2ecc71',
  SADISM: '#9b59b6'
};

export const TRAIT_ICONS = {
  MACHIAVELLIANISM: '🎭',
  NARCISSISM: '🪞',
  PSYCHOPATHY: '🧊',
  SADISM: '😈'
};

export const getTraitName = (traitType) => {
  return TRAIT_TYPES[traitType].charAt(0) + TRAIT_TYPES[traitType].slice(1).toLowerCase();
};

export const getTraitDescription = (traitType) => {
  return TRAIT_DESCRIPTIONS[traitType];
};

export const getTraitColor = (traitType) => {
  return TRAIT_COLORS[traitType];
};

export const getTraitIcon = (traitType) => {
  return TRAIT_ICONS[traitType];
};