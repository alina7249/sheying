<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center h-[60vh] text-center" ref="loginSection">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后管理您的作品，支持批量操作</p>
      <router-link to="/login" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
        立即登录
      </router-link>
    </div>

    <template v-else>
      <div ref="mainContent">
        <div class="mb-6">
          <router-link
            to="/profile-center/works"
            class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>返回我的作品集</span>
          </router-link>
        </div>

        <div class="mb-8 text-center">
          <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">批量管理作品</h1>
          <p class="text-[#B8C6D8] max-w-2xl mx-auto">
            批量删除、修改可见性、添加标签等操作，提高作品管理效率
          </p>
        </div>

        <div class="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B] mb-8">
          <div class="flex flex-col md:flex-row gap-4 items-center md:items-end">
            <div class="flex items-center">
              <input
                type="checkbox"
                id="select-all"
                :checked="selectedPhotos.length > 0 && selectedPhotos.length === filteredPosts.length"
                @change="toggleSelectAll"
                class="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
              />
              <label for="select-all" class="ml-2 text-[#B8C6D8]">
                全选 ({{ selectedPhotos.length }}/{{ filteredPosts.length }})
              </label>
            </div>

            <div class="flex flex-wrap gap-2 flex-1 md:flex-initial">
              <button
                @click="handleBatchDelete"
                :disabled="selectedPhotos.length === 0"
                class="px-4 py-2 rounded-lg font-medium transition-colors relative group"
                :class="selectedPhotos.length > 0 ? 'bg-[#6B7C93] text-[#F5F7FA] hover:bg-[#F56565]' : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'"
              >
                <i class="fa-solid fa-trash mr-2"></i>
                批量删除
                <span v-if="selectedPhotos.length === 0" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E2532] text-xs text-[#B8C6D8] rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  请先选择作品
                </span>
              </button>

              <div class="relative group">
                <button
                  :disabled="selectedPhotos.length === 0"
                  class="px-4 py-2 rounded-lg font-medium transition-colors"
                  :class="selectedPhotos.length > 0 ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'"
                >
                  <i class="fa-solid fa-eye mr-2"></i>
                  批量修改可见性
                </button>
                <div v-if="selectedPhotos.length > 0" class="absolute right-0 mt-1 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button @click="handleBatchVisibility('公开')" class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">设为公开</button>
                  <button @click="handleBatchVisibility('仅好友可见')" class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">设为仅好友可见</button>
                  <button @click="handleBatchVisibility('私密')" class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">设为私密</button>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="输入标签..."
                  v-model="tagToAdd"
                  class="px-3 py-2 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8] text-sm"
                />
                <button
                  @click="handleBatchAddTag"
                  :disabled="selectedPhotos.length === 0 || !tagToAdd.trim()"
                  class="px-4 py-2 rounded-lg font-medium transition-colors relative group"
                  :class="selectedPhotos.length > 0 && tagToAdd.trim() ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'"
                >
                  <i class="fa-solid fa-tags mr-2"></i>
                  添加标签
                  <span v-if="selectedPhotos.length === 0" class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#1E2532] text-xs text-[#B8C6D8] rounded whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    请先选择作品
                  </span>
                </button>
              </div>

              <div class="relative group">
                <button
                  :disabled="selectedPhotos.length === 0"
                  class="px-4 py-2 rounded-lg font-medium transition-colors"
                  :class="selectedPhotos.length > 0 ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'"
                >
                  <i class="fa-solid fa-cogs mr-2"></i>
                  更多操作
                </button>
                <div v-if="selectedPhotos.length > 0" class="absolute right-0 mt-1 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button @click="showRemoveTagModal = true" class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">批量移除标签</button>
                  <button @click="showMoveCategoryModal = true" class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">批量移动分类</button>
                  <button @click="handleBatchCopyrightType('独家授权')" class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">设为独家授权</button>
                  <button @click="handleBatchCopyrightType('非独家')" class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">设为非独家</button>
                  <button @click="handleBatchDownload" class="block w-full text-left px-4 py-2 text-sm text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">批量下载</button>
                </div>
              </div>

              <button
                @click="showHistoryModal = true"
                class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
              >
                <i class="fa-solid fa-history mr-2"></i>
                操作历史
              </button>
            </div>
          </div>
        </div>

        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div class="relative flex-1">
              <input
                type="text"
                placeholder="搜索作品标题或描述..."
                v-model="searchTerm"
                class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>

            <div class="flex flex-wrap gap-4">
              <select v-model="visibilityFilter" @change="currentPage = 1" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                <option value="all">全部可见性</option>
                <option value="public">公开</option>
                <option value="friends">仅好友可见</option>
                <option value="private">私密</option>
              </select>
              <select v-model="formatFilter" @change="currentPage = 1" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                <option value="all">全部格式</option>
                <option value="raw">RAW</option>
                <option value="jpg">JPG</option>
              </select>
              <select v-model="categoryFilter" @change="currentPage = 1" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                <option v-for="cat in getAllCategories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <select v-model="sortBy" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
                <option value="latest">最新发布</option>
                <option value="popular">最受欢迎</option>
                <option value="views">最多浏览</option>
              </select>
            </div>
          </div>

          <div class="mt-4">
            <h4 class="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in getAllTags"
                :key="tag"
                @click="selectedTag = tag; currentPage = 1"
                class="px-3 py-1 rounded-full text-sm transition-colors"
                :class="selectedTag === tag ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <div class="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="bg-[#2D3748] border-b border-[#4A5F8B]">
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-12">选择</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-40">预览</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden md:table-cell">标题</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden sm:table-cell">日期</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden sm:table-cell">格式</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden md:table-cell">可见性</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden lg:table-cell">分类</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden xl:table-cell">标签</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] hidden md:table-cell">互动</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-[#B8C6D8] w-24">操作</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#4A5F8B]">
                <tr
                  v-for="post in paginatedPosts"
                  :key="post.id"
                  class="hover:bg-[#1E2532] transition-colors"
                  :class="{ 'ring-2 ring-[#4A5F8B]': selectedPhotos.includes(post.id) }"
                >
                  <td class="px-6 py-4">
                    <input
                      type="checkbox"
                      :checked="selectedPhotos.includes(post.id)"
                      @change="togglePhotoSelection(post.id)"
                      class="w-4 h-4 bg-[#2D3748] border-[#4A5F8B] text-[#4A5F8B] rounded focus:ring-[#4A5F8B]"
                    />
                  </td>
                  <td class="px-6 py-4">
                    <div class="w-20 h-20 rounded overflow-hidden">
                      <img :src="post.image" :alt="post.title" class="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <div class="font-medium text-[#F5F7FA]">{{ post.title }}</div>
                    <div class="text-xs text-[#B8C6D8] truncate max-w-xs mt-1">{{ post.description }}</div>
                  </td>
                  <td class="px-6 py-4 text-sm text-[#B8C6D8] hidden sm:table-cell">{{ post.date }}</td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <span class="px-2 py-1 rounded-full text-xs" :class="post.format === 'RAW' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'bg-[#6B7C93] text-[#F5F7FA]'">{{ post.format }}</span>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <span class="px-2 py-1 rounded-full text-xs" :class="post.visibility === '公开' ? 'bg-[#4A5F8B] text-[#F5F7FA]' : post.visibility === '仅好友可见' ? 'bg-[#6B7C93] text-[#F5F7FA]' : 'bg-[#B8C6D8] text-[#2D3748]'">{{ post.visibility }}</span>
                  </td>
                  <td class="px-6 py-4 text-sm text-[#B8C6D8] hidden lg:table-cell">{{ post.category }}</td>
                  <td class="px-6 py-4 hidden xl:table-cell">
                    <div class="flex flex-wrap gap-1">
                      <span v-for="(tag, idx) in post.tags" :key="idx" class="px-2 py-0.5 bg-[#2D3748] text-[#B8C6D8] text-xs rounded-full border border-[#4A5F8B]">{{ tag }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-[#B8C6D8] hidden md:table-cell">
                    <div class="flex items-center space-x-4">
                      <span class="flex items-center"><i class="fa-solid fa-heart mr-1 text-[#4A5F8B]"></i>{{ post.likes }}</span>
                      <span class="flex items-center"><i class="fa-solid fa-comment mr-1 text-[#4A5F8B]"></i>{{ post.comments }}</span>
                      <span class="flex items-center"><i class="fa-solid fa-eye mr-1 text-[#4A5F8B]"></i>{{ post.views }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
                      <router-link :to="`/photo/${post.id}`" class="p-1.5 text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors" title="查看详情"><i class="fa-solid fa-eye"></i></router-link>
                      <button class="p-1.5 text-[#B8C6D8] hover:text-[#4A5F8B] transition-colors" title="编辑"><i class="fa-solid fa-edit"></i></button>
                      <button class="p-1.5 text-[#B8C6D8] hover:text-[#F56565] transition-colors" title="删除"><i class="fa-solid fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="filteredPosts.length === 0" class="p-8 bg-[#2D3748] flex flex-col items-center justify-center">
            <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mb-4">
              <i class="fa-solid fa-image text-2xl"></i>
            </div>
            <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无作品</h3>
            <p class="text-[#B8C6D8]">您当前没有符合筛选条件的作品</p>
          </div>

          <div v-if="filteredPosts.length > 0" class="flex justify-center mt-8 pb-6">
            <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 rounded border border-[#4A5F8B] transition-colors"
                :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed text-[#6B7C93]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'"
              >
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button v-if="currentPage > 3" @click="handlePageChange(1)" class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">1</button>
              <span v-if="currentPage > 4" class="px-3 py-2 text-[#B8C6D8]">...</span>
              <button
                v-for="page in getPageRange()"
                :key="page"
                @click="handlePageChange(page)"
                class="px-3 py-2 rounded border border-[#4A5F8B] transition-colors"
                :class="currentPage === page ? 'bg-[#4A5F8B] text-[#F5F7FA]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'"
              >{{ page }}</button>
              <span v-if="currentPage < totalPages - 3" class="px-3 py-2 text-[#B8C6D8]">...</span>
              <button v-if="currentPage < totalPages - 2" @click="handlePageChange(totalPages)" class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">{{ totalPages }}</button>
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 rounded border border-[#4A5F8B] transition-colors"
                :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-[#6B7C93]' : 'text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'"
              >
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
              <span class="ml-2 px-3 py-2 text-sm text-[#B8C6D8]">{{ currentPage }}/{{ totalPages }} 页 ({{ filteredPosts.length }} 条)</span>
            </nav>
          </div>
        </div>
      </div>
    </template>

    <!-- Modals -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showHistoryModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showHistoryModal = false">
          <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-lg max-h-[80vh] overflow-hidden">
            <div class="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#F5F7FA]">操作历史</h3>
              <div class="flex space-x-2">
                <button @click="handleClearHistory" class="px-3 py-1 text-sm bg-[#6B7C93] text-[#F5F7FA] rounded hover:bg-[#F56565] transition-colors">清空历史</button>
                <button @click="showHistoryModal = false" class="text-[#B8C6D8] hover:text-[#F5F7FA]"><i class="fa-solid fa-times"></i></button>
              </div>
            </div>
            <div class="overflow-y-auto max-h-[calc(80vh-6rem)] p-4">
              <div v-if="operationHistory.length === 0" class="text-center py-8">
                <div class="w-12 h-12 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-3"><i class="fa-solid fa-history"></i></div>
                <p class="text-[#B8C6D8]">暂无操作历史</p>
              </div>
              <div v-else class="space-y-3">
                <div v-for="record in operationHistory" :key="record.id" class="p-3 bg-[#1E2532] rounded-lg">
                  <div class="flex justify-between items-center">
                    <p class="text-[#F5F7FA]">{{ record.action }}</p>
                    <span class="text-xs text-[#6B7C93]">{{ record.timestamp }}</span>
                  </div>
                  <p class="text-sm text-[#B8C6D8] mt-1">共 {{ record.count }} 项</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal">
        <div v-if="showMoveCategoryModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showMoveCategoryModal = false">
          <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-md">
            <div class="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#F5F7FA]">批量移动分类</h3>
              <button @click="showMoveCategoryModal = false" class="text-[#B8C6D8] hover:text-[#F5F7FA]"><i class="fa-solid fa-times"></i></button>
            </div>
            <div class="p-4">
              <p class="text-[#B8C6D8] mb-4">请选择目标分类：</p>
              <select v-model="selectedCategory" class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer mb-4">
                <option value="">请选择分类</option>
                <option v-for="cat in getCategoriesExcludeAll()" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <div class="flex space-x-3 justify-end">
                <button @click="showMoveCategoryModal = false" class="px-4 py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">取消</button>
                <button @click="handleBatchMoveCategory" :disabled="!selectedCategory" class="px-4 py-2 rounded-lg transition-colors" :class="selectedCategory ? 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]' : 'bg-[#6B7C93]/50 text-[#B8C6D8] cursor-not-allowed'">确认移动</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <Transition name="modal">
        <div v-if="showRemoveTagModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="showRemoveTagModal = false">
          <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] w-full max-w-md">
            <div class="flex justify-between items-center p-4 border-b border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#F5F7FA]">批量移除标签</h3>
              <button @click="showRemoveTagModal = false" class="text-[#B8C6D8] hover:text-[#F5F7FA]"><i class="fa-solid fa-times"></i></button>
            </div>
            <div class="p-4">
              <p class="text-[#B8C6D8] mb-4">请选择要移除的标签：</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <button v-for="tag in getTagsExcludeAll()" :key="tag" @click="handleBatchRemoveTag(tag)" class="px-3 py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">{{ tag }}</button>
              </div>
              <div class="flex justify-end">
                <button @click="showRemoveTagModal = false" class="px-4 py-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">取消</button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useInteraction } from '../composables/useInteraction';

interface PhotographyPost {
  id: string;
  title: string;
  description: string;
  image: string;
  author: { id: string; name: string; avatar: string };
  likes: number;
  comments: number;
  tags: string[];
  date: string;
  views: number;
  format: 'RAW' | 'JPG';
  visibility: '公开' | '仅好友可见' | '私密';
  copyrightType: '独家授权' | '非独家';
  category: string;
}

interface OperationHistory {
  id: string;
  action: string;
  count: number;
  timestamp: string;
}

const { handleDownload: composableDownload } = useInteraction();

const isAuthenticated = ref(!!localStorage.getItem('token'));

const selectedPhotos = ref<string[]>(JSON.parse(localStorage.getItem('selectedPhotos') || '[]'));
const sortBy = ref('latest');
const selectedTag = ref('全部');
const searchTerm = ref('');
const visibilityFilter = ref('all');
const formatFilter = ref('all');
const categoryFilter = ref('all');
const tagToAdd = ref('');
const selectedCategory = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

const showHistoryModal = ref(false);
const showMoveCategoryModal = ref(false);
const showRemoveTagModal = ref(false);
const operationHistory = ref<OperationHistory[]>(JSON.parse(localStorage.getItem('operationHistory') || '[]'));

const mockUserPosts: PhotographyPost[] = [
  {
    id: '1', title: '晨曦中的山峦', description: '捕捉清晨第一缕阳光洒在山峦上的壮丽景色，使用长曝光展现云海的流动感。',
    image: 'https://picsum.photos/1280/720?random=96',
    author: { id: 'user-123', name: '@光影捕手', avatar: 'https://picsum.photos/400/400?random=97' },
    likes: 324, comments: 45, tags: ['风光', '日出', '云海', '自然'], date: '2023-10-25', views: 1256, format: 'RAW', visibility: '公开', copyrightType: '独家授权', category: '风景',
  },
  {
    id: '2', title: '城市剪影', description: '从高处俯瞰城市天际线，记录夕阳下城市建筑的剪影效果。',
    image: 'https://picsum.photos/1280/720?random=98',
    author: { id: 'user-123', name: '@光影捕手', avatar: 'https://picsum.photos/400/400?random=99' },
    likes: 289, comments: 37, tags: ['城市', '建筑', '剪影', '夕阳'], date: '2023-10-22', views: 987, format: 'JPG', visibility: '公开', copyrightType: '非独家', category: '城市',
  },
  {
    id: '3', title: '海浪与礁石', description: '长时间曝光拍摄海浪拍打礁石的场景，展现水的丝绸质感。',
    image: 'https://picsum.photos/1280/720?random=100',
    author: { id: 'user-123', name: '@光影捕手', avatar: 'https://picsum.photos/400/400?random=101' },
    likes: 412, comments: 53, tags: ['海景', '慢门', '自然', '礁石'], date: '2023-10-18', views: 1452, format: 'RAW', visibility: '仅好友可见', copyrightType: '独家授权', category: '风景',
  },
  {
    id: '4', title: '森林晨雾', description: '在山间森林中捕捉晨雾弥漫的神秘氛围，阳光透过树叶形成丁达尔效应。',
    image: 'https://picsum.photos/1280/720?random=102',
    author: { id: 'user-123', name: '@光影捕手', avatar: 'https://picsum.photos/400/400?random=103' },
    likes: 387, comments: 49, tags: ['森林', '晨雾', '丁达尔效应', '自然'], date: '2023-10-15', views: 1328, format: 'JPG', visibility: '公开', copyrightType: '非独家', category: '风景',
  },
  {
    id: '5', title: '湖畔日落', description: '平静的湖面倒映着绚丽的晚霞，形成对称的美感。',
    image: 'https://picsum.photos/1280/720?random=104',
    author: { id: 'user-123', name: '@光影捕手', avatar: 'https://picsum.photos/400/400?random=105' },
    likes: 456, comments: 61, tags: ['湖泊', '日落', '倒影', '晚霞'], date: '2023-10-12', views: 1689, format: 'RAW', visibility: '公开', copyrightType: '独家授权', category: '风景',
  },
  {
    id: '6', title: '星空下的古堡', description: '在远离城市光污染的地方，拍摄星空下的古堡遗迹，展现历史与自然的交融。',
    image: 'https://picsum.photos/1280/720?random=106',
    author: { id: 'user-123', name: '@光影捕手', avatar: 'https://picsum.photos/400/400?random=107' },
    likes: 523, comments: 78, tags: ['星空', '夜景', '古堡', '银河'], date: '2023-10-08', views: 1976, format: 'RAW', visibility: '私密', copyrightType: '独家授权', category: '夜景',
  },
];

watch(selectedPhotos, (val) => { localStorage.setItem('selectedPhotos', JSON.stringify(val)); }, { deep: true });
watch(operationHistory, (val) => { localStorage.setItem('operationHistory', JSON.stringify(val)); }, { deep: true });
watch(searchTerm, () => { currentPage.value = 1; });

const getAllTags = computed(() => {
  const tags = ['全部'];
  mockUserPosts.forEach(post => { post.tags.forEach(tag => { if (!tags.includes(tag)) tags.push(tag); }); });
  return tags;
});

const getAllCategories = computed(() => {
  const categories = ['全部'];
  mockUserPosts.forEach(post => { if (!categories.includes(post.category)) categories.push(post.category); });
  return categories;
});

const getCategoriesExcludeAll = () => getAllCategories.value.filter(c => c !== '全部');
const getTagsExcludeAll = () => getAllTags.value.filter(t => t !== '全部');

const filteredPosts = computed(() => {
  let posts = [...mockUserPosts];
  if (selectedTag.value !== '全部') posts = posts.filter(p => p.tags.includes(selectedTag.value));
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    posts = posts.filter(p => p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term) || p.tags.some(t => t.toLowerCase().includes(term)));
  }
  if (visibilityFilter.value !== 'all') {
    posts = posts.filter(p => {
      if (visibilityFilter.value === 'public') return p.visibility === '公开';
      if (visibilityFilter.value === 'friends') return p.visibility === '仅好友可见';
      if (visibilityFilter.value === 'private') return p.visibility === '私密';
      return true;
    });
  }
  if (formatFilter.value !== 'all') {
    posts = posts.filter(p => { if (formatFilter.value === 'raw') return p.format === 'RAW'; if (formatFilter.value === 'jpg') return p.format === 'JPG'; return true; });
  }
  if (categoryFilter.value !== 'all') posts = posts.filter(p => p.category === categoryFilter.value);
  if (sortBy.value === 'latest') posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  else if (sortBy.value === 'popular') posts.sort((a, b) => b.likes - a.likes);
  else if (sortBy.value === 'views') posts.sort((a, b) => b.views - a.views);
  return posts;
});

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / pageSize.value));
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredPosts.value.slice(start, start + pageSize.value);
});

function getPageRange() {
  const range: number[] = [];
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + 4);
  if (end - start < 4 && start > 1) start = Math.max(1, end - 4);
  for (let i = start; i <= end; i++) range.push(i);
  return range;
}

