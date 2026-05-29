<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="!post" class="flex items-center justify-center min-h-screen">
      <div class="text-[#B8C6D8]">加载中...</div>
    </div>

    <div v-else>
      <div class="mb-6">
        <router-link to="/community" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回社区</span>
        </router-link>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧帖子详情 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 帖子卡片 -->
          <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden shadow-sm hover:scale-[1.02] transition-transform">
            <div class="p-6">
              <div class="flex items-center space-x-2 mb-3">
                <span v-if="post.isEssential" class="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full flex items-center">
                  <i class="fa-solid fa-star mr-1"></i> 精华
                </span>
                <span v-if="post.isSticky" class="px-2 py-1 bg-[#48BB78]/20 text-[#48BB78] text-xs rounded-full flex items-center">
                  <i class="fa-solid fa-thumbtack mr-1"></i> 置顶
                </span>
              </div>
              <h1 class="text-2xl font-bold text-[#F5F7FA] mb-4">{{ post.title }}</h1>
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center">
                  <img :src="post.author.avatar" :alt="post.author.name" class="w-10 h-10 rounded-full object-cover mr-3" />
                  <div>
                    <div class="flex items-center">
                      <router-link :to="`/profile/${post.author.id}`" class="font-medium text-[#F5F7FA] hover:text-[#4A5F8B] transition-colors">
                        {{ post.author.name }}
                      </router-link>
                      <div class="ml-2 relative group">
                        <span :class="['text-xs px-1.5 py-0.5 rounded', getLevelBadgeClass(post.author.level)]">
                          Lv{{ post.author.level }}
                        </span>
                        <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 w-48 bg-[#1E2532] text-[#B8C6D8] text-xs rounded p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 whitespace-nowrap pointer-events-none">
                          发帖: {{ post.author.stats.posts }} | 获赞: {{ post.author.stats.likes }} | 活跃: {{ post.author.stats.days }}天
                        </div>
                      </div>
                    </div>
                    <p class="text-xs text-[#6B7C93]">{{ formatRelativeTime(post.createdAt) }} · {{ post.views }} 浏览</p>
                  </div>
                </div>
              </div>

              <!-- 帖子内容 -->
              <div class="prose prose-invert max-w-none">
                <template v-for="(paragraph, index) in post.content.split('\n\n')" :key="index">
                  <h2 v-if="paragraph.startsWith('## ')" class="text-xl font-bold text-[#F5F7FA] mt-6 mb-3">
                    {{ paragraph.replace('## ', '') }}
                  </h2>
                  <h3 v-else-if="paragraph.startsWith('### ')" class="text-lg font-bold text-[#F5F7FA] mt-5 mb-2">
                    {{ paragraph.replace('### ', '') }}
                  </h3>
                  <ul v-else-if="paragraph.startsWith('- ')" class="list-disc pl-5 space-y-1 mt-2 mb-4">
                    <li v-for="(item, idx) in paragraph.split('\n')" :key="idx" class="text-[#B8C6D8]">
                      {{ item.replace('- ', '') }}
                    </li>
                  </ul>
                  <p v-else class="text-[#B8C6D8] mb-4 leading-relaxed">{{ paragraph }}</p>
                </template>
              </div>

              <!-- 帖子标签 -->
              <div class="flex flex-wrap gap-2 my-6">
                <span v-for="(tag, index) in post.tags" :key="index" class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">
                  #{{ tag }}
                </span>
              </div>

              <!-- 互动按钮 -->
              <div class="flex justify-between items-center pt-4 border-t border-[#4A5F8B]">
                <div class="flex items-center space-x-6">
                  <button @click="handleLike" :class="['flex items-center space-x-1 transition-colors', isLiked ? 'text-[#F56565]' : 'text-[#6B7C93] hover:text-[#B8C6D8]']">
                    <i class="fa-solid fa-heart"></i>
                    <span>{{ likes }}</span>
                  </button>
                  <button class="flex items-center space-x-1 text-[#6B7C93] hover:text-[#B8C6D8] transition-colors">
                    <i class="fa-solid fa-comment"></i>
                    <span>{{ post.comments }}</span>
                  </button>
                  <button @click="handleBookmark" :class="['flex items-center space-x-1 transition-colors', isBookmarked ? 'text-[#F6AD55]' : 'text-[#6B7C93] hover:text-[#B8C6D8]']">
                    <i class="fa-solid fa-bookmark"></i>
                    <span>收藏</span>
                  </button>
                  <button @click="saveReadingProgress" class="text-[#6B7C93] hover:text-[#B8C6D8] transition-colors" title="保存阅读进度">
                    <i class="fa-solid fa-save"></i>
                  </button>
                </div>
                <ShareButton :url="`${window.location.origin}/post/${post?.id}`" :title="post?.title" class="ml-2 relative z-10" />
              </div>
            </div>
          </div>

          <!-- 评论区 -->
          <CommentSection :postId="post.id" />
        </div>

        <!-- 右侧边栏 -->
        <div class="space-y-6">
          <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
            <div class="flex items-center space-x-4 mb-4">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-[#4A5F8B]">
                <img :src="post.author.avatar" :alt="post.author.name" class="w-full h-full object-cover" />
              </div>
              <div>
                <h3 class="font-bold text-[#F5F7FA]">{{ post.author.name }}</h3>
                <p class="text-xs text-[#4A5F8B]">Lv{{ post.author.level }}</p>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 mb-4">
              <div class="text-center">
                <p class="font-bold text-[#F5F7FA]">{{ post.author.stats.posts }}</p>
                <p class="text-xs text-[#B8C6D8]">帖子</p>
              </div>
              <div class="text-center">
                <p class="font-bold text-[#F5F7FA]">{{ post.author.stats.likes }}</p>
                <p class="text-xs text-[#B8C6D8]">获赞</p>
              </div>
              <div class="text-center">
                <p class="font-bold text-[#F5F7FA]">{{ post.author.stats.days }}</p>
                <p class="text-xs text-[#B8C6D8]">活跃天</p>
              </div>
            </div>
            <button
              :class="['w-full py-2 rounded-lg font-medium transition-colors', isFollowing ? 'bg-[#6B7C93] text-[#F5F7FA] hover:bg-[#718096]' : 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]']"
              @click="toggleFollow"
            >
              {{ isFollowing ? '已关注' : '关注作者' }}
            </button>
          </div>

          <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">相关帖子</h3>
            <div class="space-y-4">
              <div v-for="relatedPost in relatedPosts" :key="relatedPost.id" class="group">
                <router-link :to="`/post/${relatedPost.id}`" class="block">
                  <div class="bg-[#1E2532] rounded-lg p-4 border border-[#4A5F8B] group-hover:border-[#4A5F8B] transition-colors">
                    <h4 class="font-medium text-[#F5F7FA] group-hover:text-[#4A5F8B] transition-colors mb-1 line-clamp-2">
                      {{ relatedPost.title }}
                    </h4>
                    <p class="text-xs text-[#B8C6D8]">{{ relatedPost.author.name }} · {{ formatRelativeTime(relatedPost.createdAt) }}</p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-lg p-6">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <a v-for="(tag, index) in allUniqueTags" :key="index" :href="`/search?tag=${tag}`"
                class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                #{{ tag }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'sonner'
import { useAuthStore } from '@/store/authStore'
import CommentSection from '@/components/CommentSection.vue'
import ShareButton from '@/components/common/ShareButton.vue'

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

interface Post {
  id: string
  title: string
  content: string
  author: {
    id: string
    name: string
    avatar: string
    level: number
    stats: { posts: number; likes: number; days: number }
  }
  tags: string[]
  createdAt: string
  likes: number
  comments: number
  views: number
  isEssential: boolean
  isSticky: boolean
}

const mockPosts: Post[] = [
  {
    id: '1', title: '分享我的极简主义摄影心得',
    content: `在过去的一年里，我专注于极简主义摄影，通过简化构图和色彩，突出主题的本质。今天想和大家分享一些心得和技巧。

## 极简主义摄影的核心原则

极简主义摄影的核心理念是"少即是多"（Less is more）。在构图时，我会问自己：这个元素是否必要？它是否能为主题服务？如果答案是否定的，我就会尝试移除它。

## 构图技巧分享

1. **负空间的运用**
   负空间是极简摄影中最强大的工具之一。留出足够的空白可以让主体更加突出，也能创造出宁静、简约的氛围。

2. **线条与几何形状**
   在城市环境中，我特别关注线条和几何形状。重复的图案、对角线、三角形等都能为照片增添结构感和视觉趣味。

3. **色彩的减法**
   我通常会限制照片的色彩范围，有时候甚至会直接转换为黑白。这样可以让观众的注意力更加集中在构图和光影上。

## 拍摄建议

- 随身携带相机，随时捕捉灵感
- 尝试从不同角度观察同一个场景
- 练习"框式思维"，用手或者取景器提前构图
- 后期处理时注重细节，保持简洁

希望这些心得对大家有所帮助！欢迎在评论区分享你们的作品和想法。`,
    author: { id: '1', name: '极简摄影师林风', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c', level: 8, stats: { posts: 156, likes: 2345, days: 365 } },
    tags: ['极简主义', '构图', '心得', '技巧'], createdAt: '2023-10-25', likes: 125, comments: 34, views: 890, isEssential: true, isSticky: false
  },
  {
    id: '2', title: '【器材评测】索尼A7R V深度使用体验',
    content: `入手索尼A7R V已经三个月了，作为一名专业摄影师，我想从实际使用的角度分享一下这款相机的优缺点。

## 外观与操控

A7R V的外观设计延续了索尼A7系列的经典风格，但在细节上有一些改进：

- 握把更深，长时间使用更舒适
- 新增的转盘锁定功能非常实用
- 屏幕素质提升明显，触控反应迅速

## 核心性能表现

### 画质表现
作为一台6100万像素的全画幅相机，A7R V的画质表现令人印象深刻：
- 细节保留能力极强，即使在高ISO下也能保持良好的锐度
- 宽容度表现出色，暗部提亮后噪点控制得当
- 色彩还原准确，直出色彩更加讨喜

### 对焦系统
这是A7R V最大的升级点之一：
- 新的AI对焦系统非常智能，人物、动物、鸟类识别精准
- 弱光环境下对焦速度和准确性都有显著提升
- 跟踪对焦稳定性大大增强，适合拍摄运动题材

## 电池续航与发热

- 电池续航相比上一代有明显提升，正常拍摄可以坚持一天
- 4K60P录制时发热控制良好，连续拍摄半小时没有明显过热现象
- 充电速度快，支持USB-C快充

## 总结

索尼A7R V是一款非常全面的旗舰相机，特别适合风光、人像和商业摄影。`,
    author: { id: '2', name: '城市摄影师陈默', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1', level: 6, stats: { posts: 89, likes: 1234, days: 240 } },
    tags: ['器材评测', '索尼', '全画幅', 'A7R5'], createdAt: '2023-10-24', likes: 230, comments: 56, views: 1250, isEssential: true, isSticky: true
  },
  {
    id: '3', title: '寻找城市中的几何美感',
    content: `城市环境中蕴含着丰富的几何元素，这些线条和形状构成了独特的视觉语言。分享几个我常用的寻找和拍摄方法：

### 1. 寻找重复图案

在城市中，重复的窗户、阳台、栏杆等都是很好的拍摄对象。它们可以创造出节奏感和韵律感，让照片更有视觉冲击力。

拍摄技巧：
- 使用长焦镜头压缩空间，增强重复感
- 尝试不同角度，找到最佳的构图方式
- 注意光线的方向，利用阴影增强立体感

### 2. 发现对角线和引导线

城市中的道路、桥梁、楼梯等常常形成自然的对角线和引导线，引导观众的视线。

拍摄技巧：
- 将主体放在线条的交点或尽头
- 使用广角镜头增强线条的透视感
- 尝试从高处拍摄，获得更好的线条视角

### 3. 利用建筑的几何形状

现代建筑的几何形状往往非常简洁明了，是极简摄影的绝佳素材。

拍摄技巧：
- 寻找对称的建筑结构
- 利用玻璃幕墙的反射创造有趣的画面
- 在不同时段拍摄，利用光线创造不同的效果

希望这些方法能帮助你发现城市中隐藏的几何美感。`,
    author: { id: '1', name: '极简摄影师林风', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c', level: 8, stats: { posts: 156, likes: 2345, days: 365 } },
    tags: ['城市摄影', '几何构图', '技巧'], createdAt: '2023-10-23', likes: 98, comments: 23, views: 650, isEssential: false, isSticky: false
  }
]

const post = ref<Post | null>(null)
const relatedPosts = ref<Post[]>([])
const isLiked = ref(false)
const likes = ref(0)
const isBookmarked = ref(false)
const isFollowing = ref(false)

const allUniqueTags = [...new Set(mockPosts.flatMap(p => p.tags))].sort(() => Math.random() - 0.5).slice(0, 10)

onMounted(() => {
  const id = route.params.id as string
  const currentPost = mockPosts.find(p => p.id === id)
  if (currentPost) {
    post.value = currentPost
    likes.value = currentPost.likes
    relatedPosts.value = mockPosts.filter(p => p.id !== id).sort(() => Math.random() - 0.5).slice(0, 3)
  }
})

const getLevelBadgeClass = (level: number) => {
  if (level >= 9) return 'bg-gradient-to-r from-yellow-400 to-amber-600 text-white'
  if (level >= 7) return 'bg-blue-800 text-white'
  if (level >= 5) return 'bg-[#4A5F8B] text-white'
  if (level >= 3) return 'bg-gray-600 text-white'
  return 'bg-gray-300 text-gray-800'
}

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diffInSeconds < 60) return "刚刚"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}天前`
  return date.toLocaleDateString('zh-CN')
}

const handleLike = () => {
  if (!authState.isAuthenticated) {
    toast.info('请先登录后再点赞')
    return
  }
  if (isLiked.value) {
    likes.value--
  } else {
    likes.value++
  }
  isLiked.value = !isLiked.value
}

const handleBookmark = () => {
  if (!authState.isAuthenticated) {
    toast.info('请先登录后再收藏')
    return
  }
  isBookmarked.value = !isBookmarked.value
  toast.success(isBookmarked.value ? '已取消收藏' : '收藏成功')
}

const saveReadingProgress = () => {
  if (!authState.isAuthenticated) {
    toast.info('请先登录后再保存阅读进度')
    return
  }
  const scrollPosition = window.scrollY
  const bookmarkPositions = JSON.parse(localStorage.getItem('bookmarkPositions') || '{}')
  bookmarkPositions[post.value?.id] = scrollPosition
  localStorage.setItem('bookmarkPositions', JSON.stringify(bookmarkPositions))
  toast.success('阅读进度已保存')
}

const toggleFollow = () => {
  if (!authState.isAuthenticated) {
    toast.info('请先登录后再关注作者')
    return
  }
  isFollowing.value = !isFollowing.value
  toast.success(isFollowing.value ? '已取消关注作者' : `已关注 ${post.value?.author.name}`)
}
</script>