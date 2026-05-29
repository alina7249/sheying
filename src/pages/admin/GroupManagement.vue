<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#F5F7FA]">小组管理</h1>
        <p class="text-[#B8C6D8] mt-1">查看和管理所有摄影小组</p>
      </div>
      <div class="mt-4 md:mt-0">
        <Button>
          <i class="fa-solid fa-plus mr-2"></i>
          创建小组
        </Button>
      </div>
    </div>

    <div class="bg-[#2D3748] p-4 rounded-xl border border-[#4A5F8B]">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="relative">
          <input
            type="text"
            placeholder="搜索小组名称或描述..."
            v-model="searchQuery"
            class="w-full px-4 py-2 pl-10 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
          />
          <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
        </div>

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
          <option value="createdAt">按创建日期排序</option>
          <option value="name">按名称排序</option>
          <option value="memberCount">按成员数量排序</option>
          <option value="postCount">按帖子数量排序</option>
        </select>
      </div>
    </div>

    <div v-if="showBulkActions" class="bg-[#4A5F8B] p-3 rounded-xl flex items-center justify-between">
      <div class="flex items-center text-[#F5F7FA]">
        <i class="fa-solid fa-check-square mr-2"></i>
        <span>已选择 {{ selectedGroups.length }} 项</span>
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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="group in filteredGroups"
        :key="group.id"
        class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] overflow-hidden hover:shadow-lg transition-all"
      >
        <div class="relative h-40 overflow-hidden">
          <img
            :src="group.coverImage"
            :alt="`${group.name} cover`"
            class="w-full h-full object-cover"
          />
          <div class="absolute top-3 right-3">
            <span v-if="group.status === 'active'" class="px-2 py-1 bg-[#38B2AC]/20 text-[#38B2AC] text-xs rounded-full">活跃</span>
            <span v-else-if="group.status === 'pending'" class="px-2 py-1 bg-[#F6AD55]/20 text-[#F6AD55] text-xs rounded-full">待审核</span>
            <span v-else-if="group.status === 'banned'" class="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full">已禁用</span>
            <span v-else class="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知</span>
          </div>
          <div class="absolute left-3 bottom-3">
            <input
              type="checkbox"
              :checked="selectedGroups.includes(group.id)"
              @change="handleSelectGroup(group.id)"
              class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
            />
          </div>
        </div>

        <div class="p-5">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full border-2 border-[#2D3748] overflow-hidden shadow-lg -mt-8 mr-3 bg-[#1E2532]">
                <img
                  :src="group.avatar"
                  :alt="group.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 class="font-bold text-lg text-[#F5F7FA]">{{ group.name }}</h3>
                <p class="text-sm text-[#B8C6D8]">创建于 {{ group.createdAt }}</p>
              </div>
            </div>
          </div>

          <p class="text-[#B8C6D8] text-sm mb-4 line-clamp-2">{{ group.description }}</p>

          <div class="flex justify-between items-center text-sm text-[#B8C6D8] mb-4">
            <div class="flex items-center">
              <i class="fa-solid fa-users mr-1"></i>
              <span>{{ group.memberCount }} 成员</span>
            </div>
            <div class="flex items-center">
              <i class="fa-solid fa-file-lines mr-1"></i>
              <span>{{ group.postCount }} 帖子</span>
            </div>
          </div>

          <div class="flex items-center mb-4">
            <div class="w-8 h-8 rounded-full overflow-hidden mr-2">
              <img
                :src="group.owner.avatar"
                :alt="group.owner.name"
                class="w-full h-full object-cover"
              />
            </div>
            <span class="text-sm text-[#B8C6D8]">创建者: {{ group.owner.name }}</span>
          </div>

          <div class="flex space-x-2">
            <button
              @click="handleGroupAction(group.id, 'view')"
              class="flex-1 py-2 bg-[#1E2532] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B]"
            >
              查看详情
            </button>
            <button
              @click="handleGroupAction(group.id, 'edit')"
              class="px-3 py-2 bg-[#1E2532] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#4A5F8B] transition-colors border border-[#4A5F8B]"
            >
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button
              v-if="group.status === 'active'"
              @click="handleGroupAction(group.id, 'ban')"
              class="px-3 py-2 bg-[#F56565] text-white rounded-lg text-sm font-medium hover:bg-[#E53E3E] transition-colors"
            >
              <i class="fa-solid fa-ban"></i>
            </button>
            <button
              v-else-if="group.status === 'banned'"
              @click="handleGroupAction(group.id, 'unban')"
              class="px-3 py-2 bg-[#38B2AC] text-white rounded-lg text-sm font-medium hover:bg-[#38A169] transition-colors"
            >
              <i class="fa-solid fa-check-circle"></i>
            </button>
            <button
              v-else
              @click="handleGroupAction(group.id, 'ban')"
              class="px-3 py-2 bg-[#F56565] text-white rounded-lg text-sm font-medium hover:bg-[#E53E3E] transition-colors"
            >
              <i class="fa-solid fa-times-circle"></i>
            </button>
            <button
              @click="handleGroupAction(group.id, 'delete')"
              class="px-3 py-2 bg-[#F56565] text-white rounded-lg text-sm font-medium hover:bg-[#E53E3E] transition-colors"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredGroups.length === 0" class="p-12 text-center bg-[#2D3748] rounded-xl border border-[#4A5F8B]">
      <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
        <i class="fa-solid fa-users-rectangle text-2xl"></i>
      </div>
      <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无小组</h3>
      <p class="text-[#B8C6D8]">当前没有符合条件的小组</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '../../composables/useToast'
import Button from '../../components/common/Button.vue'

interface GroupOwner {
  id: string
  name: string
  avatar: string
}

interface Group {
  id: string
  name: string
  description: string
  avatar: string
  coverImage: string
  memberCount: number
  postCount: number
  status: string
  createdAt: string
  owner: GroupOwner
}

const mockGroups: Group[] = [
  {
    id: '1', name: '风光摄影爱好者', description: '专注于分享和交流风光摄影技巧、作品和器材使用经验。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photography%20club%20logo&sign=6e7a0377c1765869954de67da2805104',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=landscape%20photography%20mountain%20lake%20sunset%20group&sign=dcb281799d48f79a565ca84312d184f9',
    memberCount: 256, postCount: 158, status: 'active', createdAt: '2023-01-15',
    owner: { id: '101', name: '极简摄影师林风', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c' }
  },
  {
    id: '2', name: '人像摄影交流群', description: '探讨人像摄影技巧，分享创作经验和心得。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photography%20club%20logo&sign=946c2ca7a407063d1cb6744320f85a57',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=portrait%20photography%20studio%20setup%20group&sign=c1df4cb85b4f6fab9f97f0f60c9056d7',
    memberCount: 320, postCount: 215, status: 'active', createdAt: '2023-02-10',
    owner: { id: '102', name: '人像摄影师小雨', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=portrait%20photographer%20female%20smiling&sign=620b116509f1022014ac6d9864231ba5' }
  },
  {
    id: '3', name: '街头摄影联盟', description: '记录城市瞬间，分享街头摄影的魅力和技巧。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=street%20photography%20club%20logo%20urban&sign=ed44bded77c174a37b374cc92d3661f4',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=street%20photography%20urban%20scene%20group&sign=6f3c69be5e9d78d6308b08cfb3df1421',
    memberCount: 180, postCount: 176, status: 'active', createdAt: '2023-03-05',
    owner: { id: '103', name: '城市摄影师陈默', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20male%20creative&sign=5df0f9b10a5022623be1cb145264b5a1' }
  },
  {
    id: '4', name: '黑白摄影艺术', description: '专注于黑白摄影的创作与欣赏，分享技巧和作品。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=black%20and%20white%20photography%20club%20logo&sign=20391fbad91d80cc2bfc64b085492e16',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20photography%20art%20monochrome%20group&sign=d0d50bf259aa980b08ef620b4df5094a',
    memberCount: 145, postCount: 98, status: 'pending', createdAt: '2023-03-20',
    owner: { id: '104', name: '黑白摄影师阿明', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20male%20vintage%20style&sign=59a54bc0fa95cdb00b476bf1065e679c' }
  },
  {
    id: '5', name: '商业摄影圈', description: '商业摄影从业者交流平台，分享经验和资源。',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=commercial%20photography%20club%20logo&sign=3093fd57b573feda727d456e62bd8b08',
    coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=commercial%20photography%20studio%20product%20group&sign=c48254752661c0437c0cb036bfe03807',
    memberCount: 98, postCount: 64, status: 'banned', createdAt: '2023-02-28',
    owner: { id: '105', name: '商业摄影师老张', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20commercial%20photographer%20male&sign=55bbeea9b2593639d31ca56d2fbc559c' }
  }
]

const router = useRouter()
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('createdAt')
const groups = ref<Group[]>([...mockGroups])
const selectedGroups = ref<string[]>([])
const showBulkActions = ref(false)

const filteredGroups = computed(() => {
  let filtered = [...groups.value]

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(group => group.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      group =>
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.owner.name.toLowerCase().includes(query)
    )
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      case 'memberCount':
        return b.memberCount - a.memberCount
      case 'postCount':
        return b.postCount - a.postCount
      default:
        return 0
    }
  })

  return filtered
})

function handleSelectGroup(groupId: string) {
  const idx = selectedGroups.value.indexOf(groupId)
  if (idx >= 0) {
    selectedGroups.value = selectedGroups.value.filter(id => id !== groupId)
  } else {
    selectedGroups.value = [...selectedGroups.value, groupId]
  }
  showBulkActions.value = selectedGroups.value.length > 0
}

function handleSelectAll() {
  if (selectedGroups.value.length === filteredGroups.value.length) {
    selectedGroups.value = []
    showBulkActions.value = false
  } else {
    selectedGroups.value = filteredGroups.value.map(group => group.id)
    showBulkActions.value = true
  }
}

function clearSelection() {
  selectedGroups.value = []
  showBulkActions.value = false
}

function handleBulkAction(action: string) {
  if (selectedGroups.value.length === 0) return

  switch (action) {
    case 'active':
      groups.value = groups.value.map(group =>
        selectedGroups.value.includes(group.id) ? { ...group, status: 'active' } : group
      )
      toast.success(`已将${selectedGroups.value.length}个小组设置为活跃状态`)
      break
    case 'banned':
      groups.value = groups.value.map(group =>
        selectedGroups.value.includes(group.id) ? { ...group, status: 'banned' } : group
      )
      toast.success(`已将${selectedGroups.value.length}个小组禁用`)
      break
    case 'delete':
      if (window.confirm(`确定要删除选中的${selectedGroups.value.length}个小组吗？此操作不可撤销。`)) {
        groups.value = groups.value.filter(group => !selectedGroups.value.includes(group.id))
        toast.success(`已删除${selectedGroups.value.length}个小组`)
      }
      break
  }

  selectedGroups.value = []
  showBulkActions.value = false
}

function handleGroupAction(groupId: string, action: string) {
  switch (action) {
    case 'view':
      router.push(`/admin/groups/${groupId}`)
      break
    case 'edit':
      router.push(`/admin/groups/${groupId}/edit`)
      break
    case 'ban':
      groups.value = groups.value.map(group =>
        group.id === groupId ? { ...group, status: 'banned' } : group
      )
      toast.success('小组已禁用')
      break
    case 'unban':
      groups.value = groups.value.map(group =>
        group.id === groupId ? { ...group, status: 'active' } : group
      )
      toast.success('小组已解除禁用')
      break
    case 'delete':
      if (window.confirm('确定要删除这个小组吗？此操作不可撤销。')) {
        groups.value = groups.value.filter(group => group.id !== groupId)
        toast.success('小组已删除')
      }
      break
  }
}
</script>