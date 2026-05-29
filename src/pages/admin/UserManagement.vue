<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#F5F7FA]">
          {{ pageTitle }}
        </h1>
        <p class="text-[#B8C6D8] mt-1">
          {{ pageDescription }}
        </p>
      </div>
      <div class="mt-4 md:mt-0 flex flex-wrap gap-3">
        <Button>
          <i class="fa-solid fa-plus mr-2"></i>
          添加用户
        </Button>
        <Button variant="secondary">
          <i class="fa-solid fa-upload mr-2"></i>
          批量导入
        </Button>
      </div>
    </div>

    <div class="bg-[#2D3748] p-4 rounded-xl border border-[#4A5F8B]">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <input
            type="text"
            placeholder="搜索用户名或邮箱..."
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
          v-model="roleFilter"
          class="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
        >
          <option value="all">全部角色</option>
          <option value="user">普通用户</option>
          <option value="photographer">摄影师</option>
          <option value="admin">管理员</option>
        </select>

        <select
          v-model="sortBy"
          class="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
        >
          <option value="joinDate">按加入日期排序</option>
          <option value="username">按用户名排序</option>
          <option value="posts">按作品数量排序</option>
          <option value="followers">按粉丝数量排序</option>
        </select>
      </div>
    </div>

    <div v-if="showBulkActions" class="bg-[#4A5F8B] p-3 rounded-xl flex items-center justify-between">
      <div class="flex items-center text-[#F5F7FA]">
        <i class="fa-solid fa-check-square mr-2"></i>
        <span>已选择 {{ selectedUsers.length }} 项</span>
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
                    :checked="selectedUsers.length === filteredUsers.length && filteredUsers.length > 0"
                    @change="handleSelectAll"
                    class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                  />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">用户信息</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">角色</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">加入日期</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">作品</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">粉丝</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-[#1E2532] divide-y divide-[#4A5F8B]">
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="hover:bg-[#2D3748] transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="selectedUsers.includes(user.id)"
                  @change="handleSelectUser(user.id)"
                  class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      class="h-10 w-10 rounded-full object-cover"
                      :src="user.avatar"
                      :alt="user.username"
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-[#F5F7FA]">{{ user.username }}</div>
                    <div class="text-sm text-[#B8C6D8]">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.role === 'user'" class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded-full">普通用户</span>
                <span v-else-if="user.role === 'photographer'" class="px-2 py-1 bg-[#9F7AEA]/20 text-[#9F7AEA] text-xs rounded-full">摄影师</span>
                <span v-else-if="user.role === 'admin'" class="px-2 py-1 bg-[#F687B3]/20 text-[#F687B3] text-xs rounded-full">管理员</span>
                <span v-else class="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="user.status === 'active'" class="px-2 py-1 bg-[#38B2AC]/20 text-[#38B2AC] text-xs rounded-full">活跃</span>
                <span v-else-if="user.status === 'pending'" class="px-2 py-1 bg-[#F6AD55]/20 text-[#F6AD55] text-xs rounded-full">待审核</span>
                <span v-else-if="user.status === 'banned'" class="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full">已禁用</span>
                <span v-else class="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                {{ user.joinDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                {{ user.posts }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                {{ user.followers }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="handleUserAction(user.id, 'view')"
                    class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                    title="查看详情"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button
                    @click="handleUserAction(user.id, 'edit')"
                    class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                    title="编辑用户"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    v-if="user.status === 'active'"
                    @click="handleUserAction(user.id, 'ban')"
                    class="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                    title="禁用用户"
                  >
                    <i class="fa-solid fa-ban"></i>
                  </button>
                  <button
                    v-else-if="user.status === 'banned'"
                    @click="handleUserAction(user.id, 'unban')"
                    class="text-[#38B2AC] hover:text-[#38A169] transition-colors p-1"
                    title="解除禁用"
                  >
                    <i class="fa-solid fa-check-circle"></i>
                  </button>
                  <button
                    v-else
                    @click="handleUserAction(user.id, 'ban')"
                    class="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                    title="拒绝审核"
                  >
                    <i class="fa-solid fa-times-circle"></i>
                  </button>
                  <button
                    @click="handleUserAction(user.id, 'delete')"
                    class="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                    title="删除用户"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredUsers.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
          <i class="fa-solid fa-users text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无用户</h3>
        <p class="text-[#B8C6D8]">
          {{ emptyText }}
        </p>
      </div>

      <div v-if="filteredUsers.length > 0" class="px-6 py-4 bg-[#1E2532] border-t border-[#4A5F8B] flex items-center justify-between">
        <div class="text-sm text-[#B8C6D8]">
          显示 1 到 {{ filteredUsers.length }} 条，共 {{ filteredUsers.length }} 条
        </div>
        <nav class="flex items-center space-x-1">
          <button class="px-3 py-1 border border-[#4A5F8B] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
            <i class="fa-solid fa-chevron-left text-xs"></i>
          </button>
          <button class="px-3 py-1 border border-[#4A5F8B] rounded-lg bg-[#4A5F8B] text-[#F5F7FA]">1</button>
          <button class="px-3 py-1 border border-[#4A5F8B] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
            <i class="fa-solid fa-chevron-right text-xs"></i>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '../../composables/useToast'
import Button from '../../components/common/Button.vue'

interface User {
  id: string
  username: string
  email: string
  avatar: string
  role: string
  status: string
  joinDate: string
  posts: number
  followers: number
  following: number
}

const mockUsers: User[] = [
  {
    id: '1', username: '张三', email: 'zhangsan@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male&sign=92090021266b3aaadfd4d99b36d00763',
    role: 'user', status: 'active', joinDate: '2023-01-15', posts: 28, followers: 125, following: 86
  },
  {
    id: '2', username: '李四', email: 'lisi@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female&sign=f09d83378aa1e845abd3d8360ae43318',
    role: 'user', status: 'active', joinDate: '2023-02-20', posts: 45, followers: 320, following: 156
  },
  {
    id: '3', username: '王五', email: 'wangwu@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20creative&sign=05eaa6a6889c9fd565f612592ebff64a',
    role: 'photographer', status: 'active', joinDate: '2023-03-05', posts: 76, followers: 542, following: 210
  },
  {
    id: '4', username: '赵六', email: 'zhaoliu@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20female%20professional&sign=de0253bc58d40781a8618749ea5612ee',
    role: 'photographer', status: 'pending', joinDate: '2023-03-18', posts: 12, followers: 38, following: 65
  },
  {
    id: '5', username: '孙七', email: 'sunqi@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20nature%20lover&sign=5bde84c0a947f0a379af97355ca16564',
    role: 'user', status: 'banned', joinDate: '2023-01-10', posts: 8, followers: 12, following: 30
  }
]

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const statusFilter = ref('all')
const roleFilter = ref('all')
const sortBy = ref('joinDate')
const users = ref<User[]>([...mockUsers])
const selectedUsers = ref<string[]>([])
const showBulkActions = ref(false)

const currentUserType = computed(() => {
  if (route.path.includes('/pending')) return 'pending'
  if (route.path.includes('/banned')) return 'banned'
  return 'all'
})

const pageTitle = computed(() => {
  if (currentUserType.value === 'pending') return '待审核用户'
  if (currentUserType.value === 'banned') return '已禁用用户'
  return '用户管理'
})

const pageDescription = computed(() => {
  if (currentUserType.value === 'pending') return '管理等待审核的新用户'
  if (currentUserType.value === 'banned') return '管理已禁用的用户'
  return '查看和管理所有用户'
})

const emptyText = computed(() => {
  if (currentUserType.value === 'pending') return '没有待审核的用户'
  if (currentUserType.value === 'banned') return '没有被禁用的用户'
  return '当前没有符合条件的用户'
})

const filteredUsers = computed(() => {
  let filtered = [...users.value]

  if (currentUserType.value === 'pending') {
    filtered = filtered.filter(user => user.status === 'pending')
  } else if (currentUserType.value === 'banned') {
    filtered = filtered.filter(user => user.status === 'banned')
  }

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    )
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'joinDate':
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      case 'username':
        return a.username.localeCompare(b.username)
      case 'posts':
        return b.posts - a.posts
      case 'followers':
        return b.followers - a.followers
      default:
        return 0
    }
  })

  return filtered
})

