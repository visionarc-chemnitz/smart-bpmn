interface DashboardLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: DashboardLayoutProps) => {
  return (
    // TODO: Add a layout for the auth pages
    <div className="w-full h-full">
      {children}
    </div>
  );
};

export default AuthLayout;
