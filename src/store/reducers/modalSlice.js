import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    fileMenu: false,
    deleteFileModal: false,
    paymentSelectModal: false,
  },
  reducers: {
    handleDeleteFileModal: (state, { payload }) => {
      state.deleteFileModal = payload;
    },
    handlePaymentSelectModal: (state, { payload }) => {
      state.paymentSelectModal = payload;
    },
    handleFileMenu: (state, { payload }) => {
      state.fileMenu = payload;
    }
  }
});

export const { handleDeleteFileModal, handleFileMenu, handlePaymentSelectModal } = modalSlice.actions;
export default modalSlice.reducer;

export const selectisFileMenuOpen = (state) => state.modal.fileMenu;
export const selectisDeleteFileModalOpen = (state) =>
  state.modal.deleteFileModal;
export const selectPaymentSelectModal = (state) =>
  state.modal.paymentSelectModal;