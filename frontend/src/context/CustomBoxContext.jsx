import { createContext, useContext, useState, useEffect } from 'react';

const CustomBoxContext = createContext();

export const useCustomBox = () => {
  const context = useContext(CustomBoxContext);
  if (!context) {
    throw new Error('useCustomBox must be used within a CustomBoxProvider');
  }
  return context;
};

export const CustomBoxProvider = ({ children }) => {
  const [boxItems, setBoxItems] = useState(() => {
    const savedBox = localStorage.getItem('customFlowerBox');
    return savedBox ? JSON.parse(savedBox) : [];
  });

  useEffect(() => {
    localStorage.setItem('customFlowerBox', JSON.stringify(boxItems));
  }, [boxItems]);

  const addFlower = (flower, quantity = 1) => {
    setBoxItems(prevItems => {
      const existingItem = prevItems.find(item => item.product._id === flower._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.product._id === flower._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prevItems, { product: flower, quantity }];
    });
  };

  const removeFlower = (flowerId) => {
    setBoxItems(prevItems => prevItems.filter(item => item.product._id !== flowerId));
  };

  const updateQuantity = (flowerId, quantity) => {
    if (quantity <= 0) {
      removeFlower(flowerId);
      return;
    }
    
    setBoxItems(prevItems =>
      prevItems.map(item =>
        item.product._id === flowerId ? { ...item, quantity } : item
      )
    );
  };

  const clearBox = () => {
    setBoxItems([]);
    localStorage.removeItem('customFlowerBox');
  };

  const getBoxTotal = () => {
    return boxItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getBoxCount = () => {
    return boxItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    boxItems,
    addFlower,
    removeFlower,
    updateQuantity,
    clearBox,
    getBoxTotal,
    getBoxCount
  };

  return (
    <CustomBoxContext.Provider value={value}>
      {children}
    </CustomBoxContext.Provider>
  );
};
