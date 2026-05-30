<template>
  <EquipmentDetail v-if="routeId" />
  <div v-else class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">器材交易平台</h1>
      <p class="text-[#B8C6D8] max-w-2xl mx-auto">安全可靠的摄影器材交易平台，提供专业验机、资金担保等服务，让您买卖无忧</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-8">
      <button
        @click="tradeType = 'used'; currentPage = 1; showInfo('已切换到二手器材')"
        class="py-4 rounded-xl flex items-center justify-center transition-all"
        :class="tradeType === 'used' ? 'bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8]'"
      >
        <i class="fa-solid fa-recycle text-xl mr-2"></i>
        <span class="font-medium">二手器材</span>
      </button>
      <button
        @click="tradeType = 'new'; currentPage = 1; showInfo('已切换到全新器材')"
        class="py-4 rounded-xl flex items-center justify-center transition-all"
        :class="tradeType === 'new' ? 'bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8]'"
      >
        <i class="fa-solid fa-box-open text-xl mr-2"></i>
        <span class="font-medium">全新器材</span>
      </button>
    </div>

    <FilterSection
      :type-options="equipmentTypes"
      :brand-options="brands"
      :price-options="priceRanges"
      :condition-options="conditions"
      :sort-options="sortOptions"
      :search-placeholder="`搜索${tradeType === 'used' ? '二手' : '全新'}器材...`"
      :show-condition="tradeType === 'used'"
      :result-count="currentEquipment.length"
      :type="selectedType"
      :brand="selectedBrand"
      :price="selectedPriceRange"
      :condition="selectedCondition"
      :sort="sortBy"
      :search="searchTerm"
      @update:type="selectedType = $event"
      @update:brand="selectedBrand = $event"
      @update:price="selectedPriceRange = $event"
      @update:condition="selectedCondition = $event"
      @update:sort="sortBy = $event"
      @update:search="searchTerm = $event"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <EquipmentCard
        v-for="item in currentEquipment"
        :key="item.id"
        :item="item"
        :trade-type="tradeType"
        @view-detail="handleViewDetail"
        @contact="handleContactSeller"
      />
      <div v-if="currentEquipment.length === 0" class="col-span-full p-12 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
        <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]">
          <i class="fa-solid fa-search text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关器材</h3>
        <p class="text-[#B8C6D8]">请尝试调整筛选条件或搜索其他关键词</p>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="handlePageChange(page)"
          :class="['px-3 py-2 rounded border transition-colors', page === currentPage ? 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]' : 'border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]']"
        >
          {{ page }}
        </button>
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </nav>
    </div>

    <div class="mt-12 bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
      <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">交易保障</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-start">
          <div class="w-12 h-12 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
            <i class="fa-solid fa-check-circle text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium text-[#F5F7FA] mb-2">专业验机服务</h3>
            <p class="text-sm text-[#B8C6D8]">提供第三方专业机构验机服务，确保器材真实状况与描述一致</p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="w-12 h-12 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
            <i class="fa-solid fa-shield-alt text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium text-[#F5F7FA] mb-2">资金担保</h3>
            <p class="text-sm text-[#B8C6D8]">平台提供资金担保服务，买家确认收货后卖家才能收到款项</p>
          </div>
        </div>
        <div class="flex items-start">
          <div class="w-12 h-12 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
            <i class="fa-solid fa-headset text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium text-[#F5F7FA] mb-2">7天无理由退换</h3>
            <p class="text-sm text-[#B8C6D8]">支持7天无理由退换货，让您购物无忧</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 flex justify-center">
      <button @click="showPublishForm = true" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center">
        <i class="fa-solid fa-plus-circle mr-2"></i>
        发布二手器材
      </button>
    </div>

    <ContactSellerModal :isOpen="showContactModal" :onClose="() => showContactModal = false" :seller="selectedSeller" />

    <PublishEquipmentForm :isOpen="showPublishForm" :onClose="() => showPublishForm = false" :onSubmit="handlePublishEquipment" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';
