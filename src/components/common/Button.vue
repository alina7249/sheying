<template>
  <button
    :type="type"
    @click="onClick"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    :class="[baseStyles, sizeStyles[size], variantStyles[variant], disabledStyles, className]"
  >
    <template v-if="loading">
      <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>
      <span>{{ defaultSlot }}</span>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/store/authStore'
import { storeToRefs } from 'pinia'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  className: '',
  disabled: false,
  type: 'button',
  loading: false,
  ariaLabel: ''
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
  emit('click', event)
}

const authStore = useAuthStore()
const { theme } = storeToRefs(authStore)

// Base styles with accessibility and motion support
const baseStyles = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1E2532] active:scale-95 touch-action:manipulation'

// Size styles
const sizeStyles: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
}

// 根据主题获取变体样式
const variantStyles = computed(() => {
  if (theme.value === 'dark') {
    return {
      primary: 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93] border border-[#4A5F8B] shadow-sm hover:shadow-md focus-visible:ring-[#4A5F8B]',
      secondary: 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] border border-[#4A5F8B] focus-visible:ring-[#4A5F8B]',
      outline: 'bg-transparent text-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] border border-[#4A5F8B] focus-visible:ring-[#4A5F8B]',
      danger: 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#F56565] hover:text-[#F5F7FA] border border-[#F56565] focus-visible:ring-[#F56565]',
      success: 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#48BB78] hover:text-[#F5F7FA] border border-[#48BB78] focus-visible:ring-[#48BB78]'
    }
  } else {
    return {
      primary: 'bg-[#63B3ED] text-white hover:bg-[#4299E1] border border-[#63B3ED] shadow-sm hover:shadow-md focus-visible:ring-[#63B3ED]',
      secondary: 'bg-white text-[#1E2532] hover:bg-gray-100 border border-gray-300 focus-visible:ring-[#63B3ED]',
      outline: 'bg-transparent text-[#63B3ED] hover:bg-blue-50 hover:text-[#4299E1] border border-[#63B3ED] focus-visible:ring-[#63B3ED]',
      danger: 'bg-white text-[#E53E3E] hover:bg-red-50 border border-red-300 focus-visible:ring-[#E53E3E]',
      success: 'bg-white text-[#48BB78] hover:bg-green-50 border border-green-300 focus-visible:ring-[#48BB78]'
    }
  }
})

// Disabled styles
const disabledStyles = computed(() => props.disabled || props.loading ? 'opacity-60 cursor-not-allowed active:scale-100' : '')
</script>
