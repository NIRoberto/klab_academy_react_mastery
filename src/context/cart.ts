import { createContext } from 'react';
import type { Product } from '../data/products';

export interface CartItem extends Product {
  quantity: number;
}

export export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: number }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; quantity: number } }
  | { type: 'CLEAR_CART' };

export interface CartContextType extends CartState {
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);