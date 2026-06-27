<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的账号设置和隐私偏好</p>
      <router-link to="/login" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors">立即登录</router-link>
    </div>

    <template v-else>
      <div>
        <div class="mb-6">
          <router-link to="/profile" class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors">
            <i class="fa-solid fa-arrow-left"></i>
            <span>返回个人主页</span>
          </router-link>
        </div>

        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">个人中心</h1>
          <p class="text-[#B8C6D8] max-w-2xl mx-auto">管理您的账号信息、隐私设置和通知偏好</p>
        </div>

        <div class="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="['flex-1 py-3 px-4 text-center rounded-lg transition-colors', activeTab === tab.id ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]']">{{ tab.label }}</button>
        </div>

        <Transition name="slide-down">
          <div v-if="showSuccessToast" class="fixed top-4 right-4 bg-[#4A5F8B] text-[#F5F7FA] px-4 py-3 rounded-lg shadow-lg z-50 flex items-center">
            <i class="fa-solid fa-check-circle mr-2"></i>
            <span>保存成功！</span>
          </div>
        </Transition>

        <div v-if="activeTab === 'account'" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">个人信息</h3>
            <button @click="isEditing = !isEditing" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] mt-3 md:mt-0">{{ isEditing ? '取消' : '编辑' }}</button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 class="text-sm font-medium text-[#F5F7FA] mb-4">头像设置</h4>
              <div class="flex flex-col items-center mb-8">
                <div class="relative mb-4">
                  <div class="w-32 h-32 rounded-full border-4 border-[#B8C6D8] overflow-hidden shadow-md">
                    <img :src="formData.avatar" alt="User avatar" class="w-full h-full object-cover" />
                  </div>
                  <div v-if="isEditing" class="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors" @click="triggerFileInput('avatar')"><i class="fa-solid fa-camera"></i></div>
                </div>
                <button v-if="isEditing" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm" @click="triggerFileInput('avatar')">更换头像</button>
                <div v-if="isUploading && avatarFile" class="w-full mt-2">
                  <div class="flex justify-between items-center text-xs text-[#B8C6D8] mb-1"><span>上传头像...</span><span>{{ uploadProgress }}%</span></div>
                  <div class="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden"><div class="h-full bg-[#4A5F8B]" :style="{ width: `${uploadProgress}%` }"></div></div>
                </div>
              </div>
              <h4 class="text-sm font-medium text-[#F5F7FA] mb-4">封面设置</h4>
              <div class="relative mb-4">
                <div class="h-40 rounded-lg overflow-hidden border-2 border-[#B8C6D8]">
                  <img :src="formData.coverImage" alt="Cover image" class="w-full h-full object-cover" />
                </div>
                <div v-if="isEditing" class="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#4A5F8B] text-[#F5F7FA] flex items-center justify-center cursor-pointer hover:bg-[#6B7C93] transition-colors" @click="triggerFileInput('cover')"><i class="fa-solid fa-camera"></i></div>
              </div>
              <button v-if="isEditing" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm" @click="triggerFileInput('cover')">更换封面</button>
              <div v-if="isUploading && coverFile" class="w-full mt-2">
                <div class="flex justify-between items-center text-xs text-[#B8C6D8] mb-1"><span>上传封面...</span><span>{{ uploadProgress }}%</span></div>
                <div class="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden"><div class="h-full bg-[#4A5F8B]" :style="{ width: `${uploadProgress}%` }"></div></div>
              </div>
              <input ref="avatarInputRef" type="file" accept="image/*" class="hidden" @change="e => handleFileSelect('avatar', e)" />
              <input ref="coverInputRef" type="file" accept="image/*" class="hidden" @change="e => handleFileSelect('cover', e)" />
            </div>
            <div class="space-y-6">
              <div>
                <label for="username" class="block text-sm font-medium text-[#F5F7FA] mb-1">用户名</label>
                <input id="username" v-model="formData.username" :disabled="!isEditing" :class="['w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all', !isEditing ? 'cursor-not-allowed' : '']" />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-[#F5F7FA] mb-1">电子邮箱</label>
                <input id="email" v-model="formData.email" :disabled="!isEditing" :class="['w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all', !isEditing ? 'cursor-not-allowed' : '']" />
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-[#F5F7FA] mb-1">手机号码</label>
                <input id="phone" v-model="formData.phone" :disabled="!isEditing" :class="['w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all', !isEditing ? 'cursor-not-allowed' : '']" />
              </div>
              <div>
                <label for="bio" class="block text-sm font-medium text-[#F5F7FA] mb-1">个人简介</label>
                <textarea id="bio" v-model="formData.bio" :disabled="!isEditing" rows="3" :class="['w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none', !isEditing ? 'cursor-not-allowed' : '']" />
              </div>
              <div>
                <label for="location" class="block text-sm font-medium text-[#F5F7FA] mb-1">所在地区</label>
                <input id="location" v-model="formData.location" :disabled="!isEditing" :class="['w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all', !isEditing ? 'cursor-not-allowed' : '']" />
              </div>
              <div>
                <label for="website" class="block text-sm font-medium text-[#F5F7FA] mb-1">个人网站</label>
                <input id="website" v-model="formData.website" :disabled="!isEditing" :class="['w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all', !isEditing ? 'cursor-not-allowed' : '']" />
              </div>
              <div v-if="isEditing" class="flex justify-end mt-4">
                <button @click="handleSaveAccount" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存更改</button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'orders'" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#F5F7FA] mb-6">我的订单</h3>
          <div class="space-y-4">
            <div v-for="order in mockOrders" :key="order.id" class="bg-[#1E2532] rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-[#B8C6D8]">订单号: {{ order.id }}</span>
                  <span :class="['px-2 py-1 text-xs rounded', order.status === '已完成' ? 'bg-green-500/20 text-green-400' : order.status === '进行中' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400']">{{ order.status }}</span>
                </div>
                <div class="text-sm text-[#F5F7FA] mb-1">{{ order.details }}</div>
                <div class="text-xs text-[#B8C6D8]">{{ order.date }}</div>
              </div>
              <div class="mt-2 md:mt-0"><span class="text-lg font-bold text-[#F5F7FA]">{{ order.amount }}</span></div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'notifications'" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">通知</h3>
            <div class="flex space-x-2">
              <button @click="selectAllNotifications" class="px-3 py-1.5 bg-[#1E2532] text-[#B8C6D8] rounded-lg text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">{{ selectedNotificationIds.length === mockNotifications.length ? '取消全选' : '全选' }}</button>
              <button @click="markNotificationsAsRead" class="px-3 py-1.5 bg-[#1E2532] text-[#B8C6D8] rounded-lg text-sm hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">标记已读</button>
              <button v-if="selectedNotificationIds.length > 0" @click="deleteSelectedNotifications" class="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/40 transition-colors">删除选中</button>
            </div>
          </div>
          <div class="space-y-3">
            <div v-for="notification in mockNotifications" :key="notification.id" :class="['bg-[#1E2532] rounded-lg p-4 flex items-start space-x-3', !notification.read ? 'border-l-4 border-[#4A5F8B]' : '']">
              <input type="checkbox" :checked="selectedNotificationIds.includes(notification.id)" @change="toggleNotificationSelect(notification.id)" class="mt-1" />
              <div :class="['w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', notification.type === 'like' ? 'bg-red-500/20 text-red-400' : notification.type === 'comment' ? 'bg-blue-500/20 text-blue-400' : notification.type === 'follow' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400']">
                <i v-if="notification.type === 'like'" class="fa-solid fa-heart"></i>
                <i v-else-if="notification.type === 'comment'" class="fa-solid fa-comment"></i>
                <i v-else-if="notification.type === 'follow'" class="fa-solid fa-user-plus"></i>
                <i v-else class="fa-solid fa-bell"></i>
              </div>
              <div class="flex-1">
                <p class="text-sm text-[#F5F7FA]">{{ notification.content }}</p>
                <span class="text-xs text-[#B8C6D8]">{{ notification.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'privacy'" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">隐私设置</h3>
            <button @click="handleSaveSettings" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存设置</button>
          </div>
          <div class="space-y-6">
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">个人资料可见性</h4>
              <div class="space-y-4">
                <div v-for="item in privacyItems" :key="item.key" class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">{{ item.label }}</label>
                    <p class="text-xs text-[#B8C6D8]">{{ item.desc }}</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" :checked="privacySettings[item.key as keyof typeof privacySettings]" @change="e => handlePrivacyChange(item.key as any, (e.target as HTMLInputElement).checked)" />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                  </label>
                </div>
              </div>
            </div>
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">个人信息展示</h4>
              <div class="space-y-4">
                <div v-for="item in infoDisplayItems" :key="item.key" class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">{{ item.label }}</label>
                    <p class="text-xs text-[#B8C6D8]">{{ item.desc }}</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" :checked="privacySettings[item.key as keyof typeof privacySettings]" @change="e => handlePrivacyChange(item.key as any, (e.target as HTMLInputElement).checked)" />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'preferences'" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-[#F5F7FA]">偏好设置</h3>
            <button @click="handleSaveSettings" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">保存设置</button>
          </div>
          <div class="space-y-6">
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">界面设置</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-[#F5F7FA] mb-1">主题偏好</label>
                  <select v-model="preferences.theme" class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                    <option value="dark">深色模式</option>
                    <option value="light">浅色模式</option>
                    <option value="system">跟随系统</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#F5F7FA] mb-1">语言</label>
                  <select v-model="preferences.language" class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                    <option value="zh-CN">简体中文</option>
                    <option value="en-US">English (US)</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-[#F5F7FA] mb-1">默认首页</label>
                  <select v-model="preferences.defaultTab" class="w-full px-4 py-3 bg-[#B8C6D8] border border-[#4A5F8B] text-[#2D3748] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                    <option value="feed">推荐动态</option>
                    <option value="explore">发现作品</option>
                    <option value="profile">个人主页</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">通知设置</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="item in notifItems" :key="item.key" class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">{{ item.label }}</label>
                    <p class="text-xs text-[#B8C6D8]">{{ item.desc }}</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" class="sr-only peer" :checked="preferences.notifications[item.key as keyof typeof preferences.notifications]" @change="e => handleNotificationChange(item.key as any, (e.target as HTMLInputElement).checked)" />
                    <div class="w-9 h-5 bg-[#1E2532] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4A5F8B]"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'security'" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold text-[#F5F7FA] mb-6">安全设置</h3>
          <div class="space-y-6">
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">账号安全</h4>
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-[#F5F7FA] mb-1">修改密码</label>
                  <p class="text-xs text-[#B8C6D8]">定期更换密码以保障账号安全</p>
                </div>
                <button @click="showPasswordModal = true" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">修改</button>
              </div>
            </div>
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">登录记录</h4>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[#B8C6D8]">上次登录时间</span>
                  <span class="text-sm text-[#F5F7FA]">{{ securitySettings.lastLogin }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-[#B8C6D8]">上次登录IP</span>
                  <span class="text-sm text-[#F5F7FA]">{{ securitySettings.lastIp }}</span>
                </div>
              </div>
            </div>
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-4">支付方式</h4>
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-[#B8C6D8]">管理您的支付方式</p>
                </div>
                <button @click="showInfo('添加支付方式功能即将上线')" class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B] text-sm">
                  添加支付方式
                </button>
              </div>
            </div>
            <div class="p-4 bg-[#1E2532] rounded-lg">
              <h4 class="font-medium text-[#F5F7FA] mb-2">退出登录</h4>
              <p class="text-sm text-[#B8C6D8] mb-4">安全退出当前账号</p>
              <button @click="handleLogout" class="w-full py-2 bg-red-500/20 text-red-400 border border-red-500/40 rounded-lg font-medium hover:bg-red-500/40 transition-colors">退出登录</button>
            </div>
          </div>
        </div>

        <Teleport to="body">
          <Transition name="modal-fade">
            <div v-if="showPasswordModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click.self="closePasswordModal">
              <div class="bg-[#2D3748] rounded-xl p-6 w-full max-w-md mx-4">
                <h3 class="text-lg font-bold text-[#F5F7FA] mb-6">修改密码</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">当前密码</label>
                    <input type="password" v-model="currentPassword" class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" placeholder="请输入当前密码" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">新密码</label>
                    <input type="password" v-model="newPassword" class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" placeholder="请输入新密码" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-[#F5F7FA] mb-1">确认新密码</label>
                    <input type="password" v-model="confirmPassword" class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" placeholder="请再次输入新密码" />
                  </div>
                </div>
                <div class="flex space-x-4 mt-6">
                  <button @click="closePasswordModal" class="flex-1 py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">取消</button>
                  <button @click="handleChangePassword" class="flex-1 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">确认修改</button>
                </div>
              </div>
            </div>
          </Transition>
        </Teleport>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useAuthStore } from '../store/authStore'
import { storeToRefs } from 'pinia'
import { toast } from 'vue-sonner'
import { useInteraction } from '../composables/useInteraction'

const store = useAuthStore()
const { isAuthenticated, user } = storeToRefs(store)
const { handleSave, handleUpload, showSuccess, showWarning, showInfo } = useInteraction()

watch(() => user.value, (newUser) => {
  if (newUser) {
    formData.username = newUser.username || formData.username
    formData.email = newUser.email || formData.email
    formData.avatar = newUser.avatar || formData.avatar
  }
})

const activeTab = ref<string>('account')
const isEditing = ref(false)
const showSuccessToast = ref(false)
const showPasswordModal = ref(false)

const tabs = [
  { id: 'account', label: '账号信息' },
  { id: 'orders', label: '我的订单' },
  { id: 'notifications', label: '通知' },
  { id: 'privacy', label: '隐私设置' },
  { id: 'preferences', label: '偏好设置' },
  { id: 'security', label: '安全设置' },
]

const formData = reactive({
  username: user.value?.username || '@光影捕手',
  email: user.value?.email || 'photographer@example.com',
  phone: '138****6789',
  bio: '热爱风光和人像摄影，正在不断学习和进步中',
  location: '上海',
  website: 'https://photographer.example.com',
  avatar: user.value?.avatar || 'https://picsum.photos/400/400?random=12',
  coverImage: 'https://picsum.photos/1280/720?random=13',
})

const privacySettings = reactive({
  profileVisible: true,
  photosPublic: true,
  allowComments: true,
  allowFollowing: true,
  showLocation: true,
  showEmail: false,
  showPhone: false,
})

const preferences = reactive({
  theme: 'dark',
  language: 'zh-CN',
  defaultTab: 'feed',
  notifications: {
    newFollower: true,
    newLike: true,
    newComment: true,
    newMessage: true,
    systemUpdates: true,
    activityReminders: true,
  },
  emailNotifications: {
    weeklyDigest: true,
    eventReminders: true,
    promotionalOffers: false,
  },
  messageSettings: {
    pushEnabled: true,
    soundEnabled: true,
    notificationPreview: true,
    readReceipts: true,
    typingIndicators: true,
    autoDownloadMedia: 'wifi' as const,
    notificationSound: 'default',
  },
})

const securitySettings = reactive({
  twoFactorEnabled: false,
  lastLogin: '2023-10-25 14:30:22',
  lastIp: '192.168.1.1',
})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const avatarFile = ref<File | null>(null)
const coverFile = ref<File | null>(null)
const uploadProgress = ref<number | null>(null)
const isUploading = ref(false)
const selectedNotificationIds = ref<string[]>([])
const avatarInputRef = ref<HTMLInputElement | null>(null)
const coverInputRef = ref<HTMLInputElement | null>(null)

const mockOrders = [
  { id: 'ORD20231025001', type: '会员订阅', status: '已完成', amount: '¥199', date: '2023-10-25', details: '银河会员年卡' },
  { id: 'ORD20231020002', type: '课程购买', status: '已完成', amount: '¥299', date: '2023-10-20', details: '风光摄影进阶课程' },
  { id: 'ORD20231015003', type: '器材租赁', status: '进行中', amount: '¥150', date: '2023-10-15', details: '索尼 A7R IV (3天)' },
]

const mockNotifications = [
  { id: '1', type: 'like', content: '用户 @摄影爱好者 点赞了您的作品《晨曦中的山峦》', time: '5分钟前', read: false },
  { id: '2', type: 'comment', content: '用户 @光影达人 评论了您的作品《城市剪影》', time: '1小时前', read: false },
  { id: '3', type: 'follow', content: '用户 @新摄影师 关注了您', time: '3小时前', read: true },
  { id: '4', type: 'system', content: '您的作品《星空下的古堡》被推荐到首页', time: '1天前', read: true },
]

const privacyItems = [
  { key: 'profileVisible', label: '允许他人查看我的个人资料', desc: '关闭后，其他用户将无法找到和查看您的个人主页' },
  { key: 'photosPublic', label: '作品公开可见', desc: '关闭后，只有您关注的用户可以查看您的作品' },
  { key: 'allowComments', label: '允许评论我的作品', desc: '关闭后，其他用户将无法对您的作品发表评论' },
  { key: 'allowFollowing', label: '允许他人关注我', desc: '关闭后，其他用户将无法关注您的账号' },
]

const infoDisplayItems = [
  { key: 'showLocation', label: '显示我的所在地区', desc: '在个人主页显示您设置的所在地区信息' },
  { key: 'showEmail', label: '显示我的电子邮箱', desc: '在个人主页显示您的电子邮箱地址' },
  { key: 'showPhone', label: '显示我的手机号码', desc: '在个人主页显示您的手机号码' },
]

const notifItems = [
  { key: 'newFollower', label: '新粉丝通知', desc: '当有新用户关注您时' },
  { key: 'newLike', label: '新点赞通知', desc: '当您的作品获得点赞时' },
  { key: 'newComment', label: '新评论通知', desc: '当您的作品收到评论时' },
  { key: 'newMessage', label: '新消息通知', desc: '当您收到新消息时' },
]

const handlePrivacyChange = (field: keyof typeof privacySettings, value: boolean) => {
  (privacySettings as any)[field] = value
}

const handleNotificationChange = (field: keyof typeof preferences.notifications, value: boolean) => {
  (preferences.notifications as any)[field] = value
}

const handleSaveAccount = () => {
  isEditing.value = false
  handleSave()
}

const handleSaveSettings = () => {
  handleSave()
}

const handleChangePassword = () => {
  if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
    showWarning('请填写所有密码字段')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    showWarning('新密码与确认密码不匹配')
    return
  }
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  showPasswordModal.value = false
  showSuccess('密码修改成功')
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const handleLogout = () => {
  store.logout?.()
}

const handleFileSelect = (type: 'avatar' | 'cover', event: Event) => {
  if (!isEditing.value) return
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  if (!file.type.match('image.*')) {
    showWarning('请选择图片文件')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    showWarning('文件大小不能超过5MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    if (type === 'avatar') {
      avatarFile.value = file
      formData.avatar = e.target?.result as string
    } else {
      coverFile.value = file
      formData.coverImage = e.target?.result as string
    }
  }
  reader.readAsDataURL(file)
  simulateUpload(type)
}

const simulateUpload = (type: 'avatar' | 'cover') => {
  isUploading.value = true
  uploadProgress.value = 0
  const interval = setInterval(() => {
    uploadProgress.value = (uploadProgress.value === null || uploadProgress.value >= 100) ? 0 : uploadProgress.value + 10
    if (uploadProgress.value && uploadProgress.value >= 100) {
      clearInterval(interval)
      isUploading.value = false
      uploadProgress.value = null
      toast.success(`${type === 'avatar' ? '头像' : '封面'}更新成功`)
      handleUpload()
    }
  }, 200)
}

const triggerFileInput = (type: 'avatar' | 'cover') => {
  if (!isEditing.value) return
  if (type === 'avatar') {
    avatarInputRef.value?.click()
  } else {
    coverInputRef.value?.click()
  }
}

const toggleNotificationSelect = (id: string) => {
  selectedNotificationIds.value = selectedNotificationIds.value.includes(id)
    ? selectedNotificationIds.value.filter(nid => nid !== id)
    : [...selectedNotificationIds.value, id]
}

const selectAllNotifications = () => {
  if (selectedNotificationIds.value.length === mockNotifications.length) {
    selectedNotificationIds.value = []
  } else {
    selectedNotificationIds.value = mockNotifications.map(n => n.id)
  }
}

const markNotificationsAsRead = () => {
  showSuccess('已标记为已读')
}

const deleteSelectedNotifications = () => {
  showSuccess(`已删除 ${selectedNotificationIds.value.length} 条通知`)
  selectedNotificationIds.value = []
}
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>