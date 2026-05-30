<template>
  <div class="min-h-screen bg-[#1E2532]">
    <div class="bg-[#2D3748] border-b border-[#4A5F8B] sticky top-0 z-40">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-1">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="handleTabChange(tab.id)"
              :class="['flex items-center px-6 py-4 font-medium transition-all border-b-2 -mb-px', activeTab === tab.id ? 'border-[#4A5F8B] text-[#F5F7FA]' : 'border-transparent text-[#B8C6D8] hover:text-[#F5F7FA]']"
            >
              <i :class="['fa-solid', tab.icon, 'mr-2']"></i>
              <span>{{ tab.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="tab-fade" mode="out-in">
      <div :key="activeTab">
        <EquipmentDatabase v-if="activeTab === 'database'" />
        <EquipmentReview v-if="activeTab === 'review'" />
        <EquipmentTrade v-if="activeTab === 'trade'" />
        <EquipmentLibrary v-if="activeTab === 'library'" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInteraction } from '../composables/useInteraction'
import EquipmentDatabase from './EquipmentDatabase.vue'
import EquipmentReview from './EquipmentReview.vue'
import EquipmentTrade from './EquipmentTrade.vue'
import EquipmentLibrary from './EquipmentLibrary.vue'

const route = useRoute()
const router = useRouter()
const { showInfo } = useInteraction()

const tabs = [
  { id: 'database', name: '器材库', icon: 'fa-database' },
  { id: 'review', name: '专业测评', icon: 'fa-star' },
  { id: 'trade', name: '二手交易', icon: 'fa-shopping-cart' },
  { id: 'library', name: '资料库', icon: 'fa-book-open' },
]

const activeTab = ref('database')

watch(
  () => route.path,
  (path) => {
    const pathParts = path.split('/')
    const tabId = pathParts[2] || 'database'
    if (tabs.some((tab) => tab.id === tabId)) {
      activeTab.value = tabId
    } else {
      activeTab.value = 'database'
    }
  },
  { immediate: true }
)

const handleTabChange = (tabId: string) => {
  const tab = tabs.find(t => t.id === tabId)
  activeTab.value = tabId
  showInfo(`已切换到「${tab?.name || tabId}」`)
  if (tabId === 'database') {
    router.push('/equipment')
  } else {
    router.push(`/equipment/${tabId}`)
  }
}
</script>

<style scoped>
.tab-fade-enter-active,
.tab-fade-leave-active {
  transition: all 0.3s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>