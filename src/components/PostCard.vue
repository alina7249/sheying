<template>
  <div class="post-card" @click="$emit('click', post)">
    <div class="post-header">
      <div class="author-info">
        <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar" />
        <div class="author-details">
          <h3 class="author-name">{{ post.author.name }}</h3>
          <p class="post-date">{{ post.date }}</p>
        </div>
      </div>
      <span class="category-tag">{{ post.category }}</span>
    </div>
    
    <h2 class="post-title">{{ post.title }}</h2>
    <p class="post-content">{{ post.content }}</p>
    
    <div v-if="post.images && post.images.length > 0" class="post-images">
      <div
        v-for="(img, index) in post.images.slice(0, 2)"
        :key="index"
        class="image-wrapper"
      >
        <img :src="img" :alt="`${post.title} - ${index + 1}`" class="post-image" loading="lazy" />
      </div>
      <div v-if="post.images.length > 2" class="more-images">
        <span>+{{ post.images.length - 2 }}</span>
      </div>
    </div>
    
    <div class="post-actions">
      <button
        @click.stop="$emit('like', post.id)"
        class="action-btn"
        :class="{ active: isLiked }"
        aria-label="点赞"
      >
        <i :class="['fa-heart', isLiked ? 'fa-solid' : 'fa-regular']"></i>
        <span>{{ likeCount }}</span>
      </button>
      <button
        @click.stop="$emit('comment', post.id)"
        class="action-btn"
        aria-label="评论"
      >
        <i class="fa-regular fa-comment"></i>
        <span>{{ post.comments }}</span>
      </button>
      <button
        @click.stop="$emit('bookmark', post.id)"
        class="action-btn"
        :class="{ active: isBookmarked }"
        aria-label="收藏"
      >
        <i :class="['fa-bookmark', isBookmarked ? 'fa-solid' : 'fa-regular']"></i>
        <span>{{ bookmarkCount }}</span>
      </button>
      <button
        @click.stop="$emit('share', post.id)"
        class="action-btn"
        aria-label="分享"
      >
        <i class="fa-solid fa-share"></i>
        <span>分享</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface PostItem {
  id: string;
  title: string;
  content: string;
  category: string;
  images?: string[];
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  likes: number;
  comments: number;
  bookmarks: number;
}

interface Props {
  post: PostItem;
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'click', post: PostItem): void;
  (e: 'like', id: string): void;
  (e: 'comment', id: string): void;
  (e: 'bookmark', id: string): void;
  (e: 'share', id: string): void;
}>();

const isLiked = ref(false);
const isBookmarked = ref(false);
const likeCount = ref(props.post.likes);
const bookmarkCount = ref(props.post.bookmarks);
</script>

<style scoped>
.post-card {
  background: #1E2532;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.post-card:hover {
  box-shadow: 0 8px 24px -8px rgba(74, 95, 139, 0.2);
  border-color: #4A5F8B;
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.post-card:hover .author-avatar {
  border-color: #4A5F8B;
  transform: scale(1.05);
}

.author-details {
  flex: 1;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 2px 0;
}

.post-date {
  font-size: 13px;
  color: #6B7C93;
  margin: 0;
}

.category-tag {
  padding: 6px 12px;
  background: rgba(74, 95, 139, 0.2);
  color: #4A5F8B;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.post-title {
  font-size: 18px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.post-content {
  font-size: 14px;
  color: #B8C6D8;
  line-height: 1.6;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 12px;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.post-card:hover .post-image {
  transform: scale(1.05);
}

.more-images {
  position: relative;
  aspect-ratio: 16/9;
  background: #0F1C2D;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.3s ease;
}

.more-images:hover {
  background: rgba(74, 95, 139, 0.3);
}

.more-images span {
  font-size: 18px;
  font-weight: 700;
  color: #6B7C93;
}

.post-actions {
  display: flex;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(74, 95, 139, 0.2);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: transparent;
  border: none;
  color: #6B7C93;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.action-btn:hover {
  background: rgba(74, 95, 139, 0.1);
  transform: translateY(-2px);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.active {
  color: #FF6B6B;
}

.action-btn.active:first-child {
  color: #FF6B6B;
}

.action-btn.active:nth-child(3) {
  color: #F6AD55;
}

.action-btn i {
  font-size: 16px;
}
</style>
