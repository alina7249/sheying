<template>
  <div class="min-h-screen bg-[#0F1C2D] container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-white mb-2">
          <i class="fa-solid fa-crown mr-2 text-[#C9A962]"></i>会员中心
        </h1>
        <p class="text-[#6B7C93]">升级会员，解锁更多权益</p>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full"></div>
      </div>

      <template v-else>
        <!-- 当前会员状态 -->
        <div class="bg-[#1E2532] rounded-2xl p-8 border border-[#2D3748] mb-8">
          <div class="flex items-center gap-4">
            <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center text-2xl', getLevelBg(memberInfo.memberLevel)]">
              <i :class="['fa-solid', getLevelIcon(memberInfo.memberLevel)]"></i>
            </div>
            <div>
              <h2 class="text-white text-xl font-bold">{{ memberInfo.levelName }}</h2>
              <p class="text-[#6B7C93] text-sm">每日上传配额：{{ memberInfo.uploadQuota }} 张</p>
            </div>
          </div>
          <div class="mt-6">
            <div class="text-sm text-[#6B7C93] mb-2">上传配额使用情况</div>
            <div class="w-full h-2 bg-[#2D3748] rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-[#4A5F8B] to-[#C9A962] rounded-full transition-all duration-500" :style="{ width: quotaPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- 会员套餐 -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="plan in plans" :key="plan.level"
            :class="['bg-[#1E2532] rounded-2xl p-6 border transition-all duration-300',
              memberInfo.memberLevel === plan.level ? 'border-[#C9A962] shadow-lg shadow-[#C9A962]/10' : 'border-[#2D3748] hover:border-[#4A5F8B]/50']">
            <div :class="['w-12 h-12 rounded-xl flex items-center justify-center text-lg mb-4', getLevelBg(plan.level)]">
              <i :class="['fa-solid', getLevelIcon(plan.level)]"></i>
            </div>
            <h3 class="text-white text-lg font-bold mb-1">{{ plan.name }}</h3>
            <p class="text-[#C9A962] text-2xl font-bold mb-4">{{ plan.price }}</p>
            <ul class="space-y-2 mb-6">
              <li v-for="(feat, fi) in plan.features" :key="fi" class="text-[#B8C6D8] text-sm flex items-center gap-2">
                <i class="fa-solid fa-check text-[#C9A962] text-xs"></i>
                {{ feat }}
              </li>
            </ul>
            <button
              @click="handleUpgrade(plan.level)"
              :disabled="memberInfo.memberLevel >= plan.level || upgrading"
              :class="['w-full py-3 rounded-xl text-sm font-medium transition-all duration-200',
                memberInfo.memberLevel >= plan.level
                  ? 'bg-[#2D3748] text-[#6B7C93] cursor-not-allowed'
                  : plan.level === 3
                    ? 'bg-gradient-to-r from-[#C9A962] to-amber-500 text-[#0F1C2D] hover:shadow-lg hover:shadow-[#C9A962]/20'
                    : 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white hover:shadow-lg hover:shadow-[#4A5F8B]/30']">
              {{ memberInfo.memberLevel >= plan.level ? '当前等级' : upgrading ? '升级中...' : '立即升级' }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { getMemberInfo, upgradeMember } from '../services/api';
import { toast } from 'vue-sonner';

const memberInfo = ref({ memberLevel: 0, levelName: '普通用户', memberBadge: '', uploadQuota: 10 });
const loading = ref(false);
const upgrading = ref(false);

const quotaPercent = computed(() => {
  return Math.min(100, Math.round((memberInfo.value.uploadQuota / 500) * 100));
});

const plans = [
  { level: 1, name: '银牌会员', price: '¥29/月', features: ['每日上传 30 张', '银牌专属勋章', '优先展示作品', '去广告'] },
  { level: 2, name: '金牌会员', price: '¥59/月', features: ['每日上传 100 张', '金牌专属勋章', '首页推荐位', '去广告', '数据分析'] },
  { level: 3, name: '钻石会员', price: '¥99/月', features: ['每日上传 500 张', '钻石专属勋章', '首页置顶推荐', '去广告', '高级数据分析', '专属客服'] },
];

const getLevelBg = (level: number) => {
  const map: Record<number, string> = { 1: 'bg-gray-400/20 text-gray-400', 2: 'bg-[#C9A962]/20 text-[#C9A962]', 3: 'bg-blue-500/20 text-blue-400' };
  return map[level] || 'bg-[#4A5F8B]/20 text-[#4A5F8B]';
};

const getLevelIcon = (level: number) => {
  const map: Record<number, string> = { 1: 'fa-medal', 2: 'fa-crown', 3: 'fa-gem' };
  return map[level] || 'fa-user';
};

const loadMemberInfo = async () => {
  loading.value = true;
  try {
    const res: any = await getMemberInfo();
    if (res?.code === 0 && res.data) {
      memberInfo.value = res.data;
    }
  } catch (e) { /* ignore */ }
  finally { loading.value = false; }
};

const handleUpgrade = async (level: number) => {
  upgrading.value = true;
  try {
    const res: any = await upgradeMember(level);
    if (res?.code === 0) {
      toast.success('升级成功！');
      await loadMemberInfo();
    } else {
      toast.error(res?.message || '升级失败');
    }
  } catch (e: any) {
    toast.error(e?.message || '升级失败');
  }
  finally { upgrading.value = false; }
};

onMounted(() => {
  loadMemberInfo();
});
</script>