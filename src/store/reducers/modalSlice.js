import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    fileMenu: false,
    deleteFileModal: false
  },
  reducers: {
    handleDeleteFileModal: (state, { payload }) => {
      state.deleteFileModal = payload;
    },
    handleFileMenu: (state, { payload }) => {
      state.fileMenu = payload;
    }
  }
});

export const { handleDeleteFileModal, handleFileMenu } = modalSlice.actions;
export default modalSlice.reducer;

export const selectisFileMenuOpen = (state) => state.modal.fileMenu;
export const selectisDeleteFileModalOpen = (state) =>
  state.modal.deleteFileModal;
