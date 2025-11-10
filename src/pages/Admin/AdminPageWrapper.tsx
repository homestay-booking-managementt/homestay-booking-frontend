import { ReactNode } from 'react';
import { adminCommonStyles } from './AdminCommonStyles';

interface AdminPageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const AdminPageWrapper = ({ children, className = '' }: AdminPageWrapperProps) => {
  return (
    <>
      <div className={`admin-page ${className}`}>
        {children}
      </div>
      <style>{adminCommonStyles}</style>
    </>
  );
};
