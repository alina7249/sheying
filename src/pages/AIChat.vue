<template>
  <div class="min-h-screen bg-[#0F1C2D]">
    <div class="max-w-4xl mx-auto flex flex-col h-screen">
      <div class="bg-[#1E2532] border-b border-[#4A5F8B]/30 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <i class="fa-solid fa-robot text-white"></i>
            </div>
            <div>
              <h2 class="font-semibold text-white">AI 摄影助手</h2>
              <p class="text-sm text-[#6B7C93]">专业摄影知识问答，提升你的摄影技能</p>
            </div>
          </div>
          <button @click="clearChat" class="text-[#6B7C93] hover:text-white transition-colors">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          :class="['flex gap-4', message.isAI ? '' : 'flex-row-reverse']"
        >
          <div :class="['w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center', message.isAI ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-[#4A5F8B]']">
            <i :class="['fa-solid text-white', message.isAI ? 'fa-robot' : 'fa-user']"></i>
          </div>
          <div :class="['max-w-[80%]', message.isAI ? '' : 'text-right']">
            <div :class="['inline-block px-4 py-2 rounded-xl', message.isAI ? 'bg-[#4A5F8B]/30 text-white rounded-tl-sm' : 'bg-[#4A5F8B] text-white rounded-tr-sm']">
              <p class="whitespace-pre-wrap">{{ message.content }}</p>
            </div>
            <p class="text-xs text-[#6B7C93] mt-1">{{ message.time }}</p>
          </div>
        </div>

        <div v-if="isLoading" class="flex gap-4">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <i class="fa-solid fa-robot text-white"></i>
          </div>
          <div class="bg-[#4A5F8B]/30 rounded-xl px-4 py-3">
            <div class="flex gap-2">
              <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#1E2532] border-t border-[#4A5F8B]/30 p-4">
        <div class="flex gap-3">
          <button 
            @click="showQuickPrompts = !showQuickPrompts"
            class="flex-shrink-0 w-10 h-10 rounded-full bg-[#4A5F8B]/30 hover:bg-[#4A5F8B]/50 flex items-center justify-center text-[#4A5F8B] transition-colors"
          >
            <i class="fa-solid fa-lightbulb"></i>
          </button>
          <div class="flex-1 relative">
            <textarea
              v-model="inputMessage"
              @keydown.enter.exact.prevent="handleSend"
              placeholder="输入你的摄影问题..."
              rows="1"
              class="w-full px-4 py-3 bg-[#0F1C2D] border border-[#4A5F8B] rounded-xl text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] resize-none"
              style="min-height: 44px; max-height: 150px;"
              @input="adjustTextareaHeight"
              ref="textareaRef"
            ></textarea>
          </div>
          <button 
            @click="handleSend"
            :disabled="!inputMessage.trim()"
            :class="['flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors', inputMessage.trim() ? 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]' : 'bg-gray-700 text-gray-500 cursor-not-allowed']"
          >
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>

        <Transition name="slide">
          <div v-if="showQuickPrompts" class="mt-4 bg-[#0F1C2D] rounded-xl p-4">
            <h4 class="text-sm text-[#6B7C93] mb-3">快速提问</h4>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="prompt in quickPrompts" 
                :key="prompt"
                @click="useQuickPrompt(prompt)"
                class="px-3 py-1.5 bg-[#4A5F8B]/30 hover:bg-[#4A5F8B]/50 text-white text-sm rounded-lg transition-colors"
              >
                {{ prompt }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const inputMessage = ref('');
const messages = ref([
  {
    content: '你好！我是你的AI摄影助手，有什么摄影相关的问题我可以帮到你？',
    isAI: true,
    time: '刚刚'
  }
]);
const isLoading = ref(false);
const showQuickPrompts = ref(false);

const quickPrompts = [
  '如何选择合适的光圈和快门速度？',
  '人像摄影的光线技巧有哪些？',
  '推荐几款适合新手的相机',
  '后期修图常用软件有哪些？',
  '如何拍摄星空？',
  '风光摄影的构图技巧',
  '什么是RAW格式？',
  '镜头焦距如何选择？'
];

const mockResponses = [
  '光圈和快门速度是摄影中最基本也是最重要的两个参数。光圈控制景深，数值越小景深越浅；快门速度控制动态模糊，数值越大越能捕捉运动瞬间。通常需要根据拍摄场景和想要的效果来平衡这两个参数。',
  '人像摄影中，光线是灵魂。常用的光线技巧包括：使用柔光箱或反光板柔化硬光、寻找窗边的自然光、使用逆光营造轮廓光效果、尝试黄金时段拍摄等。',
  '对于摄影新手，推荐几款入门级相机：Canon EOS R100、Nikon Z30、Sony ZV-E10、Fujifilm X-T30 II。这些相机性价比高，操作友好，适合学习摄影基础。',
  '后期修图常用软件包括：Adobe Lightroom（专业级RAW处理）、Adobe Photoshop（精细修图）、Capture One（专业摄影师首选）、Affinity Photo（性价比高的替代方案）、Snapseed（手机端强大修图）。',
  '拍摄星空需要：选择晴朗无云的夜晚、远离城市光污染、使用广角镜头、设置高ISO（1600-6400）、使用大光圈（f/2.8或更大）、快门速度控制在10-30秒之间、使用三脚架和遥控器。',
  '风光摄影构图技巧：三分法构图、引导线构图、对称构图、框架构图、前景引导、层次分明、善用负空间、黄金时段拍摄、使用渐变滤镜平衡曝光。',
  'RAW格式是相机传感器直接捕获的原始数据文件，包含了最完整的图像信息。与JPEG相比，RAW保留了更多的动态范围和细节，给后期处理提供了更大的空间。',
  '镜头焦距选择：广角镜头（14-35mm）适合风光和建筑、标准镜头（35-50mm）适合人文纪实、长焦镜头（70mm以上）适合人像和野生动物、微距镜头适合特写拍摄。'
];

const adjustTextareaHeight = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto';
      textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 150) + 'px';
    }
  });
};

const handleSend = () => {
  if (!inputMessage.value.trim()) return;

  const userMessage = inputMessage.value.trim();
  messages.value.push({
    content: userMessage,
    isAI: false,
    time: '刚刚'
  });
  
  inputMessage.value = '';
  
  if (textareaRef.value) {
    textareaRef.value.style.height = '44px';
  }

  isLoading.value = true;

  setTimeout(() => {
    const responseIndex = quickPrompts.findIndex(p => p === userMessage);
    const response = responseIndex >= 0 
      ? mockResponses[responseIndex] 
      : '这是一个很好的问题！摄影是一门需要不断学习和实践的艺术。建议你多观察、多拍摄、多思考，逐渐形成自己的风格。如果有具体的技术问题，欢迎继续提问！';
    
    messages.value.push({
      content: response,
      isAI: true,
      time: '刚刚'
    });
    isLoading.value = false;
  }, 1500);
};

const useQuickPrompt = (prompt: string) => {
  inputMessage.value = prompt;
  showQuickPrompts.value = false;
};

const clearChat = () => {
  messages.value = [
    {
      content: '你好！我是你的AI摄影助手，有什么摄影相关的问题我可以帮到你？',
      isAI: true,
      time: '刚刚'
    }
  ];
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>