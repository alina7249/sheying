<template>
  <div
    :class="[cardClasses, interactiveClasses]"
    @click="onClick"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  className?: string
  hoverEffect?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  hoverEffect: true
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const onClick = (event: MouseEvent) => {
  emit('click', event)
}

// 模拟主题状态
const theme = ref('dark')

// 基础卡片样式
const baseStyles = 'rounded-xl overflow-hidden shadow-sm'

// 根据主题获取背景和边框颜色
const themeStyles = computed(() => 
  theme.value === 'dark' 
    ? 'bg-[#2D3748] border border-[#4A5F8B]' 
    : 'bg-white border border-gray-200'
)

// 组合所有样式
const cardClasses = computed(() => `${baseStyles} ${themeStyles.value} ${props.className}`)

// 如果有点击事件，则添加cursor-pointer
const interactiveClasses = computed(() => emit._events?.click ? 'cursor-pointer' : '')
</script>

<style scoped>
div:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px -5px rgba(74, 95, 139, 0.2);
  transition: all 0.3s ease;
}
</style>
