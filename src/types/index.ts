export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery?: string[];
  priceTiers: PriceTier[];
  options: ProductOption[];
  specs: string[];
  featured?: boolean;
  bestseller?: boolean;
}

export interface PriceTier {
  quantity: number;
  price: number;
  unitPrice: number;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  options: Record<string, string>;
  artwork?: Artwork;
  price: number;
}

export interface Artwork {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
  uploadedAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  whatsapp?: string;
  profession?: string;
  business?: string;
  addresses: Address[];
  createdAt: Date;
}

export interface Address {
  id?: string;
  fullName?: string;
  name?: string;
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  shipping: number;
  tax: number;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 
  | 'pending'
  | 'payment_confirmed'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface DesignRequest {
  id: string;
  userId: string;
  projectType: string;
  description: string;
  colorPreferences?: string;
  budget?: string;
  deadline?: Date;
  referenceFiles?: Artwork[];
  status: 'new' | 'in_review' | 'in_progress' | 'completed';
  createdAt: Date;
}

export interface Review {
  id: string;
  userName: string;
  userRole: string;
  rating: number;
  title: string;
  content: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}
