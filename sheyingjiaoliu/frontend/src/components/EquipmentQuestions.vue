<template>
  <div :class="['mt-6 p-4', themeClasses.container, 'rounded-lg', themeClasses.border, 'transition-colors duration-300']">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
      <div class="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="搜索问题或作者.."
          v-model="searchTerm"
          :class="['w-full px-4 py-2 pl-10', themeClasses.inputBg, 'rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all']"
        />
        <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center">
          <span class="text-sm mr-2 text-gray-500">排序：</span>
          <select
            v-model="sortBy"
            :class="['px-3 py-2', themeClasses.inputBg, 'rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer']"
          >
            <option value="latest">最新发布</option>
            <option value="popular">最热问题</option>
            <option value="unanswered">未回答</option>
          </select>
        </div>

        <div class="flex items-center">
          <span class="text-sm mr-2 text-gray-500">筛选：</span>
          <select
            v-model="filterBy"
            @change="currentPage = 1"
            :class="['px-3 py-2', themeClasses.inputBg, 'rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer']"
          >
            <option value="all">全部问题</option>
            <option value="answered">已回答</option>
            <option value="unanswered">未回答</option>
          </select>
        </div>

        <button @click="toggleTheme" :class="['w-10 h-10 rounded-full flex items-center justify-center', themeClasses.buttonSecondary, 'transition-colors']">
          <i :class="['fa-solid', theme === 'dark' ? 'fa-sun' : 'fa-moon']"></i>
        </button>
      </div>
    </div>

    <div v-if="hotQuestions.length > 0" class="mb-6">
      <h3 class="text-lg font-semibold mb-4 flex items-center">
        <i class="fa-solid fa-fire text-[#F56565] mr-2"></i>
        热门问题
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="(question, index) in hotQuestions"
          :key="question.id"
          :class="['p-4 rounded-lg', themeClasses.cardBg, themeClasses.border, 'transition-all shadow-sm']"
        >
          <div class="flex items-start">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0', index === 0 ? 'bg-yellow-500 text-white' : index === 1 ? 'bg-gray-400 text-white' : 'bg-amber-700 text-white']">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-sm line-clamp-2 mb-2">{{ question.title }}</h4>
              <div class="flex justify-between items-center">
                <div class="flex items-center text-xs text-gray-500">
                  <i class="fa-solid fa-heart mr-1 text-gray-400"></i>
                  {{ question.likes }}
                </div>
                <span :class="['text-xs px-2 py-0.5 rounded-full', question.answers.length > 0 ? themeClasses.answeredTag : themeClasses.unansweredTag]">
                  {{ question.answers.length > 0 ? '已回答' : '未回答' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-[#F5F7FA]">用户提问区</h3>
      <button
        @click="showNewQuestion = !showNewQuestion"
        :class="['px-4 py-1.5', themeClasses.button, 'rounded-lg text-sm font-medium transition-colors']"
      >
        <i class="fa-solid fa-plus mr-1"></i>
        我要提问
      </button>
    </div>

    <Transition name="expand">
      <div v-if="showNewQuestion" class="mb-6">
        <div :class="['p-4', themeClasses.cardBg, themeClasses.border, 'rounded-lg']">
          <div class="flex space-x-2 mb-3">
            <button
              @click="showEmojiPicker = !showEmojiPicker"
              :class="['p-2 rounded-lg', themeClasses.buttonSecondary, 'transition-colors']"
              title="添加表情"
            >
              <i class="fa-solid fa-face-smile"></i>
            </button>
            <label :class="['p-2 rounded-lg', themeClasses.buttonSecondary, 'transition-colors', 'cursor-pointer']" title="上传图片">
              <i class="fa-solid fa-image"></i>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                @change="handleImageUpload"
                class="hidden"
              />
            </label>
            <button
              @click="showMentionPicker = !showMentionPicker"
              :class="['p-2 rounded-lg', themeClasses.buttonSecondary, 'transition-colors']"
              title="@提及用户"
            >
              <i class="fa-solid fa-at"></i>
            </button>
          </div>

          <Transition name="fade">
            <div v-if="showEmojiPicker" :class="['absolute z-10', themeClasses.cardBg, themeClasses.border, 'rounded-lg p-3 shadow-lg mt-2']">
              <div class="grid grid-cols-6 gap-2">
                <button
                  v-for="(emoji, index) in EMOJI_LIST"
                  :key="index"
                  @click="insertEmoji(emoji)"
                  class="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors text-xl"
                  :title="emoji"
                >
                  {{ emoji }}
                </button>
              </div>
            </div>
          </Transition>

          <Transition name="fade">
            <div v-if="showMentionPicker" :class="['absolute z-10', themeClasses.cardBg, themeClasses.border, 'rounded-lg p-3 shadow-lg mt-2 max-h-60 overflow-y-auto']">
              <button
                v-for="userItem in mockUsers"
                :key="userItem.id"
                @click="insertMention(userItem)"
                :class="['w-full flex items-center p-2 text-left rounded', themeClasses.buttonSecondary, 'transition-colors']"
              >
                <img :src="userItem.avatar" :alt="userItem.name" class="w-8 h-8 rounded-full mr-2" />
                <span>{{ userItem.name }}</span>
              </button>
            </div>
          </Transition>

          <div class="mb-3">
            <label class="block text-sm text-[#B8C6D8] mb-1">问题标题</label>
            <input
              type="text"
              v-model="newQuestionTitle"
              placeholder="请输入问题标题..."
              :class="['w-full px-3 py-2', themeClasses.inputBg, 'rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all']"
            />
          </div>

          <div class="mb-3 relative">
            <label class="block text-sm text-[#B8C6D8] mb-1">问题详情</label>
            <textarea
              ref="textareaRef"
              v-model="newQuestionContent"
              placeholder="请详细描述您的问题..."
              :class="['w-full px-3 py-2', themeClasses.inputBg, 'rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none min-h-[100px] max-h-[200px]']"
              @input="adjustTextareaHeight"
            ></textarea>
            <div class="absolute bottom-2 right-3 text-xs text-gray-500">
              {{ newQuestionContent.length }}/300
            </div>
          </div>

          <div v-if="imagePreviews.length > 0" class="mb-3 flex flex-wrap gap-2">
            <div
              v-for="(preview, index) in imagePreviews"
              :key="index"
              class="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300"
            >
              <img :src="preview" :alt="`Preview ${index + 1}`" class="w-full h-full object-cover" />
              <button
                @click="removeImagePreview(index)"
                class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
              >
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-2">
            <button
              @click="cancelNewQuestion"
              :class="['px-4 py-1.5', themeClasses.buttonSecondary, 'rounded-lg text-sm font-medium transition-colors', themeClasses.border]"
            >
              取消
            </button>
            <button
              @click="handleSubmitQuestion"
              :disabled="!newQuestionTitle.trim() || !newQuestionContent.trim()"
              :class="['px-4 py-1.5 rounded-lg text-sm font-medium transition-colors', (!newQuestionTitle.trim() || !newQuestionContent.trim()) ? 'bg-gray-400 text-white opacity-70 cursor-not-allowed' : themeClasses.button]"
            >
              提交
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div ref="questionListRef" class="space-y-4">
      <template v-if="!isLoading && paginatedQuestions.length > 0">
        <div
          v-for="question in paginatedQuestions"
          :key="question.id"
          :class="['rounded-lg', themeClasses.border, 'overflow-hidden shadow-sm']"
        >
          <div class="p-4">
            <div class="flex justify-between items-start">
              <div class="flex items-start space-x-3">
                <img :src="question.authorAvatar" :alt="question.author" class="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div class="flex items-center space-x-2">
                    <h4 class="font-medium text-[#F5F7FA]">{{ question.title }}</h4>
                    <span :class="['text-xs px-2 py-0.5 rounded-full', question.answers.length > 0 ? themeClasses.answeredTag : themeClasses.unansweredTag]">
                      {{ question.answers.length > 0 ? '已回答' : '未回答' }}
                    </span>
                  </div>
                  <p class="text-sm text-[#6B7C93] mt-1">
                    {{ question.author }} · {{ formatRelativeTime(question.date) }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <div class="relative">
                  <button @click="showMoreOptions = showMoreOptions === question.id ? null : question.id">
                    <i class="fa-solid fa-ellipsis text-gray-400"></i>
                  </button>

                  <Transition name="fade">
                    <div v-if="showMoreOptions === question.id" :class="['absolute right-0 mt-2 w-48', themeClasses.cardBg, 'rounded-lg shadow-lg', themeClasses.border, 'py-2 z-10']">
                      <template v-if="question.author === '我'">
                        <button :class="['w-full text-left px-4 py-2 text-sm text-gray-700', themeClasses.buttonSecondary, 'transition-colors']">
                          <i class="fa-solid fa-pen-to-square mr-2"></i>
                          编辑
                        </button>
                        <button :class="['w-full text-left px-4 py-2 text-sm text-gray-700', themeClasses.buttonSecondary, 'transition-colors']">
                          <i class="fa-solid fa-trash mr-2"></i>
                          删除
                        </button>
                      </template>
                      <button
                        @click="openReportModal(question)"
                        :class="['w-full text-left px-4 py-2 text-sm text-gray-700', themeClasses.buttonSecondary, 'transition-colors']"
                      >
                        <i class="fa-solid fa-flag mr-2"></i>
                        举报
                      </button>
                    </div>
                  </Transition>
                </div>

                <button
                  @click="handleLikeQuestion(question.id)"
                  :class="['flex items-center text-sm transition-colors', question.isLiked ? themeClasses.likedColor : 'text-[#B8C6D8] hover:text-[#F5F7FA]']"
                >
                  <i :class="['fa-solid', question.isLiked ? 'fa-heart' : 'fa-heart']"></i>
                  <span class="ml-1">{{ question.likes }}</span>
                </button>
              </div>
            </div>

            <p class="mt-3 text-[#B8C6D8]">{{ question.content }}</p>

            <div class="mt-3 flex justify-between items-center">
              <button
                v-if="question.answers.length > 0"
                @click="replyingTo = replyingTo === question.id ? null : question.id"
                class="text-sm text-[#4A5F8B] hover:text-[#6B7C93] transition-colors"
              >
                <i class="fa-solid fa-reply mr-1"></i>
                {{ replyingTo === question.id ? '取消回复' : '回复' }}
              </button>
              <button
                v-else
                @click="isAnswering = isAnswering === question.id ? null : question.id"
                class="text-sm text-[#4A5F8B] hover:text-[#6B7C93] transition-colors"
              >
                <i class="fa-solid fa-comment-dots mr-1"></i>
                {{ isAnswering === question.id ? '取消回答' : '我来回答' }}
              </button>
            </div>

            <Transition name="expand">
              <div v-if="replyingTo === question.id" class="mt-3">
                <textarea
                  v-model="replyContent"
                  placeholder="请输入您的回复..."
                  :class="['w-full px-3 py-2', themeClasses.inputBg, 'rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-20']"
                ></textarea>
                <div class="flex justify-end space-x-2 mt-2">
                  <button
                    @click="cancelReply"
                    :class="['px-3 py-1', themeClasses.buttonSecondary, 'rounded-lg text-sm font-medium transition-colors', themeClasses.border]"
                  >
                    取消
                  </button>
                  <button
                    @click="handleSubmitReply(question.id)"
                    :disabled="!replyContent.trim()"
                    :class="['px-3 py-1 rounded-lg text-sm font-medium transition-colors', !replyContent.trim() ? 'bg-gray-400 text-white opacity-70 cursor-not-allowed' : themeClasses.button]"
                  >
                    提交回复
                  </button>
                </div>
              </div>
            </Transition>

            <Transition name="expand">
              <div v-if="isAnswering === question.id" class="mt-3">
                <textarea
                  v-model="answerContent"
                  placeholder="请输入您的回答..."
                  :class="['w-full px-3 py-2', themeClasses.inputBg, 'rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-32']"
                ></textarea>
                <div class="flex justify-end space-x-2 mt-2">
                  <button
                    @click="cancelAnswer"
                    :class="['px-3 py-1', themeClasses.buttonSecondary, 'rounded-lg text-sm font-medium transition-colors', themeClasses.border]"
                  >
                    取消
                  </button>
                  <button
                    @click="handleSubmitAnswer(question.id)"
                    :disabled="!answerContent.trim()"
                    :class="['px-3 py-1 rounded-lg text-sm font-medium transition-colors', !answerContent.trim() ? 'bg-gray-400 text-white opacity-70 cursor-not-allowed' : themeClasses.button]"
                  >
                    提交回答
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <div v-if="question.answers.length > 0" :class="['border-t', themeClasses.border]">
            <div
              v-for="answer in question.answers"
              :key="answer.id"
              class="p-4 border-b border-[#4A5F8B]/30 last:border-b-0"
            >
              <div class="flex items-start space-x-3">
                <img :src="answer.authorAvatar" :alt="answer.author" class="w-8 h-8 rounded-full object-cover" />
                <div class="flex-1">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-[#F5F7FA]">{{ answer.author }}</p>
                    <p class="text-xs text-[#6B7C93]">{{ formatRelativeTime(answer.date) }}</p>
                  </div>
                  <p class="mt-2 text-sm text-[#B8C6D8]">{{ answer.content }}</p>
                  <div class="mt-2">
                    <button
                      @click="handleLikeAnswer(question.id, answer.id)"
                      :class="['flex items-center text-xs transition-colors', answer.isLiked ? themeClasses.likedColor : 'text-[#6B7C93] hover:text-[#B8C6D8]']"
                    >
                      <i :class="['fa-solid', answer.isLiked ? 'fa-heart' : 'fa-heart']"></i>
                      <span class="ml-1">{{ answer.likes }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else-if="isLoading" class="py-12 text-center">
        <div class="w-16 h-16 mx-auto mb-4">
          <i class="fa-solid fa-spinner fa-spin text-2xl text-[#4A5F8B]"></i>
        </div>
        <p class="text-[#B8C6D8]">加载中..</p>
      </div>

      <div v-else class="py-12 text-center">
        <div class="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
          <i class="fa-solid fa-question-circle text-2xl"></i>
        </div>
        <h3 class="text-lg font-medium text-[#F5F7FA] mb-2">暂无相关问题</h3>
        <p class="text-[#B8C6D8]">暂无相关问题，快来发起提问吧！</p>
      </div>
    </div>

    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <nav :class="['inline-flex items-center rounded-md', themeClasses.border, themeClasses.container, 'shadow-sm']">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          :class="['px-3 py-2 text-sm font-medium', currentPage === 1 ? 'opacity-50 cursor-not-allowed' : themeClasses.text]"
        >
          <i class="fa-solid fa-chevron-left"></i>
        </button>

        <span class="px-3 py-2 text-sm font-medium mx-1">
          第{currentPage}页 / 共{totalPages}页
        </span>

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          :class="['px-3 py-2 text-sm font-medium', currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : themeClasses.text]"
        >
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </nav>
    </div>

    <Transition name="fade">
      <div v-if="showReportModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click="showReportModal = false">
        <div :class="['w-full max-w-md', themeClasses.cardBg, 'rounded-lg', themeClasses.border, 'p-6']" @click.stop>
          <h3 class="text-xl font-bold mb-4">举报问题</h3>
          <p class="mb-4 text-sm text-gray-600">请选择举报原因：</p>

          <div class="grid grid-cols-2 gap-2 mb-4">
            <button
              v-for="(reason, index) in REPORT_REASONS"
              :key="index"
              @click="reportReason = reason"
              :class="['px-3 py-2 rounded-lg text-sm transition-colors', reportReason === reason ? themeClasses.button : themeClasses.buttonSecondary + ' ' + themeClasses.border]"
            >
              {{ reason }}
            </button>
          </div>

          <div class="mb-4">
            <textarea
              v-model="reportNote"
              placeholder="请输入补充说明（可选）"
              :class="['w-full px-3 py-2', themeClasses.inputBg, 'rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all resize-none h-20']"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3">
            <button @click="showReportModal = false" :class="['px-4 py-2', themeClasses.buttonSecondary, 'rounded-lg font-medium transition-colors', themeClasses.border]">
              取消
            </button>
            <button @click="handleSubmitReport" :class="['px-4 py-2', themeClasses.button, 'rounded-lg font-medium transition-colors']">
              提交举报
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';

interface Answer {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  isLiked: boolean;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  isLiked: boolean;
  answers: Answer[];
  isReported?: boolean;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface EquipmentQuestionsProps {
  equipmentId: string;
}

defineProps<EquipmentQuestionsProps>();

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩'
];

const mockUsers: User[] = [
  { id: '1', name: '摄影爱好者', avatar: 'https://picsum.photos/400/400?random=279' },
  { id: '2', name: '器材纠结者', avatar: 'https://picsum.photos/400/400?random=280' },
  { id: '3', name: '摄影新手', avatar: 'https://picsum.photos/400/400?random=281' },
  { id: '4', name: '专业摄影师', avatar: 'https://picsum.photos/400/400?random=282' },
  { id: '5', name: '器材专家', avatar: 'https://picsum.photos/400/400?random=283' },
  { id: '6', name: '摄影导师', avatar: 'https://picsum.photos/400/400?random=284' }
];

const REPORT_REASONS = ['垃圾信息', '广告内容', '不友善行为', '违规内容', '盗用他人作品', '其他原因'];

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}天前`;
  return date.toLocaleDateString();
};

const theme = ref<'dark' | 'light'>('dark');
const isAuthenticated = ref(true);

const questions = ref<Question[]>([
  {
    id: 'q1',
    title: '这款器材的续航能力如何？适合长时间外出拍摄吗？',
    content: '最近打算入手这款器材用于户外拍摄，想了解一下实际使用中的续航表现如何？在寒冷天气下有什么需要注意的吗？',
    author: '摄影爱好者',
    authorAvatar: 'https://picsum.photos/400/400?random=285',
    date: '2023-10-20',
    likes: 24,
    isLiked: false,
    answers: [
      {
        id: 'a1-1',
        content: '这款器材的续航表现非常出色，满电状态下可以支持约800张照片的拍摄，完全适合一天的外出拍摄需求。建议长时间外出时携带一块备用电池以确保万无一失。在寒冷天气下，电池续航会有所下降，建议将备用电池放在贴身口袋保暖。',
        author: '专业摄影师',
        authorAvatar: 'https://picsum.photos/400/400?random=286',
        date: '2023-10-20',
        likes: 18,
        isLiked: false
      },
      {
        id: 'a1-2',
        content: '补充一点，使用取景器比使用屏幕可以节省大约30%的电量，这在户外拍摄时非常实用。',
        author: '器材专家',
        authorAvatar: 'https://picsum.photos/400/400?random=287',
        date: '2023-10-21',
        likes: 7,
        isLiked: false
      }
    ]
  },
  {
    id: 'q2',
    title: '与同价位竞品相比，这款器材的最大优势是什么？',
    content: '在预算有限的情况下，纠结于这款和另外几款同价位的器材，想听听大家的使用体验和建议。',
    author: '器材纠结者',
    authorAvatar: 'https://picsum.photos/400/400?random=288',
    date: '2023-10-15',
    likes: 42,
    isLiked: false,
    answers: [
      {
        id: 'a2-1',
        content: '相比同价位竞品，这款器材在自动对焦速度、低光拍摄能力和视频性能方面表现更为出色，特别是其对焦系统在复杂环境下的追踪能力非常稳定可靠。如果您经常拍摄动态场景或在弱光环境下工作，这款会是更好的选择。',
        author: '专业摄影师',
        authorAvatar: 'https://picsum.photos/400/400?random=289',
        date: '2023-10-15',
        likes: 35,
        isLiked: false
      }
    ]
  },
  {
    id: 'q3',
    title: '新手入门推荐购买这款器材吗？操作难度如何？',
    content: '刚接触摄影，想一步到位买个好点的器材，不知道这款是否适合新手使用。',
    author: '摄影新手',
    authorAvatar: 'https://picsum.photos/400/400?random=290',
    date: '2023-10-08',
    likes: 36,
    isLiked: false,
    answers: [
      {
        id: 'a3-1',
        content: '对于新手来说，这款器材的操作相对友好，具有完善的自动模式和入门引导功能。不过考虑到其价格和专业性，更适合有一定预算且计划长期学习摄影的新手，纯入门用户可以考虑更基础的型号。',
        author: '摄影导师',
        authorAvatar: 'https://picsum.photos/400/400?random=291',
        date: '2023-10-08',
        likes: 29,
        isLiked: false
      }
    ]
  },
  {
    id: 'q4',
    title: '这款器材的视频拍摄能力怎么样？',
    content: '主要用于视频创作，想了解一下这款器材的视频性能如何，比如对焦速度、防抖效果等。',
    author: '视频创作者',
    authorAvatar: 'https://picsum.photos/400/400?random=292',
    date: '2023-10-10',
    likes: 15,
    isLiked: false,
    answers: []
  },
  {
    id: 'q5',
    title: '长时间使用后，器材的稳定性如何？',
    content: '担心长时间使用后会出现性能下降的问题，想了解一下耐用性。',
    author: '职业摄影师',
    authorAvatar: 'https://picsum.photos/400/400?random=293',
    date: '2023-10-05',
    likes: 18,
    isLiked: false,
    answers: []
  },
  {
    id: 'q6',
    title: '与其他品牌同级别产品相比，性价比如何？',
    content: '在几款产品之间犹豫，想听听客观的比较意见。',
    author: '理性消费者',
    authorAvatar: 'https://picsum.photos/400/400?random=294',
    date: '2023-10-01',
    likes: 21,
    isLiked: false,
    answers: []
  },
  {
    id: 'q7',
    title: '这款器材的配件兼容性怎么样？',
    content: '想知道是否容易找到兼容的第三方配件，比如电池、存储卡等。',
    author: '配件控',
    authorAvatar: 'https://picsum.photos/400/400?random=295',
    date: '2023-09-28',
    likes: 12,
    isLiked: false,
    answers: []
  },
  {
    id: 'q8',
    title: '在恶劣环境下使用需要注意什么？',
    content: '经常需要在户外、雨天等环境下拍摄，想了解防护措施。',
    author: '户外摄影师',
    authorAvatar: 'https://picsum.photos/400/400?random=296',
    date: '2023-09-25',
    likes: 14,
    isLiked: false,
    answers: []
  },
  {
    id: 'q9',
    title: '这款器材的固件更新频繁吗？',
    content: '想知道厂商是否经常提供固件更新来改善性能。',
    author: '技术关注者',
    authorAvatar: 'https://picsum.photos/400/400?random=297',
    date: '2023-09-20',
    likes: 9,
    isLiked: false,
    answers: []
  },
  {
    id: 'q10',
    title: '购买后有哪些增值服务？',
    content: '想了解保修政策、延长服务等信息。',
    author: '潜在买家',
    authorAvatar: 'https://picsum.photos/400/400?random=298',
    date: '2023-09-18',
    likes: 7,
    isLiked: false,
    answers: []
  }
]);

const showNewQuestion = ref(false);
const newQuestionTitle = ref('');
const newQuestionContent = ref('');
const replyingTo = ref<string | null>(null);
const replyContent = ref('');
const isAnswering = ref<string | null>(null);
const answerContent = ref('');
const showEmojiPicker = ref(false);
const showMentionPicker = ref(false);
const imagePreviews = ref<string[]>([]);
const selectedImages = ref<FileList | null>(null);
const searchTerm = ref('');
const sortBy = ref<'latest' | 'popular' | 'unanswered'>('latest');
const filterBy = ref<'all' | 'answered' | 'unanswered'>('all');
const currentPage = ref(1);
const pageSize = ref(10);
const showReportModal = ref(false);
const reportingQuestion = ref<Question | null>(null);
const reportReason = ref('');
const reportNote = ref('');
const showMoreOptions = ref<string | null>(null);
const isLoading = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const questionListRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const draftTitle = localStorage.getItem(`questionDraftTitle_${'equipmentId'}`);
  const draftContent = localStorage.getItem(`questionDraftContent_${'equipmentId'}`);
  const draftImages = localStorage.getItem(`questionDraftImages_${'equipmentId'}`);

  if (draftTitle && draftContent) {
    newQuestionTitle.value = draftTitle;
    newQuestionContent.value = draftContent;
    if (draftImages) {
      imagePreviews.value = JSON.parse(draftImages);
    }
  }
});

watch([newQuestionTitle, newQuestionContent, imagePreviews], () => {
  if (showNewQuestion.value) {
    const timer = setTimeout(() => {
      localStorage.setItem(`questionDraftTitle_${'equipmentId'}`, newQuestionTitle.value);
      localStorage.setItem(`questionDraftContent_${'equipmentId'}`, newQuestionContent.value);
      localStorage.setItem(`questionDraftImages_${'equipmentId'}`, JSON.stringify(imagePreviews.value));
    }, 500);
    return () => clearTimeout(timer);
  }
});

const handleLikeQuestion = (id: string) => {
  questions.value = questions.value.map(q =>
    q.id === id
      ? { ...q, likes: q.isLiked ? q.likes - 1 : q.likes + 1, isLiked: !q.isLiked }
      : q
  );
};

const handleLikeAnswer = (questionId: string, answerId: string) => {
  questions.value = questions.value.map(q => {
    if (q.id === questionId) {
      return {
        ...q,
        answers: q.answers.map(a =>
          a.id === answerId
            ? { ...a, likes: a.isLiked ? a.likes - 1 : a.likes + 1, isLiked: !a.isLiked }
            : a
        )
      };
    }
    return q;
  });
};

const handleSubmitQuestion = () => {
  if (!newQuestionTitle.value.trim() || !newQuestionContent.value.trim()) {
    alert('请输入问题标题和内容');
    return;
  }

  const question: Question = {
    id: `q-${Date.now()}`,
    title: newQuestionTitle.value,
    content: newQuestionContent.value,
    author: '我',
    authorAvatar: 'https://picsum.photos/400/400?random=299',
    date: new Date().toLocaleDateString(),
    likes: 0,
    isLiked: false,
    answers: []
  };

  questions.value = [question, ...questions.value];
  cancelNewQuestion();
  alert('问题提交成功，等待专业人士回答');
};

const cancelNewQuestion = () => {
  newQuestionTitle.value = '';
  newQuestionContent.value = '';
  imagePreviews.value = [];
  selectedImages.value = null;
  showNewQuestion.value = false;
  localStorage.removeItem(`questionDraftTitle_${'equipmentId'}`);
  localStorage.removeItem(`questionDraftContent_${'equipmentId'}`);
  localStorage.removeItem(`questionDraftImages_${'equipmentId'}`);
};

const handleSubmitReply = (questionId: string) => {
  if (!replyContent.value.trim()) {
    alert('请输入回复内容');
    return;
  }

  const newAnswer: Answer = {
    id: `a-${Date.now()}`,
    content: replyContent.value,
    author: '我',
    authorAvatar: 'https://picsum.photos/400/400?random=300',
    date: new Date().toLocaleDateString(),
    likes: 0,
    isLiked: false
  };

  questions.value = questions.value.map(q => {
    if (q.id === questionId) {
      return { ...q, answers: [...q.answers, newAnswer] };
    }
    return q;
  });

  cancelReply();
  alert('回复提交成功');
};

const cancelReply = () => {
  replyContent.value = '';
  replyingTo.value = null;
};

const handleSubmitAnswer = (questionId: string) => {
  if (!answerContent.value.trim()) {
    alert('请输入回答内容');
    return;
  }

  const newAnswer: Answer = {
    id: `a-${Date.now()}`,
    content: answerContent.value,
    author: '我',
    authorAvatar: 'https://picsum.photos/400/400?random=301',
    date: new Date().toLocaleDateString(),
    likes: 0,
    isLiked: false
  };

  questions.value = questions.value.map(q => {
    if (q.id === questionId) {
      return { ...q, answers: [...q.answers, newAnswer] };
    }
    return q;
  });

  cancelAnswer();
  alert('回答提交成功');
};

const cancelAnswer = () => {
  answerContent.value = '';
  isAnswering.value = null;
};

const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const files = target.files;
  if (imagePreviews.value.length + files.length > 5) {
    alert('最多上传5张图片');
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过5MB');
      continue;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviews.value.push(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  }

  selectedImages.value = files;
};

const removeImagePreview = (index: number) => {
  imagePreviews.value = imagePreviews.value.filter((_, i) => i !== index);
};

const insertEmoji = (emoji: string) => {
  if (textareaRef.value) {
    const start = textareaRef.value.selectionStart;
    const end = textareaRef.value.selectionEnd;
    newQuestionContent.value = newQuestionContent.value.slice(0, start) + emoji + newQuestionContent.value.slice(end);
    nextTick(() => {
      textareaRef.value?.focus();
      textareaRef.value?.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  } else {
    newQuestionContent.value += emoji;
  }
  showEmojiPicker.value = false;
};

const insertMention = (user: User) => {
  if (textareaRef.value) {
    const start = textareaRef.value.selectionStart;
    const end = textareaRef.value.selectionEnd;
    const mentionText = `@${user.name} `;
    newQuestionContent.value = newQuestionContent.value.slice(0, start) + mentionText + newQuestionContent.value.slice(end);
    nextTick(() => {
      textareaRef.value?.focus();
      textareaRef.value?.setSelectionRange(start + mentionText.length, start + mentionText.length);
    });
  } else {
    newQuestionContent.value += `@${user.name} `;
  }
  showMentionPicker.value = false;
};

const openReportModal = (question: Question) => {
  reportingQuestion.value = question;
  showReportModal.value = true;
};

const handleSubmitReport = () => {
  if (!reportReason.value) {
    alert('请选择举报原因');
    return;
  }

  if (reportingQuestion.value) {
    questions.value = questions.value.map(q =>
      q.id === reportingQuestion.value?.id ? { ...q, isReported: true } : q
    );
  }

  showReportModal.value = false;
  reportingQuestion.value = null;
  reportReason.value = '';
  reportNote.value = '';
  alert('举报已提交，我们会尽快处理');
};

const getFilteredAndSortedQuestions = computed(() => {
  let result = [...questions.value];

  if (searchTerm.value.trim()) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(q =>
      q.title.toLowerCase().includes(term) ||
      q.content.toLowerCase().includes(term) ||
      q.author.toLowerCase().includes(term)
    );
  }

  if (filterBy.value === 'answered') {
    result = result.filter(q => q.answers.length > 0);
  } else if (filterBy.value === 'unanswered') {
    result = result.filter(q => q.answers.length === 0);
  }

  if (sortBy.value === 'latest') {
    result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => b.likes - a.likes);
  } else if (sortBy.value === 'unanswered') {
    result.sort((a, b) => {
      if (a.answers.length === 0 && b.answers.length > 0) return -1;
      if (a.answers.length > 0 && b.answers.length === 0) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  return result;
});

const hotQuestions = computed(() => {
  return [...questions.value].sort((a, b) => b.likes - a.likes).slice(0, 3);
});

const filteredAndSortedQuestions = computed(() => getFilteredAndSortedQuestions.value);
const totalPages = computed(() => Math.ceil(filteredAndSortedQuestions.value.length / pageSize.value));
const paginatedQuestions = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredAndSortedQuestions.value.slice(startIndex, startIndex + pageSize.value);
});

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  questionListRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

const adjustTextareaHeight = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  target.style.height = 'auto';
  target.style.height = `${Math.min(target.scrollHeight, 200)}px`;
};

const themeClasses = computed(() => {
  if (theme.value === 'dark') {
    return {
      container: 'bg-[#2D3748] border-[#4A5F8B]',
      text: 'text-[#B8C6D8]',
      primaryText: 'text-[#F5F7FA]',
      secondaryText: 'text-[#6B7C93]',
      accentColor: 'text-[#4A5F8B]',
      inputBg: 'bg-[#2D3748] border-[#4A5F8B] text-[#F5F7FA]',
      cardBg: 'bg-[#1E2532]',
      button: 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]',
      buttonSecondary: 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]',
      border: 'border-[#4A5F8B]',
      highlight: 'text-[#4A5F8B]',
      likedColor: 'text-[#F56565]',
      answeredTag: 'bg-[#48BB78] text-white',
      unansweredTag: 'bg-[#F56565] text-white'
    };
  }

  return {
    container: 'bg-white border-gray-200',
    text: 'text-gray-600',
    primaryText: 'text-gray-900',
    secondaryText: 'text-gray-400',
    accentColor: 'text-blue-600',
    inputBg: 'bg-white border-gray-300 text-gray-900',
    cardBg: 'bg-white',
    button: 'bg-blue-600 text-white hover:bg-blue-700',
    buttonSecondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    border: 'border-gray-200',
    highlight: 'text-blue-600',
    likedColor: 'text-red-500',
    answeredTag: 'bg-green-500 text-white',
    unansweredTag: 'bg-red-500 text-white'
  };
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  height: 0;
}
</style>