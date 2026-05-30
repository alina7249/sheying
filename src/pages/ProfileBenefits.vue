<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div>
      <!-- 返回按钮 -->
      <div class="mb-6">
        <router-link to="/profile-center" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
          <i class="fa-solid fa-arrow-left"></i>
          <span>返回个人中心</span>
        </router-link>
      </div>

      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">会员权益</h1>
        <p class="text-[#B8C6D8] max-w-2xl mx-auto">查看您的会员等级、专属权益和成长进度</p>
      </div>

      <!-- 会员信息卡片 -->
      <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-lg mb-8 text-white">
        <div class="flex flex-col md:flex-row md:items-center justify-between">
          <div class="mb-6 md:mb-0">
            <div class="flex items-center mb-3">
              <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <i class="fa-solid fa-crown text-3xl text-[#F5F7FA]"></i>
              </div>
              <div>
                <h2 class="text-2xl font-bold">{{ mockMembershipData.currentPlan.name }}</h2>
                <p class="text-[#F5F7FA]">有效期至：{{ mockMembershipData.currentPlan.endDate }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <div class="flex items-center">
                <span class="text-lg font-bold mr-2">{{ mockMembershipData.currentPlan.daysLeft }}</span>
                <span class="text-[#F5F7FA]">天剩余</span>
              </div>
              <div class="flex items-center">
                <span class="text-lg font-bold mr-2">LV.{{ mockMembershipData.currentPlan.level }}</span>
                <span class="text-[#F5F7FA]">会员等级</span>
              </div>
            </div>
          </div>
          <div class="flex flex-col space-y-3 md:items-end">
            <button
              class="px-6 py-3 bg-[#F5F7FA] text-[#4A5F8B] rounded-lg font-medium hover:bg-white transition-colors shadow-md"
              @click="handleRenew"
            >
              立即续费
            </button>
            <button
              class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors"
              @click="handleUpgrade"
            >
              升级会员
            </button>
          </div>
        </div>
      </div>

      <!-- 主标签页导航 -->
      <div class="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
        <button
          v-for="tab in mainTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="['flex-1 py-3 px-4 text-center rounded-lg transition-colors', activeTab === tab.id ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium' : 'text-[#B8C6D8] hover:text-[#F5F7FA]']"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- 总览标签页 -->
      <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 左侧栏 -->
        <div class="lg:col-span-1 space-y-6">
          <!-- 使用统计 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">使用统计</h3>
            <div class="space-y-4">
              <div v-for="([key, value], idx) in usageStatsEntries" :key="idx">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-[#B8C6D8]">{{ key }}</span>
                  <span class="text-sm text-[#4A5F8B]">{{ value.used }}/{{ value.total }}</span>
                </div>
                <div class="w-full h-2 bg-[#1E2532] rounded-full overflow-hidden">
                  <div class="h-full bg-[#4A5F8B]" :style="{ width: `${(value.used / value.total) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前订阅 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">当前订阅</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">会员等级</span>
                <span class="text-sm text-[#B8C6D8] font-medium">LV.{{ mockMembershipData.currentPlan.level }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">订阅计划</span>
                <span class="text-sm text-[#B8C6D8] font-medium">{{ mockMembershipData.currentPlan.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">开始日期</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockMembershipData.currentPlan.startDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">结束日期</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockMembershipData.currentPlan.endDate }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">支付方式</span>
                <span class="text-sm text-[#B8C6D8]">{{ mockMembershipData.currentPlan.paymentFrequency }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-[#B8C6D8]">下次付款</span>
                <span class="text-sm text-[#B8C6D8]">¥{{ mockMembershipData.currentPlan.price }}</span>
              </div>
            </div>
            <button class="w-full mt-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors border border-[#4A5F8B]"
              @click="showInfo('管理订阅功能即将上线')">
              管理订阅
            </button>
          </div>

          <!-- 会员专属客服 -->
          <div
            class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm text-white hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <h3 class="text-lg font-bold mb-4 flex items-center">
              <i class="fa-solid fa-headset mr-2"></i>会员专属客服
            </h3>
            <p class="text-sm mb-4">获得优先的技术支持，专业摄影顾问一对一解答问题</p>
            <button
              class="w-full py-3 bg-white text-[#4A5F8B] rounded-lg font-medium hover:bg-[#F5F7FA] transition-colors flex items-center justify-center"
              @click="showChatModal = true"
            >
              <i class="fa-solid fa-comments mr-2"></i>立即咨询
            </button>
          </div>
        </div>

        <!-- 右侧主内容 -->
        <div class="lg:col-span-2 space-y-6">
          <!-- 权益使用统计可视化 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">权益使用统计</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- CSS Bar Chart -->
              <div class="h-64 flex flex-col justify-end">
                <div class="flex items-end justify-around h-full pb-6 px-2">
                  <div v-for="(item, idx) in mockMembershipData.growthSystem.usageChartData" :key="idx" class="flex flex-col items-center flex-1 mx-1">
                    <div class="w-full flex flex-col items-center justify-end" style="height: 180px">
                      <div class="w-full max-w-[40px] bg-[#6B7C93] rounded-t-sm" :style="{ height: (item.total / 10) * 100 + '%' }" :title="`总量: ${item.total}`"></div>
                      <div class="w-full max-w-[40px] bg-[#4A5F8B] rounded-t-sm mt-0.5" :style="{ height: (item.used / 10) * 100 + '%' }" :title="`已使用: ${item.used}`"></div>
                    </div>
                    <span class="text-xs text-[#B8C6D8] mt-2 truncate w-full text-center">{{ item.name }}</span>
                  </div>
                </div>
                <div class="flex justify-center gap-4 mt-2">
                  <div class="flex items-center"><div class="w-3 h-3 bg-[#4A5F8B] rounded mr-1"></div><span class="text-xs text-[#B8C6D8]">已使用</span></div>
                  <div class="flex items-center"><div class="w-3 h-3 bg-[#6B7C93] rounded mr-1"></div><span class="text-xs text-[#B8C6D8]">总量</span></div>
                </div>
              </div>
              <!-- CSS Donut Chart -->
              <div class="h-64 flex items-center justify-center">
                <div class="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
                    <template v-for="(slice, idx) in pieData" :key="idx">
                      <circle
                        cx="18" cy="18" r="14"
                        fill="none"
                        :stroke="COLORS[idx % COLORS.length]"
                        :stroke-width="4"
                        :stroke-dasharray="`${slice.percent} ${100 - slice.percent}`"
                        :stroke-dashoffset="pieOffsets[idx]"
                        class="transition-all duration-500"
                      />
                    </template>
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center text-sm text-[#B8C6D8]">
                    使用占比
                  </div>
                </div>
                <div class="ml-4 space-y-2">
                  <div v-for="(slice, idx) in pieData" :key="idx" class="flex items-center text-xs">
                    <div class="w-3 h-3 rounded mr-1" :style="{ backgroundColor: COLORS[idx % COLORS.length] }"></div>
                    <span class="text-[#B8C6D8]">{{ slice.name }} {{ slice.used }}/{{ slice.fullValue }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 您的专属特权 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">您的专属特权</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="benefit in mockMembershipData.benefits.active.slice(0, 4)" :key="benefit.id" class="flex items-start p-4 bg-[#1E2532] rounded-lg">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                  <i :class="`fa-solid ${benefit.icon}`"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#B8C6D8] mb-1">{{ benefit.name }}</h4>
                  <p class="text-sm text-[#B8C6D8] mb-1">{{ benefit.description }}</p>
                  <span v-if="benefit.count" class="text-xs text-[#4A5F8B] font-medium">{{ benefit.count }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <button @click="showInfo('查看全部会员特权')" class="inline-flex items-center text-sm text-[#4A5F8B] hover:underline transition-colors">
                <span>查看全部会员特权</span>
                <i class="fa-solid fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>

          <!-- 专属内容预览 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">专属内容预览</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="content in mockMembershipData.growthSystem.exclusiveContent" :key="content.id"
                class="bg-[#1E2532] rounded-xl overflow-hidden border border-[#4A5F8B] hover:-translate-y-1 transition-transform"
              >
                <div class="h-40 overflow-hidden">
                  <img :src="content.image" :alt="content.title" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div class="p-4">
                  <h4 class="font-medium text-[#B8C6D8] mb-2">{{ content.title }}</h4>
                  <p class="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{{ content.description }}</p>
                  <button class="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors text-sm"
                    @click="showInfo('课程详情即将显示')">
                    了解详情
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 推荐套餐 -->
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">推荐套餐</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="plan in mockMembershipData.availablePlans" :key="plan.id"
                :class="['rounded-xl overflow-hidden border transition-all hover:-translate-y-1 relative', plan.recommended ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-[#4A5F8B] bg-[#1E2532]']"
              >
                <div v-if="plan.recommended" class="absolute top-0 right-0">
                  <div class="bg-[#4A5F8B] text-[#F5F7FA] text-xs px-3 py-1 font-medium rounded-bl-lg">
                    推荐
                  </div>
                </div>
                <div class="p-5">
                  <h4 class="font-bold text-[#B8C6D8] mb-2">{{ plan.name }}</h4>
                  <div class="mb-4">
                    <span class="text-2xl font-bold text-[#4A5F8B]">¥{{ plan.price }}</span>
                    <span class="text-[#B8C6D8] ml-1">{{ plan.period }}</span>
                  </div>
                  <ul class="space-y-2 mb-6">
                    <li v-for="(feature, idx) in plan.features" :key="idx" class="flex items-start text-sm">
                      <i class="fa-solid fa-check text-[#4A5F8B] mr-2 mt-0.5 flex-shrink-0"></i>
                      <span class="text-[#B8C6D8]">{{ feature }}</span>
                    </li>
                  </ul>
                  <button @click="handleAction('订阅', plan.name)"
                    :class="['w-full py-2 rounded-lg font-medium transition-colors', plan.recommended ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED]' : 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED] border border-[#4A5F8B]']"
                  >
                    {{ plan.id === 2 ? '当前套餐' : '立即订阅' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 会员权益标签页 -->
      <div v-if="activeTab === 'benefits'" class="space-y-8">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">当前可用权益</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="benefit in mockMembershipData.benefits.active" :key="benefit.id" class="flex items-start p-4 bg-[#1E2532] rounded-lg">
              <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                <i :class="`fa-solid ${benefit.icon}`"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-medium text-[#B8C6D8] mb-1">{{ benefit.name }}</h4>
                <p class="text-sm text-[#B8C6D8] mb-2">{{ benefit.description }}</p>
                <div class="flex justify-between items-center">
                  <span v-if="benefit.count" class="text-xs text-[#4A5F8B] font-medium">{{ benefit.count }}本月</span>
                  <button class="text-xs px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full hover:bg-[#63B3ED] transition-colors"
                    @click="handleAction('使用', benefit.name)">
                    立即使用
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">即将解锁权益</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="benefit in mockMembershipData.benefits.upcoming" :key="benefit.id" class="flex flex-col p-4 bg-[#1E2532] rounded-lg">
              <div class="flex items-center mb-3">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                  <i :class="`fa-solid ${benefit.icon}`"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#B8C6D8]">{{ benefit.name }}</h4>
                  <span class="text-xs px-2 py-0.5 bg-[#4A5F8B]/20 text-[#B8C6D8] rounded-full">
                    LV.{{ benefit.level }}解锁
                  </span>
                </div>
              </div>
              <p class="text-sm text-[#B8C6D8] mb-3">{{ benefit.description }}</p>
              <button @click="showInfo('了解更多权益信息')" class="mt-auto py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors border border-[#4A5F8B] text-sm">
                了解更多
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 等级提升标签页 -->
      <div v-if="activeTab === 'upgrade'" class="space-y-8">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#B8C6D8] mb-6">会员成长体系</h3>
          <div class="relative">
            <div class="absolute left-6 top-0 bottom-0 w-0.5 bg-[#4A5F8B] hidden md:block"></div>
            <div class="space-y-6">
              <div v-for="(level, index) in mockMembershipData.growthSystem.levels" :key="level.level"
                :class="['flex md:items-center p-4 rounded-lg border', level.isCurrent ? 'bg-[#4A5F8B]/20 border-[#4A5F8B]' : 'bg-[#1E2532] border-[#4A5F8B]']"
              >
                <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold z-10 mb-4 md:mb-0', level.isCurrent ? 'bg-[#4A5F8B] text-white' : 'bg-[#1E2532] text-[#4A5F8B] border border-[#4A5F8B]']">
                  <i :class="`fa-solid ${level.icon}`"></i>
                </div>
                <div class="ml-4 flex-1">
                  <div class="flex flex-wrap justify-between items-center mb-1">
                    <h4 :class="['font-bold', level.isCurrent ? 'text-white' : 'text-[#B8C6D8]']">
                      LV.{{ level.level }} - {{ level.name }}
                    </h4>
                    <span class="text-sm font-medium text-[#4A5F8B]">{{ level.price }}</span>
                  </div>
                  <p class="text-sm text-[#B8C6D8]">{{ level.description }}</p>
                </div>
                <span v-if="level.isCurrent" class="ml-4 px-3 py-1 bg-[#4A5F8B] text-white text-xs rounded-full hidden md:block">
                  当前等级
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">当前等级</h3>
              <div class="flex items-center justify-center mb-4">
                <div class="w-24 h-24 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center relative">
                  <span class="text-3xl font-bold text-[#4A5F8B]">
                    LV.{{ mockMembershipData.currentPlan.level }}
                  </span>
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-[#1E2532] rounded-b-full overflow-hidden">
                    <div class="h-full bg-[#4A5F8B]" style="width: 70%"></div>
                  </div>
                </div>
              </div>
              <div class="text-center">
                <h4 class="font-medium text-[#B8C6D8] mb-1">{{ mockMembershipData.currentPlan.name }}</h4>
                <p class="text-sm text-[#B8C6D8]">距离升级还需完成以下任务</p>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2">
            <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">
                升级至 {{ mockMembershipData.nextLevel.name }}(LV.{{ mockMembershipData.nextLevel.level }})
              </h3>
              <div class="space-y-4">
                <div v-for="req in mockMembershipData.nextLevel.requirements" :key="req.id" class="p-4 bg-[#1E2532] rounded-lg">
                  <div class="flex items-center justify-between mb-2">
                    <div class="flex items-center">
                      <div :class="['w-8 h-8 rounded-full flex items-center justify-center mr-3', req.completed ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B]']">
                        <i v-if="req.completed" class="fa-solid fa-check"></i>
                        <span v-else>{{ req.id }}</span>
                      </div>
                      <span class="text-[#B8C6D8]">{{ req.name }}</span>
                    </div>
                    <span v-if="req.completed" class="px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded-full">已完成</span>
                    <span v-else class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] text-xs rounded-full border border-[#4A5F8B]">进行中</span>
                  </div>
                  <div v-if="!req.completed && req.progress !== undefined">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs text-[#B8C6D8]">进度</span>
                      <span class="text-xs text-[#4A5F8B]">{{ req.progress }}/{{ req.total }}</span>
                    </div>
                    <div class="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
                      <div class="h-full bg-[#4A5F8B]" :style="{ width: `${(req.progress / req.total) * 100}%` }"></div>
                    </div>
                    <div class="mt-2 text-right">
                      <button class="text-xs text-[#4A5F8B] hover:underline transition-colors">
                        去完成 <i class="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-6 text-center">
                <button @click="showInfo('加速升级功能即将上线')" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors shadow-md inline-flex items-center">
                  <i class="fa-solid fa-rocket mr-2"></i>加速升级
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 成长福利标签页 -->
      <div v-if="activeTab === 'growth'" class="space-y-8">
        <!-- 等级卡片 -->
        <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-lg mb-8 text-[#F5F7FA]">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div class="mb-6 md:mb-0">
              <div class="flex items-center mb-3">
                <div class="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <i class="fa-solid fa-trophy text-3xl text-[#F5F7FA]"></i>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">{{ mockMembershipData.growthBenefits.currentLevel.name }}</h2>
                  <p class="text-[#F5F7FA]/80">LV.{{ mockMembershipData.growthBenefits.currentLevel.level }}</p>
                </div>
              </div>
              <div class="w-full bg-white/20 rounded-full h-2.5 mb-2 overflow-hidden">
                <div class="h-full bg-[#4A5F8B]" :style="{ width: `${(mockMembershipData.growthBenefits.currentLevel.progress / mockMembershipData.growthBenefits.currentLevel.maxProgress) * 100}%` }"></div>
              </div>
              <div class="flex justify-between text-sm">
                <span>成长值: {{ mockMembershipData.growthBenefits.currentLevel.progress }}/{{ mockMembershipData.growthBenefits.currentLevel.maxProgress }}</span>
                <span>距离升级还需: {{ mockMembershipData.growthBenefits.currentLevel.maxProgress - mockMembershipData.growthBenefits.currentLevel.progress }}点</span>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white/20 p-4 rounded-lg text-center">
                <p class="text-3xl font-bold mb-1">{{ totalPoints }}</p>
                <p class="text-sm text-[#F5F7FA]/80">总成长值</p>
              </div>
              <div class="bg-white/20 p-4 rounded-lg text-center">
                <p class="text-3xl font-bold mb-1">{{ mockMembershipData.growthBenefits.completedTasks.length }}</p>
                <p class="text-sm text-[#F5F7FA]/80">已完成任务</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 子标签页导航 -->
        <div class="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
          <button
            v-for="subTab in growthSubTabs"
            :key="subTab.id"
            @click="activeTab = subTab.id"
            :class="['flex-1 py-3 px-4 text-center rounded-lg transition-colors', activeTab === subTab.id ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]']"
          >
            {{ subTab.name }}
          </button>
        </div>

        <!-- 成长记录 -->
        <div v-if="activeTab === 'growth'" class="space-y-8">
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">成长值记录</h3>
            <div class="space-y-4">
              <div v-for="(item, index) in mockMembershipData.growthBenefits.growthHistory" :key="index"
                class="flex items-center justify-between p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:border-2 transition-all">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
                    <i class="fa-solid fa-plus-circle"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-[#F5F7FA]">{{ item.action }}</h4>
                    <p class="text-sm text-[#B8C6D8]">{{ item.date }}</p>
                  </div>
                </div>
                <div class="text-[#6B7C93] font-bold">+{{ item.points }}</div>
              </div>
            </div>
            <div class="flex justify-center mt-6">
              <nav class="flex items-center space-x-1 bg-[#1E2532] p-2 rounded-lg border border-[#4A5F8B]">
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">1</button>
                <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
              </nav>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">升级指南</h3>
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                  <i class="fa-solid fa-chart-line"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#F5F7FA] mb-1">如何获得成长值？</h4>
                  <ul class="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                    <li>发布优质作品并获得点赞和收藏</li>
                    <li>参加摄影比赛和线上活动</li>
                    <li>完成新手任务和日常任务</li>
                    <li>邀请好友注册并活跃</li>
                    <li>发表高质量评论和互动</li>
                  </ul>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                  <i class="fa-solid fa-gift"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#F5F7FA] mb-1">升级有什么好处？</h4>
                  <ul class="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                    <li>解锁更多高级功能和特权</li>
                    <li>获得专属的徽章和标识</li>
                    <li>作品获得更多曝光和推荐机会</li>
                    <li>参与独家活动和线下聚会</li>
                    <li>获得专业摄影师的指导和点评</li>
                  </ul>
                </div>
              </div>
              <div class="flex items-start">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4 flex-shrink-0">
                  <i class="fa-solid fa-rocket"></i>
                </div>
                <div>
                  <h4 class="font-medium text-[#F5F7FA] mb-1">加速升级的技巧</h4>
                  <ul class="list-disc pl-5 space-y-1 text-sm text-[#B8C6D8]">
                    <li>保持每周至少发布1篇优质作品</li>
                    <li>积极参与社区互动，评论和点赞他人作品</li>
                    <li>加入摄影小组，与其他摄影师交流学习</li>
                    <li>参加平台组织的各类线上线下活动</li>
                    <li>分享您的作品到社交媒体，吸引更多关注</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 福利兑换 -->
        <div v-if="activeTab === 'rewards'" class="space-y-8">
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-[#F5F7FA]">可兑换福利</h3>
              <div class="flex items-center">
                <span class="text-sm text-[#B8C6D8] mr-2">显示已兑换:</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" v-model="showClaimedRewards" />
                  <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                </label>
              </div>
            </div>

            <div v-if="filteredRewards.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="reward in filteredRewards" :key="reward.id"
                :class="['bg-[#1E2532] rounded-xl overflow-hidden border transition-all hover:-translate-y-1', reward.available ? 'border-[#4A5F8B]' : 'border-[#4A5F8B]/50 opacity-80']"
              >
                <div class="relative">
                  <img :src="reward.image" :alt="reward.name" class="w-full h-36 object-cover" />
                  <div class="absolute top-3 right-3">
                    <span class="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded-full flex items-center">
                      <i class="fa-solid fa-coins mr-1"></i>
                      {{ reward.points }}
                    </span>
                  </div>
                  <div v-if="!reward.available" class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium">已兑换</span>
                  </div>
                </div>
                <div class="p-5">
                  <h4 class="font-bold text-[#F5F7FA] mb-2">{{ reward.name }}</h4>
                  <p class="text-sm text-[#B8C6D8] mb-4">{{ reward.description }}</p>
                  <div class="flex justify-between items-center">
                    <button v-if="reward.available"
                      :class="['px-4 py-2 rounded-lg font-medium transition-colors', totalPoints >= reward.points ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#63B3ED]' : 'bg-[#6B7C93] text-[#B8C6D8] cursor-not-allowed']"
                      :disabled="totalPoints < reward.points"
                    >
                      立即兑换
                    </button>
                    <span v-else class="text-sm text-[#B8C6D8]">兑换时间: 2023-10-15</span>
                    <div :class="['text-sm font-medium', totalPoints >= reward.points && reward.available ? 'text-[#4A5F8B]' : 'text-[#ED8936]']">
                      <span v-if="reward.available && totalPoints < reward.points">还需{{ reward.points - totalPoints }}点</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="p-8 text-center">
              <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                <i class="fa-solid fa-gift text-2xl"></i>
              </div>
              <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无可用福利</h3>
              <p class="text-sm text-[#B8C6D8]">继续活跃获取更多成长值，解锁更多福利</p>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">兑换记录</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-[#4A5F8B]">
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">福利名称</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">消耗积分</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">兑换时间</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">状态</th>
                    <th class="px-4 py-3 text-left text-sm font-medium text-[#F5F7FA]">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-b border-[#4A5F8B]">
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">基础后期预设包</td>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">50</td>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">2023-10-10</td>
                    <td class="px-4 py-4">
                      <span class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                    </td>
                    <td class="px-4 py-4">
                      <button class="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
                    </td>
                  </tr>
                  <tr>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">RAW素材下载券</td>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">80</td>
                    <td class="px-4 py-4 text-sm text-[#B8C6D8]">2023-09-25</td>
                    <td class="px-4 py-4">
                      <span class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span>
                    </td>
                    <td class="px-4 py-4">
                      <button class="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 任务中心 -->
        <div v-if="activeTab === 'tasks'" class="space-y-8">
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">进行中任务</h3>
            <div class="space-y-4">
              <div v-for="task in mockMembershipData.growthBenefits.ongoingTasks" :key="task.id" class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex items-start">
                    <div class="w-8 h-8 rounded-full bg-[#1E2532] text-[#4A5F8B] border border-[#4A5F8B] flex items-center justify-center mr-3 flex-shrink-0">
                      <i class="fa-solid fa-spinner fa-spin"></i>
                    </div>
                    <div>
                      <h4 class="font-medium text-[#F5F7FA]">{{ task.name }}</h4>
                      <p class="text-sm text-[#B8C6D8] mt-1">{{ task.description }}</p>
                    </div>
                  </div>
                  <div class="text-[#4A5F8B] font-bold flex items-center">
                    <i class="fa-solid fa-coins mr-1"></i>
                    {{ task.points }}
                  </div>
                </div>
                <div>
                  <div class="flex justify-between items-center mb-1">
                    <span class="text-xs text-[#B8C6D8]">进度</span>
                    <span class="text-xs text-[#4A5F8B]">{{ task.progress }}/{{ task.total }}</span>
                  </div>
                  <div class="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden border border-[#4A5F8B]">
                    <div class="h-full bg-[#4A5F8B]" :style="{ width: `${(task.progress / task.total) * 100}%` }"></div>
                  </div>
                  <div class="mt-2 text-right">
                    <button @click="showInfo('去完成任务')" class="text-xs text-[#4A5F8B] hover:underline transition-colors">
                      去完成 <i class="fa-solid fa-arrow-right ml-1 text-[10px]"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">已完成任务</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="task in mockMembershipData.growthBenefits.completedTasks" :key="task.id" class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
                    <i class="fa-solid fa-check"></i>
                  </div>
                  <div>
                    <h4 class="font-medium text-[#F5F7FA]">{{ task.name }}</h4>
                    <p class="text-sm text-[#B8C6D8]">{{ task.description }}</p>
                  </div>
                </div>
                <div class="text-[#4A5F8B] font-bold">+{{ task.points }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 会员推荐奖励 -->
        <div v-if="activeTab === 'referral'" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">推荐奖励计划</h3>
            <p class="text-sm text-[#B8C6D8] mb-6">邀请好友加入会员，您和好友都能获得丰厚奖励</p>
            <div class="bg-[#1E2532] rounded-lg p-4 mb-6">
              <h4 class="text-md font-medium text-[#B8C6D8] mb-3">我的邀请码</h4>
              <div class="flex items-center justify-between bg-[#2D3748] p-3 rounded-lg">
                <span class="font-mono text-[#B8C6D8]">{{ mockMembershipData.growthSystem.referralProgram.currentUser.referralCode }}</span>
                <button class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#63B3ED] transition-colors text-sm" @click="copyReferralCode">
                  复制
                </button>
              </div>
            </div>
            <div class="bg-[#1E2532] rounded-lg p-4 mb-6">
              <h4 class="text-md font-medium text-[#B8C6D8] mb-3">我的邀请链接</h4>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between bg-[#2D3748] p-3 rounded-lg space-y-3 sm:space-y-0">
                <span class="font-mono text-[#B8C6D8] text-sm truncate flex-1">
                  {{ mockMembershipData.growthSystem.referralProgram.currentUser.referralLink }}
                </span>
                <button class="px-3 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#63B3ED] transition-colors text-sm whitespace-nowrap" @click="copyReferralLink">
                  复制链接
                </button>
              </div>
            </div>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-sm text-[#B8C6D8]">总邀请人数</span>
                <span class="font-medium text-[#4A5F8B]">{{ mockMembershipData.growthSystem.referralProgram.currentUser.totalInvites }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-[#B8C6D8]">成功开通会员</span>
                <span class="font-medium text-[#4A5F8B]">{{ mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-[#B8C6D8]">待确认邀请</span>
                <span class="font-medium text-[#4A5F8B]">{{ mockMembershipData.growthSystem.referralProgram.currentUser.pendingInvites }}</span>
              </div>
            </div>
            <div class="mt-6">
              <h4 class="text-md font-medium text-[#B8C6D8] mb-3">已获得奖励</h4>
              <div class="space-y-3">
                <div v-for="reward in mockMembershipData.growthSystem.referralProgram.currentUser.rewards" :key="reward.id" class="flex justify-between items-center p-3 bg-[#1E2532] rounded-lg">
                  <div>
                    <span class="text-sm text-[#B8C6D8]">{{ reward.name }}</span>
                    <span v-if="reward.date" class="text-xs text-[#6B7C93] ml-2">({{ reward.date }})</span>
                  </div>
                  <span :class="['px-2 py-1 text-xs rounded-full', reward.status === '已获得' ? 'bg-[#4A5F8B]/20 text-[#4A5F8B]' : 'bg-[#6B7C93]/20 text-[#6B7C93]']">
                    {{ reward.status }} <span v-if="reward.requirement">({{ reward.requirement }})</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <h3 class="text-lg font-bold text-[#B8C6D8] mb-4">奖励等级</h3>
            <div class="space-y-6">
              <div v-for="(tier, index) in mockMembershipData.growthSystem.referralProgram.rewardTiers" :key="index"
                :class="['flex items-center justify-between p-4 rounded-lg border', index < mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites ? 'bg-[#4A5F8B]/20 border-[#4A5F8B]' : 'bg-[#1E2532] border-[#4A5F8B]']"
              >
                <div class="flex items-center">
                  <div :class="['w-10 h-10 rounded-full flex items-center justify-center text-white mr-4', index < mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites ? 'bg-[#4A5F8B]' : 'bg-[#1E2532] border border-[#4A5F8B]']">
                    {{ tier.invites }}
                  </div>
                  <div>
                    <h4 :class="['font-medium', index < mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites ? 'text-white' : 'text-[#B8C6D8]']">
                      邀请{{ mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites >= tier.invites ? '已完成' : `${tier.invites}位好友` }}
                    </h4>
                    <p class="text-sm text-[#B8C6D8]">{{ tier.reward }}</p>
                    <p class="text-xs text-[#6B7C93]">{{ tier.description }}</p>
                  </div>
                </div>
                <span v-if="index < mockMembershipData.growthSystem.referralProgram.currentUser.successfulInvites" class="text-[#4A5F8B]">
                  <i class="fa-solid fa-check-circle text-lg"></i>
                </span>
              </div>
            </div>
            <div class="mt-6">
              <h4 class="text-md font-medium text-[#B8C6D8] mb-3">分享邀请</h4>
              <div class="flex justify-center space-x-4 mb-4">
                <button @click="shareToSocial('wechat')" class="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors">
                  <i class="fa-brands fa-weixin"></i>
                </button>
                <button @click="shareToSocial('weibo')" class="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors">
                  <i class="fa-brands fa-weibo"></i>
                </button>
                <button @click="shareToSocial('qq')" class="w-10 h-10 rounded-full bg-[#4A5F8B] flex items-center justify-center text-[#F5F7FA] hover:bg-[#63B3ED] transition-colors">
                  <i class="fa-brands fa-qq"></i>
                </button>
              </div>
              <button @click="handleShare" class="w-full py-3 bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] text-white rounded-lg font-medium hover:from-[#6B7C93] hover:to-[#4A5F8B] transition-all shadow-md flex items-center justify-center">
                <i class="fa-solid fa-share-alt mr-2"></i>立即分享邀请
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 账单管理标签页 -->
      <div v-if="activeTab === 'billing'" class="space-y-8">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#B8C6D8]">支付方式</h3>
            <button @click="showInfo('添加支付方式功能即将上线')" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors border border-[#4A5F8B] text-sm">
              添加支付方式
            </button>
          </div>
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-[#1E2532] rounded-lg border-2 border-[#4A5F8B]">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-4">
                  <i class="fa-credit-card"></i>
                </div>
                <div>
                  <p class="font-medium text-[#B8C6D8]">支付宝</p>
                  <p class="text-sm text-[#B8C6D8]">默认支付方式</p>
                </div>
              </div>
              <button class="text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors">
                <i class="fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#B8C6D8] mb-6">交易记录</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-[#4A5F8B]">
                  <th class="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">订单号</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">服务</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">金额</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">日期</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">状态</th>
                  <th class="px-4 py-3 text-left text-sm font-medium text-[#B8C6D8]">操作</th>
                </tr>
              </thead>
              <tbody>
                <tr class="border-b border-[#4A5F8B]">
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">#20230615001</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">银河会员·年卡</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">¥299.00</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">2023-06-15</td>
                  <td class="px-4 py-4"><span class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span></td>
                  <td class="px-4 py-4"><button class="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button></td>
                </tr>
                <tr class="border-b border-[#4A5F8B]">
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">#20230515002</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">银河会员·月卡</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">¥39.00</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">2023-05-15</td>
                  <td class="px-4 py-4"><span class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span></td>
                  <td class="px-4 py-4"><button class="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button></td>
                </tr>
                <tr>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">#20230415003</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">银河会员·月卡</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">¥39.00</td>
                  <td class="px-4 py-4 text-sm text-[#B8C6D8]">2023-04-15</td>
                  <td class="px-4 py-4"><span class="px-2 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs">已完成</span></td>
                  <td class="px-4 py-4"><button class="text-sm text-[#4A5F8B] hover:underline transition-colors">查看详情</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-center mt-6">
            <nav class="flex items-center space-x-1 bg-[#1E2532] p-2 rounded-lg border border-[#4A5F8B]">
              <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button class="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">1</button>
              <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- 会员活动日历 -->
      <div v-if="activeTab === 'calendar'" class="space-y-8">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-[#B8C6D8]">会员活动日历</h3>
            <div class="flex space-x-2">
              <button class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                @click="currentMonth = Math.max(1, currentMonth - 1)">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <span class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-lg">2023年{{ currentMonth }}月</span>
              <button class="px-3 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                @click="currentMonth = Math.min(12, currentMonth + 1)">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-7 gap-2 mb-6">
            <div v-for="day in ['日', '一', '二', '三', '四', '五', '六']" :key="day" class="text-center py-2 text-sm font-medium text-[#4A5F8B]">
              {{ day }}
            </div>
            <div v-for="i in 4" :key="'empty-' + i" class="p-2 h-16"></div>
            <div v-for="day in 30" :key="day"
              :class="['p-2 h-16 rounded-lg border transition-colors relative', [10, 15, 20, 25].includes(day) ? 'border-[#4A5F8B] bg-[#4A5F8B]/10 cursor-pointer hover:bg-[#4A5F8B]/20' : 'border-transparent hover:border-[#4A5F8B] hover:bg-[#1E2532]']"
            >
              <div class="text-center font-medium text-[#B8C6D8]">{{ day }}</div>
              <div v-if="[10, 15, 20, 25].includes(day)" class="absolute bottom-1 left-1 right-1 h-1 bg-[#4A5F8B] rounded-full"></div>
            </div>
          </div>

          <div>
            <h4 class="text-md font-medium text-[#B8C6D8] mb-4">近期活动</h4>
            <div class="space-y-4">
              <div v-for="event in mockMembershipData.growthSystem.events" :key="event.id"
                class="flex items-start p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] cursor-pointer hover:translate-x-1 transition-transform"
              >
                <div class="w-12 h-12 rounded-lg bg-[#4A5F8B] text-white flex flex-col items-center justify-center mr-4 flex-shrink-0">
                  <span class="text-lg font-bold">{{ event.date.split('-')[2] }}</span>
                  <span class="text-xs">11月</span>
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-start mb-1">
                    <h5 class="font-medium text-[#B8C6D8]">{{ event.title }}</h5>
                    <span :class="['px-2 py-0.5 text-xs rounded-full', event.type === '线下活动' ? 'bg-[#4A5F8B]/20 text-[#4A5F8B]' : 'bg-[#6B7C93]/20 text-[#6B7C93]']">
                      {{ event.type }}
                    </span>
                  </div>
                  <div class="flex items-center text-sm text-[#B8C6D8]">
                    <i class="fa-solid fa-map-marker-alt mr-2 text-[#4A5F8B]"></i>
                    {{ event.location }}
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 text-center">
              <button @click="showInfo('查看全部活动')" class="inline-flex items-center text-sm text-[#4A5F8B] hover:underline transition-colors">
                <span>查看全部活动</span>
                <i class="fa-solid fa-chevron-right ml-1 text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 会员专属客服聊天弹窗 -->
    <Teleport to="body">
      <div v-if="showChatModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-[#1E2532] rounded-xl border border-[#4A5F8B] w-full max-w-md">
          <div class="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
            <h3 class="font-bold text-[#B8C6D8] flex items-center">
              <i class="fa-solid fa-headset mr-2"></i>会员专属客服
            </h3>
            <button class="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors" @click="showChatModal = false">
              <i class="fa-solid fa-times"></i>
            </button>
          </div>
          <div class="p-4 max-h-[400px] overflow-y-auto">
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="w-8 h-8 rounded-full bg-[#4A5F8B] flex items-center justify-center text-white mr-2 flex-shrink-0">
                  <i class="fa-solid fa-headset"></i>
                </div>
                <div class="bg-[#2D3748] p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p class="text-sm text-[#B8C6D8]">您好！我是您的专属客服，有什么可以帮助您的吗？</p>
                </div>
              </div>
            </div>
          </div>
          <div class="p-4 border-t border-[#4A5F8B]">
            <div class="flex space-x-2">
              <input
                type="text"
                v-model="newNote"
                placeholder="输入您的问题..."
                class="flex-1 px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <button class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#63B3ED] transition-colors" @click="sendChatMessage">
                发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInteraction } from '@/composables/useInteraction'

const { showSuccess, showInfo, showWarning, handleCopy, handleAction, handleShare } = useInteraction()

const mockMembershipData = {
  currentPlan: {
    name: "银河会员·年卡",
    level: "3",
    startDate: "2023-06-15",
    endDate: "2024-06-15",
    daysLeft: 128,
    price: "299",
    paymentFrequency: "年付"
  },
  nextLevel: {
    name: "星云会员",
    level: "4",
    requirements: [
      { id: 1, name: "连续开通会员6个月", completed: true },
      { id: 2, name: "发布10篇优质作品", completed: true },
      { id: 3, name: "获得500个收藏", completed: false, progress: 342, total: 500 },
      { id: 4, name: "拥有100个粉丝", completed: false, progress: 72, total: 100 }
    ]
  },
  benefits: {
    active: [
      { id: 1, name: "免费RAW素材下载", description: "每月可下载10个高质量RAW素材", icon: "fa-file-image", count: "10/10" },
      { id: 2, name: "赛事优先报名", description: "热门赛事提前3天报名资格", icon: "fa-trophy", count: null },
      { id: 3, name: "专属后期预设包", description: "10个专业摄影后期预设", icon: "fa-sliders-h", count: null },
      { id: 4, name: "免费在线课程", description: "每月2门会员专属摄影课程", icon: "fa-graduation-cap", count: "2/2" },
      { id: 5, name: "作品优先推荐", description: "作品在首页推荐几率提升50%", icon: "fa-star", count: null },
      { id: 6, name: "无水印导出", description: "在线编辑工具支持无水印导出", icon: "fa-image", count: null },
      { id: 7, name: "会员专属客服", description: "优先的技术支持通道，24小时响应", icon: "fa-headset", count: null }
    ],
    upcoming: [
      { id: 1, name: "专属客服通道", description: "1对1专属客服咨询服务", icon: "fa-headset", level: 4 },
      { id: 2, name: "器材租赁优惠", description: "专业摄影器材租赁9折优惠", icon: "fa-video", level: 4 },
      { id: 3, name: "线下活动免费", description: "每月1次免费参与线下摄影活动", icon: "fa-calendar-check", level: 5 }
    ]
  },
  availablePlans: [
    { id: 1, name: "月卡", price: "39", period: "1个月", features: ["全部基础功能", "每月5个素材", "在线客服", "会员专属标识"] },
    { id: 2, name: "年卡", price: "299", period: "13个月", features: ["全部基础功能", "每月10个素材", "优先报名", "专属预设包", "免费课程", "作品优先推荐", "无水印导出", "会员专属客服"], recommended: true },
    { id: 3, name: "终身卡", price: "1999", period: "终身", features: ["全部高级功能", "无限素材下载", "专属客服", "器材租赁8折", "免费线下活动", "专属标识"] }
  ],
  usageStats: {
    "素材下载": { used: 8, total: 10 },
    "课程学习": { used: 2, total: 2 },
    "赛事报名": { used: 3, total: 10 },
    "预设使用": { used: 5, total: 10 }
  },
  growthSystem: {
    levels: [
      { level: 1, name: "入门会员", price: "免费", description: "基础功能访问权限，每月3个素材", icon: "fa-user", isCurrent: false },
      { level: 2, name: "进阶会员", price: "¥19/月", description: "扩展功能访问，每月5个素材", icon: "fa-user-plus", isCurrent: false },
      { level: 3, name: "银河会员", price: "¥39/月", description: "您当前的等级，每月10个素材，优先报名资格", icon: "fa-user-tie", isCurrent: true },
      { level: 4, name: "星云会员", price: "¥59/月", description: "高级功能访问，每月15个素材，专属客服", icon: "fa-user-edit", isCurrent: false },
      { level: 5, name: "宇宙会员", price: "¥99/月", description: "全部高级功能，无限素材下载，器材租赁优惠", icon: "fa-user-crown", isCurrent: false },
      { level: 6, name: "至尊会员", price: "¥199/月", description: "顶级会员特权，专属线下活动，一对一导师指导", icon: "fa-crown", isCurrent: false }
    ],
    exclusiveContent: [
      { id: 1, title: "风光摄影大师班", description: "由国际获奖摄影师亲自授课，学习专业风光拍摄技巧", image: "https://picsum.photos/1280/720?random=57" },
      { id: 2, title: "高级后期修图工作流", description: "从RAW到成品的完整修图流程，掌握专业调色技巧", image: "https://picsum.photos/1280/720?random=58" },
      { id: 3, title: "商业摄影实战指南", description: "学习商业摄影的布光、构图和客户沟通技巧", image: "https://picsum.photos/1280/720?random=59" }
    ],
    events: [
      { id: 1, title: "会员专属摄影沙龙·上海站", date: "2023-11-15", location: "上海·静安区", type: "线下活动" },
      { id: 2, title: "后期修图大师直播课", date: "2023-11-10", location: "线上直播", type: "线上活动" },
      { id: 3, title: "器材体验会·深圳站", date: "2023-11-20", location: "深圳·南山区", type: "线下活动" },
      { id: 4, title: "摄影大赛启动仪式", date: "2023-11-25", location: "线上直播", type: "线上活动" }
    ],
    usageChartData: [
      { name: "素材下载", used: 8, total: 10 },
      { name: "课程学习", used: 2, total: 2 },
      { name: "赛事报名", used: 3, total: 10 },
      { name: "预设使用", used: 5, total: 10 },
      { name: "客服咨询", used: 1, total: 3 }
    ],
    referralProgram: {
      currentUser: {
        referralCode: "PHOTOMASTER2023",
        referralLink: "https://photoshare.com/invite/PHOTOMASTER2023",
        totalInvites: 3,
        successfulInvites: 2,
        pendingInvites: 1,
        rewards: [
          { id: 1, name: "会员延长1个月", status: "已获得", date: "2023-09-15" },
          { id: 2, name: "RAW素材包1个", status: "已获得", date: "2023-10-02" },
          { id: 3, name: "高级预设包", status: "未获得", requirement: "再邀请1位好友" }
        ]
      },
      rewardTiers: [
        { invites: 1, reward: "RAW素材包1个", description: "包含20个高质量RAW格式风景照片素材" },
        { invites: 2, reward: "会员延长1个月", description: "当前会员有效期额外延长30天" },
        { invites: 5, reward: "高级预设包", description: "50个专业摄影后期Lightroom预设" },
        { invites: 10, reward: "线下活动免费券", description: "可免费参加1次平台组织的线下摄影活动" },
        { invites: 20, reward: "器材租赁8折券", description: "专业摄影器材租赁享受8折优惠" },
        { invites: 50, reward: "年度会员免费", description: "赠送一年高级会员资格" }
      ]
    }
  },
  growthBenefits: {
    currentLevel: { name: '新锐摄影师', level: 3, progress: 120, maxProgress: 200, joinDate: '2023-03-15' },
    growthHistory: [
      { date: '2023-10-25', action: '发布作品获得收藏', points: 15 },
      { date: '2023-10-22', action: '参加摄影比赛', points: 30 },
      { date: '2023-10-18', action: '作品获得点赞', points: 5 },
      { date: '2023-10-15', action: '完成新手任务', points: 20 },
      { date: '2023-10-10', action: '发布作品获得收藏', points: 10 },
      { date: '2023-10-05', action: '邀请好友注册', points: 20 },
    ],
    availableRewards: [
      { id: 'r1', name: '基础后期预设包', description: '10个专业摄影后期预设', points: 50, image: 'https://picsum.photos/400/400?random=60', available: true },
      { id: 'r2', name: 'RAW素材下载券', description: '5个高质量RAW素材下载权限', points: 80, image: 'https://picsum.photos/400/400?random=61', available: true },
      { id: 'r3', name: '摄影课程折扣券', description: '线上摄影课程8折优惠', points: 100, image: 'https://picsum.photos/400/400?random=62', available: true },
      { id: 'r4', name: '高级会员体验卡', description: '7天高级会员免费体验', points: 150, image: 'https://picsum.photos/400/400?random=63', available: true },
      { id: 'r5', name: '专业器材租赁券', description: '专业相机镜头租赁一天免费', points: 200, image: 'https://picsum.photos/400/400?random=64', available: false },
      { id: 'r6', name: '线下活动免费券', description: '免费参加一次线下摄影活动', points: 250, image: 'https://picsum.photos/400/400?random=65', available: false },
    ],
    completedTasks: [
      { id: 't1', name: '完善个人资料', description: '上传头像并填写个人简介', points: 10, completed: true },
      { id: 't2', name: '发布第一篇作品', description: '上传并发布您的第一篇摄影作品', points: 20, completed: true },
      { id: 't3', name: '关注5位摄影师', description: '关注5位您感兴趣的摄影师', points: 15, completed: true },
      { id: 't4', name: '收藏10篇作品', description: '收藏10篇您喜欢的摄影作品', points: 10, completed: true },
    ],
    ongoingTasks: [
      { id: 't5', name: '参加摄影比赛', description: '提交作品参加一次摄影比赛', points: 30, progress: 0, total: 1, completed: false },
      { id: 't6', name: '作品获得100赞', description: '您的作品累计获得100个点赞', points: 25, progress: 72, total: 100, completed: false },
      { id: 't7', name: '发布5篇优质作品', description: '上传并发布5篇获得推荐的优质作品', points: 50, progress: 2, total: 5, completed: false },
      { id: 't8', name: '邀请3位好友', description: '邀请3位好友注册并完成认证', points: 30, progress: 1, total: 3, completed: false },
    ]
  }
}

const COLORS = ['#4A5F8B', '#6B7C93', '#38B2AC', '#68D391', '#B8C6D8']

const activeTab = ref("overview")
const currentMonth = ref(11)
const showChatModal = ref(false)
const newNote = ref("")
const showClaimedRewards = ref(false)

const mainTabs = [
  { id: 'overview', name: '总览' },
  { id: 'benefits', name: '会员权益' },
  { id: 'upgrade', name: '等级提升' },
  { id: 'growth', name: '成长福利' },
  { id: 'billing', name: '账单管理' },
  { id: 'calendar', name: '活动日历' },
]

const growthSubTabs = [
  { id: 'growth', name: '成长记录' },
  { id: 'rewards', name: '福利兑换' },
  { id: 'tasks', name: '任务中心' },
  { id: 'referral', name: '推荐奖励' },
]

const totalPoints = computed(() =>
  mockMembershipData.growthBenefits.growthHistory.reduce((sum, item) => sum + item.points, 0)
)

const filteredRewards = computed(() => {
  return mockMembershipData.growthBenefits.availableRewards.filter(reward => {
    if (showClaimedRewards.value) return true
    return reward.available
  })
})

const usageStatsEntries = computed(() => Object.entries(mockMembershipData.usageStats))

const pieData = computed(() => {
  const totalUsed = mockMembershipData.growthSystem.usageChartData.reduce((sum, item) => sum + item.used, 0)
  return mockMembershipData.growthSystem.usageChartData.map(item => ({
    name: item.name,
    used: item.used,
    fullValue: item.total,
    percent: totalUsed > 0 ? (item.used / totalUsed) * 100 : 0
  }))
})

const pieOffsets = computed(() => {
  let accumulated = 25
  return pieData.value.map((slice, idx) => {
    const offset = accumulated
    accumulated -= slice.percent
    return offset
  })
})

const copyReferralCode = () => {
  navigator.clipboard.writeText(mockMembershipData.growthSystem.referralProgram.currentUser.referralCode)
  handleCopy()
}

const copyReferralLink = () => {
  navigator.clipboard.writeText(mockMembershipData.growthSystem.referralProgram.currentUser.referralLink)
  handleCopy()
}

const shareToSocial = (platform: string) => {
  const url = mockMembershipData.growthSystem.referralProgram.currentUser.referralLink
  const text = `加入摄影社区，使用我的邀请码 ${mockMembershipData.growthSystem.referralProgram.currentUser.referralCode} 注册，我们都能获得奖励！`
  switch (platform) {
    case 'wechat':
      showInfo("请手动分享到微信")
      break
    case 'weibo':
      window.open(`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank')
      break
    case 'qq':
      window.open(`https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank')
      break
  }
}

const sendChatMessage = () => {
  if (newNote.value.trim()) {
    showSuccess("消息已发送，客服将尽快回复")
    newNote.value = ""
  } else {
    showWarning("请输入您的问题")
  }
}

const handleRenew = () => {
  showInfo("即将跳转到续费页面")
  setTimeout(() => window.location.href = `/membership/pay?level=${mockMembershipData.currentPlan.level}`, 800)
}

const handleUpgrade = () => {
  showInfo("即将跳转到升级页面")
  setTimeout(() => window.location.href = `/membership/pay?level=${mockMembershipData.currentPlan.level}`, 800)
}
</script>