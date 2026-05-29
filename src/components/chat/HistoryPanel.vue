<template>
  <div
    class="flex flex-col h-[calc(100vh-160px)] rounded-xl shadow-xl overflow-hidden border"
    :class="theme === 'dark' ? 'bg-[#2D3748] border-[#4A5F8B]' : 'bg-white border-gray-200'"
  >
    <!-- 面板头部 -->
    <div
      class="p-4 border-b flex justify-between items-center"
      :class="theme === 'dark' ? 'border-[#4A5F8B] bg-[#1E2532]' : 'border-gray-200 bg-gray-50'"
    >
      <h3 :class="['font-semibold', theme === 'dark' ? 'text-white' : 'text-gray-800']">对话历史</h3>
      <button
        @click="createNewChat"
        :class="[
          'p-2 rounded-full transition-colors',
          theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
        ]"
        title="新建对话"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>

    <!-- 搜索框 -->
    <div :class="['p-3 border-b', theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200']">
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="搜索对话历史..."
          :class="[
            'w-full pl-9 pr-4 py-2 rounded-lg text-sm',
            theme === 'dark'
              ? 'bg-[#1E2532] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]'
              : 'bg-gray-100 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-gray-300'
          ]"
        />
        <i :class="['fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2', theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500']"></i>
      </div>
    </div>

    <!-- 对话历史列表 -->
    <div class="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-transparent scrollbar-thumb-opacity-50 hover:scrollbar-thumb-opacity-100">
      <template v-if="filteredChats.length === 0">
        <div class="flex flex-col items-center justify-center h-full p-6 text-center">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-500"
            :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-gray-100'"
          >
            <i :class="['text-xl', theme === 'dark' ? 'text-white' : 'text-gray-600']">
              <template v-if="searchQuery.trim() === ''">
                <i class="fa-solid fa-history"></i>
              </template>
              <template v-else>
                <i class="fa-solid fa-search"></i>
              </template>
            </i>
          </div>
          <p :class="theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'">
            {{ searchQuery.trim() === '' ? '暂无对话历史，开始您的第一次对话吧！' : `没有找到包含"${searchQuery}"的对话` }}
          </p>
          <button
            v-if="searchQuery.trim() !== ''"
            @click="searchQuery = ''"
            :class="[
              'mt-4 px-4 py-2 rounded-lg text-sm transition-colors',
              theme === 'dark'
                ? 'bg-[#4A5F8B]/20 text-[#B8C6D8] hover:bg-[#4A5F8B]/40'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
          >
            清除搜索
          </button>
        </div>
      </template>

      <template v-else>
        <div class="p-2">
          <template v-for="(chat, index) in filteredChats" :key="chat.id">
            <div
              v-if="isNewDateGroup(index)"
              class="mt-2 pt-2 border-t border-dashed text-center"
            >
              <span
                :class="[
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  theme === 'dark' ? 'bg-[#4A5F8B] text-[#B8C6D8]' : 'bg-gray-100 text-gray-600'
                ]"
              >
                {{ formatDate(chat.lastActive) }}
              </span>
            </div>

            <div
              class="p-3 rounded-lg mb-1 cursor-pointer transition-all duration-300 group"
              :class="[
                currentChatId === chat.id
                  ? theme === 'dark'
                    ? 'bg-[#4A5F8B]/30 border-l-2 border-[#4A5F8B] translate-x-1'
                    : 'bg-blue-50 border-l-2 border-blue-500 translate-x-1'
                  : theme === 'dark'
                    ? 'hover:bg-[#4A5F8B]/10 hover:translate-x-1'
                    : 'hover:bg-gray-50 hover:translate-x-1'
              ]"
              @click="setCurrentChat(chat.id)"
            >
              <div v-if="editingChatId === chat.id" class="flex items-center w-full">
                <input
                  type="text"
                  v-model="editingTitle"
                  @keydown.enter="handleSaveTitle(chat.id)"
                  @keydown.escape="handleCancelEdit"
                  :class="[
                    'flex-1 px-2 py-1 rounded text-sm',
                    theme === 'dark'
                      ? 'bg-[#4A5F8B] text-white border-none focus:outline-none focus:ring-2 focus:ring-[#6B7C93]'
                      : 'bg-gray-200 text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-gray-300'
                  ]"
                  autofocus
                />
                <div class="flex space-x-1">
                  <button
                    @click="handleSaveTitle(chat.id)"
                    :class="[
                      'p-1 rounded text-xs',
                      theme === 'dark' ? 'text-white hover:bg-[#6B7C93{"file_path": "/workspace/src/components/chat/HistoryPanel.vue", "content": 