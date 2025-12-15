// Hover效果描述：
// 1. 素材类型选择按钮：使用framer-motion的whileHover属性，实现按钮向上平移(y: -5)
// 2. 素材卡片：使用framer-motion的whileHover属性，实现卡片向上平移(y: -5)和阴影增强效果
// 3. 标签按钮：使用Tailwind的hover伪类，悬停时背景变为#4A5F8B，文字变为#F5F7FA
// 4. 操作按钮：使用Tailwind的hover伪类，悬停时背景色变化

import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/authContext';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// 定义资料类型
interface MaterialVersion {
  id: string;
  version: string;
  date: string;
  changes: string;
  downloadUrl: string;
}

interface Material {
  id: string;
  name: string;
  thumbnail: string;
  type: string;
  size: string;
  date: string;
  tags: string[];
  categories: string[];
  usedCount: number;
  lastUsed?: string;
  previewUrl?: string;
  versions?: MaterialVersion[];
  // RAW素材特有属性
  camera?: string;
  resolution?: string;
  location?: string;
  // 预设特有属性
}

// 模拟素材数据
const mockRawMaterials: Material[] = [
  {
    id: 'raw1',
    name: '山间云海RAW',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=mountain%20cloud%20sea%20raw%20photo%20thumbnail&sign=c1c4a4eaefba83802e62c3088b580089',
    type: 'RAW',
    size: '45.8MB',
    date: '2023-10-25',
    camera: 'Sony A7R IV',
    resolution: '61MP',
    location: '黄山',
    tags: ['云海', '风光', 'RAW', '黄山'],
    categories: ['风光摄影', '自然景观'],
    usedCount: 12,
    lastUsed: '2023-11-01',
    previewUrl: 'https://example.com/preview/raw1',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        date: '2023-10-25',
        changes: '初始版本',
        downloadUrl: 'https://example.com/download/raw1/v1'
      }
    ]
  },
  {
    id: 'raw2',
    name: '城市日出RAW',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=city%20sunrise%20raw%20photo%20thumbnail%20urban&sign=8b60521a0ffedcde44b5022efacdfdfd',
    type: 'RAW',
    size: '52.3MB',
    date: '2023-10-20',
    camera: 'Canon EOS R5',
    resolution: '45MP',
    location: '上海',
    tags: ['城市', '日出', 'RAW', '上海'],
    categories: ['城市摄影', '日出日落'],
    usedCount: 8,
    lastUsed: '2023-10-28',
    previewUrl: 'https://example.com/preview/raw2',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        date: '2023-10-20',
        changes: '初始版本',
        downloadUrl: 'https://example.com/download/raw2/v1'
      }
    ]
  },
  {
    id: 'raw3',
    name: '海边日落RAW',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=seaside%20sunset%20raw%20photo%20thumbnail%20ocean&sign=359d2ed31facaf4efc6b6cf7760fcfc3',
    type: 'RAW',
    size: '48.7MB',
    date: '2023-10-15',
    camera: 'Nikon Z7 II',
    resolution: '45MP',
    location: '三亚',
    tags: ['海边', '日落', 'RAW', '三亚'],
    categories: ['海景摄影', '日落'],
    usedCount: 15,
    lastUsed: '2023-11-10',
    previewUrl: 'https://example.com/preview/raw3',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        date: '2023-10-15',
        changes: '初始版本',
        downloadUrl: 'https://example.com/download/raw3/v1'
      },
      {
        id: 'v2',
        version: '1.1',
        date: '2023-10-18',
        changes: '优化曝光和色彩',
        downloadUrl: 'https://example.com/download/raw3/v2'
      }
    ]
  },
  {
    id: 'raw4',
    name: '森林晨雾RAW',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=forest%20morning%20mist%20raw%20photo%20thumbnail&sign=c4644ddd4f8dea9f37e1499f004d06b0',
    type: 'RAW',
    size: '50.2MB',
    date: '2023-10-10',
    camera: 'Sony A7R IV',
    resolution: '61MP',
    location: '西双版纳',
    tags: ['森林', '晨雾', 'RAW', '西双版纳'],
    categories: ['森林摄影', '雾气'],
    usedCount: 6,
    lastUsed: '2023-10-25',
    previewUrl: 'https://example.com/preview/raw4',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        date: '2023-10-10',
        changes: '初始版本',
        downloadUrl: 'https://example.com/download/raw4/v1'
      }
    ]
  },
];

