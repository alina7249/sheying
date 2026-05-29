<template>
  <EquipmentDetail v-if="routeId" />
  <div v-else class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">器材交易平台</h1>
      <p class="text-[#B8C6D8] max-w-2xl mx-auto">安全可靠的摄影器材交易平台，提供专业验机、资金担保等服务，让您买卖无忧</p>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-8">
      <button @click="tradeType = 'used'" class="py-4 rounded-xl flex items-center justify-center transition-all" :class="tradeType === 'used' ? 'bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8]'">
        <i class="fa-solid fa-recycle text-xl mr-2"></i><span class="font-medium">二手器材</span>
      </button>
      <button @click="tradeType = 'new'" class="py-4 rounded-xl flex items-center justify-center transition-all" :class="tradeType === 'new' ? 'bg-[#4A5F8B] border-2 border-[#4A5F8B] text-[#F5F7FA] shadow-md' : 'bg-[#2D3748] border border-[#4A5F8B] text-[#B8C6D8]'">
        <i class="fa-solid fa-box-open text-xl mr-2"></i><span class="font-medium">全新器材</span>
      </button>
    </div>

    <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-4">
        <div class="relative flex-1">
          <input type="text" :placeholder="`搜索${tradeType === 'used' ? '二手' : '全新'}器材...`" v-model="searchTerm" class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
          <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
        </div>
        <select v-model="selectedType" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
          <option v-for="t in equipmentTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="selectedBrand" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
          <option v-for="b in brands" :key="b" :value="b">{{ b }}</option>
        </select>
        <select v-model="selectedPriceRange" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
          <option v-for="r in priceRanges" :key="r" :value="r">{{ r }}</option>
        </select>
        <select v-if="tradeType === 'used'" v-model="selectedCondition" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
          <option v-for="c in conditions" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
      <div class="flex justify-end">
        <select v-model="sortBy" class="px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
          <option value="recommended">推荐排序</option>
          <option value="price-asc">价格从低到高</option>
          <option value="price-desc">价格从高到低</option>
          <option value="newest">最新发布</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="item in currentEquipment" :key="item.id" class="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm cursor-pointer">
        <div class="relative">
          <img :src="item.image" :alt="item.name" class="w-full h-48 object-cover" />
          <div v-if="tradeType === 'used'" class="absolute top-3 left-3 px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs font-medium">{{ item.condition }}</div>
          <div v-if="item.seller.isOfficial" class="absolute top-3 left-3 px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs font-medium">官方授权</div>
        </div>
        <div class="p-5 bg-[#2D3748]">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-[#6B7C93] font-medium">{{ item.brand }}</span>
            <span class="text-xs px-2 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full border border-[#4A5F8B]">{{ item.type }}</span>
          </div>
          <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">{{ item.name }}</h3>
          <div class="flex items-center mb-4">
            <p class="text-lg font-bold text-[#4A5F8B]">¥{{ parseInt(item.price).toLocaleString() }}</p>
            <p v-if="item.originalPrice !== item.price" class="text-sm text-[#718096] line-through ml-2">¥{{ parseInt(item.originalPrice).toLocaleString() }}</p>
          </div>
          <div v-if="tradeType === 'used'" class="space-y-1 mb-4 text-sm">
            <div class="flex justify-between"><span class="text-[#B8C6D8]">使用时长:</span><span class="text-[#F5F7FA]">{{ item.usageTime }}</span></div>
            <div v-if="item.shutterCount" class="flex justify-between"><span class="text-[#B8C6D8]">快门次数:</span><span class="text-[#F5F7FA]">{{ item.shutterCount }}</span></div>
            <div class="flex justify-between"><span class="text-[#B8C6D8]">维修记录:</span><span class="text-[#F5F7FA]">{{ item.repairHistory }}</span></div>
          </div>
          <div v-if="tradeType === 'new'" class="mb-4 text-sm">
            <div class="flex justify-between"><span class="text-[#B8C6D8]">保修:</span><span class="text-[#F5F7FA]">{{ item.warranty }}</span></div>
          </div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <img :src="item.seller.avatar" :alt="item.seller.name" class="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]" />
              <div>
                <p class="text-sm font-medium text-[#F5F7FA]">{{ item.seller.name }}</p>
                <div class="flex items-center">
                  <i class="fa-solid fa-star text-xs text-[#4A5F8B]"></i>
                  <span class="text-xs text-[#6B7C93] ml-1">{{ item.seller.rating }}</span>
                  <span class="text-xs text-[#4A5F8B] mx-1">|</span>
                  <span class="text-xs text-[#6B7C93]">{{ item.seller.completedTransactions }}单</span>
                </div>
              </div>
            </div>
            <span class="text-xs text-[#6B7C93]">{{ item.seller.location }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <router-link :to="`/equipment-detail/${item.id}`" class="flex-1 py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#2D3748] text-[#F5F7FA] rounded-lg font-medium transition-colors border border-[#4A5F8B]">查看详情</router-link>
            <button @click="handleContactSeller(item.seller)" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">{{ tradeType === 'used' ? '联系卖家' : '立即购买' }}</button>
          </div>
        </div>
      </div>
      <div v-if="currentEquipment.length === 0" class="col-span-full p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
        <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search text-2xl"></i></div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关器材</h3>
        <p class="text-[#B8C6D8]">请尝试调整筛选条件或搜索其他关键词</p>
      </div>
    </div>

    <div class="mt-12 bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
      <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">交易保障</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="flex items-start"><div class="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"><i class="fa-solid fa-check-circle"></i></div><div><h3 class="font-medium text-[#F5F7FA] mb-1">专业验机服务</h3><p class="text-sm text-[#B8C6D8]">提供第三方专业机构验机服务，确保器材真实状况与描述一致</p></div></div>
        <div class="flex items-start"><div class="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"><i class="fa-solid fa-shield-alt"></i></div><div><h3 class="font-medium text-[#F5F7FA] mb-1">资金担保</h3><p class="text-sm text-[#B8C6D8]">平台提供资金担保服务，买家确认收货后卖家才能收到款项</p></div></div>
        <div class="flex items-start"><div class="w-10 h-10 rounded-full bg-[#1E2A3A] flex items-center justify-center text-[#4A5F8B] mr-3 flex-shrink-0"><i class="fa-solid fa-headset"></i></div><div><h3 class="font-medium text-[#F5F7FA] mb-1">7天无理由退换</h3><p class="text-sm text-[#B8C6D8]">支持7天无理由退换货，让您购物无忧</p></div></div>
      </div>
    </div>

    <div class="mt-8 flex justify-center">
      <button @click="showPublishForm = true" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center"><i class="fa-solid fa-plus-circle mr-2"></i>发布二手器材</button>
    </div>

    <ContactSellerModal :isOpen="showContactModal" :onClose="() => showContactModal = false" :seller="selectedSeller" />

    <PublishEquipmentForm :isOpen="showPublishForm" :onClose="() => showPublishForm = false" :onSubmit="handlePublishEquipment" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';
import { mockCameras, mockLenses, mockAccessories } from '../lib/equipmentData';

const route = useRoute();
const routeId = computed(() => route.params.id);

import EquipmentDetail from '../components/EquipmentDetail.vue';
import ContactSellerModal from '../components/ContactSellerModal.vue';
import PublishEquipmentForm from '../components/PublishEquipmentForm.vue';

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

const equipmentTypes = ['全部', '相机', '镜头', '配件', '无人机', '三脚架', '滤镜', '闪光灯'];
const priceRanges = ['全部', '0-5000元', '5000-10000元', '10000-20000元', '20000元以上'];
const conditions = ['全部', '99新', '95新', '9成新', '8成新', '7成新及以下'];
const brands = ['全部', 'Sony', 'Canon', 'Nikon', 'Fujifilm', 'Panasonic', 'Leica', 'Sigma', 'Tamron', 'DJI'];

function safeGetEquipment<T>(array: T[] | undefined, index: number, defaultValue: T): T {
  if (!array || array.length <= index || !array[index]) return defaultValue;
  return array[index];
}

const defaultCamera = { name: '索尼全画幅相机', brand: 'Sony', price: '12999', image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Sony+mirrorless+camera+professional+photography+equipment&sign=5f9e2f27c40853405c8b28ab7e864c75' };
const defaultLens = { name: '佳能标准变焦镜头', brand: 'Canon', price: '14999', image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Canon+EF+70-200mm+f%2F2.8L+IS+III+USM+lens+professional+photography+equipment&sign=90b3d98d08881f8fead46c8ccac54661' };
const defaultAccessory = { name: '捷信碳纤维三脚架', brand: 'Gitzo', price: '8999', image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=Gitzo+carbon+fiber+tripod+photography+equipment&sign=bff0c0ba5fe556ca67ffb0739e6395c8' };

const mockUsedEquipment = [
  { id: 'ue1', name: safeGetEquipment(mockCameras, 6, defaultCamera).name, type: '相机', brand: safeGetEquipment(mockCameras, 6, defaultCamera).brand, price: '8500', originalPrice: safeGetEquipment(mockCameras, 6, defaultCamera).price, image: safeGetEquipment(mockCameras, 6, defaultCamera).image, condition: '95新', usageTime: '约1年', shutterCount: '8500次', repairHistory: '无维修记录', accessories: ['原装电池2块','充电器','相机包','说明书'], seller: { id: 's1', name: '摄影爱好者小王', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20male%20smiling%20casual&sign=db92da1c3005295607f7766d7f9263bb', location: '上海', rating: 4.9, completedTransactions: 128 }, description: '2022年10月购买，使用非常小心，成色极佳。', images: Array(4).fill(safeGetEquipment(mockCameras, 6, defaultCamera).image), tags: ['索尼','全画幅','微单','二手','高性价比'] },
  { id: 'ue2', name: safeGetEquipment(mockLenses, 4, defaultLens).name, type: '镜头', brand: safeGetEquipment(mockLenses, 4, defaultLens).brand, price: '7200', originalPrice: safeGetEquipment(mockLenses, 4, defaultLens).price, image: safeGetEquipment(mockLenses, 4, defaultLens).image, condition: '9成新', usageTime: '约2年', shutterCount: '', repairHistory: '无维修记录', accessories: ['原装遮光罩','镜头盖','镜头袋'], seller: { id: 's2', name: '专业摄影师老李', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20male%20experienced&sign=fe817dce4d08957c62787348c72eb1b7', location: '北京', rating: 4.8, completedTransactions: 256 }, description: '经典佳能大三元标准变焦镜头。', images: Array(4).fill(safeGetEquipment(mockLenses, 4, defaultLens).image), tags: ['佳能','大三元','标准变焦','二手','专业'] },
  { id: 'ue3', name: safeGetEquipment(mockCameras, 9, defaultCamera).name, type: '相机', brand: safeGetEquipment(mockCameras, 9, defaultCamera).brand, price: '5800', originalPrice: safeGetEquipment(mockCameras, 9, defaultCamera).price, image: safeGetEquipment(mockCameras, 9, defaultCamera).image, condition: '99新', usageTime: '约3个月', shutterCount: '2300次', repairHistory: '无维修记录', accessories: ['原装电池','充电器','相机包','肩带','说明书'], seller: { id: 's3', name: '新手摄影小张', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20male%20student&sign=a076fa14f7977e902fe333f899d2603c', location: '广州', rating: 4.7, completedTransactions: 32 }, description: '2023年7月购买，几乎全新。', images: Array(4).fill(safeGetEquipment(mockCameras, 9, defaultCamera).image), tags: ['富士','APS-C','复古','二手','套机'] },
  { id: 'ue4', name: safeGetEquipment(mockAccessories, 0, defaultAccessory).name, type: '配件', brand: safeGetEquipment(mockAccessories, 0, defaultAccessory).brand, price: '4200', originalPrice: safeGetEquipment(mockAccessories, 0, defaultAccessory).price, image: safeGetEquipment(mockAccessories, 0, defaultAccessory).image, condition: '9成新', usageTime: '约1.5年', shutterCount: '', repairHistory: '无维修记录', accessories: ['原装收纳袋','说明书'], seller: { id: 's4', name: '风光摄影师老王', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor&sign=e12559b462289b3e1b2448807304bc67', location: '成都', rating: 4.9, completedTransactions: 187 }, description: '2022年3月购买，碳纤维材质。', images: Array(4).fill(safeGetEquipment(mockAccessories, 0, defaultAccessory).image), tags: ['捷信','碳纤维','三脚架','二手','专业'] }
];

const mockNewEquipment = [
  { id: 'ne1', name: safeGetEquipment(mockCameras, 1, defaultCamera).name, type: '相机', brand: safeGetEquipment(mockCameras, 1, defaultCamera).brand, price: safeGetEquipment(mockCameras, 1, defaultCamera).price, originalPrice: safeGetEquipment(mockCameras, 1, defaultCamera).price, image: safeGetEquipment(mockCameras, 1, defaultCamera).image, seller: { id: 'b1', name: '佳能官方授权店', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=canon%20official%20store%20logo&sign=50cd433cb1c90a4b4dca5af8ff32317b', location: '上海', rating: 4.9, completedTransactions: 1254, isOfficial: true }, description: '佳能EOS R5是一款专业级全画幅微单相机。', images: Array(4).fill(safeGetEquipment(mockCameras, 1, defaultCamera).image), tags: ['佳能','全画幅','微单','全新','专业'], warranty: '官方保修2年' },
  { id: 'ne2', name: safeGetEquipment(mockLenses, 8, defaultLens).name, type: '镜头', brand: safeGetEquipment(mockLenses, 8, defaultLens).brand, price: safeGetEquipment(mockLenses, 8, defaultLens).price, originalPrice: safeGetEquipment(mockLenses, 8, defaultLens).price, image: safeGetEquipment(mockLenses, 8, defaultLens).image, seller: { id: 'b2', name: '尼康官方授权店', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=nikon%20official%20store%20logo&sign=1cb76f80ef7e58ff4fd8842daa09e778', location: '北京', rating: 4.8, completedTransactions: 987, isOfficial: true }, description: '尼康Z卡口70-200mm F2.8 VR S镜头。', images: Array(4).fill(safeGetEquipment(mockLenses, 8, defaultLens).image), tags: ['尼康','大三元','长焦','全新','专业'], warranty: '官方保修2年' }
];

function filterByPriceRange(equipment: any[], range: string) {
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

const currentEquipment = computed(() => tradeType.value === 'used' ? filteredUsedEquipment.value : filteredNewEquipment.value);

function handleContactSeller(seller: any) { selectedSeller.value = seller; showContactModal.value = true; }
function handlePublishEquipment(formData: any) { toast.success('器材发布成功，等待审核'); }
</script>