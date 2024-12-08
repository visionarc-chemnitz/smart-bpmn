"use client";

import { UserContextValue, UserProviderProps } from "@/types/user/user";
import React, { createContext, useContext } from "react";

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const UserProvider = ({ user, children }: UserProviderProps) => {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context.user;
};