// 模拟预设数据
const mockPresets: Material[] = [
  {
    id: 'preset1',
    name: '风光大片预设',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=landscape%20preset%20thumbnail%20professional%20photo%20editing&sign=3f4de3b76c0190ea138677cb648dbe7c',
    type: 'Lightroom预设',
    size: '1.2MB',
    date: '2023-10-22',
    usedCount: 35,
    tags: ['风光', '大片', 'Lightroom', '预设'],
    categories: ['风光摄影', '后期预设'],
    lastUsed: '2023-11-15',
    previewUrl: 'https://example.com/preview/preset1',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        date: '2023-10-22',
        changes: '初始版本',
        downloadUrl: 'https://example.com/download/preset1/v1'
      }
    ]
  },
  {
    id: 'preset2',
    name: '城市黑白预设',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=urban%20black%20white%20preset%20thumbnail%20street%20photography&sign=d09895782f3c5bbd0df519a4cb9d5ad6',
    type: 'Lightroom预设',
    size: '0.8MB',
    date: '2023-10-18',
    usedCount: 28,
    tags: ['城市', '黑白', 'Lightroom', '预设'],
    categories: ['城市摄影', '黑白摄影'],
    lastUsed: '2023-11-12',
    previewUrl: 'https://example.com/preview/preset2',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        date: '2023-10-18',
        changes: '初始版本',
        downloadUrl: 'https://example.com/download/preset2/v1'
      }
    ]
  },
  {
    id: 'preset3',
    name: '人像肤色优化',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=portrait%20skin%20tone%20preset%20thumbnail%20photography&sign=f430d0a98ca25341bd7b97f9c8a48a1b',
    type: 'Photoshop动作',
    size: '1.5MB',
    date: '2023-10-15',
    usedCount: 42,
    tags: ['人像', '肤色', 'Photoshop', '动作'],
    categories: ['人像摄影', '后期处理'],
    lastUsed: '2023-11-14',
    previewUrl: 'https://example.com/preview/preset3',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        date: '2023-10-15',
        changes: '初始版本',
        downloadUrl: 'https://example.com/download/preset3/v1'
      },
      {
        id: 'v2',
        version: '1.1',
        date: '2023-10-20',
        changes: '优化亚洲人肤色处理',
        downloadUrl: 'https://example.com/download/preset3/v2'
      }
    ]
  },
  {
    id: 'preset4',
    name: '星空降噪预设',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=star%20sky%20noise%20reduction%20preset%20thumbnail%20astrophotography&sign=8f8015b78c20ec4e7986c5e4e132dcb3',
    type: 'Lightroom预设',
    size: '0.9MB',
    date: '2023-10-12',
    usedCount: 19,
    tags: ['星空', '降噪', 'Lightroom', '预设'],
    categories: ['星空摄影', '降噪'],
    lastUsed: '2023-11-05',
    previewUrl: 'https://example.com/preview/preset4',
    versions: [
      {
        id: 'v1',
        version: '1.0',
        date: '2023-10-12',
        changes: '初始版本',
        downloadUrl: 'https://example.com/download/preset4/v1'
      }
    ]
  },
];