import { mockCameras, mockLenses, mockAccessories } from '../lib/equipmentData';
import EquipmentDetail from '../components/EquipmentDetail.vue';
import ContactSellerModal from '../components/ContactSellerModal.vue';
import PublishEquipmentForm from '../components/PublishEquipmentForm.vue';
import EquipmentCard, { type EquipmentItem } from '../components/EquipmentCard.vue';
import FilterSection from '../components/FilterSection.vue';

const route = useRoute();
const routeId = computed(() => route.params.id);
const { handleSubmit, showInfo } = useInteraction();

const tradeType = ref<'used' | 'new'>('used');
const selectedType = ref('全部');
const selectedBrand = ref('全部');
const selectedPriceRange = ref('全部');
const selectedCondition = ref('全部');
const searchTerm = ref('');
const sortBy = ref('recommended');
const selectedSeller = ref(null);
const showPublishForm = ref(false);
const showContactModal = ref(false);
const currentPage = ref(1);
const pageSize = 6;

const equipmentTypes = ['全部', '相机', '镜头', '配件', '无人机', '三脚架', '滤镜', '闪光灯'];
const priceRanges = ['全部', '0-5000元', '5000-10000元', '10000-20000元', '20000元以上'];
const conditions = ['全部', '99新', '95新', '9成新', '8成新', '7成新及以下'];
const brands = ['全部', 'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Leica', 'Sigma', 'Tamron', 'DJI'];

const sortOptions = [
  { value: 'recommended', label: '推荐排序' },
  { value: 'price-asc', label: '价格从低到高' },
  { value: 'price-desc', label: '价格从高到低' },
  { value: 'newest', label: '最新发布' }
];

function safeGetEquipment<T>(array: T[] | undefined, index: number, defaultValue: T): T {
  if (!array || array.length <= index || !array[index]) return defaultValue;
  return array[index];
}

const defaultCamera = { name: '索尼全画幅相机', brand: 'Sony', price: '12999', image: 'https://picsum.photos/800/600?random=115' };
const defaultLens = { name: '佳能标准变焦镜头', brand: 'Canon', price: '14999', image: 'https://picsum.photos/800/600?random=116' };
const defaultAccessory = { name: '捷信碳纤维三脚架', brand: 'Gitzo', price: '8999', image: 'https://picsum.photos/800/600?random=117' };

