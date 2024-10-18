import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { AdvertisementBanner } from '../../effects/types/banners';
import { getBannersEffect } from '../../effects/bannerEffect';

interface InitialState {
  deleteFileModal: boolean;
  paymentSelectModal: boolean;
  ppvModal: boolean;
  banners: AdvertisementBanner[] | null;
}

const initialState: InitialState = {
  deleteFileModal: false,
  paymentSelectModal: false,
  ppvModal: false,
  banners: null
};

const uiSlice = createSlice({
  name: 'ui',
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
    },
    setAdvertisementBanners: (
      state,
      { payload }: PayloadAction<AdvertisementBanner[]>
    ) => {
      state.banners = payload;
    }
  }
});

export const getAdvertisementBanners = createAsyncThunk(
  'ui/getAdvertisementBanners',
  async (_, { dispatch }) => {
    const res = await getBannersEffect();
    if (res) {
      dispatch(setAdvertisementBanners(res));
    }
  }
);

export const {
  handleDeleteFileModal,
  handlePaymentSelectModal,
  handlePPVModal,
  setAdvertisementBanners
} = uiSlice.actions;
export default uiSlice.reducer;

export const selectPPVModal = (state: RootState) => state.ui.ppvModal;
export const selectisDeleteFileModalOpen = (state: RootState) =>
  state.ui.deleteFileModal;
export const selectPaymentSelectModal = (state: RootState) =>
  state.ui.paymentSelectModal;
export const selectAdvertisementBanners = (state: RootState) =>
  state.ui.banners;
