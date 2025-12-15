import React, { createContext, ReactNode, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

// 定义用户角色类型
export type UserRole = 'superAdmin' | 'admin' | 'operator';

// 定义管理员用户类型
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
}

// 定义认证上下文类型
interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  userRole: UserRole;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// 创建认证上下文
export const AdminAuthContext = createContext<AdminAuthContextType>({
  isAuthenticated: false,
  user: null,
  userRole: 'operator',
  login: async () => false,
  logout: () => {},
});

// 自定义Hook，用于访问管理员认证上下文
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

// 认证提供者组件
export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // 从localStorage中获取认证状态
    const savedAuth = localStorage.getItem('adminAuthenticated');
    return savedAuth === 'true';
  });
  
  const [user, setUser] = useState<AdminUser | null>(() => {
    // 从localStorage中获取用户信息
    const savedUser = localStorage.getItem('adminUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  // 从用户信息中获取角色，如果没有用户则默认为operator
  const userRole: UserRole = user?.role || 'operator';

  // 登录方法 - 严格确保只有三种管理员账号可以登录
  const login = async (username: string, password: string): Promise<boolean> => {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        // 严格检查是否为指定的三种管理员账号，且密码符合复杂度要求
        if (username === 'admin' && password === 'Admin@123') {
          // 创建超级管理员用户数据
          const adminUser: AdminUser = {
            id: 'admin-001',
            username: 'admin',
            email: 'admin@example.com',
            role: 'superAdmin',
            avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=admin%20avatar%20professional&sign=b128ffccccb2deff34af58059c3f52df',
          };
          
          setUser(adminUser);
          setIsAuthenticated(true);
          
          // 保存认证状态到localStorage
          localStorage.setItem('adminAuthenticated', 'true');
          localStorage.setItem('adminUser', JSON.stringify(adminUser));
          
          resolve(true);
        } else if (username === 'editor' && password === 'Editor@123') {
          // 创建普通管理员用户数据
          const editorUser: AdminUser = {
            id: 'admin-002',
            username: 'editor',
            email: 'editor@example.com',
            role: 'admin',
            avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=content%20editor%20avatar&sign=f05bddb40e27ccc2bc7ee3046b1f6351',
          };
          
          setUser(editorUser);
          setIsAuthenticated(true);
          
          // 保存认证状态到localStorage
          localStorage.setItem('adminAuthenticated', 'true');
          localStorage.setItem('adminUser', JSON.stringify(editorUser));
          
          resolve(true);
        } else if (username === 'operator' && password === 'Operator@123') {
          // 创建运营人员用户数据
          const operatorUser: AdminUser = {
            id: 'admin-003',
            username: 'operator',
            email: 'operator@example.com',
            role: 'operator',
            avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=operator%20avatar&sign=e010c60043f59fb2d20ef9e3c734dcd3',
          };
          
          setUser(operatorUser);
          setIsAuthenticated(true);
          
          // 保存认证状态到localStorage
          localStorage.setItem('adminAuthenticated', 'true');
          localStorage.setItem('adminUser', JSON.stringify(operatorUser));
          
          resolve(true);
        } else {
          // 严格限制：只有上述三个账号可以登录管理后台
          resolve(false);
        }
      }, 500);
    });
  };
  
  // 登出方法
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // 从localStorage移除认证信息
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminUser');
  };

  // 监听localStorage变化，处理多标签页登出情况
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminAuthenticated') {
        setIsAuthenticated(e.newValue === 'true');
      } else if (e.key === 'adminUser') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: AdminAuthContextType = {
    isAuthenticated,
    user,
    userRole,
    login,
    logout,
  };

  return React.createElement(
    AdminAuthContext.Provider,
    { value },
    children
  );
};