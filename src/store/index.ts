import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

// Re-exportar los slices directamente
import productsSlice from './slices/productsSlice';
import filtersSlice from './slices/filtersSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    products: productsSlice,
    filters: filtersSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks tipados para usar en toda la aplicación
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Exportar los tipos del state para uso en componentes
export type ProductsState = RootState['products'];
export type FiltersState = RootState['filters'];
export type UiState = RootState['ui']; 