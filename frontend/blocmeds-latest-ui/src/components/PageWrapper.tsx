import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper = ({ children, className = "" }: PageWrapperProps) => {
  return (
    <div className={`min-h-screen pb-24 pt-6 px-4 animate-fade-in-up ${className}`}>
      {children}
    </div>
  );
};
