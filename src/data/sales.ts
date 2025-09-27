export interface SalesRecord {
  id: string;
  date: string;
  items: {
    itemId: string;
    variantId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  timestamp: number;
}

export interface DailySales {
  date: string;
  revenue: number;
  orders: number;
  topItems: { itemId: string; quantity: number }[];
}

// Generate sample historical sales data for forecasting
export const generateSampleSalesData = (days: number = 30): DailySales[] => {
  const data: DailySales[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate realistic sales patterns
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseRevenue = isWeekend ? 8000 : 5000;
    
    // Add some randomness and trends
    const trend = Math.sin((days - i) / 10) * 1000;
    const random = (Math.random() - 0.5) * 2000;
    const revenue = Math.max(1000, baseRevenue + trend + random);
    
    const orders = Math.floor(revenue / 350); // Average order value ~350 PHP
    
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round(revenue),
      orders,
      topItems: [
        { itemId: "tuna-belly", quantity: Math.floor(orders * 0.3) },
        { itemId: "grilled-tilapia", quantity: Math.floor(orders * 0.25) },
        { itemId: "boneless-bangus", quantity: Math.floor(orders * 0.2) }
      ]
    });
  }
  
  return data;
};

// Simple linear regression for sales forecasting
export const forecastSales = (historicalData: DailySales[], daysToForecast: number = 7) => {
  const revenues = historicalData.map(d => d.revenue);
  const n = revenues.length;
  
  // Calculate linear regression
  const xValues = Array.from({ length: n }, (_, i) => i);
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = revenues.reduce((sum, y) => sum + y, 0) / n;
  
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (revenues[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }
  
  const slope = denominator === 0 ? 0 : numerator / denominator;
  const intercept = yMean - slope * xMean;
  
  // Generate forecast
  const forecast: DailySales[] = [];
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  
  for (let i = 1; i <= daysToForecast; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    
    const predictedRevenue = Math.max(1000, slope * (n + i - 1) + intercept);
    const predictedOrders = Math.floor(predictedRevenue / 350);
    
    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      revenue: Math.round(predictedRevenue),
      orders: predictedOrders,
      topItems: [
        { itemId: "tuna-belly", quantity: Math.floor(predictedOrders * 0.3) },
        { itemId: "grilled-tilapia", quantity: Math.floor(predictedOrders * 0.25) },
        { itemId: "boneless-bangus", quantity: Math.floor(predictedOrders * 0.2) }
      ]
    });
  }
  
  return forecast;
};