<template>
  <div class="mt-6 p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B]">
    <h3 class="text-lg font-semibold text-[#F5F7FA] mb-4">搭配推荐</h3>

    <p class="text-sm text-[#B8C6D8] mb-3">
      根据{{ currentEquipment.name }}，我们为您推荐以下搭配器材：
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="equipment in recommendedEquipment"
        :key="equipment.id"
        class="bg-[#1E2532] rounded-lg overflow-hidden border border-[#4A5F8B] transition-all hover:-translate-y-1 hover:shadow-lg"
      >
        <div class="flex">
          <div class="w-24 h-24">
            <img
              :src="equipment.image"
              :alt="equipment.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="p-3 flex-1">
            <h4 class="font-medium text-[#F5F7FA] mb-1 line-clamp-1">{{ equipment.name }}</h4>
            <p class="text-xs text-[#6B7C93] mb-2">{{ equipment.brand }} | {{ equipment.type }}</p>
            <p class="text-sm font-bold text-[#4A5F8B]">¥{{ parseInt(equipment.price).toLocaleString() }}</p>
            <router-link
              :to="`/equipment/${equipment.id}`"
              class="inline-block mt-2 px-3 py-1 text-xs bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#6B7C93] transition-colors"
            >
              查看详情
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 bg-[#1E2532] p-3 rounded-lg border border-[#4A5F8B]">
      <h4 class="text-sm font-medium text-[#F5F7FA] mb-2">搭配理由</h4>
      <ul class="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
        <li>与{{ currentEquipment.name }}在性能和风格上高度匹配</li>
        <li>能够扩展您的创作可能性，适应更多拍摄场景</li>
        <li>在用户评价和专业测试中表现优异</li>
        <li>具有良好的性价比和可靠性</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Equipment } from '../lib/equipmentData';

defineProps<{
  currentEquipment: Equipment;
  recommendedEquipment: Equipment[];
}>();
</script>