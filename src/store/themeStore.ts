import { create } from 'zustand';

// 主题类型
type Theme = 'light' | 'dark';

// 主题状态接口
interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// 创建主题状态管理
export const useThemeStore = create<ThemeState>((set) => {
  // 从本地存储获取主题，如果没有则使用默认主题
  const savedTheme = localStorage.getItem('theme') as Theme || 'dark';
  
  // 初始化时设置主题到文档
  const initializeTheme = () => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  };
  
  initializeTheme();
  
  return {
    theme: savedTheme,
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        // 更新文档类
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        // 保存到本地存储
        localStorage.setItem('theme', newTheme);
        return { theme: newTheme };
      });
    },
    setTheme: (theme) => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
      set({ theme });
    }
  };
});