export interface MenuItem {
  id: string;
  name: string;
  category: string;
  variants: MenuVariant[];
  description?: string;
}

export interface MenuVariant {
  id: string;
  size: string;
  weight?: string;
  price: number;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "tuna-belly",
    name: "Grilled Tuna Belly",
    category: "Grilled Fish",
    description: "Fresh grilled tuna belly with authentic Filipino spices",
    variants: [
      { id: "tuna-belly-500g", size: "Regular", weight: "500g", price: 569 }
    ]
  },
  {
    id: "tuna-panga",
    name: "Grilled Tuna Panga",
    category: "Grilled Fish",
    description: "Tender tuna jaw grilled to perfection",
    variants: [
      { id: "tuna-panga-500g", size: "Large", weight: "500g", price: 399 },
      { id: "tuna-panga-400g", size: "Regular", weight: "400g", price: 329 }
    ]
  },
  {
    id: "bangus-relleno",
    name: "Bangus Relleno",
    category: "Grilled Fish",
    description: "Stuffed milkfish with traditional Filipino flavors",
    variants: [
      { id: "bangus-relleno-500g", size: "Regular", weight: "500g", price: 599 }
    ]
  },
  {
    id: "grilled-tilapia",
    name: "Grilled Tilapia",
    category: "Grilled Fish",
    description: "Fresh tilapia grilled with herbs and spices",
    variants: [
      { id: "tilapia-medium", size: "Medium", price: 255 },
      { id: "tilapia-big", size: "Big", price: 329 },
      { id: "tilapia-jumbo", size: "Jumbo", price: 359 }
    ]
  },
  {
    id: "grilled-pampano",
    name: "Grilled Pampano",
    category: "Grilled Fish",
    description: "Premium pampano fish grilled with special marinade",
    variants: [
      { id: "pampano-small", size: "Small", price: 399 },
      { id: "pampano-big", size: "Big", price: 545 }
    ]
  },
  {
    id: "boneless-bangus",
    name: "Grilled Boneless Bangus",
    category: "Grilled Fish",
    description: "Deboned milkfish for easy eating",
    variants: [
      { id: "bangus-middie", size: "Middie", price: 249 },
      { id: "bangus-flavored", size: "Flavored", price: 420 },
      { id: "bangus-biggie", size: "Biggie", price: 385 },
      { id: "bangus-jumbo", size: "Jumbo", price: 425 }
    ]
  },
  {
    id: "ginataang-santol",
    name: "Ginataang Santol",
    category: "Vegetarian",
    description: "Traditional santol cooked in coconut milk",
    variants: [
      { id: "ginataang-santol-regular", size: "Regular", price: 249 }
    ]
  },
  {
    id: "laing",
    name: "Laing",
    category: "Vegetarian",
    description: "Spicy taro leaves in coconut milk",
    variants: [
      { id: "laing-regular", size: "Regular", price: 265 }
    ]
  },
  {
    id: "achara-papaya",
    name: "Achara Papaya",
    category: "Sides",
    description: "Pickled green papaya salad",
    variants: [
      { id: "achara-regular", size: "Regular", price: 145 }
    ]
  },
  {
    id: "bagoong-alamang",
    name: "Regular Bagoong Alamang",
    category: "Condiments",
    description: "Traditional fermented shrimp paste",
    variants: [
      { id: "bagoong-alamang-regular", size: "Regular", price: 200 }
    ]
  },
  {
    id: "chili-sauce",
    name: "Chili Sauce",
    category: "Condiments",
    description: "Spicy chili sauce perfect for seafood",
    variants: [
      { id: "chili-sauce-regular", size: "Regular", price: 175 }
    ]
  },
  {
    id: "burong-isda",
    name: "Burong Isda",
    category: "Condiments",
    description: "Fermented fish condiment",
    variants: [
      { id: "burong-isda-regular", size: "Regular", price: 160 }
    ]
  },
  {
    id: "bagoong-isda",
    name: "Bagoong Isda",
    category: "Condiments",
    description: "Fish-based bagoong sauce",
    variants: [
      { id: "bagoong-isda-regular", size: "Regular", price: 160 }
    ]
  },
  {
    id: "burong-hipon",
    name: "Burong Hipon",
    category: "Condiments",
    description: "Fermented shrimp condiment",
    variants: [
      { id: "burong-hipon-regular", size: "Regular", price: 145 }
    ]
  }
];

export const CATEGORIES = [
  "All",
  "Grilled Fish",
  "Vegetarian", 
  "Sides",
  "Condiments"
];