<template>
  <div class="min-h-screen bg-[#0a0f1a] text-white">
    <!-- Premium Background Effects -->
    <div class="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0F1C2D] to-[#050810] pointer-events-none z-0"></div>
    <div class="fixed inset-0 opacity-[0.02] pointer-events-none z-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;);"></div>
    
    <div class="relative z-10">
      <div class="max-w-7xl mx-auto px-4 py-16">
        <!-- Page Header -->
        <div class="text-center mb-16">
          <div class="flex items-center justify-center gap-3 mb-5">
            <span class="w-1 h-8 bg-gradient-to-b from-[#4A5F8B] to-[#63B3ED] rounded-full"></span>
            <span class="text-sm font-medium text-[#63B3ED] tracking-widest uppercase">会员订阅</span>
            <span class="w-1 h-8 bg-gradient-to-b from-[#4A5F8B] to-[#63B3ED] rounded-full"></span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-white mb-5 bg-gradient-to-r from-white via-[#63B3ED] to-white bg-clip-text text-transparent">选择你的会员方案</h1>
          <p class="text-[#B8C6D8] text-lg max-w-3xl mx-auto">解锁完整功能，开启专业摄影学习之旅，提升你的摄影技能</p>
        </div>

        <!-- Billing Toggle -->
        <div class="flex items-center justify-center gap-5 mb-16">
          <span :class="['text-xl', !isAnnual ? 'text-white font-semibold' : 'text-[#6B7C93]']">月付</span>
          <button @click="isAnnual = !isAnnual" :class="['w-20 h-10 rounded-full p-1 transition-all duration-500', isAnnual ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED]' : 'bg-[#1E2532]']">
            <div :class="['w-8 h-8 bg-white rounded-full shadow-lg transition-transform duration-500', isAnnual ? 'translate-x-10' : 'translate-x-0']"></div>
          </button>
          <span :class="['text-xl', isAnnual ? 'text-white font-semibold' : 'text-[#6B7C93]']">年付</span>
          <span class="px-4 py-2 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white text-sm font-semibold rounded-full">省2个月</span>
        </div>

        <!-- Pricing Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div v-for="plan in plans" :key="plan.id" :class="['relative bg-gradient-to-br from-[#1E2532] to-[#2D3748] rounded-3xl p-10 border transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl', plan.isPopular ? 'border-2 border-[#63B3ED] shadow-2xl shadow-[#4A5F8B]/30' : 'border border-[#4A5F8B]/20']">
            <!-- Popular Badge -->
            <div v-if="plan.isPopular" class="absolute -top-5 left-1/2 transform -translate-x-1/2">
              <span class="px-6 py-2 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white text-sm font-semibold rounded-full shadow-lg shadow-[#4A5F8B]/30">最受欢迎</span>
            </div>
            
            <div class="text-center mb-8">
              <div :class="['w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6', plan.isPopular ? 'bg-gradient-to-br from-[#4A5F8B] to-[#63B3ED]' : 'bg-[#4A5F8B]/20']">
                <i :class="['fa-solid text-3xl', plan.icon, plan.isPopular ? 'text-white' : 'text-[#63B3ED]']"></i>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">{{ plan.name }}</h3>
              <p class="text-[#B8C6D8] text-sm mb-5">{{ plan.description }}</p>
              <div class="mt-6">
                <div class="flex items-baseline justify-center gap-2">
                  <span class="text-4xl md:text-5xl font-bold text-white">¥{{ isAnnual ? plan.annualPrice : plan.monthlyPrice }}</span>
                  <span class="text-[#6B7C93]">/月</span>
                </div>
                <p v-if="isAnnual" class="text-[#6B7C93] text-sm mt-2">年付 ¥{{ plan.annualPrice * 12 }}</p>
              </div>
            </div>
            
            <div class="space-y-4 mb-10">
              <div v-for="(feature, idx) in plan.features" :key="idx" class="flex items-center gap-4">
                <i :class="['fa-check-circle text-xl', feature.included ? 'text-green-400' : 'text-[#6B7C93]']"></i>
                <span :class="['text-sm leading-relaxed', feature.included ? 'text-[#B8C6D8]' : 'text-[#6B7C93] line-through']">{{ feature.text }}</span>
              </div>
            </div>
            
            <button @click="handleSubscribe(plan)" :class="['w-full py-4 rounded-2xl font-semibold transition-all duration-300', plan.isPopular ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white shadow-lg shadow-[#4A5F8B]/30 hover:shadow-xl hover:shadow-[#4A5F8B]/40' : 'bg-[#1E2532] text-white border border-[#4A5F8B]/30 hover:bg-[#2D3748] hover:border-[#4A5F8B]/60']">
              {{ plan.buttonText }}
            </button>
          </div>
        </div>

        <!-- Features Comparison -->
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-white text-center mb-10">功能对比</h2>
          <div class="overflow-x-auto rounded-3xl border border-[#4A5F8B]/20 bg-[#1E2532]">
            <table class="w-full">
              <thead>
                <tr class="border-b border-[#4A5F8B]/20">
                  <th class="px-8 py-6 text-left text-white font-semibold">功能</th>
                  <th class="px-8 py-6 text-center text-white font-semibold">免费版</th>
                  <th class="px-8 py-6 text-center text-white font-semibold">基础版</th>
                  <th class="px-8 py-6 text-center text-white font-semibold">专业版</th>
                  <th class="px-8 py-6 text-center text-white font-semibold">VIP版</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#4A5F8B]/20">
                <tr>
                  <td class="px-8 py-5 text-[#B8C6D8]">浏览作品</td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                </tr>
                <tr>
                  <td class="px-8 py-5 text-[#B8C6D8]">上传作品</td>
                  <td class="px-8 py-5 text-center text-[#6B7C93]"><i class="fa-solid fa-times text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                </tr>
                <tr>
                  <td class="px-8 py-5 text-[#B8C6D8]">免费课程</td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                </tr>
                <tr>
                  <td class="px-8 py-5 text-[#B8C6D8]">付费课程</td>
                  <td class="px-8 py-5 text-center text-[#6B7C93]"><i class="fa-solid fa-times text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-[#6B7C93]"><i class="fa-solid fa-times text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                </tr>
                <tr>
                  <td class="px-8 py-5 text-[#B8C6D8]">优先客服</td>
                  <td class="px-8 py-5 text-center text-[#6B7C93]"><i class="fa-solid fa-times text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-[#6B7C93]"><i class="fa-solid fa-times text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                </tr>
                <tr>
                  <td class="px-8 py-5 text-[#B8C6D8]">1对1指导</td>
                  <td class="px-8 py-5 text-center text-[#6B7C93]"><i class="fa-solid fa-times text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-[#6B7C93]"><i class="fa-solid fa-times text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-[#6B7C93]"><i class="fa-solid fa-times text-xl"></i></td>
                  <td class="px-8 py-5 text-center text-green-400"><i class="fa-solid fa-check text-xl"></i></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- FAQ Section -->
        <div>
          <h2 class="text-3xl font-bold text-white text-center mb-10">常见问题</h2>
          <div class="space-y-6 max-w-4xl mx-auto">
            <div v-for="(faq, idx) in faqs" :key="idx" class="bg-[#1E2532] rounded-2xl border border-[#4A5F8B]/20 overflow-hidden">
              <button @click="toggleFaq(idx)" class="w-full px-8 py-6 text-left flex items-center justify-between text-white font-semibold hover:bg-[#2D3748] transition-all duration-300">
                <span class="text-lg">{{ faq.question }}</span>
                <i :class="['fa-solid text-[#63B3ED] text-xl transition-transform duration-300', openFaq === idx ? 'rotate-180' : '']">
                  {{ openFaq === idx ? 'fa-chevron-up' : 'fa-chevron-down' }}
                </i>
              </button>
              <div v-show="openFaq === idx" class="px-8 pb-6 text-[#B8C6D8] leading-relaxed">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useInteraction } from '../composables/useInteraction';

