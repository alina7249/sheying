<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#F5F7FA]">内容管理</h1>
        <p class="text-[#B8C6D8] mt-1">查看和管理所有用户发布的内容</p>
      </div>
      <div class="mt-4 md:mt-0">
        <Button @click="showInfo('打开筛选面板')">
          <i class="fa-solid fa-filter mr-2"></i>
          筛选
        </Button>
      </div>
    </div>

    <div class="bg-[#2D3748] p-4 rounded-xl border border-[#4A5F8B]">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <input
            type="text"
            placeholder="搜索标题或作者..."
            v-model="searchQuery"
            class="w-full px-4 py-2 pl-10 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
          />
          <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
        </div>

        <select
          v-model="contentType"
          class="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
        >
          <option value="all">全部类型</option>
          <option value="photo">摄影作品</option>
          <option value="post">社区帖子</option>
        </select>

        <select
          v-model="statusFilter"
          class="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
        >
          <option value="all">全部状态</option>
          <option value="active">活跃</option>
          <option value="pending">待审核</option>
          <option value="banned">已禁用</option>
        </select>

        <select
          v-model="sortBy"
          class="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
        >
          <option value="createdAt">按发布日期排序</option>
          <option value="title">按标题排序</option>
          <option value="views">按浏览量排序</option>
          <option value="likes">按点赞量排序</option>
        </select>
      </div>
    </div>

    <div v-if="showBulkActions" class="bg-[#4A5F8B] p-3 rounded-xl flex items-center justify-between">
      <div class="flex items-center text-[#F5F7FA]">
        <i class="fa-solid fa-check-square mr-2"></i>
        <span>已选择 {{ selectedContent.length }} 项</span>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="handleBulkAction('active')"
          class="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-lg hover:bg-[#4A5F8B] transition-colors text-sm"
        >
          启用
        </button>
        <button
          @click="handleBulkAction('banned')"
          class="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-lg hover:bg-[#4A5F8B] transition-colors text-sm"
        >
          禁用
        </button>
        <button
          @click="handleBulkAction('delete')"
          class="px-3 py-1 bg-[#F56565] text-white rounded-lg hover:bg-[#E53E3E] transition-colors text-sm"
        >
          删除
        </button>
        <button
          @click="clearSelection"
          class="p-1 text-[#F5F7FA] hover:text-[#B8C6D8] transition-colors"
        >
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
    </div>

    <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-[#4A5F8B]">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    :checked="selectedContent.length === filteredContent.length && filteredContent.length > 0"
                    @change="handleSelectAll"
                    class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                  />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">预览</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">标题</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">类型</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">作者</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">发布日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">浏览</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">点赞</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">评论</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-[#1E2532] divide-y divide-[#4A5F8B]">
            <tr
              v-for="item in filteredContent"
              :key="item.id"
              class="hover:bg-[#2D3748] transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="selectedContent.includes(item.id)"
                  @change="handleSelectContent(item.id)"
                  class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div v-if="item.type === 'photo' && item.thumbnail" class="w-16 h-16 rounded-lg overflow-hidden">
                  <img
                    :src="item.thumbnail"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div v-else class="w-16 h-16 rounded-lg bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B]">
                  <i class="fa-solid fa-file-lines text-xl"></i>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F5F7FA]">
                {{ item.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="item.type === 'photo'" class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded-full">摄影作品</span>
                <span v-else-if="item.type === 'post'" class="px-2 py-1 bg-[#9F7AEA]/20 text-[#9F7AEA] text-xs rounded-full">社区帖子</span>
                <span v-else class="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知类型</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <img
                      class="h-8 w-8 rounded-full object-cover"
                      :src="item.author.avatar"
                      :alt="item.author.name"
                    />
                  </div>
                  <div class="ml-2 text-sm text-[#B8C6D8]">
                    {{ item.author.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="item.status === 'active'" class="px-2 py-1 bg-[#38B2AC]/20 text-[#38B2AC] text-xs rounded-full">活跃</span>
                <span v-else-if="item.status === 'pending'" class="px-2 py-1 bg-[#F6AD55]/20 text-[#F6AD55] text-xs rounded-full">待审核</span>
                <span v-else-if="item.status === 'banned'" class="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full">已禁用</span>
                <span v-else class="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                {{ item.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                {{ item.views }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                {{ item.likes }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                {{ item.comments }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="handleContentAction(item.id, 'view')"
                    class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                    title="查看详情"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button
                    @click="handleContentAction(item.id, 'edit')"
                    class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                    title="编辑内容"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    v-if="item.status === 'active'"
                    @click="handleContentAction(item.id, 'ban')"
                    class="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                    title="禁用内容"
                  >
                    <i class="fa-solid fa-ban"></i>
                  </button>
                  <button
                    v-else-if="item.status === 'banned'"
                    @click="handleContentAction(item.id, 'unban')"
                    class="text-[#38B2AC] hover:text-[#38A169] transition-colors p-1"
                    title="解除禁用"
                  >
                    <i class="fa-solid fa-check-circle"></i>
                  </button>
                  <button
                    v-else
                    @click="handleContentAction(item.id, 'ban')"
                    class="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                    title="拒绝审核"
                  >
                    <i class="fa-solid fa-times-circle"></i>
                  </button>
                  <button
                    @click="handleContentAction(item.id, 'delete')"
                    class="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                    title="删除内容"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredContent.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
          <i class="fa-solid fa-images text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无内容</h3>
        <p class="text-[#B8C6D8]">当前没有符合条件的内容</p>
      </div>

      <div v-if="filteredContent.length > 0" class="px-6 py-4 bg-[#1E2532] border-t border-[#4A5F8B] flex items-center justify-between">
        <div class="text-sm text-[#B8C6D8]">
          显示 1 到 {{ filteredContent.length }} 条，共 {{ filteredContent.length }} 条
        </div>
        <nav class="flex items-center space-x-1">
          <button @click="showInfo('上一页')" class="px-3 py-1 border border-[#4A5F8B] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button class="px-3 py-1 border border-[#4A5F8B] rounded-lg bg-[#4A5F8B] text-[#F5F7FA]">1</button>
          <button @click="showInfo('下一页')" class="px-3 py-1 border border-[#4A5F8B] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '../../composables/useToast'
import { useInteraction } from '../../composables/useInteraction'
import Button from '../../components/common/Button.vue'

const { showInfo } = useInteraction()

interface ContentAuthor {
  id: string
  name: string
  avatar: string
}

interface Content {
  id: string
  title: string
  type: string
  thumbnail: string
  author: ContentAuthor
  status: string
  createdAt: string
  views: number
  likes: number
  comments: number
}

const mockContent: Content[] = [
  {
    id: '1', title: '晨曦中的山峦', type: 'photo',
    thumbnail: 'https://picsum.photos/1280/720?random=159',
    author: { id: '101', name: '光影捕手', avatar: 'https://picsum.photos/400/400?random=160' },
    status: 'active', createdAt: '2023-10-25', views: 1256, likes: 324, comments: 45
  },
  {
    id: '2', title: '城市剪影', type: 'photo',
    thumbnail: 'https://picsum.photos/1280/720?random=161',
    author: { id: '102', name: '城市摄影师陈默', avatar: 'https://picsum.photos/400/400?random=162' },
    status: 'active', createdAt: '2023-10-22', views: 987, likes: 289, comments: 37
  },
  {
    id: '3', title: '海浪与礁石', type: 'photo',
    thumbnail: 'https://picsum.photos/1280/720?random=163',
    author: { id: '103', name: '风景摄影爱好者', avatar: 'https://picsum.photos/400/400?random=164' },
    status: 'pending', createdAt: '2023-10-18', views: 1452, likes: 412, comments: 53
  },
  {
    id: '4', title: '森林晨雾', type: 'photo',
    thumbnail: 'https://picsum.photos/1280/720?random=165',
    author: { id: '104', name: '自然摄影师小林', avatar: 'https://picsum.photos/400/400?random=166' },
    status: 'active', createdAt: '2023-10-15', views: 1328, likes: 387, comments: 49
  },
  {
    id: '5', title: '【分享】我的春季风光摄影心得', type: 'post', thumbnail: '',
    author: { id: '101', name: '光影捕手', avatar: 'https://picsum.photos/400/400?random=167' },
    status: 'active', createdAt: '2023-10-10', views: 876, likes: 145, comments: 23
  },
  {
    id: '6', title: '请教：关于长曝光拍摄水流的问题', type: 'post', thumbnail: '',
    author: { id: '103', name: '风景摄影爱好者', avatar: 'https://picsum.photos/400/400?random=168' },
    status: 'active', createdAt: '2023-10-05', views: 542, likes: 89, comments: 34
  }
]

const router = useRouter()
const searchQuery = ref('')
const contentType = ref('all')
const statusFilter = ref('all')
const sortBy = ref('createdAt')
const content = ref<Content[]>([...mockContent])
const selectedContent = ref<string[]>([])
const showBulkActions = ref(false)

const filteredContent = computed(() => {
  let filtered = [...content.value]

  if (contentType.value !== 'all') {
    filtered = filtered.filter(item => item.type === contentType.value)
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(item => item.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.author.name.toLowerCase().includes(query)
    )
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'title':
        return a.title.localeCompare(b.title)
      case 'views':
        return b.views - a.views
      case 'likes':
        return b.likes - a.likes
      default:
        return 0
    }
  })

  return filtered
})

function handleSelectContent(contentId: string) {
  const idx = selectedContent.value.indexOf(contentId)
  if (idx >= 0) {
    selectedContent.value = selectedContent.value.filter(id => id !== contentId)
  } else {
    selectedContent.value = [...selectedContent.value, contentId]
  }
  showBulkActions.value = selectedContent.value.length > 0
}

function handleSelectAll() {
  if (selectedContent.value.length === filteredContent.value.length) {
    selectedContent.value = []
    showBulkActions.value = false
  } else {
    selectedContent.value = filteredContent.value.map(item => item.id)
    showBulkActions.value = true
  }
}

function clearSelection() {
  selectedContent.value = []
  showBulkActions.value = false
}

function handleBulkAction(action: string) {
  if (selectedContent.value.length === 0) return

  switch (action) {
    case 'active':
      content.value = content.value.map(item =>
        selectedContent.value.includes(item.id) ? { ...item, status: 'active' } : item
      )
      toast.success(`已将${selectedContent.value.length}个内容设置为活跃状态`)
      break
    case 'banned':
      content.value = content.value.map(item =>
        selectedContent.value.includes(item.id) ? { ...item, status: 'banned' } : item
      )
      toast.success(`已将${selectedContent.value.length}个内容禁用`)
      break
    case 'delete':
      if (window.confirm(`确定要删除选中的${selectedContent.value.length}个内容吗？此操作不可撤销。`)) {
        content.value = content.value.filter(item => !selectedContent.value.includes(item.id))
        toast.success(`已删除${selectedContent.value.length}个内容`)
      }
      break
  }

  selectedContent.value = []
  showBulkActions.value = false
}

function handleContentAction(contentId: string, action: string) {
  switch (action) {
    case 'view':
      router.push(`/admin/content/${contentId}`)
      break
    case 'edit':
      router.push(`/admin/content/${contentId}/edit`)
      break
    case 'ban':
      content.value = content.value.map(item =>
        item.id === contentId ? { ...item, status: 'banned' } : item
      )
      toast.success('内容已禁用')
      break
    case 'unban':
      content.value = content.value.map(item =>
        item.id === contentId ? { ...item, status: 'active' } : item
      )
      toast.success('内容已解除禁用')
      break
    case 'delete':
      if (window.confirm('确定要删除这个内容吗？此操作不可撤销。')) {
        content.value = content.value.filter(item => item.id !== contentId)
        toast.success('内容已删除')
      }
      break
  }
}
</script>