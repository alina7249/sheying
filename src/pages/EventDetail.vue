<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!event" class="min-h-screen">
      <div class="flex flex-col items-center justify-center h-[60vh] text-center">
        <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
          <i class="fa-solid fa-exclamation-circle text-2xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">未找到该活动</h2>
        <p class="text-[#B8C6D8] mb-6 max-w-md">抱歉，您访问的活动不存在或已被删除</p>
        <router-link to="/offline-events" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#3A4B6F] transition-colors">
          返回活动列表
        </router-link>
      </div>
    </div>

    <div v-else>
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link to="/offline-events" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回活动列表</span>
        </router-link>
      </div>

      <!-- 活动主图 -->
      <div class="relative rounded-xl overflow-hidden mb-8 bg-[#2D3748] border border-[#4A5F8B]">
        <img :src="event.image" :alt="event.title" class="w-full h-[50vh] object-cover" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#1E2532] to-transparent"></div>
        <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] text-sm rounded-full">{{ event.type }}</span>
            <span class="px-3 py-1 bg-[#2D3748] text-[#F5F7FA] text-sm rounded-full">{{ event.category }}</span>
          </div>
          <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F7FA] mb-2">{{ event.title }}</h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-[#B8C6D8]">
            <div class="flex items-center">
              <i class="fa-solid fa-map-marker-alt mr-2"></i>
              <span>{{ event.location }}</span>
            </div>
            <div class="flex items-center">
              <i class="fa-solid fa-calendar-alt mr-2"></i>
              <span>{{ event.date }}</span>
            </div>
            <div class="flex items-center">
              <i class="fa-solid fa-clock mr-2"></i>
              <span>{{ event.duration }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 价格和报名按钮 -->
      <div class="flex flex-col sm:flex-row justify-between items-center bg-[#2D3748] rounded-xl p-6 mb-8 border border-[#4A5F8B]">
        <div>
          <h3 class="text-lg font-medium text-[#B8C6D8] mb-1">活动费用</h3>
          <p class="text-3xl font-bold text-[#F5F7FA]">{{ event.price === 0 ? '免费' : `¥${event.price}` }}</p>
        </div>
        <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-3">
          <div class="flex items-center text-sm text-[#B8C6D8]">
            <i class="fa-solid fa-user-group mr-2 text-[#4A5F8B]"></i>
            <span>已有 {{ event.participants }} 人报名 / 限 {{ event.maxParticipants }} 人</span>
          </div>
          <div class="flex flex-col">
            <button
              @click="handleRegister"
              class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] hover:scale-105 active:scale-95 transition-transform"
            >
              <i class="fa-solid fa-calendar-plus mr-2"></i> 立即报名
            </button>
            <p class="text-xs text-[#B8C6D8] mt-1 text-center">
              <i class="fa-solid fa-circle-info mr-1"></i> 报名需填写表单，详情见注意事项
            </p>
          </div>
        </div>
      </div>

      <!-- 内容主体 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧主要内容 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 活动详情 -->
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">活动详情</h2>
            <div class="prose prose-invert max-w-none">
              <p class="text-[#B8C6D8] leading-relaxed">{{ event.description }}</p>
            </div>
            <div class="flex flex-wrap gap-2 mt-6">
              <span v-for="(tag, index) in event.tags" :key="index" class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-sm">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- 行程安排 -->
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">行程安排</h2>
            <div class="space-y-4">
              <div v-for="(item, index) in event.itinerary" :key="index" class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                  {{ index + 1 }}
                </div>
                <p class="text-[#B8C6D8]">{{ item }}</p>
              </div>
            </div>
          </div>

          <!-- 费用包含/不包含 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">费用包含</h3>
              <ul class="space-y-2">
                <li v-for="(item, index) in event.inclusion" :key="index" class="flex items-center text-[#B8C6D8]">
                  <i class="fa-solid fa-check-circle text-[#4A5F8B] mr-2"></i>
                  {{ item }}
                </li>
              </ul>
            </div>
            <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">费用不包含</h3>
              <ul class="space-y-2">
                <li v-for="(item, index) in event.exclusion" :key="index" class="flex items-center text-[#B8C6D8]">
                  <i class="fa-solid fa-times-circle text-[#6B7C93] mr-2"></i>
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 注意事项 -->
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">注意事项</h2>
            <ul class="space-y-2">
              <li class="flex items-center text-[#B8C6D8] bg-[#4A5F8B]/10 p-3 rounded-lg border border-[#4A5F8B]/30">
                <i class="fa-solid fa-circle-info text-[#4A5F8B] mr-3 text-lg"></i>
                <div>
                  <span class="font-medium text-[#F5F7FA] block mb-1">报名条件：</span>
                  <span class="block">1. 需登录账号</span>
                  <span class="block">2. 部分活动可能需要摄影基础或特定器材</span>
                  <span class="block">3. 请仔细阅读活动详情，符合条件再报名</span>
                </div>
              </li>
              <li v-for="(item, index) in event.notes" :key="index" class="flex items-center text-[#B8C6D8]">
                <i class="fa-solid fa-circle-exclamation text-[#6B7C93] mr-2"></i>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 导师信息 -->
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">导师信息</h2>
            <div class="flex items-center mb-4">
              <img :src="event.instructor.avatar" :alt="event.instructor.name" class="w-16 h-16 rounded-full mr-4 object-cover border-2 border-[#4A5F8B]" />
              <div>
                <h3 class="font-bold text-[#F5F7FA]">{{ event.instructor.name }}</h3>
                <p class="text-sm text-[#4A5F8B]">{{ event.instructor.title }}</p>
                <p class="text-xs text-[#B8C6D8]">{{ event.instructor.experience }}摄影经验</p>
              </div>
            </div>
            <button @click="showSuccess('查看导师主页功能开发中')" class="w-full py-2 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] text-sm">
              查看导师主页
            </button>
          </div>

          <!-- 活动日历 -->
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">活动日历</h2>
            <div class="p-4 bg-[#1E2532] rounded-lg text-center">
              <div class="text-sm text-[#B8C6D8] mb-1">{{ event.date.split(' ')[0] }}</div>
              <div class="text-4xl font-bold text-[#4A5F8B]">{{ new Date(event.date.split(' ')[0]).getDate() }}</div>
              <div class="text-sm text-[#B8C6D8]">{{ ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date(event.date.split(' ')[0]).getMonth()] }}</div>
            </div>
            <button @click="showSuccess('已添加到日历')" class="w-full mt-4 py-2 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] text-sm">
              添加到日历
            </button>
          </div>

          <!-- 分享 -->
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">分享活动</h2>
            <div class="grid grid-cols-4 gap-3">
              <button @click="showSuccess('请在微信中打开此链接进行分享')" class="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-brands fa-weixin text-xl"></i>
              </button>
              <button @click="showSuccess('已复制微博分享链接')" class="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-brands fa-weibo text-xl"></i>
              </button>
              <button @click="showSuccess('已复制QQ分享链接')" class="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-brands fa-qq text-xl"></i>
              </button>
              <button @click="handleShare" class="w-full h-12 bg-[#1E2532] rounded-lg flex items-center justify-center text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-solid fa-link text-xl"></i>
              </button>
            </div>
          </div>

          <!-- 常见问题 -->
          <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-xl font-bold text-[#F5F7FA] mb-4">常见问题</h2>
            <div class="space-y-4">
              <div>
                <h3 class="font-medium text-[#F5F7FA] mb-1">如何确认是否报名成功？</h3>
                <p class="text-sm text-[#B8C6D8]">报名成功后，系统将发送确认邮件和短信到您的注册邮箱和手机，请注意查收。</p>
              </div>
              <div>
                <h3 class="font-medium text-[#F5F7FA] mb-1">如何申请退款？</h3>
                <p class="text-sm text-[#B8C6D8]">活动开始前7天可申请全额退款，7天内申请退款将收取30%手续费。</p>
              </div>
              <div>
                <h3 class="font-medium text-[#F5F7FA] mb-1">活动当天需要携带什么物品？</h3>
                <p class="text-sm text-[#B8C6D8]">请携带身份证、摄影器材、充电器、充电宝等个人物品，具体请参考"注意事项"。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="bg-[#2D3748] rounded-xl p-6 border border-[#4A5F8B] mt-8">
        <CommentSection :postId="event.id" />
      </div>

      <!-- 报名表单弹窗 -->
      <Teleport to="body">
        <div v-if="showRegistrationForm" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center p-6 border-b border-[#4A5F8B]">
              <h3 class="text-xl font-bold text-[#F5F7FA]">报名活动：{{ event.title }}</h3>
              <button class="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors" @click="showRegistrationForm = false">
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
            <form @submit.prevent="handleSubmitRegistration" class="p-6 space-y-6">
              <div class="space-y-4">
                <div>
                  <label for="name" class="block text-sm font-medium text-[#F5F7FA] mb-1">姓名 <span class="text-red-500">*</span></label>
                  <input id="name" type="text" v-model="registrationData.name"
                    class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入您的姓名" required />
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-[#F5F7FA] mb-1">手机号码 <span class="text-red-500">*</span></label>
                  <input id="phone" type="tel" v-model="registrationData.phone"
                    class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入11位手机号码" pattern="^1[3-9]\d{9}$" required />
                  <p class="text-xs text-[#4A5F8B] mt-1">请输入有效的11位手机号码</p>
                </div>
                <div>
                  <label for="email" class="block text-sm font-medium text-[#F5F7FA] mb-1">电子邮箱 <span class="text-red-500">*</span></label>
                  <input id="email" type="email" v-model="registrationData.email"
                    class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    placeholder="请输入您的电子邮箱" required />
                </div>
                <div>
                  <label for="experience" class="block text-sm font-medium text-[#F5F7FA] mb-1">摄影经验</label>
                  <select id="experience" v-model="registrationData.experience"
                    class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all">
                    <option value="">请选择您的摄影经验</option>
                    <option value="beginner">初学者 (0-1年)</option>
                    <option value="intermediate">中级 (1-3年)</option>
                    <option value="advanced">高级 (3-5年)</option>
                    <option value="professional">专业 (5年以上)</option>
                  </select>
                </div>
                <div>
                  <label for="specialRequests" class="block text-sm font-medium text-[#F5F7FA] mb-1">特殊需求</label>
                  <textarea id="specialRequests" v-model="registrationData.specialRequests"
                    class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[100px]"
                    placeholder="如有任何特殊需求，请在此说明"></textarea>
                </div>
                <div class="flex items-start mt-4">
                  <input id="agreement" type="checkbox" v-model="registrationData.agreement"
                    class="mt-1 h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] rounded border-[#4A5F8B] bg-[#1E2532]" required />
                  <label for="agreement" class="ml-2 block text-sm text-[#B8C6D8]">
                    我已阅读并同意<a href="#" class="text-[#4A5F8B] hover:underline">活动协议</a>和<a href="#" class="text-[#4A5F8B] hover:underline">隐私政策</a>
                  </label>
                </div>
              </div>
              <div class="flex justify-between items-center pt-4 border-t border-[#4A5F8B]">
                <div class="text-[#B8C6D8] text-sm">活动费用: <span class="font-bold text-[#F5F7FA]">{{ event.price === 0 ? '免费' : `¥${event.price}` }}</span></div>
                <div class="flex space-x-3">
                  <button type="button"
                    class="px-6 py-3 bg-[#1E2532] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                    @click="showRegistrationForm = false">取消</button>
                  <button type="submit"
                    class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]">确认报名</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { toast } from 'vue-sonner'
import { useInteraction } from '@/composables/useInteraction'
import { useAuthStore } from '@/store/authStore'
import { storeToRefs } from 'pinia'
import CommentSection from '@/components/CommentSection.vue'

const route = useRoute()
const store = useAuthStore()
const { isAuthenticated, user } = storeToRefs(store)
const { showSuccess, handleShare } = useInteraction();

interface EventItem {
  id: string
  title: string
  type: string
  category: string
  image: string
  location: string
  date: string
  duration: string
  instructor: {
    id: string
    name: string
    avatar: string
    title: string
    experience: string
  }
  price: number
  participants: number
  maxParticipants: number
  description: string
  itinerary: string[]
  inclusion: string[]
  exclusion: string[]
  notes: string[]
  tags: string[]
}

const mockEvents: EventItem[] = [
  {
    id: 'e1',
    title: '新疆喀纳斯秋季风光摄影团',
    type: '采风团',
    category: '风光',
    image: 'https://picsum.photos/1280/720?random=1',
    location: '新疆·喀纳斯',
    date: '2023-10-15 至 2023-10-22',
    duration: '8天7晚',
    instructor: {
      id: 'i1',
      name: '风光摄影师张明',
      avatar: 'https://picsum.photos/400/400?random=2',
      title: '国家地理摄影师',
      experience: '15年'
    },
    price: 6999,
    participants: 12,
    maxParticipants: 20,
    description: '跟随国家地理摄影师张明，深入新疆喀纳斯，拍摄秋季绝美风光。行程涵盖喀纳斯湖、禾木村、白哈巴等著名景点，在最佳时间和地点拍摄金秋时节的层林尽染、晨雾缭绕的梦幻景色。',
    itinerary: [
      '第1天：全国各地 - 乌鲁木齐集合',
      '第2天：乌鲁木齐 - 布尔津 - 五彩滩',
      '第3天：布尔津 - 喀纳斯湖 - 观鱼台',
      '第4天：喀纳斯 - 白哈巴村',
      '第5天：白哈巴 - 禾木村',
      '第6天：禾木村全天拍摄',
      '第7天：禾木 - 可可托海',
      '第8天：可可托海 - 乌鲁木齐解散'
    ],
    inclusion: ['交通', '住宿', '餐食', '门票', '指导', '保险'],
    exclusion: ['往返机票', '个人消费', '单房差', '额外景点门票'],
    notes: ['需自带摄影器材', '有一定摄影基础', '适应高原气候', '尊重当地风俗'],
    tags: ['风光', '新疆', '秋季', '长线', '深度']
  },
  {
    id: 'e2',
    title: '上海城市纪实摄影沙龙',
    type: '摄影沙龙',
    category: '纪实',
    image: 'https://picsum.photos/1280/720?random=3',
    location: '上海·静安区',
    date: '2023-10-28 14:00-17:00',
    duration: '3小时',
    instructor: {
      id: 'i2',
      name: '纪实摄影师李华',
      avatar: 'https://picsum.photos/400/400?random=4',
      title: '国际纪实摄影奖得主',
      experience: '10年'
    },
    price: 199,
    participants: 18,
    maxParticipants: 30,
    description: '在上海这座国际化大都市，跟随国际纪实摄影奖得主李华，学习如何捕捉城市中的人文瞬间和生活故事。',
    itinerary: [
      '14:00-14:30：签到与破冰',
      '14:30-15:30：纪实摄影理论分享',
      '15:30-16:30：户外实战拍摄指导',
      '16:30-17:00：作品点评与交流'
    ],
    inclusion: ['场地', '指导', '资料', '茶点'],
    exclusion: ['交通', '器材', '个人消费'],
    notes: ['自带摄影器材', '提前报名确认', '尊重拍摄对象'],
    tags: ['纪实', '城市', '上海', '沙龙', '短期']
  },
  {
    id: 'e3',
    title: '索尼Alpha新品体验会',
    type: '器材体验会',
    category: '器材',
    image: 'https://picsum.photos/1280/720?random=5',
    location: '北京·朝阳区',
    date: '2023-11-05 10:00-16:00',
    duration: '6小时',
    instructor: {
      id: 'i3',
      name: '索尼技术专家王强',
      avatar: 'https://picsum.photos/400/400?random=6',
      title: '索尼官方讲师',
      experience: '8年'
    },
    price: 0,
    participants: 25,
    maxParticipants: 50,
    description: '索尼Alpha系列新品体验会，现场体验最新的索尼相机和镜头。',
    itinerary: [
      '10:00-10:30：签到与自由体验',
      '10:30-11:30：新品技术解析',
      '11:30-12:30：午餐交流',
      '12:30-15:00：分组体验与指导',
      '15:00-16:00：问答与抽奖'
    ],
    inclusion: ['场地', '指导', '资料', '午餐', '抽奖'],
    exclusion: ['交通', '个人消费'],
    notes: ['无需自带器材', '提前报名确认', '遵守活动秩序'],
    tags: ['器材', '索尼', '新品', '体验', '免费']
  },
  {
    id: 'e4',
    title: '云南元阳梯田春季摄影创作',
    type: '采风团',
    category: '风光',
    image: 'https://picsum.photos/1280/720?random=7',
    location: '云南·元阳',
    date: '2024-02-20 至 2024-02-25',
    duration: '6天5晚',
    instructor: {
      id: 'i4',
      name: '风光摄影师刘芳',
      avatar: 'https://picsum.photos/400/400?random=8',
      title: '国际风光摄影奖得主',
      experience: '12年'
    },
    price: 5699,
    participants: 8,
    maxParticipants: 15,
    description: '春季元阳梯田灌水期，是拍摄梯田云海、日出日落的最佳时节。',
    itinerary: [
      '第1天：昆明集合',
      '第2天：昆明 - 元阳 - 老虎嘴梯田',
      '第3天：多依树梯田日出 - 爱春蓝梯田',
      '第4天：箐口梯田 - 坝达梯田日落',
      '第5天：龙树坝梯田 - 阿者科古村',
      '第6天：元阳 - 昆明解散'
    ],
    inclusion: ['交通', '住宿', '餐食', '门票', '指导', '保险'],
    exclusion: ['往返机票', '个人消费', '单房差'],
    notes: ['需自带摄影器材', '有一定摄影基础', '早起拍摄'],
    tags: ['风光', '云南', '春季', '梯田', '经典']
  },
]

const event = ref<EventItem | null>(null)
const loading = ref(true)
const showRegistrationForm = ref(false)

const registrationData = reactive({
  name: '',
  phone: '',
  email: '',
  experience: '',
  specialRequests: '',
  agreement: false
})

interface RegistrationFormData {
  name: string
  phone: string
  email: string
  experience: string
  specialRequests: string
  agreement: boolean
}

onMounted(() => {
  const id = route.params.id as string
  const foundEvent = mockEvents.find(e => e.id === id)
  if (foundEvent) {
    event.value = foundEvent
  }
  loading.value = false
})

const handleRegister = () => {
  if (!isAuthenticated.value) {
    window.location.href = `/login?redirect=/event/${route.params.id}`
    return
  }
  registrationData.name = user.value?.username || ''
  registrationData.phone = ''
  registrationData.email = user.value?.email || ''
  registrationData.experience = ''
  registrationData.specialRequests = ''
  registrationData.agreement = false
  showRegistrationForm.value = true
}

const handleSubmitRegistration = () => {
  if (!registrationData.name || !registrationData.phone || !registrationData.email || !registrationData.agreement) {
    toast.warning('请填写所有必填字段并同意条款')
    return
  }
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(registrationData.phone)) {
    toast.warning('请输入有效的11位手机号码')
    return
  }
  toast.success(`已成功报名 ${event.value?.title}`)
  if (event.value && event.value.participants < event.value.maxParticipants) {
    event.value = { ...event.value, participants: event.value.participants + 1 }
  }
  showRegistrationForm.value = false
}
</script>