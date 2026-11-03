import { UserRole } from "@/kits/data/user";

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole.customer;
  email_verified_at: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
}
