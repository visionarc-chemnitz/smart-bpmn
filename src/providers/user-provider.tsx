"use client";

import React, { createContext, useContext } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface UserContextValue {
  user: User; 
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

interface UserProviderProps {
  user: User;
  children: React.ReactNode;
}

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
