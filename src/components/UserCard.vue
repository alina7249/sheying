<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" class="user-avatar" />
    <div class="user-info">
      <h4 class="user-name">{{ user.name }}</h4>
      <p v-if="user.level" class="user-level">{{ user.level }}</p>
      <p v-if="user.stats" class="user-stats">{{ user.stats }}</p>
    </div>
    <button
      v-if="showFollowButton"
      @click="$emit('follow', user.id)"
      class="follow-btn"
      :class="{ following: isFollowing }"
    >
      {{ isFollowing ? '已关注' : '关注' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

export interface UserItem {
  id: string;
  name: string;
  avatar: string;
  level?: string;
  stats?: string;
  posts?: number;
  followers?: number;
}

interface Props {
  user: UserItem;
  showFollowButton?: boolean;
  initialFollowing?: boolean;
}

withDefaults(defineProps<Props>(), {
  showFollowButton: true,
  initialFollowing: false
});

defineEmits<{
  (e: 'follow', id: string): void;
}>();

const isFollowing = ref(false);
</script>

<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #0F1C2D;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.user-card:hover {
  background: rgba(74, 95, 139, 0.15);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4A5F8B;
  transition: transform 0.3s ease;
}

.user-card:hover .user-avatar {
  transform: scale(1.05);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-level {
  display: inline-block;
  font-size: 11px;
  color: #4A5F8B;
  font-weight: 500;
  padding: 3px 8px;
  background: rgba(74, 95, 139, 0.1);
  border-radius: 8px;
  margin: 0 0 4px 0;
}

.user-stats {
  font-size: 12px;
  color: #6B7C93;
  margin: 0;
}

.follow-btn {
  padding: 8px 16px;
  background: #4A5F8B;
  color: #F5F7FA;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.follow-btn:hover {
  background: #6B7C93;
  transform: translateY(-2px);
}

.follow-btn:active {
  transform: scale(0.95);
}

.follow-btn.following {
  background: transparent;
  border: 1px solid #4A5F8B;
  color: #4A5F8B;
}

.follow-btn.following:hover {
  background: rgba(74, 95, 139, 0.1);
}
</style>
