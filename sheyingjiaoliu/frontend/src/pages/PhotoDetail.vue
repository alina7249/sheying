<template>
  <div class="min-h-screen bg-[#0a0f1a] text-white">
    <!-- Premium Background Effects -->
    <div class="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0F1C2D] to-[#050810] pointer-events-none z-0"></div>
    <div class="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;);"></div>
    
    <div class="relative z-10">
      <!-- Hero Image Section - Immersive Gallery -->
      <div class="relative bg-black">
        <div class="relative max-w-7xl mx-auto">
          <div class="relative flex items-center justify-center min-h-[70vh] md:min-h-[85vh]">
            <!-- Main Image -->
            <img :src="mockPhotoPost.image" :alt="mockPhotoPost.title" class="max-w-full max-h-[85vh] object-contain" />
            
            <!-- Gradient Overlay for Better Text Readability -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>
            
            <!-- Navigation Arrows -->
            <button class="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <i class="fa-solid fa-chevron-left text-xl"></i>
            </button>
            <button class="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <i class="fa-solid fa-chevron-right text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Left Column - Content -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Title & Tags -->
            <div class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl">
              <div class="flex flex-wrap items-start justify-between gap-6 mb-6">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-4">
                    <span class="w-1 h-8 bg-gradient-to-b from-[#4A5F8B] to-[#63B3ED] rounded-full"></span>
                    <span class="text-sm font-medium text-[#63B3ED] tracking-widest uppercase">作品详情</span>
                  </div>
                  <h1 class="text-3xl md:text-4xl font-bold text-white mb-4">{{ mockPhotoPost.title }}</h1>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="tag in mockPhotoPost.tags" :key="tag" class="px-4 py-1.5 bg-[#4A5F8B]/15 text-[#63B3ED] text-sm rounded-full border border-[#4A5F8B]/20">
                      #{{ tag }}
                    </span>
                  </div>
                </div>
                <span class="text-sm text-[#6B7C93] flex items-center gap-2">
                  <i class="fa-regular fa-calendar"></i>
                  {{ mockPhotoPost.date }}
                </span>
              </div>

              <!-- Author Card -->
              <div class="flex items-center gap-5 p-5 bg-[#0F1C2D]/60 rounded-2xl border border-[#4A5F8B]/10 mb-6">
                <div class="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#4A5F8B]">
                  <LazyImage :src="mockPhotoPost.author.avatar" :alt="mockPhotoPost.author.name" :lazy="false" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-white mb-1">{{ mockPhotoPost.author.name }}</h3>
                  <p class="text-sm text-[#6B7C93]">{{ mockPhotoPost.author.followers.toLocaleString() }} 粉丝 · {{ mockPhotoPost.author.posts }} 作品</p>
                </div>
                <button @click="isFollowing = !isFollowing; showSuccess(isFollowing ? `已关注 @${mockPhotoPost.author.name}` : `已取消关注 @${mockPhotoPost.author.name}`)" :class="['px-6 py-2.5 rounded-xl font-medium transition-all duration-300', isFollowing ? 'bg-[#0F1C2D] border border-[#4A5F8B] text-[#63B3ED] hover:bg-[#4A5F8B]/10' : 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white hover:shadow-lg hover:shadow-[#4A5F8B]/30']">
                  {{ isFollowing ? '已关注' : '+ 关注' }}
                </button>
              </div>

              <!-- Description -->
              <div class="mb-6">
                <h4 class="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <i class="fa-solid fa-quote-left text-[#4A5F8B]"></i>
                  作品描述
                </h4>
                <p class="text-[#B8C6D8] leading-relaxed whitespace-pre-line text-lg">{{ mockPhotoPost.description }}</p>
              </div>
            </div>

            <!-- EXIF Information -->
            <div class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl">
              <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i class="fa-solid fa-camera text-[#63B3ED]"></i>
                EXIF 信息
              </h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="(value, key) in mockPhotoPost.exif" :key="key" class="bg-[#0F1C2D]/60 rounded-2xl p-5 border border-[#4A5F8B]/10">
                  <p class="text-xs text-[#6B7C93] uppercase tracking-wider mb-2">{{ formatExifKey(key) }}</p>
                  <p class="text-white text-sm font-mono font-semibold">{{ value }}</p>
                </div>
              </div>
            </div>

            <!-- Comments Section -->
            <div class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl">
              <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <i class="fa-solid fa-comments text-[#63B3ED]"></i>
                评论 ({{ photoComments.length + mockPhotoPost.comments }})
              </h3>
              
              <!-- Comment Input -->
              <div class="flex gap-4 mb-8">
                <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A5F8B] to-[#63B3ED] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#4A5F8B]/30">
                  <span class="text-white text-sm font-bold">{{ currentUser.charAt(0) }}</span>
                </div>
                <form @submit.prevent="submitPhotoComment" class="flex-1 flex gap-3">
                  <input v-model="newPhotoComment" placeholder="写下你的评论…" class="flex-1 px-5 py-3.5 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-2xl text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all" />
                  <button type="submit" :disabled="!newPhotoComment.trim()" :class="['px-6 py-3.5 rounded-2xl font-medium transition-all duration-300', newPhotoComment.trim() ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white hover:shadow-lg hover:shadow-[#4A5F8B]/30' : 'bg-gray-600 text-white cursor-not-allowed']">
                    发送
                  </button>
                </form>
              </div>

              <!-- Comment List -->
              <div v-if="photoComments.length === 0" class="text-center py-12 text-[#6B7C93]">
                <i class="fa-regular fa-comment-dots text-4xl mb-4 opacity-50"></i>
                <p>暂无评论，快来发表第一条评论吧</p>
              </div>
              <div v-else class="space-y-4">
                <div v-for="comment in photoComments" :key="comment.id" class="flex gap-4 p-5 bg-[#0F1C2D]/60 rounded-2xl border border-[#4A5F8B]/10 hover:border-[#4A5F8B]/30 transition-all">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#4A5F8B] to-purple-500 flex items-center justify-center flex-shrink-0">
                    <span class="text-white text-xs font-bold">{{ comment.author.charAt(0) }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <span class="text-white text-sm font-semibold">{{ comment.author }}</span>
                      <span class="text-xs text-[#6B7C93]">{{ comment.time }}</span>
                    </div>
                    <p class="text-[#B8C6D8] text-sm leading-relaxed">{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <CommentSection :post-id="mockPhotoPost.id" />
          </div>

          <!-- Right Column - Sidebar -->
          <div class="space-y-8">
            <!-- Interaction Stats -->
            <div class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl sticky top-8">
              <div class="flex items-center justify-between mb-7">
                <h3 class="text-lg font-bold text-white flex items-center gap-2">
                  <i class="fa-solid fa-chart-bar text-[#63B3ED]"></i>
                  互动数据
                </h3>
                <span class="text-sm text-[#6B7C93] flex items-center gap-1">
                  <i class="fa-regular fa-eye"></i>
                  {{ mockPhotoPost.views.toLocaleString() }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center gap-4 mb-6">
                <button @click="handleLike" :class="['flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-300 font-medium', isLiked ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-[#0F1C2D]/60 text-[#6B7C93] border border-[#4A5F8B]/10 hover:text-white hover:border-[#4A5F8B]/30 hover:bg-[#0F1C2D]/80']">
                  <i :class="['fa-solid', isLiked ? 'fa-heart' : 'fa-heart']"></i>
                  <span>{{ likes.toLocaleString() }}</span>
                </button>
                <button class="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#0F1C2D]/60 text-[#6B7C93] border border-[#4A5F8B]/10 hover:text-white hover:border-[#4A5F8B]/30 hover:bg-[#0F1C2D]/80 transition-all duration-300 font-medium">
                  <i class="fa-solid fa-comment"></i>
                  <span>{{ mockPhotoPost.comments + photoComments.length }}</span>
                </button>
                <button @click="handleBookmark" :class="['flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl transition-all duration-300 font-medium', isBookmarked ? 'bg-[#4A5F8B]/20 text-[#63B3ED] border border-[#4A5F8B]/30' : 'bg-[#0F1C2D]/60 text-[#6B7C93] border border-[#4A5F8B]/10 hover:text-white hover:border-[#4A5F8B]/30 hover:bg-[#0F1C2D]/80']">
                  <i :class="['fa-solid', isBookmarked ? 'fa-bookmark' : 'fa-bookmark']"></i>
                  <span>{{ collections.toLocaleString() }}</span>
                </button>
              </div>

              <!-- Share & Download -->
              <div class="grid grid-cols-2 gap-3 pt-5 border-t border-[#4A5F8B]/10">
                <button @click="handleShare" class="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A5F8B]/30 transition-all duration-300">
                  <i class="fa-solid fa-share"></i>
                  <span>分享</span>
                </button>
                <button @click="handleDownload(mockPhotoPost.title)" class="flex items-center justify-center gap-2 px-4 py-3 border border-[#4A5F8B]/30 text-[#63B3ED] rounded-xl font-medium hover:bg-[#4A5F8B]/10 transition-all duration-300">
                  <i class="fa-solid fa-download"></i>
                  <span>下载</span>
                </button>
              </div>
            </div>

            <!-- Premium Subscription CTA -->
            <div v-if="mockPhotoPost.author.has专栏" class="bg-gradient-to-br from-purple-900/30 via-[#1E2532] to-[#0F1C2D] border border-purple-500/20 rounded-3xl p-8 overflow-hidden relative">
              <div class="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div class="relative">
                <div class="flex items-center gap-4 mb-5">
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-purple-400">
                    <i class="fa-solid fa-book-open text-2xl"></i>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-white text-lg">订阅专栏</h3>
                    <p class="text-sm text-[#B8C6D8]">获取独家摄影教程和技巧</p>
                  </div>
                </div>
                <button @click="isSubscribed = !isSubscribed; showSuccess(isSubscribed ? '订阅成功' : '已取消订阅')" :class="['w-full py-3 rounded-xl font-medium transition-all duration-300', isSubscribed ? 'bg-[#0F1C2D] border border-purple-500/30 text-purple-400' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/30']">
                  {{ isSubscribed ? '已订阅' : `¥${mockPhotoPost.author.专栏价格}/年` }}
                </button>
              </div>
            </div>

            <!-- Licensing Options -->
            <div class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl">
              <h3 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <i class="fa-solid fa-badge-check text-[#63B3ED]"></i>
                授权选项
              </h3>
              <div class="space-y-4">
                <div v-for="option in mockPhotoPost.licensingOptions" :key="option.id" @click="selectedLicense = option" :class="['p-5 rounded-2xl border cursor-pointer transition-all duration-300', selectedLicense?.id === option.id ? 'border-[#4A5F8B] bg-[#4A5F8B]/10' : 'border-[#4A5F8B]/20 hover:border-[#4A5F8B]/50 hover:bg-[#0F1C2D]/60']">
                  <div class="flex items-center justify-between">
                    <div>
                      <h4 class="font-semibold text-white mb-1">{{ option.name }}</h4>
                      <p class="text-xs text-[#6B7C93]">{{ option.description }}</p>
                    </div>
                    <span class="text-xl font-bold text-[#63B3ED]">¥{{ option.price }}</span>
                  </div>
                </div>
              </div>
              <button v-if="selectedLicense" @click="showSuccess(`已购买「${selectedLicense.name}」授权，金额 ¥${selectedLicense.price}`)" class="w-full mt-5 px-5 py-3.5 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#4A5F8B]/30 transition-all duration-300">
                立即购买授权
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Donation Modal -->
    <Transition name="fade">
      <div v-if="showDonationModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4" @click="showDonationModal = false">
        <div class="w-full max-w-md bg-gradient-to-br from-[#1E2532] to-[#2D3748] rounded-3xl p-8 border border-[#4A5F8B]/20 shadow-2xl" @click.stop>
          <h3 class="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <i class="fa-solid fa-heart text-red-400"></i>
            打赏作者
          </h3>
          <div class="grid grid-cols-4 gap-3 mb-6">
            <button v-for="option in mockPhotoPost.donationOptions.slice(0, 3)" :key="option.id" @click="selectedDonation = option" :class="['p-4 rounded-xl border text-center transition-all duration-300', selectedDonation?.id === option.id ? 'border-[#4A5F8B] bg-[#4A5F8B]/10' : 'border-[#4A5F8B]/20 hover:border-[#4A5F8B]/50']">
              <p class="text-2xl font-bold text-[#63B3ED] mb-1">¥{{ option.amount }}</p>
              <p class="text-xs text-[#6B7C93]">{{ option.name }}</p>
            </button>
            <button @click="selectedDonation = mockPhotoPost.donationOptions[3]" :class="['p-4 rounded-xl border text-center transition-all duration-300', selectedDonation?.id === 'custom' ? 'border-[#4A5F8B] bg-[#4A5F8B]/10' : 'border-[#4A5F8B]/20 hover:border-[#4A5F8B]/50']">
              <p class="text-2xl font-bold text-[#63B3ED] mb-1">自定义</p>
              <p class="text-xs text-[#6B7C93]">金额</p>
            </button>
          </div>
          <div v-if="selectedDonation?.id === 'custom'" class="mb-6">
            <input type="number" v-model="customDonationAmount" placeholder="请输入打赏金额" class="w-full px-5 py-3.5 bg-[#0F1C2D] border border-[#4A5F8B]/20 rounded-xl text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50" />
          </div>
          <div class="flex justify-end gap-3">
            <button @click="showDonationModal = false" class="px-6 py-2.5 border border-[#4A5F8B]/30 text-[#63B3ED] rounded-xl font-medium hover:bg-[#4A5F8B]/10 transition-all duration-300">
              取消
            </button>
            <button @click="handleDonate" :disabled="!canDonate" :class="['px-6 py-2.5 rounded-xl font-medium transition-all duration-300', canDonate ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white hover:shadow-lg hover:shadow-[#4A5F8B]/30' : 'bg-gray-600 text-white cursor-not-allowed']">
              确认打赏
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useInteraction } from '../composables/useInteraction';
import CommentSection from '../components/CommentSection.vue';
import LazyImage from '../components/LazyImage.vue';

const { showSuccess, handleLike: composableLike, handleBookmark: composableBookmark, handleShare, handleDownload } = useInteraction();

interface PhotoComment {
  id: string;
  author: string;
  content: string;
  time: string;
}

const currentUser = '光影捕手';

const mockPhotoPost = {
  id: '1',
  title: '黑白光影 · 城市几何',
  description: '极简主义黑白摄影，通过光影对比展现建筑的几何美感。\n\n创作灵感：\n在城市中漫步时，被这座建筑的几何线条所吸引，阳光透过窗户形成的光影效果完美呈现了极简美学。\n\n拍摄参数：\n- 相机：Leica Q2 Monochrom\n- 镜头：Summilux 28mm f/1.7 ASPH\n- 光圈：f/2.8\n- 快门速度：1/125s\n- ISO：800\n- 构图：三分法，利用线条引导视线\n\n后期处理：\n1. 轻微调整对比度，增强黑白对比\n2. 调整高光和阴影，保留细节\n3. 使用渐变滤镜调整天空和地面的曝光平衡\n4. 轻微锐化，增强建筑线条感',
  image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2400&auto=format&fit=crop',
  author: {
    id: '1',
    name: '极简摄影师林风',
    avatar: 'https://picsum.photos/400/400?random=276',
    bio: '专注极简主义和黑白摄影',
    followers: 12543,
    following: 324,
    posts: 187,
    level: '新锐艺术家',
    has专栏: true,
    专栏价格: 399
  },
  likes: 2435,
  comments: 132,
  collections: 567,
  tags: ['极简主义', '黑白', '建筑', '徕卡', '几何', '光影'],
  date: '2023-10-25',
  location: '上海当代艺术博物馆',
  views: 12876,
  format: 'RAW',
  copyrightType: '独家授权',
  exif: {
    camera: 'Leica Q2 Monochrom',
    lens: 'Summilux 28mm f/1.7 ASPH',
    aperture: 'f/2.8',
    shutter: '1/125s',
    iso: '800',
    focalLength: '28mm',
    whiteBalance: '日光',
    date: '2023-10-25 14:30:45'
  },
  licensingOptions: [
    { id: 'standard', name: '标准授权', price: 300, description: '适用于非商业用途' },
    { id: 'commercial', name: '商业授权', price: 1200, description: '适用于商业用途' },
    { id: 'exclusive', name: '独家授权', price: 3500, description: '获得作品独家使用权' }
  ],
  donationOptions: [
    { id: 'small', name: '小额打赏', amount: 10 },
    { id: 'medium', name: '标准打赏', amount: 30 },
    { id: 'large', name: '大额打赏', amount: 50 },
    { id: 'custom', name: '自定义', amount: 0 }
  ]
};

const isLiked = ref(false);
const isBookmarked = ref(false);
const likes = ref(mockPhotoPost.likes);
const collections = ref(mockPhotoPost.collections);
const isFollowing = ref(false);
const isSubscribed = ref(false);
const selectedLicense = ref(mockPhotoPost.licensingOptions[0]);
const showDonationModal = ref(false);
const selectedDonation = ref(mockPhotoPost.donationOptions[0]);
const customDonationAmount = ref(0);
const newPhotoComment = ref('');
const photoComments = ref<PhotoComment[]>([
  { id: 'pc1', author: '极简摄影师林风', content: '感谢大家的喜欢！这张照片拍摄于上海当代艺术博物馆，光线条件非常好。', time: '2023-10-26 10:30' },
  { id: 'pc2', author: '风光爱好者', content: '构图很完美，黑白对比处理得恰到好处！', time: '2023-10-26 11:15' },
]);

const canDonate = computed(() => {
  if (selectedDonation.value?.id === 'custom') {
    return customDonationAmount.value > 0;
  }
  return selectedDonation.value?.amount > 0;
});

const formatExifKey = (key: string): string => {
  const keyMap: Record<string, string> = {
    camera: '相机',
    lens: '镜头',
    aperture: '光圈',
    shutter: '快门',
    iso: 'ISO',
    focalLength: '焦距',
    whiteBalance: '白平衡',
    date: '拍摄时间'
  };
  return keyMap[key] || key;
};

const submitPhotoComment = () => {
  if (!newPhotoComment.value.trim()) return;
  photoComments.value.unshift({
    id: `pc-${Date.now()}`,
    author: currentUser,
    content: newPhotoComment.value.trim(),
    time: new Date().toLocaleString('zh-CN')
  });
  showSuccess('评论发表成功');
  newPhotoComment.value = '';
};

const handleLike = () => {
  isLiked.value = !isLiked.value;
  likes.value += isLiked.value ? 1 : -1;
  if (isLiked.value) composableLike(mockPhotoPost.title);
};

const handleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  collections.value += isBookmarked.value ? 1 : -1;
  if (isBookmarked.value) composableBookmark(mockPhotoPost.title);
  showSuccess(isBookmarked.value ? '收藏成功' : '已取消收藏');
};

const handleDonate = () => {
  const amount = selectedDonation.value?.id === 'custom' ? customDonationAmount.value : selectedDonation.value?.amount;
  showSuccess(`已向作者打赏 ¥${amount}`);
  showDonationModal.value = false;
};
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

@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
</style>