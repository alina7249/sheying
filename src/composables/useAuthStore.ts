import { ref, readonly } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'dark')

function setTheme(t: Theme) {
  theme.value = t
  localStorage.setItem('theme', t)
}

function toggleTheme() {
  const newTheme = theme.value === 'light' ? 'dark' : 'light'
  setTheme(newTheme)
}

export function useAuthStore() {
  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
  }
}