function handleSelectUser(userId: string) {
  const idx = selectedUsers.value.indexOf(userId)
  if (idx >= 0) {
    selectedUsers.value = selectedUsers.value.filter(id => id !== userId)
  } else {
    selectedUsers.value = [...selectedUsers.value, userId]
  }
  showBulkActions.value = selectedUsers.value.length > 0
}

function handleSelectAll() {
  if (selectedUsers.value.length === filteredUsers.value.length) {
    selectedUsers.value = []
    showBulkActions.value = false
  } else {
    selectedUsers.value = filteredUsers.value.map(user => user.id)
    showBulkActions.value = true
  }
}

function clearSelection() {
  selectedUsers.value = []
  showBulkActions.value = false
}

function handleBulkAction(action: string) {
  if (selectedUsers.value.length === 0) return

  switch (action) {
    case 'active':
      users.value = users.value.map(user =>
        selectedUsers.value.includes(user.id) ? { ...user, status: 'active' } : user
      )
      toast.success(`已将${selectedUsers.value.length}个用户设置为活跃状态`)
      break
    case 'banned':
      users.value = users.value.map(user =>
        selectedUsers.value.includes(user.id) ? { ...user, status: 'banned' } : user
      )
      toast.success(`已将${selectedUsers.value.length}个用户禁用`)
      break
    case 'delete':
      if (window.confirm(`确定要删除选中的${selectedUsers.value.length}个用户吗？此操作不可撤销。`)) {
        users.value = users.value.filter(user => !selectedUsers.value.includes(user.id))
        toast.success(`已删除${selectedUsers.value.length}个用户`)
      }
      break
  }

  selectedUsers.value = []
  showBulkActions.value = false
}

function handleUserAction(userId: string, action: string) {
  switch (action) {
    case 'view':
      router.push(`/admin/users/${userId}`)
      break
    case 'edit':
      router.push(`/admin/users/${userId}/edit`)
      break
    case 'ban':
      users.value = users.value.map(user =>
        user.id === userId ? { ...user, status: 'banned' } : user
      )
      toast.success('用户已禁用')
      break
    case 'unban':
      users.value = users.value.map(user =>
        user.id === userId ? { ...user, status: 'active' } : user
      )
      toast.success('用户已解除禁用')
      break
    case 'delete':
      if (window.confirm('确定要删除这个用户吗？此操作不可撤销。')) {
        users.value = users.value.filter(user => user.id !== userId)
        toast.success('用户已删除')
      }
      break
  }
}
</script>