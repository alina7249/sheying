<template>
  <div class="space-y-4">
    <!-- 文件上传进度条 -->
    <div
      v-if="isFileUploading"
      class="rounded-lg overflow-hidden"
      :class="theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100'"
    >
      <div
        class="h-1.5 transition-all"
        :class="theme === 'dark' ? 'bg-[#4A5F8B]' : 'bg-blue-500'"
        :style="{ width: `${uploadingProgress}%` }"
      />
      <div class="flex justify-between items-center p-2 text-xs">
        <span :class="theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'">上传文件中…</span>
        <span :class="theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-600'">{{ uploadingProgress }}%</span>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div
      class="rounded-xl p-3 flex items-end space-x-2 shadow-sm"
      :class="theme === 'dark' ? 'bg-[#1E2532] border border-[#4A5F8B]' : 'bg-gray-100'"
    >
      <input
        type="file"
        ref="fileInputRef"
        @change="handleFileUpload"
        accept=".txt,.pdf,.jpg,.jpeg,.png,.gif"
        class="hidden"
      />

      <!-- 工具栏 - 左侧图标 -->
      <div class="flex items-center space-x-1">
        <button
          @click="triggerFileUpload"
          :disabled="isUploading"
          class="p-2 rounded-lg transition-colors"
          :class="[
            isUploading
              ? theme === 'dark' ? 'text-[#4A5F8B] cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
              : theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
          ]"
          title="上传文件（TXT/PDF/图片）"
        >
          <i class="fa-solid fa-paperclip"></i>
        </button>

        <button
          :disabled="isUploading || !message.trim()"
          class="p-2 rounded-lg transition-colors"
          :class="[
            isUploading || !message.trim()
              ? theme === 'dark' ? 'text-[#4A5F8B] cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
              : theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
          ]"
          title="格式化"
        >
          <i class="fa-solid fa-paint-brush"></i>
        </button>
      </div>

      <!-- 文本输入框 -->
      <textarea
        ref="textareaRef"
        v-model="message"
        @keydown="handleKeyDown"
        placeholder="输入您的问题，按Enter发送，Shift+Enter换行…"
        class="flex-1 p-2 bg-transparent resize-none focus:outline-none"
        :class="theme === 'dark' ? 'text-white placeholder:text-[#6B7C93]' : 'text-gray-800 placeholder:text-gray-500'"
        rows="1"
        :disabled="isUploading"
        @input="adjustTextareaHeight"
      />

      <!-- 更多选项 -->
      <div class="relative">
        <button
          @click="isOptionsOpen = !isOptionsOpen"
          :disabled="isUploading"
          class="p-2 rounded-lg transition-colors"
          :class="[
            isUploading
              ? theme === 'dark' ? 'text-[#4A5F8B] cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
              : theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
          ]"
          title="更多选项"
        >
          <i class="fa-solid fa-ellipsis"></i>
        </button>

        <div
          v-if="isOptionsOpen"
          class="absolute right-0 bottom-full mb-2 w-48 rounded-lg shadow-xl z-20"
          :class="theme === 'dark' ? 'bg-[#2D3748] border border-[#4A5F8B]' : 'bg-white border border-gray-200'"
        >
          <div class="py-1">
            <button
              @click="handleClearChat"
              class="w-full text-left px-4 py-2 text-sm transition-colors"
              :class="theme === 'dark' ? 'hover:bg-[#4A5F8B]/20 text-[#B8C6D8]' : 'hover:bg-gray-100 text-gray-700'"
            >
              <i class="fa-solid fa-trash-can mr-2"></i>清空对话
            </button>
            <button
              @click="handleExportChat"
              class="w-full text-left px-4 py-2 text-sm transition-colors"
              :class="theme === 'dark' ? 'hover:bg-[#4A5F8B]/20 text-[#B8C6D8]' : 'hover:bg-gray-100 text-gray-700'"
            >
              <i class="fa-solid fa-file-export mr-2"></i>导出对话
            </button>
            <div class="border-t border-dashed my-1" :class="theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-300'"></div>
            <button
              class="w-full text-left px-4 py-2 text-sm transition-colors"
              :class="theme === 'dark' ? 'hover:bg-[#4A5F8B]/20 text-[#B8C6D8]' : 'hover:bg-gray-100 text-gray-700'"
            >
              <i class="fa-solid fa-question-circle mr-2"></i>使用帮助
            </button>
          </div>
        </div>
      </div>

      <!-- AI角色选择下拉菜单 -->
      <div class="relative">
        <button
          @click="isRoleDropdownOpen = !isRoleDropdownOpen"
          :disabled="isUploading"
          class="p-2 rounded-lg transition-colors flex items-center space-x-1"
          :class="[
            isUploading
              ? theme === 'dark' ? 'text-[#4A5F8B] cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
              : theme === 'dark' ? 'hover:bg-[#4A5F8B] text-[#B8C6D8]' : 'hover:bg-gray-200 text-gray-600'
          ]"
          title="选择AI角色"
        >
          <span class="text-xs hidden sm:inline">
            {{ selectedRole?.name || '选择角色' }}
          </span>
          <i class="fa-solid fa-chevron-down text-xs"></i>
        </button>

        <div
          v-if="isRoleDropdownOpen"
          class="absolute right-0 bottom-full mb-2 w-64 rounded-lg shadow-xl z-20"
          :class="theme === 'dark' ? 'bg-[#2D3748] border border-[#4A5F8B]' : 'bg-white border border-gray-200'"
        >
          <div class="p-3 border-b" :class="theme === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200'">
            <h4 class="font-medium" :class="theme === 'dark' ? 'text-white' : 'text-gray-800'">选择AI助手</h4>
            <p class="text-xs mt-1" :class="theme === 'dark' ? 'text-[#B8C6D8]' : 'text-gray-500'">
              不同角色提供不同专业领域的回答
            </p>
          </div>
          <div class="py-2 max-h-60 overflow-y-auto">
            <button
              v-for="role in availableRoles"
              :key="role.id"
              @click="handleRoleSelect(role)"
              class="w-full text-left px-4 py-3 text-sm transition-colors flex items-center"
              :class="[
                selectedRole?.id === role.id
                  ? theme === 'dark' ? 'bg-[#4A5F8B]/30 text-white' : 'bg-blue-50 text-blue-700'
                  : theme === 'dark' ? 'hover:bg-[#4A5F8B]/10 text-[#B8C6D8]' : 'hover:bg-gray-100 text-gray-700'
              ]"
            >
              <div class="w-8 h-8 rounded-full overflow-hidden mr-3">
                <img :src="role.avatar" :alt="role.name" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="truncate">{{ role.name }}</p>
                <p class="text-xs truncate mt-0.5" :class="theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'">
                  {{ role.description }}
                </p>
              </div>
              <i v-if="selectedRole?.id === role.id" class="fa-solid fa-check ml-2 text-sm"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 发送按钮 -->
      <button
        @click="handleSendMessage"
        :disabled="!message.trim() || isUploading"
        class="p-2.5 rounded-full transition-colors shadow-sm"
        :class="[
          !message.trim() || isUploading
            ? theme === 'dark' ? 'bg-[#4A5F8B] text-[#6B7C93] cursor-not-allowed' : 'bg-blue-300 text-blue-100 cursor-not-allowed'
            : theme === 'dark'
              ? 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93] shadow-[0_2px_10px_rgba(74,95,139,0.3)]'
              : 'bg-blue-500 text-white hover:bg-blue-600 shadow-[0_2px_10px_rgba(59,130,246,0.3)]'
        ]"
        title="发送消息"
      >
        <i class="fa-solid fa-paper-plane"></i>
      </button>
    </div>

    <!-- 使用提示 -->
    <div class="text-xs text-center">
      <span :class="theme === 'dark' ? 'text-[#6B7C93]' : 'text-gray-500'">
        提示：您可以咨询摄影技术、器材选择、后期处理等问题 | 支持拖拽文件上传
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { toast } from 'vue-sonner';
import { useAuthStore } from '../../store/authStore';
import { useChatStore, AIRole } from '../../store/chatStore';

