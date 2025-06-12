import type { Product, ProductFormData } from '../types';

class ProductService {
  private readonly STORAGE_KEY = 'ecommerce_products';
  private readonly DELAY = 800; // Simular latencia de red

  // Simular delay de red
  private delay = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));

  // Generar ID único
  private generateId = (): string => 
    `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Obtener productos del localStorage
  private getStoredProducts = (): Product[] => {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const products = JSON.parse(stored) as Array<Product & { createdAt: string | Date; updatedAt: string | Date }>;
        // Asegurar que las fechas sean strings
        const normalizedProducts = products.map((product) => ({
          ...product,
          createdAt: typeof product.createdAt === 'string' ? product.createdAt : new Date(product.createdAt).toISOString(),
          updatedAt: typeof product.updatedAt === 'string' ? product.updatedAt : new Date(product.updatedAt).toISOString(),
        }));
        
        // Si alguna fecha fue convertida, volver a guardar
        const hasDateObjects = products.some(p => typeof p.createdAt !== 'string' || typeof p.updatedAt !== 'string');
        if (hasDateObjects) {
          this.saveProducts(normalizedProducts);
        }
        
        return normalizedProducts;
      }
      
      // Si no hay productos en localStorage, crear y guardar los iniciales
      const initialProducts = this.getInitialProducts();
      this.saveProducts(initialProducts);
      return initialProducts;
    } catch (error) {
      console.error('Error al obtener productos del localStorage:', error);
      // En caso de error, limpiar localStorage y usar productos iniciales
      localStorage.removeItem(this.STORAGE_KEY);
      const initialProducts = this.getInitialProducts();
      this.saveProducts(initialProducts);
      return initialProducts;
    }
  };

  // Guardar productos en localStorage
  private saveProducts = (products: Product[]): void => {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Error al guardar productos en localStorage:', error);
      throw new Error('No se pudieron guardar los productos');
    }
  };

  // Productos iniciales de ejemplo
  private getInitialProducts = (): Product[] => [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      description: 'El último iPhone con tecnología avanzada y cámara pro',
      price: 1199,
      category: 'Electrónicos',
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    },
    {
      id: '2',
      name: 'MacBook Air M3',
      description: 'Laptop ultraligera con chip M3 para máximo rendimiento',
      price: 1499,
      category: 'Electrónicos',
      stock: 8,
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    },
    {
      id: '3',
      name: 'Camiseta Premium',
      description: 'Camiseta de algodón orgánico, cómoda y duradera',
      price: 29.99,
      category: 'Ropa',
      stock: 25,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    },
    {
      id: '4',
      name: 'Sofá Moderno',
      description: 'Sofá de 3 plazas con diseño contemporáneo',
      price: 899,
      category: 'Hogar',
      stock: 5,
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    },
    {
      id: '5',
      name: 'Zapatillas Running',
      description: 'Zapatillas deportivas para correr con tecnología de amortiguación',
      price: 149.99,
      category: 'Deportes',
      stock: 0,
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    },
    {
      id: '6',
      name: 'El Arte de la Guerra',
      description: 'Libro clásico de estrategia militar y empresarial',
      price: 19.99,
      category: 'Libros',
      stock: 12,
      imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      createdAt: new Date('2024-01-15T10:00:00Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:00:00Z').toISOString(),
    },
  ];

  // Métodos públicos del servicio
  getProducts = async (): Promise<Product[]> => {
    await this.delay(this.DELAY);
    const products = this.getStoredProducts();
    
    // Si no hay productos en localStorage, guardar los iniciales
    if (products.length === 0) {
      const initialProducts = this.getInitialProducts();
      this.saveProducts(initialProducts);
      return initialProducts;
    }
    
    return products;
  };

  getProductById = async (id: string): Promise<Product | null> => {
    await this.delay(this.DELAY);
    const products = this.getStoredProducts();
    return products.find(product => product.id === id) || null;
  };

  createProduct = async (productData: ProductFormData): Promise<Product> => {
    await this.delay(this.DELAY);
    
    const newProduct: Product = {
      ...productData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const products = this.getStoredProducts();
    products.push(newProduct);
    this.saveProducts(products);
    
    return newProduct;
  };

  updateProduct = async (id: string, productData: ProductFormData): Promise<Product> => {
    await this.delay(this.DELAY);
    
    const products = this.getStoredProducts();
    const index = products.findIndex(product => product.id === id);
    
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }

    const updatedProduct: Product = {
      ...products[index],
      ...productData,
      updatedAt: new Date().toISOString(),
    };

    products[index] = updatedProduct;
    this.saveProducts(products);
    
    return updatedProduct;
  };

  deleteProduct = async (id: string): Promise<void> => {
    await this.delay(this.DELAY);
    
    const products = this.getStoredProducts();
    const filteredProducts = products.filter(product => product.id !== id);
    
    if (filteredProducts.length === products.length) {
      throw new Error('Producto no encontrado');
    }

    this.saveProducts(filteredProducts);
  };

  // Método para limpiar todos los productos (útil para testing)
  clearProducts = (): void => {
    localStorage.removeItem(this.STORAGE_KEY);
  };

  // Método para resetear a productos iniciales
  resetToInitialProducts = (): void => {
    this.saveProducts(this.getInitialProducts());
  };
}

export const productService = new ProductService(); 