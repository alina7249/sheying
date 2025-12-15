import { useContext } from 'react';
import { AuthContext } from '../contexts/authContext';

// 自定义 hook 用于访问认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // 确保在正确的上下文中使用
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// 检查认证状态的工具函数
export const checkAuthStatus = (): boolean => {
  const token = localStorage.getItem('authToken');
  const authData = localStorage.getItem('auth-storage');
  
  // 如果存在token或认证数据，则认为已登录
  return !!(token || (authData && JSON.parse(authData).isAuthenticated));
};