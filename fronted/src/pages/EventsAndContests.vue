<template>
  <div class="min-h-screen bg-[#0F1C2D] container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">
        <i class="fa-solid fa-calendar-star mr-2 text-[#C9A962]"></i>活动赛事
      </h1>
      <p class="text-[#6B7C93]">发现精彩摄影活动，参与赛事交流</p>
    </div>

    <!-- 状态筛选 -->
    <div class="flex gap-2 mb-8 flex-wrap">
      <button v-for="opt in statusOptions" :key="opt.value"
        @click="filterStatus = opt.value; current = 1; loadEvents()"
        :class="['px-5 py-2 rounded-full text-sm font-medium transition-all duration-200',
          filterStatus === opt.value ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B]/20 hover:border-[#4A5F8B]/50']">
        {{ opt.label }}
      </button>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="animate-spin w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full"></div>
    </div>

    <div v-else-if="events.length === 0" class="flex flex-col items-center justify-center py-20 text-[#6B7C93]">
      <i class="fa-solid fa-calendar-xmark text-5xl mb-4"></i>
      <p>暂无活动</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="event in events" :key="event.id"
        class="bg-[#1E2532] rounded-2xl overflow-hidden border border-[#2D3748] hover:border-[#4A5F8B]/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/30">
        <div class="relative h-48 overflow-hidden">
          <img :src="event.coverImage || 'https://picsum.photos/600/400?random=event' + event.id" :alt="event.title" class="w-full h-full object-cover" />
          <div class="absolute top-3 right-3">
            <span :class="['px-3 py-1 rounded-full text-xs font-medium', getStatusClass(event.status)]">
              {{ getStatusLabel(event.status) }}
            </span>
          </div>
        </div>
        <div class="p-5">
          <h3 class="text-white font-bold text-lg mb-2 truncate">{{ event.title }}</h3>
          <div class="space-y-2 text-sm text-[#6B7C93] mb-4">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-map-marker-alt w-4 text-[#C9A962]"></i>
              <span>{{ event.location || '线上活动' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-clock w-4 text-[#C9A962]"></i>
              <span>{{ formatDate(event.startTime) }} - {{ formatDate(event.endTime) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-users w-4 text-[#C9A962]"></i>
              <span>{{ event.currentParticipants || 0 }}{{ event.maxParticipants ? '/' + event.maxParticipants : '' }} 人报名</span>
            </div>
          </div>
          <button
            @click="handleJoin(event)"
            :disabled="event.isRegistered || event.status === 'ended'"
            :class="['w-full py-3 rounded-xl text-sm font-medium transition-all duration-200',
              event.isRegistered ? 'bg-[#2D3748] text-[#6B7C93] cursor-not-allowed' :
              event.status === 'ended' ? 'bg-[#2D3748] text-[#6B7C93] cursor-not-allowed' :
              'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white hover:shadow-lg hover:shadow-[#4A5F8B]/30']">
            {{ event.isRegistered ? '已报名' : event.status === 'ended' ? '已结束' : '立即报名' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="total > pageSize" class="flex justify-center mt-8 gap-2">
      <button @click="current--; loadEvents()" :disabled="current === 1"
        class="px-4 py-2 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50">上一页</button>
      <span class="px-4 py-2 text-[#6B7C93] text-sm">{{ current }} / {{ Math.ceil(total / pageSize) }}</span>
      <button @click="current++; loadEvents()" :disabled="current >= Math.ceil(total / pageSize)"
        class="px-4 py-2 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50">下一页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getEventList, joinEvent, cancelEventJoin } from '../services/api';
import { toast } from 'vue-sonner';

const events = ref<any[]>([]);
const loading = ref(false);
const current = ref(1);
const pageSize = 12;
const total = ref(0);
const filterStatus = ref('');

const statusOptions = [
  { label: '全部', value: '' },
  { label: '即将开始', value: 'upcoming' },
  { label: '进行中', value: 'ongoing' },
  { label: '已结束', value: 'ended' },
];

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    upcoming: 'bg-blue-500/20 text-blue-400',
    ongoing: 'bg-green-500/20 text-green-400',
    ended: 'bg-gray-500/20 text-gray-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };
  return map[status] || 'bg-gray-500/20 text-gray-400';
};

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    upcoming: '即将开始',
    ongoing: '进行中',
    ended: '已结束',
    cancelled: '已取消',
  };
  return map[status] || status;
};

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

const loadEvents = async () => {
  loading.value = true;
  try {
    const res: any = await getEventList(current.value, pageSize, filterStatus.value || undefined);
    if (res?.code === 0 && res.data) {
      events.value = res.data.records || [];
      total.value = res.data.total || 0;
    }
  } catch (e) { /* ignore */ }
  finally { loading.value = false; }
};

const handleJoin = async (event: any) => {
  try {
    const res: any = await joinEvent(event.id);
    if (res?.code === 0) {
      event.isRegistered = true;
      if (event.currentParticipants !== undefined) event.currentParticipants++;
      toast.success('报名成功！');
    } else {
      toast.error(res?.message || '报名失败');
    }
  } catch (e: any) {
    toast.error(e?.message || '报名失败');
  }
};

onMounted(() => {
  loadEvents();
});
</script>