function togglePhotoSelection(id: string) {
  const idx = selectedPhotos.value.indexOf(id);
  if (idx === -1) selectedPhotos.value.push(id);
  else selectedPhotos.value.splice(idx, 1);
}

function toggleSelectAll() {
  if (selectedPhotos.value.length === filteredPosts.value.length) selectedPhotos.value = [];
  else selectedPhotos.value = filteredPosts.value.map(p => p.id);
}

function addHistoryRecord(action: string, count: number) {
  operationHistory.value.unshift({ id: `history-${Date.now()}`, action, count, timestamp: new Date().toLocaleString('zh-CN') });
}

function handleBatchDelete() {
  if (selectedPhotos.value.length === 0) { toast.warning('请先选择要删除的作品'); return; }
  if (window.confirm(`确定要删除选中的 ${selectedPhotos.value.length} 个作品吗？此操作不可恢复。`)) {
    addHistoryRecord('批量删除作品', selectedPhotos.value.length);
    toast.success(`成功删除 ${selectedPhotos.value.length} 个作品`);
    selectedPhotos.value = [];
  }
}

function handleBatchVisibility(visibility: '公开' | '仅好友可见' | '私密') {
  if (selectedPhotos.value.length === 0) { toast.warning('请先选择要修改的作品'); return; }
  addHistoryRecord(`批量修改可见性为${visibility}`, selectedPhotos.value.length);
  toast.success(`成功将 ${selectedPhotos.value.length} 个作品设置为 ${visibility}`);
}

