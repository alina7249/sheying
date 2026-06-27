<template>
  <div :class="['bg-[#2D3748] rounded-xl p-5 border border-[#4A5F8B]', className]">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-medium text-[#F5F7FA] flex items-center">
        <i :class="['fa-solid', icon, 'text-[#4A5F8B] mr-2']"></i>
        {{ title }}
      </h3>
      <template v-if="actionText && !onAction">
        <button @click="handleAction" class="text-xs text-[#4A5F8B] hover:text-[#B8C6D8]">
          {{ actionText }}
        </button>
      </template>
    </div>
    
    <p v-if="description" class="text-xs text-[#B8C6D8]/70 mb-4">{{ description }}</p>
    
    <div class="flex justify-between items-end">
      <div>
        <div class="text-2xl font-bold text-[#F5F7FA]">{{ value }}</div>
        <template v-if="trend && trendValue">
          <div :class="['flex items-center mt-1 text-xs', trendClass]">
            <i :class="['fa-solid', trendIcon]"></i>
            <span class="ml-1">{{ trendValue }}</span>
          </div>
        </template>
      </div>
      
      <template v-if="onAction">
        <button @click="handleAction" class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-xs hover:bg-[#6B7C93] transition-colors">
          {{ actionText || '查看' }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  icon: string
  value: number | string
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  actionText?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

const emit = defineEmits<{
  (e: 'action'): void
}>()

const handleAction = () => {
  emit('action')
}

const trendClass = computed(() => {
  if (props.trend === 'up') return 'text-green-500'
  if (props.trend === 'down') return 'text-red-500'
  return 'text-gray-400'
})

const trendIcon = computed(() => {
  if (props.trend === 'up') return 'fa-arrow-up'
  if (props.trend === 'down') return 'fa-arrow-down'
  return 'fa-minus'
})
</script>
