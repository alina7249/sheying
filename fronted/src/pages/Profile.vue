<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <!-- 用户信息骨架屏 -->
    <div v-if="loading" class="animate-pulse">
      <div class="relative h-48 md:h-64 bg-gradient-to-r from-[#4A5F8B]/30 to-[#63B3ED]/30">
        <div class="absolute inset-0 bg-gradient-to-t from-[#0F1C2D] via-transparent to-transparent"></div>
      </div>
      <div class="max-w-6xl mx-auto px-4 -mt-20 relative">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-shrink-0">
            <div class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#4A5F8B] bg-[#1E2532]"></div>
          </div>
          <div class="flex-1">
            <div class="h-8 w-48 bg-[#1E2532] rounded mb-4"></div>
            <div class="h-4 w-full max-w-md bg-[#1E2532] rounded mb-4"></div>
            <div class="flex gap-6 mb-4">
              <div class="h-8 w-16 bg-[#1E2532] rounded"></div>
              <div class="h-8 w-16 bg-[#1E2532] rounded"></div>
              <div class="h-8 w-16 bg-[#1E2532] rounded"></div>
            </div>
            <div class="h-10 w-32 bg-[#1E2532] rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <template v-else-if="user">
      <div class="relative h-48 md:h-64 bg-gradient-to-r from-[#4A5F8B]/30 to-[#63B3ED]/30">
        <div class="absolute inset-0 bg-gradient-to-t from-[#0F1C2D] via-transparent to-transparent"></div>
      </div>

      <div class="max-w-6xl mx-auto px-4 -mt-20 relative">
        <div class="flex flex-col md:flex-row gap-6">
          <div class="flex-shrink-0 text-center md:text-left">
            <img :src="user.userAvatar || 'https://picsum.photos/400/400?random=' + user.id" :alt="user.userName" class="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#4A5F8B] object-cover mx-auto" />
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-3 mb-2">
              <h1 class="text-2xl md:text-3xl font-bold text-white">{{ user.userName }}</h1>
              <span v-if="user.userRole === 'admin' || user.userRole === 'superAdmin'" class="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-full">
                {{ user.userRole === 'superAdmin' ? '超级管理员' : '管理员' }}
              </span>
            </div>
            <p class="text-[#B8C6D8] mb-4">{{ user.userProfile || '这个人很懒，什么都没留下' }}</p>

            <div class="flex flex-wrap items-center gap-6 mb-4">
              <div class="text-center">
                <p class="text-xl font-bold text-white">{{ totalPosts }}</p>
                <p class="text-xs text-[#6B7C93]">作品</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-white">{{ stats.followers }}</p>
                <p class="text-xs text-[#6B7C93]">粉丝</p>
              </div>
              <div class="text-center">
                <p class="text-xl font-bold text-white">{{ stats.following }}</p>
                <p class="text-xs text-[#6B7C93]">关注</p>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <template v-if="!isMyProfile">
                <button @click="handleFollow" :disabled="followLoading" class="px-5 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors flex items-center gap-2">
                  <i v-if="followLoading" class="fa-solid fa-circle-notch fa-spin"></i>
                  <i v-else :class="['fa-solid', isFollowing ? 'fa-user-check' : 'fa-plus']"></i>
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
                <button @click="toast.info('私信功能即将上线')" class="px-5 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B]/10 transition-colors">
                  <i class="fa-solid fa-message-circle mr-2"></i>私信
                </button>
              </template>
              <template v-else>
                <router-link to="/profile-settings" class="px-5 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B]/10 transition-colors">
                  <i class="fa-solid fa-gear mr-2"></i>设置
                </router-link>
                <router-link to="/publish" class="px-5 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
                  <i class="fa-solid fa-plus mr-2"></i>发布作品
                </router-link>
              </template>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-[#4A5F8B]/30">
        <div class="flex gap-8 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['py-3 border-b-2 transition-colors', activeTab === tab.id ? 'border-[#4A5F8B] text-[#4A5F8B]' : 'border-transparent text-[#6B7C93] hover:text-white']"
          >
            {{ tab.name }} <span class="text-xs">({{ tab.count }})</span>
          </button>
        </div>

        <div v-if="activeTab === 'works'" class="space-y-8">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">TA的作品</h2>
            <div class="flex items-center gap-3">
              <router-link v-if="isMyProfile" to="/publish" class="px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
                <i class="fa-solid fa-plus mr-2"></i>发布作品
              </router-link>
            </div>
          </div>

          <!-- 作品列表骨架屏 -->
          <div v-if="loadingPosts && userPosts.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="n in 6" :key="n" class="bg-[#1E2532] rounded-2xl overflow-hidden">
              <div class="h-56 bg-[#2D3748] animate-pulse"></div>
              <div class="p-5">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-full bg-[#2D3748] animate-pulse"></div>
                  <div class="flex-1">
                    <div class="h-4 w-24 bg-[#2D3748] rounded animate-pulse mb-2"></div>
                    <div class="h-3 w-16 bg-[#2D3748] rounded animate-pulse"></div>
                  </div>
                </div>
                <div class="h-5 w-3/4 bg-[#2D3748] rounded animate-pulse mb-2"></div>
                <div class="h-3 w-1/2 bg-[#2D3748] rounded animate-pulse"></div>
              </div>
            </div>
          </div>

          <!-- 无作品提示 -->
          <div v-else-if="userPosts.length === 0" class="text-center py-20 bg-[#1E2532] rounded-2xl border border-[#4A5F8B]/20">
            <i class="fa-regular fa-images text-5xl text-[#6B7C93] mb-4"></i>
            <p class="text-[#B8C6D8] text-lg mb-3">{{ isMyProfile ? '你还没有发布作品' : '暂无作品' }}</p>
            <router-link v-if="isMyProfile" to="/publish" class="inline-block px-5 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              <i class="fa-solid fa-plus mr-2"></i>发布作品
            </router-link>
          </div>

          <!-- 作品列表 -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PhotographyCard
              v-for="post in userPosts"
              :key="post.id"
              :post="post"
              @update="handlePostUpdate"
            />
          </div>

          <!-- 加载更多 -->
          <div v-if="userPosts.length < totalPosts && !loadingPosts" class="text-center">
            <button @click="handleLoadMore" class="px-6 py-3 border border-[#4A5F8B] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B]/10 hover:text-white transition-colors">
              <i class="fa-solid fa-plus mr-2"></i>加载更多
            </button>
          </div>
        </div>

        <!-- 关于页 -->
        <div v-if="activeTab === 'about'" class="space-y-6">
          <div class="bg-[#1E2532] rounded-lg p-6 border border-[#4A5F8B]/20">
            <h3 class="text-lg font-semibold text-white mb-4">关于</h3>
            <div class="space-y-4 text-[#B8C6D8]">
              <p class="text-lg">{{ user?.userProfile || '这个人很懒，什么都没留下' }}</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#4A5F8B]/30">
                <div>
                  <p class="text-sm text-[#6B7C93] mb-1">加入时间</p>
                  <p class="text-white">{{ user?.createTime ? formatDate(user.createTime) : '-' }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93] mb-1">用户角色</p>
                  <p class="text-white">{{ user?.userRole === 'admin' || user?.userRole === 'superAdmin' ? '管理员' : '普通用户' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 用户不存在 -->
    <div v-else-if="!loading && loadError" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="fa-solid fa-user-slash text-6xl text-[#6B7C93] mb-6"></i>
        <p class="text-[#F5F7FA] text-xl font-semibold mb-3">{{ loadError }}</p>
        <p class="text-[#B8C6D8] mb-6">该用户不存在或已被删除</p>
        <router-link to="/" class="inline-block px-5 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
          <i class="fa-solid fa-home mr-2"></i>返回首页
        </router-link>
      </div>
    </div>

    <!-- 默认加载状态 -->
    <div v-else class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="fa-solid fa-circle-notch fa-spin text-4xl text-[#63B3ED] mb-4"></i>
        <p class="text-[#B8C6D8]">加载中…</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import PhotographyCard, { type PostVO } from '../components/PhotographyCard.vue';
import { getUserVOById, getPostList, doFollow, checkFollow, getUserFollowStats } from '../services/api';
import { useAuthStore } from '../store/authStore';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const userId = computed(() => {
  const id = route.params.id as string;
  return id ? Number(id) : null;
});

const isFollowing = ref(false);
const loading = ref(true);
const loadingPosts = ref(false);
const followLoading = ref(false);
const loadError = ref('');

const user = ref<any>(null);
const userPosts = ref<PostVO[]>([]);
const totalPosts = ref(0);
const currentPage = ref(1);
const pageSize = 12;

const stats = reactive({
  followers: 0,
  following: 0
});

const isMyProfile = computed(() => {
  if (!authStore.user || !userId.value) return false;
  return authStore.user.id === userId.value.toString();
});

const loadUser = async () => {
  if (!userId.value) {
    loading.value = false;
    return;
  }

  loading.value = true;
  loadError.value = '';

  try {
    const res: any = await getUserVOById(userId.value);
    if (res && res.data) {
      user.value = res.data;
    } else {
      loadError.value = '用户不存在';
    }
  } catch (error: any) {
    console.error('Failed to load user:', error);
    loadError.value = '加载失败';
    toast.error(error.message || '加载用户信息失败');
  } finally {
    loading.value = false;
  }
};

const loadFollowStats = async () => {
  if (!userId.value) return;

  try {
    const res: any = await getUserFollowStats(userId.value);

    if (res && res.data) {
      stats.followers = res.data.followersCount || 0;
      stats.following = res.data.followingCount || 0;
    }
  } catch (error) {
    console.error('Failed to load follow stats:', error);
  }
};

const loadUserPosts = async (page: number = 1, append: boolean = false) => {
  if (!userId.value) return;
  if (append) {
    loadingPosts.value = true;
  } else {
    loadingPosts.value = userPosts.value.length === 0;
  }

  try {
    const res: any = await getPostList({
      current: page,
      pageSize: pageSize,
      userId: userId.value,
    });

    if (res && res.data) {
      const records = res.data.records || [];
      if (append) {
        userPosts.value = [...userPosts.value, ...records];
      } else {
        userPosts.value = records;
      }
      totalPosts.value = res.data.total || 0;
      currentPage.value = page;
    }
  } catch (error: any) {
    console.error('Failed to load user posts:', error);
  } finally {
    loadingPosts.value = false;
  }
};

const loadFollowStatus = async () => {
  if (!userId.value || !authStore.isAuthenticated) return;

  try {
    const res: any = await checkFollow(userId.value);
    if (res && typeof res.data === 'boolean') {
      isFollowing.value = res.data;
    }
  } catch (error) {
    console.error('Failed to check follow status:', error);
  }
};

const handleFollow = async () => {
  if (!userId.value) return;
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    router.push('/login');
    return;
  }

  followLoading.value = true;
  try {
    await doFollow(userId.value);
    isFollowing.value = !isFollowing.value;
    toast.success(isFollowing.value ? '关注成功' : '已取消关注');
  } catch (error: any) {
    toast.error(error.message || '操作失败');
  } finally {
    followLoading.value = false;
  }
};

const handleLoadMore = () => {
  if (loadingPosts.value || userPosts.value.length >= totalPosts.value) return;
  loadUserPosts(currentPage.value + 1, true);
};

const handlePostUpdate = (updatedPost: PostVO) => {
  const index = userPosts.value.findIndex(p => p.id === updatedPost.id);
  if (index !== -1) {
    userPosts.value[index] = updatedPost;
  }
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
};

const tabs = computed(() => [
  { id: 'works', name: '作品', count: totalPosts.value },
  { id: 'about', name: '关于', count: 0 }
]);

const activeTab = ref('works');

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    user.value = null;
    userPosts.value = [];
    totalPosts.value = 0;
    isFollowing.value = false;
    loadError.value = '';
    stats.followers = 0;
    stats.following = 0;
    loadUser();
    loadUserPosts(1, false);
    loadFollowStats();
    if (authStore.isAuthenticated) {
      loadFollowStatus();
    }
  }
});

onMounted(() => {
  if (userId.value) {
    loadUser();
    loadUserPosts(1, false);
    loadFollowStats();
    if (authStore.isAuthenticated) {
      loadFollowStatus();
    }
  }
});
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