<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <section class="relative overflow-hidden py-20 md:py-28">
      <div class="absolute inset-0 bg-gradient-to-b from-[#4A5F8B]/25 via-[#0F1C2D]/50 to-[#0F1C2D]"></div>
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-radial from-[#4A5F8B]/30 via-[#0F1C2D]/10 to-transparent rounded-full blur-3xl"></div>
      <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-[#63B3ED]/8 rounded-full blur-3xl"></div>
      <div class="absolute inset-0 membership-hero-grid opacity-[0.03]"></div>
      <div class="container mx-auto px-4 relative z-10">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center px-4 py-1.5 rounded-full bg-[#4A5F8B]/15 border border-[#4A5F8B]/25 text-[#63B3ED] text-sm font-medium mb-8 tracking-wide">
            <i class="fa-solid fa-crown mr-2" aria-hidden="true"></i>影研社会员
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F7FA] mb-6 leading-tight" style="text-wrap: balance">
            解锁<span class="hero-accent-text">无限创意</span>可能
          </h1>
          <p class="text-lg text-[#B8C6D8] mb-10 max-w-2xl mx-auto leading-relaxed" style="text-wrap: balance">
            选择适合您的会员方案，享受高清原图下载、专属预设包、优先赛事报名等专属特权
          </p>
          <div class="flex items-center justify-center gap-2">
            <div class="flex items-center bg-[#1E2532] rounded-xl p-1.5 border border-[#4A5F8B]/30">
              <button
                @click="billingCycle = 'monthly'"
                :class="[
                  'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                  billingCycle === 'monthly' ? 'bg-[#4A5F8B] text-[#F5F7FA] shadow-lg' : 'text-[#B8C6D8] hover:text-[#F5F7FA]'
                ]">
                月付
              </button>
              <button
                @click="billingCycle = 'yearly'"
                :class="[
                  'px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2',
                  billingCycle === 'yearly' ? 'bg-[#4A5F8B] text-[#F5F7FA] shadow-lg' : 'text-[#B8C6D8] hover:text-[#F5F7FA]'
                ]">
                年付
                <span class="px-1.5 py-0.5 text-xs rounded-full bg-[#48BB78] text-white font-bold">省2个月</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-4 pb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="tier in tiers"
          :key="tier.id"
          :class="[
            'relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-2 tier-card',
            tier.recommended
              ? 'border-[#4A5F8B] bg-[#1E2532] tier-card-glow'
              : 'border-[#4A5F8B]/20 bg-[#1E2532] hover:border-[#4A5F8B]/50'
          ]">
          <div v-if="tier.recommended" class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span class="px-4 py-1 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-[#F5F7FA] text-xs font-bold rounded-full shadow-lg">
              <i class="fa-solid fa-star mr-1" aria-hidden="true"></i>推荐
            </span>
          </div>

          <div class="text-center mb-6">
            <div class="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
              :class="tier.recommended ? 'bg-[#4A5F8B]/20' : 'bg-[#2D3748]'">
              <i :class="['fa-solid text-2xl', tier.icon, tier.recommended ? 'text-[#63B3ED]' : 'text-[#6B7C93]']" aria-hidden="true"></i>
            </div>
            <h3 class="text-xl font-bold text-[#F5F7FA] mb-1">{{ tier.name }}</h3>
            <p class="text-sm text-[#6B7C93]">{{ tier.description }}</p>
          </div>

          <div class="text-center mb-6">
            <div class="flex items-baseline justify-center">
              <span class="text-4xl font-bold text-[#F5F7FA] pricing-number">¥{{ billingCycle === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice }}</span>
              <span class="text-[#6B7C93] ml-1">/{{ billingCycle === 'monthly' ? '月' : '年' }}</span>
            </div>
            <p v-if="billingCycle === 'yearly' && tier.id !== 'free'" class="text-xs text-[#48BB78] mt-1">
              月均仅 ¥{{ Math.round(tier.yearlyPrice / 12) }}
            </p>
          </div>

          <ul class="space-y-3 mb-8 flex-1">
            <li v-for="feature in tier.features" :key="feature" class="flex items-start text-sm">
              <i :class="[
                'fa-solid mr-2 mt-0.5 flex-shrink-0',
                tier.recommended ? 'fa-check text-[#63B3ED]' : 'fa-check text-[#4A5F8B]'
              ]" aria-hidden="true"></i>
              <span class="text-[#B8C6D8]">{{ feature }}</span>
            </li>
            <li v-for="feature in tier.unavailableFeatures" :key="feature" class="flex items-start text-sm">
              <i class="fa-solid fa-times mr-2 mt-0.5 flex-shrink-0 text-[#6B7C93]/40" aria-hidden="true"></i>
              <span class="text-[#6B7C93]/40 line-through">{{ feature }}</span>
            </li>
          </ul>

          <button
            v-if="tier.id === 'free'"
            class="w-full py-3 rounded-xl font-medium transition-all duration-300 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]/20 cursor-default">
            当前方案
          </button>
          <button
            v-else
            @click="handleSubscribe(tier)"
            :class="[
              'w-full py-3 rounded-xl font-medium transition-all duration-300',
              tier.recommended
                ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-[#F5F7FA] shadow-lg shadow-[#4A5F8B]/25 hover:shadow-[#4A5F8B]/40'
                : 'bg-[#2D3748] text-[#F5F7FA] border border-[#4A5F8B]/30 hover:bg-[#4A5F8B]/20'
            ]">
            立即开通
          </button>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-4 pb-16">
      <div class="bg-[#1E2532] rounded-2xl border border-[#4A5F8B]/20 p-8 md:p-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-[#F5F7FA] mb-4">全功能对比</h2>
            <p class="text-[#B8C6D8] mb-8">一目了然地了解每个会员等级提供的功能，选择最适合您的方案</p>
            <div class="overflow-x-auto compare-table-wrapper">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="border-b border-[#4A5F8B]/20">
                    <th class="py-3.5 text-left text-sm font-medium text-[#B8C6D8] pl-4">功能</th>
                    <th class="py-3.5 text-center text-sm font-medium text-[#6B7C93]">免费</th>
                    <th class="py-3.5 text-center text-sm font-medium text-[#B8C6D8]">Basic</th>
                    <th class="py-3.5 text-center text-sm font-medium text-[#63B3ED] compare-pro-col">Pro</th>
                    <th class="py-3.5 text-center text-sm font-medium text-[#B8C6D8] pr-4">VIP</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in comparisonRows" :key="row.name" class="border-b border-[#4A5F8B]/8 transition-colors duration-150" :class="i % 2 === 0 ? 'bg-[#0F1C2D]/40' : ''">
                    <td class="py-3.5 text-sm text-[#B8C6D8] pl-4 font-medium">{{ row.name }}</td>
                    <td class="py-3.5 text-center">
                      <i v-if="row.free" class="fa-solid fa-check text-[#4A5F8B] text-sm" aria-hidden="true"></i>
                      <i v-else class="fa-solid fa-minus text-[#6B7C93]/30 text-sm" aria-hidden="true"></i>
                    </td>
                    <td class="py-3.5 text-center">
                      <span v-if="row.basic === 'check'" class="inline-flex"><i class="fa-solid fa-check text-[#4A5F8B] text-sm" aria-hidden="true"></i></span>
                      <span v-else class="text-sm text-[#B8C6D8]">{{ row.basic }}</span>
                    </td>
                    <td class="py-3.5 text-center compare-pro-col">
                      <span v-if="row.pro === 'check'" class="inline-flex"><i class="fa-solid fa-check text-[#63B3ED] text-sm" aria-hidden="true"></i></span>
                      <span v-else class="text-sm text-[#63B3ED]">{{ row.pro }}</span>
                    </td>
                    <td class="py-3.5 text-center pr-4">
                      <span v-if="row.vip === 'check'" class="inline-flex"><i class="fa-solid fa-check text-[#4A5F8B] text-sm" aria-hidden="true"></i></span>
                      <span v-else class="text-sm text-[#B8C6D8]">{{ row.vip }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="space-y-6">
            <h3 class="text-xl font-bold text-[#F5F7FA] mb-6">常见问题</h3>
            <div class="space-y-3">
              <details v-for="faq in faqs" :key="faq.q" class="faq-details bg-[#0F1C2D] rounded-xl border border-[#4A5F8B]/10 group">
                <summary class="flex items-center justify-between p-5 cursor-pointer list-none marker:content-none">
                  <span class="font-medium text-[#F5F7FA] pr-4">{{ faq.q }}</span>
                  <span class="faq-chevron flex-shrink-0 w-6 h-6 rounded-full bg-[#4A5F8B]/15 flex items-center justify-center text-[#63B3ED] text-xs transition-transform duration-300">
                    <i class="fa-solid fa-chevron-down"></i>
                  </span>
                </summary>
                <div class="px-5 pb-5">
                  <p class="text-sm text-[#B8C6D8] leading-relaxed">{{ faq.a }}</p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click.self="showPaymentModal = false">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div class="relative bg-[#1E2532] rounded-2xl border border-[#4A5F8B] w-full max-w-md shadow-2xl">
            <div class="flex items-center justify-between p-6 border-b border-[#4A5F8B]/20">
              <h3 class="text-lg font-bold text-[#F5F7FA]">确认开通</h3>
              <button @click="showPaymentModal = false" class="w-8 h-8 rounded-lg bg-[#2D3748] flex items-center justify-center text-[#B8C6D8] hover:text-[#F5F7FA] hover:bg-[#4A5F8B]/30 transition-colors" aria-label="关闭">
                <i class="fa-solid fa-times" aria-hidden="true"></i>
              </button>
            </div>
            <div class="p-6 space-y-5">
              <div class="bg-[#0F1C2D] rounded-xl p-4 space-y-3">
                <div class="flex justify-between">
                  <span class="text-[#B8C6D8]">套餐</span>
                  <span class="text-[#F5F7FA] font-medium">{{ selectedTier?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[#B8C6D8]">周期</span>
                  <span class="text-[#F5F7FA]">{{ billingCycle === 'monthly' ? '月付' : '年付（含2个月赠送）' }}</span>
                </div>
                <div class="flex justify-between border-t border-[#4A5F8B]/20 pt-3">
                  <span class="text-[#B8C6D8]">金额</span>
                  <span class="text-[#63B3ED] text-xl font-bold">¥{{ billingCycle === 'monthly' ? selectedTier?.monthlyPrice : selectedTier?.yearlyPrice }}</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-3">支付方式</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="paymentMethod = 'alipay'"
                    :class="[
                      'flex items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300',
                      paymentMethod === 'alipay'
                        ? 'border-[#4A5F8B] bg-[#4A5F8B]/10 text-[#63B3ED]'
                        : 'border-[#4A5F8B]/20 bg-[#0F1C2D] text-[#B8C6D8] hover:border-[#4A5F8B]/50'
                    ]">
                    <i class="fa-brands fa-alipay text-2xl" aria-hidden="true"></i>
                    <span class="font-medium">支付宝</span>
                  </button>
                  <button
                    @click="paymentMethod = 'wechat'"
                    :class="[
                      'flex items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300',
                      paymentMethod === 'wechat'
                        ? 'border-[#4A5F8B] bg-[#4A5F8B]/10 text-[#63B3ED]'
                        : 'border-[#4A5F8B]/20 bg-[#0F1C2D] text-[#B8C6D8] hover:border-[#4A5F8B]/50'
                    ]">
                    <i class="fa-brands fa-weixin text-2xl" aria-hidden="true"></i>
                    <span class="font-medium">微信支付</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="p-6 border-t border-[#4A5F8B]/20">
              <button
                @click="confirmPayment"
                :disabled="isProcessing"
                class="w-full py-3.5 rounded-xl font-medium bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-[#F5F7FA] hover:shadow-lg hover:shadow-[#4A5F8B]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!isProcessing">确认支付 ¥{{ billingCycle === 'monthly' ? selectedTier?.monthlyPrice : selectedTier?.yearlyPrice }}</span>
                <span v-else><i class="fa-solid fa-spinner fa-spin mr-2" aria-hidden="true"></i>处理中…</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { useInteraction } from '../composables/useInteraction'
import type { MemberLevel } from '../store/authStore'

const router = useRouter()
const authStore = useAuthStore()
const { showSuccess, showError, showLoading, dismissToast } = useInteraction()

const billingCycle = ref<'monthly' | 'yearly'>('monthly')
const showPaymentModal = ref(false)
const paymentMethod = ref<'alipay' | 'wechat'>('alipay')
const isProcessing = ref(false)
const selectedTier = ref<Tier | null>(null)

interface Tier {
  id: string
  name: string
  description: string
  icon: string
  monthlyPrice: number
  yearlyPrice: number
  recommended: boolean
  features: string[]
  unavailableFeatures: string[]
}

const tiers: Tier[] = [
  {
    id: 'free',
    name: '免费',
    description: '基础功能体验',
    icon: 'fa-user',
    monthlyPrice: 0,
    yearlyPrice: 0,
    recommended: false,
    features: [
      '每日3次原图下载',
      '基础滤镜预设',
      '社区浏览互动',
      '参与公开赛事',
      '基础存储空间'
    ],
    unavailableFeatures: [
      '高清原图下载',
      '专属预设包',
      '优先赛事报名',
      '无水印导出'
    ]
  },
  {
    id: 'basic',
    name: 'Basic',
    description: '进阶创作体验',
    icon: 'fa-user-plus',
    monthlyPrice: 19,
    yearlyPrice: 199,
    recommended: false,
    features: [
      '每日10次原图下载',
      '10个专业预设包',
      '高清原图下载',
      '优先客服支持',
      '20GB云存储空间',
      '无水印导出'
    ],
    unavailableFeatures: [
      '优先赛事报名',
      '会员专属课程'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    description: '专业摄影师首选',
    icon: 'fa-user-tie',
    monthlyPrice: 39,
    yearlyPrice: 399,
    recommended: true,
    features: [
      '每日30次原图下载',
      '50个专业预设包',
      '高清原图下载',
      '优先赛事报名',
      '会员专属课程',
      '专属客服通道',
      '无水印导出',
      '100GB云存储空间'
    ],
    unavailableFeatures: []
  },
  {
    id: 'vip',
    name: 'VIP',
    description: '全方位大师体验',
    icon: 'fa-crown',
    monthlyPrice: 99,
    yearlyPrice: 999,
    recommended: false,
    features: [
      '无限原图下载',
      '全部专业预设包',
      'RAW素材下载',
      '优先赛事报名',
      '全部专属课程',
      '1对1专属客服',
      '无水印导出',
      '300GB云存储空间',
      '线下活动免费参与',
      '器材租赁8折优惠'
    ],
    unavailableFeatures: []
  }
]

const comparisonRows = [
  { name: '原图下载', free: false, basic: '10次/日', pro: '30次/日', vip: '无限' },
  { name: '专业预设包', free: false, basic: '10个', pro: '50个', vip: '全部' },
  { name: 'RAW素材下载', free: false, basic: false, pro: false, vip: 'check' },
  { name: '优先赛事报名', free: false, basic: false, pro: 'check', vip: 'check' },
  { name: '会员专属课程', free: false, basic: false, pro: 'check', vip: '全部' },
  { name: '专属客服', free: false, basic: '普通', pro: '优先', vip: '1对1' },
  { name: '无水印导出', free: false, basic: 'check', pro: 'check', vip: 'check' },
  { name: '云存储空间', free: '5GB', basic: '20GB', pro: '100GB', vip: '300GB' },
  { name: '线下活动参与', free: false, basic: false, pro: false, vip: 'check' },
  { name: '器材租赁优惠', free: false, basic: false, pro: false, vip: '8折' }
]

const faqs = [
  {
    q: '年付方案真的送2个月吗？',
    a: '是的！选择年付方案，您只需支付10个月的费用即可享受12个月的会员服务，相当于免费获得2个月的会员时长，非常划算。'
  },
  {
    q: '可以随时升级或降级套餐吗？',
    a: '当然可以！您可以随时升级到更高等级的套餐，差价将按剩余天数折算。降级将在当前周期结束后生效。'
  },
  {
    q: '支持哪些支付方式？',
    a: '目前支持支付宝和微信支付两种方式，未来将支持更多支付渠道。'
  },
  {
    q: '会员到期后会怎样？',
    a: '会员到期后，您的权益将恢复为免费方案。已上传的作品和数据不会丢失，但部分高级功能将暂时无法使用。'
  }
]

function handleSubscribe(tier: Tier) {
  selectedTier.value = tier
  showPaymentModal.value = true
}

async function confirmPayment() {
  if (!selectedTier.value) return

  isProcessing.value = true
  const loadingId = showLoading('正在处理支付…')

  await new Promise(resolve => setTimeout(resolve, 1500))

  dismissToast(loadingId)

  try {
    const tierMap: Record<string, MemberLevel> = {
      basic: 'basic',
      pro: 'pro',
      vip: 'vip'
    }
    const storeTier = tierMap[selectedTier.value.id]
    if (storeTier) {
      authStore.upgradeMembership(storeTier)
    }

    showSuccess(`恭喜！您已成功开通${selectedTier.value.name}会员`)
    showPaymentModal.value = false
    isProcessing.value = false

    setTimeout(() => {
      router.push('/profile-benefits')
    }, 1000)
  } catch {
    dismissToast(loadingId)
    showError('支付失败，请稍后重试')
    isProcessing.value = false
  }
}
</script>

<style scoped>
.hero-accent-text {
  background: linear-gradient(135deg, #63B3ED 0%, #8a50ff 50%, #63B3ED 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: accentShift 6s ease-in-out infinite;
}

@keyframes accentShift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 200% center; }
}

.membership-hero-grid {
  background-image:
    linear-gradient(rgba(74, 95, 139, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(74, 95, 139, 0.15) 1px, transparent 1px);
  background-size: 60px 60px;
}

.pricing-number {
  font-variant-numeric: tabular-nums;
}

.tier-card-glow {
  box-shadow:
    0 0 40px rgba(74, 95, 139, 0.2),
    0 0 80px rgba(74, 95, 139, 0.08),
    inset 0 1px 0 rgba(99, 179, 237, 0.1);
  position: relative;
}

.tier-card-glow::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 18px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(74, 95, 139, 0.5), rgba(99, 179, 237, 0.3), rgba(74, 95, 139, 0.5));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.faq-details[open] .faq-chevron {
  transform: rotate(180deg);
}

.faq-details summary::-webkit-details-marker {
  display: none;
}

.compare-table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.compare-table-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.compare-table-wrapper::-webkit-scrollbar-thumb {
  background: rgba(74, 95, 139, 0.3);
  border-radius: 3px;
}

.compare-pro-col {
  background: rgba(74, 95, 139, 0.06);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95) translateY(-20px);
}

@media (prefers-reduced-motion: reduce) {
  .tier-card {
    transition: none;
  }

  .hero-accent-text {
    animation: none;
  }

  .modal-enter-active,
  .modal-leave-active {
    transition: none;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>