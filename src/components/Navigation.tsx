import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  ShoppingCart, 
  Package, 
  Fish,
  AlertTriangle
} from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { getLowStockItems } = useInventory();
  const lowStockCount = getLowStockItems().length;

  const navItems = [
    {
      id: 'pos',
      label: 'Point of Sale',
      icon: ShoppingCart,
      description: 'Process orders and sales'
    },
    {
      id: 'dashboard',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Sales forecasting & insights'
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: Package,
      description: 'Stock management',
      badge: lowStockCount > 0 ? lowStockCount : undefined,
      badgeVariant: 'destructive' as const
    }
  ];

  return (
    <div className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-hero shadow-ocean">
              <Fish className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">fish2go</h1>
              <p className="text-sm text-muted-foreground">ML-Powered POS & Inventory System</p>
            </div>
          </div>
          
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">
                {lowStockCount} item{lowStockCount > 1 ? 's' : ''} low in stock
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-2 relative ${
                activeTab === item.id 
                  ? 'bg-gradient-ocean text-white shadow-ocean' 
                  : 'hover:bg-muted'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.label.split(' ')[0]}</span>
              {item.badge && (
                <Badge 
                  variant={item.badgeVariant} 
                  className="ml-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;