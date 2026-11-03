import { DeliveryStatus, PaymentStatus } from "@/lib/utils";
import { IUserDetials } from "./users";

interface IOrderItems {
  product_id: number;
  product_price: number;
  product_quantity: number;
  product_name: string;
  product_image: string;
  product_category: {
    name: string;
    description: string;
  };
}

export interface IOrder {
  id: number;
  user_id: number;
  items: IOrderItems[];
  total_amount: string;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ISelectedOrder {
  id: number;
  user_id: number;
  items: IOrderItems[];
  total_amount: string;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  user: IUserDetials;
  createdAt: string;
  updatedAt: string;
}
