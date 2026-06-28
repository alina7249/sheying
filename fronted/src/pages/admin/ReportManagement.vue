<template>
  <div>
    <h1 class="text-2xl font-bold text-white mb-8">举报管理</h1>
    <div class="bg-[#1E2532] rounded-xl border border-[#2D3748] overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-[#2D3748]">
            <tr>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium">ID</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium">举报人</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium hidden md:table-cell">目标类型</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium hidden md:table-cell">原因</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium">状态</th>
              <th class="text-left p-4 text-[#B8C6D8] text-sm font-medium hidden md:table-cell">时间</th>
              <th class="text-right p-4 text-[#B8C6D8] text-sm font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-t border-[#2D3748]">
              <td colspan="7" class="p-8 text-center text-[#6B7C93]">
                <div class="animate-spin w-6 h-6 border-2 border-[#C9A962] border-t-transparent rounded-full mx-auto"></div>
              </td>
            </tr>
            <tr v-for="report in reports" :key="report.id" class="border-t border-[#2D3748] hover:bg-[#2D3748]/30 transition-colors">
              <td class="p-4 text-white text-sm">{{ report.id }}</td>
              <td class="p-4 text-[#B8C6D8] text-sm">{{ report.userId }}</td>
              <td class="p-4 text-[#B8C6D8] text-sm hidden md:table-cell">
                <span :class="report.targetType === 'post' ? 'text-[#63B3ED]' : report.targetType === 'comment' ? 'text-green-400' : 'text-purple-400'">
                  {{ report.targetType === 'post' ? '作品' : report.targetType === 'comment' ? '评论' : '用户' }}
                </span>
                <span class="text-[#6B7C93] ml-1">#{{ report.targetId }}</span>
              </td>
              <td class="p-4 text-[#B8C6D8] text-sm hidden md:table-cell">{{ reasonLabel(report.reason) }}</td>
              <td class="p-4">
                <span :class="report.status === 'pending' ? 'text-yellow-400' : report.status === 'resolved' ? 'text-green-400' : 'text-red-400'" class="text-sm">
                  {{ report.status === 'pending' ? '待处理' : report.status === 'resolved' ? '已处理' : report.status }}
                </span>
              </td>
              <td class="p-4 text-[#B8C6D8] text-sm hidden md:table-cell">{{ formatDate(report.createTime) }}</td>
              <td class="p-4 text-right">
                <div class="flex gap-2 justify-end" v-if="report.status === 'pending'">
                  <button @click="handleReportAction(report.id, 'resolved')" class="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs hover:bg-green-500/30 transition-colors">通过</button>
                  <button @click="handleReportAction(report.id, 'rejected')" class="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-xs hover:bg-red-500/30 transition-colors">驳回</button>
                </div>
                <span v-else class="text-[#6B7C93] text-xs">{{ report.handleNote || '-' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="total > pageSize" class="flex justify-center p-4 gap-2 border-t border-[#2D3748]">
        <button @click="current--; loadReports()" :disabled="current === 1" class="px-3 py-1.5 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50">上一页</button>
        <span class="px-3 py-1.5 text-[#6B7C93] text-sm">{{ current }} / {{ Math.ceil(total / pageSize) }}</span>
        <button @click="current++; loadReports()" :disabled="current >= Math.ceil(total / pageSize)" class="px-3 py-1.5 rounded-lg bg-[#2D3748] text-[#B8C6D8] text-sm hover:bg-[#4A5F8B] hover:text-white transition-colors disabled:opacity-50">下一页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getReportList, handleReport } from '../../services/api';
import { toast } from 'vue-sonner';

const reports = ref<any[]>([]);
const loading = ref(false);
const current = ref(1);
const pageSize = 20;
const total = ref(0);

const reasonLabel = (reason: string) => {
  const map: Record<string, string> = { spam: '垃圾信息', inappropriate: '不当内容', stolen: '盗用作品', other: '其他' };
  return map[reason] || reason;
};

const formatDate = (date: string) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN');
};

const loadReports = async () => {
  loading.value = true;
  try {
    const res: any = await getReportList(current.value, pageSize);
    if (res?.code === 0 && res.data) {
      reports.value = res.data.records || [];
      total.value = res.data.total || 0;
    }
  } catch (e) { /* */ }
  finally { loading.value = false; }
};

const handleReportAction = async (reportId: number, status: string) => {
  try {
    const note = status === 'resolved' ? '管理员审核通过' : '管理员驳回';
    await handleReport(reportId, status, note);
    toast.success(status === 'resolved' ? '已通过' : '已驳回');
    loadReports();
  } catch (e: any) {
    toast.error(e?.message || '操作失败');
  }
};

onMounted(() => loadReports());
</script>