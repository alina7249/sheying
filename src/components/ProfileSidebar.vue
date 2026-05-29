<template>
  <Teleport to="body">
    <Transition name="sidebar">
      <div v-if="isOpen" class="fixed inset-0 z-50">
        <div
          class="absolute inset-0 bg-black/50"
          @click="onClose"
        />

        <div
          class="absolute top-0 right-0 h-full w-[320px] max-w-[90%] bg-[#1E2532] border-l border-[#4A5F8B] overflow-y-auto"
        >
          <div class="flex justify-end p-4">
            <button
              @click="onClose"
              class="w-8 h-8 rounded-full flex items-center justify-center text-[#F5F7FA] hover:bg-[#2D3748] transition-colors"
            >
              <i class="fa-solid fa-times"></i>
            </button>
          </div>

          <div class="px-6 mb-6">
            <div class="text-center mb-4">
              <div class="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-[#4A5F8B]">
                <img
                  src="https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc"
                  alt="User avatar"
                  class="w-full h-full object-cover"
                />
              </div>
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-1">{{ username }}</h2>
              <p class="text-[#B8C6D8]/70 text-sm">风光/人像双题材创作者</p>
            </div>

            <div class="bg-[#2D3748] rounded-lg p-4 mb-4">
              <div class="flex justify-between items-center mb-2">
                <span class="text-[#4A5F8B] text-sm">{{ level }} LV.{{ levelNum }}</span>
                <span class="text-[#4A5F8B] text-xs">{{ progress }}/{{ progressMax }}成长值</span>
              </div>
              <div class="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                <div
                  class="h-full bg-[#4A5F8B]"
                  :style="{ width: `${progressPercentage}%` }"
                ></div>
              </div>
            </div>

            <div class="bg-[#4A5F8B] text-[#F5F7FA] text-sm font-medium py-2 px-4 rounded-full text-center border border-[#4A5F8B]">
              银河会员·年卡（剩余128天）
            </div>
          </div>

          <div class="grid grid-cols-3 gap-1 px-6 mb-6">
            <div class="bg-[#2D3748] rounded-lg p-3 text-center">
              <p class="text-[#B8C6D8] text-sm mb-1">作品</p>
              <p class="text-[#F5F7FA] font-bold text-lg">{{ stats.posts }}</p>
            </div>
            <div class="bg-[#2D3748] rounded-lg p-3 text-center">
              <p class="text-[#B8C6D8] text-sm mb-1">获赞</p>
              <p class="text-[#F5F7FA] font-bold text-lg">{{ stats.likes }}</p>
            </div>
            <div class="bg-[#2D3748] rounded-lg p-3 text-center">
              <p class="text-[#B8C6D8] text-sm mb-1">收藏</p>
              <p class="text-[#F5F7FA] font-bold text-lg">{{ stats.collections }}</p>
            </div>
          </div>

          <div class="px-4">
            <router-link
              v-for="item in profileMenuItems"
              :key="item.id"
              :to="item.link"
              @click="onClose"
              :class="['flex items-center py-3 px-4 mb-1 rounded-lg transition-colors', item.id === 'center' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]']"
            >
              <i :class="['fa-solid', item.icon, 'mr-3']"></i>
              <span>{{ item.text }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { profileMenuItems } from '../lib/menuConfig';

interface ProfileStats {
  posts: number;
  likes: number;
  collections: number;
}

const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
  username: string;
  level: string;
  levelNum: number;
  progress: number;
  progressMax: number;
  stats: ProfileStats;
}>();

const progressPercentage = computed(() => (props.progress / props.progressMax) * 100);
</script>

<style scoped>
.sidebar-enter-active,
.sidebar-leave-active {
  transition: all 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}

.sidebar-enter-from > div:last-child,
.sidebar-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>