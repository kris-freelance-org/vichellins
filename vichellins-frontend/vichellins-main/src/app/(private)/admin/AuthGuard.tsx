"use client";

import PageLoader from "@/components/shared/PageLoader";

import { useSession } from "next-auth/react";
import React, { FC, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  const { status, data } = useSession();

  if (status === "unauthenticated") {
    // Redirect to login page if unauthenticated
    window.location.href = "/login";
    return null; // Prevent rendering children while redirecting
  } else if (status === "authenticated" && data.user) {
    return children
  }
  else return <PageLoader />;
};

export default AuthGuard;
