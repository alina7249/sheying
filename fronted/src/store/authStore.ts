import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';

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
export type MemberLevel = 'free' | 'basic' | 'pro' | 'vip';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const adminUser = ref<AdminUser | null>(null);
  const isAdminAuthenticated = ref(false);
  const userRole = ref<UserRole>('operator');
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'dark');
  const isMember = ref(false);
  const memberLevel = ref<MemberLevel>('free');

  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('authToken');
  if (storedUser && storedToken) {
    try {
      const parsed = JSON.parse(storedUser);
      user.value = parsed;
      isAuthenticated.value = true;
      isMember.value = true;
      memberLevel.value = (parsed.memberLevel as MemberLevel) || 'free';
    } catch {
      localStorage.removeItem('user');
    }
  }

  const login = async (userAccount: string, password: string): Promise<boolean> => {
    try {
      const response: any = await apiLogin(userAccount, password);

      if (response && response.code === 0 && response.data) {
        const userData = response.data;

        user.value = {
          id: userData.id?.toString() || `user-${Date.now()}`,
          username: userData.userName || userAccount,
          email: userData.email || `${userAccount}@example.com`,
          avatar: userData.userAvatar || 'https://picsum.photos/400/400?random=avatar',
          bio: userData.userProfile || '热爱摄影的创作者',
          joinDate: userData.createTime ? new Date(userData.createTime).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          followers: 0,
          following: 0,
          posts: 0
        };
        isAuthenticated.value = true;
        isMember.value = true;
        memberLevel.value = 'free';

        const token = response.data.token || userData.token;
        if (!token) {
          throw new Error('登录失败：未获取到有效凭证');
        }
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user.value));

        if (userData.userRole === 'admin' || userData.userRole === 'superAdmin') {
          adminUser.value = {
            id: user.value.id,
            username: user.value.username,
            email: user.value.email,
            role: userData.userRole as UserRole,
            avatar: user.value.avatar,
          };
          isAdminAuthenticated.value = true;
          userRole.value = adminUser.value.role;
        }

        return true;
      } else {
        throw new Error(response?.message || '登录失败');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
    adminUser.value = null;
    isAdminAuthenticated.value = false;
    userRole.value = 'operator';
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  const upgradeMembership = (level: MemberLevel) => {
    memberLevel.value = level;
    isMember.value = true;
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      parsed.memberLevel = level;
      localStorage.setItem('user', JSON.stringify(parsed));
    }
  };

  const register = async (userAccount: string, password: string, checkPassword: string, userName: string): Promise<boolean> => {
    try {
      const response: any = await apiRegister(userAccount, password, checkPassword, userName);

      if (response && response.code === 0 && response.data) {
        return true;
      } else {
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
      const response: any = await apiLogin(username, password);

      if (response && response.code === 0 && response.data) {
        const userData = response.data;

        if (userData.userRole === 'admin' || userData.userRole === 'superAdmin') {
          const token = response.data.token || userData.token;
          if (!token) {
            throw new Error('登录失败：未获取到有效凭证');
          }

          adminUser.value = {
            id: userData.id?.toString() || `admin-${Date.now()}`,
            username: userData.userName || username,
            email: userData.email || `${username}@example.com`,
            role: (userData.userRole as UserRole) || 'operator',
            avatar: userData.userAvatar || 'https://picsum.photos/400/400?random=admin',
          };
          isAdminAuthenticated.value = true;
          userRole.value = adminUser.value.role;

          localStorage.setItem('authToken', token);

          return true;
        }
        throw new Error('非管理员账号无法登录后台');
      } else {
        throw new Error(response?.message || '登录失败');
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      throw error;
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

  const fetchCurrentUser = async (): Promise<boolean> => {
    try {
      const response: any = await getCurrentUser();
      if (response && response.code === 0 && response.data) {
        const userData = response.data;
        user.value = {
          id: userData.id?.toString() || user.value?.id || '',
          username: userData.userName || user.value?.username || '',
          email: userData.email || user.value?.email || '',
          avatar: userData.userAvatar || user.value?.avatar || '',
          bio: userData.userProfile || user.value?.bio || '',
          joinDate: userData.createTime ? new Date(userData.createTime).toISOString().split('T')[0] : user.value?.joinDate || '',
          followers: user.value?.followers || 0,
          following: user.value?.following || 0,
          posts: user.value?.posts || 0
        };
        isAuthenticated.value = true;
        localStorage.setItem('user', JSON.stringify(user.value));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Fetch current user error:', error);
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    adminUser,
    isAdminAuthenticated,
    userRole,
    theme,
    isMember,
    memberLevel,
    login,
    logout,
    register,
    upgradeMembership,
    setUser,
    setIsAuthenticated,
    adminLogin,
    adminLogout,
    toggleTheme,
    setTheme,
    fetchCurrentUser,
  };
});
