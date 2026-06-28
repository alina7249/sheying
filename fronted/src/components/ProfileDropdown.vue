<template>
  <Teleport to="body">
    <Transition name="dropdown">
      <div v-if="isOpen" class="fixed inset-0 z-50">
        <div
          class="absolute inset-0 bg-black/50"
          @click="onClose"
        />

        <div
          class="absolute top-16 right-4 w-[280px] max-w-[90%] bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg shadow-lg overflow-hidden z-50 profile-dropdown-container"
        >
          <!-- 用户信息头部 -->
          <div class="px-5 py-4 border-b border-[#4A5F8B]/50">
            <router-link
              :to="`/profile/${userId}`"
              class="flex items-center space-x-4 hover:opacity-80 transition-opacity"
              @click="onClose">
              <div class="w-14 h-14 rounded-full border-2 border-[#4A5F8B] overflow-hidden shadow-md">
                <img
                  :src="avatarSrc"
                  alt="User avatar"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="flex-1">
                <h2 class="text-lg font-bold text-[#F5F7FA] mb-1">{{ username }}</h2>
                <p class="text-[#6B7C93] text-sm">摄影师</p>
              </div>
              <i class="fa-solid fa-chevron-right text-[#6B7C93]"></i>
            </router-link>
          </div>

          <!-- 菜单列表 -->
          <div class="max-h-[300px] overflow-y-auto py-2">
            <router-link
              :to="`/profile/${userId}`"
              @click="onClose"
              class="flex items-center py-3 px-5 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-colors">
              <i class="fa-solid fa-user mr-3 text-[#4A5F8B]"></i>
              <span>个人主页</span>
            </router-link>

            <router-link
              to="/publish"
              @click="onClose"
              class="flex items-center py-3 px-5 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-colors">
              <i class="fa-solid fa-cloud-upload-alt mr-3 text-[#4A5F8B]"></i>
              <span>上传作品</span>
            </router-link>

            <router-link
              to="/profile-settings"
              @click="onClose"
              class="flex items-center py-3 px-5 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-colors">
              <i class="fa-solid fa-cog mr-3 text-[#4A5F8B]"></i>
              <span>设置</span>
            </router-link>

            <router-link
              to="/change-password"
              @click="onClose"
              class="flex items-center py-3 px-5 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-colors">
              <i class="fa-solid fa-lock mr-3 text-[#4A5F8B]"></i>
              <span>修改密码</span>
            </router-link>

            <router-link
              to="/my-collections"
              @click="onClose"
              class="flex items-center py-3 px-5 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-colors">
              <i class="fa-solid fa-bookmark mr-3 text-[#4A5F8B]"></i>
              <span>我的收藏</span>
            </router-link>

            <router-link
              to="/aichat"
              @click="onClose"
              class="flex items-center py-3 px-5 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-colors">
              <i class="fa-solid fa-robot mr-3 text-[#4A5F8B]"></i>
              <span>AI 助手</span>
            </router-link>

            <router-link
              to="/membership"
              @click="onClose"
              class="flex items-center py-3 px-5 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-colors">
              <i class="fa-solid fa-crown mr-3 text-[#C9A962]"></i>
              <span>会员中心</span>
            </router-link>

            <div class="h-px bg-[#4A5F8B]/30 my-2"></div>

            <button
              @click="handleLogout"
              class="w-full flex items-center py-3 px-5 text-[#B8C6D8] hover:bg-[#4A5F8B]/30 hover:text-[#F5F7FA] transition-colors">
              <i class="fa-solid fa-sign-out-alt mr-3 text-[#4A5F8B]"></i>
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../store/authStore';

const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
  username: string;
  avatarSrc: string;
  userId?: string;
}>();

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  props.onClose();
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (props.isOpen && !target.closest('.profile-dropdown-container')) {
    props.onClose();
  }
};

onMounted(() => {
  if (props.isOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}

.dropdown-enter-from > div:last-child,
.dropdown-leave-to > div:last-child {
  transform: translateY(-20px);
}
</style>