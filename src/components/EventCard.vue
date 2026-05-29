<template>
  <div
    class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm hover:-translate-y-1 hover:shadow-lg"
  >
    <div class="md:flex">
      <div class="md:w-1/3">
        <img
          :src="item.image"
          :alt="item.title"
          class="w-full h-48 md:h-full object-cover"
        />
      </div>

      <div class="p-5 md:w-2/3">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-[#F5F7FA] font-medium">{item.type}</span>
          <template v-if="isContest">
            <span :class="['text-xs px-2 py-1 rounded-full', item.status === '进行中' ? 'bg-[#2D3748]/50 text-[#F5F7FA]' : item.status === '已截止' ? 'bg-[#6B7C93] text-[#F5F7FA]' : 'bg-[#2D3748]/50 text-[#F5F7FA]']">
              {{ item.status }}
            </span>
          </template>
          <template v-else>
            <span class="text-xs px-2 py-1 bg-[#2D3748]/50 text-[#F5F7FA] rounded-full">
              {{ item.tags[0] || '其他' }}
            </span>
          </template>
        </div>

        <h3 class="text-lg font-bold text-[#F5F7FA] mb-2 hover:text-[#FFFFFF] transition-colors">
          {{ item.title }}
        </h3>

        <div class="space-y-1 mb-4">
          <div v-if="!isContest && item.location" class="flex items-center text-sm text-[#F5F7FA]">
            <i class="fa-solid fa-map-marker-alt mr-2 text-[#F5F7FA]"></i>
            <span>{{ item.location }}</span>
          </div>

          <div class="flex items-center text-sm text-[#F5F7FA]">
            <i class="fa-solid fa-calendar-alt mr-2 text-[#F5F7FA]"></i>
            <span>{{ isContest ? `截止日期：${item.date}` : item.date }}</span>
          </div>

          <div v-if="!isContest && item.duration" class="flex items-center text-sm text-[#F5F7FA]">
            <i class="fa-solid fa-clock mr-2 text-[#F5F7FA]"></i>
            <span>{{ item.duration }}</span>
          </div>

          <div v-if="isContest" class="flex items-center text-sm text-[#F5F7FA]">
            <i class="fa-solid fa-user-group mr-2 text-[#F5F7FA]"></i>
            <span>已有 {{ item.participants }} 人{{ isContest ? '参赛' : '报名' }}</span>
          </div>

          <div v-if="isContest && item.worksCount" class="flex items-center text-sm text-[#F5F7FA]">
            <i class="fa-solid fa-images mr-2 text-[#F5F7FA]"></i>
            <span>共提交 {{ item.worksCount }} 件作品</span>
          </div>
        </div>

        <p class="text-sm text-[#F5F7FA]/90 mb-4 line-clamp-2">
          {{ item.description }}
        </p>

        <div v-if="!isContest && item.price !== undefined" class="flex items-center justify-between mb-4">
          <div class="text-lg font-bold text-[#F5F7FA]">
            {{ item.price === 0 ? '免费' : `¥${item.price}` }}
          </div>
          <div v-if="item.maxParticipants" class="text-sm text-[#F5F7FA]">
            {{ item.participants }} 人已报名 / 限 {{ item.maxParticipants }} 人
          </div>
        </div>

        <div class="flex flex-wrap gap-2 mb-4">
          <button
            v-for="(tag, index) in item.tags.slice(0, 5)"
            :key="index"
            @click="toggleTag(tag)"
            :class="['px-2 py-1 rounded-full text-xs transition-colors', selectedTags.includes(tag) ? 'bg-[#F5F7FA] text-[#4A5F8B]' : 'bg-[#2D3748]/50 text-[#F5F7FA] border border-[#6B7C93]/30']"
          >
            #{tag}
          </button>
        </div>

        <div class="flex space-x-2">
          <router-link
            :to="isContest ? `/contest/${item.id}` : `/event/${item.id}`"
            class="flex-1 py-2 text-center bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-[#FFFFFF] transition-colors border border-[#F5F7FA]"
          >
            查看详情
          </router-link>
          <button
            class="flex-1 py-2 text-center bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-[#FFFFFF] transition-colors border border-[#F5F7FA]"
            @click="onRegister"
          >
            <i class="fa-solid fa-calendar-plus mr-1"></i> {{ isContest ? '立即参赛' : '立即报名' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface EventType {
  id: string;
  title: string;
  type: string;
  image: string;
  location?: string;
  date: string;
  duration?: string;
  description: string;
  tags: string[];
  participants: number;
  maxParticipants?: number;
  price?: number;
  status?: string;
  worksCount?: number;
}

defineProps<{
  item: EventType;
  isContest?: boolean;
  selectedTags: string[];
}>();

const emit = defineEmits<{
  register: [];
  toggleTag: [tag: string];
}>();

const onRegister = () => {
  emit('register');
};

const toggleTag = (tag: string) => {
  emit('toggleTag', tag);
};
</script>