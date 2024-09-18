import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    fileMenu: false,
    deleteFileModal: false,
    paymentSelectModal: false,
    filePreviewModal: false,
    paperViewModal: false,
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
    },
    handleFilePreviewModal: (state, { payload }) => {
      state.filePreviewModal = payload;
    },
    handlePaperViewModal: (state, { payload }) => {
      state.paperViewModal = payload;
    }
  }
});

export const {
  handleDeleteFileModal,
  handleFileMenu,
  handlePaymentSelectModal,
  handleFilePreviewModal,
  handlePaperViewModal
} = modalSlice.actions;
export default modalSlice.reducer;

export const selectisFileMenuOpen = (state) => state.modal.fileMenu;
export const selectIsFilePreviewOpen = (state) => state.modal.filePreviewModal;
export const selectPaperViewModal = (state) => state.modal.paperViewModal;
export const selectisDeleteFileModalOpen = (state) =>
  state.modal.deleteFileModal;
export const selectPaymentSelectModal = (state) =>
  state.modal.paymentSelectModal;