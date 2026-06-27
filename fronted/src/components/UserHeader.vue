<template>
  <div class="user-header">
    <div class="flex items-center gap-4">
      <router-link :to="`/profile/${user.id}`" class="user-avatar-wrapper">
        <img
          :src="user.userAvatar || `https://picsum.photos/400/400?random=${user.id}`"
          :alt="user.userName"
          class="user-avatar"
        />
        <div class="avatar-ring"></div>
      </router-link>
      <div class="user-info">
        <h3 class="user-name">{{ user.userName }}</h3>
        <p class="user-bio">{{ user.userProfile || '暂无简介' }}</p>
      </div>
    </div>

    <div class="user-actions" v-if="showFollowButton">
      <button
        v-if="!isSelf"
        @click="handleFollow"
        :disabled="loading"
        :class="['follow-btn', isFollowing ? 'following' : '']"
      >
        <i v-if="loading" class="fa-solid fa-circle-notch fa-spin"></i>
        <i v-else :class="isFollowing ? 'fa-solid fa-check' : 'fa-solid fa-plus'"></i>
        <span>{{ isFollowing ? '已关注' : '关注' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toast } from 'vue-sonner';
import { doFollow } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';

interface UserVO {
  id: number;
  userName: string;
  userAvatar: string;
  userProfile?: string;
  userRole?: string;
}

const props = defineProps<{
  user: UserVO;
  isFollowing?: boolean;
  showFollowButton?: boolean;
}>();

const emit = defineEmits<{
  (e: 'follow', userId: number): void;
  (e: 'update', following: boolean): void;
}>();

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

const isSelf = computed(() => {
  return authStore.user?.id === props.user.id.toString();
});

const handleFollow = async () => {
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    router.push('/login');
    return;
  }

  loading.value = true;
  try {
    await doFollow(props.user.id);
    const newState = !props.isFollowing;
    emit('update', newState);
    emit('follow', props.user.id);
    toast.success(newState ? '关注成功' : '已取消关注');
  } catch (error: any) {
    toast.error(error.message || '操作失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(15, 28, 45, 0.6);
  border-radius: 1rem;
  border: 1px solid rgba(74, 95, 139, 0.1);
}

.user-avatar-wrapper {
  position: relative;
  display: inline-block;
}

.user-avatar {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  object-fit: cover;
  border: 2px solid #4A5F8B;
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.user-avatar-wrapper:hover .user-avatar {
  transform: scale(1.05);
  border-color: #63B3ED;
}

.avatar-ring {
  position: absolute;
  inset: -4px;
  border-radius: 1.25rem;
  border: 2px solid #4A5F8B;
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.user-avatar-wrapper:hover .avatar-ring {
  opacity: 1;
  transform: scale(1);
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 0.25rem 0;
}

.user-bio {
  font-size: 0.875rem;
  color: #6B7C93;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-actions {
  flex-shrink: 0;
}

.follow-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: linear-gradient(135deg, #4A5F8B, #63B3ED);
  color: white;
}

.follow-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -4px rgba(74, 95, 139, 0.4);
}

.follow-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.follow-btn.following {
  background: rgba(15, 28, 45, 0.8);
  border: 1px solid #4A5F8B;
  color: #63B3ED;
}

.follow-btn.following:hover:not(:disabled) {
  background: rgba(74, 95, 139, 0.1);
}
</style>
