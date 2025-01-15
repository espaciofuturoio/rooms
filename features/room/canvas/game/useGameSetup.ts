import { useMemo } from 'react';
import { CoffeeShopLogic } from './CoffeeShopLogic';
import { Player } from './Player';

export const TILE_SIZE = 32;
export const SHOP_WIDTH_UNITS = 20;
export const SHOP_HEIGHT_UNITS = 15;

export const SHOP_WIDTH = SHOP_WIDTH_UNITS * TILE_SIZE;
export const SHOP_HEIGHT = SHOP_HEIGHT_UNITS * TILE_SIZE;

const initialCharacters = [
  new Player({ x: 5, y: 5, color: '#0000FF', role: 'Barista', id: '1' }),
  new Player({ x: 15, y: 5, color: '#FF0000', role: 'Cashier', id: '2' }),
  new Player({ x: 10, y: 10, color: '#00FF00', role: 'Waiter', id: '3' })
];

export const useGameSetup = () => {
  const coffeeShopLogic = useMemo(() => new CoffeeShopLogic(SHOP_WIDTH_UNITS, SHOP_HEIGHT_UNITS), []);
  return { coffeeShopLogic, initialCharacters, TILE_SIZE };
}; 