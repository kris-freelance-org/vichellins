"use client";

import { store } from "@/lib/redux/store";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Provider } from "react-redux";
import { Toaster } from "../ui/Toaster";
import ProductFileContextProvider from "@/context/productFile";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ProductFileContextProvider>{children}</ProductFileContextProvider>
      </Provider>
      <Toaster />
    </SessionProvider>
  );
};

export default AppProvider;
