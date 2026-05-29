<template>
  <div class="lazy-image-wrapper" :class="{ loading: isLoading, loaded: isLoaded, error: hasError }">
    <div v-if="isLoading" class="image-skeleton">
      <div class="shimmer"></div>
    </div>
    <img
      v-if="!hasError"
      ref="imgRef"
      :src="src"
      :alt="alt"
      :class="['lazy-image', { visible: isLoaded }]"
      :loading="lazy ? 'lazy' : 'eager'"
      @load="onLoad"
      @error="onError"
    />
    <div v-if="hasError" class="error-placeholder">
      <i class="fa-solid fa-image text-4xl text-[#4A5F8B]"></i>
      <p class="text-sm text-[#6B7C93] mt-2">图片加载失败</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  src: string;
  alt: string;
  lazy?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true
});

const emit = defineEmits<{
  (e: 'load'): void;
  (e: 'error'): void;
}>();

const imgRef = ref<HTMLImageElement | null>(null);
const isLoading = ref(true);
const isLoaded = ref(false);
const hasError = ref(false);

const onLoad = () => {
  isLoading.value = false;
  isLoaded.value = true;
  emit('load');
};

const onError = () => {
  isLoading.value = false;
  hasError.value = true;
  emit('error');
};

watch(() => props.src, () => {
  isLoading.value = true;
  isLoaded.value = false;
  hasError.value = false;
});

onMounted(() => {
  if (imgRef.value && imgRef.value.complete) {
    onLoad();
  }
});
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #2D3748 25%, #3A4B6F 50%, #2D3748 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.shimmer {
  position: absolute;
  inset: 0;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.05);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.lazy-image.visible {
  opacity: 1;
  transform: scale(1);
}

.error-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #1E2532;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
