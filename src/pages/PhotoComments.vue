<template>
  <div class="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
    <div class="mb-8 text-center">
      <h1 class="text-3xl font-bold text-[#F5F7FA] mb-2">作品评论</h1>
      <p class="text-[#B8C6D8] max-w-2xl mx-auto">参与作品讨论，分享您的观点和见解，与其他摄影师交流互动</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <div class="relative flex-1">
            <input type="text" v-model="searchTerm" placeholder="搜索评论..." class="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]" />
            <i class="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
          </div>
          <select v-model="sortBy" class="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer">
            <option value="latest">最新</option>
            <option value="popular">最热门</option>
            <option value="rated">最高评分</option>
          </select>
        </div>

        <div class="space-y-4">
          <div v-for="comment in sortedComments" :key="comment.id" class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
            <div class="flex items-center mb-4">
              <router-link :to="`/community/user-profile/${comment.user.id}`"><img :src="comment.user.avatar" :alt="comment.user.name" class="w-8 h-8 rounded-full mr-3 object-cover border border-[#B8C6D8]" /></router-link>
              <div class="flex-1">
                <router-link :to="`/community/user-profile/${comment.user.id}`" class="font-medium text-[#F5F7FA] text-sm">{{ comment.user.name }}</router-link>
                <div class="flex items-center mt-0.5">
                  <span v-if="comment.user.badge" class="px-2 py-0.5 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs font-medium mr-1">{{ comment.user.badge }}</span>
                  <span class="text-xs text-[#6B7C93]">{{ comment.date }}</span>
                  <i class="fa-solid fa-circle mx-1 text-[4px] text-[#6B7C93]"></i>
                  <router-link :to="`/photo/${comment.photoId}`" class="text-xs text-[#4A5F8B]">相关作品</router-link>
                </div>
              </div>
              <div class="flex items-center">
                <span class="text-sm font-medium text-[#F5F7FA] mr-1">{{ comment.rating }}</span>
                <i class="fa-solid fa-star text-xs text-[#4A5F8B]"></i>
              </div>
            </div>
            <p class="text-sm text-[#B8C6D8] mb-4 line-clamp-3">{{ comment.content }}</p>
            <div class="flex items-center space-x-4 text-sm">
              <button @click="handleLikeComment(comment.id)" class="flex items-center space-x-1 text-[#718096] transition-colors" :class="likedComments.includes(comment.id) ? 'text-[#6B7C93]' : 'hover:text-[#6B7C93]'">
                <i :class="likedComments.includes(comment.id) ? 'fa-solid' : 'fa-regular'" class="fa-heart"></i>
                <span>{{ likedComments.includes(comment.id) ? comment.likes + 1 : comment.likes }}</span>
              </button>
              <button @click="handleReplyComment(comment)" class="flex items-center space-x-1 text-[#718096] hover:text-[#6B7C93] transition-colors">
                <i class="fa-regular fa-comment-dots"></i><span>{{ comment.replies.length }} 回复</span>
              </button>
              <button class="flex items-center space-x-1 text-[#718096] hover:text-[#6B7C93] transition-colors" :title="comment.content"><i class="fa-regular fa-copy"></i></button>
              <button @click="handleReportComment(comment.id)" class="flex items-center space-x-1 text-[#718096] hover:text-[#6B7C93] transition-colors"><i class="fa-regular fa-flag"></i></button>
            </div>
            <div v-if="comment.replies.length > 0" class="mt-4 pl-4 border-l-2 border-[#4A5F8B] space-y-3">
              <div v-for="reply in comment.replies.slice(0, showAllReplies[comment.id] ? comment.replies.length : 2)" :key="reply.id" class="bg-[#1E2532] rounded-lg p-3">
                <div class="flex items-center mb-2">
                  <img :src="reply.user.avatar" :alt="reply.user.name" class="w-6 h-6 rounded-full mr-2 object-cover border border-[#B8C6D8]" />
                  <span class="font-medium text-[#F5F7FA] text-sm">{{ reply.user.name }}</span>
                  <span class="text-xs text-[#6B7C93] ml-auto">{{ reply.date }}</span>
                </div>
                <p class="text-sm text-[#B8C6D8]">{{ reply.content }}</p>
              </div>
              <button v-if="comment.replies.length > 2" @click="toggleShowAllReplies(comment.id)" class="text-xs text-[#4A5F8B]">{{ showAllReplies[comment.id] ? '收起' : `查看全部 ${comment.replies.length} 条回复` }}</button>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <nav class="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
            <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"><i class="fa-solid fa-chevron-left text-xs"></i></button>
            <button class="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">1</button>
            <span class="px-2 text-[#B8C6D8]">...</span>
            <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">5</button>
            <button class="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"><i class="fa-solid fa-chevron-right text-xs"></i></button>
          </nav>
        </div>
      </div>

      <div class="lg:col-span-1 space-y-6">
        <div class="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
          <h3 class="text-lg font-bold mb-4 text-[#F5F7FA]">评论统计</h3>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-[#1E2A3A] rounded-lg p-3 text-center"><div class="text-2xl font-bold text-[#4A5F8B]">{{ comments.length }}</div><div class="text-xs text-[#B8C6D8] mt-1">总评论数</div></div>
            <div class="bg-[#1E2A3A] rounded-lg p-3 text-center"><div class="text-2xl font-bold text-[#4A5F8B]">4.6</div><div class="text-xs text-[#B8C6D8] mt-1">平均评分</div></div>
            <div class="bg-[#1E2A3A] rounded-lg p-3 text-center"><div class="text-2xl font-bold text-[#4A5F8B]">12</div><div class="text-xs text-[#B8C6D8] mt-1">活跃评论者</div></div>
            <div class="bg-[#1E2A3A] rounded-lg p-3 text-center"><div class="text-2xl font-bold text-[#4A5F8B]">8</div><div class="text-xs text-[#B8C6D8] mt-1">今日新增</div></div>
          </div>
        </div>

        <div class="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl p-6 shadow-sm border border-[#4A5F8B] text-[#F5F7FA]">
          <h3 class="text-lg font-bold mb-3">评论规则</h3>
          <div class="space-y-2">
            <div v-for="(rule, idx) in commentRules" :key="idx" class="flex items-start bg-[#2D3748]/30 p-2 rounded backdrop-blur-sm">
              <i :class="rule.icon" class="mr-2 mt-0.5"></i><span class="text-sm">{{ rule.text }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { toast } from 'sonner';

interface Reply { id: string; content: string; user: { id: string; name: string; avatar: string }; date: string; }
interface Comment { id: string; content: string; rating: number; date: string; user: { id: string; name: string; avatar: string; badge?: string }; photoId: string; likes: number; replies: Reply[]; }

const searchTerm = ref('');
const sortBy = ref('latest');
const likedComments = ref<string[]>([]);
const showAllReplies = ref<Record<string, boolean>>({});

const commentRules = [
  { icon: 'fa-solid fa-check-circle', text: '尊重他人，文明用语，理性讨论' },
  { icon: 'fa-solid fa-check-circle', text: '针对作品本身进行评价，不攻击他人' },
  { icon: 'fa-solid fa-check-circle', text: '鼓励建设性的批评和建议' },
  { icon: 'fa-solid fa-check-circle', text: '禁止发布广告、垃圾信息或不当内容' }
];

const mockComments: Comment[] = [
  {
    id: '1', content: '这张照片的构图非常出色，黄金分割点的运用让画面更加平衡和谐。光线处理也很到位，尤其是前景的明暗对比，让整个画面更有层次感。', rating: 5, date: '2023-10-25 14:30',
    user: { id: 'u1', name: '@摄影评论家王老师', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20critic%20avatar%20male%20middle%20aged&sign=1f67bb45da7364906e04d49a13285f67', badge: '资深摄影师' },
    photoId: '1', likes: 12,
    replies: [
      { id: 'r1', content: '谢谢王老师的点评，我确实在构图上下了一番功夫。', user: { id: 'u2', name: '@光影捕手', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20young&sign=f533ef06c814d83e610c234fcde52f77' }, date: '2023-10-25 15:00' },
      { id: 'r2', content: '王老师说得对，这张作品的构图确实很专业。', user: { id: 'u3', name: '@摄影爱好者小明', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20enthusiast%20avatar%20male&sign=acf32af241c038875f2b8b318f170b06' }, date: '2023-10-25 15:30' },
      { id: 'r3', content: '学习到了构图的技巧，感谢分享。', user: { id: 'u4', name: '@新手摄影小张', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=beginner%20photographer%20avatar%20male%20young&sign=a076fa14f7977e902fe333f899d2603c' }, date: '2023-10-25 16:00' }
    ]
  },
  {
    id: '2', content: '色调处理非常有感觉，尤其是蓝色调的运用，让人感受到清晨的宁静与美好。稍微有点遗憾的是天空部分稍微过曝，可以在后期处理中适当调整。', rating: 4, date: '2023-10-25 11:00',
    user: { id: 'u5', name: '@色彩分析师大卫', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=color%20analyst%20avatar%20male&sign=012a861bdf93e46338d6226fd6ba43a8', badge: '色彩专家' },
    photoId: '1', likes: 8,
    replies: [
      { id: 'r4', content: '感谢大卫的详细分析，天空部分确实需要再调整。', user: { id: 'u2', name: '@光影捕手', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20young&sign=f533ef06c814d83e610c234fcde52f77' }, date: '2023-10-25 11:30' }
    ]
  },
  {
    id: '3', content: '非常喜欢这张作品，尤其是在选择拍摄时间和地点上的用心。清晨的雾气和光线结合，营造出了梦幻般的效果。', rating: 5, date: '2023-10-24 09:00',
    user: { id: 'u6', name: '@风光摄影爱好者阿强', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20avatar%20male&sign=079e57e736784c30df4ae39fc13045a2' },
    photoId: '1', likes: 15,
    replies: [
      { id: 'r5', content: '谢谢阿强的鼓励！', user: { id: 'u2', name: '@光影捕手', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20young&sign=f533ef06c814d83e610c234fcde52f77' }, date: '2023-10-24 09:30' },
      { id: 'r6', content: '同感，这张照片的雾气和光线处理非常到位。', user: { id: 'u3', name: '@摄影爱好者小明', avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20enthusiast%20avatar%20male&sign=acf32af241c038875f2b8b318f170b06' }, date: '2023-10-24 10:00' }
    ]
  }
];

const comments = ref(mockComments);

const sortedComments = computed(() => {
  let result = [...comments.value];
  if (searchTerm.value) { const term = searchTerm.value.toLowerCase(); result = result.filter(c => c.content.toLowerCase().includes(term) || c.user.name.toLowerCase().includes(term)); }
  if (sortBy.value === 'latest') result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  else if (sortBy.value === 'popular') result.sort((a, b) => b.likes - a.likes);
  else if (sortBy.value === 'rated') result.sort((a, b) => b.rating - a.rating);
  return result;
});

function handleLikeComment(commentId: string) {
  const idx = likedComments.value.indexOf(commentId);
  if (idx === -1) likedComments.value.push(commentId);
  else likedComments.value.splice(idx, 1);
}

function handleReplyComment(comment: any) { toast.info('回复功能正在开发中'); }
function handleReportComment(commentId: string) { toast.success('举报已提交，感谢您的反馈'); }
function toggleShowAllReplies(commentId: string) {
  showAllReplies.value[commentId] = !showAllReplies.value[commentId];
}
</script>