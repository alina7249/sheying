<template>
  <div :class="['flex', wrapperClass, className]">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="handleTabChange(tab.id)"
      :class="getTabClass(tab.id)"
    >
      <span>{{ tab.label }}</span>
      <span v-if="tab.count !== undefined" class="ml-1 text-xs opacity-80">({tab.count})</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TabItem {
  id: string
  label: string
  count?: number
}

interface Props {
  tabs: TabItem[]
  activeTab: string
  variant?: 'primary' | 'secondary'
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  className: ''
})

const emit = defineEmits<{
  (e: 'tab-change', tabId: string): void
}>()

const handleTabChange = (tabId: string) => {
  emit('tab-change', tabId)
}

const wrapperClass = computed(() => 
  props.variant === 'primary'
    ? 'bg-[#2D3748] rounded-xl p-1 border border-[#4A5F8B]'
    : 'border-b border-[#4A5F8B]'
)

const getTabClass = (tabId: string) => {
  const isActive = props.activeTab === tabId
  
  if (isActive) {
    return props.variant === 'primary'
      ? 'flex items-center py-3 px-4 text-center font-medium bg-[#4A5F8B] text-[#F5F7FA] rounded-lg transition-colors'
      : 'flex items-center py-3 px-4 text-center font-medium text-[#F5F7FA] border-b-2 border-[#4A5F8B] transition-colors'
  }
  
  return props.variant === 'primary'
    ? 'flex items-center py-3 px-4 text-center font-medium bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors'
    : 'flex items-center py-3 px-4 text-center font-medium text-[#B8C6D8]/70 hover:text-[#F5F7FA] transition-colors'
}
</script>
