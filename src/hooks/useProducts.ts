import { useCallback, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import type { RootState } from '../store';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  setSelectedProduct,
  clearError 
} from '../store/slices/productsSlice';
import type { Product, ProductFormData, FilterState } from '../types';

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const { items, loading, error, selectedProduct } = useAppSelector(state => state.products);
  const filters = useAppSelector((state: RootState) => state.filters as FilterState);

  // Filtrar productos basado en los filtros actuales
  const filteredProducts = useMemo(() => {
    let filtered = [...items];

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por categoría
    if (filters.category && filters.category !== '') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Filtro por rango de precio
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange.min &&
      product.price <= filters.priceRange.max
    );

    // Filtro por disponibilidad de stock
    if (filters.inStock !== null) {
      filtered = filtered.filter(product =>
        filters.inStock ? product.stock > 0 : product.stock === 0
      );
    }

    return filtered;
  }, [items, filters]);

  // Estadísticas de productos
  const productStats = useMemo(() => ({
    total: items.length,
    inStock: items.filter(product => product.stock > 0).length,
    outOfStock: items.filter(product => product.stock === 0).length,
    filtered: filteredProducts.length,
    totalValue: items.reduce((sum, product) => sum + (product.price * product.stock), 0),
  }), [items, filteredProducts]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map(product => product.category))];
    return uniqueCategories.sort();
  }, [items]);

  // Rango de precios disponible
  const priceRange = useMemo(() => {
    if (items.length === 0) return { min: 0, max: 1000 };
    
    const prices = items.map(product => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [items]);

  // Funciones de acción
  const loadProducts = useCallback(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCreateProduct = useCallback(async (productData: ProductFormData) => {
    try {
      await dispatch(createProduct(productData)).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al crear producto' 
      };
    }
  }, [dispatch]);

  const handleUpdateProduct = useCallback(async (id: string, productData: ProductFormData) => {
    try {
      await dispatch(updateProduct({ id, data: productData })).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al actualizar producto' 
      };
    }
  }, [dispatch]);

  const handleDeleteProduct = useCallback(async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error al eliminar producto' 
      };
    }
  }, [dispatch]);

  const selectProduct = useCallback((product: Product | null) => {
    dispatch(setSelectedProduct(product));
  }, [dispatch]);

  const clearProductError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const getProductById = useCallback((id: string): Product | undefined => {
    return items.find(product => product.id === id);
  }, [items]);

  return {
    // Estado
    products: items,
    filteredProducts,
    loading,
    error,
    selectedProduct,
    
    // Estadísticas y datos derivados
    productStats,
    categories,
    priceRange,
    
    // Acciones
    loadProducts,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    selectProduct,
    clearProductError,
    getProductById,
    
    // Estados computados
    isLoading: loading === 'pending',
    hasError: !!error,
    hasProducts: items.length > 0,
    hasFilteredProducts: filteredProducts.length > 0,
  };
}; 