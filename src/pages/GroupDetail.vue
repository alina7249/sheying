<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="relative">
      <img :src="group.cover" :alt="group.name" class="w-full h-64 object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0F1C2D] to-transparent"></div>
      <div class="absolute bottom-0 left-0 right-0 p-6">
        <div class="max-w-6xl mx-auto flex items-end gap-6">
          <img :src="group.avatar" :alt="group.name" class="w-24 h-24 rounded-full border-4 border-[#0F1C2D]" />
          <div>
            <h1 class="text-3xl font-bold text-white">{{ group.name }}</h1>
            <p class="text-[#6B7C93]">{{ group.members }} 成员 · {{ group.posts }} 帖子</p>
          </div>
          <div class="ml-auto">
            <button 
              @click="handleJoin"
              :class="['px-6 py-2 rounded-lg font-medium transition-colors', isJoined ? 'bg-[#1E2532] border border-[#4A5F8B] text-[#4A5F8B]' : 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]']"
            >
              {{ isJoined ? '已加入' : '加入小组' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="flex gap-2 mb-6">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['px-4 py-2 rounded-lg transition-colors', activeTab === tab.id ? 'bg-[#4A5F8B] text-white' : 'bg-[#1E2532] text-[#6B7C93] hover:text-white']"
            >
              {{ tab.name }}
            </button>
          </div>

          <div v-if="activeTab === 'posts'" class="space-y-6">
            <div v-for="post in groupPosts" :key="post.id" class="bg-[#1E2532] rounded-xl p-6">
              <div class="flex items-center gap-4 mb-4">
                <img :src="post.author.avatar" :alt="post.author.name" class="w-10 h-10 rounded-full" />
                <div>
                  <h3 class="font-medium text-white">{{ post.author.name }}</h3>
                  <p class="text-sm text-[#6B7C93]">{{ post.date }}</p>
                </div>
              </div>
              <h2 class="text-lg font-semibold text-white mb-2">{{ post.title }}</h2>
              <p class="text-[#B8C6D8]">{{ post.content }}</p>
              <div v-if="post.images && post.images.length > 0" class="grid grid-cols-2 gap-3 mt-4">
                <img v-for="(img, index) in post.images.slice(0, 2)" :key="index" :src="img" :alt="`${post.title} - ${index + 1}`" class="w-full h-40 object-cover rounded-lg" />
              </div>
              <div class="flex items-center gap-6 mt-4 text-sm text-[#6B7C93]">
                <button @click="handleLike('帖子')" class="flex items-center gap-1 hover:text-white transition-colors">
                  <i class="fa-solid fa-heart"></i>
                  <span>{{ post.likes }}</span>
                </button>
                <button @click="showSuccess('评论功能开发中')" class="flex items-center gap-1 hover:text-white transition-colors">
                  <i class="fa-solid fa-comment"></i>
                  <span>{{ post.comments }}</span>
                </button>
                <button @click="handleShare" class="flex items-center gap-1 hover:text-white transition-colors">
                  <i class="fa-solid fa-share"></i>
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'members'" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="member in members" :key="member.id" class="bg-[#1E2532] rounded-xl p-4 text-center">
              <img :src="member.avatar" :alt="member.name" class="w-16 h-16 rounded-full mx-auto mb-2" />
              <h3 class="text-white text-sm font-medium">{{ member.name }}</h3>
              <p class="text-[#6B7C93] text-xs">{{ member.role }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6">
            <h3 class="font-semibold text-white mb-4">小组介绍</h3>
            <p class="text-[#B8C6D8] text-sm">{{ group.description }}</p>
          </div>

          <div class="bg-[#1E2532] rounded-xl p-6">
            <h3 class="font-semibold text-white mb-4">统计数据</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-[#6B7C93]">成员数</span>
                <span class="text-white">{{ group.members }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#6B7C93]">帖子数</span>
                <span class="text-white">{{ group.posts }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-[#6B7C93]">创建时间</span>
                <span class="text-white">{{ group.createdAt }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl p-6 border border-orange-500/30">
            <h3 class="font-semibold text-white mb-2">发起活动</h3>
            <p class="text-sm text-[#B8C6D8] mb-4">组织线下摄影活动，增进成员交流</p>
            <button @click="showSuccess('活动发起成功，等待审核')" class="w-full px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              立即发起
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useInteraction } from '../composables/useInteraction';

const { showSuccess, handleLike, handleShare } = useInteraction();

const activeTab = ref('posts');

const tabs = [
  { id: 'posts', name: '帖子' },
  { id: 'members', name: '成员' },
  { id: 'activities', name: '活动' }
];

const group = {
  id: '1',
  name: '风光摄影俱乐部',
  avatar: 'https://picsum.photos/400/400?random=243',
  cover: 'https://picsum.photos/1280/720?random=244',
  description: '探索大自然的美丽，分享风光摄影技巧。我们每周组织线上交流活动，不定期举办线下摄影采风。欢迎所有热爱风光摄影的朋友加入！',
  members: 2341,
  posts: 5678,
  createdAt: '2022-01-15'
};

const isJoined = ref(true);

const groupPosts = [
  {
    id: '1',
    title: '分享上周拍摄的云海照片',
    content: '上周去黄山拍的云海，运气很好遇到了难得的好天气，分享给大家看看！',
    images: ['https://picsum.photos/1280/720?random=245'],
    author: { name: '风光爱好者', avatar: 'https://picsum.photos/400/400?random=246' },
    date: '2小时前',
    likes: 128,
    comments: 24
  },
  {
    id: '2',
    title: '下个月的川西摄影团有人参加吗？',
    content: '计划下个月组织一次川西摄影团，时间大概10天左右，路线包括稻城亚丁、新都桥等地。感兴趣的朋友可以报名！',
    images: [],
    author: { name: '团长老王', avatar: 'https://picsum.photos/400/400?random=247' },
    date: '昨天',
    likes: 89,
    comments: 45
  }
];

const members = [
  { id: '1', name: '团长老王', avatar: 'https://picsum.photos/400/400?random=248', role: '管理员' },
  { id: '2', name: '风光爱好者', avatar: 'https://picsum.photos/400/400?random=249', role: '活跃成员' },
  { id: '3', name: '摄影新手小李', avatar: 'https://picsum.photos/400/400?random=250', role: '成员' },
  { id: '4', name: '资深摄影师', avatar: 'https://picsum.photos/400/400?random=251', role: '活跃成员' }
];

const handleJoin = () => {
  isJoined.value = !isJoined.value;
  showSuccess(isJoined.value ? `已加入「${group.name}」` : `已退出「${group.name}」`);
};
</script>