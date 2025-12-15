import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

// 认证状态接口
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, phone: string, password: string) => Promise<boolean>;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
}

// 创建认证状态管理
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      
      // 登录方法
      login: async (username: string, password: string): Promise<boolean> => {
        try {
          // 模拟API调用
          return new Promise((resolve) => {
            setTimeout(() => {
               // 模拟成功登录 - 检查是否为默认admin用户
  // 注意：实际环境中应使用更安全的密码验证方式
  // 根据不同管理员角色验证密码
   if ((username === 'admin' && password === 'Admin@123') || 
      (username === 'editor' && password === 'Editor@123') ||
      (username === 'operator' && password === 'Operator@123')) {
                // 创建管理员用户数据
    // 根据不同的用户名设置对应的角色信息
    let roleBio = '影研社管理员';
    if (username === 'editor') {
      roleBio = '影研社内容编辑';
    } else if (username === 'operator') {
      roleBio = '影研社运营人员';
    }
    
    const adminUser: User = {
      id: username === 'admin' ? 'admin-1' : username === 'editor' ? 'admin-2' : 'admin-3',
      username: username,
      email: `${username}@example.com`,
      avatar: username === 'admin' 
        ? 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=admin%20avatar%20professional&sign=b128ffccccb2deff34af58059c3f52df'
        : username === 'editor'
        ? 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=content%20editor%20avatar&sign=f05bddb40e27ccc2bc7ee3046b1f6351'
        : 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=operator%20avatar&sign=e010c60043f59fb2d20ef9e3c734dcd3',
      bio: roleBio,
      joinDate: '2022-01-01',
      followers: 999,
      following: 100,
      posts: 50
    };
                
                set({ 
                  user: adminUser,
                  isAuthenticated: true 
                });
                
                // 保存认证令牌到localStorage
                localStorage.setItem('authToken', `token_${Date.now()}`);
                
                resolve(true);
              } else if (username && password) {
                // 创建普通用户数据
                const mockUser: User = {
                  id: `user-${Date.now()}`,
                  username: username,
                  email: `${username}@example.com`,
                  avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male&sign=92090021266b3aaadfd4d99b36d00763',
                  bio: '热爱风光和人像摄影，正在不断学习和进步中',
                  joinDate: '2023-01-15',
                  followers: 123,
                  following: 45,
                  posts: 28
                };
                
                set({ 
                  user: mockUser,
                  isAuthenticated: true 
                });
                
                // 保存认证令牌到localStorage
                localStorage.setItem('authToken', `token_${Date.now()}`);
                
                resolve(true);
              } else {
                resolve(false);
              }
            }, 500);
          });
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },
      
      // 登出方法
      logout: () => {
        set({ 
          user: null,
          isAuthenticated: false 
        });
        
        // 从localStorage移除认证信息
        localStorage.removeItem('authToken');
      },
      
      // 注册方法
      register: async (username: string, phone: string, password: string): Promise<boolean> => {
        // 模拟API调用
        return new Promise((resolve) => {
          setTimeout(() => {
            // 模拟成功注册
            if (username && phone && password) {
              resolve(true);
            } else {
              resolve(false);
            }
          }, 500);
        });
      },
      
      // 设置用户信息
      setUser: (user: User | null) => {
        set({ user });
      },
      
      // 设置认证状态
      setIsAuthenticated: (value: boolean) => {
        set({ isAuthenticated: value });
      }
    }),
    {
      name: 'auth-storage', // 本地存储的键名
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }), // 只持久化需要的状态
    }
  )
);