export interface IGuestCartUpload {
  product_id: string;
  quantity: number;
  unit_price: number;
  total: number;
  id: string;
}

export interface IGuestPaymentVerification {
  name: string;
  email: string;
  phone?: string;
  ref: string;
  address: string;
  sub_total: string;
  delivery_fee: string;
  total: string;
  cart: IGuestCartUpload[];
}
