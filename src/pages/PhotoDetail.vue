<template>
  <div class="min-h-screen bg-black">
    <div class="mx-auto" style="max-width: 1440px">
      <div class="relative bg-black flex items-center justify-center" style="min-height: 60vh">
        <div class="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80 z-10 pointer-events-none"></div>
        <img :src="mockPhotoPost.image" :alt="mockPhotoPost.title" class="w-full object-contain" style="max-height: 80vh" />
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div>
            <div class="flex items-start justify-between mb-4">
              <div>
                <h1 class="text-2xl font-bold text-white">{{ mockPhotoPost.title }}</h1>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span v-for="tag in mockPhotoPost.tags" :key="tag" class="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-sm rounded-full">
                    #{{ tag }}
                  </span>
                </div>
              </div>
              <span class="text-sm text-[#6B7C93]">{{ mockPhotoPost.date }}</span>
            </div>

            <div class="bg-[#1E2532] rounded-xl p-6">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 rounded-full overflow-hidden"><LazyImage :src="mockPhotoPost.author.avatar" :alt="mockPhotoPost.author.name" :lazy="false" /></div>
                <div>
                  <h3 class="font-medium text-white">{{ mockPhotoPost.author.name }}</h3>
                  <p class="text-sm text-[#6B7C93]">{{ mockPhotoPost.author.followers }} 粉丝 · {{ mockPhotoPost.author.posts }} 作品</p>
                </div>
                <button
                  @click="isFollowing = !isFollowing; showSuccess(isFollowing ? `已关注 @${mockPhotoPost.author.name}` : `已取消关注 @${mockPhotoPost.author.name}`)"
                  :class="['ml-auto px-4 py-2 rounded-lg transition-colors', isFollowing ? 'bg-[#1E2532] border border-[#4A5F8B] text-[#4A5F8B]' : 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]']"
                >
                  {{ isFollowing ? '已关注' : '+ 关注' }}
                </button>
              </div>

              <p class="text-[#B8C6D8] whitespace-pre-line">{{ mockPhotoPost.description }}</p>
            </div>

            <div class="mt-6 bg-[#1E2532] rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white mb-4">EXIF 信息</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p class="text-sm text-[#6B7C93]">相机</p>
                  <p class="text-white text-sm font-mono">{{ mockPhotoPost.exif.camera }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93]">镜头</p>
                  <p class="text-white text-sm font-mono">{{ mockPhotoPost.exif.lens }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93]">光圈</p>
                  <p class="text-white text-sm font-mono">{{ mockPhotoPost.exif.aperture }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93]">快门</p>
                  <p class="text-white text-sm font-mono">{{ mockPhotoPost.exif.shutter }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93]">ISO</p>
                  <p class="text-white text-sm font-mono">{{ mockPhotoPost.exif.iso }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93]">焦距</p>
                  <p class="text-white text-sm font-mono">{{ mockPhotoPost.exif.focalLength }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93]">白平衡</p>
                  <p class="text-white text-sm font-mono">{{ mockPhotoPost.exif.whiteBalance }}</p>
                </div>
                <div>
                  <p class="text-sm text-[#6B7C93]">拍摄时间</p>
                  <p class="text-white text-sm font-mono">{{ mockPhotoPost.exif.date }}</p>
                </div>
              </div>
            </div>

            <div class="mt-6 bg-[#1E2532] rounded-xl p-6">
              <h3 class="text-lg font-semibold text-white mb-4">评论 ({{ photoComments.length }})</h3>
              <div class="flex gap-3 mb-4">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-sm font-bold">{{ currentUser.charAt(0) }}</span>
                </div>
                <form @submit.prevent="submitPhotoComment" class="flex-1 flex gap-2">
                  <input
                    v-model="newPhotoComment"
                    placeholder="写下你的评论..."
                    class="flex-1 px-4 py-2 bg-[#0F1C2D] border border-[#4A5F8B] rounded-lg text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
                  />
                  <button
                    type="submit"
                    :disabled="!newPhotoComment.trim()"
                    :class="['px-4 py-2 rounded-lg transition-colors', newPhotoComment.trim() ? 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]' : 'bg-gray-600 text-white cursor-not-allowed']"
                  >
                    发送
                  </button>
                </form>
              </div>
              <div v-if="photoComments.length === 0" class="text-center py-8 text-[#6B7C93]">
                暂无评论，快来发表第一条评论吧
              </div>
              <div v-for="comment in photoComments" :key="comment.id" class="flex gap-3 py-4 border-t border-[#4A5F8B]/30">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B] flex items-center justify-center flex-shrink-0">
                  <span class="text-white text-xs font-bold">{{ comment.author.charAt(0) }}</span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-white text-sm font-medium">{{ comment.author }}</span>
                    <span class="text-xs text-[#6B7C93]">{{ comment.time }}</span>
                  </div>
                  <p class="text-[#B8C6D8] text-sm">{{ comment.content }}</p>
                </div>
              </div>
            </div>

            <CommentSection :post-id="mockPhotoPost.id" />
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6 sticky top-8">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-white">互动数据</h3>
              <span class="text-sm text-[#6B7C93]">{{ mockPhotoPost.views }} 浏览</span>
            </div>

            <div class="flex items-center gap-8">
              <button
                @click="handleLike"
                :class="['flex items-center gap-2 transition-colors', isLiked ? 'text-[#F56565]' : 'text-[#6B7C93] hover:text-white']"
              >
                <i :class="['fa-solid', isLiked ? 'fa-heart' : 'fa-heart']"></i>
                <span class="font-medium">{{ likes }}</span>
              </button>
              <button class="flex items-center gap-2 text-[#6B7C93] hover:text-white transition-colors">
                <i class="fa-solid fa-comment"></i>
                <span class="font-medium">{{ mockPhotoPost.comments + photoComments.length }}</span>
              </button>
              <button
                @click="handleBookmark"
                :class="['flex items-center gap-2 transition-colors', isBookmarked ? 'text-[#4A5F8B]' : 'text-[#6B7C93] hover:text-white']"
              >
                <i :class="['fa-solid', isBookmarked ? 'fa-bookmark' : 'fa-bookmark']"></i>
                <span class="font-medium">{{ collections }}</span>
              </button>
            </div>

            <div class="mt-4 pt-4 border-t border-[#4A5F8B]/30">
              <div class="flex gap-2">
                <button @click="handleShare" class="flex-1 px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors flex items-center justify-center gap-2">
                  <i class="fa-solid fa-share"></i>
                  <span>分享</span>
                </button>
                <button @click="handleDownload(mockPhotoPost.title)" class="flex-1 px-4 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg hover:bg-[#4A5F8B]/10 transition-colors flex items-center justify-center gap-2">
                  <i class="fa-solid fa-download"></i>
                  <span>下载</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="mockPhotoPost.author.has专栏" class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <i class="fa-solid fa-book-open text-purple-400"></i>
              </div>
              <div class="flex-1">
                <h3 class="font-medium text-white">订阅专栏</h3>
                <p class="text-sm text-[#B8C6D8]">获取独家摄影教程和技巧</p>
              </div>
              <button
                @click="isSubscribed = !isSubscribed; showSuccess(isSubscribed ? '订阅成功' : '已取消订阅')"
                :class="['px-4 py-2 rounded-lg transition-colors', isSubscribed ? 'bg-[#1E2532] border border-[#4A5F8B] text-[#4A5F8B]' : 'bg-purple-500 text-white hover:bg-purple-600']"
              >
                {{ isSubscribed ? '已订阅' : `¥${mockPhotoPost.author.专栏价格}/年` }}
              </button>
            </div>
          </div>

          <div class="bg-[#1E2532] rounded-xl p-6">
            <h3 class="text-lg font-semibold text-white mb-4">授权选项</h3>
            <div class="space-y-3">
              <div
                v-for="option in mockPhotoPost.licensingOptions"
                :key="option.id"
                :class="['p-4 rounded-lg border cursor-pointer transition-colors', selectedLicense?.id === option.id ? 'border-[#4A5F8B] bg-[#4A5F8B]/10' : 'border-[#4A5F8B]/30 hover:border-[#4A5F8B]']"
                @click="selectedLicense = option"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <h4 class="font-medium text-white">{{ option.name }}</h4>
                    <p class="text-sm text-[#6B7C93]">{{ option.description }}</p>
                  </div>
                  <span class="text-[#4A5F8B] font-semibold">¥{{ option.price }}</span>
                </div>
              </div>
            </div>
            <button
              v-if="selectedLicense"
              @click="showSuccess(`已购买「${selectedLicense.name}」授权，金额 ¥${selectedLicense.price}`)"
              class="w-full mt-4 px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors"
            >
              立即购买授权
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showDonationModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="showDonationModal = false">
        <div class="w-full max-w-md bg-[#1E2532] rounded-xl p-6" @click.stop>
          <h3 class="text-xl font-bold text-white mb-4">打赏作者</h3>
          <div class="grid grid-cols-4 gap-3 mb-4">
            <button
              v-for="option in mockPhotoPost.donationOptions.slice(0, 3)"
              :key="option.id"
              @click="selectedDonation = option"
              :class="['p-3 rounded-lg border text-center transition-colors', selectedDonation?.id === option.id ? 'border-[#4A5F8B] bg-[#4A5F8B]/10' : 'border-[#4A5F8B]/30']"
            >
              <p class="text-xl font-bold text-[#4A5F8B]">¥{{ option.amount }}</p>
              <p class="text-xs text-[#6B7C93]">{{ option.name }}</p>
            </button>
            <button
              @click="selectedDonation = mockPhotoPost.donationOptions[3]"
              :class="['p-3 rounded-lg border text-center transition-colors', selectedDonation?.id === 'custom' ? 'border-[#4A5F8B] bg-[#4A5F8B]/10' : 'border-[#4A5F8B]/30']"
            >
              <p class="text-xl font-bold text-[#4A5F8B]">自定义</p>
              <p class="text-xs text-[#6B7C93]">金额</p>
            </button>
          </div>
          <div v-if="selectedDonation?.id === 'custom'" class="mb-4">
            <input
              type="number"
              v-model="customDonationAmount"
              placeholder="请输入打赏金额"
              class="w-full px-4 py-2 bg-[#0F1C2D] border border-[#4A5F8B] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]"
            />
          </div>
          <div class="flex justify-end gap-3">
            <button @click="showDonationModal = false" class="px-4 py-2 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg">
              取消
            </button>
            <button
              @click="handleDonate"
              :disabled="!canDonate"
              :class="['px-4 py-2 rounded-lg', canDonate ? 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]' : 'bg-gray-600 text-white cursor-not-allowed']"
            >
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
  title: '黑白光影',
  description: '极简主义黑白摄影，通过光影对比展现建筑的几何美感。\n\n创作灵感：\n在城市中漫步时，被这座建筑的几何线条所吸引，阳光透过窗户形成的光影效果完美呈现了极简美学。\n\n拍摄参数：\n- 相机：Leica Q2 Monochrom\n- 镜头：Summilux 28mm f/1.7 ASPH\n- 光圈：f/2.8\n- 快门速度：1/125s\n- ISO：800\n- 构图：三分法，利用线条引导视线\n\n后期处理：\n1. 轻微调整对比度，增强黑白对比\n2. 调整高光和阴影，保留细节\n3. 使用渐变滤镜调整天空和地面的曝光平衡\n4. 轻微锐化，增强建筑线条感',
  image: 'https://picsum.photos/1280/720?random=275',
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
</style>