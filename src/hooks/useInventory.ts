import { useState, useEffect } from 'react';
import { MENU_ITEMS } from '@/data/menu';

export interface InventoryItem {
  itemId: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  lastRestocked: string;
  avgDailyUsage: number;
}

const INITIAL_INVENTORY: InventoryItem[] = MENU_ITEMS.map(item => ({
  itemId: item.id,
  currentStock: Math.floor(Math.random() * 50) + 20, // Random initial stock 20-70
  minStock: 10,
  maxStock: 100,
  unit: item.category === 'Condiments' ? 'bottles' : 'pieces',
  lastRestocked: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  avgDailyUsage: Math.floor(Math.random() * 5) + 2 // 2-7 units per day
}));

export const useInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('fish2go-inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  useEffect(() => {
    localStorage.setItem('fish2go-inventory', JSON.stringify(inventory));
  }, [inventory]);

  const updateStock = (itemId: string, newStock: number) => {
    setInventory(prev => prev.map(item => 
      item.itemId === itemId 
        ? { ...item, currentStock: Math.max(0, newStock) }
        : item
    ));
  };

  const restockItem = (itemId: string, quantity: number) => {
    setInventory(prev => prev.map(item => 
      item.itemId === itemId 
        ? { 
            ...item, 
            currentStock: Math.min(item.maxStock, item.currentStock + quantity),
            lastRestocked: new Date().toISOString().split('T')[0]
          }
        : item
    ));
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.currentStock <= item.minStock);
  };

  const getStockStatus = (itemId: string): 'high' | 'medium' | 'low' | 'out' => {
    const item = inventory.find(i => i.itemId === itemId);
    if (!item) return 'out';
    
    if (item.currentStock === 0) return 'out';
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock <= item.maxStock * 0.5) return 'medium';
    return 'high';
  };

  const consumeStock = (itemId: string, quantity: number) => {
    updateStock(itemId, inventory.find(i => i.itemId === itemId)?.currentStock! - quantity);
  };

  const getReorderSuggestions = () => {
    return inventory
      .filter(item => item.currentStock <= item.minStock)
      .map(item => ({
        itemId: item.itemId,
        suggestedQuantity: item.maxStock - item.currentStock,
        daysUntilStockout: Math.floor(item.currentStock / item.avgDailyUsage),
        priority: item.currentStock === 0 ? 'urgent' : 
                 item.currentStock <= item.minStock * 0.5 ? 'high' : 'medium'
      }));
  };

  return {
    inventory,
    updateStock,
    restockItem,
    getLowStockItems,
    getStockStatus,
    consumeStock,
    getReorderSuggestions
  };
};