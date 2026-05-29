<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">资源中心</h1>
          <p class="text-[#6B7C93]">发现和下载摄影相关的资源素材</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="flex gap-2 mb-6">
            <button 
              v-for="category in categories" 
              :key="category.id"
              @click="activeCategory = category.id"
              :class="['px-4 py-2 rounded-lg transition-colors', activeCategory === category.id ? 'bg-[#4A5F8B] text-white' : 'bg-[#1E2532] text-[#6B7C93] hover:text-white']"
            >
              {{ category.name }}
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="resource in filteredResources" 
              :key="resource.id"
              class="bg-[#1E2532] rounded-xl p-4 hover:bg-[#253040] transition-colors cursor-pointer"
            >
              <div class="flex gap-4">
                <div class="w-16 h-16 rounded-lg bg-[#4A5F8B]/30 flex items-center justify-center flex-shrink-0">
                  <i :class="['fa-solid text-xl text-[#4A5F8B]', resource.icon]"></i>
                </div>
                <div>
                  <h3 class="font-medium text-white">{{ resource.name }}</h3>
                  <p class="text-sm text-[#6B7C93]">{{ resource.size }}</p>
                  <div class="flex items-center gap-3 mt-2">
                    <span class="text-xs text-[#6B7C93]">{{ resource.downloads }} 下载</span>
                    <button class="text-xs text-[#4A5F8B] hover:text-white transition-colors">
                      下载
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6">
            <h3 class="font-semibold text-white mb-4">热门下载</h3>
            <div class="space-y-3">
              <div 
                v-for="resource in popularResources" 
                :key="resource.id"
                class="flex items-center gap-3 p-3 bg-[#0F1C2D] rounded-lg hover:bg-[#4A5F8B]/30 transition-colors cursor-pointer"
              >
                <i :class="['fa-solid text-[#4A5F8B]', resource.icon]"></i>
                <div class="flex-1">
                  <p class="text-white text-sm">{{ resource.name }}</p>
                  <p class="text-[#6B7C93] text-xs">{{ resource.downloads }} 下载</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/30">
            <h3 class="font-semibold text-white mb-2">上传资源</h3>
            <p class="text-sm text-[#B8C6D8] mb-4">分享你的摄影资源，帮助更多摄影师</p>
            <button class="w-full px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              立即上传
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const activeCategory = ref('all');

const categories = [
  { id: 'all', name: '全部' },
  { id: 'presets', name: '预设' },
  { id: 'templates', name: '模板' },
  { id: 'fonts', name: '字体' },
  { id: 'actions', name: '动作' }
];

const resources = ref([
  { id: '1', name: '电影色调预设包', category: 'presets', size: '15MB', downloads: 1256, icon: 'fa-image' },
  { id: '2', name: '日系小清新预设', category: 'presets', size: '8MB', downloads: 892, icon: 'fa-image' },
  { id: '3', name: '婚礼相册模板', category: 'templates', size: '25MB', downloads: 654, icon: 'fa-book' },
  { id: '4', name: '摄影作品集模板', category: 'templates', size: '32MB', downloads: 432, icon: 'fa-book' },
  { id: '5', name: '优雅衬线字体包', category: 'fonts', size: '12MB', downloads: 2341, icon: 'fa-font' },
  { id: '6', name: '手写字体合集', category: 'fonts', size: '18MB', downloads: 1567, icon: 'fa-font' },
  { id: '7', name: '人像磨皮动作', category: 'actions', size: '2MB', downloads: 892, icon: 'fa-magic' },
  { id: '8', name: '风光调色动作', category: 'actions', size: '3MB', downloads: 765, icon: 'fa-magic' }
]);

const popularResources = ref([
  { id: '1', name: '电影色调预设包', downloads: 1256, icon: 'fa-image' },
  { id: '2', name: '优雅衬线字体包', downloads: 2341, icon: 'fa-font' },
  { id: '3', name: '日系小清新预设', downloads: 892, icon: 'fa-image' }
]);

const filteredResources = computed(() => {
  if (activeCategory.value === 'all') return resources.value;
  return resources.value.filter(r => r.category === activeCategory.value);
});
</script>