<template>
  <div
    ref="wrapperRef"
    class="lazy-image-wrapper"
    :class="{ loading: isLoading, loaded: isLoaded, error: hasError, rounded: rounded }"
    :style="{ borderRadius: rounded ? '0.75rem' : '0' }"
  >
    <div
      v-if="isLoading"
      class="image-skeleton"
      :style="{ backgroundColor: placeholderColor }"
      aria-hidden="true"
    >
      <div class="shimmer"></div>
    </div>
    <img
      v-if="!hasError && shouldLoad"
      ref="imgRef"
      :src="shouldLoad ? src : ''"
      :alt="alt"
      :width="width"
      :height="height"
      :fetchpriority="fetchpriority"
      :class="['lazy-image', { visible: isLoaded, rounded: rounded }]"
      :loading="lazy ? 'lazy' : 'eager'"
      @load="onLoad"
      @error="onError"
    />
    <div v-if="hasError" class="error-placeholder" :style="{ borderRadius: rounded ? '0.75rem' : '0' }">
      <i class="fa-solid fa-image text-4xl text-[#4A5F8B]"></i>
      <p class="text-sm text-[#6B7C93] mt-2">图片加载失败</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';

interface Props {
  src: string;
  alt: string;
  lazy?: boolean;
  rounded?: boolean;
  objectFit?: string;
  width?: number;
  height?: number;
  fetchpriority?: 'auto' | 'high' | 'low';
}

const props = withDefaults(defineProps<Props>(), {
  lazy: true,
  rounded: false,
  objectFit: 'cover',
  width: 800,
  height: 600,
  fetchpriority: 'auto'
});

const emit = defineEmits<{
  (e: 'load'): void;
  (e: 'error'): void;
}>();

const imgRef = ref<HTMLImageElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const isLoading = ref(true);
const isLoaded = ref(false);
const hasError = ref(false);
const shouldLoad = ref(!props.lazy);
let observer: IntersectionObserver | null = null;

const PLACEHOLDER_COLORS = [
  '#1a2332', '#1e2a3a', '#1e2532', '#2d3748',
  '#1a1f2e', '#1c2435', '#202a38', '#1f2937',
  '#1a2330', '#1d2738', '#1c2230', '#212d40'
];

const placeholderColor = computed(() => {
  let hash = 0;
  for (let i = 0; i < props.src.length; i++) {
    hash = props.src.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PLACEHOLDER_COLORS[Math.abs(hash) % PLACEHOLDER_COLORS.length];
});

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
  shouldLoad.value = !props.lazy;
  if (props.lazy) {
    setupObserver();
  }
});

watch(() => props.lazy, (newVal) => {
  if (!newVal) {
    shouldLoad.value = true;
    disconnectObserver();
  } else if (!shouldLoad.value) {
    setupObserver();
  }
});

const setupObserver = () => {
  disconnectObserver();
  if (!wrapperRef.value || !props.lazy) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          shouldLoad.value = true;
          disconnectObserver();
        }
      });
    },
    {
      rootMargin: '200px',
      threshold: 0
    }
  );
  observer.observe(wrapperRef.value);
};

const disconnectObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};

onMounted(() => {
  if (props.lazy) {
    setupObserver();
  }
  if (imgRef.value && imgRef.value.complete && shouldLoad.value) {
    onLoad();
  }
});

onBeforeUnmount(() => {
  disconnectObserver();
});
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.lazy-image-wrapper.rounded {
  border-radius: 0.75rem;
}

.image-skeleton {
  position: absolute;
  inset: 0;
  background: #2D3748;
  background-size: 200% 100%;
}

.shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.04) 50%,
    transparent 100%
  );
  background-size: 200% 100%;
}

@media (prefers-reduced-motion: no-preference) {
  .image-skeleton {
    animation: shimmer 1.8s ease-in-out infinite;
  }

  .shimmer {
    animation: shimmerSlide 1.8s ease-in-out infinite;
  }
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.03);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.lazy-image.visible {
  opacity: 1;
  transform: scale(1);
}

.lazy-image.rounded {
  border-radius: 0.75rem;
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
  0%, 100% {
    background-position: 200% 0;
  }
  50% {
    background-position: -200% 0;
  }
}

@keyframes shimmerSlide {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>