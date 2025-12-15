import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/authContext';
import { Empty } from '../components/Empty';
import { PhotographyCard } from '../components/PhotographyCard';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// 模拟用户数据 - 艺术风摄影平台
const mockUser = {
  id: 'user-123',
  username: '@光影捕手',
  email: 'user@example.com',
  avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male%20portrait&sign=e53a45a0e2ef5ba23982d6db8693456b',
  bio: '热爱风光和人像摄影，喜欢探索城市中的几何美感和自然中的光影变化。',
  joinDate: '2023-01-15',
  followers: 123,
  following: 45,
  posts: 28,
  coverImage: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=photography%20studio%20background%20modern%20minimalist&sign=8848033bdf94e05818be4d57164ea015',
  level: '新锐摄影师',
  levelNum: 3,
  progress: 120,
  progressMax: 200
};

// 模拟作品数据
const mockPhotographyPosts = [
  {
    id: "1",
    title: "黑白光影",
    description: "Leica Q2 Monochrom | 光圈: f/2.8 | 快门: 1/125s | ISO: 800\n极简主义黑白摄影，通过光影对比展现建筑的几何美感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=black%20and%20white%20architecture%20geometric%20composition&sign=7f2b53dd226ab1ffb3f3eae704bada52",
    author: {
      id: "1",
      name: "极简摄影师林风",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=minimalist%20photographer%20male%20serious&sign=fded36172bb86afa4dc326776156459c"
    },
    likes: 342,
    comments: 42,
    tags: ["极简主义", "黑白", "建筑", "徕卡"],
    date: "2023-10-25"
  },
  {
    id: "2",
    title: "胶片质感人像",
    description: "Canon AE-1 + 50mm f/1.4 | 光圈: f/2.0 | 快门: 1/125s | ISO: 400\n使用复古胶片相机拍摄的人像作品，自然柔和的色调与颗粒感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=portrait_4_3&prompt=film%20photography%20portrait%20natural%20light%20soft%20colors&sign=c33fc387d9611cfbf5948eab73b3426b",
    author: {
      id: "2",
      name: "胶片摄影师安娜",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=film%20photographer%20female%20vintage%20style&sign=5ec915debce76b46483be485e236cee2"
    },
    likes: 412,
    comments: 56,
    tags: ["人像", "胶片", "复古", "自然光"],
    date: "2023-10-24"
  },
  {
    id: "3",
    title: "暗调氛围",
    description: "Sony A7R IV + 35mm f/1.4 GM | 光圈: f/2.8 | 快门: 1/60s | ISO: 1600\n营造神秘而富有故事感的暗调氛围人像，强调光影层次与情绪表达。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=moody%20portrait%20low%20key%20dramatic%20lighting&sign=667d5b0612922acbe1a4e0355faeb800",
    author: {
      id: "3",
      name: "情绪摄影师李明",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=moody%20photographer%20male%20creative&sign=b74f18a9e01693163824506fbbcc8c47"
    },
    likes: 389,
    comments: 49,
    tags: ["暗调", "氛围", "情绪", "人像"],
    date: "2023-10-23"
  },
  {
    id: "4",
    title: "极简静物",
    description: "Fujifilm GFX 100S + 120mm f/4 Macro | 光圈: f/5.6 | 快门: 1/125s | ISO: 200\n通过简洁的构图和柔和的光线，展现日常物品的质感与美感。",
    image: "https://space.coze.cn/api/coze_space/gen_image?image_size=square_hd&prompt=minimalist%20still%20life%20composition%20natural%20light&sign=d50543b56e3575f63623ea5055f2f854",
    author: {
      id: "4",
      name: "静物摄影师王静",
      avatar: "https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=still%20life%20photographer%20female%20detail-oriented&sign=3bfd67c585c96ccf90c0560aadfc6c75"
    },
    likes: 276,
    comments: 32,
    tags: ["静物", "极简", "中画幅", "富士"],
    date: "2023-10-22"
  }
];

// 模拟创作数据趋势
const trendData = [
  { month: '8月', posts: 2, likes: 56, collections: 12, comments: 8 },
  { month: '9月', posts: 4, likes: 89, collections: 23, comments: 15 },
  { month: '10月', posts: 6, likes: 91, collections: 13, comments: 22 },
];

