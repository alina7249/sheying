<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="!project" class="flex items-center justify-center min-h-screen">
      <div class="text-[#B8C6D8]">加载中...</div>
    </div>

    <div v-else>
      <div class="mb-6">
        <router-link to="/projects" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回专题列表</span>
        </router-link>
      </div>

      <div class="relative rounded-xl overflow-hidden mb-8 bg-[#2D3748] border border-[#4A5F8B]">
        <img :src="project.image" :alt="project.title" class="w-full h-[50vh] object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1E2532] to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-sm rounded-full">{{ project.type }}</span>
            <span class="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] text-sm rounded-full">更新于 {{ project.updateDate }}</span>
          </div>
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F7FA] mb-2">{{ project.title }}</h1>
          <p class="text-lg text-[#B8C6D8]">{{ project.intro }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">专题介绍</h2>
            <div class="prose prose-invert max-w-none">
              <p class="text-[#B8C6D8] leading-relaxed">{{ project.description }}</p>
            </div>
            <div class="flex flex-wrap gap-2 mt-6">
              <span v-for="(tag, index) in project.tags" :key="index" class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-sm">
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">专题内容列表</h2>
            <div class="space-y-4">
              <div v-for="(item, index) in project.chapters" :key="index"
                class="flex justify-between items-center p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                <div class="flex items-center">
                  <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="font-medium text-[#F5F7FA]">{{ item.title }}</h3>
                    <p class="text-sm text-[#B8C6D8]">{{ item.duration }}</p>
                  </div>
                </div>
                <button class="text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors">
                  <i class="fa-solid fa-link"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">作者信息</h2>
            <div class="flex items-center mb-4">
              <img :src="project.author.avatar" :alt="project.author.name" class="w-16 h-16 rounded-full mr-4 object-cover" />
              <div>
                <h3 class="font-bold text-[#F5F7FA]">{{ project.author.name }}</h3>
                <p class="text-sm text-[#4A5F8B]">{{ project.author.title }}</p>
                <p class="text-sm mt-1 text-[#B8C6D8]">{{ project.author.bio }}</p>
              </div>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">分享专题</h2>
            <div class="flex justify-center space-x-4">
              <button @click="shareToSocial('wechat')" class="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors">
                <i class="fa-brands fa-weixin"></i>
              </button>
              <button @click="shareToSocial('weibo')" class="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors">
                <i class="fa-brands fa-weibo"></i>
              </button>
              <button @click="shareToSocial('qq')" class="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors">
                <i class="fa-brands fa-qq"></i>
              </button>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">相关专题</h2>
            <div class="space-y-4">
              <div v-for="relatedProject in relatedProjects" :key="relatedProject.id" class="group">
                <router-link :to="`/project/${relatedProject.id}`" class="block">
                  <div class="bg-[#1E2532] rounded-lg p-4 border border-[#4A5F8B] group-hover:border-[#4A5F8B] transition-colors">
                    <h4 class="font-medium text-[#F5F7FA] group-hover:text-[#4A5F8B] transition-colors mb-1 line-clamp-2">
                      {{ relatedProject.title }}
                    </h4>
                    <p class="text-xs text-[#B8C6D8]">作者: {{ relatedProject.author.name }}</p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] mt-8">
        <CommentSection :postId="project.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import { CommentSection } from '@/components/CommentSection'

const route = useRoute()
const store = useAuthStore()

const authState = reactive({
  isAuthenticated: store.getState().isAuthenticated,
  user: store.getState().user,
})

const unsubscribe = store.subscribe((state) => {
  authState.isAuthenticated = state.isAuthenticated
  authState.user = state.user
})

onUnmounted(() => {
  unsubscribe()
})

interface Chapter {
  title: string
  duration: string
}

interface ProjectItem {
  id: string
  title: string
  type: string
  image: string
  intro: string
  description: string
  author: {
    name: string
    avatar: string
    title: string
    bio: string
  }
  tags: string[]
  updateDate: string
  chapters: Chapter[]
}

