<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">摄影比赛</h1>
          <p class="text-[#6B7C93]">参加精彩的摄影比赛，展示你的作品</p>
        </div>
        <button @click="handleCreate" class="px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors flex items-center gap-2">
          <i class="fa-solid fa-plus"></i>
          <span>创建比赛</span>
        </button>
      </div>

      <div class="mb-6 space-y-4">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索摄影比赛..."
            class="w-full px-4 py-3 pl-12 bg-[#1E2532] border border-[#4A5F8B] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#6B7C93]"
          />
          <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="status in ['全部', '进行中', '即将开始', '已结束']"
            :key="status"
            @click="filterStatus = status"
            :class="['px-4 py-2 rounded-lg text-sm transition-colors', filterStatus === status ? 'bg-[#4A5F8B] text-white' : 'bg-[#1E2532] text-[#6B7C93] hover:text-white']"
          >{{ status }}</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="contest in filteredContests" 
          :key="contest.id"
          @click="router.push(`/contest/${contest.id}`)"
          class="bg-[#1E2532] rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <img :src="contest.cover" :alt="contest.name" class="w-full h-48 object-cover" />
          <div class="p-6">
            <div class="flex items-center justify-between mb-3">
              <span :class="['px-2 py-1 text-xs rounded', contest.status === '进行中' ? 'bg-green-500/30 text-green-400' : contest.status === '即将开始' ? 'bg-yellow-500/30 text-yellow-400' : 'bg-gray-500/30 text-gray-400']">
                {{ contest.status }}
              </span>
              <span class="text-xs text-[#6B7C93]">{{ contest.participants }} 参赛</span>
            </div>
            <h3 class="font-semibold text-white mb-2">{{ contest.name }}</h3>
            <p class="text-[#B8C6D8] text-sm mb-4 line-clamp-2">{{ contest.description }}</p>
            <div class="flex items-center justify-between text-sm text-[#6B7C93]">
              <div>
                <span>截止日期：{{ contest.deadline }}</span>
              </div>
              <button @click.stop="router.push(`/contest/${contest.id}`)" class="text-[#4A5F8B] hover:text-white transition-colors">
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';

const router = useRouter();
const { handleCreate } = useInteraction();

const searchQuery = ref('');
const filterStatus = ref('全部');

const contests = ref([
  {
    id: '1',
    name: '2024春季风光摄影大赛',
    description: '用镜头捕捉春天的美丽，分享大自然的生机与活力',
    cover: 'https://picsum.photos/1280/720?random=239',
    status: '进行中',
    participants: 1256,
    deadline: '2024-04-30'
  },
  {
    id: '2',
    name: '人像摄影大师赛',
    description: '展现人像摄影的艺术魅力，捕捉人物的情感与故事',
    cover: 'https://picsum.photos/1280/720?random=240',
    status: '进行中',
    participants: 892,
    deadline: '2024-05-15'
  },
  {
    id: '3',
    name: '城市街头摄影挑战赛',
    description: '记录城市生活的点滴，展现街头的独特魅力',
    cover: 'https://picsum.photos/1280/720?random=241',
    status: '即将开始',
    participants: 0,
    deadline: '2024-05-01'
  },
  {
    id: '4',
    name: '微距摄影艺术展',
    description: '探索微观世界的美丽，展现微距摄影的独特视角',
    cover: 'https://picsum.photos/1280/720?random=242',
    status: '已结束',
    participants: 456,
    deadline: '2024-03-15'
  }
]);

const filteredContests = computed(() => {
  let result = contests.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
  }
  if (filterStatus.value !== '全部') {
    result = result.filter(c => c.status === filterStatus.value);
  }
  return result;
});
</script>