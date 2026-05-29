<template>
  <div class="min-h-screen">
    <!-- 页面内容 -->
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-8">欢迎来到影研社</h1>
      <p class="text-[#B8C6D8] mb-8">
        摄影爱好者交流平台，分享您的摄影作品，学习摄影技巧。</p>
      
      <!-- 示例卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="post in posts"
          :key="post.id"
          class="bg-[#2D3748] rounded-lg p-6 border border-[#4A5F8B]"
        >
          <img
            :src="post.image"
            :alt="post.title"
            class="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h2 class="text-xl font-semibold text-[#F5F7FA] mb-2">{{ post.title }}</h2>
          <p class="text-[#B8C6D8] text-sm mb-4">{{ post.description }}</p>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <img
                :src="post.author.avatar"
                :alt="post.author.name"
                class="w-8 h-8 rounded-full"
              />
              <span class="text-[#F5F7FA] text-sm">{{ post.author.name }}</span>
            </div>
            <div class="flex items-center space-x-4 text-[#B8C6D8] text-sm">
              <span><i class="fa-solid fa-heart mr-1"></i>{{ post.likes }}</span>
              <span><i class="fa-solid fa-comment mr-1"></i>{{ post.comments }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 摄影作品数据
const posts = ref([{
  id: "1",
  title: "黑白光影",
  description: "极简主义黑白摄影，通过光影对比展现建筑的几何美感。",
  image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52",
  author: {
    id: "1",
    name: "极简摄影师林风",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c"
  },
  likes: 342,
  comments: 42,
  collections: 28,
  tags: ["极简主义", "黑白", "建筑", "徕卡"],
  date: "2023-10-25"
}, {
  id: "2",
  title: "胶片质感人像",
  description: "使用复古胶片相机拍摄的人像作品，自然柔和的色调与颗粒感。",
  image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=film%20photography%20portrait%20natural%20light%20soft%20colors&sign=c33fc387d9611cfbf5948eab73b3426b",
  author: {
    id: "2",
    name: "胶片摄影师安娜",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage%20style&sign=5ec915debce76b46483be485e236cee2"
  },
  likes: 412,
  comments: 56,
  collections: 35,
  tags: ["人像", "胶片", "复古", "自然光"],
  date: "2023-10-24"
}, {
  id: "3",
  title: "暗调氛围",
  description: "营造神秘而富有故事感的暗调氛围人像，强调光影层次与情绪表达。",
  image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=moody%20portrait%20low%20key%20dramatic%20lighting&sign=667d5b0612922acbe1a4e0355faeb800",
  author: {
    id: "3",
    name: "情绪摄影师李明",
    avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=moody%20photographer%20male%20creative&sign=b74f18a9e01693163824506fbbcc8c47"
  },
  likes: 389,
  comments: 49,
  collections: 31,
  tags: ["暗调", "氛围", "情绪", "人像"],
  date: "2023-10-23"
}])
</script>
