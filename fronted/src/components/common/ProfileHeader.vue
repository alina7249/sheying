<template>
  <div :class="[bgClass, 'rounded-xl overflow-hidden shadow-sm mb-8']">
    <div class="h-64 overflow-hidden">
      <img
        :src="coverImage"
        alt="Cover"
        class="w-full h-full object-cover"
      />
    </div>

    <div class="px-6 pb-6">
      <div class="flex flex-col md:flex-row -mt-20 mb-6">
        <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <div :class="['w-40 h-40 rounded-full border-4 overflow-hidden shadow-md', avatarBorderClass]">
            <img
              :src="avatar"
              alt="User avatar"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center">
              <h1 :class="['text-2xl font-bold mb-2', textClass(true)]">
                {{ username }}
              </h1>
              <div v-if="tags" class="ml-3 flex flex-wrap gap-2">
                <span :class="['px-2 py-0.5 text-xs rounded', tagBgClass]">
                  {{ tags }}
                </span>
              </div>
            </div>

            <div class="flex items-center mb-4">
              <span :class="[textClass(false), 'text-sm mr-2']">{{ level }} LV.{{ levelNum }}</span>
              <div :class="['flex-1 h-2 rounded-full overflow-hidden mr-2', progressBgClass]">
                <div
                  :class="progressFillClass"
                  :style="{ width: `${(progress / progressMax) * 100}%`, height: '100%' }"
                ></div>
              </div>
              <span :class="[textClass(false), 'text-xs']">{{ progress }}/{{ progressMax }}</span>
            </div>

            <div class="flex items-center space-x-6">
              <div class="flex items-center">
                <span :class="['font-bold', textClass(true)]">{{ stats.following }}</span>
                <span :class="[textClass(false), 'text-sm ml-1']">关注</span>
              </div>
              <div class="flex items-center">
                <span :class="['font-bold', textClass(true)]">{{ stats.followers }}</span>
                <span :class="[textClass(false), 'text-sm ml-1']">粉丝</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-3">
            <button
              v-if="onEditProfile"
              @click="onEditProfile"
              :class="['px-4 py-2 rounded-lg font-medium transition-colors', buttonClass]"
            >
              <i :class="['fa-solid fa-pen-to-square mr-2', textClass(true)]"></i> 编辑资料
            </button>
            <button
              v-if="onSettings"
              @click="onSettings"
              :class="['px-4 py-2 rounded-lg font-medium transition-colors', buttonClass]"
            >
              <i :class="['fa-solid fa-cog mr-2', textClass(true)]"></i> 设置
            </button>
            <button
              v-if="onFollow"
              @click="onFollow"
              :class="['px-4 py-2 rounded-lg font-medium transition-colors', isFollowing ? 'bg-[#6B7C93] text-[#F5F7FA]' : 'bg-[#4A5F8B] text-[#F5F7FA]']"
            >
              <template v-if="isFollowing">
                <i :class="['fa-solid fa-check mr-2', textClass(true)]"></i> 已关注
              </template>
              <template v-else>
                <i :class="['fa-solid fa-plus mr-2', textClass(true)]"></i> 关注
              </template>
            </button>
          </div>
        </div>
      </div>

      <div :class="['flex flex-wrap border-t pt-4', borderClass]">
        <div class="mr-8 mb-2">
          <div class="flex items-center space-x-1">
            <span :class="['text-xl font-bold', textClass(true)]">
              {{ stats.posts }}
            </span>
            <i :class="['fa-solid fa-image', iconClass]"></i>
          </div>
          <span :class="['text-sm', textClass(false)]">作品</span>
        </div>
        <div class="mr-8 mb-2">
          <div class="flex items-center space-x-1">
            <span :class="['text-xl font-bold', textClass(true)]">
              {{ stats.likes }}
            </span>
            <i :class="['fa-solid fa-heart', iconClass]"></i>
          </div>
          <span :class="['text-sm', textClass(false)]">获赞</span>
        </div>
        <div class="mr-8 mb-2">
          <div class="flex items-center space-x-1">
            <span :class="['text-xl font-bold', textClass(true)]">
              {{ stats.collections }}
            </span>
            <i :class="['fa-solid fa-bookmark', iconClass]"></i>
          </div>
          <span :class="['text-sm', textClass(false)]">收藏</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '../../composables/useAuthStore'

interface Stats {
  posts: number
  newPosts?: number
  likes: number
  newLikes?: number
  collections: number
  newCollections?: number
  followers: number
  following: number
}

interface Props {
  username: string
  tags?: string
  level: string
  levelNum: number
  progress: number
  progressMax: number
  memberStatus?: string
  memberDaysLeft?: number
  avatar: string
  coverImage: string
  stats: Stats
  onEditProfile?: () => void
  onSettings?: () => void
  onFollow?: () => void
  isFollowing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isFollowing: false,
})

const { theme } = useAuthStore()

const bgClass = computed(() =>
  theme.value === 'dark'
    ? 'bg-[#2D3748] border border-[#4A5F8B]'
    : 'bg-white border border-gray-200'
)

const avatarBorderClass = computed(() =>
  theme.value === 'dark'
    ? 'border-[#2D3748] border-[#4A5F8B]'
    : 'border-white border-gray-200'
)

function textClass(isPrimary: boolean) {
  if (isPrimary) {
    return theme.value === 'dark' ? 'text-[#F5F7FA]' : 'text-[#1E2532]'
  }
  return theme.value === 'dark' ? 'text-[#B8C6D8]' : 'text-[#6B7C93]'
}

const tagBgClass = computed(() =>
  theme.value === 'dark'
    ? 'bg-[#4A5F8B]/20 text-[#B8C6D8]'
    : 'bg-blue-50 text-[#63B3ED]'
)

const progressBgClass = computed(() =>
  theme.value === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100'
)

const progressFillClass = computed(() =>
  theme.value === 'dark' ? 'bg-[#4A5F8B]' : 'bg-[#63B3ED]'
)

const buttonClass = computed(() =>
  theme.value === 'dark'
    ? 'bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B] hover:bg-[#6B7C93]'
    : 'bg-[#63B3ED] text-white border border-[#63B3ED] hover:bg-[#4299E1]'
)

const iconClass = computed(() =>
  theme.value === 'dark' ? 'text-[#B8C6D8]' : 'text-[#6B7C93]'
)

const borderClass = computed(() =>
  theme.value === 'dark' ? 'border-[#4A5F8B]' : 'border-gray-200'
)
</script>