import { TransactionStatus } from "@/lib/utils";
import { IUser } from "./users";

export interface ITransaction {
  id: string;
  user_id: string;
  order_id: string;
  reference_code: string;
  txn_id: string;
  channel: string;
  status: TransactionStatus;
  total_amount: string;
  created_at: string;
  updated_at: string;
  user: IUser;
}
