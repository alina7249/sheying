<template>
  <div
    class="photography-card"
    :class="{ 'card-hovered': isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="card-image-wrapper">
      <router-link :to="`/photo-detail/${post.id}`" class="card-image-link">
        <LazyImage :src="post.imageUrl" :alt="post.title" />
        <div class="image-overlay">
          <div class="overlay-content">
            <div class="quick-actions">
              <button
                @click.stop="handleLike"
                :class="['action-btn', { active: post.hasThumb }]"
                :aria-label="post.hasThumb ? '取消点赞' : '点赞'"
              >
                <i :class="['fa-solid fa-heart', isLikeAnimating ? 'heart-pulse' : '']"></i>
                <span>{{ post.thumbNum }}</span>
              </button>
              <button
                @click.stop="handleBookmark"
                :class="['action-btn', { active: post.hasFavour }]"
                :aria-label="post.hasFavour ? '取消收藏' : '收藏'"
              >
                <i class="fa-solid fa-bookmark"></i>
                <span>{{ post.favourNum }}</span>
              </button>
            </div>
          </div>
        </div>
      </router-link>
      
      <div class="tag-overlay">
        <span
          v-for="(tag, index) in (post.tagList || []).slice(0, 2)"
          :key="index"
          class="tag-badge"
        >
          #{{ tag }}
        </span>
        <span v-if="(post.tagList || []).length > 2" class="tag-badge">
          +{{ (post.tagList || []).length - 2 }}
        </span>
      </div>
    </div>

    <div class="card-content">
      <div class="author-section">
        <router-link :to="`/profile/${post.userId}`" class="author-avatar-link">
          <img
            :src="post.user?.userAvatar || 'https://picsum.photos/400/400?random=' + post.userId"
            :alt="post.user?.userName"
            class="author-avatar"
            loading="lazy"
          />
          <div class="avatar-border"></div>
        </router-link>
        <div class="author-info">
          <router-link
            :to="`/profile/${post.userId}`"
            class="author-name"
          >
            {{ post.user?.userName || '匿名用户' }}
          </router-link>
          <p class="post-date">
            <i class="fa-regular fa-calendar mr-1"></i>
            {{ formatDate(post.createTime) }}
          </p>
        </div>
      </div>

      <router-link :to="`/photo-detail/${post.id}`" class="card-title-link">
        <h3 class="card-title">{{ post.title }}</h3>
      </router-link>

      <p v-if="equipmentParams" class="equipment-params">
        {{ equipmentParams }}
      </p>

      <div class="card-footer">
        <div class="footer-actions">
          <router-link
            :to="`/photo-detail/${post.id}#comments`"
            class="footer-link"
          >
            <i class="fa-regular fa-comment"></i>
            <span>评论</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LazyImage from './LazyImage.vue';
import { thumbPost, favourPost } from '../services/api';
import { toast } from 'vue-sonner';

export interface PostVO {
  id: number;
  title: string;
  content: string;
  thumbNum: number;
  favourNum: number;
  userId: number;
  createTime: string;
  updateTime: string;
  tagList: string[];
  imageUrl: string;
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
  user?: {
    id: number;
    userName: string;
    userAvatar: string;
    userProfile: string;
    userRole: string;
  };
  hasThumb?: boolean;
  hasFavour?: boolean;
}

const props = defineProps<{
  post: PostVO;
}>();

const emit = defineEmits<{
  (e: 'update', post: PostVO): void;
}>();

const isHovered = ref(false);
const isLikeAnimating = ref(false);

const equipmentParams = computed(() => {
  const parts: string[] = [];
  if (props.post.camera) parts.push(props.post.camera);
  if (props.post.lens) parts.push(props.post.lens);
  if (props.post.aperture) parts.push(`f/${props.post.aperture}`);
  if (props.post.shutter) parts.push(props.post.shutter);
  if (props.post.iso) parts.push(`ISO ${props.post.iso}`);
  return parts.join(' | ');
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
};

const handleLike = async () => {
  try {
    await thumbPost(props.post.id);
    isLikeAnimating.value = true;
    setTimeout(() => {
      isLikeAnimating.value = false;
    }, 400);
    const updated = { ...props.post };
    updated.hasThumb = !updated.hasThumb;
    updated.thumbNum = (updated.thumbNum || 0) + (updated.hasThumb ? 1 : -1);
    emit('update', updated);
  } catch (error: any) {
    toast.error(error.message || '操作失败');
  }
};

const handleBookmark = async () => {
  try {
    await favourPost(props.post.id);
    const updated = { ...props.post };
    updated.hasFavour = !updated.hasFavour;
    updated.favourNum = (updated.favourNum || 0) + (updated.hasFavour ? 1 : -1);
    emit('update', updated);
    toast.success(updated.hasFavour ? '收藏成功' : '已取消收藏');
  } catch (error: any) {
    toast.error(error.message || '操作失败');
  }
};
</script>

<style scoped>
.photography-card {
  background: #1E2532;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(74, 95, 139, 0.15);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.photography-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  border-color: rgba(201, 169, 98, 0.3);
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
}

.card-image-wrapper :deep(img) {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-hovered .card-image-wrapper :deep(img) {
  transform: scale(1.06);
}

.card-image-link {
  display: block;
  width: 100%;
  height: 100%;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(30, 37, 50, 0.9) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: flex-end;
  padding: 16px;
}

.card-hovered .image-overlay {
  opacity: 1;
}

.overlay-content {
  width: 100%;
}

.quick-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: rgba(74, 95, 139, 0.9);
  color: #F5F7FA;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.action-btn:hover {
  background: #6B7C93;
  transform: scale(1.05);
}

.action-btn:active {
  transform: scale(0.95);
}

.action-btn.active {
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
}

.action-btn.active .fa-heart {
  color: #fff;
}

.heart-pulse {
  animation: heartPulse 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes heartPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.tag-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-badge {
  padding: 6px 12px;
  background: rgba(74, 95, 139, 0.9);
  backdrop-filter: blur(10px);
  color: #F5F7FA;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
  border: 1px solid rgba(245, 247, 250, 0.1);
  transition: border-color 0.3s ease, transform 0.3s ease;
}

.card-hovered .tag-badge {
  transform: translateY(-2px);
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.author-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.author-avatar-link {
  position: relative;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid transparent;
  transition: border-color 0.3s ease, transform 0.3s ease;
}

.avatar-border {
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid #4A5F8B;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-hovered .avatar-border {
  opacity: 1;
  transform: scale(1);
}

.card-hovered .author-avatar {
  border-color: #4A5F8B;
  transform: scale(1.05);
}

.author-info {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: #F5F7FA;
  text-decoration: none;
  display: block;
  transition: color 0.3s ease;
}

.author-name:hover {
  color: #4A5F8B;
}

.post-date {
  font-size: 12px;
  color: #6B7C93;
  margin: 2px 0 0 0;
}

.card-title-link {
  text-decoration: none;
  display: block;
  margin-bottom: 8px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0;
  line-height: 1.3;
  transition: color 0.3s ease;
}

.card-title-link:hover .card-title {
  color: #4A5F8B;
}

.equipment-params {
  font-size: 11px;
  color: #6B7C93;
  font-family: 'SF Mono', 'Courier New', monospace;
  background: rgba(74, 95, 139, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  margin: 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-footer {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(74, 95, 139, 0.2);
}

.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #B8C6D8;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #4A5F8B;
}

.footer-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  font-size: 13px;
  color: #6B7C93;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
