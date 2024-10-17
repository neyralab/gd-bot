import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { PaymentType } from '../../effects/types/payments';

interface InitialState {
  types: PaymentType[];
}

const initialState: InitialState = {
  types: []
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState: initialState,
  reducers: {
    handlePayment: (state, { payload }: PayloadAction<PaymentType[]>) => {
      state.types = payload || [];
    }
  }
});

export const { handlePayment } = paymentSlice.actions;
export default paymentSlice.reducer;

export const selectPayments = (state: RootState) => state.payment.types;
export const selectPaymenttByKey = (key: string) => (state: RootState) =>
  state.payment.types.find((item) => item.Key === key) || {};
