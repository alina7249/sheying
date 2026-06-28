<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold mb-2">
          <i class="fa-solid fa-crown mr-2 text-[#d4a853]"></i>会员中心
        </h1>
        <p class="text-[#9ca3af]">升级会员，解锁更多权益</p>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-[#d4a853] border-t-transparent rounded-full"></div>
      </div>

      <template v-else>
        <!-- 当前会员状态 -->
        <div class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 mb-10">
          <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div :class="['w-14 h-14 rounded-2xl flex items-center justify-center text-2xl', getLevelBgClass(memberInfo.memberLevel)]">
                <i :class="['fa-solid', getLevelIcon(memberInfo.memberLevel)]"></i>
              </div>
              <div>
                <h2 class="text-white text-xl font-bold">{{ memberInfo.levelName }}</h2>
                <p v-if="memberInfo.memberLevel > 0 && memberInfo.remainingDays > 0" class="text-[#9ca3af] text-sm">
                  剩余 <span class="text-[#d4a853]">{{ memberInfo.remainingDays }}</span> 天
                </p>
                <p v-else-if="memberInfo.memberLevel > 0" class="text-red-400 text-sm">已过期</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-center">
                <p class="text-2xl font-bold text-white">{{ memberInfo.dailyUploadUsed || 0 }}</p>
                <p class="text-xs text-[#6b7280]">已上传</p>
              </div>
              <div class="w-px h-10 bg-[rgba(255,255,255,0.08)]"></div>
              <div class="text-center">
                <p class="text-2xl font-bold text-[#d4a853]">{{ memberInfo.dailyUploadLimit || 10 }}</p>
                <p class="text-xs text-[#6b7280]">每日限额</p>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="text-xs text-[#6b7280] mb-2">今日上传进度</div>
            <div class="w-full h-2 bg-[#1f2937] rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-[#d4a853] to-amber-400 rounded-full transition-all duration-500"
                :style="{ width: uploadPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- 套餐卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div v-for="plan in plans" :key="plan.id"
            :class="['relative bg-[#111827] rounded-2xl p-6 border transition-all duration-300 hover:border-[#d4a853]/50',
              plan.recommended ? 'border-[#d4a853] shadow-lg shadow-[#d4a853]/10' : 'border-[rgba(255,255,255,0.08)]']">
            <div v-if="plan.recommended" class="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#d4a853] text-[#0a0a0a] text-xs font-bold rounded-full">
              {{ plan.badge }}
            </div>
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-4', getPlanBgClass(plan.id)]">
              <i :class="['fa-solid', getPlanIcon(plan.id)]"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">{{ plan.name }}</h3>
            <p class="text-[#6b7280] text-sm mb-3">{{ plan.description }}</p>
            <div class="mb-4">
              <span class="text-3xl font-bold text-[#d4a853]">¥{{ plan.price }}</span>
              <span v-if="plan.originalPrice" class="text-sm text-[#6b7280] line-through ml-2">¥{{ plan.originalPrice }}</span>
              <span class="text-xs text-[#6b7280]">/{{ plan.duration }}天</span>
            </div>
            <ul class="space-y-2 mb-6">
              <li v-for="(benefit, bi) in plan.benefitList" :key="bi" class="text-[#9ca3af] text-sm flex items-center gap-2">
                <i class="fa-solid fa-check text-[#d4a853] text-xs"></i>
                {{ benefit }}
              </li>
            </ul>
            <button @click="handleBuy(plan)"
              :disabled="paying"
              :class="['w-full py-3 rounded-xl text-sm font-medium transition-all duration-200',
                plan.id === 3 ? 'bg-gradient-to-r from-[#d4a853] to-amber-500 text-[#0a0a0a] hover:shadow-lg hover:shadow-[#d4a853]/20' :
                plan.id === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:shadow-lg hover:shadow-gray-400/20' :
                'bg-gradient-to-r from-amber-700 to-amber-600 text-white hover:shadow-lg hover:shadow-amber-700/20']">
              {{ paying ? '处理中...' : '立即支付' }}
            </button>
          </div>
        </div>

        <!-- 订单列表 -->
        <div class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6">
          <h3 class="text-white text-lg font-bold mb-4">我的订单</h3>
          <div v-if="orderLoading" class="text-center py-8">
            <div class="animate-spin w-6 h-6 border-2 border-[#d4a853] border-t-transparent rounded-full mx-auto"></div>
          </div>
          <div v-else-if="orders.length === 0" class="text-center py-8 text-[#6b7280] text-sm">暂无订单</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="border-b border-[rgba(255,255,255,0.08)]">
                <tr class="text-[#6b7280]">
                  <th class="text-left py-3">订单号</th>
                  <th class="text-left py-3 hidden md:table-cell">套餐</th>
                  <th class="text-left py-3">金额</th>
                  <th class="text-left py-3 hidden md:table-cell">状态</th>
                  <th class="text-left py-3 hidden md:table-cell">时间</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in orders" :key="order.id" class="border-b border-[rgba(255,255,255,0.04)]">
                  <td class="py-3 text-[#9ca3af] font-mono text-xs">{{ order.orderNo }}</td>
                  <td class="py-3 text-white hidden md:table-cell">{{ order.planName }}</td>
                  <td class="py-3 text-[#d4a853]">¥{{ order.amount }}</td>
                  <td class="py-3 hidden md:table-cell">
                    <span :class="order.status === 'paid' ? 'text-green-400' : 'text-[#9ca3af]'">
                      {{ order.status === 'paid' ? '已支付' : order.status === 'unpaid' ? '待支付' : order.status }}
                    </span>
                  </td>
                  <td class="py-3 text-[#6b7280] text-xs hidden md:table-cell">{{ formatDate(order.createTime) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>

      <!-- 支付确认弹窗 -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showPayModal" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/60" @click="showPayModal = false"></div>
            <div class="relative bg-[#1a1a2e] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 w-full max-w-md mx-4">
              <h3 class="text-white text-xl font-bold mb-4">确认支付</h3>
              <div class="bg-[#111827] rounded-xl p-4 mb-6">
                <div class="flex justify-between mb-2">
                  <span class="text-[#9ca3af]">套餐</span>
                  <span class="text-white">{{ selectedPlan?.name }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-[#9ca3af]">金额</span>
                  <span class="text-[#d4a853] text-xl font-bold">¥{{ selectedPlan?.price }}</span>
                </div>
              </div>
              <div class="flex gap-3">
                <button @click="showPayModal = false" class="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-white transition-colors">取消</button>
                <button @click="confirmPay" :disabled="paying" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#d4a853] to-amber-500 text-[#0a0a0a] font-medium hover:shadow-lg hover:shadow-[#d4a853]/20 transition-all disabled:opacity-50">
                  {{ paying ? '支付中...' : '确认支付' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- 成功弹窗 -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showSuccessModal" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/60" @click="showSuccessModal = false"></div>
            <div class="relative bg-[#1a1a2e] border border-[rgba(255,255,255,0.08)] rounded-2xl p-8 w-full max-w-md mx-4 text-center">
              <div class="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <i class="fa-solid fa-check text-4xl text-green-400"></i>
              </div>
              <h3 class="text-white text-xl font-bold mb-2">支付成功！</h3>
              <p class="text-[#9ca3af] mb-6">恭喜你成为{{ successLevelName }}，享受更多权益</p>
              <button @click="showSuccessModal = false" class="px-8 py-3 rounded-xl bg-gradient-to-r from-[#d4a853] to-amber-500 text-[#0a0a0a] font-medium hover:shadow-lg hover:shadow-[#d4a853]/20 transition-all">知道了</button>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { getMembershipPlans, getMemberInfo, createOrder, mockPay, getMyOrders } from '../services/api';
import { toast } from 'vue-sonner';

const loading = ref(true);
const paying = ref(false);
const orderLoading = ref(false);
const showPayModal = ref(false);
const showSuccessModal = ref(false);
const successLevelName = ref('');
const memberInfo = ref<any>({ memberLevel: 0, levelName: '普通用户', dailyUploadUsed: 0, dailyUploadLimit: 10, remainingDays: 0 });
const plans = ref<any[]>([]);
const orders = ref<any[]>([]);
const selectedPlan = ref<any>(null);
const currentOrderId = ref<number>(0);

const uploadPercent = computed(() => {
  const limit = memberInfo.value.dailyUploadLimit || 10;
  const used = memberInfo.value.dailyUploadUsed || 0;
  return Math.min(100, Math.round((used / limit) * 100));
});

const getLevelBgClass = (level: number) => {
  const map: Record<number, string> = { 1: 'bg-amber-700/20 text-amber-600', 2: 'bg-gray-400/20 text-gray-400', 3: 'bg-[#d4a853]/20 text-[#d4a853]' };
  return map[level] || 'bg-[#374151]/20 text-[#6b7280]';
};

const getLevelIcon = (level: number) => {
  const map: Record<number, string> = { 1: 'fa-medal', 2: 'fa-crown', 3: 'fa-gem' };
  return map[level] || 'fa-user';
};

const getPlanBgClass = (id: number) => {
  const map: Record<number, string> = { 1: 'bg-amber-700/20 text-amber-600', 2: 'bg-gray-400/20 text-gray-400', 3: 'bg-[#d4a853]/20 text-[#d4a853]' };
  return map[id] || 'bg-[#374151]/20 text-[#6b7280]';
};

const getPlanIcon = (id: number) => {
  const map: Record<number, string> = { 1: 'fa-medal', 2: 'fa-crown', 3: 'fa-gem' };
  return map[id] || 'fa-star';
};

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN');
};

const loadData = async () => {
  loading.value = true;
  try {
    const [memberRes, plansRes]: any[] = await Promise.all([
      getMemberInfo().catch(() => ({ data: { memberLevel: 0, levelName: '普通用户', dailyUploadUsed: 0, dailyUploadLimit: 10, remainingDays: 0 } })),
      getMembershipPlans().catch(() => ({ data: [] }))
    ]);
    if (memberRes?.data) memberInfo.value = memberRes.data;
    if (plansRes?.data) {
      plans.value = plansRes.data.map((p: any) => {
        let benefits: string[] = [];
        try { benefits = typeof p.benefits === 'string' ? JSON.parse(p.benefits) : p.benefits || []; } catch (e) { /* */ }
        return {
          ...p,
          benefitList: benefits,
          recommended: p.id === 2 || p.id === 3,
          badge: p.id === 3 ? '最划算' : p.id === 2 ? '推荐' : ''
        };
      });
    }
  } catch (e) { /* */ }
  finally { loading.value = false; }
  loadOrders();
};

const loadOrders = async () => {
  orderLoading.value = true;
  try {
    const res: any = await getMyOrders(1, 50);
    if (res?.data?.records) orders.value = res.data.records;
  } catch (e) { /* */ }
  finally { orderLoading.value = false; }
};

const handleBuy = (plan: any) => {
  selectedPlan.value = plan;
  showPayModal.value = true;
};

const confirmPay = async () => {
  if (!selectedPlan.value) return;
  paying.value = true;
  try {
    const orderRes: any = await createOrder(selectedPlan.value.id);
    if (orderRes?.data?.orderId) {
      currentOrderId.value = orderRes.data.orderId;
      const payRes: any = await mockPay(currentOrderId.value);
      if (payRes?.code === 0) {
        showPayModal.value = false;
        const levelNames: Record<number, string> = { 1: '铜牌会员', 2: '银牌会员', 3: '金牌会员' };
        successLevelName.value = levelNames[payRes.data.memberLevel] || '会员';
        showSuccessModal.value = true;
        await loadData();
      } else {
        toast.error(payRes?.message || '支付失败');
      }
    } else {
      toast.error('创建订单失败');
    }
  } catch (e: any) {
    toast.error(e?.message || '支付失败');
  } finally {
    paying.value = false;
  }
};

onMounted(() => loadData());
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div:last-child, .modal-leave-to > div:last-child { transform: scale(0.9); }
</style>