const mockUsedEquipment: EquipmentItem[] = [
  { id: 'ue1', name: safeGetEquipment(mockCameras, 6, defaultCamera).name, type: '相机', brand: safeGetEquipment(mockCameras, 6, defaultCamera).brand, price: '8500', originalPrice: safeGetEquipment(mockCameras, 6, defaultCamera).price, image: safeGetEquipment(mockCameras, 6, defaultCamera).image, condition: '95新', usageTime: '约1年', shutterCount: '8500次', repairHistory: '无维修记录', accessories: ['原装电池2块','充电器','相机包','说明书'], seller: { id: 's1', name: '摄影爱好者小王', avatar: 'https://picsum.photos/400/400?random=118', location: '上海', rating: 4.9, completedTransactions: 128 }, description: '2022年10月购买，使用非常小心，成色极佳。', images: Array(4).fill(safeGetEquipment(mockCameras, 6, defaultCamera).image), tags: ['索尼','全画幅','微单','二手','高性价比'] },
  { id: 'ue2', name: safeGetEquipment(mockLenses, 4, defaultLens).name, type: '镜头', brand: safeGetEquipment(mockLenses, 4, defaultLens).brand, price: '7200', originalPrice: safeGetEquipment(mockLenses, 4, defaultLens).price, image: safeGetEquipment(mockLenses, 4, defaultLens).image, condition: '9成新', usageTime: '约2年', shutterCount: '', repairHistory: '无维修记录', accessories: ['原装遮光罩','镜头盖','镜头袋'], seller: { id: 's2', name: '专业摄影师老李', avatar: 'https://picsum.photos/400/400?random=119', location: '北京', rating: 4.8, completedTransactions: 256 }, description: '经典佳能大三元标准变焦镜头。', images: Array(4).fill(safeGetEquipment(mockLenses, 4, defaultLens).image), tags: ['佳能','大三元','标准变焦','二手','专业'] },
  { id: 'ue3', name: safeGetEquipment(mockCameras, 9, defaultCamera).name, type: '相机', brand: safeGetEquipment(mockCameras, 9, defaultCamera).brand, price: '5800', originalPrice: safeGetEquipment(mockCameras, 9, defaultCamera).price, image: safeGetEquipment(mockCameras, 9, defaultCamera).image, condition: '99新', usageTime: '约3个月', shutterCount: '2300次', repairHistory: '无维修记录', accessories: ['原装电池','充电器','相机包','肩带','说明书'], seller: { id: 's3', name: '新手摄影小张', avatar: 'https://picsum.photos/400/400?random=120', location: '广州', rating: 4.7, completedTransactions: 32 }, description: '2023年7月购买，几乎全新。', images: Array(4).fill(safeGetEquipment(mockCameras, 9, defaultCamera).image), tags: ['富士','APS-C','复古','二手','套机'] },
  { id: 'ue4', name: safeGetEquipment(mockAccessories, 0, defaultAccessory).name, type: '配件', brand: safeGetEquipment(mockAccessories, 0, defaultAccessory).brand, price: '4200', originalPrice: safeGetEquipment(mockAccessories, 0, defaultAccessory).price, image: safeGetEquipment(mockAccessories, 0, defaultAccessory).image, condition: '9成新', usageTime: '约1.5年', shutterCount: '', repairHistory: '无维修记录', accessories: ['原装收纳袋','说明书'], seller: { id: 's4', name: '风光摄影师老王', avatar: 'https://picsum.photos/400/400?random=121', location: '成都', rating: 4.9, completedTransactions: 187 }, description: '2022年3月购买，碳纤维材质。', images: Array(4).fill(safeGetEquipment(mockAccessories, 0, defaultAccessory).image), tags: ['捷信','碳纤维','三脚架','二手','专业'] }
];

const mockNewEquipment: EquipmentItem[] = [
  { id: 'ne1', name: safeGetEquipment(mockCameras, 1, defaultCamera).name, type: '相机', brand: safeGetEquipment(mockCameras, 1, defaultCamera).brand, price: safeGetEquipment(mockCameras, 1, defaultCamera).price, originalPrice: safeGetEquipment(mockCameras, 1, defaultCamera).price, image: safeGetEquipment(mockCameras, 1, defaultCamera).image, seller: { id: 'b1', name: '佳能官方授权店', avatar: 'https://picsum.photos/400/400?random=122', location: '上海', rating: 4.9, completedTransactions: 1254, isOfficial: true }, description: '佳能EOS R5是一款专业级全画幅微单相机。', images: Array(4).fill(safeGetEquipment(mockCameras, 1, defaultCamera).image), tags: ['佳能','全画幅','微单','全新','专业'], warranty: '官方保修2年' },
  { id: 'ne2', name: safeGetEquipment(mockLenses, 8, defaultLens).name, type: '镜头', brand: safeGetEquipment(mockLenses, 8, defaultLens).brand, price: safeGetEquipment(mockLenses, 8, defaultLens).price, originalPrice: safeGetEquipment(mockLenses, 8, defaultLens).price, image: safeGetEquipment(mockLenses, 8, defaultLens).image, seller: { id: 'b2', name: '尼康官方授权店', avatar: 'https://picsum.photos/400/400?random=123', location: '北京', rating: 4.8, completedTransactions: 987, isOfficial: true }, description: '尼康Z卡口70-200mm F2.8 VR S镜头。', images: Array(4).fill(safeGetEquipment(mockLenses, 8, defaultLens).image), tags: ['尼康','大三元','长焦','全新','专业'], warranty: '官方保修2年' }
];

