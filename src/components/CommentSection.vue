<template>
  <div ref="commentSectionRef" :class="[colors.container, 'rounded-lg p-6']">
    <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
      <div class="flex items-center space-x-4">
        <h3 class="text-xl font-bold text-[#4A5F8B]">评论 ({{ comments.length }})</h3>
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-sm px-3 py-1 bg-[#4A5F8B]/20 text-[#4A5F8B] rounded-full hover:bg-[#4A5F8B]/30 transition-colors"
        >
          未读({{ unreadCount }})
        </button>
      </div>
      <div class="flex items-center space-x-4">
        <div class="flex items-center">
          <span class="text-sm text-[#4A5F8B] mr-2">排序:</span>
          <select
            v-model="sortType"
            @change="currentPage = 1"
            :class="['px-3 py-1 text-sm rounded border', colors.inputBg, 'focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]']"
          >
            <option value="latest">最新</option>
            <option value="popular">最热</option>
          </select>
        </div>
        <div class="flex items-center">
          <span class="text-sm text-[#4A5F8B] mr-2">筛选:</span>
          <select
            v-model="filterType"
            @change="currentPage = 1"
            :class="['px-3 py-1 text-sm rounded border', colors.inputBg, 'focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]']"
          >
            <option value="all">全部</option>
            <option value="my">我的评论</option>
            <option value="author">作者回复</option>
          </select>
        </div>
      </div>
    </div>

    <form v-if="isAuthenticated" @submit.prevent="handleSubmitComment" class="mb-8">
      <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div class="flex-shrink-0">
          <img
            :src="user?.avatar"
            :alt="user?.username"
            class="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div class="flex-1">
          <textarea
            ref="textareaRef"
            v-model="commentText"
            @input="handleCommentInputChange"
            placeholder="分享您的艺术感悟或技术分析..."
            :class="['w-full px-4 py-3 rounded-lg', colors.inputBg, 'focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none h-32', colors.placeholder]"
          ></textarea>
          <div v-if="imagePreviews.length > 0" class="mt-2 flex flex-wrap gap-2">
            <div
              v-for="(preview, index) in imagePreviews"
              :key="index"
              class="relative w-20 h-20 rounded-md overflow-hidden border border-[#4A5F8B]"
            >
              <img :src="preview" :alt="`Preview ${index + 1}`" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeImagePreview(index)"
                class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
              >
                <i class="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
          <div class="flex flex-wrap justify-between items-center mt-3 gap-2">
            <div class="flex items-center space-x-3">
              <button
                type="button"
                @click="showEmojiPicker = !showEmojiPicker"
                :class="['p-2 rounded-lg', colors.button, colors.buttonHover]"
                title="添加表情"
              >
                <i class="fa-solid fa-face-smile"></i>
              </button>
              <label :class="['p-2 rounded-lg', colors.button, colors.buttonHover, 'cursor-pointer']" title="上传图片">
                <i class="fa-solid fa-image"></i>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  @change="handleImagePreview"
                  class="hidden"
                />
              </label>
            </div>
            <button
              type="submit"
              :class="['px-6 py-2 border-2', colors.button, colors.buttonHover, 'rounded-lg font-medium transition-colors shadow-[0_2px_8px_rgba(74,95,139,0.2)]']"
            >
              发表评论
            </button>
          </div>
        </div>
      </div>

      <Transition name="fade">
        <div v-if="showEmojiPicker" :class="['mt-2 p-3 rounded-lg', colors.formBg, 'border border-[#4A5F8B] w-fit']">
          <div class="grid grid-cols-8 gap-1">
            <button
              v-for="(emoji, index) in EMOJI_LIST"
              :key="index"
              type="button"
              @click="commentText += emoji"
              class="w-8 h-8 flex items-center justify-center rounded hover:bg-[#4A5F8B]/20 transition-colors"
              :title="emoji"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </Transition>

      <Transition name="fade">
        <div v-if="showMentionDropdown && filteredUsers.length > 0" :class="['mt-2 p-2 rounded-lg', colors.formBg, 'border border-[#4A5F8B] w-full max-w-xs absolute z-10']">
          <div
            v-for="userItem in filteredUsers"
            :key="userItem.id"
            @click="handleMentionSelect(userItem)"
            :class="['flex items-center p-2 hover:bg-[#4A5F8B]/20 rounded cursor-pointer']"
          >
            <img :src="userItem.avatar" :alt="userItem.username" class="w-8 h-8 rounded-full mr-2" />
            <span>{{ userItem.username }}</span>
          </div>
        </div>
      </Transition>
    </form>

    <div v-else :class="['mb-8 p-4', colors.loginPromptBg, 'rounded-lg text-center']">
      <p :class="[colors.loginPromptText, 'mb-3']">登录后可以参与艺术摄影交流</p>
      <div class="flex justify-center space-x-3">
        <router-link
          to="/login"
          :class="['px-4 py-2 text-sm font-medium', colors.loginButton, colors.loginButtonHover, 'rounded-lg transition-colors']"
        >
          登录
        </router-link>
        <router-link
          to="/register"
          :class="['px-4 py-2 text-sm font-medium', colors.registerButton, 'rounded-lg transition-colors']"
        >
          注册
        </router-link>
      </div>
    </div>

    <div class="space-y-6">
      <template v-if="paginatedComments.length > 0">
        <div
          v-for="(comment, idx) in paginatedComments"
          :key="comment.id"
          :class="['bg-[#232D3F] border-[#4A5F8B] rounded-lg p-4 relative']"
        >
          <span v-if="comment.isUnread" class="absolute top-4 right-4 w-2 h-2 bg-[#4A5F8B] rounded-full"></span>
          <div class="flex space-x-3">
            <router-link :to="`/profile/${comment.userId}`" class="flex-shrink-0">
              <img
                :src="comment.avatar"
                :alt="comment.username"
                :class="['w-10 h-10 rounded-full object-cover', isAuthor(comment) ? 'border-2 border-[#4A5F8B]' : '']"
              />
            </router-link>
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <div class="flex items-center">
                  <router-link
                    :to="`/profile/${comment.userId}`"
                    :class="['font-medium', colors.primaryText, colors.linkHover, 'transition-colors']"
                  >
                    {{ comment.username }}
                  </router-link>
                  <span v-if="isAuthor(comment)" class="px-1.5 py-0.5 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded ml-1">
                    作者
                  </span>
                </div>
                <span :class="['text-xs', colors.secondaryText]">{{ formatRelativeTime(comment.date) }}</span>
              </div>
              <p :class="[colors.text, 'mb-3']" v-html="formatCommentText(comment.content)"></p>
              <div v-if="comment.images && comment.images.length > 0" class="grid grid-cols-3 gap-2 mb-3">
                <div
                  v-for="(image, index) in comment.images"
                  :key="index"
                  class="aspect-square rounded-md overflow-hidden border border-[#4A5F8B] cursor-pointer"
                  @click="openImagePreview(image)"
                >
                  <img :src="image" :alt="`Comment image ${index + 1}`" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <button
                  @click="handleLike(comment.id)"
                  :class="['flex items-center space-x-1 text-sm transition-colors', comment.isLiked ? colors.liked : colors.likeButton]"
                >
                  <i :class="['fa-solid', comment.isLiked ? 'fa-heart' : 'fa-heart']"></i>
                  <span>{{ comment.likes }}</span>
                </button>
                <button
                  @click="replyToComment(comment)"
                  :class="['flex items-center space-x-1 text-sm', colors.likeButton, 'transition-colors']"
                >
                  <i class="fa-solid fa-reply"></i>
                  <span>回复 {{ comment.replies?.length || 0 }}</span>
                </button>
                <div class="flex items-center space-x-2 ml-auto">
                  <template v-if="isAuthenticated">
                    <template v-if="isAuthor(comment) || user?.id === 'admin'">
                      <button
                        @click="openEditModal(comment)"
                        :class="['text-sm', colors.likeButton, 'transition-colors']"
                        title="编辑"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        @click="openDeleteModal(comment)"
                        :class="['text-sm', colors.likeButton, 'transition-colors']"
                        title="删除"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </template>
                    <button
                      v-if="user?.id !== comment.userId && !isAuthor(comment)"
                      @click="openReportModal(comment)"
                      :class="['text-sm', colors.likeButton, 'transition-colors']"
                      title="举报"
                    >
                      <i class="fa-solid fa-flag"></i>
                    </button>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <Transition name="fade">
            <div
              v-if="replyingTo === comment.id && isAuthenticated"
              class="mt-3 flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0"
            >
              <div class="flex-shrink-0">
                <img :src="user?.avatar" :alt="user?.username" class="w-8 h-8 rounded-full object-cover" />
              </div>
              <div class="flex-1 flex flex-col space-y-2">
                <div class="relative">
                  <input
                    ref="replyInputRef"
                    :id="`reply-input-${comment.id}`"
                    type="text"
                    v-model="replyText"
                    @input="handleReplyInputChange"
                    :placeholder="`回复 @${replyingToUser}...`"
                    :class="['flex-1 px-3 py-2 rounded-lg', colors.inputBg, 'focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] text-sm', colors.placeholder]"
                  />
                  <button
                    type="button"
                    @click="showReplyEmojiPicker = !showReplyEmojiPicker"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#4A5F8B]"
                    title="添加表情"
                  >
                    <i class="fa-solid fa-face-smile"></i>
                  </button>
                </div>

                <Transition name="fade">
                  <div v-if="showReplyEmojiPicker" :class="['p-2 rounded-lg', colors.formBg, 'border border-[#4A5F8B] w-full max-w-xs self-end']">
                    <div class="grid grid-cols-10 gap-1">
                      <button
                        v-for="(emoji, index) in EMOJI_LIST.slice(0, 30)"
                        :key="index"
                        type="button"
                        @click="replyText += emoji"
                        class="w-6 h-6 flex items-center justify-center rounded hover:bg-[#4A5F8B]/20 transition-colors text-sm"
                        :title="emoji"
                      >
                        {{ emoji }}
                      </button>
                    </div>
                  </div>
                </Transition>

                <Transition name="fade">
                  <div v-if="showReplyMentionDropdown && filteredReplyUsers.length > 0" :class="['p-2 rounded-lg', colors.formBg, 'border border-[#4A5F8B] w-full max-w-xs self-end z-10']">
                    <div
                      v-for="userItem in filteredReplyUsers"
                      :key="userItem.id"
                      @click="handleReplyMentionSelect(userItem)"
                      :class="['flex items-center p-2 hover:bg-[#4A5F8B]/20 rounded cursor-pointer']"
                    >
                      <img :src="userItem.avatar" :alt="userItem.username" class="w-8 h-8 rounded-full mr-2" />
                      <span>{{ userItem.username }}</span>
                    </div>
                  </div>
                </Transition>

                <div class="flex justify-end space-x-2">
                  <button
                    @click="cancelReply"
                    :class="['px-3 py-1.5', colors.button, colors.buttonHover, 'rounded-lg text-sm font-medium transition-colors']"
                  >
                    取消
                  </button>
                  <button
                    @click="handleSubmitReply(comment.id)"
                    :class="['px-3 py-1.5', colors.loginButton, colors.loginButtonHover, 'rounded-lg text-sm font-medium transition-colors']"
                  >
                    回复
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="comment.replies && comment.replies.length > 0" class="mt-4 pl-4 border-l-2 border-[#B8C6D8] space-y-4">
            <div
              v-for="(reply, replyIdx) in comment.replies"
              :key="reply.id"
              class="flex space-x-3"
            >
              <router-link :to="`/profile/${reply.userId}`" class="flex-shrink-0">
                <img
                  :src="reply.avatar"
                  :alt="reply.username"
                  :class="['w-8 h-8 rounded-full object-cover', reply.isAuthor ? 'border-2 border-[#4A5F8B]' : '']"
                />
              </router-link>
              <div class="flex-1">
                <div class="flex items-center space-x-2 mb-1">
                  <div class="flex items-center">
                    <router-link
                      :to="`/profile/${reply.userId}`"
                      :class="['font-medium', colors.primaryText, colors.linkHover, 'transition-colors']"
                    >
                      {{ reply.username }}
                    </router-link>
                    <span v-if="reply.isAuthor" class="px-1.5 py-0.5 bg-[#4A5F8B]/20 text-[#4A5F8B] text-xs rounded ml-1">
                      作者
                    </span>
                  </div>
                  <span :class="['text-xs', colors.secondaryText]">{{ formatRelativeTime(reply.date) }}</span>
                </div>
                <p :class="[colors.text, 'mb-2 text-sm']" v-html="formatCommentText(reply.content)"></p>
                <div class="flex items-center space-x-4">
                  <button
                    @click="handleLike(comment.id, true, reply.id)"
                    :class="['flex items-center space-x-1 text-xs transition-colors', reply.isLiked ? colors.liked : colors.likeButton]"
                  >
                    <i :class="['fa-solid', reply.isLiked ? 'fa-heart' : 'fa-heart']"></i>
                    <span>{{ reply.likes }}</span>
                  </button>
                  <button
                    @click="replyToReply(comment, reply)"
                    :class="['flex items-center space-x-1 text-xs', colors.likeButton, 'transition-colors']"
                  >
                    <i class="fa-solid fa-reply"></i>
                    <span>回复</span>
                  </button>
                  <div class="flex items-center space-x-2 ml-auto">
                    <template v-if="isAuthenticated">
                      <template v-if="isAuthor(reply) || user?.id === 'admin'">
                        <button
                          @click="openEditModal(reply)"
                          :class="['text-xs', colors.likeButton, 'transition-colors']"
                          title="编辑"
                        >
                          <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          @click="openDeleteModal(reply)"
                          :class="['text-xs', colors.likeButton, 'transition-colors']"
                          title="删除"
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </template>
                      <button
                        v-if="user?.id !== reply.userId && !isAuthor(reply)"
                        @click="openReportModal(reply)"
                        :class="['text-xs', colors.likeButton, 'transition-colors']"
                        title="举报"
                      >
                        <i class="fa-solid fa-flag"></i>
                      </button>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="text-center py-12">
        <div class="w-16 h-16 bg-[#4A5F8B]/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa-solid fa-comment-slash text-2xl text-[#4A5F8B]"></i>
        </div>
        <h3 class="text-lg font-medium text-[#4A5F8B] mb-2">暂无评论，快来分享见解吧～</h3>
        <p class="text-sm text-[#6B7C93]">成为第一个评论的人</p>
      </div>

      <div v-if="totalPages > 1" class="flex justify-center mt-8">
        <div class="inline-flex items-center rounded-md border border-[#4A5F8B] bg-[#1E2532] shadow-sm">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="['px-3 py-2 text-sm font-medium', currentPage === 1 ? 'text-[#6B7C93] cursor-not-allowed' : 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20']"
          >
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button
            v-for="page in getPageRange()"
            :key="page"
            @click="changePage(page)"
            :class="['px-3 py-2 text-sm font-medium', currentPage === page ? 'bg-[#4A5F8B] text-white' : 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20']"
          >
            {{ page }}
          </button>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            :class="['px-3 py-2 text-sm font-medium', currentPage === totalPages ? 'text-[#6B7C93] cursor-not-allowed' : 'text-[#B8C6D8] hover:bg-[#4A5F8B]/20']"
          >
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showEditModal && editingComment" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="showEditModal = false">
        <div :class="['w-full max-w-lg', colors.container, 'rounded-lg p-6']" @click.stop>
          <h3 class="text-xl font-bold text-[#4A5F8B] mb-4">编辑评论</h3>
          <textarea
            v-model="editingComment.content"
            :class="['w-full px-4 py-3 rounded-lg', colors.inputBg, 'focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none h-32', colors.placeholder]"
          ></textarea>
          <div class="flex justify-end space-x-3 mt-4">
            <button
              @click="showEditModal = false"
              :class="['px-4 py-2', colors.button, colors.buttonHover, 'rounded-lg font-medium transition-colors']"
            >
              取消
            </button>
            <button
              @click="handleEditComment"
              :class="['px-4 py-2', colors.loginButton, colors.loginButtonHover, 'rounded-lg font-medium transition-colors']"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showDeleteModal && deletingComment" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="showDeleteModal = false">
        <div :class="['w-full max-w-md', colors.container, 'rounded-lg p-6']" @click.stop>
          <h3 class="text-xl font-bold text-[#4A5F8B] mb-2">确认删除</h3>
          <p :class="[colors.text, 'mb-4']">确定要删除这条评论吗？此操作不可撤销。</p>
          <div class="flex justify-end space-x-3">
            <button
              @click="showDeleteModal = false"
              :class="['px-4 py-2', colors.button, colors.buttonHover, 'rounded-lg font-medium transition-colors']"
            >
              取消
            </button>
            <button
              @click="handleDeleteComment"
              class="px-4 py-2 bg-[#F56565] text-white rounded-lg font-medium hover:bg-[#E53E3E] transition-colors"
            >
              删除
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showReportModal && reportingComment" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="showReportModal = false">
        <div :class="['w-full max-w-md', colors.container, 'rounded-lg p-6']" @click.stop>
          <h3 class="text-xl font-bold text-[#4A5F8B] mb-2">举报评论</h3>
          <p :class="[colors.text, 'mb-4']">请选择举报原因：</p>
          <div class="grid grid-cols-2 gap-2 mb-4">
            <button
              v-for="(reason, index) in REPORT_REASONS"
              :key="index"
              @click="reportReason = reason"
              :class="['px-3 py-2 rounded-lg text-sm transition-colors', reportReason === reason ? colors.loginButton : colors.button]"
            >
              {{ reason }}
            </button>
          </div>
          <textarea
            v-model="reportNote"
            placeholder="请输入补充说明（可选）"
            :class="['w-full px-4 py-3 rounded-lg', colors.inputBg, 'focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none h-24', colors.placeholder]"
          ></textarea>
          <div class="flex justify-end space-x-3 mt-4">
            <button
              @click="showReportModal = false"
              :class="['px-4 py-2', colors.button, colors.buttonHover, 'rounded-lg font-medium transition-colors']"
            >
              取消
            </button>
            <button
              @click="handleReportComment"
              :class="['px-4 py-2', colors.loginButton, colors.loginButtonHover, 'rounded-lg font-medium transition-colors']"
            >
              提交举报
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showImagePreview" class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" @click="showImagePreview = false">
        <button @click="showImagePreview = false" class="absolute top-4 right-4 text-white hover:text-[#B8C6D8]">
          <i class="fa-solid fa-x text-2xl"></i>
        </button>
        <img :src="currentImage" :alt="''" class="max-w-full max-h-full object-contain" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';

interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  isUnread: boolean;
  isAuthor?: boolean;
  images?: string[];
  replies?: Comment[];
}

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface CommentSectionProps {
  postId?: string;
  darkMode?: boolean;
  authorId?: string;
}

