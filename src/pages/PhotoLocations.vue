<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div v-if="!authState.isAuthenticated" class="flex flex-col items-center justify-center h-[60vh] text-center">
      <div class="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
        <i class="fa-solid fa-user-lock text-2xl"></i>
      </div>
      <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
      <p class="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的拍摄地点分布和相关作品</p>
      <router-link to="/login" class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
        立即登录
      </router-link>
    </div>

    <template v-else>
      <div>
        <div class="mb-6">
          <router-link
            to="/profile-center"
            class="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i class="fa-solid fa-arrow-left"></i>
            <span>返回个人中心</span>
          </router-link>
        </div>

        <div class="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div class="text-center md:text-left">
            <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">我的拍摄地点</h1>
            <p class="text-[#B8C6D8] max-w-2xl mx-auto md:mx-0">
              展示您发布作品的拍摄地点分布，探索新的创作灵感
            </p>
          </div>
          <button
            @click="openNewLocationModal"
            class="mt-4 md:mt-0 px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors flex items-center hover:scale-105 active:scale-95 transition-transform"
          >
            <i class="fa-solid fa-plus mr-2"></i>
            添加新地点
          </button>
        </div>

        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="relative">
              <input
                type="text"
                placeholder="搜索地点名称或地址..."
                v-model="searchTerm"
                class="w-full px-4 py-3 pl-12 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>

            <select
              v-model="selectedCategory"
              class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option v-for="category in allCategories" :key="category" :value="category">{{ category }}</option>
            </select>

            <select
              v-model="selectedTimeFilter"
              class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="全部">全部时间</option>
              <option value="一周内">一周内</option>
              <option value="一月内">一月内</option>
              <option value="三月内">三月内</option>
              <option value="一年内">一年内</option>
            </select>

            <select
              v-model="selectedActivityFilter"
              class="px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="全部">全部活跃度</option>
              <option value="高活跃">高活跃 (&ge;10次)</option>
              <option value="中活跃">中活跃 (5-9次)</option>
              <option value="低活跃">低活跃 (&lt;5次)</option>
            </select>
          </div>
        </div>

        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">拍摄地点统计</h3>

          <div class="space-y-3">
            <div v-for="(item, index) in statsData" :key="index" class="flex items-center gap-3">
              <span class="text-xs text-[#B8C6D8] w-16 text-right truncate">{{ item.name }}</span>
              <div class="flex-1 space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-[#B8C6D8] w-8">作品</span>
                  <div class="flex-1 h-4 bg-[#1E2532] rounded overflow-hidden">
                    <div class="h-full bg-[#4A5F8B] rounded transition-all" :style="{ width: (item.photos / maxPhotos * 100) + '%' }"></div>
                  </div>
                  <span class="text-xs text-[#F5F7FA] w-6">{{ item.photos }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-[#B8C6D8] w-8">访问</span>
                  <div class="flex-1 h-4 bg-[#1E2532] rounded overflow-hidden">
                    <div class="h-full bg-[#6B7C93] rounded transition-all" :style="{ width: (item.visits / maxVisits * 100) + '%' }"></div>
                  </div>
                  <span class="text-xs text-[#F5F7FA] w-6">{{ item.visits }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="bg-[#1E2532] p-4 rounded-lg border border-[#4A5F8B]">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                  <i class="fa-solid fa-map-pin"></i>
                </div>
                <div>
                  <p class="text-sm text-[#B8C6D8]">总地点数</p>
                  <p class="text-xl font-bold text-[#F5F7FA]">{{ mockLocations.length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-[#1E2532] p-4 rounded-lg border border-[#4A5F8B]">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                  <i class="fa-solid fa-camera"></i>
                </div>
                <div>
                  <p class="text-sm text-[#B8C6D8]">总作品数</p>
                  <p class="text-xl font-bold text-[#F5F7FA]">{{ totalPhotos }}</p>
                </div>
              </div>
            </div>

            <div class="bg-[#1E2532] p-4 rounded-lg border border-[#4A5F8B]">
              <div class="flex items-center">
                <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                  <i class="fa-solid fa-star"></i>
                </div>
                <div>
                  <p class="text-sm text-[#B8C6D8]">收藏地点</p>
                  <p class="text-xl font-bold text-[#F5F7FA]">{{ favoriteLocations }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-[#F5F7FA]">拍摄地点地图</h3>
                <div class="flex space-x-2">
                  <button
                    @click="mapZoom = 1"
                    class="p-2 bg-[#1E2532] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    <i class="fa-solid fa-location-crosshairs"></i>
                  </button>
                  <button
                    @click="mapZoom = Math.min(mapZoom + 0.2, 3)"
                    class="p-2 bg-[#1E2532] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                  <button
                    @click="mapZoom = Math.max(mapZoom - 0.2, 0.5)"
                    class="p-2 bg-[#1E2532] rounded-lg text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                  >
                    <i class="fa-solid fa-minus"></i>
                  </button>
                </div>
              </div>

              <div
                ref="mapRef"
                class="h-[500px] relative bg-[#1E2532] rounded-lg overflow-hidden select-none"
                @wheel.prevent="handleMapWheel"
                @mousedown.prevent="handleMapMouseDown"
                :style="{ cursor: isDragging ? 'grabbing' : 'grab' }"
              >
                <div
                  class="absolute inset-0 opacity-30 origin-center"
                  :style="{
                    transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapZoom})`,
                  }"
                >
                  <img
                    src="https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=world%20map%20vintage%20paper%20texture%20blue&sign=a7e6038b84e3276bdf4bf7abc3a1ddb7"
                    alt="Map background"
                    class="w-full h-full object-cover"
                  />
                </div>

                <div
                  v-for="location in mockLocations"
                  :key="location.id"
                  :class="['absolute rounded-full cursor-pointer shadow-lg transition-transform hover:scale-125 z-10',
                    selectedLocation === location.id ? 'w-8 h-8 bg-[#4A5F8B] border-2 border-[#F5F7FA]' : 'w-6 h-6 bg-[#6B7C93] border-2 border-[#2D3748]']"
                  :style="{
                    left: ((location.longitude + 180) / 360 * 100) + '%',
                    top: ((90 - location.latitude) / 180 * 100) + '%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                  }"
                  @click="openDetailModal(location.id)"
                >
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[#2D3748] text-[#F5F7FA] text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {{ location.name }} ({{ location.photos }}张作品)
                  </div>

                  <div class="absolute -top-1 -right-1 bg-[#F56565] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {{ Math.min(location.photos, 99) }}+
                  </div>

                  <div v-if="location.isFavorite" class="absolute -bottom-1 -right-1 text-yellow-400">
                    <i class="fa-solid fa-star text-xs"></i>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex justify-between text-sm text-[#B8C6D8]">
                <p>提示：点击地图上的标记点查看详细信息</p><p>按住鼠标拖动地图，滚轮缩放</p>
              </div>
            </div>

            <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-[#F5F7FA]">位置列表</h3>
                <span class="text-sm text-[#B8C6D8]">{{ filteredLocations.length }} 个地点</span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div
                  v-for="location in filteredLocations"
                  :key="location.id"
                  :class="['bg-[#1E2532] rounded-xl overflow-hidden border cursor-pointer transition-all hover:-translate-y-1',
                    selectedLocation === location.id ? 'border-[#4A5F8B] shadow-lg' : 'border-[#4A5F8B] hover:border-[#4A5F8B]']"
                  @click="openDetailModal(location.id)"
                >
                  <div class="relative">
                    <img
                      :src="location.image"
                      :alt="location.name"
                      class="w-full h-40 object-cover"
                    />
                    <div class="absolute top-2 right-2 flex space-x-2">
                      <div class="bg-[#1E2532]/80 text-[#F5F7FA] text-xs px-2 py-1 rounded-full">
                        {{ location.photos }} 张作品
                      </div>
                      <div v-if="location.isFavorite" class="bg-[#1E2532]/80 text-yellow-400 text-xs px-2 py-1 rounded-full flex items-center">
                        <i class="fa-solid fa-star mr-1"></i> 收藏
                      </div>
                    </div>
                  </div>
                  <div class="p-4">
                    <div class="flex justify-between items-center mb-1">
                      <h4 class="font-bold text-[#F5F7FA]">{{ location.name }}</h4>
                      <div class="flex items-center">
                        <i
                          v-for="i in 5"
                          :key="i"
                          :class="['fa-solid fa-star text-xs', i <= location.rating ? 'text-yellow-400' : 'text-[#4A5F8B]']"
                        ></i>
                      </div>
                    </div>
                    <p class="text-sm text-[#B8C6D8] mb-3 line-clamp-1">{{ location.address }}</p>
                    <div class="flex flex-wrap gap-1 mb-3">
                      <span v-for="(category, idx) in location.categories" :key="idx" class="px-2 py-0.5 bg-[#2D3748] text-[#B8C6D8] text-xs rounded">
                        {{ category }}
                      </span>
                    </div>
                    <div class="flex justify-between text-xs text-[#6B7C93]">
                      <span><i class="fa-solid fa-calendar-alt mr-1"></i> 最近访问: {{ location.lastVisit }}</span>
                      <span><i class="fa-solid fa-map-marker-alt mr-1"></i> 访问 {{ location.visitCount }} 次</span>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="filteredLocations.length === 0" class="p-8 text-center">
                <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                  <i class="fa-solid fa-map-marker-alt text-2xl"></i>
                </div>
                <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">未找到相关地点</h3>
                <p class="text-[#B8C6D8]">
                  尝试使用其他关键词或分类进行搜索
                </p>
                <button
                  @click="openNewLocationModal"
                  class="mt-4 px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                >
                  添加新地点
                </button>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <template v-if="selectedLocationData">
              <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <div class="flex justify-between items-start mb-3">
                  <h3 class="text-lg font-bold text-[#F5F7FA]">{{ selectedLocationData.name }}</h3>
                  <div class="flex items-center space-x-1">
                    <button
                      @click="toggleFavorite"
                      :class="['p-1.5 rounded-full', selectedLocationData.isFavorite ? 'bg-yellow-400 text-[#1E2532]' : 'bg-[#2D3748]/50 text-[#F5F7FA]']"
                      :title="selectedLocationData.isFavorite ? '取消收藏' : '收藏地点'"
                    >
                      <i class="fa-solid fa-star"></i>
                    </button>
                    <ShareButton
                      :url="`${window.location.origin}/photo-locations/${selectedLocationData.id}`"
                      :title="selectedLocationData.name"
                      size="sm"
                    />
                  </div>
                </div>

                <p class="text-sm text-[#F5F7FA]/80 mb-4">{{ selectedLocationData.address }}</p>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div class="flex items-center">
                    <i class="fa-solid fa-camera text-[#F5F7FA] mr-2"></i>
                    <span class="text-[#F5F7FA]">{{ selectedLocationData.photos }} 张作品</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fa-solid fa-map-pin text-[#F5F7FA] mr-2"></i>
                    <span class="text-[#F5F7FA]">{{ selectedLocationData.latitude.toFixed(4) }}, {{ selectedLocationData.longitude.toFixed(4) }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fa-solid fa-calendar-alt text-[#F5F7FA] mr-2"></i>
                    <span class="text-[#F5F7FA]">最近: {{ selectedLocationData.lastVisit }}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fa-solid fa-history text-[#F5F7FA] mr-2"></i>
                    <span class="text-[#F5F7FA]">访问 {{ selectedLocationData.visitCount }} 次</span>
                  </div>
                </div>

                <div class="flex flex-wrap gap-1">
                  <span v-for="(category, idx) in selectedLocationData.categories" :key="idx" class="px-2 py-0.5 bg-[#2D3748]/50 text-[#F5F7FA] text-xs rounded-full">
                    {{ category }}
                  </span>
                </div>

                <div class="mt-4 flex space-x-2">
                  <button
                    @click="openEditLocationModal(selectedLocationData)"
                    class="flex-1 py-2 bg-[#2D3748] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#4A5F8B] transition-colors"
                  >
                    <i class="fa-solid fa-pen-to-square mr-1"></i> 编辑
                  </button>
                  <button
                    @click="router.push(`/profile-center/works?location=${selectedLocationData.id}`)"
                    class="flex-1 py-2 bg-[#2D3748] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#4A5F8B] transition-colors"
                  >
                    <i class="fa-solid fa-images mr-1"></i> 查看作品
                  </button>
                </div>
              </div>

              <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">该地点的作品</h3>
                <div class="space-y-4">
                  <div
                    v-for="photo in locationPhotos"
                    :key="photo.id"
                    class="flex space-x-3 p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:border-[#4A5F8B] transition-colors cursor-pointer hover:scale-[1.02] transition-transform"
                    @click.stop="router.push(`/photo/${photo.id}`)"
                  >
                    <div class="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                      <img
                        :src="photo.image"
                        :alt="photo.title"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div class="flex-1">
                      <h4 class="font-medium text-[#F5F7FA] mb-1">{{ photo.title }}</h4>
                      <p class="text-xs text-[#B8C6D8] mb-2">{{ photo.date }}</p>
                      <div class="flex space-x-3 text-xs">
                        <span class="flex items-center text-[#B8C6D8]">
                          <i class="fa-solid fa-heart mr-1 text-[#F56565]"></i> {{ photo.likes }}
                        </span>
                        <span class="flex items-center text-[#B8C6D8]">
                          <i class="fa-solid fa-comment mr-1 text-[#4A5F8B]"></i> {{ photo.comments }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div v-if="locationPhotos.length === 0" class="p-4 text-center">
                    <p class="text-[#B8C6D8]">该地点暂无作品</p>
                    <button
                      @click="router.push('/profile-center/works?action=upload')"
                      class="mt-3 px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#6B7C93] transition-colors"
                    >
                      上传作品
                    </button>
                  </div>
                </div>

                <div v-if="locationPhotos.length > 0" class="mt-4 text-center">
                  <button
                    @click="router.push(`/profile-center/works?location=${selectedLocation}`)"
                    class="inline-flex items-center text-sm text-[#4A5F8B] hover:text-[#6B7C93] transition-colors"
                  >
                    查看更多作品 <i class="fa-solid fa-chevron-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>

              <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                <h3 class="text-lg font-bold text-[#F5F7FA] mb-4">拍摄建议</h3>
                <div v-if="selectedLocationData.notes" class="mb-4 p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] text-sm text-[#B8C6D8]">
                  {{ selectedLocationData.notes }}
                </div>

                <div class="space-y-3">
                  <div class="flex items-start">
                    <i class="fa-solid fa-clock text-[#4A5F8B] mt-1 mr-3 flex-shrink-0"></i>
                    <div>
                      <h4 class="font-medium text-[#F5F7FA] text-sm">最佳拍摄时间</h4>
                      <p class="text-xs text-[#B8C6D8] mt-1">根据地点特点，建议在日出、日落或特定季节前往拍摄</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <i class="fa-solid fa-camera text-[#4A5F8B] mt-1 mr-3 flex-shrink-0"></i>
                    <div>
                      <h4 class="font-medium text-[#F5F7FA] text-sm">推荐器材</h4>
                      <p class="text-xs text-[#B8C6D8] mt-1">广角镜头适合风景，长焦镜头适合人像或细节捕捉</p>
                    </div>
                  </div>

                  <div class="flex items-start">
                    <i class="fa-solid fa-sun text-[#4A5F8B] mt-1 mr-3 flex-shrink-0"></i>
                    <div>
                      <h4 class="font-medium text-[#F5F7FA] text-sm">光线考虑</h4>
                      <p class="text-xs text-[#B8C6D8] mt-1">注意不同时间段光线角度的变化，准备反光板或补光设备</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <div v-else class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 class="text-lg font-bold text-[#F5F7FA] mb-2">位置详情</h3>
              <p class="text-[#B8C6D8]">
                从地图或位置列表中选择一个地点，查看详细信息和相关作品
              </p>
              <div class="mt-6 flex flex-col space-y-3">
                <div class="p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                  <h4 class="font-medium text-[#F5F7FA] mb-1 flex items-center">
                    <i class="fa-solid fa-info-circle text-[#4A5F8B] mr-2"></i>
                    如何添加新地点？
                  </h4>
                  <p class="text-sm text-[#B8C6D8]">
                    点击"添加新地点"按钮，填写地点信息，系统会自动将其添加到您的地点列表中
                  </p>
                </div>
                <div class="p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                  <h4 class="font-medium text-[#F5F7FA] mb-1 flex items-center">
                    <i class="fa-solid fa-lightbulb text-[#4A5F8B] mr-2"></i>
                    创作提示
                  </h4>
                  <p class="text-sm text-[#B8C6D8]">
                    探索新的拍摄地点可以激发创作灵感，尝试在不同时间和天气条件下拍摄同一地点
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <Transition name="modal-fade">
          <div v-if="isDetailModalOpen && selectedLocationData" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="isDetailModalOpen = false">
            <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] max-w-4xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
              <div class="relative">
                <img
                  :src="selectedLocationData.image"
                  :alt="selectedLocationData.name"
                  class="w-full h-64 object-cover"
                />
                <div class="absolute top-4 right-4 flex space-x-2">
                  <button
                    @click="toggleFavorite"
                    :class="['p-2 rounded-full', selectedLocationData.isFavorite ? 'bg-yellow-400 text-[#1E2532]' : 'bg-[#1E2532]/80 text-[#F5F7FA]']"
                    :title="selectedLocationData.isFavorite ? '取消收藏' : '收藏地点'"
                  >
                    <i class="fa-solid fa-star"></i>
                  </button>
                  <ShareButton
                    :url="`${window.location.origin}/photo-locations/${selectedLocationData.id}`"
                    :title="selectedLocationData.name"
                    size="sm"
                  />
                  <button
                    @click="isDetailModalOpen = false"
                    class="p-2 bg-[#1E2532]/80 text-[#F5F7FA] rounded-full hover:bg-[#4A5F8B] transition-colors"
                  >
                    <i class="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>

              <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                  <div>
                    <h2 class="text-2xl font-bold text-[#F5F7FA] mb-2">{{ selectedLocationData.name }}</h2>
                    <div class="flex items-center text-sm text-[#B8C6D8] mb-4">
                      <i class="fa-solid fa-map-marker-alt mr-2"></i>
                      <span>{{ selectedLocationData.address }}</span>
                    </div>
                  </div>
                  <div class="flex items-center">
                    <i
                      v-for="i in 5"
                      :key="i"
                      :class="['fa-solid fa-star', i <= selectedLocationData.rating ? 'text-yellow-400' : 'text-[#4A5F8B]']"
                    ></i>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                        <i class="fa-solid fa-camera"></i>
                      </div>
                      <div>
                        <p class="text-sm text-[#B8C6D8]">作品数量</p>
                        <p class="text-xl font-bold text-[#F5F7FA]">{{ selectedLocationData.photos }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                        <i class="fa-solid fa-history"></i>
                      </div>
                      <div>
                        <p class="text-sm text-[#B8C6D8]">访问次数</p>
                        <p class="text-xl font-bold text-[#F5F7FA]">{{ selectedLocationData.visitCount }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                        <i class="fa-solid fa-calendar-alt"></i>
                      </div>
                      <div>
                        <p class="text-sm text-[#B8C6D8]">首次访问</p>
                        <p class="text-lg font-bold text-[#F5F7FA]">{{ selectedLocationData.firstVisit }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B]">
                    <div class="flex items-center">
                      <div class="w-10 h-10 rounded-full bg-[#4A5F8B]/20 flex items-center justify-center text-[#4A5F8B] mr-3">
                        <i class="fa-solid fa-calendar-check"></i>
                      </div>
                      <div>
                        <p class="text-sm text-[#B8C6D8]">最近访问</p>
                        <p class="text-lg font-bold text-[#F5F7FA]">{{ selectedLocationData.lastVisit }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-6">
                  <h3 class="text-lg font-bold text-[#F5F7FA] mb-3">地点分类</h3>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(category, idx) in selectedLocationData.categories" :key="idx" class="px-3 py-1.5 bg-[#1E2532] text-[#B8C6D8] rounded-full text-sm border border-[#4A5F8B]">
                      {{ category }}
                    </span>
                  </div>
                </div>

                <div class="mb-6">
                  <h3 class="text-lg font-bold text-[#F5F7FA] mb-3">拍摄笔记</h3>
                  <div v-if="selectedLocationData.notes" class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] text-[#B8C6D8]">
                    {{ selectedLocationData.notes }}
                  </div>
                  <div v-else class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] text-[#B8C6D8] text-center">
                    <p>暂无拍摄笔记</p>
                  </div>
                </div>

                <div class="mb-6">
                  <h3 class="text-lg font-bold text-[#F5F7FA] mb-3">坐标信息</h3>
                  <div class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] flex justify-between items-center">
                    <div>
                      <p class="text-[#F5F7FA]">{{ selectedLocationData.latitude.toFixed(6) }}, {{ selectedLocationData.longitude.toFixed(6) }}</p>
                      <p class="text-xs text-[#B8C6D8] mt-1">点击复制坐标</p>
                    </div>
                    <button
                      @click="copyCoords"
                      class="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#6B7C93] transition-colors"
                    >
                      复制
                    </button>
                  </div>
                </div>

                <div class="mb-6">
                  <h3 class="text-lg font-bold text-[#F5F7FA] mb-3">相关作品</h3>
                  <div v-if="locationPhotos.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div
                      v-for="photo in locationPhotos"
                      :key="photo.id"
                      class="group cursor-pointer"
                      @click="router.push(`/photo/${photo.id}`)"
                    >
                      <div class="aspect-square rounded-lg overflow-hidden border border-[#4A5F8B]">
                        <img
                          :src="photo.image"
                          :alt="photo.title"
                          class="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                        />
                      </div>
                      <p class="text-xs text-[#B8C6D8] mt-1 line-clamp-1">{{ photo.title }}</p>
                    </div>
                  </div>
                  <div v-else class="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] text-center">
                    <p class="text-[#B8C6D8]">暂无相关作品</p>
                    <button
                      @click="router.push('/profile-center/works?action=upload')"
                      class="mt-3 px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg text-sm font-medium hover:bg-[#6B7C93] transition-colors"
                    >
                      上传作品
                    </button>
                  </div>
                </div>

                <div class="flex space-x-3">
                  <button
                    @click="openEditLocationModal(selectedLocationData); isDetailModalOpen = false"
                    class="flex-1 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                  >
                    <i class="fa-solid fa-pen-to-square mr-2"></i> 编辑地点信息
                  </button>
                  <button
                    @click="router.push(`/profile-center/works?location=${selectedLocationData.id}`); isDetailModalOpen = false"
                    class="flex-1 py-3 bg-[#2D3748] text-[#F5F7FA] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors"
                  >
                    <i class="fa-solid fa-images mr-2"></i> 查看全部作品
                  </button>
                  <button
                    @click="handleDeleteLocation(selectedLocationData.id)"
                    class="py-3 px-4 bg-[#F56565] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#E53E3E] transition-colors"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="modal-fade">
          <div v-if="isNewLocationModalOpen" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click.self="isNewLocationModalOpen = false">
            <div class="bg-[#2D3748] rounded-xl border border-[#4A5F8B] max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
              <div class="p-6 border-b border-[#4A5F8B]">
                <div class="flex justify-between items-center">
                  <h3 class="text-xl font-bold text-[#F5F7FA]">{{ isEditMode ? '编辑地点' : '添加新地点' }}</h3>
                  <button
                    @click="isNewLocationModalOpen = false"
                    class="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                  >
                    <i class="fa-solid fa-times"></i>
                  </button>
                </div>
              </div>

              <div class="p-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-1">地点名称</label>
                    <input
                      type="text"
                      v-model="newLocationForm.name"
                      placeholder="请输入地点名称"
                      class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-1">详细地址</label>
                    <input
                      type="text"
                      v-model="newLocationForm.address"
                      placeholder="请输入详细地址"
                      class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                    />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-[#B8C6D8] mb-1">纬度</label>
                      <input
                        type="number"
                        v-model.number="newLocationForm.latitude"
                        step="0.000001"
                        placeholder="请输入纬度"
                        class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-[#B8C6D8] mb-1">经度</label>
                      <input
                        type="number"
                        v-model.number="newLocationForm.longitude"
                        step="0.000001"
                        placeholder="请输入经度"
                        class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-1">地点分类</label>
                    <div class="flex flex-wrap gap-2">
                      <label v-for="category in allCategories.filter(c => c !== '全部')" :key="category" class="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          :checked="newLocationForm.categories.includes(category)"
                          @change="handleCategoryToggle(category)"
                          class="accent-[#4A5F8B] text-[#4A5F8B]"
                        />
                        <span class="text-sm text-[#F5F7FA]">{{ category }}</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-1">评分</label>
                    <div class="flex items-center space-x-1">
                      <button
                        v-for="i in 5"
                        :key="i"
                        type="button"
                        @click="newLocationForm.rating = i"
                        :class="['p-2 rounded-lg transition-colors', newLocationForm.rating >= i ? 'text-yellow-400 bg-[#1E2532]' : 'text-[#4A5F8B]']"
                      >
                        <i class="fa-solid fa-star"></i>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-[#B8C6D8] mb-1">拍摄笔记</label>
                    <textarea
                      v-model="newLocationForm.notes"
                      placeholder="记录该地点的拍摄建议、最佳时间等信息"
                      class="w-full px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8] h-32 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div class="p-4 border-t border-[#4A5F8B] flex justify-end space-x-3">
                <button
                  @click="isNewLocationModalOpen = false"
                  class="px-6 py-3 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                >
                  取消
                </button>
                <button
                  @click="handleSubmitLocation"
                  class="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                >
                  {{ isEditMode ? '保存修改' : '添加地点' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { toast } from 'sonner'
import ShareButton from '../components/common/ShareButton.vue'

const router = useRouter()
const store = useAuthStore
const authState = reactive({ ...store.getState() })
const unsubscribe = store.subscribe((state) => {
  Object.assign(authState, state)
})
onUnmounted(unsubscribe)

interface Location {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
  photos: number
  image: string
  categories: string[]
  visitCount: number
  firstVisit: string
  lastVisit: string
  rating: number
  notes?: string
  isFavorite: boolean
}

interface PhotographyPost {
  id: string
  title: string
  image: string
  location: string
  date: string
  likes: number
  comments: number
}

interface NewLocationForm {
  name: string
  address: string
  latitude: number
  longitude: number
  categories: string[]
  notes?: string
  rating: number
}

const selectedLocation = ref<string | null>(null)
const searchTerm = ref('')
const selectedCategory = ref('全部')
const selectedTimeFilter = ref('全部')
const selectedActivityFilter = ref('全部')
const mapZoom = ref(1)
const mapPosition = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const isDetailModalOpen = ref(false)
const isNewLocationModalOpen = ref(false)
const isEditMode = ref(false)
const newLocationForm = ref<NewLocationForm>({
  name: '',
  address: '',
  latitude: 30.0,
  longitude: 115.0,
  categories: [],
  notes: '',
  rating: 3,
})
const mapRef = ref<HTMLDivElement | null>(null)

const mockLocations: Location[] = [
  {
    id: '1', name: '上海外滩', address: '上海市黄浦区中山东一路', latitude: 31.2304, longitude: 121.4737, photos: 256,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=shanghai%20bund%20skyline%20night%20photography%20location&sign=c5826fa443a4a31ae340466ff9a0c083',
    categories: ['城市', '建筑', '夜景'], visitCount: 12, firstVisit: '2023-05-10', lastVisit: '2023-10-22', rating: 5,
    notes: '黄昏和夜晚拍摄效果最佳，需要三脚架和ND滤镜', isFavorite: true,
  },
  {
    id: '2', name: '北京故宫', address: '北京市东城区景山前街4号', latitude: 39.9042, longitude: 116.4074, photos: 189,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=beijing%20forbidden%20city%20ancient%20architecture%20photography%20location&sign=48da96b2f5b3c60847d97d2acf789507',
    categories: ['历史', '建筑', '人文'], visitCount: 8, firstVisit: '2023-04-15', lastVisit: '2023-09-30', rating: 4,
    notes: '建议上午9点前到达，光线最佳且游客较少', isFavorite: false,
  },
  {
    id: '3', name: '杭州西湖', address: '浙江省杭州市西湖区龙井路1号', latitude: 30.2741, longitude: 120.1551, photos: 324,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=hangzhou%20west%20lake%20scenery%20landscape%20photography%20location&sign=962e534ce7b680e8e2a9e894a4967250',
    categories: ['自然', '风景', '湖泊'], visitCount: 15, firstVisit: '2023-03-20', lastVisit: '2023-10-15', rating: 5,
    notes: '春天桃花盛开和秋天枫叶红时是最佳拍摄季节', isFavorite: true,
  },
  {
    id: '4', name: '成都锦里', address: '四川省成都市武侯区武侯祠大街231号', latitude: 30.6575, longitude: 104.0663, photos: 156,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=chengdu%20jinli%20ancient%20street%20photography%20location%20china&sign=feb68402462ca5f58dbda88525c932ba',
    categories: ['古镇', '人文', '街拍'], visitCount: 6, firstVisit: '2023-07-05', lastVisit: '2023-10-08', rating: 4,
    notes: '晚上灯光亮起后氛围更佳，适合人文纪实摄影', isFavorite: false,
  },
  {
    id: '5', name: '张家界国家森林公园', address: '湖南省张家界市武陵源区', latitude: 29.1175, longitude: 110.4878, photos: 218,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=zhangjiajie%20national%20forest%20park%20mountains%20photography%20location%20china&sign=f696cf51c01cfd7dbe99084a34020ec0',
    categories: ['自然', '风景', '山脉'], visitCount: 10, firstVisit: '2023-06-15', lastVisit: '2023-09-20', rating: 5,
    notes: '云海景观最佳季节是春末夏初，建议住在景区内以便早起拍摄', isFavorite: true,
  },
  {
    id: '6', name: '广州塔', address: '广东省广州市海珠区阅江西路222号', latitude: 23.1291, longitude: 113.2644, photos: 178,
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=guangzhou%20tower%20modern%20architecture%20photography%20location%20china&sign=de1bb556dbf0b35adcc7f22f45323226',
    categories: ['城市', '建筑', '现代'], visitCount: 7, firstVisit: '2023-08-10', lastVisit: '2023-10-05', rating: 4,
    notes: '最佳拍摄位置在珠江对岸的花城广场', isFavorite: false,
  }
]

const locationImages: Record<string, string[]> = {
  '1': [
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=shanghai%20bund%20night%20photography%201&sign=c8632ab0baac9118aae370c9eba03560",
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=shanghai%20bund%20architecture%20photography%202&sign=73abc13d604aacd63477f0e580ab50a8",
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=shanghai%20skyline%20photography%203&sign=176e9027d3008a6f4f33eebb8fa8a29e"
  ],
  '2': [
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=beijing%20forbidden%20city%20sunset%20photography%201&sign=73f666bf8bd3385d90765b17645661f0",
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=beijing%20ancient%20architecture%20photography%202&sign=62eb7f3ee8320f591b037414b2d69358"
  ],
  '3': [
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=hangzhou%20west%20lake%20morning%20photography%201&sign=fffc651f0aa5ad61cf22a9fa5d243683",
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=west%20lake%20pagoda%20photography%202&sign=4590a8dda0aac1ed428c53a8b561cb71",
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=hangzhou%20garden%20photography%203&sign=ea347165f0dc375a7ebda5fb1aa035c4"
  ],
  '4': [
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=chengdu%20jinli%20ancient%20street%20night%201&sign=4afd852ddebde6f9093ea00d9c6247e3",
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=jinli%20traditional%20architecture%202&sign=c206a633862358ad06e149b114bd0672"
  ],
  '5': [
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=zhangjiajie%20mountains%20cloud%20photography%201&sign=55a785ce2ab9c389fc508cf4e996e71e",
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=zhangjiajie%20forest%20park%202&sign=7e44e8a25986262bd92f640e276d0541"
  ],
  '6': [
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=guangzhou%20tower%20night%20photography%201&sign=e22b19a088cd6bd7acc85661bac8b588",
    "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=guangzhou%20cbd%20skyline%20photography%202&sign=6d76ebd95c29e78ec9e5cfef5445c71c"
  ]
}

const getPhotosByLocation = (locationId: string): PhotographyPost[] => {
  const location = mockLocations.find(loc => loc.id === locationId)
  if (!location) return []

  const images = locationImages[locationId] || []

  return Array.from({ length: Math.min(4, images.length) }, (_, i) => ({
    id: `${locationId}-photo-${i + 1}`,
    title: `${location.name}作品 ${i + 1}`,
    image: images[i],
    location: location.name,
    date: `2023-10-${10 + i}`,
    likes: Math.floor(Math.random() * 100) + 50,
    comments: Math.floor(Math.random() * 20) + 5,
  }))
}

const getFilteredLocations = (): Location[] => {
  let locations = [...mockLocations]

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    locations = locations.filter(location =>
      location.name.toLowerCase().includes(term) ||
      location.address.toLowerCase().includes(term)
    )
  }

  if (selectedCategory.value !== '全部') {
    locations = locations.filter(location =>
      location.categories.includes(selectedCategory.value)
    )
  }

  if (selectedTimeFilter.value !== '全部') {
    const now = new Date()
    locations = locations.filter(location => {
      const lastVisitDate = new Date(location.lastVisit)
      const diffTime = now.getTime() - lastVisitDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (selectedTimeFilter.value === '一周内') return diffDays <= 7
      if (selectedTimeFilter.value === '一月内') return diffDays <= 30
      if (selectedTimeFilter.value === '三月内') return diffDays <= 90
      if (selectedTimeFilter.value === '一年内') return diffDays <= 365

      return true
    })
  }

  if (selectedActivityFilter.value !== '全部') {
    locations = locations.filter(location => {
      if (selectedActivityFilter.value === '高活跃') return location.visitCount >= 10
      if (selectedActivityFilter.value === '中活跃') return location.visitCount >= 5 && location.visitCount < 10
      if (selectedActivityFilter.value === '低活跃') return location.visitCount < 5

      return true
    })
  }

  return locations
}

const getAllCategories = (): string[] => {
  const categories = ['全部']
  mockLocations.forEach(location => {
    location.categories.forEach(category => {
      if (!categories.includes(category)) {
        categories.push(category)
      }
    })
  })
  return categories
}

const generateStatsData = () => {
  return mockLocations.map(location => ({
    name: location.name,
    photos: location.photos,
    visits: location.visitCount,
  }))
}

const handleMapWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? 0.9 : 1.1
  mapZoom.value = Math.min(Math.max(0.5, mapZoom.value * delta), 3)
}

const handleMapMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  dragStart.value = { x: e.clientX, y: e.clientY }
}

const handleMapMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  mapPosition.value = {
    x: mapPosition.value.x + dx,
    y: mapPosition.value.y + dy
  }
  dragStart.value = { x: e.clientX, y: e.clientY }
}

const handleMapMouseUp = () => {
  isDragging.value = false
}

const openDetailModal = (locationId: string) => {
  selectedLocation.value = locationId
  isDetailModalOpen.value = true
}

const openNewLocationModal = () => {
  isEditMode.value = false
  newLocationForm.value = {
    name: '',
    address: '',
    latitude: 30.0,
    longitude: 115.0,
    categories: [],
    notes: '',
    rating: 3,
  }
  isNewLocationModalOpen.value = true
}

const openEditLocationModal = (location: Location) => {
  isEditMode.value = true
  newLocationForm.value = {
    name: location.name,
    address: location.address,
    latitude: location.latitude,
    longitude: location.longitude,
    categories: [...location.categories],
    notes: location.notes || '',
    rating: location.rating,
  }
  selectedLocation.value = location.id
  isNewLocationModalOpen.value = true
}

const handleSubmitLocation = () => {
  toast.success(isEditMode.value ? '地点信息已更新' : '新地点已添加')
  isNewLocationModalOpen.value = false

  newLocationForm.value = {
    name: '',
    address: '',
    latitude: 30.0,
    longitude: 115.0,
    categories: [],
    notes: '',
    rating: 3,
  }
}

const handleDeleteLocation = (locationId: string) => {
  if (window.confirm('确定要删除这个拍摄地点吗？此操作无法撤销。')) {
    toast.success('地点已删除')
    isDetailModalOpen.value = false
    selectedLocation.value = null
  }
}

const handleCategoryToggle = (category: string) => {
  if (newLocationForm.value.categories.includes(category)) {
    newLocationForm.value.categories = newLocationForm.value.categories.filter(c => c !== category)
  } else {
    newLocationForm.value.categories = [...newLocationForm.value.categories, category]
  }
}

const toggleFavorite = () => {
  if (selectedLocationData.value) {
    toast.success(selectedLocationData.value.isFavorite ? '已取消收藏' : '已添加到收藏')
  }
}

const copyCoords = () => {
  if (selectedLocationData.value) {
    navigator.clipboard.writeText(`${selectedLocationData.value.latitude.toFixed(6)}, ${selectedLocationData.value.longitude.toFixed(6)}`)
    toast.success('坐标已复制到剪贴板')
  }
}

const filteredLocations = computed(() => getFilteredLocations())
const allCategories = computed(() => getAllCategories())
const locationPhotos = computed(() => selectedLocation.value ? getPhotosByLocation(selectedLocation.value) : [])
const statsData = computed(() => generateStatsData())
const selectedLocationData = computed(() => selectedLocation.value ? mockLocations.find(loc => loc.id === selectedLocation.value) || null : null)
const totalPhotos = computed(() => mockLocations.reduce((sum, loc) => sum + loc.photos, 0))
const favoriteLocations = computed(() => mockLocations.filter(loc => loc.isFavorite).length)
const maxPhotos = computed(() => Math.max(...statsData.value.map(d => d.photos)) || 1)
const maxVisits = computed(() => Math.max(...statsData.value.map(d => d.visits)) || 1)

// Handle dragging with event listeners
watch([isDragging, dragStart], ([dragging]) => {
  const moveHandler = (e: Event) => handleMapMouseMove(e as MouseEvent)
  const upHandler = () => handleMapMouseUp()
  if (dragging) {
    document.addEventListener('mousemove', moveHandler)
    document.addEventListener('mouseup', upHandler)
    return () => {
      document.removeEventListener('mousemove', moveHandler)
      document.removeEventListener('mouseup', upHandler)
    }
  }
})
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>