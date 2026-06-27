import { ref } from 'vue'

interface ToastMessage {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

const toasts = ref<ToastMessage[]>([])
let toastId = 0

function addToast(type: 'success' | 'error' | 'info', message: string) {
  const id = ++toastId
  toasts.value.push({ id, type, message })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}

export const toast = {
  success: (message: string) => addToast('success', message),
  error: (message: string) => addToast('error', message),
  info: (message: string) => addToast('info', message),
}

export function useToast() {
  return { toasts, toast }
}