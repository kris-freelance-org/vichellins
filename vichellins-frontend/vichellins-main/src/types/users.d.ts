import { UserRole } from "@/kits/data/user";
import { DefaultSession } from "next-auth";

export interface IUserDetials {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type IUser = {
  token: string;
  details: IUserDetials;
};

export interface ISession extends DefaultSession {
  user: IUserDetials;
  token?: string;
}

export interface IUserPassword {
  password: string;
  passwordConfirmation: string;
}

export interface IGuestUser {
  name: string;
  email: string;
}