const { showSuccess, showInfo } = useInteraction();
const isAnnual = ref(true);
const openFaq = ref<number | null>(null);

const toggleFaq = (idx: number) => {
  openFaq.value = openFaq.value === idx ? null : idx;
};

const handleSubscribe = (plan: any) => {
  if (plan.id === 'free') {
    showInfo('免费版无需订阅，直接使用');
  } else {
    showSuccess(`已选择「${plan.name}」${isAnnual.value ? '年付' : '月付'}方案`);
  }
};

const plans = [
  {
    id: 'free',
    name: '免费版',
    description: '适合初次体验的用户',
    icon: 'fa-user',
    monthlyPrice: 0,
    annualPrice: 0,
    buttonText: '当前方案',
    isPopular: false,
    features: [
      { text: '浏览所有作品', included: true },
      { text: '点赞和收藏', included: true },
      { text: '参与社区讨论', included: true },
      { text: '学习免费课程', included: true },
      { text: '上传作品', included: false },
      { text: '付费课程', included: false },
      { text: '专属徽章', included: false }
    ]
  },
  {
    id: 'basic',
    name: '基础版',
    description: '适合摄影爱好者',
    icon: 'fa-star',
    monthlyPrice: 29,
    annualPrice: 19,
    buttonText: '立即订阅',
    isPopular: false,
    features: [
      { text: '浏览所有作品', included: true },
      { text: '点赞和收藏', included: true },
      { text: '参与社区讨论', included: true },
      { text: '学习免费课程', included: true },
      { text: '上传作品', included: true },
      { text: '付费课程', included: false },
      { text: '专属徽章', included: true }
    ]
  },
  {
    id: 'pro',
    name: '专业版',
    description: '适合专业摄影师',
    icon: 'fa-crown',
    monthlyPrice: 99,
    annualPrice: 69,
    buttonText: '立即订阅',
    isPopular: true,
    features: [
      { text: '浏览所有作品', included: true },
      { text: '点赞和收藏', included: true },
      { text: '参与社区讨论', included: true },
      { text: '学习免费课程', included: true },
      { text: '上传作品', included: true },
      { text: '付费课程', included: true },
      { text: '专属徽章', included: true }
    ]
  },
  {
    id: 'vip',
    name: 'VIP版',
    description: '尊享极致体验',
    icon: 'fa-gem',
    monthlyPrice: 299,
    annualPrice: 199,
    buttonText: '立即订阅',
    isPopular: false,
    features: [
      { text: '浏览所有作品', included: true },
      { text: '点赞和收藏', included: true },
      { text: '参与社区讨论', included: true },
      { text: '学习免费课程', included: true },
      { text: '上传作品', included: true },
      { text: '付费课程', included: true },
      { text: '专属徽章', included: true },
      { text: '1对1指导', included: true }
    ]
  }
];

const faqs = [
  {
    question: '如何取消订阅？',
    answer: '你可以随时在账户设置中取消订阅，取消后服务将持续到当前计费周期结束。'
  },
  {
    question: '支持哪些支付方式？',
    answer: '我们支持微信支付、支付宝、银行卡等多种支付方式，方便快捷。'
  },
  {
    question: '可以退款吗？',
    answer: '我们提供7天无理由退款保证，如果你在7天内对服务不满意，可以申请全额退款。'
  },
  {
    question: '如何升级或降级会员方案？',
    answer: '你可以随时在会员页面更改方案，差价将按比例计算并在下一次计费时调整。'
  },
  {
    question: '会员特权可以分享吗？',
    answer: '会员账户仅限个人使用，不支持分享或转让给他人使用。'
  }
];
</script>
