<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="!tutorial" class="flex items-center justify-center min-h-screen">
      <div class="text-[#B8C6D8]">加载中...</div>
    </div>

    <div v-else>
      <div class="mb-6">
        <router-link to="/projects" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回教程列表</span>
        </router-link>
      </div>

      <!-- 视频播放区 -->
      <div class="relative rounded-xl overflow-hidden mb-8 bg-black border border-[#4A5F8B]">
        <div class="aspect-video bg-[#1E2532] flex items-center justify-center cursor-pointer relative">
          <img :src="tutorial.thumbnail" :alt="tutorial.title" class="absolute inset-0 w-full h-full object-cover" />
          <div class="absolute inset-0 bg-black/40"></div>
          <div class="relative flex flex-col items-center z-10">
            <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center hover:bg-[#4A5F8B] hover:scale-110 transition-all">
              <i class="fa-solid fa-play text-[#F5F7FA] text-2xl ml-1"></i>
            </div>
            <p class="mt-4 text-[#F5F7FA] text-sm">
              点击播放视频
            </p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h1 class="text-2xl md:text-3xl font-bold text-[#F5F7FA] mb-3">{{ tutorial.title }}</h1>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center space-x-4 text-sm text-[#B8C6D8]">
                <span class="flex items-center">
                  <i class="fa-solid fa-clock mr-1 text-[#4A5F8B]"></i> 时长：{{ tutorial.duration }}
                </span>
                <span class="flex items-center">
                  <i class="fa-solid fa-eye mr-1 text-[#4A5F8B]"></i> {{ tutorial.views }}
                </span>
                <span class="flex items-center">
                  <i class="fa-solid fa-star mr-1 text-yellow-400"></i> {{ tutorial.rating }}/5
                </span>
              </div>
              <span class="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded-full">{{ tutorial.level }}</span>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">课程介绍</h2>
            <p class="text-[#B8C6D8] leading-relaxed">{{ tutorial.description }}</p>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">你将学到</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(item, index) in tutorial.learningPoints" :key="index" class="flex items-start p-3 bg-[#1E2532] rounded-lg">
                <i class="fa-solid fa-check-circle text-[#4A5F8B] mr-3 mt-0.5"></i>
                <span class="text-[#B8C6D8]">{{ item }}</span>
              </div>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">课程大纲</h2>
            <div class="space-y-3">
              <div v-for="(section, index) in tutorial.sections" :key="index" class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                <div class="flex justify-between items-center mb-2">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3 font-medium">
                      {{ index + 1 }}
                    </div>
                    <h3 class="font-medium text-[#F5F7FA]">{{ section.title }}</h3>
                  </div>
                  <span class="text-sm text-[#B8C6D8]">{{ section.duration }}</span>
                </div>
                <p class="text-sm text-[#B8C6D8] ml-11">{{ section.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">讲师信息</h2>
            <div class="flex items-center mb-4">
              <img :src="tutorial.instructor.avatar" :alt="tutorial.instructor.name" class="w-16 h-16 rounded-full mr-4 object-cover border-2 border-[#4A5F8B]" />
              <div>
                <h3 class="font-bold text-[#F5F7FA]">{{ tutorial.instructor.name }}</h3>
                <p class="text-sm text-[#B8C6D8]">{{ tutorial.instructor.title }}</p>
              </div>
            </div>
            <button class="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors">
              关注讲师
            </button>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">标签</h2>
            <div class="flex flex-wrap gap-2">
              <span v-for="(tag, index) in tutorial.tags" :key="index" class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs">
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">学员评价</h2>
            <div class="space-y-4">
              <div v-for="(review, index) in tutorial.reviews" :key="index" class="p-3 bg-[#1E2532] rounded-lg">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-[#F5F7FA]">{{ review.user }}</span>
                  <div class="flex">
                    <i v-for="i in 5" :key="i" :class="['fa-solid fa-star text-yellow-400', i <= review.rating ? 'fa-solid' : 'fa-regular']"></i>
                  </div>
                </div>
                <p class="text-sm text-[#B8C6D8]">{{ review.comment }}</p>
                <p class="text-xs text-[#6B7C93] mt-1">{{ review.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] mt-8">
        <CommentSection :postId="tutorial.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useAuthStore } from '@/store/authStore'
import { storeToRefs } from 'pinia'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()
const store = useAuthStore()
const { isAuthenticated, user } = storeToRefs(store)

interface TutorialSection {
  title: string
  duration: string
  content: string
}

interface Tutorial {
  id: string
  title: string
  duration: string
  level: string
  tags: string[]
  thumbnail: string
  views: number
  rating: number
  description: string
  learningPoints: string[]
  sections: TutorialSection[]
  instructor: {
    name: string
    avatar: string
    title: string
  }
  reviews: {
    user: string
    rating: number
    comment: string
    date: string
  }[]
}

const mockTutorials: Tutorial[] = [
  {
    id: 't1',
    title: '精通自然光人像摄影',
    duration: '1小时30分钟',
    level: '中级',
    tags: ['人像', '自然光', '光线', '构图'],
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=natural%20light%20portrait%20photography%20tutorial%20banner%20golden%20hour&sign=e08752acd9ef2f34aa6e05203464ca5c',
    views: 2580,
    rating: 4.8,
    description: '本课程将全面解析自然光人像摄影的核心技巧，从光线选择到拍摄技巧，帮助您掌握如何在不同自然光条件下拍出专业级人像作品。',
    learningPoints: ['理解不同自然光的特点和应用', '掌握黄金时刻的光线利用', '学会阴影环境的拍摄技巧', '掌握逆光拍摄的要领', '学会引导模特的姿势和表情'],
    instructor: {
      name: '人像摄影师王莹',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20studio%20professional&sign=517e35b2f45eaaa7833acdb77504fdc6',
      title: '时尚人像摄影师'
    },
    sections: [
      { title: '认识自然光', duration: '15分钟', content: '自然光的类型、方向和色温特点' },
      { title: '黄金时刻拍摄技巧', duration: '20分钟', content: '日出日落时分的光线利用和人物拍摄技巧' },
      { title: '阴影环境人像', duration: '15分钟', content: '如何在阴影环境中拍出通透的人像作品' },
      { title: '逆光人像的艺术', duration: '20分钟', content: '逆光条件下的拍摄技巧和曝光控制' },
      { title: '人物引导与表情管理', duration: '20分钟', content: '如何引导模特摆出自然的姿势和表情' }
    ],
    reviews: [
      { user: '摄影爱好者小李', rating: 5, comment: '课程讲解非常详细，学到了很多实用的技巧！', date: '2023-10-15' },
      { user: '旅行摄影师', rating: 4, comment: '内容很丰富，特别是黄金时刻的讲解让我受益匪浅', date: '2023-10-12' },
      { user: '新手摄影师', rating: 5, comment: '作为新手也能听懂，感谢老师的耐心讲解', date: '2023-10-10' }
    ]
  },
  {
    id: 't2',
    title: '商业摄影布光完全指南',
    duration: '2小时',
    level: '高级',
    tags: ['商业', '布光', '光影', '专业'],
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=commercial%20photography%20lighting%20guide%20tutorial%20banner%20studio&sign=5413c1eb863f36f40b8459bcc81ea4c8',
    views: 1890,
    rating: 4.6,
    description: '从基础的灯光理论到复杂的多灯布光方案，本课程将带您深入了解商业摄影布光的方方面面。',
    learningPoints: ['掌握各类闪光灯的使用方法', '理解灯光的位置和角度对人物的影响', '学会拍摄不同类型的商业产品', '掌握高级多灯布光技巧', '了解灯光配件的作用和使用'],
    instructor: {
      name: '商业摄影师赵阳',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=commercial%20photographer%20male%20studio%20professional&sign=140d3e62a9f0288994c6cdd5e46b3e3a',
      title: '商业摄影导师'
    },
    sections: [
      { title: '灯光基础理论', duration: '25分钟', content: '灯光的物理特性、色温、灯光类型与配件' },
      { title: '单灯布光方案', duration: '25分钟', content: '常用单灯布光方案及其实践应用' },
      { title: '双灯与多灯组合', duration: '30分钟', content: '双灯和多灯方案的搭配与实战' },
      { title: '产品摄影布光', duration: '20分钟', content: '不同类型产品的布光技巧与创意方案' },
      { title: '高级创意布光', duration: '20分钟', content: '创意布光效果与后期结合的高级技巧' }
    ],
    reviews: [
      { user: '专业摄影师', rating: 5, comment: '非常专业和实用的课程，物超所值！', date: '2023-10-18' },
      { user: '工作室主理人', rating: 4, comment: '布光技巧讲解到位，实操性很强', date: '2023-10-15' }
    ]
  }
]

const tutorial = ref<Tutorial | null>(null)

onMounted(() => {
  const id = route.params.id as string
  const foundTutorial = mockTutorials.find(t => t.id === id)
  if (foundTutorial) {
    tutorial.value = foundTutorial
  }
})
</script>