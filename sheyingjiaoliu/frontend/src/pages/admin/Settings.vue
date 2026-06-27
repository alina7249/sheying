<template>
  <div class="space-y-6">
    <div class="flex items-center">
      <h1 class="text-2xl font-bold text-[#F5F7FA]">系统设置</h1>
      <div class="ml-4 px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full text-xs font-medium">
        仅超级管理员可访问
      </div>
    </div>

    <div class="bg-[#2D3748] border border-[#4A5F8B] rounded-xl overflow-hidden">
      <div class="flex border-b border-[#4A5F8B] flex-wrap">
        <button
          @click="activeTab = 'system'"
          :class="['flex-1 py-4 px-4 text-center font-medium transition-colors', activeTab === 'system' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]']"
        >
          <i class="fa-solid fa-cog mr-2"></i>
          系统设置
        </button>
        <button
          @click="activeTab = 'security'"
          :class="['flex-1 py-4 px-4 text-center font-medium transition-colors', activeTab === 'security' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]']"
        >
          <i class="fa-solid fa-shield-alt mr-2"></i>
          安全设置
        </button>
        <button
          @click="activeTab = 'permissions'"
          :class="['flex-1 py-4 px-4 text-center font-medium transition-colors', activeTab === 'permissions' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]']"
        >
          <i class="fa-solid fa-user-shield mr-2"></i>
          权限管理
        </button>
        <button
          @click="activeTab = 'notifications'"
          :class="['flex-1 py-4 px-4 text-center font-medium transition-colors', activeTab === 'notifications' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]']"
        >
          <i class="fa-solid fa-bell mr-2"></i>
          通知设置
        </button>
        <button
          @click="activeTab = 'backup'"
          :class="['flex-1 py-4 px-4 text-center font-medium transition-colors', activeTab === 'backup' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]']"
        >
          <i class="fa-solid fa-database mr-2"></i>
          备份恢复
        </button>
      </div>

      <div class="p-6">
        <div v-if="activeTab === 'system'" class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-lg font-bold text-[#F5F7FA] mb-6">基本设置</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">网站名称</label>
                <input
                  type="text"
                  v-model="siteName"
                  class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">网站描述</label>
                <textarea
                  v-model="siteDescription"
                  class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all min-h-[80px]"
                ></textarea>
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">默认语言</label>
                <select
                  v-model="defaultLanguage"
                  class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">最大上传文件大小 (MB)</label>
                <input
                  type="number"
                  v-model="maxFileSize"
                  class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                  min="1"
                  max="100"
                />
              </div>

              <div class="md:col-span-2">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-2">维护模式</label>
                    <p class="text-xs text-[#6B7C93]">启用后网站将进入维护状态，仅管理员可访问</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="maintenanceMode"
                      class="sr-only peer"
                    />
                    <div class="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                  </label>
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-2">允许用户注册</label>
                    <p class="text-xs text-[#6B7C93]">关闭后新用户将无法注册账号</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="enableRegistration"
                      class="sr-only peer"
                    />
                    <div class="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end space-x-3">
              <Button variant="secondary" @click="handleCancel">
                取消
              </Button>
              <Button @click="handleSaveSettings">
                保存设置
              </Button>
            </div>
          </div>

          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-lg font-bold text-[#F5F7FA] mb-6">API设置</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">API接口状态</label>
                <div class="flex items-center p-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg">
                  <span class="w-3 h-3 bg-[#38B2AC] rounded-full mr-2"></span>
                  <span>已启用</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">API访问密钥</label>
                <div class="flex items-center justify-between p-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg">
                  <span class="text-mono">***********</span>
                  <button @click="handleCopy" class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">
                    <i class="fa-solid fa-refresh"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end space-x-3">
              <Button variant="secondary" @click="handleAction('生成新密钥')">
                生成新密钥
              </Button>
              <Button @click="handleSave">
                保存设置
              </Button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'security'" class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-lg font-bold text-[#F5F7FA] mb-6">密码设置</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">密码复杂度要求</label>
                <select
                  v-model="passwordComplexity"
                  class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none"
                >
                  <option value="low">低 (至少6位字符)</option>
                  <option value="medium">中 (8位，包含字母和数字)</option>
                  <option value="high">高 (8位，包含大小写字母、数字和特殊符号) - 当前系统强制使用此标准</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">最大登录尝试次数</label>
                <input
                  type="number"
                  v-model="loginAttempts"
                  class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                  min="1"
                  max="20"
                />
              </div>

              <div class="md:col-span-2">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-2">双因素认证</label>
                    <p class="text-xs text-[#6B7C93]">启用后用户登录需要验证额外的安全码</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      v-model="twoFactorAuth"
                      class="sr-only peer"
                    />
                    <div class="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                  </label>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end space-x-3">
              <Button variant="secondary" @click="handleCancel">
                取消
              </Button>
              <Button @click="handleSaveSettings">
                保存设置
              </Button>
            </div>
          </div>

          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-lg font-bold text-[#F5F7FA] mb-6">会话设置</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">会话超时时间 (分钟)</label>
                <input
                  type="number"
                  v-model="sessionTimeout"
                  class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                  min="5"
                  max="120"
                />
              </div>
            </div>

            <div class="mt-8 flex justify-end space-x-3">
              <Button variant="secondary" @click="handleAction('强制登出所有用户')">
                强制登出所有用户
              </Button>
              <Button @click="handleSave">
                保存设置
              </Button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'permissions'">
          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-lg font-bold text-[#F5F7FA] mb-6">角色与权限管理</h2>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-[#4A5F8B]">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">权限项</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">超级管理员</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">管理员</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">运营人员</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#4A5F8B]">
                  <tr v-for="(row, idx) in permissionRows" :key="idx">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">{{ row.name }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" checked readonly class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" :checked="row.admin" :readonly="row.admin" class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" :checked="row.operator" class="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] rounded bg-[#1E2532]" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button @click="showInfo('配置权限项')" class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">配置</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-8 flex justify-end space-x-3">
              <Button variant="secondary" @click="handleCancel">
                取消
              </Button>
              <Button @click="handleSaveSettings">
                保存设置
              </Button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-lg font-bold text-[#F5F7FA] mb-6">邮件通知设置</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <div class="flex items-center justify-between">
                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-2">启用邮件通知</label>
                    <p class="text-xs text-[#6B7C93]">启用后系统将发送邮件通知给用户</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="emailNotificationsEnabled" class="sr-only peer" />
                    <div class="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">SMTP服务器地址</label>
                <input type="text" v-model="smtpServer" class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" />
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">SMTP服务器端口</label>
                <input type="number" v-model="smtpPort" class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" />
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">用户名</label>
                <input type="text" v-model="smtpUsername" class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" />
              </div>

              <div>
                <label class="block text-sm font-medium text-[#B8C6D8] mb-2">密码</label>
                <input type="password" v-model="smtpPassword" class="w-full px-4 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" />
              </div>
            </div>

            <div class="mt-8 flex justify-end space-x-3">
              <Button variant="secondary" @click="handleAction('测试连接')">
                测试连接
              </Button>
              <Button @click="handleSave">
                保存设置
              </Button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'backup'" class="space-y-6">
          <div class="bg-[#1E2532] rounded-xl p-6 border border-[#4A5F8B]">
            <h2 class="text-lg font-bold text-[#F5F7FA] mb-6">数据备份与恢复</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <div class="p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B]">
                  <h3 class="font-medium text-[#F5F7FA] mb-3">创建新备份</h3>
                  <div class="flex flex-wrap gap-3">
                    <Button @click="handleAction('备份数据库')">
                      <i class="fa-solid fa-database mr-2"></i>
                      备份数据库
                    </Button>
                    <Button @click="handleAction('备份媒体文件')">
                      <i class="fa-solid fa-images mr-2"></i>
                      备份媒体文件
                    </Button>
                    <Button @click="handleAction('完整备份')">
                      <i class="fa-solid fa-server mr-2"></i>
                      完整备份
                    </Button>
                  </div>
                </div>
              </div>

              <div class="md:col-span-2">
                <h3 class="font-medium text-[#F5F7FA] mb-3">备份历史</h3>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-[#4A5F8B]">
                    <thead>
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">备份名称</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">类型</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">大小</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">创建时间</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-[#B8C6D8] uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#4A5F8B]">
                      <tr v-for="(backup, idx) in backupHistory" :key="idx">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-[#F5F7FA]">{{ backup.name }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span :class="['px-2 py-1 text-xs rounded-full', backup.typeClass]">{{ backup.typeLabel }}</span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">{{ backup.size }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-[#B8C6D8]">{{ backup.time }}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div class="flex justify-end space-x-2">
                            <button @click="handleDownload(backup.name)" class="text-[#4A5F8B] hover:text-[#6B7C93] transition-colors">
                              <i class="fa-solid fa-download"></i>
                            </button>
                            <button @click="handleAction('恢复', backup.name)" class="text-[#38B2AC] hover:text-[#38A169] transition-colors">
                              <i class="fa-solid fa-rotate-left"></i>
                            </button>
                            <button @click="handleDelete(backup.name)" class="text-[#F56565] hover:text-[#E53E3E] transition-colors">
                              <i class="fa-solid fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="p-4 bg-[#2D3748] rounded-lg border border-[#4A5F8B]">
                  <h3 class="font-medium text-[#F5F7FA] mb-3">自动备份设置</h3>
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <label class="block text-sm font-medium text-[#B8C6D8] mb-1">启用自动备份</label>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" v-model="autoBackupEnabled" class="sr-only peer" />
                      <div class="w-9 h-5 bg-[#4A5F8B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#38B2AC]"></div>
                    </label>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-[#B8C6D8] mb-2">备份频率</label>
                      <select v-model="backupFrequency" class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none">
                        <option value="daily">每天</option>
                        <option value="weekly">每周</option>
                        <option value="monthly">每月</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-[#B8C6D8] mb-2">保留备份数量</label>
                      <input type="number" v-model="backupRetentionCount" class="w-full px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all" min="1" max="30" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <Button @click="handleSave">
                保存设置
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useInteraction } from '../../composables/useInteraction'
import Button from '../../components/common/Button.vue'

const { showInfo, showSuccess, handleSave, handleDownload, handleUpload, handleDelete, handleAction, handleCopy } = useInteraction()

const activeTab = ref<'system' | 'security' | 'permissions' | 'notifications' | 'backup'>('system')

const siteName = ref('影研社')
const siteDescription = ref('专业摄影创作与交流平台，连接全球摄影人')
const maintenanceMode = ref(false)
const maxFileSize = ref('20')
const enableRegistration = ref(true)
const defaultLanguage = ref('zh-CN')
const passwordComplexity = ref<'low' | 'medium' | 'high'>('medium')
const loginAttempts = ref('5')
const sessionTimeout = ref('30')
const twoFactorAuth = ref(false)

const emailNotificationsEnabled = ref(true)
const smtpServer = ref('smtp.example.com')
const smtpPort = ref('587')
const smtpUsername = ref('admin@example.com')
const smtpPassword = ref('********')

const autoBackupEnabled = ref(true)
const backupFrequency = ref('weekly')
const backupRetentionCount = ref('7')

const permissionRows = [
  { name: '用户管理', admin: true, operator: false },
  { name: '内容管理', admin: true, operator: true },
  { name: '小组管理', admin: true, operator: false },
  { name: '订单管理', admin: true, operator: false },
  { name: '系统设置', admin: false, operator: false },
]

const backupHistory = [
  { name: '完整备份_20231025', typeLabel: '完整备份', typeClass: 'bg-[#4A5F8B]/20 text-[#4A5F8B]', size: '1.2 GB', time: '2023-10-25 02:00:00' },
  { name: '数据库备份_20231020', typeLabel: '数据库备份', typeClass: 'bg-[#6B7C93]/20 text-[#6B7C93]', size: '256 MB', time: '2023-10-20 02:00:00' },
  { name: '媒体文件备份_20231015', typeLabel: '媒体文件备份', typeClass: 'bg-[#38B2AC]/20 text-[#38B2AC]', size: '980 MB', time: '2023-10-15 02:00:00' },
]

function handleSaveSettings() {
  handleSave()
}

function handleCancel() {
  showInfo('已取消更改')
}
</script>