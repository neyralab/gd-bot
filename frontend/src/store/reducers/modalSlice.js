import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    deleteFileModal: false,
    paymentSelectModal: false,
    paperViewModal: false,
  },
  reducers: {
    handleDeleteFileModal: (state, { payload }) => {
      state.deleteFileModal = payload;
    },
    handlePaymentSelectModal: (state, { payload }) => {
      state.paymentSelectModal = payload;
    },
    handlePaperViewModal: (state, { payload }) => {
      state.paperViewModal = payload;
    }
  }
});

export const {
  handleDeleteFileModal,
  handlePaymentSelectModal,
  handlePaperViewModal
} = modalSlice.actions;
export default modalSlice.reducer;

export const selectPaperViewModal = (state) => state.modal.paperViewModal;
export const selectisDeleteFileModalOpen = (state) =>
  state.modal.deleteFileModal;
export const selectPaymentSelectModal = (state) =>
  state.modal.paymentSelectModal;