<template>
  <!-- EventsAndContests: detailed view -->
  <div v-if="routeId" class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="max-w-3xl mx-auto">
      <div class="mb-8">
        <div class="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
          <img :src="selectedEvent?.image" :alt="selectedEvent?.title" class="w-full h-full object-cover" />
          <div class="absolute top-4 left-4 flex space-x-2">
            <span v-if="selectedEvent?.deadline" class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-sm font-medium">截止日期: {{ selectedEvent?.deadline }}</span>
            <span class="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-full text-sm">{{ selectedEvent?.type }}</span>
          </div>
          <button @click="router.back()" class="absolute top-4 right-4 p-2 bg-[#2D3748]/80 rounded-full hover:bg-[#2D3748] transition-colors"><i class="fa-solid fa-times"></i></button>
        </div>
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-4">{{ selectedEvent?.title }}</h1>
        <div class="flex flex-wrap items-center space-x-6 mb-6">
          <div v-if="selectedEvent?.organizer" class="flex items-center">
            <img :src="selectedEvent?.organizer.avatar" :alt="selectedEvent?.organizer.name" class="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]" />
            <span class="text-sm text-[#B8C6D8]">{{ selectedEvent?.organizer.name }}</span>
          </div>
          <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-calendar-alt mr-2 text-[#4A5F8B]"></i>{{ selectedEvent?.date }}</div>
          <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-map-marker-alt mr-2 text-[#4A5F8B]"></i>{{ selectedEvent?.location }}</div>
          <div class="flex items-center text-sm text-[#B8C6D8]" v-if="selectedEvent?.participants"><i class="fa-solid fa-users mr-2 text-[#4A5F8B]"></i>{{ selectedEvent?.participants }}人参与</div>
        </div>
      </div>

      <div v-if="!selectedEvent" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
        <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search-minus text-2xl"></i></div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">活动不存在</h3>
        <p class="text-[#B8C6D8]">未找到该活动，请检查链接是否正确</p>
      </div>

      <template v-if="selectedEvent">
        <div class="bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
          <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">活动描述</h2>
          <p class="text-[#B8C6D8] mb-6">{{ selectedEvent.description }}</p>
          <div v-if="selectedEvent.tags" class="flex flex-wrap gap-2"><span v-for="tag in selectedEvent.tags" :key="tag" class="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">{{ tag }}</span></div>
        </div>

        <div v-if="selectedEvent.prizes" class="bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
          <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">奖项设置</h2>
          <div class="space-y-3">
            <div v-for="(prize, idx) in selectedEvent.prizes" :key="idx" class="flex items-center space-x-3 p-3 rounded">
              <div class="w-8 h-8 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] flex-shrink-0"><span>{{ idx + 1 }}</span></div>
              <div><p class="font-medium text-[#F5F7FA]">{{ prize.name }}</p><p class="text-sm text-[#B8C6D8]">{{ prize.reward }}</p></div>
            </div>
          </div>
        </div>

        <div v-if="selectedEvent.schedule" class="bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
          <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">活动时间表</h2>
          <div class="space-y-3">
            <div v-for="(item, idx) in selectedEvent.schedule" :key="idx" class="flex items-start">
              <div class="w-8 h-8 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"><span>{{ idx + 1 }}</span></div>
              <div><p class="font-medium text-[#F5F7FA]">{{ item.title }}</p><p class="text-sm text-[#B8C6D8]">{{ item.date }}</p></div>
            </div>
          </div>
        </div>

        <div v-if="selectedEvent.judges" class="bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
          <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">评委阵容</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="judge in selectedEvent.judges" :key="judge.id" class="flex items-center space-x-3">
              <img :src="judge.avatar" :alt="judge.name" class="w-12 h-12 rounded-full object-cover border-2 border-[#4A5F8B]" />
              <div><p class="font-medium text-[#F5F7FA]">{{ judge.name }}</p><p class="text-xs text-[#B8C6D8]">{{ judge.title }}</p></div>
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <button @click="handleJoin" class="px-6 py-4 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-lg"><i class="fa-solid fa-calendar-check mr-2"></i>立即参加</button>
          <button class="px-6 py-4 bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B] text-lg" @click="handleShare"><i class="fa-solid fa-share-alt mr-2"></i>分享</button>
        </div>
      </template>
    </div>
  </div>

  <!-- EventsAndContests: list view -->
  <div v-else class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">活动与赛事</h1>
      <p class="text-[#B8C6D8] max-w-2xl mx-auto">参与平台举办的摄影活动和赛事，展示作品，赢取奖品</p>
    </div>

    <div class="flex flex-wrap gap-2 justify-center mb-8">
      <button v-for="tab in tabs" :key="tab" @click="activeTab = tab" class="px-6 py-3 rounded-lg border transition-colors font-medium" :class="activeTab === tab ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'bg-[#2D3748] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">{{ tab }}</button>
    </div>

    <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
      <div class="relative flex-1">
        <input type="text" v-model="searchTerm" placeholder="搜索活动..." class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
        <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
      </div>
      <select v-model="sortBy" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
        <option value="upcoming">即将开始</option>
        <option value="popular">最热门</option>
        <option value="newest">最新发布</option>
      </select>
    </div>

    <div class="space-y-6">
      <div v-for="event in filteredEvents" :key="event.id" class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm">
        <div class="md:flex">
          <div class="md:w-1/3">
            <img :src="event.image" :alt="event.title" class="w-full h-48 md:h-full object-cover" />
          </div>
          <div class="p-5 md:w-2/3">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-[#B8C6D8] font-medium">{{ event.type }}</span>
              <span v-if="event.status === 'ended'" class="px-2 py-1 bg-[#6B7C93]/30 text-[#B8C6D8] text-xs rounded-full">已结束</span>
            </div>
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ event.title }}</h3>
            <div class="space-y-1 mb-4">
              <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-calendar-alt mr-2 text-[#4A5F8B]"></i>{{ event.date }}</div>
              <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-map-marker-alt mr-2 text-[#4A5F8B]"></i>{{ event.location }}</div>
              <div v-if="event.participants" class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-users mr-2 text-[#4A5F8B]"></i>{{ event.participants }}人已参与</div>
            </div>
            <p class="text-sm text-[#B8C6D8] mb-4 line-clamp-2">{{ event.description }}</p>
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in event.tags.slice(0, 3)" :key="tag" class="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">{{ tag }}</span>
            </div>
            <div class="flex space-x-2">
              <router-link :to="`/events/${event.id}`" class="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">查看详情</router-link>
              <button v-if="activeTab === '活动'" class="text-[#4A5F8B] border border-[#4A5F8B] px-4 py-2 rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors" @click="handleJoin"><i class="fa-solid fa-calendar-plus"></i></button>
              <button v-else class="text-[#4A5F8B] border border-[#4A5F8B] px-4 py-2 rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors" @click="handleJoin"><i class="fa-solid fa-trophy"></i></button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="filteredEvents.length === 0" class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
        <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search-minus text-2xl"></i></div><h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关活动</h3><p class="text-[#B8C6D8]">请尝试调整搜索条件</p>
      </div>
    </div>

    <div v-if="filteredEvents.length > 0" class="flex justify-center mt-8">
      <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
        <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors" @click="currentPage = Math.max(1, currentPage - 1)"><i class="fa-solid fa-chevron-left text-xs"></i></button>
        <button class="px-3 py-2 rounded bg-[#4A5F8B] text-[#F5F7FA]">{{ currentPage }}</button>
        <span class="px-2 text-[#B8C6D8]">...</span>
        <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors" @click="currentPage = 5">5</button>
        <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors" @click="currentPage = Math.min(5, currentPage + 1)"><i class="fa-solid fa-chevron-right text-xs"></i></button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';

const route = useRoute();
const router = useRouter();
const routeId = computed(() => route.params.id as string | undefined);

const { handleJoin, handleShare } = useInteraction();

const currentPage = ref(1);

const activeTab = ref('全部');
const searchTerm = ref('');
const sortBy = ref('upcoming');
const tabs = ['全部', '活动', '赛事'];

const allEvents = [
  {
    id: 'e1', title: '2023秋季风光摄影大赛', type: '大赛', category: '风光',
    image: 'https://picsum.photos/1280/720?random=88',
    date: '2023-10-25 15:00', location: '线上', participants: 1256, status: 'active',
    deadline: '2023-11-10',
    description: '2023秋季风光摄影大赛正式启动！参赛者需提交3-5张秋季风光摄影作品，题材不限，要求原创。评委由业内知名摄影师组成，评选标准包括创意性、技术性和艺术性。',
    organizer: { id: 'org1', name: '光影捕手平台', avatar: 'https://picsum.photos/400/400?random=89' },
    prizes: [
      { name: '一等奖', reward: '¥5000 + 专业摄影器材包 + 平台专属勋章' },
      { name: '二等奖', reward: '¥3000 + 摄影配件套装' },
      { name: '三等奖', reward: '¥1000 + 摄影书籍套装' },
      { name: '优秀奖', reward: '平台VIP会员一年' }
    ],
    schedule: [
      { title: '投稿阶段', date: '2023年10月25日 - 11月10日' },
      { title: '评委评审', date: '2023年11月10日 - 11月25日' },
      { title: '结果公布', date: '2023年12月1日' }
    ],
    judges: [
      { id: 'j1', name: '张明', avatar: 'https://picsum.photos/400/400?random=90', title: '国家地理摄影师' },
      { id: 'j2', name: '李华', avatar: 'https://picsum.photos/400/400?random=91', title: '纪实摄影师' }
    ],
    tags: ['风光', '大赛', '秋季', '线上', '丰厚奖金']
  },
  {
    id: 'cv2', title: '城市建筑摄影大赛', type: '大赛', category: '建筑',
    image: 'https://picsum.photos/1280/720?random=92',
    date: '2023-12-01 - 2023-12-31', location: '线上', participants: 892, status: 'ended',
    description: '城市建筑摄影大赛，捕捉都市建筑的独特魅力。参赛者需提交建筑摄影作品，展现城市的现代建筑风采。',
    organizer: { id: 'org1', name: '光影捕手平台', avatar: 'https://picsum.photos/400/400?random=93' },
    tags: ['建筑', '城市', '摄影大赛', '线上']
  },
  {
    id: 'ev1', title: '上海城市摄影线下活动', type: '活动', category: '城市',
    image: 'https://picsum.photos/1280/720?random=94',
    date: '2023-11-15', location: '上海·外滩', participants: 45, status: 'active',
    description: '组织摄影爱好者在上海外滩进行城市风光和人像拍摄，资深摄影师带队指导。',
    organizer: { id: 'org2', name: '上海摄影俱乐部', avatar: 'https://picsum.photos/400/400?random=95' },
    tags: ['上海', '城市', '线下', '交流']
  }
];

const filteredEvents = computed(() => {
  let events = [...allEvents];
  if (activeTab.value === '活动') events = events.filter(e => e.type === '活动');
  else if (activeTab.value === '赛事') events = events.filter(e => e.type === '大赛');
  if (searchTerm.value) {
    const q = searchTerm.value.toLowerCase();
    events = events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.location.toLowerCase().includes(q));
  }
  if (sortBy.value === 'upcoming') events.sort((a, b) => new Date(a.date.split(' - ')[0]).getTime() - new Date(b.date.split(' - ')[0]).getTime());
  else if (sortBy.value === 'popular') events.sort((a, b) => (b.participants || 0) - (a.participants || 0));
  return events;
});

const selectedEvent = computed(() => allEvents.find(e => e.id === routeId.value));
</script>