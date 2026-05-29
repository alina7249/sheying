<template>
  <div
    class="bg-[#2D3748] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-[#4A5F8B] h-[500px] flex flex-col hover:-translate-y-1"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="relative flex-shrink-0">
      <router-link :to="`/photo/${post.id}`" class="block">
        <img
          :src="post.image"
          :alt="post.title"
          class="w-full h-60 object-cover transition-transform duration-300"
          :class="isHovered ? 'scale-105' : 'scale-100'"
          loading="lazy"
        />
      </router-link>

      <div class="absolute top-3 right-3 flex space-x-2">
        <span
          v-for="(tag, index) in post.tags.slice(0, 2)"
          :key="index"
          class="px-2 py-1 bg-[#4A5F8B]/90 text-[#F5F7FA] text-xs rounded-full border border-[#4A5F8B]"
        >
          #{{ tag }}
        </span>
        <span v-if="post.tags.length > 2" class="px-2 py-1 bg-[#4A5F8B]/90 text-[#F5F7FA] text-xs rounded-full border border-[#4A5F8B]">
          +{{ post.tags.length - 2 }}
        </span>
      </div>
    </div>

    <div class="p-5 flex flex-col flex-grow">
      <div class="flex items-center mb-3">
        <router-link :to="`/profile/${post.author.id}`" class="block mr-3">
          <img
            :src="post.author.avatar"
            :alt="post.author.name"
            class="w-8 h-8 rounded-full object-cover border border-[#B8C6D8] hover:border-[#4A5F8B] transition-colors"
            loading="lazy"
          />
        </router-link>
        <div>
          <router-link
            :to="`/profile/${post.author.id}`"
            class="block font-medium text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors"
          >
            {{ post.author.name }}
          </router-link>
          <p class="text-xs text-[#B8C6D8]">
            {{ post.date }}
          </p>
        </div>
      </div>

      <router-link :to="`/photo/${post.id}`" class="block mb-2">
        <h3 class="text-lg font-bold text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors">
          {{ post.title }}
        </h3>
      </router-link>

      <p v-if="equipmentParams" class="text-xs text-[#B8C6D8] mb-4 font-mono">{{ equipmentParams }}</p>

      <div class="flex items-center justify-between mt-auto">
        <div class="flex items-center space-x-4">
          <button
            @click="handleLike"
            :class="['flex items-center space-x-1 text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D3748] rounded px-2 py-1 active:scale-90', isLiked ? 'text-red-500' : 'text-[#B8C6D8] hover:text-red-400']"
            :aria-label="isLiked ? '取消点赞' : '点赞'"
            type="button"
          >
            <i :class="['fa-solid fa-heart transition-transform duration-300', isLiked ? 'scale-110' : 'scale-100']"></i>
            <span>{{ likeCount }}</span>
          </button>
          <router-link
            :to="`/photo/${post.id}#comments`"
            class="flex items-center space-x-1 text-sm text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors"
          >
            <i class="fa-solid fa-comment"></i>
            <span>{{ post.comments }}</span>
          </router-link>
        </div>

        <button
          @click="handleBookmark"
          :class="['text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2D3748] rounded px-2 py-1 active:scale-90', isBookmarked ? 'text-yellow-500' : 'text-[#B8C6D8] hover:text-yellow-400']"
          :aria-label="isBookmarked ? '取消收藏' : '收藏'"
          type="button"
        >
          <i class="fa-solid fa-bookmark"></i>
          <span class="ml-1">{{ collectionCount }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

export interface PhotographyPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  collections: number;
  tags: string[];
  date: string;
}

const props = defineProps<{
  post: PhotographyPost;
}>();

const isHovered = ref(false);
const isLiked = ref(false);
const isBookmarked = ref(false);
const likeCount = ref(props.post.likes);
const collectionCount = ref(props.post.collections);

const equipmentParams = computed(() => {
  const firstLine = props.post.description.split('\n')[0];
  if (firstLine.includes('|')) {
    return firstLine;
  }
  return '';
});

const handleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

const handleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  collectionCount.value += isBookmarked.value ? 1 : -1;
};
</script>