const projects: ProjectItem[] = [
  {
    id: 'p1',
    title: '风光摄影大师之路',
    type: '系列教程',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20master%20road%20tutorial%20banner&sign=e85dab2d2d9c4a84815d2c8a95c6ea2b',
    intro: '从入门到精通，系统学习风光摄影',
    description: '本专题汇集了风光摄影的全方位知识体系，从基础概念到高级技巧，系统地讲解风光摄影的方方面面。',
    author: {
      name: '风光摄影师张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor%20professional&sign=871dd04c358f08c5214aaf9a36e6bf27',
      title: '国家地理摄影师',
      bio: '从业15年，足迹遍布全球30个国家'
    },
    tags: ['风光', '教程', '系统', '进阶'],
    updateDate: '2023-10-25',
    chapters: [
      { title: '风光摄影基础入门', duration: '45分钟' },
      { title: '黄金时刻与蓝调时刻拍摄技巧', duration: '30分钟' },
      { title: '构图法则在风光摄影中的应用', duration: '35分钟' },
      { title: '长曝光与慢门摄影', duration: '25分钟' },
      { title: '全景接片技术', duration: '40分钟' },
      { title: '后期处理工作流', duration: '50分钟' }
    ]
  },
  {
    id: 'p2',
    title: '人像摄影从新手到高手',
    type: '系列教程',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20novice%20to%20expert%20tutorial%20banner&sign=2ae68c4ac40a4b1e35f493fe7a4aaa3c',
    intro: '从新手到高手，掌握人像摄影精髓',
    description: '从基础的人像摄影概念，到专业的布光技巧、构图要领和后期处理，帮助您成为人像摄影达人。',
    author: {
      name: '人像摄影师王莹',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20studio%20professional&sign=517e35b2f45eaaa7833acdb77504fdc6',
      title: '时尚人像摄影师',
      bio: '为多家时尚杂志拍摄封面和专访人物'
    },
    tags: ['人像', '教程', '布光', '人像后期'],
    updateDate: '2023-10-20',
    chapters: [
      { title: '人像摄影基础', duration: '40分钟' },
      { title: '自然光人像拍摄', duration: '35分钟' },
      { title: '室内人像布光技巧', duration: '45分钟' },
      { title: '人像构图与背景选择', duration: '30分钟' },
      { title: '人像后期修图', duration: '55分钟' }
    ]
  },
  {
    id: 'p3',
    title: '城市夜景摄影秘籍',
    type: '专题',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=city%20night%20photography%20secrets%20tutorial%20banner%20neon%20lights&sign=90addae14ef1ccfce0f40aa50c1179b5',
    intro: '掌握城市夜景摄影的独门秘籍',
    description: '城市夜景充满了无限可能，从车水马龙到霓虹闪耀，带您走进夜色中的光影世界。',
    author: {
      name: '城市摄影师陈默',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1',
      title: '城市摄影达人',
      bio: '专注城市摄影10年，作品多次获奖'
    },
    tags: ['城市', '夜景', '技巧', '光影'],
    updateDate: '2023-10-18',
    chapters: [
      { title: '夜景摄影器材准备', duration: '20分钟' },
      { title: '长曝光与车流轨迹', duration: '30分钟' },
      { title: '城市夜景构图', duration: '25分钟' },
      { title: '夜色人像与人造光的结合', duration: '35分钟' },
      { title: '照片后期优化', duration: '40分钟' }
    ]
  }
]

const project = ref<ProjectItem | null>(null)
const relatedProjects = ref<ProjectItem[]>([])

onMounted(() => {
  const id = route.params.id as string
  const foundProject = projects.find(p => p.id === id)
  if (foundProject) {
    project.value = foundProject
    relatedProjects.value = projects.filter(p => p.id !== id).sort(() => Math.random() - 0.5).slice(0, 2)
  }
})

const shareToSocial = (platform: string) => {
  const url = `${window.location.origin}/project/${route.params.id}`
  const title = project.value?.title || ''
  switch (platform) {
    case 'wechat':
      toast.info('请手动分享到微信')
      break
    case 'weibo':
      window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank')
      break
    case 'qq':
      window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank')
      break
  }
}
</script>