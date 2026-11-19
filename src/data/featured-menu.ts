export interface FeaturedMenuItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  restaurantName: string;
  location: string;
  vendorInfo: string;
  image: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  status: "approved" | "pending" | "rejected";
  isActive: boolean;
}

export const FEATURED_MENU_ITEMS: FeaturedMenuItem[] = [
  {
    id: "1",
    slug: "classic-pepperoni",
    name: "Classic Pepperoni",
    category: "Classic Pizzas",
    categorySlug: "classic",
    price: 550,
    restaurantName: "PizzaHub Restaurant",
    location: "Rajshahi",
    vendorInfo: "Authentic wood-fired recipes since 2018",
    image:
      "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 320,
    badge: "Best Seller",
    status: "approved",
    isActive: true,
  },
  {
    id: "2",
    slug: "veggie-delight",
    name: "Veggie Delight",
    category: "Vegetarian Pizzas",
    categorySlug: "vegetarian",
    price: 520,
    restaurantName: "Urban Pizza",
    location: "Dhaka",
    vendorInfo: "100% farm-fresh organic toppings",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: 215,
    badge: "Healthy Pick",
    status: "approved",
    isActive: true,
  },
  {
    id: "3",
    slug: "meat-lovers-supreme",
    name: "Meat Lover's Supreme",
    category: "Meat Lovers",
    categorySlug: "meat-lovers",
    price: 780,
    restaurantName: "Pizza Club",
    location: "Chattogram",
    vendorInfo: "Loaded with smoky beef, sausage & pepperoni",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 480,
    badge: "Top Rated",
    status: "approved",
    isActive: true,
  },
  {
    id: "4",
    slug: "truffle-mushroom-special",
    name: "Truffle Mushroom Special",
    category: "Specialty / Gourmet Pizzas",
    categorySlug: "specialty-gourmet",
    price: 650,
    restaurantName: "Italiano Pizzeria",
    location: "Sylhet",
    vendorInfo: "Gourmet truffle oil with wild portobello mushrooms",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 190,
    badge: "Chef's Special",
    status: "approved",
    isActive: true,
  },
  {
    id: "5",
    slug: "cheesy-garlic-breadsticks",
    name: "Cheesy Garlic Breadsticks",
    category: "Sides & Appetizers",
    categorySlug: "sides-appetizers",
    price: 290,
    restaurantName: "PizzaHub Restaurant",
    location: "Rajshahi",
    vendorInfo: "Freshly baked herb bread with melted mozzarella",
    image:
      "https://images.unsplash.com/photo-1548369937-47519962c11a?w=800&auto=format&fit=crop&q=80",
    rating: 4.6,
    reviews: 140,
    badge: "Hot Appetizer",
    status: "approved",
    isActive: true,
  },
  {
    id: "6",
    slug: "belgian-chocolate-shake",
    name: "Belgian Chocolate Shake",
    category: "Beverages & Desserts",
    categorySlug: "beverages-desserts",
    price: 320,
    restaurantName: "Urban Pizza",
    location: "Dhaka",
    vendorInfo: "Thick blend of rich Belgian cocoa and ice cream",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 260,
    badge: "Sweet Treat",
    status: "approved",
    isActive: true,
  },
];
