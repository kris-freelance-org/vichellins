import axios, { AxiosError } from "axios";
import { createAppAsyncThunk } from "../../createAppAsyncThunk";
import { TicketPriority } from "@/lib/utils";
import { ITicket } from "@/types/ticket";

// Add a request interceptor
const axiosInstance = axios.create({
  baseURL: "https://api.voranaija.com/api",
});
axiosInstance.interceptors.request.use(
  function (config) {
    const authToken = sessionStorage.getItem("authToken");

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export const getAllTickets = createAppAsyncThunk(
  "ticket/getAllTickets",
  async (page: number | undefined, thunkAPI) => {
    try {
      const path = page ? `/tickets?page=${page}` : "/tickets";
      const res = await axiosInstance.get(path);

      return {
        tickets: res.data.data.tickets,
        currentPage: res.data.data.current_page,
        total: res.data.data.total,
        numberOfPages: res.data.data.last_page,
        limit: res.data.data.per_page,
        nextPageUrl: res.data.data.next_page_url,
        prevPageUrl: res.data.data.prev_page_url,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Get All tickets");
    }
  }
);

export const getSingleTicket = createAppAsyncThunk(
  "ticket/getSingleTicket ",
  async (staff_id: string, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/tickets/${staff_id}`);
      return res.data.data.ticket;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Retrieve single ticket");
    }
  }
);

export const createTicket = createAppAsyncThunk(
  "ticket/createTicket ",
  async (
    createData: {
      user_id: string;
      priority: TicketPriority;
      desc: string;
    },
    thunkAPI
  ) => {
    try {
      await axiosInstance.post(`/tickets/create`, createData);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Create ticket");
    }
  }
);

export const updateTicket = createAppAsyncThunk(
  "ticket/updateTicket ",
  async (
    updateData: {
      ticket_id: string;
      user_id: string;
      priority: TicketPriority;
      desc: string;
    },
    thunkAPI
  ) => {
    try {
      await axiosInstance.post(`/tickets/update`, updateData);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Update ticket");
    }
  }
);
export const closeTicket = createAppAsyncThunk(
  "ticket/closeTicket ",
  async (ticket_id: string, thunkAPI) => {
    try {
      await axiosInstance.post(`/tickets/close/${ticket_id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Close ticket");
    }
  }
);
export const openTicket = createAppAsyncThunk(
  "ticket/openTicket ",
  async (ticket_id: string, thunkAPI) => {
    try {
      await axiosInstance.post(`/tickets/open/${ticket_id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Open ticket");
    }
  }
);
export const reassignTicket = createAppAsyncThunk(
  "ticket/reassignTicket ",
  async (
    {
      ticket_id,
      staff_id,
    }: {
      ticket_id: string;
      staff_id: string;
    },
    thunkAPI
  ) => {
    try {
      await axiosInstance.post(`/tickets/reassign/${ticket_id}/${staff_id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Reassign Ticket");
    }
  }
);

async function mapTicketToStaff(tickets: ITicket[]) {
  const ticketPromises = tickets.map(async (ticket) => {
    const res = await axiosInstance.get(`/user/${ticket.staff_id}`);
    const staff = res.data.data.user;
    return {
      ...ticket,
      staff,
    };
  });

  // Wait for all promises to resolve
  const ticketsWithStaff = await Promise.all(ticketPromises);
  return ticketsWithStaff;
}

export const searchTicket = createAppAsyncThunk(
  "ticket/searchTicket ",
  async (search_id: string, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/tickets/search/${search_id}`);
      const ticketsWithStaff = await mapTicketToStaff(res.data.data.tickets);
      return ticketsWithStaff;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkAPI.rejectWithValue(error.response?.data?.message);
      }
      return thunkAPI.rejectWithValue("Could not Search for Ticket");
    }
  }
);
