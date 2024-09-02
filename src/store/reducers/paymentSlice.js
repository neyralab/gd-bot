import { createSlice } from '@reduxjs/toolkit';

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    types: []
  },
  reducers: {
    handlePayment: (state, { payload }) => {
      state.types = payload || [];
    }
  }
});

export const { handlePayment } = paymentSlice.actions;
export default paymentSlice.reducer;

export const selectPayments = (state) => state.payment.types;
export const selectPaymenttByKey = (key) => (state) => state.payment.types
  .find((item) => item.Key === key) || {};