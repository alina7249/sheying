<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">摄影小组</h1>
          <p class="text-[#6B7C93]">加入志同道合的摄影爱好者群体</p>
        </div>
        <button class="px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors flex items-center gap-2">
          <i class="fa-solid fa-plus"></i>
          <span>创建小组</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="group in groups" 
          :key="group.id"
          class="bg-[#1E2532] rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <img :src="group.cover" :alt="group.name" class="w-full h-40 object-cover" />
          <div class="p-6">
            <div class="flex items-center gap-3 mb-3">
              <img :src="group.avatar" :alt="group.name" class="w-12 h-12 rounded-full" />
              <div>
                <h3 class="font-semibold text-white">{{ group.name }}</h3>
                <p class="text-sm text-[#6B7C93]">{{ group.members }} 成员</p>
              </div>
            </div>
            <p class="text-[#B8C6D8] text-sm mb-4">{{ group.description }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <span class="text-xs text-[#6B7C93]">{{ group.posts }} 帖子</span>
                <span class="text-[#4A5F8B]">·</span>
                <span class="text-xs text-[#6B7C93]">{{ group.activity }}</span>
              </div>
              <button 
                @click.stop="handleJoin(group.id)"
                :class="['px-3 py-1 rounded-lg text-sm transition-colors', group.isJoined ? 'bg-[#1E2532] border border-[#4A5F8B] text-[#4A5F8B]' : 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]']"
              >
                {{ group.isJoined ? '已加入' : '加入' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const groups = ref([
  {
    id: '1',
    name: '人像摄影交流群',
    avatar: 'https://picsum.photos/400/400?random=252',
    cover: 'https://picsum.photos/1280/720?random=253',
    description: '专注人像摄影技巧分享，每周举办线上交流活动',
    members: 1256,
    posts: 3420,
    activity: '活跃',
    isJoined: false
  },
  {
    id: '2',
    name: '风光摄影俱乐部',
    avatar: 'https://picsum.photos/400/400?random=254',
    cover: 'https://picsum.photos/1280/720?random=255',
    description: '探索大自然的美丽，分享风光摄影技巧',
    members: 2341,
    posts: 5678,
    activity: '活跃',
    isJoined: true
  },
  {
    id: '3',
    name: '城市街头摄影',
    avatar: 'https://picsum.photos/400/400?random=256',
    cover: 'https://picsum.photos/1280/720?random=257',
    description: '记录城市生活的点滴，捕捉街头瞬间',
    members: 892,
    posts: 2156,
    activity: '活跃',
    isJoined: false
  },
  {
    id: '4',
    name: '微距摄影爱好者',
    avatar: 'https://picsum.photos/400/400?random=258',
    cover: 'https://picsum.photos/1280/720?random=259',
    description: '探索微观世界的美丽，分享微距摄影技巧',
    members: 654,
    posts: 1234,
    activity: '较活跃',
    isJoined: false
  },
  {
    id: '5',
    name: '胶片摄影复古风',
    avatar: 'https://picsum.photos/400/400?random=260',
    cover: 'https://picsum.photos/1280/720?random=261',
    description: '热爱胶片摄影的复古情怀，分享胶片拍摄心得',
    members: 432,
    posts: 876,
    activity: '较活跃',
    isJoined: false
  },
  {
    id: '6',
    name: '商业摄影交流',
    avatar: 'https://picsum.photos/400/400?random=262',
    cover: 'https://picsum.photos/1280/720?random=263',
    description: '商业摄影师交流平台，分享商业拍摄经验',
    members: 345,
    posts: 654,
    activity: '活跃',
    isJoined: false
  }
]);

const handleJoin = (groupId: string) => {
  const group = groups.value.find(g => g.id === groupId);
  if (group) {
    group.isJoined = !group.isJoined;
    group.members += group.isJoined ? 1 : -1;
  }
};
</script>