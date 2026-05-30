export const SECTION_STEPS = ['matters', 'medication', 'mind', 'mobility', 'review'];

export const SECTION_META = {
  matters: {
    key: 'matters',
    shortLabel: 'Matters',
    label: 'What Matters',
    color: '#003366',
    bg: '#eef5fb',
    border: '#8fb3d1',
    description: 'Keep track of what is important to you, including goals, concerns, and daily needs.'
  },
  medication: {
    key: 'medication',
    shortLabel: 'Medication',
    label: 'Medication',
    color: '#005522',
    bg: '#edf8f0',
    border: '#8bb99b',
    description: 'Record prescriptions, over-the-counter medicines, questions, side effects, and missed doses.'
  },
  mind: {
    key: 'mind',
    shortLabel: 'Mentation',
    label: 'Mentation',
    color: '#4B0082',
    bg: '#f5effa',
    border: '#b89acd',
    description: 'Monitor changes in sleep, memory, mood, stress, and the support that helps you.'
  },
  mobility: {
    key: 'mobility',
    shortLabel: 'Mobility',
    label: 'Mobility',
    color: '#8B4000',
    bg: '#fff3e6',
    border: '#d19a65',
    description: 'Track movement, balance, exercise, falls, and mobility supports.'
  },
  review: {
    key: 'review',
    shortLabel: 'Review',
    label: 'Review',
    color: '#005A5A',
    bg: '#eef9f9',
    border: '#8bbebe',
    description: 'Review, edit, save, and share your health assessment report.'
  }
};

export const getSectionMeta = (key) => SECTION_META[key] || SECTION_META.matters;

export const questionnaireSectionKeys = SECTION_STEPS.filter((key) => key !== 'review');
