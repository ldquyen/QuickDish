'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ItemDetail } from '@/types/ItemDetail';
import { Menu } from '@/types/Menu';

interface PreOrderContextType {
  preOrderItems: ItemDetail[];
  addToPreOrder: (menu: Menu, quantity?: number) => void;
  removeFromPreOrder: (menuId: string) => void;
  updateQuantity: (menuId: string, quantity: number) => void;
  clearPreOrder: () => void;
  getTotalAmount: () => number;
}

const PreOrderContext = createContext<PreOrderContextType | undefined>(undefined);

export const usePreOrder = () => {
  const context = useContext(PreOrderContext);
  if (!context) {
    throw new Error('usePreOrder must be used within a PreOrderProvider');
  }
  return context;
};

interface PreOrderProviderProps {
  children: ReactNode;
}

export const PreOrderProvider: React.FC<PreOrderProviderProps> = ({ children }) => {
  const [preOrderItems, setPreOrderItems] = useState<ItemDetail[]>([]);

  const addToPreOrder = (menu: Menu, quantity: number = 1) => {
    setPreOrderItems(prev => {
      const existingItem = prev.find(item => item.MenuID === menu.MenuID);
      
      if (existingItem) {
        // Nếu món đã có trong giỏ, tăng số lượng
        return prev.map(item =>
          item.MenuID === menu.MenuID
            ? {
                ...item,
                Quantity: item.Quantity + quantity,
                TotalPrice: (item.Quantity + quantity) * item.Price
              }
            : item
        );
      } else {
        // Nếu món chưa có, thêm mới
        const newItem: ItemDetail = {
          MenuID: menu.MenuID,
          Name: menu.Name,
          Quantity: quantity,
          Price: menu.Price,
          TotalPrice: quantity * menu.Price,
          IsServed: false
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromPreOrder = (menuId: string) => {
    setPreOrderItems(prev => prev.filter(item => item.MenuID !== menuId));
  };

  const updateQuantity = (menuId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromPreOrder(menuId);
      return;
    }

    setPreOrderItems(prev =>
      prev.map(item =>
        item.MenuID === menuId
          ? {
              ...item,
              Quantity: quantity,
              TotalPrice: quantity * item.Price
            }
          : item
      )
    );
  };

  const clearPreOrder = () => {
    setPreOrderItems([]);
  };

  const getTotalAmount = () => {
    return preOrderItems.reduce((total, item) => total + item.TotalPrice, 0);
  };

  const value: PreOrderContextType = {
    preOrderItems,
    addToPreOrder,
    removeFromPreOrder,
    updateQuantity,
    clearPreOrder,
    getTotalAmount
  };

  return (
    <PreOrderContext.Provider value={value}>
      {children}
    </PreOrderContext.Provider>
  );
};
