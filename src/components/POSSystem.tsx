import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  Receipt,
  Fish
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { MENU_ITEMS, CATEGORIES, MenuItem, MenuVariant } from '@/data/menu';
import { useInventory } from '@/hooks/useInventory';

interface CartItem {
  itemId: string;
  variantId: string;
  name: string;
  variant: MenuVariant;
  quantity: number;
}

const POSSystem = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { getStockStatus, consumeStock } = useInventory();

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item: MenuItem, variant: MenuVariant) => {
    const stockStatus = getStockStatus(item.id);
    if (stockStatus === 'out') {
      toast({
        title: "Out of Stock",
        description: `${item.name} is currently out of stock.`,
        variant: "destructive"
      });
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.itemId === item.id && cartItem.variantId === variant.id
      );

      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.itemId === item.id && cartItem.variantId === variant.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prev, {
        itemId: item.id,
        variantId: variant.id,
        name: item.name,
        variant,
        quantity: 1
      }];
    });

    toast({
      title: "Added to Cart",
      description: `${item.name} (${variant.size}) added to cart.`,
    });
  };

  const updateQuantity = (itemId: string, variantId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(itemId, variantId);
      return;
    }

    setCart(prev => prev.map(item =>
      item.itemId === itemId && item.variantId === variantId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = (itemId: string, variantId: string) => {
    setCart(prev => prev.filter(item => 
      !(item.itemId === itemId && item.variantId === variantId)
    ));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.variant.price * item.quantity), 0);
  };

  const processOrder = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before processing order.",
        variant: "destructive"
      });
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      // Update inventory
      cart.forEach(item => {
        consumeStock(item.itemId, item.quantity);
      });

      // Clear cart
      setCart([]);

      toast({
        title: "Order Processed!",
        description: `Order total: ₱${getTotal().toLocaleString()}. Receipt generated.`,
        variant: "default"
      });
    }, 1500);

    toast({
      title: "Processing Payment...",
      description: "Please wait while we process your order.",
    });
  };

  const getStockBadge = (itemId: string) => {
    const status = getStockStatus(itemId);
    const variants = {
      high: { label: 'In Stock', className: 'bg-success text-success-foreground' },
      medium: { label: 'Limited', className: 'bg-secondary text-secondary-foreground' },
      low: { label: 'Low Stock', className: 'bg-destructive text-destructive-foreground' },
      out: { label: 'Out of Stock', className: 'bg-muted text-muted-foreground' }
    };
    
    const variant = variants[status];
    return <Badge className={variant.className}>{variant.label}</Badge>;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen">
      {/* Menu Section */}
      <div className="lg:col-span-2 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-ocean shadow-ocean">
            <Fish className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">fish2go POS</h1>
            <p className="text-muted-foreground">Point of Sale System</p>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="space-y-4">
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid grid-cols-5 w-full">
              {CATEGORIES.map(category => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto max-h-[600px]">
          {filteredItems.map(item => (
            <Card key={item.id} className="bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  {getStockBadge(item.id)}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.variants.map(variant => (
                  <div key={variant.id} className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <div>
                      <p className="font-medium">
                        {variant.size}
                        {variant.weight && ` (${variant.weight})`}
                      </p>
                      <p className="text-lg font-bold text-primary">₱{variant.price}</p>
                    </div>
                    <Button
                      onClick={() => addToCart(item, variant)}
                      disabled={getStockStatus(item.id) === 'out'}
                      size="sm"
                      className="bg-gradient-ocean hover:opacity-90"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart Section */}
      <div className="space-y-4">
        <Card className="bg-gradient-card shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Current Order
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Cart is empty
              </p>
            ) : (
              <>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {cart.map(item => (
                    <div key={`${item.itemId}-${item.variantId}`} className="p-3 rounded-lg bg-muted">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.variant.size}
                            {item.variant.weight && ` (${item.variant.weight})`}
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            ₱{item.variant.price} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.itemId, item.variantId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.itemId, item.variantId, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.itemId, item.variantId, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-bold">
                          ₱{(item.variant.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary">₱{getTotal().toLocaleString()}</span>
                  </div>

                  <Button
                    onClick={processOrder}
                    className="w-full bg-gradient-sunset hover:opacity-90 text-white font-semibold py-3"
                    size="lg"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Process Payment
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setCart([])}
                  >
                    <Receipt className="h-5 w-5 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POSSystem;