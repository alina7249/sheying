import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, register as apiRegister } from '../services/api';

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

export type UserRole = 'superAdmin' | 'admin' | 'operator';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export type Theme = 'light' | 'dark';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const adminUser = ref<AdminUser | null>(null);
  const isAdminAuthenticated = ref(false);
  const userRole = ref<UserRole>('operator');
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'dark');

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(username, password);
      const responseData = response.data as any;

      if (response.status === 200 && responseData) {
        const userData = responseData;

        user.value = {
          id: userData.id || `user-${Date.now()}`,
          username: userData.username || username,
          email: userData.email || `${username}@example.com`,
          avatar: userData.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male&sign=92090021266b3aaadfd4d99b36d00763',
          bio: userData.bio || '热爱风光和人像摄影，正在不断学习和进步中',
          joinDate: userData.joinDate || '2023-01-15',
          followers: userData.followers || 0,
          following: userData.following || 0,
          posts: userData.posts || 0
        };
        isAuthenticated.value = true;

        localStorage.setItem('authToken', userData.token || `token_${Date.now()}`);

        return true;
      } else {
        console.error('Login failed:', responseData?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    localStorage.removeItem('authToken');
  };

  const register = async (userAccount: string, password: string, checkPassword: string, userName: string): Promise<boolean> => {
    try {
      const response = await apiRegister(userAccount, password, checkPassword, userName);
      const responseData = response.data as any;

      if (response.status === 200 && responseData) {
        return true;
      } else {
        console.error('Register failed:', responseData?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const setUser = (newUser: User | null) => {
    user.value = newUser;
  };

  const setIsAuthenticated = (value: boolean) => {
    isAuthenticated.value = value;
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await apiLogin(username, password);
      const responseData = response.data as any;

      if (response.status === 200 && responseData) {
        const userData = responseData;

        adminUser.value = {
          id: userData.id || `admin-${Date.now()}`,
          username: userData.username || username,
          email: userData.email || `${username}@example.com`,
          role: (userData.role as UserRole) || 'operator',
          avatar: userData.avatar || 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=admin%20avatar%20professional&sign=b128ffccccb2deff34af58059c3f52df',
        };
        isAdminAuthenticated.value = true;
        userRole.value = adminUser.value.role;

        localStorage.setItem('authToken', userData.token || `token_${Date.now()}`);

        return true;
      } else {
        console.error('Admin login failed:', responseData?.message || 'Unknown error');
        return false;
      }
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const adminLogout = () => {
    adminUser.value = null;
    isAdminAuthenticated.value = false;
    userRole.value = 'operator';
    localStorage.removeItem('authToken');
  };

  const toggleTheme = () => {
    const newTheme = theme.value === 'light' ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    theme.value = newTheme;
  };

  const setTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('theme', newTheme);
    theme.value = newTheme;
  };

  return {
    user,
    isAuthenticated,
    adminUser,
    isAdminAuthenticated,
    userRole,
    theme,
    login,
    logout,
    register,
    setUser,
    setIsAuthenticated,
    adminLogin,
    adminLogout,
    toggleTheme,
    setTheme
  };
});