function handleBatchAddTag() {
  if (selectedPhotos.value.length === 0) { toast.warning('请先选择要添加标签的作品'); return; }
  if (!tagToAdd.value.trim()) { toast.warning('请输入标签内容'); return; }
  addHistoryRecord(`批量添加标签: ${tagToAdd.value}`, selectedPhotos.value.length);
  toast.success(`成功为 ${selectedPhotos.value.length} 个作品添加标签：${tagToAdd.value}`);
  tagToAdd.value = '';
}

function handleBatchRemoveTag(tagToRemove: string) {
  if (selectedPhotos.value.length === 0) { toast.warning('请先选择要移除标签的作品'); return; }
  addHistoryRecord(`批量移除标签: ${tagToRemove}`, selectedPhotos.value.length);
  toast.success(`成功从 ${selectedPhotos.value.length} 个作品中移除标签：${tagToRemove}`);
  showRemoveTagModal.value = false;
}

function handleBatchMoveCategory() {
  if (selectedPhotos.value.length === 0) { toast.warning('请先选择要移动分类的作品'); return; }
  if (!selectedCategory.value) { toast.warning('请选择目标分类'); return; }
  addHistoryRecord(`批量移动到分类: ${selectedCategory.value}`, selectedPhotos.value.length);
  toast.success(`成功将 ${selectedPhotos.value.length} 个作品移动到分类：${selectedCategory.value}`);
  showMoveCategoryModal.value = false;
  selectedCategory.value = '';
}

function handleBatchCopyrightType(copyrightType: '独家授权' | '非独家') {
  if (selectedPhotos.value.length === 0) { toast.warning('请先选择要修改的作品'); return; }
  addHistoryRecord(`批量修改版权类型为${copyrightType}`, selectedPhotos.value.length);
  toast.success(`成功将 ${selectedPhotos.value.length} 个作品设置为 ${copyrightType}`);
}

function handleBatchDownload() {
  if (selectedPhotos.value.length === 0) { toast.warning('请先选择要下载的作品'); return; }
  addHistoryRecord('批量下载作品', selectedPhotos.value.length);
  composableDownload(`${selectedPhotos.value.length} 个作品`);
}

function handleClearHistory() {
  if (window.confirm('确定要清空所有操作历史吗？此操作不可恢复。')) {
    operationHistory.value = [];
    localStorage.removeItem('operationHistory');
    toast.success('操作历史已清空');
  }
}

function handlePageChange(page: number) {
  currentPage.value = page;
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>