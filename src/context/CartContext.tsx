import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { Product, CartItem } from '../types';

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: { items: CartItem[] } };

const CartContext = createContext<CartContextType | undefined>(undefined);

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

const calculateCartTotals = (items: CartItem[]): { totalItems: number; totalPrice: number } => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existingItemIndex = state.items.findIndex((item) => item.id === product.id);

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        updatedItems = [...state.items, { ...product, quantity }];
      }

      const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter((item) => item.id !== action.payload.productId);
      const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }

      const updatedItems = state.items.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity };
        }
        return item;
      });

      const { totalItems, totalPrice } = calculateCartTotals(updatedItems);
      return {
        ...state,
        items: updatedItems,
        totalItems,
        totalPrice,
      };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'SET_CART': {
      const { items } = action.payload;
      const { totalItems, totalPrice } = calculateCartTotals(items);
      return {
        items,
        totalItems,
        totalPrice,
      };
    }

    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        dispatch({ type: 'SET_CART', payload: { items: parsedCart } });
      } catch (error) {
        console.error('Failed to parse saved cart', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};