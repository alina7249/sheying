<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-8 h-8 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-[#9ca3af]">加载中...</p>
      </div>
    </div>

    <div v-else-if="!post" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <i class="fa-regular fa-image text-6xl text-[#4b5563] mb-4 block"></i>
        <p class="text-[#9ca3af] text-lg mb-4">作品不存在或已被删除</p>
        <router-link to="/" class="text-[#d4a853] hover:underline">返回首页</router-link>
      </div>
    </div>

    <div v-else class="lg:flex lg:h-[calc(100vh-64px)]">
      <!-- LEFT: Image (60%) -->
      <div class="lg:w-[60%] lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] bg-black flex items-center justify-center relative">
        <img :src="post.imageUrl" :alt="post.title" class="max-w-full max-h-full object-contain" />
        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
      </div>

      <!-- RIGHT: Info panel (40%) -->
      <div class="lg:w-[40%] overflow-y-auto">
        <div class="p-6 lg:p-10 space-y-8">
          <!-- Author -->
          <div class="flex items-center gap-4">
            <img :src="post.user?.userAvatar || 'https://picsum.photos/400/400?random=' + post.userId" :alt="post.user?.userName" class="w-12 h-12 rounded-full object-cover border-2 border-[#d4a853]" />
            <div class="flex-1">
              <h3 class="text-white font-semibold">{{ post.user?.userName || '匿名用户' }}</h3>
              <p class="text-[#9ca3af] text-sm">{{ post.user?.userProfile || '摄影爱好者' }}</p>
            </div>
            <button @click="handleFollow" :class="['px-5 py-2 rounded-full text-sm font-medium transition-all duration-200', isFollowing ? 'border border-[rgba(255,255,255,0.2)] text-[#9ca3af]' : 'bg-[#d4a853] text-[#0a0a0a] hover:shadow-lg hover:shadow-[#d4a853]/20']">
              {{ isFollowing ? '已关注' : '关注' }}
            </button>
          </div>

          <!-- Title -->
          <h1 class="font-display text-3xl font-bold text-white">{{ post.title }}</h1>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2">
            <span v-for="tag in post.tagList" :key="tag" class="px-3 py-1 bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-full text-sm text-[#9ca3af]">#{{ tag }}</span>
          </div>

          <!-- Description -->
          <p class="text-[#9ca3af] leading-relaxed">{{ post.content }}</p>

          <!-- EXIF -->
          <div v-if="hasExif">
            <h4 class="text-sm font-medium text-[#9ca3af] mb-3 uppercase tracking-wider">拍摄参数</h4>
            <div class="grid grid-cols-3 gap-2">
              <div v-if="post.camera" class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg p-3">
                <p class="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Camera</p>
                <p class="text-white text-xs font-mono truncate">{{ post.camera }}</p>
              </div>
              <div v-if="post.lens" class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg p-3">
                <p class="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Lens</p>
                <p class="text-white text-xs font-mono truncate">{{ post.lens }}</p>
              </div>
              <div v-if="post.aperture" class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg p-3">
                <p class="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Aperture</p>
                <p class="text-white text-xs font-mono">f/{{ post.aperture }}</p>
              </div>
              <div v-if="post.shutter" class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg p-3">
                <p class="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">Shutter</p>
                <p class="text-white text-xs font-mono">{{ post.shutter }}</p>
              </div>
              <div v-if="post.iso" class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg p-3">
                <p class="text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">ISO</p>
                <p class="text-white text-xs font-mono">{{ post.iso }}</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            <button @click="handleLike" :class="['flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200', post.hasThumb ? 'bg-red-500/20 text-red-400' : 'bg-[#111827] border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-white']">
              <i :class="['fa-solid fa-heart', post.hasThumb ? 'text-red-400' : '']"></i>
              {{ post.thumbNum?.toLocaleString() }}
            </button>
            <button @click="handleFavour" :class="['flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-200', post.hasFavour ? 'bg-[#d4a853]/20 text-[#d4a853]' : 'bg-[#111827] border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-white']">
              <i class="fa-solid fa-bookmark"></i>
              {{ post.favourNum?.toLocaleString() }}
            </button>
            <button @click="handleShare" class="flex items-center gap-2 px-5 py-3 rounded-full bg-[#111827] border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-white transition-all duration-200 text-sm font-medium">
              <i class="fa-solid fa-share"></i>
            </button>
            <button @click="handleDownload" class="flex items-center gap-2 px-5 py-3 rounded-full bg-[#111827] border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-white transition-all duration-200 text-sm font-medium">
              <i class="fa-solid fa-download"></i>
            </button>
            <button @click="showReportModal = true" class="flex items-center gap-2 px-5 py-3 rounded-full bg-[#111827] border border-[rgba(255,255,255,0.08)] text-[#6b7280] hover:text-red-400 transition-all duration-200 text-sm font-medium">
              <i class="fa-solid fa-flag"></i>
            </button>
          </div>

          <!-- Comments -->
          <div class="border-t border-[rgba(255,255,255,0.08)] pt-8">
            <h3 class="text-lg font-bold text-white mb-6">评论 ({{ totalComments }})</h3>
            
            <!-- Comment form -->
            <div class="flex gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-[#d4a853] flex items-center justify-center flex-shrink-0">
                <span class="text-[#0a0a0a] text-sm font-bold">{{ currentUserName.charAt(0) }}</span>
              </div>
              <form @submit.prevent="submitComment" class="flex-1">
                <input v-model="newComment" placeholder="写下你的评论..." 
                  class="w-full px-4 py-3 bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-full text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#d4a853] transition-colors" />
              </form>
            </div>

            <!-- Comment list -->
            <div v-if="loadingComments" class="text-center py-8">
              <div class="w-6 h-6 border-2 border-[#d4a853] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
            <div v-else-if="comments.length === 0" class="text-center py-8 text-[#6b7280] text-sm">
              暂无评论
            </div>
            <div v-else class="space-y-4">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
                <div class="w-9 h-9 rounded-full bg-[#374151] flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-xs font-bold">{{ comment.user?.userName?.charAt(0) || 'U' }}</span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-white text-sm font-medium">{{ comment.user?.userName || '匿名' }}</span>
                    <span class="text-[#6b7280] text-xs">{{ formatRelativeTime(comment.createTime) }}</span>
                  </div>
                  <p class="text-[#9ca3af] text-sm">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <div v-if="hasMoreComments" class="text-center mt-6">
              <button @click="loadMoreComments" :disabled="loadingMoreComments" class="px-6 py-2 text-[#d4a853] hover:text-white transition-colors text-sm">
                <i v-if="loadingMoreComments" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                {{ loadingMoreComments ? '加载中...' : '加载更多评论' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ReportModal v-model:visible="showReportModal" :target-id="postId" target-type="post" />

    <!-- Collection picker modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCollectionPicker" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/60" @click="showCollectionPicker = false"></div>
          <div class="relative bg-[#1a1a2e] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 w-full max-w-sm mx-4">
            <h3 class="text-white text-lg font-bold mb-4">选择收藏夹</h3>
            <div class="space-y-2 max-h-60 overflow-y-auto mb-4">
              <div v-for="col in collections" :key="col.id" @click="addToCollection(col.id)"
                class="flex items-center gap-3 px-4 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[#d4a853] cursor-pointer transition-colors">
                <i class="fa-solid fa-folder text-[#d4a853]"></i>
                <span class="text-white text-sm">{{ col.title }}</span>
                <span class="text-[#6b7280] text-xs ml-auto">{{ col.postCount || 0 }}个</span>
              </div>
            </div>
            <button @click="showCollectionPicker = false" class="w-full py-3 rounded-xl border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-white transition-colors">取消</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import { getPostDetail, thumbPost, favourPost, addComment, getCommentList, doFollow, checkFollow, getCollections, addPostToCollection } from '../services/api';
import ReportModal from '../components/ReportModal.vue';
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

const showReportModal = ref(false);

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

const formatRelativeTime = (time: string) => {
  if (!time) return '';
  const d = new Date(time);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  if (diff < 604800000) return Math.floor(diff / 86400000) + '天前';
  return d.toLocaleDateString('zh-CN');
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

const showCollectionPicker = ref(false);
const collections = ref<any[]>([]);

const handleFavour = async () => {
  if (!post.value) return;
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    return;
  }
  // If already favourited, toggle off
  if (post.value.hasFavour) {
    try {
      await favourPost(postId);
      post.value.hasFavour = false;
      post.value.favourNum = (post.value.favourNum || 1) - 1;
      toast.success('已取消收藏');
    } catch (e: any) {
      toast.error(e.message || '操作失败');
    }
    return;
  }
  // Load collections and show picker
  try {
    const res: any = await getCollections();
    const cols = res?.data || [];
    if (cols.length === 0) {
      // No collections, just use default favour
      await favourPost(postId);
      post.value.hasFavour = true;
      post.value.favourNum = (post.value.favourNum || 0) + 1;
      toast.success('收藏成功');
    } else {
      collections.value = cols;
      showCollectionPicker.value = true;
    }
  } catch (e: any) {
    // Fallback to default favour
    try {
      await favourPost(postId);
      post.value.hasFavour = true;
      post.value.favourNum = (post.value.favourNum || 0) + 1;
      toast.success('收藏成功');
    } catch (e2: any) {
      toast.error(e2.message || '操作失败');
    }
  }
};

const addToCollection = async (collectionId: number) => {
  try {
    await addPostToCollection(collectionId, postId);
    await favourPost(postId);
    if (post.value) {
      post.value.hasFavour = true;
      post.value.favourNum = (post.value.favourNum || 0) + 1;
    }
    toast.success('已收藏到收藏夹');
    showCollectionPicker.value = false;
  } catch (e: any) {
    toast.error(e?.message || '操作失败');
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