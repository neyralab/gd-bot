import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

interface InitialState {
  deleteFileModal: boolean;
  paymentSelectModal: boolean;
  ppvModal: boolean;
}

const initialState: InitialState = {
  deleteFileModal: false,
  paymentSelectModal: false,
  ppvModal: false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState: initialState,
  reducers: {
    handleDeleteFileModal: (state, { payload }: PayloadAction<boolean>) => {
      state.deleteFileModal = payload;
    },
    handlePaymentSelectModal: (state, { payload }: PayloadAction<boolean>) => {
      state.paymentSelectModal = payload;
    },
    handlePPVModal: (state, { payload }: PayloadAction<boolean>) => {
      state.ppvModal = payload;
    }
  }
});

export const {
  handleDeleteFileModal,
  handlePaymentSelectModal,
  handlePPVModal
} = modalSlice.actions;
export default modalSlice.reducer;

export const selectPPVModal = (state: RootState) => state.modal.ppvModal;
export const selectisDeleteFileModalOpen = (state: RootState) =>
  state.modal.deleteFileModal;
export const selectPaymentSelectModal = (state: RootState) =>
  state.modal.paymentSelectModal;
