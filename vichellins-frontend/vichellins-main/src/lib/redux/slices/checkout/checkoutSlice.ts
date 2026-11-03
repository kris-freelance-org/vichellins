import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { paymentVerification } from "./checkoutThunk";
import { DeliveryMethod } from "@/lib/utils";

interface IDeliveryInformation {
  deliveryAddress: string;
  state: string;
  lga: string;
  phone: string;
}

interface CartSliceState {
  [key: string]: unknown;
  deliveryInformation: IDeliveryInformation | null;
  deliveryMethod: DeliveryMethod;
  deliveryCost: number;
}

interface UpdateStatePayload {
  name: keyof CartSliceState;
  value: unknown;
}

const initialState: CartSliceState = {
  deliveryInformation: null,
  deliveryMethod: DeliveryMethod.home_delivery,
  deliveryCost: 3000,
};

const CartSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    updateCheckoutInfoValues: (
      state,
      action: PayloadAction<UpdateStatePayload>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    calculateDeliveryCost: (state) => {
      state.deliveryCost =
        state.deliveryMethod === DeliveryMethod.home_delivery ? 3000 : 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(paymentVerification.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(paymentVerification.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(paymentVerification.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { updateCheckoutInfoValues, calculateDeliveryCost } =
  CartSlice.actions;

export default CartSlice.reducer;