// 模拟推荐资料数据
const recommendedMaterials: Material[] = [
  {
    id: 'rec1',
    name: '黄金时段风光预设',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=golden%20hour%20landscape%20preset%20thumbnail%20sunset%20golden%20light&sign=d99a7c9ddbcdbdbc88d5539798d73193',
    type: 'Lightroom预设',
    size: '1.5MB',
    date: '2023-11-05',
    usedCount: 23,
    tags: ['黄金时段', '风光', 'Lightroom', '预设'],
    categories: ['风光摄影', '后期预设'],
    previewUrl: 'https://example.com/preview/rec1'
  },
  {
    id: 'rec2',
    name: '城市夜景RAW',
    thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=city%20night%20view%20raw%20photo%20thumbnail%20urban%20lights&sign=8168d0829581f316b6beb78fb9fe45e8',
    type: 'RAW',
    size: '55.3MB',
    date: '2023-11-01',
    camera: 'Sony A7S III',
    resolution: '12MP',
    location: '北京',
    tags: ['城市', '夜景', 'RAW', '北京'],
    categories: ['城市摄影', '夜景'],
    usedCount: 14,
    previewUrl: 'https://example.com/preview/rec2'
  }
];

// 获取使用统计数据 - 增加更多数据点使曲线更自然
  const getUsageStats = () => {
    const stats = [
      { name: '1月', 风光摄影: 2, 城市摄影: 1, 人像摄影: 3, 后期预设: 4, 海景摄影: 2, 夜景摄影: 1 },
      { name: '2月', 风光摄影: 3, 城市摄影: 2, 人像摄影: 4, 后期预设: 5, 海景摄影: 2, 夜景摄影: 2 },
      { name: '3月', 风光摄影: 5, 城市摄影: 3, 人像摄影: 5, 后期预设: 6, 海景摄影: 3, 夜景摄影: 3 },
      { name: '4月', 风光摄影: 4, 城市摄影: 4, 人像摄影: 6, 后期预设: 7, 海景摄影: 4, 夜景摄影: 2 },
      { name: '5月', 风光摄影: 6, 城市摄影: 5, 人像摄影: 7, 后期预设: 8, 海景摄影: 5, 夜景摄影: 3 },
      { name: '6月', 风光摄影: 8, 城市摄影: 6, 人像摄影: 9, 后期预设: 10, 海景摄影: 6, 夜景摄影: 5 },
      { name: '7月', 风光摄影: 7, 城市摄影: 7, 人像摄影: 8, 后期预设: 9, 海景摄影: 7, 夜景摄影: 4 },
      { name: '8月', 风光摄影: 9, 城市摄影: 8, 人像摄影: 10, 后期预设: 12, 海景摄影: 8, 夜景摄影: 6 },
      { name: '9月', 风光摄影: 10, 城市摄影: 9, 人像摄影: 11, 后期预设: 13, 海景摄影: 9, 夜景摄影: 7 },
      { name: '10月', 风光摄影: 12, 城市摄影: 10, 人像摄影: 12, 后期预设: 15, 海景摄影: 10, 夜景摄影: 8 },
      { name: '11月', 风光摄影: 15, 城市摄影: 12, 人像摄影: 14, 后期预设: 18, 海景摄影: 12, 夜景摄影: 10 },
    ];
    return stats;
  };

