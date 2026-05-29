<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[#F5F7FA]">数据分析</h1>
        <p class="text-[#B8C6D8] mt-1">查看系统各项数据分析报表</p>
      </div>
      <div class="mt-4 md:mt-0 flex items-center space-x-3">
        <div class="flex bg-[#2D3748] rounded-lg overflow-hidden">
          <button
            v-for="range in timeRanges"
            :key="range.value"
            @click="timeRange = range.value"
            :class="[
              'px-3 py-2 text-sm transition-colors',
              timeRange === range.value
                ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                : 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20'
            ]"
          >
            {{ range.label }}
          </button>
        </div>
        <button class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#6B7C93] transition-colors text-sm flex items-center">
          <i class="fa-solid fa-download mr-2"></i>
          导出报表
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard title="总用户数" icon="fa-users" value="12,580" trend="up" trendValue="+5.2%" description="较上月增长" />
      <StatsCard title="新增用户" icon="fa-user-plus" value="1,245" trend="up" trendValue="+8.7%" description="本月新增" />
      <StatsCard title="内容总数" icon="fa-images" value="8,762" trend="up" trendValue="+3.1%" description="包括作品和帖子" />
      <StatsCard title="订单收入" icon="fa-coins" value="¥15,620" trend="up" trendValue="+12.3%" description="本月收入" />
    </div>

    <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-xl overflow-hidden">
      <div class="flex border-b border-[#4A5F8B] flex-wrap">
        <button
          @click="activeTab = 'overview'"
          :class="tabButtonClass('overview')"
        >
          <i class="fa-solid fa-chart-pie mr-2"></i> 概览
        </button>
        <button
          @click="activeTab = 'users'"
          :class="tabButtonClass('users')"
        >
          <i class="fa-solid fa-users mr-2"></i> 用户分析
        </button>
        <button
          @click="activeTab = 'content'"
          :class="tabButtonClass('content')"
        >
          <i class="fa-solid fa-images mr-2"></i> 内容分析
        </button>
        <button
          @click="activeTab = 'revenue'"
          :class="tabButtonClass('revenue')"
        >
          <i class="fa-solid fa-chart-line mr-2"></i> 收入分析
        </button>
        <button
          @click="activeTab = 'engagement'"
          :class="tabButtonClass('engagement')"
        >
          <i class="fa-solid fa-heart mr-2"></i> 互动分析
        </button>
      </div>

      <div class="p-6">
        <!-- 概览标签页 -->
        <div v-if="activeTab === 'overview'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-[#F5F7FA]">用户增长趋势</h2>
                <div class="flex space-x-2">
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-[#4A5F8B] rounded-full mr-1"></span>
                    <span class="text-xs text-[#B8C6D8]">总用户</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-[#6B7C93] rounded-full mr-1"></span>
                    <span class="text-xs text-[#B8C6D8]">新增用户</span>
                  </div>
                </div>
              </div>
              <div class="h-80">
                <ChartCanvas type="area" :data="areaChartData" :options="areaChartOptions" />
              </div>
            </div>

            <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">用户活跃度分布</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="h-60">
                  <ChartCanvas type="pie" :data="activityPieData" :options="basePieOptions" />
                </div>
                <div class="flex flex-col justify-center">
                  <div class="space-y-4">
                    <div v-for="(item, index) in userActivityData" :key="index" class="flex items-center justify-between">
                      <div class="flex items-center">
                        <span class="w-4 h-4 rounded-full mr-2" :style="{ backgroundColor: COLORS[index % COLORS.length] }"></span>
                        <span class="text-sm text-[#B8C6D8]">{{ item.name }}</span>
                      </div>
                      <span class="font-medium text-[#F5F7FA]">{{ item.value }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-[#F5F7FA]">内容类型统计</h2>
                <div class="flex space-x-2">
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-[#4A5F8B] rounded-full mr-1"></span>
                    <span class="text-xs text-[#B8C6D8]">摄影作品</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-[#6B7C93] rounded-full mr-1"></span>
                    <span class="text-xs text-[#B8C6D8]">社区帖子</span>
                  </div>
                  <div class="flex items-center">
                    <span class="w-3 h-3 bg-[#38B2AC] rounded-full mr-1"></span>
                    <span class="text-xs text-[#B8C6D8]">评论</span>
                  </div>
                </div>
              </div>
              <div class="h-80">
                <ChartCanvas type="bar" :data="contentBarData" :options="groupedBarOptions" />
              </div>
            </div>

            <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">热门摄影分类占比</h2>
              <div class="h-60">
                <ChartCanvas type="pie" :data="categoriesPieData" :options="categoriesPieOptions" />
              </div>
            </div>
          </div>
        </div>

        <!-- 用户分析标签页 -->
        <div v-if="activeTab === 'users'" class="space-y-8">
          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-[#F5F7FA]">用户增长趋势</h2>
            </div>
            <div class="h-80">
              <ChartCanvas type="line" :data="userGrowthLineData" :options="singleLineOptions" />
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">用户活跃度分布</h2>
              <div class="h-60">
                <ChartCanvas type="pie" :data="activityPieData" :options="basePieOptions" />
              </div>
            </div>

            <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">热门摄影分类占比</h2>
              <div class="h-60">
                <ChartCanvas type="pie" :data="categoriesPieData" :options="categoriesPieOptions" />
              </div>
            </div>
          </div>
        </div>

        <!-- 内容分析标签页 -->
        <div v-if="activeTab === 'content'" class="space-y-8">
          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-[#F5F7FA]">内容类型统计</h2>
              <div class="flex space-x-2">
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-[#4A5F8B] rounded-full mr-1"></span>
                  <span class="text-xs text-[#B8C6D8]">摄影作品</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-[#6B7C93] rounded-full mr-1"></span>
                  <span class="text-xs text-[#B8C6D8]">社区帖子</span>
                </div>
                <div class="flex items-center">
                  <span class="w-3 h-3 bg-[#38B2AC] rounded-full mr-1"></span>
                  <span class="text-xs text-[#B8C6D8]">评论</span>
                </div>
              </div>
            </div>
            <div class="h-80">
              <ChartCanvas type="bar" :data="contentBarData" :options="groupedBarOptions" />
            </div>
          </div>
        </div>

        <!-- 收入分析标签页 -->
        <div v-if="activeTab === 'revenue'" class="space-y-8">
          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-bold text-[#F5F7FA]">收入趋势</h2>
            </div>
            <div class="h-80">
              <ChartCanvas type="bar" :data="revenueBarData" :options="revenueBarOptions" />
            </div>
          </div>
        </div>

        <!-- 互动分析标签页 -->
        <div v-if="activeTab === 'engagement'" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-bold text-[#F5F7FA]">互动趋势</h2>
              </div>
              <div class="h-80">
                <ChartCanvas type="line" :data="engagementLineData" :options="singleLineOptions" />
              </div>
            </div>

            <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
              <h2 class="text-lg font-bold text-[#F5F7FA] mb-4">热门摄影分类占比</h2>
              <div class="h-60">
                <ChartCanvas type="pie" :data="categoriesPieData" :options="categoriesPieOptions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StatsCard from '../../components/common/StatsCard.vue'
import ChartCanvas from '../../components/common/ChartCanvas.vue'

const timeRanges = [
  { value: 'day' as const, label: '日' },
  { value: 'week' as const, label: '周' },
  { value: 'month' as const, label: '月' },
  { value: 'year' as const, label: '年' },
]

const timeRange = ref<'day' | 'week' | 'month' | 'year'>('month')
const activeTab = ref<'overview' | 'users' | 'content' | 'revenue' | 'engagement'>('overview')

const userGrowthData = [
  { date: '1月', users: 4000, newUsers: 2400 },
  { date: '2月', users: 3000, newUsers: 1398 },
  { date: '3月', users: 2000, newUsers: 9800 },
  { date: '4月', users: 2780, newUsers: 3908 },
  { date: '5月', users: 1890, newUsers: 4800 },
  { date: '6月', users: 2390, newUsers: 3800 },
  { date: '7月', users: 3490, newUsers: 4300 }
]

const contentStatsData = [
  { date: '1月', photos: 400, posts: 240, comments: 1800 },
  { date: '2月', photos: 300, posts: 139, comments: 1200 },
  { date: '3月', photos: 200, posts: 98, comments: 900 },
  { date: '4月', photos: 278, posts: 190, comments: 1500 },
  { date: '5月', photos: 189, posts: 148, comments: 1300 },
  { date: '6月', photos: 239, posts: 138, comments: 1100 },
  { date: '7月', photos: 349, posts: 200, comments: 1700 }
]

const revenueData = [
  { month: '1月', amount: 2400 },
  { month: '2月', amount: 1398 },
  { month: '3月', amount: 9800 },
  { month: '4月', amount: 3908 },
  { month: '5月', amount: 4800 },
  { month: '6月', amount: 3800 },
  { month: '7月', amount: 4300 }
]

const userActivityData = [
  { name: '活跃用户', value: 6500 },
  { name: '较活跃用户', value: 2500 },
  { name: '不活跃用户', value: 1000 }
]

const COLORS = ['#4A5F8B', '#6B7C93', '#38B2AC']

const popularCategoriesData = [
  { name: '风光摄影', value: 35 },
  { name: '人像摄影', value: 25 },
  { name: '城市摄影', value: 15 },
  { name: '黑白摄影', value: 10 },
  { name: '生态摄影', value: 8 },
  { name: '其他', value: 7 }
]

function tabButtonClass(tab: string) {
  return activeTab.value === tab
    ? 'flex-1 py-4 px-4 text-center font-medium transition-colors bg-[#4A5F8B] text-[#F5F7FA]'
    : 'flex-1 py-4 px-4 text-center font-medium transition-colors bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
}

const darkGrid = { grid: { color: '#4A5F8B', drawBorder: false }, ticks: { color: '#B8C6D8' } }
const darkTooltip = {
  callbacks: {
    label: (ctx: any) => {
      if (ctx.dataset.label) return `${ctx.dataset.label}: ${ctx.raw}`
      return `${ctx.raw}`
    },
  },
}

const areaChartData = computed(() => ({
  labels: userGrowthData.map(d => d.date),
  datasets: [
    {
      label: '总用户',
      data: userGrowthData.map(d => d.users),
      borderColor: '#4A5F8B',
      backgroundColor: 'rgba(74,95,139,0.3)',
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
    },
    {
      label: '新增用户',
      data: userGrowthData.map(d => d.newUsers),
      borderColor: '#6B7C93',
      backgroundColor: 'rgba(107,124,147,0.3)',
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
    },
  ],
}))

const areaChartOptions = {
  plugins: { legend: { display: false }, tooltip: darkTooltip },
  scales: { x: darkGrid, y: darkGrid },
}

const activityPieData = computed(() => ({
  labels: userActivityData.map(d => d.name),
  datasets: [{
    data: userActivityData.map(d => d.value),
    backgroundColor: COLORS,
    borderWidth: 0,
  }],
}))

const basePieOptions = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => {
          const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const pct = ((ctx.raw / total) * 100).toFixed(0)
          return `${ctx.label}: ${ctx.raw} (${pct}%)`
        },
      },
    },
  },
}

const contentBarData = computed(() => ({
  labels: contentStatsData.map(d => d.date),
  datasets: [
    { label: '摄影作品', data: contentStatsData.map(d => d.photos), backgroundColor: '#4A5F8B', borderRadius: 4 },
    { label: '社区帖子', data: contentStatsData.map(d => d.posts), backgroundColor: '#6B7C93', borderRadius: 4 },
    { label: '评论', data: contentStatsData.map(d => d.comments), backgroundColor: '#38B2AC', borderRadius: 4 },
  ],
}))

const groupedBarOptions = {
  plugins: { legend: { display: false }, tooltip: darkTooltip },
  scales: { x: darkGrid, y: darkGrid },
}

const categoriesPieData = computed(() => ({
  labels: popularCategoriesData.map(d => d.name),
  datasets: [{
    data: popularCategoriesData.map(d => d.value),
    backgroundColor: COLORS,
    borderWidth: 0,
  }],
}))

const categoriesPieOptions = {
  plugins: {
    legend: { display: true, position: 'right' as const, labels: { color: '#B8C6D8', padding: 16 } },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.raw}%`,
      },
    },
  },
}

const userGrowthLineData = computed(() => ({
  labels: userGrowthData.map(d => d.date),
  datasets: [{
    label: '总用户',
    data: userGrowthData.map(d => d.users),
    borderColor: '#4A5F8B',
    backgroundColor: '#4A5F8B',
    tension: 0.3,
    pointRadius: 4,
    pointHoverRadius: 6,
    borderWidth: 2,
  }],
}))

const singleLineOptions = {
  plugins: { legend: { display: false }, tooltip: darkTooltip },
  scales: { x: darkGrid, y: darkGrid },
}

const engagementLineData = computed(() => ({
  labels: contentStatsData.map(d => d.date),
  datasets: [{
    label: '评论',
    data: contentStatsData.map(d => d.comments),
    borderColor: '#4A5F8B',
    backgroundColor: '#4A5F8B',
    tension: 0.3,
    pointRadius: 4,
    pointHoverRadius: 6,
    borderWidth: 2,
  }],
}))

const revenueBarData = computed(() => ({
  labels: revenueData.map(d => d.month),
  datasets: [{
    label: '收入',
    data: revenueData.map(d => d.amount),
    backgroundColor: '#4A5F8B',
    borderRadius: 4,
  }],
}))

const revenueBarOptions = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `¥${ctx.raw}`,
      },
    },
  },
  scales: { x: darkGrid, y: darkGrid },
}
</script>