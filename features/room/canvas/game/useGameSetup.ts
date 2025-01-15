import { useMemo } from 'react';
import { CoffeeShopLogic } from './CoffeeShopLogic';
import { Player } from './Player';

import { isMobile, isMobileBrowser } from '../utils';

export const TILE_SIZE = isMobile || isMobileBrowser ? 16 : 32;

const initialCharacters = [
  new Player({ x: 5, y: 5, color: '#0000FF', role: 'Barista', id: '1' }),
  new Player({ x: 15, y: 5, color: '#FF0000', role: 'Cashier', id: '2' }),
  new Player({ x: 10, y: 10, color: '#00FF00', role: 'Waiter', id: '3' })
];

export const useGameSetup = () => {
  const coffeeShopLogic = useMemo(() => new CoffeeShopLogic(20, 15), []);
  return { coffeeShopLogic, initialCharacters, TILE_SIZE };
}; 
