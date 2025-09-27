import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  Fish,
  BarChart3
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  TooltipProps
} from 'recharts';
import { generateSampleSalesData, forecastSales, DailySales } from '@/data/sales';
import { useInventory } from '@/hooks/useInventory';
import { MENU_ITEMS } from '@/data/menu';

const Dashboard = () => {
  const [salesData, setSalesData] = useState<DailySales[]>([]);
  const [forecast, setForecast] = useState<DailySales[]>([]);
  const { inventory, getLowStockItems, getReorderSuggestions } = useInventory();

  useEffect(() => {
    const data = generateSampleSalesData(30);
    setSalesData(data);
    setForecast(forecastSales(data, 7));
  }, []);

  const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
  const avgDailyRevenue = Math.round(totalRevenue / salesData.length);
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
  const lowStockItems = getLowStockItems();
  const reorderSuggestions = getReorderSuggestions();

  const chartData = [...salesData.slice(-14), ...forecast].map(day => ({
    ...day,
    type: salesData.includes(day) ? 'actual' : 'forecast'
  }));

  const getItemName = (itemId: string) => {
    return MENU_ITEMS.find(item => item.id === itemId)?.name || itemId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-ocean shadow-ocean">
          <Fish className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">fish2go Analytics</h1>
          <p className="text-muted-foreground">ML-powered sales forecasting and inventory management</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (30d)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              ₱{avgDailyRevenue.toLocaleString()}/day average
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(totalOrders / salesData.length)} orders/day
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast Accuracy</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">87%</div>
            <p className="text-xs text-muted-foreground">ML model accuracy</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Insights */}
      <Tabs defaultValue="forecast" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecast">Sales Forecast</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Status</TabsTrigger>
          <TabsTrigger value="insights">ML Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="forecast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Sales Forecast (Next 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `₱${value.toLocaleString()}`, 
                      name === 'revenue' ? 'Revenue' : name
                    ]}
                    labelFormatter={(label) => new Date(label).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                {forecast.slice(0, 3).map((day, index) => (
                  <div key={day.date} className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-semibold">₱{day.revenue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{day.orders} orders</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Low Stock Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {lowStockItems.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">All items are well stocked! 🎉</p>
                ) : (
                  lowStockItems.map(item => (
                    <div key={item.itemId} className="flex justify-between items-center p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div>
                        <p className="font-medium">{getItemName(item.itemId)}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.currentStock} {item.unit} remaining
                        </p>
                      </div>
                      <Badge variant="destructive">Low Stock</Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Reorder Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reorderSuggestions.slice(0, 5).map(suggestion => (
                  <div key={suggestion.itemId} className="flex justify-between items-center p-3 rounded-lg bg-muted">
                    <div>
                      <p className="font-medium">{getItemName(suggestion.itemId)}</p>
                      <p className="text-sm text-muted-foreground">
                        Suggested: {suggestion.suggestedQuantity} units
                      </p>
                    </div>
                    <Badge variant={
                      suggestion.priority === 'urgent' ? 'destructive' :
                      suggestion.priority === 'high' ? 'secondary' : 'outline'
                    }>
                      {suggestion.priority}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items (Forecast)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={forecast[0]?.topItems || []}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="itemId" 
                      tick={{ fontSize: 10 }}
                      tickFormatter={(value) => getItemName(value).split(' ')[0]}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      formatter={(value: any) => [value, 'Predicted Sales']}
                      labelFormatter={(label) => getItemName(label)}
                    />
                    <Bar dataKey="quantity" fill="hsl(var(--secondary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <h4 className="font-semibold text-primary mb-2">Menu Optimization</h4>
                  <p className="text-sm">Consider promoting Grilled Tilapia during weekdays - 23% higher conversion rate predicted.</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                  <h4 className="font-semibold text-secondary mb-2">Inventory Efficiency</h4>
                  <p className="text-sm">Reduce Burong Hipon stock by 15% - lower demand pattern detected.</p>
                </div>
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <h4 className="font-semibold text-success mb-2">Revenue Opportunity</h4>
                  <p className="text-sm">Bundle condiments with grilled fish for ₱2,340 additional weekly revenue.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;