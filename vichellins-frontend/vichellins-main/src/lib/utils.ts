import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export enum UserType {
  retailer = "retailer",
  customer = "customer",
  admin = "admin",
}

export enum VerificationStatus {
  verified,
  not_verified,
}

export enum DeliveryMethod {
  pickup = "pickup",
  home_delivery = "home_delivery",
}

export enum PaymentStatus {
  all = "All",
  paid = "Paid",
  pending = "Pending",
  failed = "Failed",
}


export enum DeliveryStatus {
  all = "All",
  shipped = "Shipped",
  processing = "Processing",
  delivered = "Delivered",
  cancelled = "Cancelled",
}
export enum TransactionStatus {
  success = "Success",
  failed = "Failed",
}

export enum GeneralStatus {
  non_active,
  active,
}

export enum TicketPriority {
  high = "high",
  medium = "medium",
  low = "low",
}
export enum TicketStatus {
  unassigned = "unassigned",
  processing = "processing",
  closed = "closed",
}
