import React, { createContext, ReactNode } from "react";
import { useAuthStore } from '../store/authStore';

// 用户类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  followers: number;
  following: number;
  posts: number;
}

// 认证上下文类型
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<boolean>;
}

// 创建认证上下文
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 直接使用authStore获取认证状态和方法，避免循环依赖
  const {
    isAuthenticated,
    user,
    setIsAuthenticated,
    setUser,
    login,
    logout,
    register
  } = useAuthStore();

  const value: AuthContextType = {
    isAuthenticated,
    user,
    setIsAuthenticated,
    setUser,
    login,
    logout,
    register,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
};