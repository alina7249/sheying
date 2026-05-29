<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl font-bold text-white">器材中心</h1>
          <p class="text-[#6B7C93]">发现和讨论摄影器材</p>
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

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <div v-if="activeTab === 'trending'" class="space-y-6">
            <div 
              v-for="equipment in trendingEquipment" 
              :key="equipment.id"
              class="bg-[#1E2532] rounded-xl p-6 flex gap-4 hover:bg-[#253040] transition-colors cursor-pointer"
            >
              <img :src="equipment.image" :alt="equipment.name" class="w-24 h-24 rounded-lg object-cover" />
              <div class="flex-1">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-semibold text-white">{{ equipment.name }}</h3>
                    <p class="text-sm text-[#6B7C93]">{{ equipment.brand }}</p>
                  </div>
                  <span class="px-2 py-1 bg-[#4A5F8B]/30 text-[#4A5F8B] text-xs rounded">{{ equipment.type }}</span>
                </div>
                <p class="text-sm text-[#B8C6D8] mt-2 line-clamp-2">{{ equipment.description }}</p>
                <div class="flex items-center gap-6 mt-3 text-sm text-[#6B7C93]">
                  <span>{{ equipment.reviews }} 评测</span>
                  <span>{{ equipment.discussions }} 讨论</span>
                  <span>{{ equipment.ratings }} 评分</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'reviews'" class="space-y-6">
            <div 
              v-for="review in equipmentReviews" 
              :key="review.id"
              class="bg-[#1E2532] rounded-xl p-6"
            >
              <div class="flex items-center gap-4 mb-4">
                <img :src="review.equipment.image" :alt="review.equipment.name" class="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h3 class="font-semibold text-white">{{ review.equipment.name }}</h3>
                  <div class="flex items-center gap-1 mt-1">
                    <i class="fa-solid fa-star text-yellow-500"></i>
                    <span class="text-white">{{ review.rating }}</span>
                    <span class="text-[#6B7C93] text-sm">({{ review.ratingCount }}条评价)</span>
                  </div>
                </div>
              </div>
              <p class="text-[#B8C6D8]">{{ review.content }}</p>
              <div class="flex items-center gap-4 mt-4 pt-4 border-t border-[#4A5F8B]/30">
                <img :src="review.author.avatar" :alt="review.author.name" class="w-8 h-8 rounded-full" />
                <div>
                  <p class="text-white text-sm">{{ review.author.name }}</p>
                  <p class="text-[#6B7C93] text-xs">{{ review.date }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'questions'" class="space-y-6">
            <div 
              v-for="question in equipmentQuestions" 
              :key="question.id"
              class="bg-[#1E2532] rounded-xl p-6"
            >
              <h3 class="font-semibold text-white">{{ question.title }}</h3>
              <p class="text-[#B8C6D8] mt-2">{{ question.content }}</p>
              <div class="flex items-center gap-4 mt-4">
                <img :src="question.author.avatar" :alt="question.author.name" class="w-8 h-8 rounded-full" />
                <div>
                  <p class="text-white text-sm">{{ question.author.name }}</p>
                  <p class="text-[#6B7C93] text-xs">{{ question.date }}</p>
                </div>
                <div class="ml-auto flex items-center gap-4 text-sm text-[#6B7C93]">
                  <span>{{ question.answers }} 回答</span>
                  <span>{{ question.views }} 浏览</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6">
            <h3 class="font-semibold text-white mb-4">热门品牌</h3>
            <div class="grid grid-cols-2 gap-3">
              <button 
                v-for="brand in popularBrands" 
                :key="brand.id"
                class="flex items-center gap-2 p-3 bg-[#0F1C2D] rounded-lg hover:bg-[#4A5F8B]/30 transition-colors"
              >
                <img :src="brand.logo" :alt="brand.name" class="w-8 h-8 rounded" />
                <span class="text-white text-sm">{{ brand.name }}</span>
              </button>
            </div>
          </div>

          <div class="bg-[#1E2532] rounded-xl p-6">
            <h3 class="font-semibold text-white mb-4">器材分类</h3>
            <div class="space-y-2">
              <button 
                v-for="category in equipmentCategories" 
                :key="category.id"
                class="w-full flex items-center justify-between p-3 bg-[#0F1C2D] rounded-lg hover:bg-[#4A5F8B]/30 transition-colors"
              >
                <span class="text-white">{{ category.name }}</span>
                <span class="text-[#6B7C93] text-sm">{{ category.count }}</span>
              </button>
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
            <h3 class="font-semibold text-white mb-2">发布器材评测</h3>
            <p class="text-sm text-[#B8C6D8] mb-4">分享你的使用体验，帮助其他摄影师</p>
            <button class="w-full px-4 py-2 bg-[#4A5F8B] text-white rounded-lg hover:bg-[#6B7C93] transition-colors">
              立即发布
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('trending');

const tabs = [
  { id: 'trending', name: '热门器材' },
  { id: 'reviews', name: '器材评测' },
  { id: 'questions', name: '问答讨论' }
];

const trendingEquipment = [
  {
    id: '1',
    name: 'Sony A7R V',
    brand: 'Sony',
    type: '相机',
    description: '全新6100万像素全画幅传感器，AI智能对焦系统，专业级画质表现',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sony%20mirrorless%20camera%20professional&sign=c3d42e74d44172d66b150c679e43f634',
    reviews: 156,
    discussions: 892,
    ratings: '4.9'
  },
  {
    id: '2',
    name: 'Canon RF 85mm f/1.2L',
    brand: 'Canon',
    type: '镜头',
    description: '梦幻级人像镜头，极致虚化效果，专业人像摄影师首选',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=canon%20telephoto%20lens%20professional&sign=c6e5d3c2b1a0e9f8d7c6b5a4e3f2d1c0',
    reviews: 89,
    discussions: 456,
    ratings: '4.8'
  },
  {
    id: '3',
    name: 'Nikon Z8',
    brand: 'Nikon',
    type: '相机',
    description: '4500万像素旗舰级微单，120fps连拍，8K视频录制',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=nikon%20mirrorless%20camera%20flagship&sign=f0e1d2c3b4a5e6f7a8b9c0d1e2f3a4b5',
    reviews: 234,
    discussions: 1200,
    ratings: '4.9'
  }
];

const equipmentReviews = [
  {
    id: '1',
    equipment: {
      id: '1',
      name: 'Sony A7R V 使用体验',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sony%20mirrorless%20camera%20professional&sign=c3d42e74d44172d66b150c679e43f634'
    },
    content: '使用A7R V拍摄了一个月，画质确实惊艳，尤其是高ISO表现让人印象深刻。AI对焦系统非常智能，人像模式下眼部识别准确率很高。唯一的缺点就是价格偏高。',
    rating: 4.5,
    ratingCount: 128,
    author: {
      name: '摄影爱好者小张',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20portrait%20professional&sign=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6'
    },
    date: '2023-10-20'
  },
  {
    id: '2',
    equipment: {
      id: '2',
      name: 'Canon RF 85mm f/1.2L 深度评测',
      image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=canon%20telephoto%20lens%20professional&sign=c6e5d3c2b1a0e9f8d7c6b5a4e3f2d1c0'
    },
    content: '这支镜头的虚化效果简直完美，焦外成像非常柔和。在大光圈下锐度依然出色，色彩表现也很Canon风格。适合追求极致人像效果的摄影师。',
    rating: 4.9,
    ratingCount: 89,
    author: {
      name: '人像摄影师Lisa',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=female%20photographer%20portrait&sign=b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7'
    },
    date: '2023-10-15'
  }
];

const equipmentQuestions = [
  {
    id: '1',
    title: '新手入门相机推荐，预算8000左右',
    content: '刚刚开始学习摄影，想入手第一台相机，预算大概8000元左右。主要想拍人像和风光，有什么好的推荐吗？',
    author: {
      name: '摄影小白',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20beginner&sign=c3d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8'
    },
    date: '2023-10-25',
    answers: 12,
    views: 234
  },
  {
    id: '2',
    title: '如何清洁相机传感器？',
    content: '相机用了一段时间，传感器上有灰尘，拍照时会有黑点。想自己清洁，请问有什么安全有效的方法？',
    author: {
      name: '器材爱好者',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=tech%20enthusiast%20portrait&sign=d4e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9'
    },
    date: '2023-10-24',
    answers: 8,
    views: 156
  }
];

const popularBrands = [
  { id: '1', name: 'Sony', logo: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sony%20logo%20simple&sign=e5f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0' },
  { id: '2', name: 'Canon', logo: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=canon%20logo%20simple&sign=f6a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1' },
  { id: '3', name: 'Nikon', logo: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=nikon%20logo%20simple&sign=a7b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2' },
  { id: '4', name: 'Fujifilm', logo: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=fujifilm%20logo%20simple&sign=b8c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3' },
  { id: '5', name: 'Leica', logo: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=leica%20logo%20simple&sign=c9d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4' },
  { id: '6', name: 'Sigma', logo: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sigma%20logo%20simple&sign=d0e1f2a3b4c5d6a7b8c9d0e1f2a3b4c5' }
];

const equipmentCategories = [
  { id: '1', name: '相机', count: 1256 },
  { id: '2', name: '镜头', count: 2341 },
  { id: '3', name: '三脚架', count: 345 },
  { id: '4', name: '闪光灯', count: 567 },
  { id: '5', name: '滤镜', count: 890 },
  { id: '6', name: '配件', count: 1567 }
];
</script>