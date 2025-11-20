import React, { createContext, useState, useContext, useEffect } from 'react';

const CreateBoxContext = createContext();

export const useCreateBox = () => {
  const context = useContext(CreateBoxContext);
  if (!context) {
    throw new Error('useCreateBox must be used within CreateBoxProvider');
  }
  return context;
};

export const CreateBoxProvider = ({ children }) => {
  const [boxItems, setBoxItems] = useState(() => {
    const saved = localStorage.getItem('createBoxItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('createBoxItems', JSON.stringify(boxItems));
  }, [boxItems]);

  const addFlower = (flower) => {
    setBoxItems(prev => {
      const existing = prev.find(item => item._id === flower._id);
      if (existing) {
        return prev.map(item =>
          item._id === flower._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...flower, quantity: 1 }];
    });
  };

  const removeFlower = (flowerId) => {
    setBoxItems(prev => {
      const existing = prev.find(item => item._id === flowerId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item._id === flowerId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item._id !== flowerId);
    });
  };

  const updateQuantity = (flowerId, quantity) => {
    if (quantity <= 0) {
      removeFlower(flowerId);
      return;
    }
    setBoxItems(prev =>
      prev.map(item =>
        item._id === flowerId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearBox = () => {
    setBoxItems([]);
    localStorage.removeItem('createBoxItems');
  };

  const getTotal = () => {
    return boxItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return boxItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CreateBoxContext.Provider
      value={{
        boxItems,
        addFlower,
        removeFlower,
        updateQuantity,
        clearBox,
        getTotal,
        getItemCount
      }}
    >
      {children}
    </CreateBoxContext.Provider>
  );
};
