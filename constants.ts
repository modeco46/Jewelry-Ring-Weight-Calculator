import { Metal } from './types';

export const METALS: Metal[] = [
  {
    id: 'red_gold',
    name: 'Красное Золото (585)',
    density: 13.3,
    color: '#E5B89B',
    textColor: 'text-rose-900',
    bgColor: 'bg-rose-50'
  },
  {
    id: 'white_gold',
    name: 'Белое Золото (585)',
    density: 12.85,
    color: '#E2E8F0',
    textColor: 'text-slate-800',
    bgColor: 'bg-slate-100'
  },
  {
    id: 'silver',
    name: 'Серебро (925)',
    density: 10.36,
    color: '#94A3B8',
    textColor: 'text-gray-800',
    bgColor: 'bg-gray-50'
  }
];

export const DEFAULT_DIMENSIONS = {
  diameter: 17.0,
  thickness: 1.5,
  width: 4.0
};

export const LIMITS = {
  diameter: { min: 14.0, max: 25.0, step: 0.1 },
  thickness: { min: 0.5, max: 5.0, step: 0.1 },
  width: { min: 1.0, max: 15.0, step: 0.1 }
};