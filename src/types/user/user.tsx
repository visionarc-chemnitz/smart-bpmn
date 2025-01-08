export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface UserContextValue {
  user: User; 
}

export interface UserProviderProps {
  user: User;
  children: React.ReactNode;
}