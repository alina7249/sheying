<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="max-w-6xl mx-auto">
      <div class="mb-6">
        <router-link to="/tutorial-resources" class="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors inline-flex items-center space-x-1">
          <i class="fa-solid fa-arrow-left"></i><span>返回教程与资源</span>
        </router-link>
      </div>

      <div v-if="course" class="space-y-8">
        <div class="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
          <img :src="course.thumbnail" :alt="course.title" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#1E2532] to-transparent"></div>
          <div class="absolute bottom-6 left-6 right-6">
            <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">{{ course.title }}</h1>
            <div class="flex flex-wrap items-center space-x-4 text-sm text-[#B8C6D8]">
              <div class="flex items-center"><i class="fa-solid fa-clock mr-2 text-[#4A5F8B]"></i>{{ course.duration }}</div>
              <div class="flex items-center"><i class="fa-solid fa-signal mr-2 text-[#4A5F8B]"></i>{{ course.level }}</div>
              <div class="flex items-center"><i class="fa-solid fa-eye mr-2 text-[#4A5F8B]"></i>{{ course.views }}次观看</div>
              <div class="flex items-center"><i class="fa-solid fa-star mr-2 text-[#4A5F8B]"></i>{{ course.rating }}</div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">课程简介</h2>
              <p class="text-[#B8C6D8] mb-4">{{ course.description }}</p>
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in course.tags" :key="tag" class="px-3 py-1 bg-[#2D3748] text-[#B8C6D8] rounded-full text-sm border border-[#4A5F8B]">{{ tag }}</span>
              </div>
            </div>

            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">课程章节 ({{ course.chapters.length }}章)</h2>
              <div class="space-y-2">
                <div v-for="(chapter, idx) in course.chapters" :key="idx" class="border border-[#4A5F8B] rounded-lg">
                  <button @click="toggleChapter(idx)" class="flex items-center justify-between w-full p-4">
                    <div class="flex items-center space-x-3">
                      <span class="w-8 h-8 bg-[#1E2A3A] rounded flex items-center justify-center text-[#4A5F8B]"><i :class="openChapters.includes(idx) ? 'fa-solid fa-chevron-down' : 'fa-solid fa-chevron-right'"></i></span>
                      <span class="font-medium text-[#F5F7FA]">{{ chapter.title }}</span>
                      <span class="text-sm text-[#6B7C93]">({{ chapter.lessons.length }}课时)</span>
                    </div>
                    <span class="text-sm text-[#6B7C93]">{{ chapter.duration }}</span>
                  </button>
                  <Transition name="fade">
                    <div v-if="openChapters.includes(idx)" class="px-4 pb-4 space-y-2">
                      <div v-for="lesson in chapter.lessons" :key="lesson.id" class="flex items-center justify-between p-2 rounded hover:bg-[#1E2A3A] transition-colors">
                        <div class="flex items-center space-x-2">
                          <i :class="lesson.completed ? 'fa-solid fa-check-circle text-[#4A5F8B]' : 'fa-solid fa-play-circle text-[#B8C6D8]'"></i>
                          <span class="text-sm text-[#B8C6D8]">{{ lesson.title }}</span>
                          <span v-if="lesson.isFree" class="px-2 py-0.5 bg-[#4A5F8B] text-[#F5F7FA] rounded text-xs">免费</span>
                        </div>
                        <span class="text-xs text-[#6B7C93]">{{ lesson.duration }}</span>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">授课讲师</h2>
              <div class="flex items-center space-x-4">
                <img :src="course.instructor.avatar" :alt="course.instructor.name" class="w-16 h-16 rounded-full object-cover border-2 border-[#4A5F8B]" />
                <div>
                  <h3 class="font-medium text-[#F5F7FA]">{{ course.instructor.name }}</h3>
                  <p class="text-sm text-[#4A5F8B]">{{ course.instructor.title }}</p>
                  <p class="text-sm text-[#B8C6D8]">{{ course.instructor.experience }}</p>
                </div>
              </div>
            </div>

            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">学员评价</h2>
              <div class="space-y-4">
                <div v-for="review in course.reviews" :key="review.id" class="p-3 rounded">
                  <div class="flex items-center mb-2">
                    <img :src="review.avatar" :alt="review.name" class="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]" />
                    <span class="font-medium text-[#F5F7FA]">{{ review.name }}</span>
                    <span class="text-sm text-[#4A5F8B] ml-2">{{ review.rating }}/5</span>
                    <span class="text-xs text-[#6B7C93] ml-auto">{{ review.date }}</span>
                  </div>
                  <p class="text-sm text-[#B8C6D8]">{{ review.comment }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-1 space-y-6">
            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] sticky top-20">
              <div class="text-center mb-6">
                <div class="text-3xl font-bold text-[#4A5F8B] mb-2">¥{{ course.price }}</div>
                <p class="text-sm text-[#B8C6D8]">一次性购买，终身学习</p>
              </div>
              <button @click="handleEnroll" class="w-full py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors mb-4 block text-center">立即购买</button>
              <div class="space-y-3">
                <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>{{ course.chapters.length }}章课程内容</div>
                <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>共{{ course.chapters.reduce((a, c) => a + c.lessons.length, 0) }}课时</div>
                <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>永久访问权限</div>
                <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>社群答疑支持</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
        <div class="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4 border border-[#4A5F8B]"><i class="fa-solid fa-search-minus text-2xl"></i></div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">课程不存在</h3>
        <p class="text-[#B8C6D8]">未找到该课程，请检查链接是否正确</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { toast } from 'vue-sonner';

const route = useRoute();
const routeId = computed(() => route.params.id as string | undefined);
const openChapters = ref<number[]>([0]);

const courses = [
  {
    id: 'vt1', title: '风光摄影基础入门', description: '从零开始学习风光摄影的基本技巧和构图方法。本课程涵盖相机设置、曝光控制、滤镜使用、经典构图法则等内容，帮助您打好风光摄影的坚实基础。',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape+photography+tutorial+video+thumbnail&sign=4bde90e5e28c797f9f8a21da51b52a9c',
    duration: '45:20', level: '初级', views: 12000, rating: 4.8, price: 299,
    instructor: { name: '张明', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male&sign=00137c6d096d210d6579740e0bc1a5cc', title: '国家地理摄影师', experience: '10年摄影经验，多次参加国内外摄影大赛并获得奖项' },
    tags: ['风光', '基础', '入门'],
    chapters: [
      { title: '课程导论', duration: '10分钟', lessons: [
        { id: 'l1', title: '课程介绍', duration: '03:20', isFree: true, completed: true },
        { id: 'l2', title: '风光摄影概述', duration: '06:40', isFree: true, completed: false }
      ]},
      { title: '摄影器材基础', duration: '15分钟', lessons: [
        { id: 'l3', title: '相机的选择', duration: '05:30', isFree: false, completed: false },
        { id: 'l4', title: '镜头与滤镜', duration: '04:50', isFree: false, completed: false },
        { id: 'l5', title: '三脚架与配件', duration: '04:40', isFree: false, completed: false }
      ]},
      { title: '基础曝光控制', duration: '20分钟', lessons: [
        { id: 'l6', title: '光圈与景深', duration: '06:20', isFree: false, completed: false },
        { id: 'l7', title: '快门速度', duration: '05:40', isFree: false, completed: false },
        { id: 'l8', title: 'ISO与噪点控制', duration: '04:50', isFree: false, completed: false },
        { id: 'l9', title: '曝光补偿', duration: '03:10', isFree: false, completed: false }
      ]}
    ],
    reviews: [
      { id: 'r1', name: '摄影爱好者小王', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20avatar%20male&sign=db92da1c3005295607f7766d7f9263bb', rating: 5, date: '2023-11-15', comment: '非常棒的课程，讲解非常详细，适合初学者。从最基础的知识开始，循序渐进，让我对风光摄影有了全新的认识。' },
      { id: 'r3', name: '摄影初学者小张', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=beginner%20photographer%20avatar%20male&sign=a076fa14f7977e902fe333f899d2603c', rating: 5, date: '2023-12-01', comment: '课程非常实用，学到了很多实用的技巧。特别是关于光线运用的部分，让我在拍摄时有了更多的想法。' }
    ]
  },
  {
    id: 'vt2', title: '人像摄影用光技巧', description: '掌握人像摄影中光线运用的技巧，拍出自然生动的人像作品。',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait+photography+lighting+tutorial&sign=8b71cc364282b1cfbbe6914f36bd8128',
    duration: '38:15', level: '中级', views: 8500, rating: 4.7, price: 399,
    instructor: { name: '李华', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female%20professional&sign=c3336bf3ce1c7229154ec96830fedbfc', title: '人像摄影师', experience: '15年人像摄影经验' },
    tags: ['人像', '光线', '技巧'],
    chapters: [
      { title: '导论', duration: '10分钟', lessons: [
        { id: 'l1', title: '课程介绍', duration: '03:00', isFree: true, completed: true },
        { id: 'l2', title: '人像摄影概述', duration: '07:00', isFree: true, completed: false }
      ]},
      { title: '自然光运用', duration: '28分钟', lessons: [
        { id: 'l3', title: '顺光与逆光', duration: '08:00', isFree: false, completed: false },
        { id: 'l4', title: '侧光与轮廓光', duration: '07:00', isFree: false, completed: false },
        { id: 'l5', title: '黄金时间人像拍摄', duration: '07:00', isFree: false, completed: false }
      ]}
    ],
    reviews: [
      { id: 'r1', name: '摄影爱好者小李', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20enthusiast%20avatar%20male&sign=acf32af241c038875f2b8b318f170b06', rating: 4, date: '2023-11-15', comment: '光线运用的讲解非常细致，学到了很多实用技巧。' }
    ]
  }
];

const course = computed(() => courses.find(c => c.id === routeId.value));

function toggleChapter(idx: number) {
  const i = openChapters.value.indexOf(idx);
  if (i === -1) openChapters.value.push(idx);
  else openChapters.value.splice(i, 1);
}

function handleEnroll() { toast.success('购买成功，开始学习'); }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; max-height: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; max-height: 500px; }
</style>