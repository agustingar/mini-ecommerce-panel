import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product, LoadingState } from '../../types';
import { productService } from '../../services/productService';

interface ProductsState {
  items: Product[];
  loading: LoadingState;
  error: string | null;
  selectedProduct: Product | null;
}

const initialState: ProductsState = {
  items: [],
  loading: 'idle',
  error: null,
  selectedProduct: null,
};

// Async thunks para operaciones CRUD
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const products = await productService.getProducts();
    return products;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const product = await productService.createProduct(productData);
    return product;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> }) => {
    const product = await productService.updateProduct(id, data);
    return product;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await productService.deleteProduct(id);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSelectedProduct: (state, action: PayloadAction<Product | null>) => {
      state.selectedProduct = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetProducts: (state) => {
      state.items = [];
      state.selectedProduct = null;
      state.error = null;
      state.loading = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = 'fulfilled';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload as string;
      })
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = 'fulfilled';
        state.items.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload as string;
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = 'fulfilled';
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload as string;
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = 'pending';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = 'fulfilled';
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = 'rejected';
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedProduct, clearError, resetProducts } = productsSlice.actions;
export default productsSlice.reducer; 