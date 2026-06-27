<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">摄影小组</h1>
          <p class="text-[#6B7C93]">加入志同道合的摄影爱好者群体</p>
        </div>
        <button @click="showCreateModal = true" class="px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors flex items-center gap-2">
        <i class="fa-solid fa-plus"></i>
        <span>创建群组</span>
      </button>
    </div>

    <div class="mb-6">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索摄影小组…"
          class="w-full px-4 py-3 pl-12 bg-[#1E2532] border border-[#4A5F8B] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#6B7C93]"
        />
        <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="tab in tabsWithAll"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-4 py-2 rounded-lg transition-colors', activeTab === tab.id ? 'bg-[#4A5F8B] text-white' : 'bg-[#1E2532] text-[#6B7C93] hover:text-white']"
      >{{ tab.name }} ({{ tab.count }})</button>
    </div>

    <div v-if="filteredGroups.length === 0" class="text-center py-16 text-[#6B7C93]">
      <i class="fa-solid fa-search text-4xl mb-4 block"></i>
      <p>没有找到「{{ searchQuery }}」相关的小组</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="group in filteredGroups"
        :key="group.id"
        @click="navigateToGroup(group.id)"
        class="bg-[#1E2532] rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
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

  <Transition name="fade">
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="showCreateModal = false">
      <div class="w-full max-w-md bg-[#1E2532] rounded-xl p-6" @click.stop>
        <h3 class="text-xl font-bold text-white mb-4">创建新群组</h3>
        <form @submit.prevent="createNewGroup">
          <div class="mb-4">
            <label class="block text-sm text-[#6B7C93] mb-1">群组名称</label>
            <input
              v-model="newGroup.name"
              placeholder="输入群组名称..."
              required
              class="w-full px-4 py-2 bg-[#0F1C2D] border border-[#4A5F8B] rounded-lg text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm text-[#6B7C93] mb-1">描述</label>
            <textarea
              v-model="newGroup.description"
              placeholder="简单描述群组的主题..."
              rows="3"
              required
              class="w-full px-4 py-2 bg-[#0F1C2D] border border-[#4A5F8B] rounded-lg text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none"
            ></textarea>
          </div>
          <div class="mb-4">
            <label class="block text-sm text-[#6B7C93] mb-1">分类</label>
            <select
              v-model="newGroup.category"
              class="w-full px-4 py-2 bg-[#0F1C2D] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
            >
              <option value="全部">全部</option>
              <option value="风光">风光</option>
              <option value="人像">人像</option>
              <option value="纪实">纪实</option>
              <option value="器材">器材</option>
            </select>
          </div>
          <div class="flex justify-end gap-3">
            <button type="button" @click="showCreateModal = false" class="px-4 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg">
              取消
            </button>
            <button
              type="submit"
              :disabled="!newGroup.name.trim() || !newGroup.description.trim()"
              :class="['px-4 py-2 rounded-lg transition-colors', newGroup.name.trim() && newGroup.description.trim() ? 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]' : 'bg-gray-600 text-white cursor-not-allowed']"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';

const router = useRouter();
const { showSuccess } = useInteraction();

const searchQuery = ref('');
const activeTab = ref('全部');
const showCreateModal = ref(false);

const newGroup = ref({
  name: '',
  description: '',
  category: '全部'
});

const tabs = [
  { id: '全部', name: '全部' },
  { id: '风光', name: '风光' },
  { id: '人像', name: '人像' },
  { id: '纪实', name: '纪实' },
  { id: '器材', name: '器材' },
];

const groups = ref([
  {
    id: '1',
    name: '人像摄影交流群',
    avatar: 'https://picsum.photos/400/400?random=252',
    cover: 'https://picsum.photos/1280/720?random=253',
    description: '专注人像摄影技巧分享，每周举办线上交流活动',
    category: '人像',
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
    category: '风光',
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
    category: '纪实',
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
    category: '全部',
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
    category: '器材',
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
    category: '人像',
    members: 345,
    posts: 654,
    activity: '活跃',
    isJoined: false
  }
]);

const filteredGroups = computed(() => {
  let result = groups.value;
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(g => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
  }
  if (activeTab.value !== '全部') {
    result = result.filter(g => g.category === activeTab.value);
  }
  return result;
});

const tabsWithAll = computed(() => {
  return tabs.map(tab => ({
    ...tab,
    count: tab.id === '全部'
      ? groups.value.length
      : groups.value.filter(g => g.category === tab.id).length
  }));
});

const createNewGroup = () => {
  const group = {
    id: `${Date.now()}`,
    name: newGroup.value.name.trim(),
    avatar: `https://picsum.photos/400/400?random=${Date.now()}`,
    cover: `https://picsum.photos/1280/720?random=${Date.now() + 1}`,
    description: newGroup.value.description.trim(),
    category: newGroup.value.category,
    members: 1,
    posts: 0,
    activity: '新建',
    isJoined: true
  };
  groups.value.unshift(group);
  showSuccess(`已创建群组「${group.name}」`);
  showCreateModal.value = false;
  newGroup.value = { name: '', description: '', category: '全部' };
};

const navigateToGroup = (groupId: string) => {
  router.push(`/group/${groupId}`);
};

const handleJoin = (groupId: string) => {
  const group = groups.value.find(g => g.id === groupId);
  if (group) {
    group.isJoined = !group.isJoined;
    group.members += group.isJoined ? 1 : -1;
    showSuccess(group.isJoined ? `已加入「${group.name}」` : `已退出「${group.name}」`);
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>