const props = withDefaults(defineProps<CommentSectionProps>(), {
  postId: 'default-post',
  darkMode: true,
  authorId: '1'
});

const router = useRouter();

const EMOJI_LIST = [
  '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
  '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
  '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏'
];

const REPORT_REASONS = ['垃圾广告', '不友善行为', '色情内容', '政治敏感', '盗用他人作品', '其他原因'];

const mockUsers: User[] = [
  { id: '1', username: '极简摄影师林风', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c' },
  { id: '2', username: '极简摄影师林静', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20female%20glasses&sign=bcb6273a0e310c266e722c0131d6e146' },
  { id: '3', username: '建筑摄影师王强', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architecture%20photographer%20male%20smiling&sign=3c23397344efe1e22c0131d6e146' },
  { id: '4', username: '摄影学习者小张', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20student%20male&sign=c8c88269cfd5ed96c4081bb7a4ed50b8' },
  { id: '5', username: '艺术摄影师陈默', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20photographer%20male%20creative&sign=bceaa07bd21b90efedda5c86e7059959' }
];

const isAuthenticated = ref(true);
const user = ref<User>(mockUsers[0]);

const commentText = ref('');
const replyText = ref('');
const replyingTo = ref<string | null>(null);
const replyingToUser = ref<string | null>(null);
const showEmojiPicker = ref(false);
const showReplyEmojiPicker = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const filterType = ref<'all' | 'my' | 'author'>('all');
const sortType = ref<'latest' | 'popular'>('latest');
const theme = ref<'light' | 'dark'>('dark');
const showEditModal = ref(false);
const showDeleteModal = ref(false);
const showReportModal = ref(false);
const showImagePreview = ref(false);
const currentImage = ref('');
const editingComment = ref<Comment | null>(null);
const deletingComment = ref<Comment | null>(null);
const reportingComment = ref<Comment | null>(null);
const reportReason = ref('');
const reportNote = ref('');
const selectedImages = ref<FileList | null>(null);
const imagePreviews = ref<string[]>([]);
const commentSectionRef = ref<HTMLElement | null>(null);
const showMentionDropdown = ref(false);
const mentionQuery = ref('');
const showReplyMentionDropdown = ref(false);
const replyMentionQuery = ref('');
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const replyInputRef = ref<HTMLInputElement | null>(null);

const comments = ref<Comment[]>(() => {
  const savedComments = localStorage.getItem(`comments_${props.postId}`);
  if (savedComments) {
    try {
      return JSON.parse(savedComments);
    } catch {
      console.error('Failed to parse comments from localStorage');
    }
  }
  return [
    {
      id: '1',
      userId: '2',
      username: '极简摄影师林静',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20female%20glasses&sign=bcb6273a0e310c266e722c0131d6e146',
      content: '这张作品的几何构图非常出色，线条的运用和光影对比恰到好处。特别喜欢你对空间的处理，留白部分增强了整体的极简美感。请问是使用什么方式调整黑白对比的？',
      date: '2023-10-25 10:23',
      likes: 125,
      isLiked: false,
      isUnread: false,
      replies: [
        {
          id: '1-1',
          userId: '1',
          username: '极简摄影师林风',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
          content: '谢谢喜欢！我使用了Lightroom的色调曲线工具进行精细调整，重点强化了明暗交界线的对比，同时保留了阴影和高光的细节，避免过度调整导致的细节丢失。',
          date: '2023-10-25 11:45',
          likes: 89,
          isLiked: false,
          isUnread: false,
          isAuthor: true
        }
      ]
    },
    {
      id: '2',
      userId: '3',
      username: '建筑摄影师王强',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=architecture%20photographer%20male%20smiling&sign=3c23397344efe1e22c0131d6e146',
      content: '作为一名建筑摄影师，我非常欣赏这种捕捉几何美感的视角。这让我想起了埃姆斯住宅的一些经典摄影作品。请问拍摄时是否有特别等待光线的角度？',
      date: '2023-10-25 09:15',
      likes: 87,
      isLiked: false,
      isUnread: false,
      replies: [
        {
          id: '2-1',
          userId: '1',
          username: '极简摄影师林风',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
          content: '是的，我等待了大约30分钟，直到阳光到达这个特定角度，形成了我想要的光影效果。建筑摄影中，光线的方向和质量对最终效果的影响非常大，值得花时间等待最佳时机。',
          date: '2023-10-25 09:30',
          likes: 56,
          isLiked: false,
          isUnread: false,
          isAuthor: true
        }
      ]
    },
    {
      id: '3',
      userId: '4',
      username: '摄影学习者小张',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=young%20photographer%20student%20male&sign=c8c88269cfd5ed96c4081bb7a4ed50b8',
      content: '我正在学习极简摄影，想请教一下如何在城市环境中发现这种简洁的构图？有什么寻找拍摄对象的技巧吗？',
      date: '2023-10-25 08:30',
      likes: 56,
      isLiked: false,
      isUnread: false,
      replies: [
        {
          id: '3-1',
          userId: '1',
          username: '极简摄影师林风',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
          content: '我的建议是：1. 放慢脚步，用"框架思维"观察周围环境；2. 寻找重复的图案和线条；3. 尝试从不同角度观察同一物体；4. 使用三分法或对称构图；5. 关注负空间的重要性；6. 练习用单色模式（黑白）观察场景，有助于聚焦于形状和线条。最重要的是多拍多练，培养自己的极简视觉。',
          date: '2023-10-25 09:00',
          likes: 120,
          isLiked: false,
          isUnread: false,
          isAuthor: true
        },
        {
          id: '3-2',
          userId: '5',
          username: '艺术摄影师陈默',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=art%20photographer%20male%20creative&sign=bceaa07bd21b90efedda5c86e7059959',
          content: '补充一点，我建议随身携带一个小取景器或者用双手框成矩形来辅助构图，这有助于训练你的眼睛直接识别场景中的几何元素和简洁构图。另外，可以尝试使用定焦镜头，限制自己的视角，从而更专注于构图本身。',
          date: '2023-10-25 09:30',
          likes: 67,
          isLiked: false,
          isUnread: false
        }
      ]
    },
    {
      id: '4',
      userId: '6',
      username: '风光摄影爱好者',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20nature%20lover&sign=d96b376fb9cd51636566b2ae4aadba91',
      content: '太美了！构图和光影都处理得非常到位，很有层次感。',
      date: '2023-10-24 18:30',
      likes: 45,
      isLiked: false,
      isUnread: false
    },
    {
      id: '5',
      userId: '7',
      username: '黑白摄影迷',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=black%20and%20white%20photography%20enthusiast%20female&sign=4fa04d0aaebb4ea5a6a229b04f9aa724',
      content: '作为黑白摄影爱好者，我非常欣赏这种风格。对比度把握得恰到好处，细节保留得也很好。',
      date: '2023-10-24 16:45',
      likes: 32,
      isLiked: false,
      isUnread: false
    },
    {
      id: '6',
      userId: '8',
      username: '新手摄影师',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=beginner%20photographer%20male%20smiling&sign=e1c13e886354d52a32477c541ea6bfd7',
      content: '请问这张照片用的是什么相机和镜头拍摄的？',
      date: '2023-10-24 14:20',
      likes: 18,
      isLiked: false,
      isUnread: false,
      replies: [
        {
          id: '6-1',
          userId: '1',
          username: '极简摄影师林风',
          avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c',
          content: '用的是索尼A7R IV和24-70mm F2.8 GM镜头。',
          date: '2023-10-24 15:00',
          likes: 12,
          isLiked: false,
          isUnread: false,
          isAuthor: true
        }
      ]
    },
    {
      id: '7',
      userId: '9',
      username: '城市摄影师',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=urban%20photographer%20female%20city%20explorer&sign=75862c84fa36ba4e41a4de50cd81b0a7',
      content: '城市中的极简之美，捕捉得非常棒！我也经常在城市中寻找这样的构图机会。',
      date: '2023-10-23 19:10',
      likes: 29,
      isLiked: false,
      isUnread: true
    },
    {
      id: '8',
      userId: '10',
      username: '构图研究僧',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=composition%20enthusiast%20male%20glasses&sign=6a17e125a003f2b747f8ad976f0caf6e',
      content: '从构图学的角度来看，这张照片的三分法运用得非常到位，视觉引导线也很清晰。给个赞！',
      date: '2023-10-23 17:30',
      likes: 36,
      isLiked: false,
      isUnread: true
    }
  ];
});

onMounted(() => {
  const commentDraft = localStorage.getItem(`commentDraft_${props.postId}`);
  if (commentDraft) {
    commentText.value = commentDraft;
  }

  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
  if (savedTheme) {
    theme.value = savedTheme;
  } else if (props.darkMode) {
    theme.value = 'dark';
  }
});

watch(comments, (newComments) => {
  localStorage.setItem(`comments_${props.postId}`, JSON.stringify(newComments));
}, { deep: true });

watch(commentText, (newText) => {
  const timer = setTimeout(() => {
    if (newText.trim()) {
      localStorage.setItem(`commentDraft_${props.postId}`, newText);
    } else {
      localStorage.removeItem(`commentDraft_${props.postId}`);
    }
  }, 500);
  return () => clearTimeout(timer);
});

watch([replyText, replyingTo], ([newReplyText, newReplyingTo]) => {
  if (newReplyingTo && newReplyText.trim()) {
    localStorage.setItem(`replyDraft_${props.postId}_${newReplyingTo}`, newReplyText);
  } else if (newReplyingTo) {
    localStorage.removeItem(`replyDraft_${props.postId}_${newReplyingTo}`);
  }
});

watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme);
});

const handleCommentInputChange = () => {
  const value = commentText.value;
  const lastAtIndex = value.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const afterAtIndex = value.substring(lastAtIndex + 1);
    if (afterAtIndex.indexOf(' ') === -1) {
      mentionQuery.value = afterAtIndex;
      showMentionDropdown.value = true;
    } else {
      showMentionDropdown.value = false;
    }
  } else {
    showMentionDropdown.value = false;
  }
};

const handleReplyInputChange = () => {
  const value = replyText.value;
  const lastAtIndex = value.lastIndexOf('@');
  if (lastAtIndex !== -1) {
    const afterAtIndex = value.substring(lastAtIndex + 1);
    if (afterAtIndex.indexOf(' ') === -1) {
      replyMentionQuery.value = afterAtIndex;
      showReplyMentionDropdown.value = true;
    } else {
      showReplyMentionDropdown.value = false;
    }
  } else {
    showReplyMentionDropdown.value = false;
  }
};

const handleMentionSelect = (selectedUser: User) => {
  const lastAtIndex = commentText.value.lastIndexOf('@');
  commentText.value = commentText.value.substring(0, lastAtIndex) + `@${selectedUser.username} `;
  showMentionDropdown.value = false;
  mentionQuery.value = '';
  nextTick(() => {
    textareaRef.value?.focus();
  });
};

const handleReplyMentionSelect = (selectedUser: User) => {
  const lastAtIndex = replyText.value.lastIndexOf('@');
  replyText.value = replyText.value.substring(0, lastAtIndex) + `@${selectedUser.username} `;
  showReplyMentionDropdown.value = false;
  replyMentionQuery.value = '';
  nextTick(() => {
    replyInputRef.value?.focus();
  });
};

const formatCommentText = (text: string) => {
  const mentionRegex = /@(\S+)/g;
  let formatted = text.replace(mentionRegex, '<span class="text-[#4A5F8B] font-medium">$&</span>');
  const tagRegex = /#(\S+)/g;
  formatted = formatted.replace(tagRegex, '<span class="text-[#4A5F8B] font-medium">$&</span>');
  const boldRegex = /\*\*([^*]+)\*\*/g;
  formatted = formatted.replace(boldRegex, '<strong>$1</strong>');
  const italicRegex = /\*([^*]+)\*/g;
  formatted = formatted.replace(italicRegex, '<em>$1</em>');
  return formatted.replace(/\n/g, '<br>');
};

const handleImagePreview = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const files = target.files;
  if (files.length > 9) {
    alert('最多上传9张图片');
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

const handleSubmitComment = () => {
  if (!isAuthenticated.value) {
    alert('请先登录后再评论');
    return;
  }

  if (!commentText.value.trim() && imagePreviews.value.length === 0) {
    alert('评论内容不能为空');
    return;
  }

  const newComment: Comment = {
    id: `comment-${Date.now()}`,
    userId: user.value?.id || '',
    username: user.value?.username || '',
    avatar: user.value?.avatar || '',
    content: commentText.value.trim(),
    date: new Date().toLocaleString('zh-CN'),
    likes: 0,
    isLiked: false,
    isUnread: true,
    images: imagePreviews.value.length > 0 ? imagePreviews.value : undefined
  };

  comments.value = [newComment, ...comments.value];
  commentText.value = '';
  imagePreviews.value = [];
  selectedImages.value = null;
  localStorage.removeItem(`commentDraft_${props.postId}`);
  alert('评论发表成功');
};

const handleSubmitReply = (commentId: string) => {
  if (!isAuthenticated.value) {
    alert('请先登录后再回复');
    return;
  }

  if (!replyText.value.trim()) {
    alert('回复内容不能为空');
    return;
  }

  const newReply: Comment = {
    id: `reply-${Date.now()}`,
    userId: user.value?.id || '',
    username: user.value?.username || '',
    avatar: user.value?.avatar || '',
    content: replyText.value.trim(),
    date: new Date().toLocaleString('zh-CN'),
    likes: 0,
    isLiked: false,
    isUnread: true
  };

  comments.value = comments.value.map(comment => {
    if (comment.id === commentId) {
      return {
        ...comment,
        replies: [...(comment.replies || []), newReply]
      };
    }
    return comment;
  });

  cancelReply();
  alert('回复发表成功');
};

const cancelReply = () => {
  replyText.value = '';
  replyingTo.value = null;
  replyingToUser.value = null;
  showReplyEmojiPicker.value = false;
};

const handleLike = (commentId: string, isReply = false, replyId?: string) => {
  if (!isAuthenticated.value) {
    alert('请先登录后再点赞');
    return;
  }

  comments.value = comments.value.map(comment => {
    if (comment.id === commentId && !isReply) {
      return {
        ...comment,
        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        isLiked: !comment.isLiked
      };
    }

    if (isReply && comment.replies) {
      return {
        ...comment,
        replies: comment.replies.map(reply => {
          if (reply.id === replyId) {
            return {
              ...reply,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
              isLiked: !reply.isLiked
            };
          }
          return reply;
        })
      };
    }

    return comment;
  });
};

const handleEditComment = () => {
  if (!editingComment.value) return;

  comments.value = comments.value.map(comment => {
    if (comment.id === editingComment.value?.id) {
      return {
        ...comment,
        content: editingComment.value.content,
        date: new Date().toLocaleString('zh-CN')
      };
    }

    if (comment.replies) {
      return {
        ...comment,
        replies: comment.replies.map(reply => {
          if (reply.id === editingComment.value?.id) {
            return {
              ...reply,
              content: editingComment.value.content,
              date: new Date().toLocaleString('zh-CN')
            };
          }
          return reply;
        })
      };
    }

    return comment;
  });

  showEditModal.value = false;
  editingComment.value = null;
  alert('评论已更新');
};

const handleDeleteComment = () => {
  if (!deletingComment.value) return;

  comments.value = comments.value.filter(comment => {
    if (comment.id === deletingComment.value?.id) {
      return false;
    }
    if (comment.replies) {
      comment.replies = comment.replies.filter(reply => reply.id !== deletingComment.value?.id);
    }
    return true;
  });

  showDeleteModal.value = false;
  deletingComment.value = null;
  alert('评论已删除');
};

const handleReportComment = () => {
  if (!reportingComment.value || !reportReason.value) {
    alert('请选择举报原因');
    return;
  }

  showReportModal.value = false;
  reportingComment.value = null;
  reportReason.value = '';
  reportNote.value = '';
  alert('举报已提交，我们会尽快处理');
};

const openEditModal = (comment: Comment) => {
  editingComment.value = { ...comment };
  showEditModal.value = true;
};

const openDeleteModal = (comment: Comment) => {
  deletingComment.value = comment;
  showDeleteModal.value = true;
};

const openReportModal = (comment: Comment) => {
  reportingComment.value = comment;
  showReportModal.value = true;
};

const openImagePreview = (image: string) => {
  currentImage.value = image;
  showImagePreview.value = true;
};

const replyToComment = (comment: Comment) => {
  replyingTo.value = comment.id;
  replyingToUser.value = comment.username;
  const replyDraft = localStorage.getItem(`replyDraft_${props.postId}_${comment.id}`);
  if (replyDraft) {
    replyText.value = replyDraft;
  } else {
    replyText.value = `@${comment.username} `;
  }

  nextTick(() => {
    const replyInput = document.getElementById(`reply-input-${comment.id}`);
    replyInput?.focus();
  });
};

const replyToReply = (comment: Comment, reply: Comment) => {
  replyingTo.value = comment.id;
  replyingToUser.value = reply.username;
  replyText.value = `@${reply.username} `;

  nextTick(() => {
    const replyInput = document.getElementById(`reply-input-${comment.id}`);
    replyInput?.focus();
  });
};

const markAllAsRead = () => {
  comments.value = comments.value.map(comment => {
    const updatedComment = { ...comment, isUnread: false };
    if (comment.replies) {
      updatedComment.replies = comment.replies.map(reply => ({ ...reply, isUnread: false }));
    }
    return updatedComment;
  });
  alert('已将所有评论标记为已读');
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '刚刚';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}天前`;
  return dateString.split(' ')[0];
};

const isAuthor = (comment: Comment) => {
  return comment.userId === props.authorId || comment.isAuthor;
};

const filteredComments = computed(() => {
  return comments.value.filter(comment => {
    if (filterType.value === 'my' && isAuthenticated.value) {
      return comment.userId === user.value?.id;
    }
    if (filterType.value === 'author') {
      return isAuthor(comment);
    }
    return true;
  });
});

const sortedComments = computed(() => {
  return [...filteredComments.value].sort((a, b) => {
    if (sortType.value === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return b.likes - a.likes;
  });
});

const totalPages = computed(() => Math.ceil(sortedComments.value.length / pageSize.value));
const paginatedComments = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return sortedComments.value.slice(startIndex, startIndex + pageSize.value);
});

const unreadCount = computed(() => {
  return comments.value.reduce((count, comment) => {
    let unread = comment.isUnread ? 1 : 0;
    if (comment.replies) {
      unread += comment.replies.filter(reply => reply.isUnread).length;
    }
    return count + unread;
  }, 0);
});

const filteredUsers = computed(() => {
  return mockUsers.filter(
    userItem => userItem.username.toLowerCase().includes(mentionQuery.value.toLowerCase()) && userItem.id !== user.value?.id
  );
});

const filteredReplyUsers = computed(() => {
  return mockUsers.filter(
    userItem => userItem.username.toLowerCase().includes(replyMentionQuery.value.toLowerCase()) && userItem.id !== user.value?.id
  );
});

const getPageRange = () => {
  const range: number[] = [];
  let start = Math.max(1, currentPage.value - 2);
  let end = Math.min(totalPages.value, start + 4);
  if (end - start < 4 && start > 1) {
    start = Math.max(1, end - 4);
  }
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  return range;
};

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  commentSectionRef.value?.scrollIntoView({ behavior: 'smooth' });
};

const colors = computed(() => ({
  container: 'bg-[#2D3748] border-[#4A5F8B]',
  formBg: 'bg-[#1E2532]',
  text: 'text-[#B8C6D8]',
  primaryText: 'text-[#F5F7FA]',
  secondaryText: 'text-[#6B7C93]',
  button: 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]',
  buttonHover: 'hover:bg-[#6B7C93]',
  linkHover: 'hover:text-[#4A5F8B]',
  inputBg: 'bg-[#1E2532] border-[#4A5F8B] text-[#F5F7FA]',
  placeholder: 'placeholder:text-[#6B7C93]',
  likeButton: 'text-[#6B7C93] hover:text-[#F5F7FA]',
  liked: 'text-[#4A5F8B]',
  notificationBg: 'bg-[#1E2532] border-[#4A5F8B]',
  loginPromptBg: 'bg-[#1E2532] border-[#4A5F8B]',
  loginPromptText: 'text-[#B8C6D8]',
  loginButton: 'bg-[#4A5F8B] text-[#F5F7FA]',
  loginButtonHover: 'hover:bg-[#6B7C93]',
  registerButton: 'text-[#4A5F8B] border-[#4A5F8B] hover:bg-[#4A5F8B]/20'
}));
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
</style>