<template>
  <div :class="['relative inline-block', className, 'z-50']">
    <button
      @click="showMenu = !showMenu"
      :class="['rounded-full flex items-center justify-center hover:bg-[#6B7C93] transition-colors', buttonSizeClass]"
      aria-label="分享"
    >
      <i class="fa-solid fa-share-nodes"></i>
    </button>
    
    <transition name="fade">
      <div
        v-if="showMenu"
        class="absolute right-0 mt-2 w-48 bg-[#2D3748] rounded-lg shadow-lg border border-[#4A5F8B] py-2 z-50"
      >
        <button 
          class="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
          @click="shareToPlatform('weibo')"
        >
          <i class="fa-brands fa-weibo mr-2 text-[#E6162D]"></i> 分享到微博
        </button>
        <button 
          class="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
          @click="shareToPlatform('qq')"
        >
          <i class="fa-brands fa-qq mr-2 text-[#12B7F5]"></i> 分享到QQ
        </button>
        <button 
          class="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
          @click="shareToPlatform('wechat')"
        >
          <i class="fa-brands fa-weixin mr-2 text-[#07C160]"></i> 分享到微信
        </button>
        <button 
          class="w-full text-left px-4 py-2 text-[#F5F7FA] hover:bg-[#4A5F8B] transition-colors flex items-center"
          @click="copyToClipboard"
        >
          <i class="fa-solid fa-link mr-2"></i> 复制链接
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  url: string
  title?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  className: '',
  size: 'md'
})

const showMenu = ref(false)

const buttonSizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8 bg-[#4A5F8B] text-[#F5F7FA]'
    case 'lg': return 'w-12 h-12 bg-[#4A5F8B] text-[#F5F7FA]'
    default: return 'w-10 h-10 bg-[#4A5F8B] text-[#F5F7FA]'
  }
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.url)
    alert('链接已复制到剪贴板')
    showMenu.value = false
  } catch (err) {
    alert('复制失败，请手动复制')
  }
}

const shareToPlatform = (platform: 'weibo' | 'qq' | 'wechat') => {
  let shareUrl = ''
  const encodedUrl = encodeURIComponent(props.url)
  const encodedTitle = encodeURIComponent(props.title || '')
  
  switch (platform) {
    case 'weibo':
      shareUrl = `https://service.weibo.com/share/share.php?url=${encodedUrl}&title=${encodedTitle}`
      break
    case 'qq':
      shareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodedUrl}&title=${encodedTitle}`
      break
    case 'wechat':
      alert('请在微信中打开此链接进行分享')
      return
  }
  
  window.open(shareUrl, '_blank', 'width=600,height=400')
  showMenu.value = false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-10px);
}
</style>
