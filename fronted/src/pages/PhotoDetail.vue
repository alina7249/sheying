<template>
  <div class="min-h-screen bg-[#0a0f1a] text-white">
    <div class="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0F1C2D] to-[#050810] pointer-events-none z-0"></div>
    <div class="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;);"></div>
    
    <div class="relative z-10">
      <div v-if="loading" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <i class="fa-solid fa-circle-notch fa-spin text-4xl text-[#63B3ED] mb-4"></i>
          <p class="text-[#B8C6D8]">加载中…</p>
        </div>
      </div>

      <div v-else-if="!post" class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <i class="fa-regular fa-image text-6xl text-[#6B7C93] mb-4"></i>
          <p class="text-[#B8C6D8] text-lg mb-4">作品不存在或已被删除</p>
          <router-link to="/" class="text-[#63B3ED] hover:underline">返回首页</router-link>
        </div>
      </div>

      <template v-else>
        <div class="relative bg-black">
          <div class="relative max-w-7xl mx-auto">
            <div class="relative flex items-center justify-center min-h-[70vh] md:min-h-[85vh]">
              <img :src="post.imageUrl" :alt="post.title" class="max-w-full max-h-[85vh] object-contain" />
              
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div class="lg:col-span-2 space-y-8">
              <div class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl">
                <div class="flex flex-wrap items-start justify-between gap-6 mb-6">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-4">
                      <span class="w-1 h-8 bg-gradient-to-b from-[#4A5F8B] to-[#63B3ED] rounded-full"></span>
                      <span class="text-sm font-medium text-[#63B3ED] tracking-widest uppercase">作品详情</span>
                    </div>
                    <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ post.title }}</h1>
                    <div class="flex flex-wrap gap-2">
                      <span v-for="tag in post.tagList" :key="tag" class="px-4 py-1.5 bg-[#4A5F8B]/15 text-[#63B3ED] text-sm rounded-full border border-[#4A5F8B]/20">
                        #{{ tag }}
                      </span>
                    </div>
                  </div>
                  <span class="text-sm text-[#6B7C93] flex items-center gap-2">
                    <i class="fa-regular fa-calendar"></i>
                    {{ formatDate(post.createTime) }}
                  </span>
                </div>

                <div class="flex items-center gap-5 p-5 bg-[#0F1C2D]/60 rounded-2xl border border-[#4A5F8B]/10 mb-6">
                  <div class="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#4A5F8B]">
                    <img :src="post.user?.userAvatar || 'https://picsum.photos/400/400?random=' + post.userId" :alt="post.user?.userName" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-white mb-1">{{ post.user?.userName || '匿名用户' }}</h3>
                    <p class="text-sm text-[#6B7C93]">{{ post.user?.userProfile || '热爱摄影的创作者' }}</p>
                  </div>
                  <button @click="handleFollow" :class="['px-6 py-2.5 rounded-xl font-medium transition-all duration-300', isFollowing ? 'bg-[#0F1C2D] border border-[#4A5F8B] text-[#63B3ED] hover:bg-[#4A5F8B]/10' : 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white hover:shadow-lg hover:shadow-[#4A5F8B]/30']">
                    {{ isFollowing ? '已关注' : '+ 关注' }}
                  </button>
                </div>

                <div class="mb-6">
                  <h4 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-quote-left text-[#4A5F8B]"></i>
                    作品描述
                  </h4>
                  <p class="text-[#B8C6D8] leading-relaxed whitespace-pre-line text-lg">{{ post.content }}</p>
                </div>
              </div>

              <div v-if="hasExif" class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl">
                <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <i class="fa-solid fa-camera text-[#63B3ED]"></i>
                  EXIF 信息
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div v-if="post.camera" class="bg-[#0F1C2D]/60 rounded-2xl p-5 border border-[#4A5F8B]/10">
                    <p class="text-xs text-[#6B7C93] uppercase tracking-wider mb-2">相机</p>
                    <p class="text-white text-sm font-mono font-semibold">{{ post.camera }}</p>
                  </div>
                  <div v-if="post.lens" class="bg-[#0F1C2D]/60 rounded-2xl p-5 border border-[#4A5F8B]/10">
                    <p class="text-xs text-[#6B7C93] uppercase tracking-wider mb-2">镜头</p>
                    <p class="text-white text-sm font-mono font-semibold">{{ post.lens }}</p>
                  </div>
                  <div v-if="post.aperture" class="bg-[#0F1C2D]/60 rounded-2xl p-5 border border-[#4A5F8B]/10">
                    <p class="text-xs text-[#6B7C93] uppercase tracking-wider mb-2">光圈</p>
                    <p class="text-white text-sm font-mono font-semibold">f/{{ post.aperture }}</p>
                  </div>
                  <div v-if="post.shutter" class="bg-[#0F1C2D]/60 rounded-2xl p-5 border border-[#4A5F8B]/10">
                    <p class="text-xs text-[#6B7C93] uppercase tracking-wider mb-2">快门</p>
                    <p class="text-white text-sm font-mono font-semibold">{{ post.shutter }}</p>
                  </div>
                  <div v-if="post.iso" class="bg-[#0F1C2D]/60 rounded-2xl p-5 border border-[#4A5F8B]/10">
                    <p class="text-xs text-[#6B7C93] uppercase tracking-wider mb-2">ISO</p>
                    <p class="text-white text-sm font-mono font-semibold">{{ post.iso }}</p>
                  </div>
                </div>
              </div>

              <div id="comments" class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl">
                <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <i class="fa-solid fa-comments text-[#63B3ED]"></i>
                  评论 ({{ totalComments }})
                </h3>
                
                <div class="flex gap-4 mb-8">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A5F8B] to-[#63B3ED] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4A5F8B]/30">
                    <span class="text-white text-sm font-bold">{{ currentUserName.charAt(0) }}</span>
                  </div>
                  <form @submit.prevent="submitComment" class="flex-1 flex gap-3">
                    <input v-model="newComment" placeholder="写下你的评论…" class="flex-1 px-5 py-3.5 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-2xl text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all" />
                    <button type="submit" :disabled="!newComment.trim() || submittingComment" :class="['px-6 py-3.5 rounded-2xl font-medium transition-all duration-300', newComment.trim() && !submittingComment ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white hover:shadow-lg hover:shadow-[#4A5F8B]/30' : 'bg-gray-600 text-white cursor-not-allowed']">
                      <i v-if="submittingComment" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                      {{ submittingComment ? '发送中' : '发送' }}
                    </button>
                  </form>
                </div>

                <div v-if="loadingComments" class="text-center py-12">
                  <i class="fa-solid fa-circle-notch fa-spin text-2xl text-[#63B3ED]"></i>
                </div>

                <div v-else-if="comments.length === 0" class="text-center py-12 text-[#6B7C93]">
                  <i class="fa-regular fa-comment-dots text-4xl mb-4 opacity-50"></i>
                  <p>暂无评论，快来发表第一条评论吧</p>
                </div>

                <div v-else class="space-y-4">
                  <div v-for="comment in comments" :key="comment.id" class="flex gap-4 p-5 bg-[#0F1C2D]/60 rounded-2xl border border-[#4A5F8B]/10 hover:border-[#4A5F8B]/30 transition-all">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A5F8B] to-purple-500 flex items-center justify-center flex-shrink-0">
                      <span class="text-white text-xs font-bold">{{ comment.user?.userName?.charAt(0) || 'U' }}</span>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <span class="text-white text-sm font-semibold">{{ comment.user?.userName || '匿名用户' }}</span>
                        <span class="text-xs text-[#6B7C93]">{{ formatDate(comment.createTime) }}</span>
                      </div>
                      <p class="text-[#B8C6D8] text-sm leading-relaxed">{{ comment.content }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="hasMoreComments" class="text-center mt-6">
                  <button @click="loadMoreComments" :disabled="loadingMoreComments" class="px-6 py-2 text-[#63B3ED] hover:text-white transition-colors text-sm">
                    <i v-if="loadingMoreComments" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                    {{ loadingMoreComments ? '加载中…' : '加载更多评论' }}
                  </button>
                </div>
              </div>
            </div>

            <div class="space-y-8">
              <div class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl sticky top-8">
                <div class="flex items-center justify-between mb-7">
                  <h3 class="text-lg font-bold text-white flex items-center gap-2">
                    <i class="fa-solid fa-chart-bar text-[#63B3ED]"></i>
                    互动数据
                  </h3>
                </div>

                <div class="flex items-center gap-4 mb-6">
                  <button @click="handleLike" :class="['flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-300 font-medium', post.hasThumb ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-[#0F1C2D]/60 text-[#6B7C93] border border-[#4A5F8B]/10 hover:text-white hover:border-[#4A5F8B]/30 hover:bg-[#0F1C2D]/80']">
                    <i :class="['fa-solid', post.hasThumb ? 'fa-heart' : 'fa-heart']"></i>
                    <span>{{ post.thumbNum?.toLocaleString() }}</span>
                  </button>
                  <button class="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0F1C2D]/60 text-[#6B7C93] border border-[#4A5F8B]/10 hover:text-white hover:border-[#4A5F8B]/30 hover:bg-[#0F1C2D]/80 transition-all duration-300 font-medium">
                    <i class="fa-solid fa-comment"></i>
                    <span>{{ totalComments }}</span>
                  </button>
                  <button @click="handleFavour" :class="['flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-300 font-medium', post.hasFavour ? 'bg-[#4A5F8B]/20 text-[#63B3ED] border border-[#4A5F8B]/30' : 'bg-[#0F1C2D]/60 text-[#6B7C93] border border-[#4A5F8B]/10 hover:text-white hover:border-[#4A5F8B]/30 hover:bg-[#0F1C2D]/80']">
                    <i :class="['fa-solid', post.hasFavour ? 'fa-bookmark' : 'fa-bookmark']"></i>
                    <span>{{ post.favourNum?.toLocaleString() }}</span>
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-3 pt-5 border-t border-[#4A5F8B]/10">
                  <button @click="handleShare" class="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A5F8B]/30 transition-all duration-300">
                    <i class="fa-solid fa-share"></i>
                    <span>分享</span>
                  </button>
                  <button @click="handleDownload" class="flex items-center justify-center gap-2 px-4 py-3 border border-[#4A5F8B]/30 text-[#63B3ED] rounded-xl font-medium hover:bg-[#4A5F8B]/10 transition-all duration-300">
                    <i class="fa-solid fa-download"></i>
                    <span>下载</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import { getPostDetail, thumbPost, favourPost, addComment, getCommentList, doFollow, checkFollow } from '../services/api';
import { useAuthStore } from '../store/authStore';

const route = useRoute();
const authStore = useAuthStore();
const postId = Number(route.params.id);

interface PostVO {
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

interface CommentVO {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createTime: string;
  user?: {
    id: number;
    userName: string;
    userAvatar: string;
  };
}

const post = ref<PostVO | null>(null);
const loading = ref(true);
const isFollowing = ref(false);
const newComment = ref('');
const submittingComment = ref(false);
const comments = ref<CommentVO[]>([]);
const loadingComments = ref(false);
const loadingMoreComments = ref(false);
const commentPage = ref(1);
const commentPageSize = 10;
const totalComments = ref(0);

const currentUserName = computed(() => {
  return authStore.user?.username || '用户';
});

const hasExif = computed(() => {
  if (!post.value) return false;
  return !!(post.value.camera || post.value.lens || post.value.aperture || post.value.shutter || post.value.iso);
});

const hasMoreComments = computed(() => {
  return comments.value.length < totalComments.value;
});

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN');
};

const loadPost = async () => {
  loading.value = true;
  try {
    const res: any = await getPostDetail(postId);
    if (res && res.data) {
      post.value = res.data;
    }
  } catch (error: any) {
    console.error('Failed to load post:', error);
    toast.error(error.message || '加载作品失败');
  } finally {
    loading.value = false;
  }
};

const loadComments = async (page: number = 1, append: boolean = false) => {
  if (append) {
    loadingMoreComments.value = true;
  } else {
    loadingComments.value = true;
  }
  
  try {
    const res: any = await getCommentList({
      current: page,
      pageSize: commentPageSize,
      postId: postId,
    });
    
    if (res && res.data) {
      const records = res.data.records || [];
      if (append) {
        comments.value = [...comments.value, ...records];
      } else {
        comments.value = records;
      }
      totalComments.value = res.data.total || 0;
      commentPage.value = page;
    }
  } catch (error) {
    console.error('Failed to load comments:', error);
  } finally {
    loadingComments.value = false;
    loadingMoreComments.value = false;
  }
};

const loadMoreComments = () => {
  if (loadingMoreComments.value || !hasMoreComments.value) return;
  loadComments(commentPage.value + 1, true);
};

const loadFollowStatus = async () => {
  if (!post.value?.userId || !authStore.isAuthenticated) return;
  try {
    const res: any = await checkFollow(post.value.userId);
    if (res && typeof res.data === 'boolean') {
      isFollowing.value = res.data;
    }
  } catch (error) {
    console.error('Failed to check follow status:', error);
  }
};

const handleLike = async () => {
  if (!post.value) return;
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    return;
  }
  try {
    await thumbPost(postId);
    const updated = { ...post.value };
    updated.hasThumb = !updated.hasThumb;
    updated.thumbNum = (updated.thumbNum || 0) + (updated.hasThumb ? 1 : -1);
    post.value = updated;
  } catch (error: any) {
    toast.error(error.message || '操作失败');
  }
};

const handleFavour = async () => {
  if (!post.value) return;
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    return;
  }
  try {
    await favourPost(postId);
    const updated = { ...post.value };
    updated.hasFavour = !updated.hasFavour;
    updated.favourNum = (updated.favourNum || 0) + (updated.hasFavour ? 1 : -1);
    post.value = updated;
    toast.success(updated.hasFavour ? '收藏成功' : '已取消收藏');
  } catch (error: any) {
    toast.error(error.message || '操作失败');
  }
};

const handleFollow = async () => {
  if (!post.value?.userId) return;
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    return;
  }
  try {
    await doFollow(post.value.userId);
    isFollowing.value = !isFollowing.value;
    toast.success(isFollowing.value ? '关注成功' : '已取消关注');
  } catch (error: any) {
    toast.error(error.message || '操作失败');
  }
};

const submitComment = async () => {
  if (!newComment.value.trim()) return;
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    return;
  }
  
  submittingComment.value = true;
  try {
    await addComment({
      postId: postId,
      content: newComment.value.trim(),
    });
    
    toast.success('评论发表成功');
    newComment.value = '';
    loadComments(1, false);
  } catch (error: any) {
    toast.error(error.message || '评论失败');
  } finally {
    submittingComment.value = false;
  }
};

const handleShare = () => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    toast.success('链接已复制到剪贴板');
  } else {
    toast.info('分享功能暂不可用');
  }
};

const handleDownload = () => {
  if (!post.value?.imageUrl) return;
  const link = document.createElement('a');
  link.href = post.value.imageUrl;
  link.download = `${post.value.title || 'photo'}.jpg`;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

onMounted(() => {
  loadPost().then(() => {
    loadComments(1, false);
    loadFollowStatus();
  });
});
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
</style>
