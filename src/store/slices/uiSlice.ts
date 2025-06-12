import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { NotificationState } from '../../types';

interface UiState {
  isModalOpen: boolean;
  modalType: 'create' | 'edit' | 'delete' | null;
  notification: NotificationState;
  isLoading: boolean;
}

const initialState: UiState = {
  isModalOpen: false,
  modalType: null,
  notification: {
    message: '',
    type: 'info',
    isVisible: false,
  },
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<'create' | 'edit' | 'delete'>) => {
      state.isModalOpen = true;
      state.modalType = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.modalType = null;
    },
    showNotification: (state, action: PayloadAction<Omit<NotificationState, 'isVisible'>>) => {
      state.notification = {
        ...action.payload,
        isVisible: true,
      };
    },
    hideNotification: (state) => {
      state.notification.isVisible = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  showNotification,
  hideNotification,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer; 