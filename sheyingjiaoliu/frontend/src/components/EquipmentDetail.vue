<template>
  <div class="min-h-screen bg-[#1E2532] star-texture">
    <div class="container mx-auto px-4 py-8">
      <div class="mb-6">
        <router-link to="/equipment-trade" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回器材交易平台</span>
        </router-link>
      </div>

      <div v-if="!equipment" class="flex items-center justify-center min-h-[50vh]">
        <div class="text-center">
          <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4 mx-auto">
            <i class="fa-solid fa-search text-2xl"></i>
          </div>
          <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到该器材</h3>
          <p class="text-[#B8C6D8] mb-6">请检查器材ID是否正确或返回上一页</p>
          <router-link to="/equipment-trade" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
            返回交易平台
          </router-link>
        </div>
      </div>

      <div v-else>
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-6">{{ equipment.name }}</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B]">
              <img :src="equipment.image" :alt="equipment.name" class="w-full h-auto object-cover rounded-lg" />
              <p class="text-[#B8C6D8] mt-4 whitespace-pre-line">{{ equipment.description }}</p>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <div class="text-center mb-6">
              <p class="text-3xl font-bold text-[#F5F7FA]">¥{{ equipment.price }}</p>
              <p class="text-[#B8C6D8] text-sm mt-1">{{ equipment.condition }}</p>
            </div>

            <div class="space-y-3 mb-6">
              <div class="flex items-center gap-3 p-3 bg-[#1E2532] rounded-lg">
                <img :src="equipment.seller?.avatar" :alt="equipment.seller?.name" class="w-10 h-10 rounded-full" />
                <div>
                  <p class="text-white font-medium">{{ equipment.seller?.name }}</p>
                  <p class="text-[#6B7C93] text-xs">卖家</p>
                </div>
              </div>
            </div>

            <button @click="handleContact" class="w-full px-4 py-3 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              联系卖家
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import ContactSellerModal from '../ContactSellerModal.vue';

const route = useRoute();

const mockEquipment = {
  id: '1',
  name: 'Sony A7M4 二手出售',
  price: 12500,
  condition: '95新',
  image: 'https://picsum.photos/1280/720?random=125',
  description: '2022年购买，快门数约8000次，无维修史，包装配件齐全',
  seller: {
    name: '摄影爱好者小王',
    avatar: 'https://picsum.photos/400/400?random=126'
  }
};

const equipment = computed(() => {
  return mockEquipment;
});

const showContactModal = ref(false);

const handleContact = () => {
  showContactModal.value = true;
};
</script>