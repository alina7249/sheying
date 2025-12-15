import { useContext } from 'react';
import { AdminAuthContext } from '../contexts/adminAuthContext';

// 自定义Hook，用于访问管理员认证状态和方法
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  
  return context;
};