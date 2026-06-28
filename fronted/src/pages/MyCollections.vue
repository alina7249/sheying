<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white">
    <div class="max-w-6xl mx-auto px-4 py-12">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">
          <i class="fa-solid fa-bookmark mr-2 text-[#d4a853]"></i>我的收藏夹
        </h1>
        <button @click="showCreateModal = true" class="px-4 py-2 bg-[#d4a853] text-[#0a0a0a] rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-[#d4a853]/20 transition-all">
          <i class="fa-solid fa-plus mr-2"></i>新建收藏夹
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin w-8 h-8 border-2 border-[#d4a853] border-t-transparent rounded-full"></div>
      </div>

      <div v-else-if="collections.length === 0" class="text-center py-20">
        <i class="fa-regular fa-folder-open text-6xl text-[#374151] mb-4 block"></i>
        <p class="text-[#9ca3af] text-lg mb-4">还没有收藏夹</p>
        <button @click="showCreateModal = true" class="px-6 py-3 bg-[#d4a853] text-[#0a0a0a] rounded-xl font-medium hover:shadow-lg hover:shadow-[#d4a853]/20 transition-all">创建第一个收藏夹</button>
      </div>

      <!-- 收藏夹列表 -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="col in collections" :key="col.id"
          class="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 hover:border-[#d4a853]/50 transition-all duration-300 cursor-pointer group"
          @click="viewCollection(col)">
          <div class="flex items-start justify-between mb-3">
            <div class="w-12 h-12 rounded-xl bg-[#1f2937] flex items-center justify-center text-xl group-hover:bg-[#d4a853]/20 transition-colors">
              <i class="fa-solid fa-folder text-[#d4a853]"></i>
            </div>
            <button @click.stop="handleDeleteCollection(col)" class="text-[#6b7280] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
          <h3 class="text-white font-bold mb-1">{{ col.title }}</h3>
          <p class="text-[#6b7280] text-sm mb-3">{{ col.description || '暂无描述' }}</p>
          <div class="text-xs text-[#6b7280]">{{ col.postCount || 0 }} 个作品</div>
        </div>
      </div>

      <!-- 收藏夹详情弹窗 -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/60" @click="showDetailModal = false"></div>
            <div class="relative bg-[#1a1a2e] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-white text-lg font-bold">{{ detailCollection?.title }}</h3>
                <button @click="showDetailModal = false" class="text-[#6b7280] hover:text-white transition-colors">
                  <i class="fa-solid fa-times"></i>
                </button>
              </div>
              <div v-if="detailLoading" class="text-center py-8">
                <div class="animate-spin w-6 h-6 border-2 border-[#d4a853] border-t-transparent rounded-full mx-auto"></div>
              </div>
              <div v-else-if="detailPosts.length === 0" class="text-center py-8 text-[#6b7280]">
                <i class="fa-regular fa-image text-4xl mb-3 block"></i>
                收藏夹为空
              </div>
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="post in detailPosts" :key="post.id" class="bg-[#111827] rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
                  <img :src="post.imageUrl || 'https://picsum.photos/400/300?random=' + post.id" :alt="post.title" class="w-full h-40 object-cover" />
                  <div class="p-3">
                    <p class="text-white text-sm truncate mb-2">{{ post.title }}</p>
                    <button @click="handleRemovePost(post.id)" class="text-xs text-red-400 hover:text-red-300 transition-colors">
                      <i class="fa-solid fa-trash mr-1"></i>移除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- 新建收藏夹弹窗 -->
      <Teleport to="body">
        <Transition name="modal">
          <div v-if="showCreateModal" class="fixed inset-0 z-50 flex items-center justify-center">
            <div class="absolute inset-0 bg-black/60" @click="showCreateModal = false"></div>
            <div class="relative bg-[#1a1a2e] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 w-full max-w-md mx-4">
              <h3 class="text-white text-lg font-bold mb-4">新建收藏夹</h3>
              <div class="mb-4">
                <label class="text-sm text-[#9ca3af] mb-2 block">标题</label>
                <input v-model="newCollectionTitle" type="text" placeholder="收藏夹名称"
                  class="w-full px-4 py-3 bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#d4a853] transition-colors" />
              </div>
              <div class="mb-6">
                <label class="text-sm text-[#9ca3af] mb-2 block">描述（可选）</label>
                <textarea v-model="newCollectionDesc" rows="3" placeholder="收藏夹描述..."
                  class="w-full px-4 py-3 bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl text-white text-sm placeholder-[#6b7280] focus:outline-none focus:border-[#d4a853] transition-colors resize-none"></textarea>
              </div>
              <div class="flex gap-3">
                <button @click="showCreateModal = false" class="flex-1 py-3 rounded-xl border border-[rgba(255,255,255,0.08)] text-[#9ca3af] hover:text-white transition-colors">取消</button>
                <button @click="handleCreate" :disabled="!newCollectionTitle.trim() || creating"
                  class="flex-1 py-3 rounded-xl bg-[#d4a853] text-[#0a0a0a] font-medium hover:shadow-lg hover:shadow-[#d4a853]/20 transition-all disabled:opacity-50">
                  {{ creating ? '创建中...' : '创建' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getCollections, createCollection, getCollectionDetail, removePostFromCollection, deleteCollection } from '../services/api';
import { toast } from 'vue-sonner';

const loading = ref(false);
const collections = ref<any[]>([]);
const showCreateModal = ref(false);
const showDetailModal = ref(false);
const newCollectionTitle = ref('');
const newCollectionDesc = ref('');
const creating = ref(false);
const detailLoading = ref(false);
const detailCollection = ref<any>(null);
const detailPosts = ref<any[]>([]);

const loadCollections = async () => {
  loading.value = true;
  try {
    const res: any = await getCollections();
    if (res?.data) collections.value = res.data;
  } catch (e) { /* */ }
  finally { loading.value = false; }
};

const handleCreate = async () => {
  if (!newCollectionTitle.value.trim()) return;
  creating.value = true;
  try {
    await createCollection({ title: newCollectionTitle.value.trim(), description: newCollectionDesc.value.trim() || undefined });
    toast.success('收藏夹创建成功');
    showCreateModal.value = false;
    newCollectionTitle.value = '';
    newCollectionDesc.value = '';
    loadCollections();
  } catch (e: any) {
    toast.error(e?.message || '创建失败');
  } finally {
    creating.value = false;
  }
};

const viewCollection = async (col: any) => {
  detailCollection.value = col;
  showDetailModal.value = true;
  detailLoading.value = true;
  try {
    const res: any = await getCollectionDetail(col.id);
    if (res?.data) {
      detailCollection.value = res.data;
      detailPosts.value = res.data.posts || [];
    }
  } catch (e) { /* */ }
  finally { detailLoading.value = false; }
};

const handleRemovePost = async (postId: number) => {
  if (!detailCollection.value) return;
  try {
    await removePostFromCollection(detailCollection.value.id, postId);
    toast.success('已移除');
    detailPosts.value = detailPosts.value.filter(p => p.id !== postId);
  } catch (e: any) {
    toast.error(e?.message || '移除失败');
  }
};

const handleDeleteCollection = async (col: any) => {
  if (!confirm(`确定删除收藏夹「${col.title}」？`)) return;
  try {
    await deleteCollection(col.id);
    toast.success('已删除');
    loadCollections();
  } catch (e: any) {
    toast.error(e?.message || '删除失败');
  }
};

onMounted(() => loadCollections());
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from > div:last-child, .modal-leave-to > div:last-child { transform: scale(0.9); }
</style>