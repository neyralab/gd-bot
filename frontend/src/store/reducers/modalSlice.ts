import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    deleteFileModal: false as boolean,
    paymentSelectModal: false as boolean,
    paperViewModal: false as boolean
  },
  reducers: {
    handleDeleteFileModal: (state, { payload }: PayloadAction<boolean>) => {
      state.deleteFileModal = payload;
    },
    handlePaymentSelectModal: (state, { payload }: PayloadAction<boolean>) => {
      state.paymentSelectModal = payload;
    },
    handlePaperViewModal: (state, { payload }: PayloadAction<boolean>) => {
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

export const selectPaperViewModal = (state: RootState) =>
  state.modal.paperViewModal;
export const selectisDeleteFileModalOpen = (state: RootState) =>
  state.modal.deleteFileModal;
export const selectPaymentSelectModal = (state: RootState) =>
  state.modal.paymentSelectModal;
