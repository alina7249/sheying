<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">在线课程</h1>
          <p class="text-[#6B7C93]">学习专业摄影知识，提升你的摄影技能</p>
        </div>
        <div class="flex gap-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['px-4 py-2 rounded-lg transition-colors', activeTab === tab.id ? 'bg-[#4A5F8B] text-white' : 'bg-[#1E2532] text-[#6B7C93] hover:text-white']"
          >
            {{ tab.name }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="course in courses" 
          :key="course.id"
          class="bg-[#1E2532] rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <img :src="course.cover" :alt="course.title" class="w-full h-40 object-cover" />
          <div class="p-6">
            <div class="flex items-center gap-2 mb-3">
              <span class="px-2 py-1 bg-[#4A5F8B]/30 text-[#4A5F8B] text-xs rounded">{{ course.category }}</span>
              <span v-if="course.isFree" class="px-2 py-1 bg-green-500/30 text-green-400 text-xs rounded">免费</span>
            </div>
            <h3 class="font-semibold text-white mb-2">{{ course.title }}</h3>
            <p class="text-[#B8C6D8] text-sm mb-4 line-clamp-2">{{ course.description }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <img :src="course.instructor.avatar" :alt="course.instructor.name" class="w-8 h-8 rounded-full" />
                <span class="text-sm text-[#6B7C93]">{{ course.instructor.name }}</span>
              </div>
              <span :class="['font-semibold', course.isFree ? 'text-green-400' : 'text-[#4A5F8B]']">
                {{ course.isFree ? '免费' : `¥${course.price}` }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('all');

const tabs = [
  { id: 'all', name: '全部' },
  { id: 'beginner', name: '入门' },
  { id: 'advanced', name: '进阶' },
  { id: 'professional', name: '专业' }
];

const courses = ref([
  {
    id: '1',
    title: '摄影入门：从零开始学摄影',
    description: '适合完全零基础的摄影爱好者，从相机操作开始学起',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20beginner%20lesson%20camera%20basics&sign=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    category: '入门',
    isFree: true,
    price: 0,
    instructor: { name: '摄影老师小王', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photography%20teacher&sign=b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7' }
  },
  {
    id: '2',
    title: '人像摄影技巧与实践',
    description: '深入学习人像摄影的光线运用、构图技巧和模特引导',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20studio%20lighting&sign=c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8',
    category: '进阶',
    isFree: false,
    price: 199,
    instructor: { name: '人像摄影师Lisa', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=female%20photographer%20professional&sign=d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9' }
  },
  {
    id: '3',
    title: '风光摄影大师班',
    description: '掌握风光摄影的黄金时段、构图法则和后期处理技巧',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20mountains%20golden%20hour&sign=e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0',
    category: '专业',
    isFree: false,
    price: 399,
    instructor: { name: '风光摄影大师', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20landscape%20photographer&sign=f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1' }
  },
  {
    id: '4',
    title: '后期修图：Lightroom完全指南',
    description: '系统学习Lightroom的使用，掌握专业后期修图技巧',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photo%20editing%20lightroom%20software%20interface&sign=a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2',
    category: '进阶',
    isFree: false,
    price: 299,
    instructor: { name: '后期达人阿杰', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photo%20editor%20professional&sign=b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3' }
  },
  {
    id: '5',
    title: '街头摄影：捕捉城市瞬间',
    description: '学习街头摄影的观察技巧、构图方法和抓拍技巧',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20urban%20moment&sign=c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4',
    category: '进阶',
    isFree: true,
    price: 0,
    instructor: { name: '街头摄影师阿强', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photographer%20portrait&sign=d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5' }
  },
  {
    id: '6',
    title: '商业摄影实战课程',
    description: '从布光到后期，全面掌握商业产品摄影技巧',
    cover: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=commercial%20product%20photography%20studio&sign=e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6',
    category: '专业',
    isFree: false,
    price: 599,
    instructor: { name: '商业摄影总监', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=commercial%20photographer%20portrait&sign=f2a3b4c5d6a7b8c9d0e1f2a3b4c5d6a7' }
  }
]);
</script>