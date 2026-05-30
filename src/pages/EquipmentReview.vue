<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">器材评测</h1>
      <p class="text-[#B8C6D8] max-w-2xl mx-auto">专业摄影器材评测分析，帮助您做出明智的购买决策</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div class="relative flex-1"><input type="text" v-model="searchTerm" placeholder="搜索器材评测..." class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" /><i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i></div>
          <select v-model="sortBy" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"><option value="latest">最新</option><option value="popular">最热门</option><option value="rated">最高评分</option></select>
          <button @click="handleWriteReview" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center whitespace-nowrap border border-[#4A5F8B]"><i class="fa-solid fa-pen mr-2"></i>写评测</button>
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <button v-for="type in equipmentTypes" :key="type" @click="activeType = type" class="px-4 py-2 rounded-lg border transition-colors" :class="activeType === type ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'bg-[#2D3748] text-[#B8C6D8] border-[#4A5F8B] hover:bg-[#4A5F8B]/50'">{{ type }}</button>
        </div>

        <div class="space-y-8">
          <div v-for="review in paginatedReviews" :key="review.id" class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden transition-all cursor-pointer shadow-sm" @click="showInfo(`正在查看「${review.name}」的评测`)">
            <div class="relative"><img :src="review.image" :alt="review.name" class="w-full h-64 object-cover" /><div class="absolute top-4 left-4 flex space-x-2"><span class="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-full text-sm">{{ review.type }}</span><span class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-sm">评分: {{ review.rating }}</span></div></div>
            <div class="p-6">
              <div class="flex items-center justify-between mb-4"><div class="flex items-center"><img :src="review.reviewer.avatar" :alt="review.reviewer.name" class="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]" /><div><p class="font-medium text-[#F5F7FA]">{{ review.reviewer.name }}</p><p class="text-xs text-[#6B7C93]">{{ review.reviewer.title }}</p></div></div><span class="text-sm text-[#6B7C93]">{{ review.date }}</span></div>
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-2">{{ review.name }}</h2>
              <div class="flex items-center space-x-4 mb-4"><div class="text-lg font-bold text-[#4A5F8B]">¥{{ parseInt(review.price).toLocaleString() }}</div><span class="px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">{{ review.brand }}</span></div>
              <p class="text-[#B8C6D8] mb-6 line-clamp-3">{{ review.summary }}</p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-[#1E2532] p-3 rounded-lg"><div class="flex items-center space-x-1 text-[#4A5F8B] mb-1"><i v-for="n in 5" :key="n" :class="n <= review.imageQuality ? 'fa-solid' : 'fa-regular'" class="fa-star text-xs"></i></div><p class="text-xs text-[#B8C6D8]">画质</p></div>
                <div class="bg-[#1E2532] p-3 rounded-lg"><div class="flex items-center space-x-1 text-[#4A5F8B] mb-1"><i v-for="n in 5" :key="n" :class="n <= review.buildQuality ? 'fa-solid' : 'fa-regular'" class="fa-star text-xs"></i></div><p class="text-xs text-[#B8C6D8]">做工</p></div>
                <div class="bg-[#1E2532] p-3 rounded-lg"><div class="flex items-center space-x-1 text-[#4A5F8B] mb-1"><i v-for="n in 5" :key="n" :class="n <= review.performance ? 'fa-solid' : 'fa-regular'" class="fa-star text-xs"></i></div><p class="text-xs text-[#B8C6D8]">性能</p></div>
                <div class="bg-[#1E2532] p-3 rounded-lg"><div class="flex items-center space-x-1 text-[#4A5F8B] mb-1"><i v-for="n in 5" :key="n" :class="n <= review.value ? 'fa-solid' : 'fa-regular'" class="fa-star text-xs"></i></div><p class="text-xs text-[#B8C6D8]">性价比</p></div>
              </div>
              <div class="grid grid-cols-2 gap-4 mb-6 text-sm"><div class="flex justify-between border-b border-[#4A5F8B] pb-2"><span class="text-[#B8C6D8]">感光元件</span><span class="text-[#F5F7FA]">{{ review.specs.sensor }}</span></div><div class="flex justify-between border-b border-[#4A5F8B] pb-2"><span class="text-[#B8C6D8]">有效像素</span><span class="text-[#F5F7FA]">{{ review.specs.megapixels }}</span></div><div class="flex justify-between border-b border-[#4A5F8B] pb-2"><span class="text-[#B8C6D8]">ISO范围</span><span class="text-[#F5F7FA]">{{ review.specs.iso }}</span></div><div class="flex justify-between border-b border-[#4A5F8B] pb-2"><span class="text-[#B8C6D8]">重量</span><span class="text-[#F5F7FA]">{{ review.specs.weight }}</span></div></div>
              <div class="space-y-3 mb-6">
                <div class="bg-[#1E2532] p-3 rounded"><h4 class="font-medium text-[#4A5F8B] mb-1 text-sm">优点</h4><p class="text-sm text-[#B8C6D8]">{{ review.pros }}</p></div>
                <div class="bg-[#1E2532] p-3 rounded"><h4 class="font-medium text-[#6B7C93] mb-1 text-sm">缺点</h4><p class="text-sm text-[#B8C6D8]">{{ review.cons }}</p></div>
              </div>
              <div class="flex space-x-3"><router-link :to="`/equipment-review/${review.id}`" @click.stop class="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">查看完整评测</router-link><button @click.stop="handleCompare(review.id)" class="px-4 py-2 bg-[#2D3748] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B]"><i class="fa-solid fa-scale-balanced"></i></button></div>
            </div>
          </div>
        </div>

        <div v-if="sortedReviews.length > 0" class="flex justify-center">
          <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
            <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1" class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><i class="fa-solid fa-chevron-left text-xs"></i></button>
            <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" :class="['px-3 py-2 rounded border transition-colors', page === currentPage ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]']">{{ page }}</button>
            <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages" class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><i class="fa-solid fa-chevron-right text-xs"></i></button>
          </nav>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">评测统计</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-[#1E2A3A] rounded-lg p-3 text-center"><div class="text-2xl font-bold text-[#4A5F8B]">{{ latestReviews.length }}</div><div class="text-xs text-[#B8C6D8] mt-1">总评测数</div></div>
            <div class="bg-[#1E2A3A] rounded-lg p-3 text-center"><div class="text-2xl font-bold text-[#4A5F8B]">4.6</div><div class="text-xs text-[#B8C6D8] mt-1">平均评分</div></div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm border border-[#4A5F8B] text-[#F5F7FA]">
          <h3 class="text-lg font-bold mb-3">热门品牌对比</h3>
          <div class="space-y-3">
            <div v-for="brand in compareData" :key="brand.id" class="bg-[#2D3748]/30 p-3 rounded backdrop-blur-sm"><div class="flex justify-between items-center mb-1"><span class="text-sm font-medium">{{ brand.name }}</span><span class="text-sm">{{ brand.reviewCount }}篇评测</span></div><div class="w-full bg-[#2D3748]/50 rounded h-2 overflow-hidden"><div class="h-full bg-[#F5F7FA] rounded" :style="{ width: brand.percentage + '%' }"></div></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useInteraction } from '../composables/useInteraction';

const { showInfo, handleAction } = useInteraction();

const searchTerm = ref('');
const sortBy = ref('latest');
const activeType = ref('全部');
const currentPage = ref(1);
const pageSize = 2;
const equipmentTypes = ['全部', '相机', '镜头', '配件'];

const compareData = [
  { id: '1', name: 'Sony', reviewCount: 45, percentage: 30 },
  { id: '2', name: 'Canon', reviewCount: 38, percentage: 25 },
  { id: '3', name: 'Nikon', reviewCount: 28, percentage: 19 },
  { id: '4', name: 'Fujifilm', reviewCount: 20, percentage: 14 },
  { id: '5', name: '其他品牌', reviewCount: 18, percentage: 12 },
];

const latestReviews = [
  {
    id: 'r1', name: '索尼A7R V全画幅微单相机', brand: 'Sony', type: '相机', image: 'https://picsum.photos/800/600?random=138',
    price: '25999', rating: 4.9, date: '2023-10-25',
    reviewer: { id: 'u1', name: '摄影器材评测专家王老师', avatar: 'https://picsum.photos/400/400?random=139', title: '资深器材评测人' },
    summary: '索尼A7R V是一款拥有6100万像素的专业级全画幅微单相机，支持8K视频录制。采用AI对焦技术，对焦速度快且精准。机身防抖性能优秀，搭配高像素传感器，成像质量极佳，是目前市场上性能最强的全画幅微单相机之一。',
    imageQuality: 5, buildQuality: 4, performance: 5, value: 4,
    specs: { sensor: '全画幅CMOS', megapixels: '6100万', iso: '100-32000', weight: '723g' },
    pros: '6100万超高像素，细节表现力极强；AI对焦系统智能精准；8K视频录制能力强大；机身防抖性能优秀，手持拍摄成功率更高。',
    cons: '价格较高；高像素对存储卡需求大；8K视频拍摄时电池消耗较快，需多备电池。'
  },
  {
    id: 'r2', name: '佳能EOS R5全画幅微单相机', brand: 'Canon', type: '相机', image: 'https://picsum.photos/800/600?random=140',
    price: '25999', rating: 4.8, date: '2023-10-20',
    reviewer: { id: 'u2', name: '器材达人小李', avatar: 'https://picsum.photos/400/400?random=141', title: '摄影器材爱好者' },
    summary: '佳能EOS R5是一款4500万像素的全画幅微单相机，支持8K 30p和4K 120p视频录制。配备全像素双核对焦系统，对焦性能出色。机身防抖配合RF镜头防抖，可达8级防抖效果，是佳能专业级微单的代表作。',
    imageQuality: 5, buildQuality: 5, performance: 4, value: 4,
    specs: { sensor: '全画幅CMOS', megapixels: '4500万', iso: '100-51200', weight: '738g' },
    pros: '4500万像素成像效果出色；8级防抖系统极强；8K视频录制功能强大；机身做工精良，手感扎实，操作逻辑人性化。',
    cons: '高规格视频录制发热问题依然存在；价格较高，预算有限的用户需要考虑；RF镜头群价格较贵。'
  },
  {
    id: 'r3', name: '尼康Z8全画幅微单相机', brand: 'Nikon', type: '相机', image: 'https://picsum.photos/800/600?random=142',
    price: '27999', rating: 4.8, date: '2023-10-18',
    reviewer: { id: 'u3', name: '尼康粉丝老张', avatar: 'https://picsum.photos/400/400?random=143', title: '尼康相机深度用户' },
    summary: '尼康Z8是一款4570万像素的堆栈式CMOS全画幅微单相机，继承了Z9的核心技术，机身更紧凑。支持20fps RAW连拍、8K 60p视频录制，对焦系统智能精准，是尼康专业级微单的性能标杆。',
    imageQuality: 5, buildQuality: 5, performance: 5, value: 4,
    specs: { sensor: '堆栈式全画幅CMOS', megapixels: '4570万', iso: '64-25600', weight: '910g' },
    pros: '堆栈式CMOS读取速度快；20fps RAW连拍能力出色；8K 60p视频规格强悍；Z卡口镜头光学素质优秀，镜头群不断壮大。',
    cons: '机身较重，长时间手持拍摄会感到疲劳；价格较高，接近旗舰级定价；电池续航相比同级稍逊。'
  },
  {
    id: 'r4', name: '富士GFX100 II中画幅相机', brand: 'Fujifilm', type: '相机', image: 'https://picsum.photos/800/600?random=144',
    price: '41000', rating: 4.7, date: '2023-10-15',
    reviewer: { id: 'u4', name: '中画幅玩家老刘', avatar: 'https://picsum.photos/400/400?random=145', title: '中画幅相机深度用户' },
    summary: '富士GFX100 II是1.02亿像素的中画幅无反相机，搭载全新的X-Processor 5图像处理器，支持8fps连拍和AI对焦。1.02亿像素带来惊人的解析力，动态范围宽广，色彩表现优异，是追求极致画质的摄影师的理想选择。',
    imageQuality: 5, buildQuality: 5, performance: 4, value: 3,
    specs: { sensor: '中画幅43.8×32.9mm CMOS', megapixels: '1.02亿', iso: '100-12800', weight: '1030g' },
    pros: '1.02亿像素，解析力极强；中画幅传感器带来优秀动态范围；富士色彩科学表现出色；支持8fps连拍，中画幅中速度领先。',
    cons: '价格极其昂贵，定位高端专业用户；机身较重，随身携带不便；连拍虽在中画幅中领先，但相比全画幅仍有差距。'
  }
];

const sortedReviews = computed(() => {
  let reviews = [...latestReviews];
  if (activeType.value !== '全部') {
    if (activeType.value === '镜头') reviews = [];
    else if (activeType.value === '配件') reviews = [];
    else reviews = reviews.filter(r => r.type === activeType.value);
  }
  if (searchTerm.value) {
    const q = searchTerm.value.toLowerCase();
    reviews = reviews.filter(r => r.name.toLowerCase().includes(q) || r.brand.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q));
  }
  if (sortBy.value === 'latest') reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  else if (sortBy.value === 'popular') reviews.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (sortBy.value === 'rated') reviews.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  return reviews;
});

const paginatedReviews = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return sortedReviews.value.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  return Math.ceil(sortedReviews.value.length / pageSize);
});

function handleCompare(id: string) {
  handleAction('对比', id);
}

function handleWriteReview() {
  handleAction('写评测');
}

function handlePageChange(page: number) {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

watch([searchTerm, sortBy, activeType], () => {
  currentPage.value = 1;
})
</script>