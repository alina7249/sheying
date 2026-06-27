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
          <LazyImage :src="course.thumbnail" :alt="course.title" :lazy="false" rounded />
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

            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]/20">
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">课程章节 ({{ course.chapters.length }}章 · {{ course.chapters.reduce((a, c) => a + c.lessons.length, 0) }}课时)</h2>
              <div class="space-y-2">
                <div v-for="(chapter, idx) in course.chapters" :key="idx" class="border border-[#4A5F8B]/15 rounded-lg overflow-hidden transition-colors duration-200 hover:border-[#4A5F8B]/30">
                  <button @click="toggleChapter(idx)" class="flex items-center w-full p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#63B3ED]/40 focus-visible:ring-inset">
                    <div class="flex items-center gap-4 flex-1 min-w-0">
                      <span class="chapter-index flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold" :class="openChapters.includes(idx) ? 'bg-[#4A5F8B]/20 text-[#63B3ED]' : 'bg-[#1E2A3A] text-[#6B7C93]'">{{ idx + 1 }}</span>
                      <div class="min-w-0">
                        <span class="font-medium text-[#F5F7FA] block truncate">{{ chapter.title }}</span>
                        <span class="text-xs text-[#6B7C93]">{{ chapter.lessons.length }} 课时 · {{ chapter.duration }}</span>
                      </div>
                    </div>
                    <span class="faq-chevron flex-shrink-0 w-7 h-7 rounded-full bg-[#4A5F8B]/10 flex items-center justify-center text-[#6B7C93] text-xs transition-transform duration-300" :class="openChapters.includes(idx) ? 'rotate-180' : ''">
                      <i class="fa-solid fa-chevron-down"></i>
                    </span>
                  </button>
                  <Transition name="chapter-expand">
                    <div v-if="openChapters.includes(idx)" class="px-4 pb-4 space-y-1">
                      <div v-for="lesson in chapter.lessons" :key="lesson.id" class="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1E2A3A]/60 transition-colors cursor-pointer group/lesson">
                        <div class="flex items-center gap-3 min-w-0">
                          <i :class="lesson.completed ? 'fa-solid fa-check-circle text-green-400' : 'fa-regular fa-circle-play text-[#6B7C93] group-hover/lesson:text-[#63B3ED]'"></i>
                          <span class="text-sm text-[#B8C6D8] truncate">{{ lesson.title }}</span>
                          <span v-if="lesson.isFree" class="flex-shrink-0 px-2 py-0.5 bg-green-500/10 text-green-400 rounded text-[11px] font-medium border border-green-500/20">免费试看</span>
                        </div>
                        <span class="text-xs text-[#6B7C93] flex-shrink-0 ml-3 font-mono">{{ lesson.duration }}</span>
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]/20">
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-5">授课讲师</h2>
              <div class="flex flex-col sm:flex-row gap-5">
                <div class="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#4A5F8B]/30 flex-shrink-0">
                  <LazyImage :src="course.instructor.avatar" :alt="course.instructor.name" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="font-bold text-[#F5F7FA] text-lg">{{ course.instructor.name }}</h3>
                  <p class="text-sm text-[#63B3ED] font-medium mb-2">{{ course.instructor.title }}</p>
                  <p class="text-sm text-[#B8C6D8] leading-relaxed mb-3">{{ course.instructor.bio }}</p>
                  <div class="flex flex-wrap gap-4">
                    <div class="flex items-center gap-1.5 text-xs text-[#6B7C93]">
                      <i class="fa-solid fa-book-open text-[#4A5F8B]"></i>
                      <span>{{ course.instructor.coursesCount }}门课程</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-[#6B7C93]">
                      <i class="fa-solid fa-users text-[#4A5F8B]"></i>
                      <span>{{ course.instructor.studentsCount }}名学员</span>
                    </div>
                    <div class="flex items-center gap-1.5 text-xs text-[#6B7C93]">
                      <i class="fa-solid fa-star text-[#4A5F8B]"></i>
                      <span>评分 {{ course.instructor.rating }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">学员评价</h2>
              <div class="space-y-4">
                <div v-for="review in course.reviews" :key="review.id" class="p-3 rounded">
                  <div class="flex items-center mb-2">
                    <div class="w-8 h-8 rounded-full overflow-hidden mr-2 border border-[#B8C6D8]">
                      <LazyImage :src="review.avatar" :alt="review.name" />
                    </div>
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
            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]/20 sticky top-20">
              <div class="text-center mb-6">
                <div class="text-3xl font-bold mb-2">
                  <span class="bg-gradient-to-r from-[#63B3ED] to-[#4A5F8B] bg-clip-text text-transparent">¥{{ course.price }}</span>
                </div>
                <p class="text-sm text-[#B8C6D8]">一次性购买，终身学习</p>
              </div>
              <button @click="showPaymentDialog = true" class="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-[#F5F7FA] hover:shadow-lg hover:shadow-[#4A5F8B]/30 hover:brightness-110 transition-all duration-300 mb-5 block text-center">
                立即购买
              </button>
              <div class="space-y-3">
                <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>{{ course.chapters.length }}章课程内容</div>
                <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>共{{ course.chapters.reduce((a, c) => a + c.lessons.length, 0) }}课时</div>
                <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>永久访问权限</div>
                <div class="flex items-center text-sm text-[#B8C6D8]"><i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>社群答疑支持</div>
              </div>
              <div class="flex gap-2 mt-4 pt-4 border-t border-[#4A5F8B]">
                <button @click="handleBookmark(course.title)" class="flex-1 py-2 border border-[#4A5F8B] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B]/20 transition-colors text-sm">
                  <i class="fa-solid fa-bookmark mr-1"></i> 收藏
                </button>
                <button @click="handleShare" class="flex-1 py-2 border border-[#4A5F8B] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B]/20 transition-colors text-sm">
                  <i class="fa-solid fa-share mr-1"></i> 分享
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <Transition name="fade">
          <div v-if="showPaymentDialog" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="showPaymentDialog = false">
            <div class="w-full max-w-md bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]" @click.stop>
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-bold text-[#F5F7FA]">确认购买</h3>
                <button @click="showPaymentDialog = false" class="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors">
                  <i class="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <div class="space-y-4">
                <div class="bg-[#1E2532] rounded-lg p-4">
                  <h4 class="font-medium text-[#F5F7FA] mb-1">{{ course.title }}</h4>
                  <p class="text-sm text-[#B8C6D8]">{{ course.instructor.name }}</p>
                </div>
                <div class="flex justify-between items-center text-[#B8C6D8]">
                  <span>课程价格</span>
                  <span class="text-2xl font-bold text-[#4A5F8B]">¥{{ course.price }}</span>
                </div>
                <div class="border-t border-[#4A5F8B]/30 pt-4">
                  <h5 class="text-sm font-medium text-[#F5F7FA] mb-2">选择支付方式</h5>
                  <div class="space-y-2">
                    <label
                      v-for="method in paymentMethods"
                      :key="method.id"
                      :class="['flex items-center p-3 rounded-lg border cursor-pointer transition-colors', selectedPayment === method.id ? 'border-[#4A5F8B] bg-[#4A5F8B]/10' : 'border-[#4A5F8B]/30 hover:border-[#4A5F8B]']"
                    >
                      <input type="radio" v-model="selectedPayment" :value="method.id" class="sr-only" />
                      <i :class="['text-xl mr-3', method.icon, method.color]"></i>
                      <span class="text-[#F5F7FA]">{{ method.name }}</span>
                    </label>
                  </div>
                </div>
                <div class="bg-[#1E2532] rounded-lg p-3 text-sm text-[#B8C6D8]">
                  <i class="fa-solid fa-circle-info text-[#4A5F8B] mr-2"></i>
                  购买后即可永久访问全部课程内容，含社群答疑支持
                </div>
              </div>
              <div class="flex gap-3 mt-6">
                <button @click="showPaymentDialog = false" class="flex-1 py-3 border border-[#4A5F8B] text-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B]/10 transition-colors">
                  取消
                </button>
                <button @click="handleConfirmPayment" :disabled="!selectedPayment" :class="['flex-1 py-3 rounded-lg font-medium transition-colors', selectedPayment ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' : 'bg-gray-600 text-gray-400 cursor-not-allowed']">
                  确认支付 ¥{{ course.price }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

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
import { useInteraction } from '../composables/useInteraction';
import LazyImage from '../components/LazyImage.vue';

const route = useRoute();
const routeId = computed(() => route.params.id as string | undefined);
const openChapters = ref<number[]>([0]);
const { showSuccess, handleBookmark, handleShare } = useInteraction();

const showPaymentDialog = ref(false);
const selectedPayment = ref('');

const paymentMethods = [
  { id: 'alipay', name: '支付宝', icon: 'fa-brands fa-alipay', color: 'text-blue-400' },
  { id: 'wechat', name: '微信支付', icon: 'fa-brands fa-weixin', color: 'text-green-400' },
  { id: 'card', name: '银行卡支付', icon: 'fa-solid fa-credit-card', color: 'text-yellow-400' }
];

const courses = [
  {
    id: 'vt1', title: '风光摄影基础入门', description: '从零开始学习风光摄影的基本技巧和构图方法。本课程涵盖相机设置、曝光控制、滤镜使用、经典构图法则等内容，帮助您打好风光摄影的坚实基础。',
    thumbnail: 'https://picsum.photos/1280/720?random=108',
    duration: '45:20', level: '初级', views: 12000, rating: 4.8, price: 299,
    instructor: { name: '张明', avatar: 'https://picsum.photos/400/400?random=109', title: '国家地理摄影师', experience: '10年摄影经验', bio: '国家地理签约摄影师，拥有超过10年的风光摄影经验。作品曾发表于《中国国家地理》《摄影之友》等知名杂志，擅长将复杂的光影理论转化为简单易懂的实战技巧。', coursesCount: 5, studentsCount: 35800, rating: 4.9 },
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
      { id: 'r1', name: '摄影爱好者小王', avatar: 'https://picsum.photos/400/400?random=110', rating: 5, date: '2023-11-15', comment: '非常棒的课程，讲解非常详细，适合初学者。从最基础的知识开始，循序渐进，让我对风光摄影有了全新的认识。' },
      { id: 'r3', name: '摄影初学者小张', avatar: 'https://picsum.photos/400/400?random=111', rating: 5, date: '2023-12-01', comment: '课程非常实用，学到了很多实用的技巧。特别是关于光线运用的部分，让我在拍摄时有了更多的想法。' }
    ]
  },
  {
    id: 'vt2', title: '人像摄影用光技巧', description: '掌握人像摄影中光线运用的技巧，拍出自然生动的人像作品。',
    thumbnail: 'https://picsum.photos/1280/720?random=112',
    duration: '38:15', level: '中级', views: 8500, rating: 4.7, price: 399,
    instructor: { name: '李华', avatar: 'https://picsum.photos/400/400?random=113', title: '人像摄影师', experience: '15年人像摄影经验', bio: '拥有15年专业人像摄影经验，曾为多位知名艺人及品牌拍摄人像作品。专注于自然光人像和情绪风人像，作品以细腻的光影和自然的情绪表达著称。', coursesCount: 3, studentsCount: 22400, rating: 4.8 },
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
      { id: 'r1', name: '摄影爱好者小李', avatar: 'https://picsum.photos/400/400?random=114', rating: 4, date: '2023-11-15', comment: '光线运用的讲解非常细致，学到了很多实用技巧。' }
    ]
  },
  {
    id: 'vt3', title: '后期修图大师班 - Lightroom & Photoshop', description: '从入门到精通，系统学习Lightroom和Photoshop的后期处理技巧。本课程涵盖RAW文件处理、色彩管理、图层与蒙版、人像精修、风光调色、创意合成等全流程内容，帮助你建立完整的后期工作流。',
    thumbnail: 'https://picsum.photos/1280/720?random=115',
    duration: '120:00', level: '高级', views: 15200, rating: 4.9, price: 599,
    instructor: { name: '后期专家王磊', avatar: 'https://picsum.photos/400/400?random=116', title: 'Adobe认证讲师', experience: '12年后期处理与教学经验', bio: 'Adobe认证讲师，拥有12年后期处理与教学经验。曾为多家知名摄影机构和电商平台提供后期培训，累计培养学员超过5万人。授课程风格深入浅出，注重实战。', coursesCount: 8, studentsCount: 52000, rating: 4.9 },
    tags: ['后期', 'Lightroom', 'Photoshop', '调色', '精修'],
    chapters: [
      { title: '后期基础与工作流', duration: '25分钟', lessons: [
        { id: 'l1', title: '后期处理的核心思路', duration: '05:00', isFree: true, completed: true },
        { id: 'l2', title: '色彩管理与显示器校准', duration: '06:00', isFree: true, completed: false },
        { id: 'l3', title: 'RAW vs JPEG：选择与优势', duration: '07:00', isFree: false, completed: false },
        { id: 'l4', title: '建立高效后期工作流', duration: '07:00', isFree: false, completed: false }
      ]},
      { title: 'Lightroom 核心技法', duration: '40分钟', lessons: [
        { id: 'l5', title: '图库管理与筛选', duration: '08:00', isFree: false, completed: false },
        { id: 'l6', title: '基本面板深度解析', duration: '10:00', isFree: false, completed: false },
        { id: 'l7', title: '色调曲线与HSL调色', duration: '10:00', isFree: false, completed: false },
        { id: 'l8', title: '局部调整与渐变滤镜', duration: '12:00', isFree: false, completed: false }
      ]},
      { title: 'Photoshop 进阶精修', duration: '55分钟', lessons: [
        { id: 'l9', title: '图层与蒙版基础', duration: '12:00', isFree: false, completed: false },
        { id: 'l10', title: '人像精修全流程', duration: '15:00', isFree: false, completed: false },
        { id: 'l11', title: '风光照片终极调色', duration: '13:00', isFree: false, completed: false },
        { id: 'l12', title: '创意合成技巧', duration: '15:00', isFree: false, completed: false }
      ]}
    ],
    reviews: [
      { id: 'r1', name: '摄影师小赵', avatar: 'https://picsum.photos/400/400?random=117', rating: 5, date: '2023-12-10', comment: '非常系统的后期课程，从基础到进阶都有覆盖。王磊老师讲解非常细致，每个操作都有演示，跟着学下来进步非常大！' },
      { id: 'r2', name: '风光摄影师阿杰', avatar: 'https://picsum.photos/400/400?random=118', rating: 5, date: '2023-12-18', comment: '学会了用Photoshop精修风光照片，调色效果大幅度提升。强烈推荐给想要提升后期水平的朋友。' },
      { id: 'r3', name: '人像摄影师小林', avatar: 'https://picsum.photos/400/400?random=119', rating: 4, date: '2024-01-05', comment: '人像精修部分非常实用，尤其是皮肤处理和液化技巧，效果自然不假。' }
    ]
  }
];

const course = computed(() => courses.find(c => c.id === routeId.value));

function toggleChapter(idx: number) {
  const i = openChapters.value.indexOf(idx);
  if (i === -1) openChapters.value.push(idx);
  else openChapters.value.splice(i, 1);
}

function handleConfirmPayment() {
  showPaymentDialog.value = false;
  showSuccess(`已成功购买「${course.value?.title}」，支付 ¥${course.value?.price}`);
}
</script>

<style scoped>
.chapter-expand-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.chapter-expand-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
  overflow: hidden;
}

.chapter-expand-enter-from,
.chapter-expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.chapter-expand-enter-to,
.chapter-expand-leave-from {
  opacity: 1;
  max-height: 600px;
}

.fade-enter-active, .fade-leave-active { transition: all 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; max-height: 0; }
.fade-enter-to, .fade-leave-from { opacity: 1; max-height: 500px; }

@media (prefers-reduced-motion: reduce) {
  .chapter-expand-enter-active,
  .chapter-expand-leave-active,
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>