const props = defineProps<{
  pendingPrompt?: string;
}>();

const emit = defineEmits<{
  (e: 'prompt-consumed'): void;
}>();

const authStore = useAuthStore();
const chatStore = useChatStore();

const theme = computed(() => authStore.theme);
const currentChatId = computed(() => chatStore.currentChatId);
const isFileUploading = computed(() => chatStore.isFileUploading);
const uploadingProgress = computed(() => chatStore.uploadingProgress);
const selectedRole = computed(() => chatStore.selectedRole);
const availableRoles = computed(() => chatStore.availableRoles);

const message = ref('');
const isUploading = ref(false);
const isRoleDropdownOpen = ref(false);
const isOptionsOpen = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

watch(() => props.pendingPrompt, (newPrompt) => {
  if (newPrompt) {
    message.value = newPrompt;
    emit('prompt-consumed');
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.focus();
        adjustTextareaHeight();
      }
    });
  }
});

function nextTick(fn: () => void) {
  setTimeout(fn, 0);
}

const triggerFileUpload = () => {
  fileInputRef.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const validTypes = ['text/plain', 'application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    toast.error('仅支持TXT、PDF和常见图片格式');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error('文件大小不能超过10MB');
    return;
  }

  chatStore.setIsFileUploading(true);
  isUploading.value = true;
  chatStore.setFileUploadProgress(0);

  let progress = 0;
  const interval = setInterval(() => {
    progress += 5;
    chatStore.setFileUploadProgress(progress);

    if (progress >= 100) {
      clearInterval(interval);

      setTimeout(() => {
        if (currentChatId.value) {
          chatStore.addMessage(currentChatId.value, {
            content: `已上传文件: ${file.name}`,
            sender: 'user'
          });

          chatStore.setIsTyping(true);
          setTimeout(() => {
            chatStore.addMessage(currentChatId.value, {
              content: `我已经分析了您上传的文件 ${file.name}。这是一份关于摄影技巧的文档，主要包含了曝光三要素、构图技巧和后期处理的基础知识。请问您对哪部分内容有特别的疑问？`,
              sender: 'ai'
            });
            chatStore.setIsFileUploading(false);
            isUploading.value = false;
            chatStore.setIsTyping(false);
          }, 1000);
        }
      }, 500);
    }
  }, 150);

  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const handleSendMessage = () => {
  if (!message.value.trim() || !currentChatId.value) return;

  const userMsg = message.value.trim();
  const aiMsgId = `msg-${Date.now()}`;

  chatStore.addMessage(currentChatId.value, {
    content: userMsg,
    sender: 'user'
  });

  message.value = '';

  chatStore.setIsTyping(true);

  chatStore.addMessage(currentChatId.value, {
    content: '',
    sender: 'ai'
  });

  setTimeout(() => {
    let fullResponse = '';
    const lowerMessage = userMsg.toLowerCase();

    if (selectedRole.value) {
      switch (selectedRole.value.id) {
        case 'photography-expert':
          if (lowerMessage.includes('曝光') || lowerMessage.includes('光圈') || lowerMessage.includes('快门') || lowerMessage.includes('iso')) {
            fullResponse = '曝光三要素是摄影的基础：\n\n1. 光圈：控制进光量和景深\n   大光圈适合人像，小光圈适合风光\n\n2. 快门速度：控制曝光时间\n   高速快门凝固运动，低速快门创造模糊\n\n3. ISO：控制传感器灵敏度\n   低ISO画质细腻，高ISO适合暗光\n\n三者相互平衡才能获得正确曝光。';
          } else if (lowerMessage.includes('构图')) {
            fullResponse = '摄影构图是创作优秀作品的关键：\n\n1. 三分法：将主体放在交叉点上\n2. 引导线：利用线条引导视线\n3. 框架构图：利用前景创建框架\n4. 对比构图：通过对比突出主体\n5. 对称构图：创造平衡的视觉效果\n\n构图没有固定规则，关键要表达您的创意。';
          } else if (lowerMessage.includes('相机') || lowerMessage.includes('推荐') || lowerMessage.includes('入门')) {
            fullResponse = '推荐几款适合新手的相机：\n\n1. 佳能EOS R50 - 轻便易用，直出色彩好\n2. 索尼A6400 - 对焦出色，视频能力强\n3. 尼康Z50 - 操控出色，性价比高\n4. 富士X-S10 - 颜值高，胶片模拟丰富\n\n建议先确定预算和拍摄需求，再选择最合适的机型。';
          } else {
            fullResponse = '作为摄影专家，我可以为您提供以下帮助：\n\n- 摄影基础理论知识\n- 各类题材拍摄技巧\n- 光线控制与运用\n- 色彩理论与搭配\n- 创意构图指导\n\n您有什么具体的摄影问题需要解答吗？';
          }
          break;

        case 'equipment-advisor':
          if (lowerMessage.includes('相机') || lowerMessage.includes('镜头')) {
            fullResponse = '关于器材选择，建议考虑以下几点：\n\n1. 预算范围确定可选档次\n2. 风光选广角，人像选中长焦\n3. 考虑品牌生态系统的完整性\n\n您主要拍什么类型？我可以给出更具体的建议。';
          } else if (lowerMessage.includes('三脚架') || lowerMessage.includes('滤镜') || lowerMessage.includes('配件')) {
            fullResponse = '摄影配件建议：\n\n三脚架：碳纤维轻便适合户外，铝合金稳定适合室内\n滤镜：UV保护镜头，CPL消除反光，ND适合慢门\n闪光灯：原厂兼容性好，副厂性价比高\n\n您目前用什么相机？我可以推荐更匹配的配件。';
          } else {
            fullResponse = '作为器材顾问，我可以提供：\n\n- 相机和镜头选择推荐\n- 配件使用技巧\n- 参数解读与性能对比\n- 系统生态分析\n- 器材保养指南\n\n您在器材方面有什么具体问题吗？';
          }
          break;

        case 'copywriter':
          if (lowerMessage.includes('标题') || lowerMessage.includes('描述')) {
            fullResponse = '创作标题技巧：\n\n1. 简洁有力，传达作品核心\n2. 引发共鸣，唤起情感\n3. 制造悬念，激发好奇心\n4. 加入细节，突出独特性\n\n描述要点：分享背景故事、技术细节、创作思路，用生动语言描绘画面。';
          } else {
            fullResponse = '作为文案专家，我可以提供：\n\n- 摄影作品标题创作\n- 描述文案优化\n- 社交媒体策略\n- 品牌故事撰写\n- 文案风格定位\n\n需要为哪类作品创作文案呢？';
          }
          break;

        case 'photo-editor':
          if (lowerMessage.includes('后期') || lowerMessage.includes('修图') || lowerMessage.includes('lightroom') || lowerMessage.includes('调色')) {
            fullResponse = '照片后期基础流程：\n\nLightroom：\n1. 基础调整：曝光、对比度、高光、阴影\n2. 色彩校正：白平衡、色温、色调\n3. 细节增强：清晰度、锐化、降噪\n\n调色风格推荐：\n- 电影色调：降低饱和度，高光偏暖\n- 胶片风格：轻微对比降低，加颗粒感\n- 日系清新：曝光提高，色温偏冷';
          } else {
            fullResponse = '作为后期编辑专家，我可以提供：\n\n- Lightroom和Photoshop技巧\n- 各类风格调色教程\n- 后期工作流优化\n- 批量处理方法\n- 图像质量优化\n\n您想学习哪方面的后期技巧？';
          }
          break;

        default:
          fullResponse = '感谢您的提问！我是您的智能摄影助手，可以帮您解决各种摄影相关问题。请问有什么需要帮助的吗？';
      }
    } else {
      fullResponse = '感谢您的提问！我是您的智能摄影助手，可以帮助您解决摄影相关问题。您可以先选择一个AI角色来获得更专业的回答。';
    }

    streamResponse(aiMsgId, fullResponse);
  }, 800);
};

const streamResponse = (msgId: string, fullText: string) => {
  let index = 0;
  const chunkSize = 3 + Math.floor(Math.random() * 5);
  const interval = setInterval(() => {
    index += chunkSize;
    if (index >= fullText.length) {
      clearInterval(interval);
      chatStore.updateMessage(currentChatId.value!, msgId, { content: fullText });
      chatStore.setIsTyping(false);
      return;
    }
    chatStore.updateMessage(currentChatId.value!, msgId, { content: fullText.substring(0, index) });
  }, 30 + Math.random() * 40);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSendMessage();
  }
};

const handleRoleSelect = (role: AIRole) => {
  chatStore.setSelectedRole(role);
  isRoleDropdownOpen.value = false;
  toast.info(`已切换到 ${role.name}`);
};

const handleClearChat = () => {
  if (window.confirm('确定要清空当前对话吗？')) {
    chatStore.clearCurrentChat();
    toast.success('对话已清空');
  }
  isOptionsOpen.value = false;
};

const handleExportChat = () => {
  toast.info('导出对话功能已触发');
  isOptionsOpen.value = false;
};

const adjustTextareaHeight = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`;
  }
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.relative')) {
    isRoleDropdownOpen.value = false;
    isOptionsOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>