function filterByPriceRange(equipment: EquipmentItem[], range: string) {
  return equipment.filter(item => {
    const price = parseInt(item.price);
    switch (range) {
      case '0-5000元': return price <= 5000;
      case '5000-10000元': return price > 5000 && price <= 10000;
      case '10000-20000元': return price > 10000 && price <= 20000;
      case '20000元以上': return price > 20000;
      default: return true;
    }
  });
}

const filteredUsedEquipment = computed(() => {
  let equipment = [...mockUsedEquipment];
  if (selectedType.value !== '全部') equipment = equipment.filter(i => i.type === selectedType.value);
  if (selectedBrand.value !== '全部') equipment = equipment.filter(i => i.brand === selectedBrand.value);
  if (selectedPriceRange.value !== '全部') equipment = filterByPriceRange(equipment, selectedPriceRange.value);
  if (selectedCondition.value !== '全部') equipment = equipment.filter(i => i.condition === selectedCondition.value);
  if (searchTerm.value) { const term = searchTerm.value.toLowerCase(); equipment = equipment.filter(i => i.name.toLowerCase().includes(term) || i.brand.toLowerCase().includes(term) || i.type.toLowerCase().includes(term)); }
  if (sortBy.value === 'price-asc') equipment.sort((a, b) => parseInt(a.price) - parseInt(b.price));
  else if (sortBy.value === 'price-desc') equipment.sort((a, b) => parseInt(b.price) - parseInt(a.price));
  else if (sortBy.value === 'newest') equipment.sort((a, b) => parseInt(b.id.replace(/\D/g,'')) - parseInt(a.id.replace(/\D/g,'')));
  return equipment;
});

const filteredNewEquipment = computed(() => {
  let equipment = [...mockNewEquipment];
  if (selectedType.value !== '全部') equipment = equipment.filter(i => i.type === selectedType.value);
  if (selectedBrand.value !== '全部') equipment = equipment.filter(i => i.brand === selectedBrand.value);
  if (selectedPriceRange.value !== '全部') equipment = filterByPriceRange(equipment, selectedPriceRange.value);
  if (searchTerm.value) { const term = searchTerm.value.toLowerCase(); equipment = equipment.filter(i => i.name.toLowerCase().includes(term) || i.brand.toLowerCase().includes(term) || i.type.toLowerCase().includes(term)); }
  if (sortBy.value === 'price-asc') equipment.sort((a, b) => parseInt(a.price) - parseInt(b.price));
  else if (sortBy.value === 'price-desc') equipment.sort((a, b) => parseInt(b.price) - parseInt(a.price));
  else if (sortBy.value === 'newest') equipment.sort((a, b) => parseInt(b.id.replace(/\D/g,'')) - parseInt(a.id.replace(/\D/g,'')));
  return equipment;
});

const currentEquipment = computed(() => {
  const source = tradeType.value === 'used' ? filteredUsedEquipment.value : filteredNewEquipment.value;
  const start = (currentPage.value - 1) * pageSize;
  return source.slice(start, start + pageSize);
});

const totalPages = computed(() => {
  const source = tradeType.value === 'used' ? filteredUsedEquipment.value : filteredNewEquipment.value;
  return Math.ceil(source.length / pageSize);
});

const handleViewDetail = (item: EquipmentItem) => {
  showInfo(`正在查看「${item.name}」的详细信息`);
};

function handleContactSeller(seller: any) {
  selectedSeller.value = seller;
  showContactModal.value = true;
  showInfo(`正在联系卖家「${seller.name}」`);
}

function handlePublishEquipment(formData: any) {
  handleSubmit();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.container {
  max-width: 1400px;
}
</style>
