<template>
  <div :class="['flex items-center space-x-3', className]">
    <div class="relative flex-1">
      <label for="captcha" class="block text-sm font-medium text-[#E2E8F0] mb-1">
        验证码
      </label>
      <input
        id="captcha"
        type="text"
        :value="modelValue"
        @input="handleInputChange"
        :class="['w-full px-4 py-2 rounded-lg border border-[#4A5F8B]', inputClass]"
        placeholder="请输入验证码"
        maxlength="6"
      />
    </div>
    <canvas
      ref="canvasRef"
      class="cursor-pointer rounded-lg border border-[#4A5F8B]"
      @click="refreshCaptcha"
      title="点击刷新验证码"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  modelValue?: string
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  className: ''
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const captchaText = ref('')
const theme = ref('dark')

// 生成随机验证码
const generateCaptcha = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  captchaText.value = result
  drawCaptcha(result)
}

// 绘制验证码到canvas
const drawCaptcha = (text: string) => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  canvas.width = 120
  canvas.height = 40
  
  ctx.fillStyle = theme.value === 'dark' ? '#2D3748' : '#f8fafc'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  
  // 绘制干扰线
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = theme.value === 'dark' 
      ? `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)` 
      : `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`
    ctx.beginPath()
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height)
    ctx.stroke()
  }
  
  // 绘制干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = theme.value === 'dark' 
      ? `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.7)` 
      : `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.7)`
    ctx.beginPath()
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI)
    ctx.fill()
  }
  
  ctx.font = '20px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  for (let i = 0; i < text.length; i++) {
    ctx.fillStyle = theme.value === 'dark' 
      ? `rgb(${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 200) + 55}, ${Math.floor(Math.random() * 200) + 55})` 
      : `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})`
    
    ctx.save()
    ctx.translate(20 + i * 16, 20)
    ctx.rotate((Math.random() - 0.5) * 0.4)
    ctx.fillText(text.charAt(i), 0, 0)
    ctx.restore()
  }
}

const handleInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const refreshCaptcha = () => {
  generateCaptcha()
  emit('update:modelValue', '')
}

const inputClass = ref(theme.value === 'dark' ? 'bg-[#4A5568] text-[#FFFFFF]' : 'bg-white text-[#1E2532]')

onMounted(() => {
  generateCaptcha()
})

watch(theme, () => {
  generateCaptcha()
  inputClass.value = theme.value === 'dark' ? 'bg-[#4A5568] text-[#FFFFFF]' : 'bg-white text-[#1E2532]'
})
</script>
