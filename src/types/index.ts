export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
}

export interface FilterState {
  searchTerm: string;
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  inStock: boolean | null;
}

export interface AppState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
  selectedProduct: Product | null;
  isModalOpen: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export type LoadingState = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export type ProductAction = 'create' | 'edit' | 'delete';

export interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
}

export const CATEGORIES = [
  'Electrónicos',
  'Ropa',
  'Hogar',
  'Deportes',
  'Libros',
  'Juguetes',
  'Otros'
] as const;

export type Category = typeof CATEGORIES[number]; 