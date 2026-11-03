import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  getAllTickets,
  getSingleTicket,
  createTicket,
  updateTicket,
  closeTicket,
  openTicket,
  reassignTicket,
  searchTicket,
} from "./ticketThunk";
import { ITicket } from "@/types/ticket";

interface FaqSliceState {
  [key: string]: unknown;
  allTickets: ITicket[] | null;
  filteredTickets: ITicket[] | null;
  selectedTicket: ITicket | null;
  isSearching: false;
  currentPage: number;
  isLoading: boolean;
  limit: number;
  numberOfPages: number;
  total: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

interface UpdateStatePayload {
  name: keyof FaqSliceState;
  value: unknown;
}

const initialState: FaqSliceState = {
  allTickets: null,
  filteredTickets: null,
  selectedTicket: null,
  isSearching: false,
  currentPage: 1,
  isLoading: false,
  limit: 10,
  numberOfPages: 0,
  total: 1,
  nextPageUrl: null,
  prevPageUrl: null,
};

const FaqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    updateTicketStateValues: (
      state,
      action: PayloadAction<UpdateStatePayload>
    ) => {
      state[action.payload.name] = action.payload.value;
    },
    selectTicketPage: (state, action) => {
      if (action.payload <= state.numberOfPages && action.payload >= 0) {
        state.currentPage = action.payload;
      }
    },
    moveNextTicketPage: (state) => {
      if (state.currentPage < state.numberOfPages) {
        state.currentPage += 1;
      }
    },
    movePrevTicketPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllTickets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.allTickets = action.payload.tickets;
        state.currentPage = action.payload.currentPage;
        state.total = action.payload.total;
        state.numberOfPages = action.payload.numberOfPages;
        state.limit = action.payload.limit;
        state.nextPageUrl = action.payload.nextPageUrl;
        state.prevPageUrl = action.payload.prevPageUrl;
        state.isLoading = false;
      })
      .addCase(getAllTickets.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getSingleTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleTicket.fulfilled, (state, action) => {
        state.selectedTicket = action.payload;
        state.isLoading = false;
      })
      .addCase(getSingleTicket.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createTicket.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(updateTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateTicket.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(closeTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(closeTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(closeTicket.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(openTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(openTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(openTicket.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(reassignTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(reassignTicket.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(reassignTicket.rejected, (state) => {
        state.isLoading = false;
      })

      .addCase(searchTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchTicket.fulfilled, (state, action) => {
        state.filteredTickets = action.payload;
        state.isLoading = false;
      })
      .addCase(searchTicket.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  updateTicketStateValues,
  selectTicketPage,
  moveNextTicketPage,
  movePrevTicketPage,
} = FaqSlice.actions;

export default FaqSlice.reducer;
