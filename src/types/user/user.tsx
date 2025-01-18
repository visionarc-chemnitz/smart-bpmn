export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
  STAKEHOLDER = 'STAKEHOLDER',
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  avatar: string;
  role?: UserRole;
  organizationId: string;
}

export interface UserContextValue {
  user: User;
}

export interface UserProviderProps {
  user: User;
  children: React.ReactNode;
}