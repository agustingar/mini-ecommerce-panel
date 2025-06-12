import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FilterState } from '../../types';

const initialState: FilterState = {
  searchTerm: '',
  category: '',
  priceRange: {
    min: 0,
    max: 10000,
  },
  inStock: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.category = action.payload;
    },
    setPriceRange: (state, action: PayloadAction<{ min: number; max: number }>) => {
      state.priceRange = action.payload;
    },
    setInStock: (state, action: PayloadAction<boolean | null>) => {
      state.inStock = action.payload;
    },
    resetFilters: (state) => {
      state.searchTerm = '';
      state.category = '';
      state.priceRange = { min: 0, max: 10000 };
      state.inStock = null;
    },
    updateFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setSearchTerm,
  setCategory,
  setPriceRange,
  setInStock,
  resetFilters,
  updateFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer; 