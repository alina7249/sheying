<template>
  <div class="home-page">
    <!-- Premium Background Effects -->
    <div class="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0F1C2D] to-[#050810] pointer-events-none z-0"></div>
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;);"></div>
    <div class="fixed top-0 left-1/4 w-96 h-96 bg-[#4A5F8B]/10 rounded-full blur-3xl pointer-events-none z-0"></div>
    <div class="fixed bottom-0 right-1/4 w-[28rem] h-[28rem] bg-purple-500/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    
    <!-- Main Content -->
    <div class="relative z-10">
      <div class="container mx-auto px-4 py-12">
        <!-- Hero Section with Premium Design -->
        <section class="relative mb-24 overflow-hidden rounded-3xl">
          <div class="absolute inset-0 bg-gradient-to-br from-[#4A5F8B]/20 via-transparent to-purple-900/10"></div>
          <div class="relative px-8 py-20 md:py-28">
            <div class="max-w-4xl">
              <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-6">
                <span class="w-2 h-2 rounded-full bg-[#48BB78] animate-pulse"></span>
                <span class="text-sm text-[#B8C6D8] tracking-wide">摄影爱好者社区</span>
              </div>
              <h1 class="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                用光影
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#63B3ED] via-[#4A5F8B] to-purple-400">
                  讲述故事
                </span>
              </h1>
              <p class="text-xl text-[#B8C6D8] mb-10 max-w-2xl leading-relaxed">
                加入专业摄影师社区，分享你的作品，学习大师技巧，探索无限可能
              </p>
              <div class="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" class="!px-8 !py-4 !rounded-xl !bg-gradient-to-r !from-[#4A5F8B] !to-[#63B3ED] !shadow-lg !shadow-[#4A5F8B]/30">
                  开始创作
                  <i class="fa-solid fa-arrow-right ml-2"></i>
                </Button>
                <Button variant="outline" size="lg" class="!px-8 !py-4 !rounded-xl !border-white/20 !text-white hover:!bg-white/10">
                  探索作品
                </Button>
              </div>
            </div>
          </div>
        </section>

        <!-- Weather & Photo Tips Widget with Premium Design -->
        <div class="weather-widget fade-in-up mb-20 bg-gradient-to-br from-[#1E2532]/80 to-[#2D3748]/50 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl shadow-black/20" style="animation-delay: 0.2s;">
          <div class="weather-header flex flex-wrap gap-8 items-start justify-between mb-8">
            <div class="location-info flex items-center gap-6">
              <div class="location-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4A5F8B] to-[#3A4B6F] flex items-center justify-center text-3xl text-white shadow-lg shadow-[#4A5F8B]/30">
                <i class="fa-solid fa-cloud-sun"></i>
              </div>
              <div>
                <h3 class="location-name text-2xl font-bold text-white mb-1">北京市 - 今天</h3>
                <p class="location-time text-[#B8C6D8]">2025年11月17日 17:41</p>
              </div>
            </div>
            <div class="temp-display flex items-center gap-8">
              <span class="current-temp text-6xl font-bold text-white">15°C</span>
              <div class="temp-range flex items-center gap-4 text-[#B8C6D8]">
                <div class="temp-item flex items-center gap-2">
                  <i class="fa-solid fa-temperature-low"></i>
                  <span>10°C</span>
                </div>
                <span class="temp-divider text-[#4A5F8B]">/</span>
                <div class="temp-item flex items-center gap-2">
                  <i class="fa-solid fa-temperature-high"></i>
                  <span>18°C</span>
                </div>
              </div>
            </div>
          </div>

          <div class="weather-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div v-for="stat in weatherStats" :key="stat.label" class="weather-stat-card bg-[#0F1C2D]/60 rounded-2xl p-5 border border-[#4A5F8B]/10 transition-all duration-300 hover:-translate-y-1 hover:border-[#4A5F8B]/30 hover:bg-[#0F1C2D]/80">
              <div class="stat-icon w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A5F8B]/20 to-[#4A5F8B]/5 flex items-center justify-center text-[#63B3ED] text-xl mb-3">
                <i :class="stat.icon"></i>
              </div>
              <div class="stat-info">
                <p class="stat-label text-xs text-[#6B7C93] uppercase tracking-wider mb-1">{{ stat.label }}</p>
                <p class="stat-value text-xl font-semibold text-white">{{ stat.value }}</p>
              </div>
            </div>
          </div>

          <div class="photo-tip-section bg-gradient-to-r from-[#4A5F8B]/10 to-purple-900/5 rounded-2xl p-6 border border-[#4A5F8B]/10">
            <div class="tip-header flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#4A5F8B]/20 flex items-center justify-center text-[#63B3ED]">
                <i class="fa-solid fa-lightbulb"></i>
              </div>
              <h4 class="text-lg font-semibold text-white">今日摄影建议</h4>
            </div>
            <p class="tip-text text-[#B8C6D8] mb-5 leading-relaxed">
              今日天气晴朗，微风，非常适合户外摄影。下午光线柔和，是拍摄人像和风光的黄金时段。
            </p>
            <div class="tip-ratings grid grid-cols-2 md:grid-cols-4 gap-3">
              <div v-for="rating in photoRatings" :key="rating.label" class="rating-item bg-[#0F1C2D]/60 rounded-xl p-4 border border-[#4A5F8B]/10 text-center">
                <p class="rating-label text-xs text-[#6B7C93] uppercase tracking-wider mb-2">{{ rating.label }}</p>
                <div class="stars flex justify-center gap-1">
                  <i v-for="star in 5" :key="star" :class="['fa-solid fa-star text-sm', star <= rating.value ? 'text-[#4A5F8B]' : 'text-[#2D3748]']"></i>
                </div>
              </div>
            </div>
          </div>

          <div class="forecast-section mt-8 pt-6 border-t border-[#4A5F8B]/10">
            <h4 class="forecast-title text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <i class="fa-solid fa-calendar text-[#63B3ED]"></i>
              未来天气预报
            </h4>
            <div class="forecast-scroll flex gap-4 overflow-x-auto pb-2">
              <div v-for="(day, index) in dailyForecast" :key="index" class="forecast-card flex-shrink-0 w-28 bg-[#0F1C2D]/60 rounded-2xl p-5 text-center border border-[#4A5F8B]/10 transition-all duration-300 hover:-translate-y-2 hover:border-[#4A5F8B]/30 hover:bg-[#0F1C2D]/80">
                <p class="forecast-day text-sm font-semibold text-white mb-4">{{ day.day }}</p>
                <div class="forecast-icon w-12 h-12 mx-auto rounded-full bg-[#4A5F8B]/10 flex items-center justify-center mb-4 text-[#63B3ED] text-xl">
                  <i :class="['fa-solid', day.icon]"></i>
                </div>
                <p class="forecast-weather text-xs text-[#6B7C93] mb-2">{{ day.weather }}</p>
                <p class="forecast-temp text-sm font-semibold text-white">{{ day.temp }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Featured Topics with Premium Design -->
        <section class="mb-24">
          <div class="section-header fade-in-up mb-10 flex items-end justify-between" style="animation-delay: 0.35s;">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <span class="w-1 h-8 bg-gradient-to-b from-[#4A5F8B] to-[#63B3ED] rounded-full"></span>
                <span class="text-sm font-medium text-[#63B3ED] tracking-widest uppercase">精选专题</span>
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">探索摄影主题</h2>
              <p class="text-[#B8C6D8]">发现精心策划的摄影专题，激发你的创作灵感</p>
            </div>
          </div>
          
          <div class="featured-topics grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(topic, index) in featuredTopics" :key="topic.id" class="topic-card group relative rounded-3xl overflow-hidden h-80 cursor-pointer transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-[#4A5F8B]/20" :style="{ animationDelay: `${index * 0.1}s` }" role="button" tabindex="0" @click="router.push('/topics/' + topic.id)" @keydown.enter="router.push('/topics/' + topic.id)">
              <LazyImage :src="topic.image" :alt="topic.title" class="topic-image absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="topic-overlay absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/60 to-transparent flex flex-col justify-end p-8">
                <div class="topic-content">
                  <span class="topic-badge inline-block px-4 py-1.5 bg-[#4A5F8B] text-white text-xs font-semibold rounded-full mb-4">{{ topic.badge }}</span>
                  <h3 class="topic-title text-2xl font-bold text-white mb-2 group-hover:text-[#63B3ED] transition-colors">{{ topic.title }}</h3>
                  <p class="topic-desc text-[#B8C6D8] mb-4">{{ topic.description }}</p>
                  <div class="topic-meta flex gap-6 text-sm text-[#B8C6D8]/80">
                    <span class="flex items-center gap-2">
                      <i class="fa-solid fa-images"></i>
                      {{ topic.photos }} 作品
                    </span>
                    <span class="flex items-center gap-2">
                      <i class="fa-solid fa-users"></i>
                      {{ topic.photographers }} 摄影师
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Inspiration Column with Premium Design -->
        <section class="mb-24">
          <div class="section-header fade-in-up mb-10 flex items-end justify-between" style="animation-delay: 0.5s;">
            <div>
              <div class="flex items-center gap-3 mb-3">
                <span class="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></span>
                <span class="text-sm font-medium text-purple-400 tracking-widest uppercase">灵感专栏</span>
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">创意灵感</h2>
              <p class="text-[#B8C6D8]">探索来自全球摄影师的创意灵感</p>
            </div>
          </div>

          <div class="inspiration-scroll flex gap-6 overflow-x-auto pb-6">
            <div v-for="(item, index) in inspirationItems" :key="item.id" class="inspiration-card flex-shrink-0 w-80 bg-gradient-to-br from-[#1E2532] to-[#2D3748] border border-[#4A5F8B]/20 rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-[#4A5F8B]/50 hover:shadow-2xl hover:shadow-[#4A5F8B]/15 group" :style="{ animationDelay: `${index * 0.1}s` }" role="button" tabindex="0" @click="router.push('/inspiration/' + item.id)" @keydown.enter="router.push('/inspiration/' + item.id)">
              <div class="inspiration-image-wrapper relative aspect-[4/3] overflow-hidden">
                <LazyImage :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div class="inspiration-overlay absolute inset-0 bg-gradient-to-t from-[#0a0f1a]/90 to-transparent flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="overlay-content">
                    <span class="inspiration-tag inline-block px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">创意灵感</span>
                  </div>
                </div>
              </div>
              <div class="inspiration-content p-6">
                <h3 class="inspiration-title text-xl font-bold text-white mb-2 group-hover:text-[#63B3ED] transition-colors">{{ item.title }}</h3>
                <p class="inspiration-desc text-[#B8C6D8] text-sm mb-4 line-clamp-2 leading-relaxed">{{ item.description }}</p>
                <div class="inspiration-footer flex items-center justify-between">
                  <span class="author-name text-sm text-[#4A5F8B] font-medium">by {{ item.author }}</span>
                  <div class="flex items-center gap-2 text-[#63B3ED] group-hover:translate-x-1 transition-transform">
                    <span class="text-xs font-medium">查看详情</span>
                    <i class="fa-solid fa-arrow-right text-sm"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Promo Banner with Premium Design -->
        <section class="mb-24">
          <div class="promo-banner fade-in-up relative overflow-hidden rounded-3xl cursor-pointer" style="animation-delay: 0.7s;" role="button" tabindex="0" @click="router.push('/membership')" @keydown.enter="router.push('/membership')">
            <div class="absolute inset-0 bg-gradient-to-br from-[#4A5F8B]/30 via-purple-900/20 to-[#0a0f1a]"></div>
            <div class="absolute top-0 right-0 w-96 h-96 bg-[#63B3ED]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div class="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div class="promo-content relative p-10 md:p-16">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span class="promo-badge inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white text-sm font-semibold rounded-full mb-6">
                    <i class="fa-solid fa-party-horn"></i>
                    热门活动
                  </span>
                  <h2 class="promo-title text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">2025春季风光摄影大赛</h2>
                  <p class="promo-desc text-lg text-[#B8C6D8] mb-8 leading-relaxed">参与大赛赢取丰厚奖金和专业摄影器材，展示你的摄影才华，与全球摄影师同台竞技</p>
                  <div class="promo-stats flex flex-wrap gap-8 mb-8">
                    <div class="stat">
                      <span class="stat-num block text-3xl font-bold text-[#63B3ED]">3,847</span>
                      <span class="stat-label text-sm text-[#B8C6D8]">参赛者</span>
                    </div>
                    <div class="stat">
                      <span class="stat-num block text-3xl font-bold text-[#63B3ED]">¥10,000</span>
                      <span class="stat-label text-sm text-[#B8C6D8]">一等奖</span>
                    </div>
                    <div class="stat">
                      <span class="stat-num block text-3xl font-bold text-[#63B3ED]">12</span>
                      <span class="stat-label text-sm text-[#B8C6D8]">天倒计时</span>
                    </div>
                  </div>
                  <Button variant="primary" class="!px-8 !py-4 !rounded-xl !bg-gradient-to-r !from-[#4A5F8B] !to-[#63B3ED] !shadow-lg !shadow-[#4A5F8B]/30 hover:!shadow-[#4A5F8B]/50" @click.stop="handleJoin">
                    立即参与
                    <i class="fa-solid fa-arrow-right ml-2"></i>
                  </Button>
                </div>
                <div class="promo-image relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl shadow-[#4A5F8B]/20">
                  <LazyImage src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop" alt="摄影大赛" class="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <!-- Left Column - Main Content -->
          <div class="lg:col-span-2">
            <!-- Filter Section -->
            <div class="filter-section fade-in-up mb-8" style="animation-delay: 0.8s;">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <span class="w-1 h-8 bg-gradient-to-b from-[#48BB78] to-emerald-600 rounded-full"></span>
                  <h2 class="text-2xl font-bold text-white">精选作品</h2>
                </div>
              </div>
              <div class="filter-buttons flex flex-wrap gap-3">
                <button v-for="(category, index) in categories" :key="category.id" @click="selectedCategory = category.id" :class="['px-6 py-3 rounded-2xl font-medium transition-all duration-300', selectedCategory === category.id ? 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white shadow-lg shadow-[#4A5F8B]/30' : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B]/20 hover:border-[#4A5F8B]/50 hover:bg-[#2D3748]']" :aria-pressed="selectedCategory === category.id">
                  {{ category.name }}
                </button>
              </div>
            </div>

            <!-- Photo Grid -->
            <div class="photo-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div v-for="(post, index) in filteredPosts" :key="post.id" class="photo-card-wrapper fade-in-up" :style="{ animationDelay: `${0.9 + index * 0.1}s` }">
                <PhotographyCard :post="post" />
              </div>
            </div>

            <!-- Load More -->
            <div class="load-more-section fade-in-up text-center" style="animation-delay: 1.4s;">
              <Button variant="outline" size="lg" class="!px-10 !py-4 !rounded-2xl !border-[#4A5F8B]/30 !text-[#B8C6D8] hover:!bg-[#4A5F8B]/10 hover:!border-[#4A5F8B]/60 hover:!text-white" @click="handleLoadMore" aria-label="加载更多摄影作品">
                <i class="fa-solid fa-inbox mr-2"></i>
                加载更多作品
              </Button>
            </div>
          </div>

          <!-- Right Column - Sidebar -->
          <div class="space-y-8">
            <!-- Search -->
            <div class="search-section fade-in-up" style="animation-delay: 1s;">
              <div class="search-wrapper relative">
                <i class="fa-solid fa-search absolute left-5 top-1/2 -translate-y-1/2 text-[#6B7C93] text-lg"></i>
                <input type="search" name="search" autocomplete="off" v-model="searchQuery" placeholder="搜索作品、摄影师或风格…" class="w-full pl-14 pr-5 py-4 bg-[#1E2532] border border-[#4A5F8B]/20 text-white placeholder-[#6B7C93] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all" />
              </div>
            </div>

            <!-- Popular Tags -->
            <div class="sidebar-card fade-in-up bg-gradient-to-br from-[#1E2532] to-[#2D3748] border border-[#4A5F8B]/20 rounded-3xl p-7" style="animation-delay: 1.1s;">
              <h3 class="sidebar-title text-lg font-bold text-white mb-6 flex items-center gap-2">
                <i class="fa-solid fa-fire text-orange-400"></i>
                热门风格
              </h3>
              <div class="tags-cloud flex flex-wrap gap-2">
                <router-link v-for="tag in popularTags" :key="tag.id" :to="'/search?tag=' + tag.name" class="tag-chip px-4 py-2.5 bg-[#0F1C2D]/60 text-[#B8C6D8] border border-[#4A5F8B]/10 rounded-full text-sm font-medium hover:bg-[#4A5F8B] hover:text-white hover:border-[#4A5F8B] transition-all duration-300">
                  #{{ tag.name }}
                  <span class="tag-count text-[#6B7C93] ml-1.5">({{ tag.count }})</span>
                </router-link>
              </div>
            </div>

            <!-- Leaderboard -->
            <div class="sidebar-card fade-in-up bg-gradient-to-br from-[#1E2532] to-[#2D3748] border border-[#4A5F8B]/20 rounded-3xl p-7" style="animation-delay: 1.2s;">
              <h3 class="sidebar-title text-lg font-bold text-white mb-6 flex items-center gap-2">
                <i class="fa-solid fa-trophy text-yellow-400"></i>
                本周新星
              </h3>
              <div class="leaderboard space-y-3">
                <div v-for="(user, index) in weeklyLeaders" :key="user.id" class="leader-item flex items-center gap-4 p-4 bg-[#0F1C2D]/60 rounded-2xl border border-[#4A5F8B]/10 hover:border-[#4A5F8B]/30 transition-all duration-300 hover:bg-[#0F1C2D]/80">
                  <div class="leader-rank w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" :class="index < 3 ? 'bg-gradient-to-br from-[#4A5F8B] to-[#63B3ED] text-white shadow-lg shadow-[#4A5F8B]/30' : 'bg-[#4A5F8B]/10 text-[#6B7C93]'">
                    <span v-if="index < 3">{{ index + 1 }}</span>
                    <i v-else class="fa-solid fa-user text-xs"></i>
                  </div>
                  <img :src="user.avatar" :alt="user.name" class="leader-avatar w-11 h-11 rounded-full object-cover border-2 border-[#4A5F8B]" />
                  <div class="leader-info flex-1 min-w-0">
                    <p class="leader-name text-sm font-semibold text-white truncate">{{ user.name }}</p>
                    <p class="leader-stats text-xs text-[#B8C6D8]">{{ user.likes }} 获赞</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Featured Photographers -->
            <div class="sidebar-card fade-in-up bg-gradient-to-br from-[#1E2532] to-[#2D3748] border border-[#4A5F8B]/20 rounded-3xl p-7" style="animation-delay: 1.3s;">
              <h3 class="sidebar-title text-lg font-bold text-white mb-6 flex items-center gap-2">
                <i class="fa-solid fa-users text-[#63B3ED]"></i>
                推荐艺术家
              </h3>
              <div class="photographers-list space-y-5">
                <div v-for="photographer in featuredPhotographers" :key="photographer.id" class="photographer-item flex items-center justify-between gap-4" role="button" tabindex="0" @click="router.push('/profile/' + photographer.id)" @keydown.enter="router.push('/profile/' + photographer.id)">
                  <div class="photographer-info flex items-center gap-4 flex-1 min-w-0">
                    <img :src="photographer.avatar" :alt="photographer.name" class="photographer-avatar w-12 h-12 rounded-full object-cover border-2 border-[#4A5F8B] transition-transform duration-300 hover:scale-110" />
                    <div class="photographer-details min-w-0">
                      <p class="photographer-name text-sm font-semibold text-white truncate">{{ photographer.name }}</p>
                      <span class="photographer-level inline-block text-xs text-[#63B3ED] font-medium px-2 py-0.5 bg-[#4A5F8B]/10 rounded-full mt-1">{{ photographer.level }}</span>
                      <p class="photographer-stats text-xs text-[#B8C6D8] mt-1">{{ photographer.followers.toLocaleString() }}粉丝 · {{ photographer.posts }}作品</p>
                    </div>
                  </div>
                  <Button variant="primary" size="sm" class="!px-4 !py-2 !rounded-xl" @click="handleFollow(photographer.name)">
                    关注
                  </Button>
                </div>
              </div>
            </div>

            <!-- Special Banner -->
            <div class="sidebar-card special-card fade-in-up bg-gradient-to-br from-emerald-900/30 via-[#1E2532] to-[#0F1C2D] border border-emerald-500/20 rounded-3xl overflow-hidden" style="animation-delay: 1.4s;">
              <div class="special-content p-7 text-center">
                <h3 class="special-title text-xl font-bold text-white mb-3">黑白影像专题</h3>
                <p class="special-desc text-sm text-[#B8C6D8] mb-6 leading-relaxed">探索黑白摄影的艺术魅力，感受光影交织的视觉语言和情感表达</p>
                <div class="special-image-wrapper rounded-2xl overflow-hidden mb-6 aspect-video">
                  <LazyImage src="https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=1600&auto=format&fit=crop" alt="黑白影像专题" class="w-full h-full object-cover" />
                </div>
                <Button variant="primary" class="!w-full !py-3 !rounded-xl !bg-gradient-to-r !from-emerald-500 !to-emerald-600 hover:!from-emerald-600 hover:!to-emerald-700" @click="handleJoin">
                  探索专题
                  <i class="fa-solid fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';
import Banner from '../components/Banner.vue';
import Feature from '../components/Feature.vue';
import PhotographyCard from '../components/PhotographyCard.vue';
import Button from '../components/common/Button.vue';
import LazyImage from '../components/LazyImage.vue';
import '../components/Animations.vue';

const categories = [
  { id: 'all', name: '全部' },
  { id: '极简主义', name: '极简主义' },
  { id: '黑白', name: '黑白' },
  { id: '胶片', name: '胶片质感' },
  { id: '暗调', name: '暗调氛围' }
];

const photoRatings = [
  { label: '风光摄影', value: 4 },
  { label: '人像摄影', value: 5 },
  { label: '街拍', value: 4 },
  { label: '夜景摄影', value: 3 }
];

const weatherStats = [
  { label: '湿度', value: '45%', icon: 'fa-solid fa-tint' },
  { label: '风速', value: '3级', icon: 'fa-solid fa-wind' },
  { label: '紫外线', value: '弱', icon: 'fa-solid fa-sun' },
  { label: '日出日落', value: '06:58/17:05', icon: 'fa-solid fa-sunrise' }
];

const photographyPosts = [
  {
    id: '1',
    title: '黑白光影',
    description: 'Leica Q2 Monochrom | 光圈: f/2.8 | 快门: 1/125s | ISO: 800\n极简主义黑白摄影，通过光影对比展现建筑的几何美感。',
    image: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=1600&auto=format&fit=crop',
    author: {
      id: '1',
      name: '极简摄影师林风',
      avatar: 'https://picsum.photos/400/400?random=208'
    },
    likes: 342,
    comments: 42,
    collections: 28,
    tags: ['极简主义', '黑白', '建筑', '徕卡'],
    date: '2023-10-25'
  },
  {
    id: '2',
    title: '胶片质感人像',
    description: 'Canon AE-1 + 50mm f/1.4 | 光圈: f/2.0 | 快门: 1/125s | ISO: 400\n使用复古胶片相机拍摄的人像作品，自然柔和的色调与颗粒感。',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1600&auto=format&fit=crop',
    author: {
      id: '2',
      name: '胶片摄影师安娜',
      avatar: 'https://picsum.photos/400/400?random=209'
    },
    likes: 412,
    comments: 56,
    collections: 35,
    tags: ['人像', '胶片', '复古', '自然光'],
    date: '2023-10-24'
  },
  {
    id: '3',
    title: '暗调氛围',
    description: 'Sony A7R IV + 35mm f/1.4 GM | 光圈: f/2.8 | 快门: 1/60s | ISO: 1600\n营造神秘而富有故事感的暗调氛围人像，强调光影层次与情绪表达。',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop',
    author: {
      id: '3',
      name: '情绪摄影师李明',
      avatar: 'https://picsum.photos/400/400?random=210'
    },
    likes: 389,
    comments: 49,
    collections: 31,
    tags: ['暗调', '氛围', '情绪', '人像'],
    date: '2023-10-23'
  },
  {
    id: '4',
    title: '极简静物',
    description: 'Fujifilm GFX 100S + 120mm f/4 Macro | 光圈: f/5.6 | 快门: 1/125s | ISO: 200\n通过简洁的构图和柔和的光线，展现日常物品的质感与美感。',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600&auto=format&fit=crop',
    author: {
      id: '4',
      name: '静物摄影师王静',
      avatar: 'https://picsum.photos/400/400?random=211'
    },
    likes: 276,
    comments: 32,
    collections: 22,
    tags: ['静物', '极简', '中画幅', '富士'],
    date: '2023-10-22'
  },
  {
    id: '5',
    title: '城市几何',
    description: 'iPhone 15 Pro + 原生相机 | 光圈: f/2.2 | 快门: 1/1000s | ISO: 25\n从独特视角发现城市中的几何美感，手机摄影也能创造艺术作品。',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop',
    author: {
      id: '5',
      name: '手机摄影师张强',
      avatar: 'https://picsum.photos/400/400?random=212'
    },
    likes: 321,
    comments: 41,
    collections: 25,
    tags: ['城市', '几何', '手机摄影', '极简'],
    date: '2023-10-21'
  },
  {
    id: '6',
    title: '黑白纪实',
    description: 'Canon EOS R6 + 24-70mm f/2.8 | 光圈: f/4 | 快门: 1/250s | ISO: 800\n用黑白影像记录城市中的人文瞬间，展现生活的真实与温度。',
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=1600&auto=format&fit=crop',
    author: {
      id: '6',
      name: '纪实摄影师陈默',
      avatar: 'https://picsum.photos/400/400?random=213'
    },
    likes: 398,
    comments: 52,
    collections: 33,
    tags: ['黑白', '纪实', '人文', '街头'],
    date: '2023-10-20'
  }
];

const popularTags = [
  { id: 1, name: '极简主义', count: 1456 },
  { id: 2, name: '黑白', count: 1245 },
  { id: 3, name: '胶片质感', count: 987 },
  { id: 4, name: '暗调氛围', count: 765 },
  { id: 5, name: '建筑', count: 654 },
  { id: 6, name: '人像', count: 543 },
  { id: 7, name: '城市几何', count: 432 },
  { id: 8, name: '静物', count: 321 }
];

const featuredPhotographers = [
  {
    id: '101',
    name: '黑白影像达人',
    avatar: 'https://picsum.photos/400/400?random=220',
    followers: 12543,
    posts: 324,
    level: '新锐艺术家'
  },
  {
    id: '102',
    name: '胶片艺术师',
    avatar: 'https://picsum.photos/400/400?random=221',
    followers: 8765,
    posts: 213,
    level: '资深摄影师'
  },
  {
    id: '103',
    name: '建筑几何控',
    avatar: 'https://picsum.photos/400/400?random=222',
    followers: 6543,
    posts: 187,
    level: '创意摄影师'
  }
];

const inspirationItems = [
  {
    id: '1',
    title: '黑白摄影的光影艺术',
    author: '林风',
    description: '探索如何通过光影对比创造出富有情感和深度的黑白影像作品',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: '2',
    title: '胶片摄影的复兴与现代应用',
    author: '安娜',
    description: '探讨胶片摄影在数字时代的独特魅力和应用场景',
    image: 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: '3',
    title: '极简主义摄影的构图法则',
    author: '李明',
    description: '解析极简主义摄影的核心构图原则，帮助你创造简洁有力的视觉表达',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: '4',
    title: '暗房技术与现代数字暗房',
    author: '张强',
    description: '比较传统暗房技术与现代数字暗房的异同',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1600&auto=format&fit=crop'
  }
];

const dailyForecast = [
  { day: '明天', weather: '多云', temp: '12°/17°', icon: 'fa-cloud' },
  { day: '周一', weather: '晴', temp: '10°/19°', icon: 'fa-sun' },
  { day: '周二', weather: '晴转多云', temp: '9°/18°', icon: 'fa-cloud-sun' },
  { day: '周三', weather: '小雨', temp: '8°/15°', icon: 'fa-cloud-rain' },
  { day: '周四', weather: '阴', temp: '7°/14°', icon: 'fa-cloud' }
];

const featuredTopics = [
  {
    id: '1',
    title: '城市风光摄影',
    description: '捕捉都市天际线的独特魅力',
    badge: '热门专题',
    photos: 2847,
    photographers: 456,
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: '2',
    title: '自然生态',
    description: '探索大自然的奇妙生灵',
    badge: '精选',
    photos: 1923,
    photographers: 312,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: '3',
    title: '人像艺术',
    description: '用镜头讲述人物故事',
    badge: '精选',
    photos: 3456,
    photographers: 567,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1600&auto=format&fit=crop'
  }
];

const weeklyLeaders = [
  { id: '1', name: '光影魔法师', avatar: 'https://picsum.photos/400/400?random=280', likes: 3456 },
  { id: '2', name: '瞬间捕手', avatar: 'https://picsum.photos/400/400?random=281', likes: 2890 },
  { id: '3', name: '色彩大师', avatar: 'https://picsum.photos/400/400?random=282', likes: 2456 },
  { id: '4', name: '城市漫步者', avatar: 'https://picsum.photos/400/400?random=283', likes: 1890 },
  { id: '5', name: '自然探索者', avatar: 'https://picsum.photos/400/400?random=284', likes: 1567 }
];

const router = useRouter();
const { handleFollow, handleJoin, handleLoadMore: loadMore } = useInteraction();

const searchQuery = ref('');
const selectedCategory = ref('all');

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') {
    return photographyPosts;
  }
  return photographyPosts.filter(post => post.tags.includes(selectedCategory.value));
});

const handleLoadMore = () => {
  loadMore();
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.forecast-scroll::-webkit-scrollbar,
.inspiration-scroll::-webkit-scrollbar {
  height: 6px;
}

.forecast-scroll::-webkit-scrollbar-track,
.inspiration-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.forecast-scroll::-webkit-scrollbar-thumb,
.inspiration-scroll::-webkit-scrollbar-thumb {
  background: rgba(74, 95, 139, 0.3);
  border-radius: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .fade-in-up {
    animation: none;
    opacity: 1;
  }
  
  .topic-card:hover,
  .inspiration-card:hover,
  .forecast-card:hover,
  .weather-stat-card:hover,
  .leader-item:hover,
  .photographer-avatar:hover {
    transform: none !important;
  }
  
  .topic-image,
  .inspiration-image-wrapper img {
    transition: none !important;
  }
}
</style>