const Profile: React.FC = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'posts' | 'collections' | 'likes'>('posts');
  const navigate = useNavigate();
  
   // 初始化模拟用户数据
  const [profileUser, setProfileUser] = useState({
    id: 'user-123',
    username: '@光影捕手',
    email: 'user@example.com',
    avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20professional%20male%20portrait&sign=e53a45a0e2ef5ba23982d6db8693456b',
    bio: '热爱风光和人像摄影，喜欢探索城市中的几何美感和自然中的光影变化。',
    joinDate: '2023-01-15',
    followers: 123,
    following: 45,
    posts: 28,
    likes: 236
  });
  
  // 检查是否是当前用户自己的主页
  const isCurrentUser = isAuthenticated && user?.id === profileUser.id;
  
  // 关注状态
  const [isFollowing, setIsFollowing] = useState(false);
  
  // 模拟作品数据
  const userPosts = mockPhotographyPosts;
  
  // 获取收藏作品
  const userCollections = mockPhotographyPosts.slice(0, 2);
  
  // 获取点赞作品
  const userLikes = mockPhotographyPosts.slice(1, 3);
  
  // 根据当前激活的标签显示对应的内容
  const displayPosts = activeTab === 'posts' ? userPosts : activeTab === 'collections' ? userCollections : userLikes;
  
  // 格式化日期为相对时间
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return "刚刚";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}分钟前`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}小时前`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}天前`;
    } else {
      return date.toLocaleDateString('zh-CN');
    }
  };
  
  // 渲染用户作品集数据
  const renderUserPosts = () => {
    // 如果没有登录，显示提示
    if (!isAuthenticated) {
      return (
        <div className="text-center py-8">
          <p className="text-[#B8C6D8]">请先登录以查看更多内容</p>
          <button 
            onClick={() => navigate('/login')}
            className="inline-block mt-4 px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg hover:bg-[#6B7C93] transition-colors"
          >
            立即登录
          </button>
        </div>
      );
    }
    
     // 如果登录了但没有作品，显示空状态
    if (displayPosts.length === 0) {
      return (
        <Empty 
          type="empty"
          size="md"
          text={activeTab === 'posts' ? '暂无作品' : activeTab === 'collections' ? '暂无收藏' : '暂无点赞'}
          helperText={activeTab === 'posts' 
            ? '上传你的第一张作品，开始创作之旅吧！' 
            : activeTab === 'collections'
              ? '收藏喜欢的作品，建立你的灵感库'
              : '为喜欢的作品点赞，支持创作者'}
          icon="fa-image"
          actionText={activeTab === 'posts' ? '上传作品' : undefined}
          onActionClick={() => activeTab === 'posts' ? navigate('/profile-center/works') : undefined}
          backgroundColor="bg-[#2D3748]"
          textColor="text-[#F5F7FA]"
        />
      );
    }
    
    // 正常显示作品网格
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map((post) => (
          <PhotographyCard key={post.id} post={post} />
        ))}
      </div>
    );
  };
  
  // 加载时的骨架屏（模拟）
  const renderSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-[#2D3748] rounded-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-[#4A5F8B]"></div>
            <div className="p-4">
              <div className="h-4 bg-[#4A5F8B] rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-[#4A5F8B] rounded w-full mb-2"></div>
              <div className="h-4 bg-[#4A5F8B] rounded w-full mb-4"></div>
              <div className="h-4 bg-[#4A5F8B] rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  // 判断是否显示骨架屏（这里简单模拟）
  const showSkeleton = false;
  
  // 检查用户是否登录，如果没有登录，显示登录提示
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看用户主页内容，支持创作者</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
          >
            立即登录
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] star-texture min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 返回按钮 */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回首页</span>
          </button>
        </div>
        
        {/* 个人资料卡片 */}
        <div className="bg-[#2D3748] rounded-xl overflow-hidden shadow-sm border border-[#4A5F8B] mb-8">
          {/* 封面图 */}
          <div className="h-64 overflow-hidden">
            <img
              src={mockUser.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* 用户信息 */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row -mt-20 mb-6">
              {/* 头像 */}
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <div className="w-40 h-40 rounded-full border-4 border-[#2D3748] overflow-hidden shadow-md border-[#4A5F8B]">
                  <img
                    src={profileUser.avatar}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* 用户信息和操作按钮 */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-[#F5F7FA] mb-2">
                      {profileUser.username}
                    </h1>
                    <div className="ml-3 flex flex-wrap gap-2">
                      <span className="px-2 py-0.5 text-xs bg-[#4A5F8B]/20 text-[#B8C6D8] rounded">
                        {mockUser.level}
                      </span>
                    </div>
                  </div>
                  
                  {/* 等级和进度条 */}
                  <div className="flex items-center mb-4">
                    <span className="text-[#B8C6D8] text-sm mr-2">{mockUser.level} LV.{mockUser.levelNum}</span>
                    <div className="flex-1 h-2 bg-[#1E2532] rounded-full overflow-hidden mr-2">
                      <div 
                        className="h-full bg-[#4A5F8B]" 
                        style={{ width: `${(mockUser.progress / mockUser.progressMax) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-[#B8C6D8] text-xs">{mockUser.progress}/{mockUser.progressMax}</span>
                  </div>
                  
                  {/* 个人简介 */}
                  <p className="text-[#B8C6D8] mb-4">{profileUser.bio}</p>
                  
                  {/* 关注与粉丝 */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <span className="font-bold text-[#F5F7FA]">{profileUser.following}</span>
                      <span className="text-[#B8C6D8]/70 text-sm ml-1">关注</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-bold text-[#F5F7FA]">{profileUser.followers}</span>
                      <span className="text-[#B8C6D8]/70 text-sm ml-1">粉丝</span>
                    </div>
                  </div>
                </div>
                
                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-3">
                  {isCurrentUser && (
                    <>
                      <button
                        onClick={() => navigate('/profile-center/settings')}
                        className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                      >
                        <i className="fa-solid fa-pen-to-square mr-2 text-[#F5F7FA]"></i> 编辑资料
                      </button>
                      <button
                        onClick={() => navigate('/profile-center')}
                        className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors"
                      >
                        <i className="fa-solid fa-user-cog mr-2 text-[#F5F7FA]"></i> 进入个人中心
                      </button>
                    </>
                  )}
                  {!isCurrentUser && (
                     <div className="flex items-center space-x-3">
                     <button 
                       className={`px-4 py-2 rounded-lg font-medium transition-colors border ${
                         isFollowing 
                           ? 'bg-[#6B7C93] text-[#F5F7FA] border-[#6B7C93]' 
                           : 'bg-[#4A5F8B] text-[#F5F7FA] border-[#4A5F8B]'
                       }`}
                       onClick={() => {
                         if (!isAuthenticated) {
                           toast.info('请先登录后再关注用户');
                           return;
                         }
                         
                         setIsFollowing(!isFollowing);
                         toast.success(isFollowing ? '已取消关注' : `已关注 ${profileUser.username}`);
                       }}
                     >
                      {isFollowing ? (
                        <>
                          <i className="fa-solid fa-check mr-2 text-[#F5F7FA]"></i> 已关注
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-plus mr-2 text-[#F5F7FA]"></i> 关注
                        </>
                      )}
                    </button>
                     <button 
                       onClick={async () => {
                         try {
                           await navigator.clipboard.writeText(`${window.location.origin}/profile/${profileUser.id}`);
                           toast.success('用户主页链接已复制到剪贴板');
                         } catch (err) {
                           toast.error('复制失败，请手动复制');
                         }
                       }}
                       className="p-2 bg-[#1E2532] text-[#B8C6D8] rounded-lg hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] relative z-10"
                       title="分享用户主页"
                     >
                       <i className="fa-solid fa-share-nodes"></i>
                     </button>
                     </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* 统计数据 */}
            <div className="flex flex-wrap border-t border-[#4A5F8B] pt-4">
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-[#F5F7FA]">
                    {profileUser.posts}
                  </span>
                  <i className="fa-solid fa-image text-[#B8C6D8]"></i>
                </div>
                <span className="text-sm text-[#B8C6D8]">作品</span>
              </div>
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-[#F5F7FA]">
                    {profileUser.likes}
                  </span>
                  <i className="fa-solid fa-heart text-[#B8C6D8]"></i>
                </div>
                <span className="text-sm text-[#B8C6D8]">获赞</span>
              </div>
              <div className="mr-8 mb-2">
                <div className="flex items-center space-x-1">
                  <span className="text-xl font-bold text-[#F5F7FA]">
                    48
                  </span>
                  <i className="fa-solid fa-bookmark text-[#B8C6D8]"></i>
                </div>
                <span className="text-sm text-[#B8C6D8]">收藏</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* 内容标签页 */}
        <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] mb-8">
          <div className="flex border-b border-[#4A5F8B]">
            <button
              onClick={() => {
                setActiveTab('posts');
                navigate(`/profile/${profileUser.id}`);
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'posts'
                  ? 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]'
              }`}
            >
              作品 ({profileUser.posts})
            </button>
            <button
              onClick={() => {
                setActiveTab('collections');
                navigate(`/profile/${profileUser.id}/collections`);
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'collections'
                  ? 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]'
              }`}
            >
              收藏 (48)
            </button>
            <button
              onClick={() => {
                setActiveTab('likes');
                navigate(`/profile/${profileUser.id}/likes`);
              }}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'likes'
                  ? 'text-[#F5F7FA] border-b-2 border-[#4A5F8B]'
                  : 'text-[#B8C6D8]/70 hover:text-[#F5F7FA]'
              }`}
            >
              点赞 ({profileUser.likes})
            </button>
          </div>
          
          {/* 创作数据趋势图 */}
          {activeTab === 'posts' && isCurrentUser && (
            <div className="p-6 border-b border-[#4A5F8B]">
              <h2 className="text-xl font-bold text-[#F5F7FA] mb-4">创作数据</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5F8B" />
                    <XAxis dataKey="month" stroke="#B8C6D8" />
                    <YAxis stroke="#B8C6D8" />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', borderColor: '#4A5F8B', color: '#F5F7FA' }} />
                    <Legend />
                    <Line type="monotone" dataKey="posts" stroke="#4A5F8B" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="作品数" />
                    <Line type="monotone" dataKey="likes" stroke="#B8C6D8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="获赞数" />
                    <Line type="monotone" dataKey="collections" stroke="#6B7C93" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="收藏数" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          
          {/* 内容区域 */}
          <div className="p-6">
            {showSkeleton ? renderSkeleton() : renderUserPosts()}
            
            {/* 加载更多按钮 */}
            {displayPosts.length > 0 && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center px-6 py-3 bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] rounded-lg font-medium transition-colors"
                >
                  登录查看更多内容
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;