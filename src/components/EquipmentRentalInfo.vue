<template>
  <div v-if="rentalInfo || secondHandLink" class="mt-4 p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B]">
    <h3 class="text-lg font-semibold text-[#F5F7FA] mb-3">租赁与二手信息</h3>

    <div v-if="rentalInfo" class="mb-4">
      <h4 class="text-sm font-medium text-[#B8C6D8] mb-2">租赁渠道</h4>
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="(channel, index) in rentalInfo.rentalChannels"
          :key="index"
          class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs"
        >
          {{ channel }}
        </span>
      </div>

      <h4 class="text-sm font-medium text-[#B8C6D8] mb-2">租赁价格</h4>
      <div class="grid grid-cols-3 gap-2 mb-3">
        <div class="text-center p-2 bg-[#1E2532] rounded-lg">
          <p class="text-xs text-[#B8C6D8]">日租</p>
          <p class="text-lg font-bold text-[#4A5F8B]">¥{{ rentalInfo.rentalPrice.daily }}</p>
        </div>
        <div class="text-center p-2 bg-[#1E2532] rounded-lg">
          <p class="text-xs text-[#B8C6D8]">周租</p>
          <p class="text-lg font-bold text-[#4A5F8B]">¥{{ rentalInfo.rentalPrice.weekly }}</p>
        </div>
        <div class="text-center p-2 bg-[#1E2532] rounded-lg">
          <p class="text-xs text-[#B8C6D8]">月租</p>
          <p class="text-lg font-bold text-[#4A5F8B]">¥{{ rentalInfo.rentalPrice.monthly }}</p>
        </div>
      </div>

      <div class="flex items-center">
        <div :class="['w-2 h-2 rounded-full mr-2', rentalInfo.availability ? 'bg-green-500' : 'bg-red-500']"></div>
        <span class="text-sm text-[#B8C6D8]">
          {{ rentalInfo.availability ? '当前可租' : '暂时缺货' }}
        </span>
      </div>
    </div>

    <a
      v-if="secondHandLink"
      :href="secondHandLink"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-block w-full py-2 text-center bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] text-[#F5F7FA] rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-colors border border-[#4A5F8B]"
    >
      <i class="fa-solid fa-recycle mr-1"></i>
      查看二手市场
    </a>
  </div>
</template>

<script setup lang="ts">
interface RentalInfoProps {
  rentalInfo?: {
    rentalChannels: string[];
    rentalPrice: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    availability: boolean;
  };
  secondHandLink?: string;
}

defineProps<RentalInfoProps>();
</script>