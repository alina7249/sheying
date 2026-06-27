<template>
  <Teleport to="body">
    <Transition name="dropdown">
      <div v-if="isOpen" class="fixed inset-0 z-50">
        <div
          class="absolute inset-0 bg-black/50"
          @click="onClose"
        />

        <div
          class="absolute top-16 right-4 w-[320px] max-w-[90%] bg-[#1E2532] border border-[#4A5F8B] rounded-lg shadow-lg overflow-hidden z-50 profile-dropdown-container"
        >
          <div class="px-6 py-4 border-b border-[#4A5F8B]">
            <div class="flex items-center space-x-4">
              <div class="w-16 h-16 rounded-full border-2 border-[#4A5F8B] overflow-hidden shadow-md">
                <img
                  :src="avatarSrc"
                  alt="User avatar"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="flex-1">
                <h2 class="text-lg font-bold text-[#F5F7FA] mb-1">{{ username }}</h2>
                <p class="text-[#B8C6D8]/70 text-sm">风光/人像双题材创作者</p>

                <div class="mt-2">
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-[#4A5F8B] text-xs">{{ level }} LV.{{ levelNum }}</span>
                    <span class="text-[#4A5F8B] text-xs">{{ progress }}/{{ progressMax }}成长值</span>
                  </div>
                  <div class="w-full h-1.5 bg-[#2D3748] rounded-full overflow-hidden">
                    <div
                      class="h-full bg-[#4A5F8B]"
                      :style="{ width: `${progressPercentage}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4 bg-[#4A5F8B]/20 text-[#B8C6D8] text-xs font-medium py-1.5 px-3 rounded-full text-center border border-[#4A5F8B]">
              银河会员·年卡（剩余128天）
            </div>
          </div>

          <div class="grid grid-cols-3 gap-1 px-4 py-3 bg-[#2D3748]">
            <div class="text-center">
              <p class="text-[#B8C6D8]/70 text-xs mb-1">作品</p>
              <p class="text-[#F5F7FA] font-bold text-lg">{{ stats.posts }}</p>
            </div>
            <div class="text-center">
              <p class="text-[#B8C6D8]/70 text-xs mb-1">获赞</p>
              <p class="text-[#F5F7FA] font-bold text-lg">{{ stats.likes }}</p>
            </div>
            <div class="text-center">
              <p class="text-[#B8C6D8]/70 text-xs mb-1">收藏</p>
              <p class="text-[#F5F7FA] font-bold text-lg">{{ stats.collections }}</p>
            </div>
          </div>

          <div class="max-h-[300px] overflow-y-auto">
            <router-link
              v-for="item in profileMenuItems"
              :key="item.id"
              :to="item.link"
              @click="onClose"
              class="flex items-center py-3 px-6 text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
            >
              <i :class="['fa-solid', item.icon, 'mr-3 text-[#4A5F8B]']"></i>
              <span>{{ item.text }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
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
  avatarSrc: string;
}>();

const progressPercentage = computed(() => (props.progress / props.progressMax) * 100);

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (props.isOpen && !target.closest('.profile-dropdown-container')) {
    props.onClose();
  }
};

onMounted(() => {
  if (props.isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}

.dropdown-enter-from > div:last-child,
.dropdown-leave-to > div:last-child {
  transform: translateY(-20px);
}
</style>