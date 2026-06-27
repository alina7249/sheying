<template>
  <div class="min-h-screen bg-[#0a0f1a] text-white">
    <div class="fixed inset-0 bg-gradient-to-br from-[#0a0f1a] via-[#0F1C2D] to-[#050810] pointer-events-none z-0"></div>

    <div class="relative z-10">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">发布作品</h1>
          <p class="text-[#B8C6D8]">分享你的摄影作品，与社区一起交流学习</p>
        </div>

        <div class="bg-gradient-to-br from-[#1E2532]/90 to-[#2D3748]/90 backdrop-blur-xl border border-[#4A5F8B]/20 rounded-3xl p-8 shadow-2xl">
          <form @submit.prevent="handleSubmit">
            <div class="mb-6">
              <label class="block text-sm font-medium text-[#E2E8F0] mb-2">作品标题 *</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="请输入作品标题"
                class="w-full px-4 py-3 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-xl text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all"
              />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-[#E2E8F0] mb-2">作品图片 *</label>
              <div class="space-y-3">
                <div class="flex gap-3">
                  <input
                    v-model="form.imageUrl"
                    type="text"
                    placeholder="请输入图片URL"
                    class="flex-1 px-4 py-3 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-xl text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all"
                  />
                  <label class="px-4 py-3 bg-[#4A5F8B]/20 text-[#63B3ED] border border-[#4A5F8B]/30 rounded-xl cursor-pointer hover:bg-[#4A5F8B]/30 transition-all whitespace-nowrap">
                    <i class="fa-solid fa-upload mr-2"></i>上传图片
                    <input type="file" accept="image/*" class="hidden" @change="handleFileUpload" :disabled="uploading" />
                  </label>
                </div>
                <div v-if="uploading" class="text-sm text-[#63B3ED]">
                  <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>上传中...
                </div>
                <div v-if="form.imageUrl" class="relative rounded-xl overflow-hidden border border-[#4A5F8B]/20">
                  <img :src="form.imageUrl" alt="预览" class="w-full max-h-96 object-contain bg-[#0F1C2D]" />
                </div>
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-[#E2E8F0] mb-2">作品描述 *</label>
              <textarea
                v-model="form.content"
                rows="5"
                placeholder="分享一下这张作品的拍摄故事、技巧或感受..."
                class="w-full px-4 py-3 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-xl text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all resize-none"
              ></textarea>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-[#E2E8F0] mb-2">标签</label>
              <div class="flex flex-wrap gap-2 mb-3">
                <span
                  v-for="tag in form.tags"
                  :key="tag"
                  class="px-3 py-1.5 bg-[#4A5F8B]/15 text-[#63B3ED] text-sm rounded-full border border-[#4A5F8B]/20 flex items-center gap-2"
                >
                  #{{ tag }}
                  <button type="button" @click="removeTag(tag)" class="hover:text-white transition-colors">
                    <i class="fa-solid fa-xmark text-xs"></i>
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="tagInput"
                  type="text"
                  placeholder="输入标签后按回车添加"
                  @keydown.enter.prevent="addTag"
                  class="flex-1 px-4 py-2.5 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-xl text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all"
                />
                <button type="button" @click="addTag" class="px-4 py-2.5 bg-[#4A5F8B]/20 text-[#63B3ED] border border-[#4A5F8B]/30 rounded-xl hover:bg-[#4A5F8B]/30 transition-all">
                  添加
                </button>
              </div>
              <div class="flex flex-wrap gap-2 mt-3">
                <span class="text-xs text-[#6B7C93]">推荐标签：</span>
                <button
                  v-for="tag in suggestedTags"
                  :key="tag"
                  type="button"
                  @click="suggestTag(tag)"
                  class="text-xs px-2 py-1 bg-[#0F1C2D]/60 text-[#6B7C93] rounded-full hover:bg-[#4A5F8B]/20 hover:text-[#63B3ED] transition-colors"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <div class="mb-8">
              <label class="block text-sm font-medium text-[#E2E8F0] mb-4">拍摄参数（可选）</label>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs text-[#6B7C93] mb-1">相机</label>
                  <input
                    v-model="form.camera"
                    type="text"
                    placeholder="如 Sony A7M4"
                    class="w-full px-3 py-2.5 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-lg text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-[#6B7C93] mb-1">镜头</label>
                  <input
                    v-model="form.lens"
                    type="text"
                    placeholder="如 24-70mm f/2.8"
                    class="w-full px-3 py-2.5 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-lg text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-[#6B7C93] mb-1">光圈</label>
                  <input
                    v-model="form.aperture"
                    type="text"
                    placeholder="如 f/2.8"
                    class="w-full px-3 py-2.5 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-lg text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-[#6B7C93] mb-1">快门</label>
                  <input
                    v-model="form.shutter"
                    type="text"
                    placeholder="如 1/250s"
                    class="w-full px-3 py-2.5 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-lg text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-[#6B7C93] mb-1">ISO</label>
                  <input
                    v-model="form.iso"
                    type="text"
                    placeholder="如 100"
                    class="w-full px-3 py-2.5 bg-[#0F1C2D]/80 border border-[#4A5F8B]/20 rounded-lg text-white placeholder-[#6B7C93] focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]/50 focus:border-[#4A5F8B]/50 transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="flex gap-4 justify-end">
              <button
                type="button"
                @click="router.back()"
                class="px-6 py-3 border border-[#4A5F8B]/30 text-[#B8C6D8] rounded-xl hover:bg-[#4A5F8B]/10 hover:text-white transition-all"
              >
                取消
              </button>
              <button
                type="submit"
                :disabled="submitting || !canSubmit"
                :class="['px-8 py-3 rounded-xl font-medium transition-all', submitting || !canSubmit ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-[#4A5F8B] to-[#63B3ED] text-white hover:shadow-lg hover:shadow-[#4A5F8B]/30']"
              >
                <i v-if="submitting" class="fa-solid fa-circle-notch fa-spin mr-2"></i>
                {{ submitting ? '发布中...' : '发布作品' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { addPost, uploadFile } from '../services/api';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const tagInput = ref('');
const uploading = ref(false);
const submitting = ref(false);

const suggestedTags = ['风光', '人像', '街拍', '建筑', '夜景', '黑白', '胶片', '星空', '自然', '城市'];

const form = ref({
  title: '',
  content: '',
  imageUrl: '',
  tags: [] as string[],
  camera: '',
  lens: '',
  aperture: '',
  shutter: '',
  iso: '',
});

const canSubmit = computed(() => {
  return form.value.title.trim() && form.value.content.trim() && form.value.imageUrl.trim();
});

const addTag = () => {
  const tag = tagInput.value.trim();
  if (!tag) return;
  if (form.value.tags.includes(tag)) {
    toast.warning('标签已存在');
    return;
  }
  if (form.value.tags.length >= 10) {
    toast.warning('最多添加10个标签');
    return;
  }
  form.value.tags.push(tag);
  tagInput.value = '';
};

const removeTag = (tag: string) => {
  form.value.tags = form.value.tags.filter(t => t !== tag);
};

const suggestTag = (tag: string) => {
  if (form.value.tags.includes(tag)) return;
  if (form.value.tags.length >= 10) {
    toast.warning('最多添加10个标签');
    return;
  }
  form.value.tags.push(tag);
};

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    toast.error('请选择图片文件');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    toast.error('图片大小不能超过10MB');
    return;
  }

  uploading.value = true;
  try {
    const res: any = await uploadFile(file, 'post_image');
    if (res && res.data) {
      form.value.imageUrl = res.data;
      toast.success('图片上传成功');
    }
  } catch (error: any) {
    console.error('Upload error:', error);
    toast.error(error.message || '上传失败');
  } finally {
    uploading.value = false;
    input.value = '';
  }
};

const handleSubmit = async () => {
  if (!canSubmit.value) {
    toast.warning('请填写必填项');
    return;
  }

  submitting.value = true;
  try {
    const res: any = await addPost({
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      tags: form.value.tags,
      imageUrl: form.value.imageUrl.trim(),
      camera: form.value.camera.trim() || undefined,
      lens: form.value.lens.trim() || undefined,
      aperture: form.value.aperture.trim() || undefined,
      shutter: form.value.shutter.trim() || undefined,
      iso: form.value.iso.trim() || undefined,
    });

    if (res && res.code === 0 && res.data) {
      toast.success('发布成功！');
      router.push(`/photo-detail/${res.data}`);
    } else {
      toast.error(res?.message || '发布失败');
    }
  } catch (error: any) {
    console.error('Publish error:', error);
    toast.error(error.message || '发布失败');
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    toast.warning('请先登录');
    router.push('/login');
  }
});
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