const ProfileMaterials: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('raw'); // raw, presets
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, name, size, used
  const [showPreview, setShowPreview] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [versionsMaterial, setVersionsMaterial] = useState<Material | null>(null);

  // 获取所有分类
  const getAllCategories = () => {
    const categories: string[] = [];
    const allMaterials = activeTab === 'raw' ? mockRawMaterials : mockPresets;
    
    allMaterials.forEach(item => {
      item.categories.forEach(category => {
        if (!categories.includes(category)) {
          categories.push(category);
        }
      });
    });
    
    return categories;
  };

  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 切换分类
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // 获取所有标签
  const getAllTags = () => {
    const tags: string[] = [];
    const allMaterials = activeTab === 'raw' ? mockRawMaterials : mockPresets;
    
    allMaterials.forEach(item => {
      item.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    
    return tags;
  };

  // 过滤和排序素材
  const getFilteredItems = () => {
    let items = activeTab === 'raw' ? [...mockRawMaterials] : [...mockPresets];
    
    // 按分类过滤
    if (selectedCategories.length > 0) {
      items = items.filter(item => 
        selectedCategories.some(category => item.categories.includes(category))
      );
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      items = items.filter(item => 
        selectedTags.some(tag => item.tags.includes(tag))
      );
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.location?.toLowerCase().includes(term) ||
        item.camera?.toLowerCase().includes(term) ||
        item.tags.some(tag => tag.toLowerCase().includes(term)) ||
        item.categories.some(category => category.toLowerCase().includes(term))
      );
    }
    
    // 排序
    if (sortBy === 'date') {
      items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'size') {
      items.sort((a, b) => {
        const sizeA = parseFloat(a.size);
        const sizeB = parseFloat(b.size);
        return sizeB - sizeA;
      });
    } else if (sortBy === 'used') {
      items.sort((a, b) => b.usedCount - a.usedCount);
    }
    
    return items;
  };

  // 打开预览
  const openPreview = (material: Material) => {
    setPreviewMaterial(material);
    setShowPreview(true);
  };

  // 打开版本管理
  const openVersionManagement = (material: Material) => {
    setVersionsMaterial(material);
    setShowVersions(true);
  };

  // 分享资料
  const shareMaterial = (material: Material) => {
    // 模拟分享功能
    toast.success(`已复制 ${material.name} 的分享链接到剪贴板`);
  };

  const filteredItems = getFilteredItems();
  const allTags = getAllTags();
  const allCategories = getAllCategories();
  const usageStats = getUsageStats();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的个人素材库，管理RAW素材和预设</p>
          <Link to="/login" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
            立即登录
          </Link>
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
          <Link
            to="/profile-center"
            className="inline-flex items-center space-x-1 text-[#B8C6D8]/70 hover:text-[#B8C6D8] transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>返回个人中心</span>
          </Link>
        </div>

         {/* 页面标题 */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">我的素材库</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            管理您的RAW素材、后期预设和其他摄影资源
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 主要内容区域 */}
          <div className="lg:col-span-3 space-y-8">
            {/* 素材类型选择 */}
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ y: -5 }}
                onClick={() => setActiveTab('raw')}
                className={`py-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                  activeTab === 'raw'
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] border-2 border-[#4A5F8B] shadow-md'
                    : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                }`}
              >
                <i className="fa-solid fa-file-image text-2xl mb-2"></i>
                <span className="font-medium">RAW素材</span>
              </motion.button>
              
              <motion.button
                whileHover={{ y: -5 }}
                onClick={() => setActiveTab('presets')}
                className={`py-4 rounded-xl flex flex-col items-center justify-center transition-all ${
                  activeTab === 'presets'
                    ? 'bg-[#4A5F8B] text-[#F5F7FA] border-2 border-[#4A5F8B] shadow-md'
                    : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                }`}
              >
                <i className="fa-solid fa-palette text-2xl mb-2"></i>
                <span className="font-medium">后期预设</span>
              </motion.button>
            </div>

            {/* 搜索和筛选 */}
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={`搜索${activeTab === 'raw' ? 'RAW素材' : '预设'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
                  />
                  <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                </div>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                >
                  <option value="date">按日期排序</option>
                  <option value="name">按名称排序</option>
                  <option value="size">按大小排序</option>
                  <option value="used">按使用次数</option>
                </select>
              </div>
              
              {/* 分类筛选 */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">按分类筛选</h4>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedCategories.includes(category)
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                          : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                      } transition-colors`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* 标签筛选 */}
              {allTags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">按标签筛选</h4>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          selectedTags.includes(tag)
                            ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                            : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
                        } transition-colors`}
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* 清除筛选 */}
              {(selectedTags.length > 0 || selectedCategories.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setSelectedCategories([]);
                  }}
                  className="mt-3 text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有筛选
                </button>
              )}
            </div>

            {/* 添加素材按钮 */}
            <div className="text-center">
              <button className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center">
                <i className="fa-solid fa-upload mr-2"></i>
                上传{activeTab === 'raw' ? 'RAW素材' : '预设'}
              </button>
            </div>

            {/* 素材列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
                  className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
                >
                  {/* 素材缩略图 */}
                  <div className="relative">
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-[#4A5F8B]/80 text-[#F5F7FA] text-xs rounded">
                        {item.type}
                      </span>
                    </div>
                    {/* 在线预览按钮 */}
                    {item.previewUrl && (
                      <button 
                        onClick={() => openPreview(item)}
                        className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#4A5F8B]/80 text-[#F5F7FA] flex items-center justify-center hover:bg-[#4A5F8B] transition-colors"
                        title="在线预览"
                      >
                        <i className="fa-solid fa-eye"></i>
                      </button>
                    )}
                  </div>
                  
                  {/* 素材信息 */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#F5F7FA] mb-2">{item.name}</h3>
                    
                    {/* 分类标签 */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.categories.map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                    
                    {/* 素材基本信息 */}
                    <div className="space-y-1 mb-4">
                      <div className="flex items-center justify-between text-sm text-[#B8C6D8]">
                        <span>大小</span>
                        <span>{item.size}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-[#B8C6D8]">
                        <span>日期</span>
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-[#B8C6D8]">
                        <span>使用次数</span>
                        <span>{item.usedCount} 次</span>
                      </div>
                      {item.lastUsed && (
                        <div className="flex items-center justify-between text-sm text-[#B8C6D8]">
                          <span>最近使用</span>
                          <span>{item.lastUsed}</span>
                        </div>
                      )}
                      {activeTab === 'raw' && item.camera && (
                        <>
                          <div className="flex items-center justify-between text-sm text-[#B8C6D8]">
                            <span>相机</span>
                            <span>{item.camera}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-[#B8C6D8]">
                            <span>分辨率</span>
                            <span>{item.resolution}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm text-[#B8C6D8]">
                            <span>拍摄地点</span>
                            <span>{item.location}</span>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* 素材标签 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 4).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex space-x-2">
                      <button className="flex-1 py-2 text-center bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]">
                        <i className="fa-solid fa-eye mr-1"></i> 查看
                      </button>
                      <button className="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
                        <i className={`fa-solid ${activeTab === 'raw' ? 'fa-download' : 'fa-sliders'}`} mr-1></i> 
                        {activeTab === 'raw' ? '下载' : '应用'}
                      </button>
                    </div>
                    
                    {/* 高级功能按钮 */}
                    <div className="flex justify-between mt-3">
                      {item.versions && item.versions.length > 1 && (
                        <button 
                          onClick={() => openVersionManagement(item)}
                          className="text-xs text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                          title="版本管理"
                        >
                          <i className="fa-solid fa-code-branch mr-1"></i> 版本管理
                        </button>
                      )}
                      <button 
                        onClick={() => shareMaterial(item)}
                        className="text-xs text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                        title="分享"
                      >
                        <i className="fa-solid fa-share-alt mr-1"></i> 分享
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredItems.length === 0 && (
              <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                  <i className={`fa-solid ${activeTab === 'raw' ? 'fa-file-image' : 'fa-palette'} text-2xl`}></i>
                </div>
                <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无{activeTab === 'raw' ? 'RAW素材' : '预设'}</h3>
                <p className="text-[#B8C6D8] mb-6">
                  点击"上传{activeTab === 'raw' ? 'RAW素材' : '预设'}"开始管理您的摄影资源
                </p>
                <button className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
                  <i className="fa-solid fa-upload mr-2"></i>
                  上传{activeTab === 'raw' ? 'RAW素材' : '预设'}
                </button>
              </div>
            )}

            {/* 分页 */}
            {filteredItems.length > 0 && (
              <div className="flex justify-center">
                <nav className="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    <i className="fa-solid fa-chevron-left text-xs"></i>
                  </button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
                    1
                  </button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    2
                  </button>
                  <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                  </button>
                </nav>
              </div>
            )}
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:col-span-1 space-y-8">
                {/* 使用统计分析 - 优化为更自然的曲线效果 */}
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">使用统计分析</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={usageStats} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2532" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#B8C6D8" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={{ stroke: '#4A5F8B' }}
                        />
                        <YAxis 
                          stroke="#B8C6D8" 
                          fontSize={12} 
                          tickLine={false}
                          axisLine={{ stroke: '#4A5F8B' }}
                          tickFormatter={(value) => `${value}`}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: "#1E2532", borderColor: "#4A5F8B", borderRadius: "8px" }}
                          labelStyle={{ color: "#F5F7FA" }}
                          itemStyle={{ color: "#F5F7FA" }}
                          cursor={{ stroke: '#4A5F8B', strokeDasharray: '3 3' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="风光摄影" 
                          stroke="#4A5F8B" 
                          strokeWidth={2.5}
                          dot={{ r: 4, strokeWidth: 2, fill: "#1E2532", stroke: "#4A5F8B" }}
                          activeDot={{ r: 6, strokeWidth: 0, fill: "#4A5F8B" }}
                          smooth={true}
                          animationDuration={1500}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="城市摄影" 
                          stroke="#6B7C93" 
                          strokeWidth={2}
                          dot={{ r: 3.5, strokeWidth: 2, fill: "#1E2532", stroke: "#6B7C93" }}
                          activeDot={{ r: 5, strokeWidth: 0, fill: "#6B7C93" }}
                          smooth={true}
                          animationDuration={1500}
                          animationBegin={300}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="人像摄影" 
                          stroke="#B8C6D8" 
                          strokeWidth={2}
                          dot={{ r: 3.5, strokeWidth: 2, fill: "#1E2532", stroke: "#B8C6D8" }}
                          activeDot={{ r: 5, strokeWidth: 0, fill: "#B8C6D8" }}
                          smooth={true}
                          animationDuration={1500}
                          animationBegin={600}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="后期预设" 
                          stroke="#E6EBF2" 
                          strokeWidth={2}
                          dot={{ r: 3.5, strokeWidth: 2, fill: "#1E2532", stroke: "#E6EBF2" }}
                          activeDot={{ r: 5, strokeWidth: 0, fill: "#E6EBF2" }}
                          smooth={true}
                          animationDuration={1500}
                          animationBegin={900}
                        />
                        <Legend 
                          iconType="circle" 
                          wrapperStyle={{ 
                            paddingTop: '10px',
                            fontSize: '12px',
                            color: '#B8C6D8'
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
              
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-[#B8C6D8] mb-1">
                    <span>总素材数量</span>
                    <span>{usageStats.reduce((total, item) => total + item['风光摄影'] + item['城市摄影'] + item['人像摄影'] + item['后期预设'] + item['海景摄影'] + item['夜景摄影'], 0)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4A5F8B]" 
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-[#B8C6D8] mb-1">
                    <span>本月新增</span>
                    <span>{usageStats[10]['风光摄影'] + usageStats[10]['城市摄影'] + usageStats[10]['人像摄影'] + usageStats[10]['后期预设'] + usageStats[10]['海景摄影'] + usageStats[10]['夜景摄影']}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#1E2532] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#4A5F8B]" 
                      style={{ width: `${((usageStats[10]['风光摄影'] + usageStats[10]['城市摄影'] + usageStats[10]['人像摄影'] + usageStats[10]['后期预设'] + usageStats[10]['海景摄影'] + usageStats[10]['夜景摄影']) / usageStats.reduce((total, item) => total + item['风光摄影'] + item['城市摄影'] + item['人像摄影'] + item['后期预设'] + item['海景摄影'] + item['夜景摄影'], 0)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
               {/* 资料推荐系统 */}
                <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">为您推荐</h3>
                  <div className="space-y-4">
                    {recommendedMaterials.map((item) => (
                      <motion.div 
                        key={item.id}
                        whileHover={{ x: 5, boxShadow: '0 2px 8px rgba(74, 95, 139, 0.3)' }}
                        className="flex items-center p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] cursor-pointer hover:border-[#6B7C93] transition-colors"
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-16 h-12 object-cover rounded mr-3"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#F5F7FA] truncate">{item.name}</h4>
                          <p className="text-xs text-[#B8C6D8]">{item.type}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm"
                  >
                    查看更多推荐
                  </motion.button>
                </div>
            
            {/* 快速访问 */}
            <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B]">
              <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">快速访问</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex flex-col items-center justify-center p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i className="fa-solid fa-clock-rotate-left text-xl mb-2"></i>
                  <span className="text-sm">最近使用</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i className="fa-solid fa-chart-line text-xl mb-2"></i>
                  <span className="text-sm">使用统计</span>
                </button><button className="flex flex-col items-center justify-center p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i className="fa-solid fa-folder text-xl mb-2"></i>
                  <span className="text-sm">分类管理</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 bg-[#1E2532] rounded-lg border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                  <i className="fa-solid fa-cloud-arrow-up text-xl mb-2"></i>
                  <span className="text-sm">批量上传</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 预览弹窗 */}
        {showPreview && previewMaterial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-[#2D3748] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[#4A5F8B] flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#F5F7FA]">{previewMaterial.name}</h3>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <div className="p-6">
                <img 
                  src={previewMaterial.thumbnail} 
                  alt={previewMaterial.name}
                  className="w-full h-auto rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-[#F5F7FA] mb-2">基本信息</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-[#B8C6D8]">类型：</span>
                        <span className="text-[#F5F7FA]">{previewMaterial.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#B8C6D8]">大小：</span>
                        <span className="text-[#F5F7FA]">{previewMaterial.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#B8C6D8]">创建日期：</span>
                        <span className="text-[#F5F7FA]">{previewMaterial.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[#B8C6D8]">使用次数：</span>
                        <span className="text-[#F5F7FA]">{previewMaterial.usedCount} 次</span>
                      </div>
                      {previewMaterial.camera && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#B8C6D8]">相机：</span>
                          <span className="text-[#F5F7FA]">{previewMaterial.camera}</span>
                        </div>
                      )}
                      {previewMaterial.location && (
                        <div className="flex justify-between text-sm">
                          <span className="text-[#B8C6D8]">拍摄地点：</span>
                          <span className="text-[#F5F7FA]">{previewMaterial.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {previewMaterial.categories.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-[#F5F7FA] mb-2">分类</h4>
                      <div className="flex flex-wrap gap-2">
                        {previewMaterial.categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {previewMaterial.tags.length > 0 && (
                    <div>
                      <h4 className="text-lg font-medium text-[#F5F7FA] mb-2">标签</h4>
                      <div className="flex flex-wrap gap-2">
                        {previewMaterial.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded-full text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button 
                      onClick={() => setShowPreview(false)}
                      className="px-4 py-2 bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B]"
                    >
                      关闭
                    </button>
                    <button className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
                      <i className="fa-solid fa-download mr-1"></i> 下载
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {/* 版本管理弹窗 */}
        {showVersions && versionsMaterial && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setShowVersions(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="bg-[#2D3748] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-[#4A5F8B] flex justify-between items-center">
                <h3 className="text-xl font-bold text-[#F5F7FA]">{versionsMaterial.name} - 版本管理</h3>
                <button 
                  onClick={() => setShowVersions(false)}
                  className="text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                >
                  <i className="fa-solid fa-times text-xl"></i>
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {versionsMaterial.versions?.map((version) => (
                    <div 
                      key={version.id}
                      className="p-4 bg-[#1E2532] rounded-lg border border-[#4A5F8B] flex flex-col md:flex-row md:items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="px-2 py-1 bg-[#4A5F8B] text-[#F5F7FA] rounded text-sm font-medium mr-2">
                            v{version.version}
                          </span>
                          <span className="text-sm text-[#B8C6D8]">{version.date}</span>
                        </div>
                        <p className="text-sm text-[#F5F7FA]">{version.changes}</p>
                      </div>
                      <div className="mt-3 md:mt-0">
                        <button className="px-3 py-1.5 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors text-sm">
                          <i className="fa-solid fa-download mr-1"></i> 下载
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileMaterials;