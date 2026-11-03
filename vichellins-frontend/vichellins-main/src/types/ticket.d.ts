import { TicketPriority, TicketStatus } from "@/lib/utils";
import { IUser } from "./users";

export interface ITicket {
  id: string;
  user_id: string;
  staff_id: string;
  desc: string;
  priority: TicketPriority;
  status: TicketStatus;
  date_opened: string;
  date_closed: string | null;
  created_at: string;
  updated_at: string;
  user: IUser;
  staff: IUser;
}
