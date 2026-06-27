<template>
  <>
    <div v-if="avatarSrc" class="w-16 h-16 rounded-full border-2 border-[#4A5F8B] overflow-hidden shadow-md mb-3">
      <img
        :src="avatarSrc"
        alt="User avatar"
        class="w-full h-full object-cover"
      />
    </div>

    <h2 class="text-lg font-bold text-[#F5F7FA] mb-1">{{ username }}</h2>
    <p class="text-[#B8C6D8]/70 text-sm mb-3">风光/人像双题材创作者</p>

    <div class="bg-[#2D3748] p-3 rounded-lg mb-4">
      <div class="flex justify-between items-center mb-1">
        <span class="text-[#4A5F8B] text-xs">{{ level }} LV.{{ levelNum }}</span>
        <span class="text-[#4A5F8B] text-xs">{{ progress }}/{{ progressMax }}成长值</span>
      </div>
      <div class="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
        <div
          class="h-full bg-[#4A5F8B]"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <div class="bg-[#4A5F8B]/20 text-[#B8C6D8] text-xs font-medium py-1.5 px-3 rounded-full text-center border border-[#4A5F8B] mb-4">
      银河会员·年卡（剩余128天）
    </div>

    <div class="grid grid-cols-3 gap-1 px-4 py-3 bg-[#2D3748] rounded-lg">
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
  </>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface ProfileStats {
  posts: number;
  likes: number;
  collections: number;
}

const props = defineProps<{
  username: string;
  level: string;
  levelNum: number;
  progress: number;
  progressMax: number;
  stats: ProfileStats;
  avatarSrc?: string;
}>();

const progressPercentage = computed(() => (props.progress / props.progressMax) * 100);
</script>