<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#F5F7FA]">订单管理</h1>
        <p class="text-[#B8C6D8] mt-1">查看和管理所有用户订单</p>
      </div>
      <div class="mt-4 md:mt-0 flex flex-wrap gap-3">
        <Button variant="secondary">
          <i class="fa-solid fa-filter mr-2"></i>
          筛选
        </Button>
        <Button>
          <i class="fa-solid fa-download mr-2"></i>
          导出订单
        </Button>
      </div>
    </div>

    <div class="bg-[#2D3748] p-4 rounded-xl border border-[#4A5F8B]">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="relative">
          <input
            type="text"
            placeholder="搜索订单号或用户名..."
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
          <option value="pending">待支付</option>
          <option value="paid">已支付</option>
          <option value="cancelled">已取消</option>
        </select>

        <select
          v-model="paymentMethodFilter"
          class="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
        >
          <option value="all">全部支付方式</option>
          <option value="alipay">支付宝</option>
          <option value="wechat">微信支付</option>
          <option value="creditcard">信用卡</option>
        </select>

        <select
          v-model="sortBy"
          class="bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
        >
          <option value="createdAt">按创建时间排序</option>
          <option value="totalAmount">按金额排序</option>
          <option value="userName">按用户名排序</option>
        </select>
      </div>
    </div>

    <div v-if="showBulkActions" class="bg-[#4A5F8B] p-3 rounded-xl flex items-center justify-between">
      <div class="flex items-center text-[#F5F7FA]">
        <i class="fa-solid fa-check-square mr-2"></i>
        <span>已选择 {{ selectedOrders.length }} 项</span>
      </div>
      <div class="flex items-center space-x-2">
        <button
          @click="handleBulkAction('export')"
          class="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-lg hover:bg-[#4A5F8B] transition-colors text-sm"
        >
          导出
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
                    :checked="selectedOrders.length === filteredOrders.length && filteredOrders.length > 0"
                    @change="handleSelectAll"
                    class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                  />
                </div>
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">订单号</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">用户</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">商品</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">金额</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">支付方式</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">状态</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">创建时间</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-[#1E2532] divide-y divide-[#4A5F8B]">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-[#2D3748] transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  :checked="selectedOrders.includes(order.id)"
                  @change="handleSelectOrder(order.id)"
                  class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F5F7FA]">
                {{ order.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-8 w-8">
                    <img
                      class="h-8 w-8 rounded-full object-cover"
                      :src="order.userAvatar"
                      :alt="order.userName"
                    />
                  </div>
                  <div class="ml-2 text-sm text-[#B8C6D8]">
                    {{ order.userName }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-[#B8C6D8]">
                  <div v-for="(item, index) in order.items" :key="index" class="mb-1 flex justify-between">
                    <span>{{ item.name }}</span>
                    <span>x{{ item.quantity }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#F5F7FA]">
                ¥{{ order.totalAmount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <i v-if="order.paymentMethod === 'alipay'" class="fa-brands fa-alipay text-blue-500"></i>
                  <i v-else-if="order.paymentMethod === 'wechat'" class="fa-brands fa-weixin text-green-500"></i>
                  <i v-else-if="order.paymentMethod === 'creditcard'" class="fa-credit-card text-purple-500"></i>
                  <i v-else class="fa-question text-gray-500"></i>
                  <span class="ml-2 text-sm text-[#B8C6D8]">
                    {{ order.paymentMethod === 'alipay' ? '支付宝' : order.paymentMethod === 'wechat' ? '微信支付' : '信用卡' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="order.status === 'pending'" class="px-2 py-1 bg-[#F6AD55]/20 text-[#F6AD55] text-xs rounded-full">待支付</span>
                <span v-else-if="order.status === 'paid'" class="px-2 py-1 bg-[#38B2AC]/20 text-[#38B2AC] text-xs rounded-full">已支付</span>
                <span v-else-if="order.status === 'cancelled'" class="px-2 py-1 bg-[#F56565]/20 text-[#F56565] text-xs rounded-full">已取消</span>
                <span v-else class="px-2 py-1 bg-[#6B7C93]/20 text-[#6B7C93] text-xs rounded-full">未知</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">
                {{ new Date(order.createdAt).toLocaleString('zh-CN') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="handleOrderAction(order.id, 'view')"
                    class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                    title="查看详情"
                  >
                    <i class="fa-solid fa-eye"></i>
                  </button>
                  <button
                    @click="handleOrderAction(order.id, 'edit')"
                    class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors p-1"
                    title="编辑订单"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                    @click="handleOrderAction(order.id, 'cancel')"
                    class="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                    title="取消订单"
                  >
                    <i class="fa-solid fa-ban"></i>
                  </button>
                  <button
                    @click="handleOrderAction(order.id, 'delete')"
                    class="text-[#F56565] hover:text-[#E53E3E] transition-colors p-1"
                    title="删除订单"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredOrders.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
          <i class="fa-solid fa-shopping-cart text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无订单</h3>
        <p class="text-[#B8C6D8]">当前没有符合条件的订单</p>
      </div>

      <div v-if="filteredOrders.length > 0" class="px-6 py-4 bg-[#1E2532] border-t border-[#4A5F8B] flex items-center justify-between">
        <div class="text-sm text-[#B8C6D8]">
          显示 1 到 {{ filteredOrders.length }} 条，共 {{ filteredOrders.length }} 条
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
import { useRouter } from 'vue-router'
import { toast } from '../../composables/useToast'
import Button from '../../components/common/Button.vue'

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  userId: string
  userName: string
  userAvatar: string
  items: OrderItem[]
  totalAmount: number
  status: string
  paymentMethod: string
  createdAt: string
  paidAt: string | null
}

const mockOrders: Order[] = [
  {
    id: 'O-20231025-001', userId: '101', userName: '张三',
    userAvatar: 'https://picsum.photos/400/400?random=146',
    items: [{ name: '银河会员·年卡', price: 299, quantity: 1 }],
    totalAmount: 299, status: 'paid', paymentMethod: 'alipay',
    createdAt: '2023-10-25T10:30:00', paidAt: '2023-10-25T10:32:15'
  },
  {
    id: 'O-20231024-002', userId: '102', userName: '李四',
    userAvatar: 'https://picsum.photos/400/400?random=147',
    items: [{ name: '器材租赁套餐A', price: 199, quantity: 2 }],
    totalAmount: 398, status: 'paid', paymentMethod: 'wechat',
    createdAt: '2023-10-24T14:20:00', paidAt: '2023-10-24T14:23:45'
  },
  {
    id: 'O-20231023-003', userId: '103', userName: '王五',
    userAvatar: 'https://picsum.photos/400/400?random=148',
    items: [{ name: '线上课程《风光摄影大师班》', price: 399, quantity: 1 }],
    totalAmount: 399, status: 'pending', paymentMethod: 'alipay',
    createdAt: '2023-10-23T09:15:00', paidAt: null
  },
  {
    id: 'O-20231022-004', userId: '104', userName: '赵六',
    userAvatar: 'https://picsum.photos/400/400?random=149',
    items: [
      { name: 'RAW素材包', price: 59, quantity: 1 },
      { name: '后期预设包', price: 39, quantity: 1 }
    ],
    totalAmount: 98, status: 'paid', paymentMethod: 'creditcard',
    createdAt: '2023-10-22T16:45:00', paidAt: '2023-10-22T16:47:30'
  },
  {
    id: 'O-20231021-005', userId: '105', userName: '孙七',
    userAvatar: 'https://picsum.photos/400/400?random=150',
    items: [{ name: '银河会员·月卡', price: 39, quantity: 1 }],
    totalAmount: 39, status: 'cancelled', paymentMethod: 'wechat',
    createdAt: '2023-10-21T11:30:00', paidAt: null
  }
]

const router = useRouter()
const searchQuery = ref('')
const statusFilter = ref('all')
const paymentMethodFilter = ref('all')
const sortBy = ref('createdAt')
const orders = ref<Order[]>([...mockOrders])
const selectedOrders = ref<string[]>([])
const showBulkActions = ref(false)

const filteredOrders = computed(() => {
  let filtered = [...orders.value]

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  if (paymentMethodFilter.value !== 'all') {
    filtered = filtered.filter(order => order.paymentMethod === paymentMethodFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      order =>
        order.id.toLowerCase().includes(query) ||
        order.userName.toLowerCase().includes(query)
    )
  }

  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'totalAmount':
        return b.totalAmount - a.totalAmount
      case 'userName':
        return a.userName.localeCompare(b.userName)
      default:
        return 0
    }
  })

  return filtered
})

function handleSelectOrder(orderId: string) {
  const idx = selectedOrders.value.indexOf(orderId)
  if (idx >= 0) {
    selectedOrders.value = selectedOrders.value.filter(id => id !== orderId)
  } else {
    selectedOrders.value = [...selectedOrders.value, orderId]
  }
  showBulkActions.value = selectedOrders.value.length > 0
}

function handleSelectAll() {
  if (selectedOrders.value.length === filteredOrders.value.length) {
    selectedOrders.value = []
    showBulkActions.value = false
  } else {
    selectedOrders.value = filteredOrders.value.map(order => order.id)
    showBulkActions.value = true
  }
}

function clearSelection() {
  selectedOrders.value = []
  showBulkActions.value = false
}

function handleBulkAction(action: string) {
  if (selectedOrders.value.length === 0) return

  switch (action) {
    case 'export':
      toast.success(`已导出${selectedOrders.value.length}个订单数据`)
      break
    case 'delete':
      if (window.confirm(`确定要删除选中的${selectedOrders.value.length}个订单吗？此操作不可撤销。`)) {
        orders.value = orders.value.filter(order => !selectedOrders.value.includes(order.id))
        toast.success(`已删除${selectedOrders.value.length}个订单`)
      }
      break
  }

  selectedOrders.value = []
  showBulkActions.value = false
}

function handleOrderAction(orderId: string, action: string) {
  switch (action) {
    case 'view':
      router.push(`/admin/orders/${orderId}`)
      break
    case 'edit':
      router.push(`/admin/orders/${orderId}/edit`)
      break
    case 'cancel':
      orders.value = orders.value.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      )
      toast.success('订单已取消')
      break
    case 'delete':
      if (window.confirm('确定要删除这个订单吗？此操作不可撤销。')) {
        orders.value = orders.value.filter(order => order.id !== orderId)
        toast.success('订单已删除')
      }
      break
  }
}
</script>