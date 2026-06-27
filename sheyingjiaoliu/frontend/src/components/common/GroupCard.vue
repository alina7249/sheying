<template>
  <div :class="['bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B]', className]">
    <div class="relative h-32">
      <img
        :src="coverImage"
        :alt="name"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      <div class="absolute bottom-3 left-3">
        <span :class="['px-2 py-1 rounded-full text-xs', categoryClass]">
          {{ category }}
        </span>
      </div>
    </div>
    
    <div class="p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-semibold text-[#F5F7FA]">{{ name }}</h3>
        <span class="text-sm text-[#B8C6D8]">{{ memberCount }} 成员</span>
      </div>
      
      <p class="text-sm text-[#B8C6D8] mb-4 line-clamp-2">{{ description }}</p>
      
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-1">
          <div
            v-for="member in members"
            :key="member.id"
            :class="['w-8 h-8 rounded-full border-2', memberBorderClass, 'overflow-hidden']"
            :title="member.name"
          >
            <img :src="member.avatar" :alt="member.name" class="w-full h-full object-cover" />
          </div>
          <span v-if="memberCount > 4" class="w-8 h-8 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center text-xs">
            +{{ memberCount - 4 }}
          </span>
        </div>
        
        <button :class="['px-3 py-1 rounded-lg text-sm font-medium transition-colors', buttonClass]">
          {{ isJoined ? '已加入' : '加入' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Member {
  id: string
  name: string
  avatar: string
}

interface Props {
  name: string
  description: string
  coverImage: string
  category: string
  memberCount: number
  members: Member[]
  isJoined?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  isJoined: false,
  className: ''
})

const categoryClass = computed(() => {
  const categoryMap: Record<string, string> = {
    '摄影技巧': 'bg-blue-500/20 text-blue-400',
    '器材讨论': 'bg-purple-500/20 text-purple-400',
    '作品分享': 'bg-green-500/20 text-green-400',
    '活动组织': 'bg-orange-500/20 text-orange-400'
  }
  return categoryMap[props.category] || 'bg-gray-500/20 text-gray-400'
})

const memberBorderClass = computed(() => 'border-[#2D3748]')

const buttonClass = computed(() => {
  if (props.isJoined) {
    return 'bg-[#4A5F8B]/20 text-[#4A5F8B] border border-[#4A5F8B]'
  }
  return 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]'
})
</script>
