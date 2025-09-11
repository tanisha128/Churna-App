import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const initialState = {
  cartItems: [],
  cartCount: 0,
  message: '',
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const updatedCart = [...state.cartItems, action.payload];
      return {
        ...state,
        cartItems: updatedCart,
        cartCount: updatedCart.length,
        message: 'Item added to cart successfully!',
      };
    }
    case 'REMOVE_FROM_CART': {
      const updatedCart = state.cartItems.filter(item => item.id !== action.payload && item._id !== action.payload);
      return {
        ...state,
        cartItems: updatedCart,
        cartCount: updatedCart.length,
        message: '',
      };
    }
    case 'CLEAR_CART': {
      return {
        ...state,
        cartItems: [],
        cartCount: 0,
        message: '',
      };
    }
    case 'CLEAR_MESSAGE': {
      return {
        ...state,
        message: '',
      };
    }
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const clearMessage = () => {
    dispatch({ type: 'CLEAR_MESSAGE' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addToCart,
        removeFromCart,
        clearCart,       // ✅ now available in Order.jsx
        clearMessage,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
