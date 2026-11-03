/* eslint-disable @typescript-eslint/no-empty-object-type */
import { IUserDetials, ISession, IUser } from "@/types/users";

declare module "next-auth" {
  interface User extends IUser {}
  interface Session extends DefaultSession {
    user: IUserDetials;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends ISession{}  
}
