import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  Plus, 
  AlertTriangle, 
  TrendingDown,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useInventory } from '@/hooks/useInventory';
import { MENU_ITEMS } from '@/data/menu';

const InventoryManager = () => {
  const { 
    inventory, 
    updateStock, 
    restockItem, 
    getLowStockItems, 
    getStockStatus,
    getReorderSuggestions 
  } = useInventory();
  
  const [restockQuantity, setRestockQuantity] = useState<{ [key: string]: number }>({});

  const getItemName = (itemId: string) => {
    return MENU_ITEMS.find(item => item.id === itemId)?.name || itemId;
  };

  const getStockBadge = (status: string) => {
    const variants = {
      high: { label: 'High Stock', className: 'bg-success text-success-foreground' },
      medium: { label: 'Medium Stock', className: 'bg-secondary text-secondary-foreground' },
      low: { label: 'Low Stock', className: 'bg-destructive text-destructive-foreground' },
      out: { label: 'Out of Stock', className: 'bg-muted text-muted-foreground' }
    };
    
    const variant = variants[status as keyof typeof variants] || variants.medium;
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  const handleRestock = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity to restock.",
        variant: "destructive"
      });
      return;
    }

    restockItem(itemId, quantity);
    setRestockQuantity(prev => ({ ...prev, [itemId]: 0 }));
    
    toast({
      title: "Stock Updated",
      description: `Added ${quantity} units to ${getItemName(itemId)}.`,
    });
  };

  const handleAutoRestock = (itemId: string, suggestedQuantity: number) => {
    restockItem(itemId, suggestedQuantity);
    toast({
      title: "Auto Restock Complete",
      description: `Restocked ${getItemName(itemId)} with ${suggestedQuantity} units.`,
    });
  };

  const lowStockItems = getLowStockItems();
  const reorderSuggestions = getReorderSuggestions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-ocean shadow-ocean">
          <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor and manage stock levels</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Menu items tracked</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Items need attention</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reorder Alerts</CardTitle>
            <TrendingDown className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reorderSuggestions.length}</div>
            <p className="text-xs text-muted-foreground">Suggested restocks</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Well Stocked</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {inventory.filter(item => getStockStatus(item.itemId) === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground">Items in good stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Management */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Stock Overview</TabsTrigger>
          <TabsTrigger value="restock">Restock Items</TabsTrigger>
          <TabsTrigger value="alerts">Low Stock Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {inventory.map(item => {
              const status = getStockStatus(item.itemId);
              const stockPercentage = (item.currentStock / item.maxStock) * 100;
              
              return (
                <Card key={item.itemId} className="bg-gradient-card shadow-soft">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{getItemName(item.itemId)}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}
                        </p>
                      </div>
                      {getStockBadge(status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Stock</span>
                        <span className="font-medium">{item.currentStock} {item.unit}</span>
                      </div>
                      
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            stockPercentage > 50 ? 'bg-success' :
                            stockPercentage > 25 ? 'bg-secondary' : 'bg-destructive'
                          }`}
                          style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Min: {item.minStock}</span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Daily usage: ~{item.avgDailyUsage} {item.unit}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="restock" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Manual Restock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inventory.map(item => (
                  <div key={item.itemId} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                    <div className="flex-1">
                      <p className="font-medium">{getItemName(item.itemId)}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {item.currentStock} {item.unit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Qty"
                        value={restockQuantity[item.itemId] || ''}
                        onChange={(e) => setRestockQuantity(prev => ({
                          ...prev,
                          [item.itemId]: parseInt(e.target.value) || 0
                        }))}
                        className="w-20"
                        min="1"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleRestock(item.itemId, restockQuantity[item.itemId] || 0)}
                        disabled={!restockQuantity[item.itemId] || restockQuantity[item.itemId] <= 0}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5" />
                  Auto Restock Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reorderSuggestions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    All items are well stocked! 🎉
                  </p>
                ) : (
                  reorderSuggestions.map(suggestion => (
                    <div key={suggestion.itemId} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                      <div className="flex-1">
                        <p className="font-medium">{getItemName(suggestion.itemId)}</p>
                        <p className="text-sm text-muted-foreground">
                          Suggested: {suggestion.suggestedQuantity} units
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {suggestion.daysUntilStockout} days until stockout
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          suggestion.priority === 'urgent' ? 'destructive' :
                          suggestion.priority === 'high' ? 'secondary' : 'outline'
                        }>
                          {suggestion.priority}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleAutoRestock(suggestion.itemId, suggestion.suggestedQuantity)}
                          className="bg-gradient-ocean hover:opacity-90"
                        >
                          Auto Restock
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Critical Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No low stock alerts! All items are well stocked. 🎉
                </p>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map(item => (
                    <div key={item.itemId} className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex-1">
                        <p className="font-medium text-destructive">{getItemName(item.itemId)}</p>
                        <p className="text-sm text-muted-foreground">
                          Only {item.currentStock} {item.unit} remaining (min: {item.minStock})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ~{Math.floor(item.currentStock / item.avgDailyUsage)} days of stock left
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Urgent</Badge>
                        <Button
                          size="sm"
                          onClick={() => handleAutoRestock(item.itemId, item.maxStock - item.currentStock)}
                          className="bg-gradient-sunset hover:opacity-90"
                        >
                          Restock Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryManager;