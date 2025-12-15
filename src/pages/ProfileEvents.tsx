import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/authContext';

// 模拟已报名的活动数据
const mockRegisteredEvents = [
  {
    id: 'e1',
    title: '新疆喀纳斯秋季风光摄影团',
    type: '采风团',
    category: '风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=xinjiang%20kanas%20autumn%20landscape%20photography%20tour&sign=80fdfc7396a896f951715b6544406409',
    location: '新疆·喀纳斯',
    date: '2023-10-15 至 2023-10-22',
    duration: '8天7晚',
    status: '即将开始', // 即将开始、进行中、已结束
    instructor: {
      id: 'i1',
      name: '风光摄影师张明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20male%20outdoor%20professional&sign=871dd04c358f08c5214aaf9a36e6bf27',
      title: '国家地理摄影师',
    },
    price: 6999,
    participants: 12,
    maxParticipants: 20,
    description: '跟随国家地理摄影师张明，深入新疆喀纳斯，拍摄秋季绝美风光。行程涵盖喀纳斯湖、禾木村、白哈巴等著名景点，在最佳时间和地点拍摄金秋时节的层林尽染、晨雾缭绕的梦幻景色。',
    itinerary: [
      '第1天：全国各地 - 乌鲁木齐集合',
      '第2天：乌鲁木齐 - 布尔津 - 五彩滩',
      '第3天：布尔津 - 喀纳斯湖 - 观鱼台',
      '第4天：喀纳斯 - 白哈巴村',
      '第5天：白哈巴 - 禾木村',
      '第6天：禾木村全天拍摄',
      '第7天：禾木 - 可可托海',
      '第8天：可可托海 - 乌鲁木齐解散'
    ],
    notes: ['需自带摄影器材', '有一定摄影基础', '适应高原气候', '尊重当地风俗'],
    tags: ['风光', '新疆', '秋季', '长线', '深度']
  },
  {
    id: 'e2',
    title: '上海城市纪实摄影沙龙',
    type: '摄影沙龙',
    category: '纪实',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=shanghai%20urban%20documentary%20photography%20salon&sign=c10d47ff72e693e4aae932edd3732d15',
    location: '上海·静安区',
    date: '2023-10-28 14:00-17:00',
    duration: '3小时',
    status: '即将开始',
    instructor: {
      id: 'i2',
      name: '纪实摄影师李华',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=documentary%20photographer%20male%20street%20experienced&sign=c2d89b9f47e07118aab5b3aef7c5cdf3',
      title: '国际纪实摄影奖得主',
    },
    price: 199,
    participants: 18,
    maxParticipants: 30,
    description: '在上海这座国际化大都市，跟随国际纪实摄影奖得主李华，学习如何捕捉城市中的人文瞬间和生活故事。沙龙将涵盖纪实摄影的构图技巧、光线运用、与被摄者沟通等实用内容，并进行现场拍摄指导。',
    itinerary: [
      '14:00-14:30：签到与破冰',
      '14:30-15:30：纪实摄影理论分享',
      '15:30-16:30：户外实战拍摄指导',
      '16:30-17:00：作品点评与交流'
    ],
    notes: ['自带摄影器材', '提前报名确认', '尊重拍摄对象'],
    tags: ['纪实', '城市', '上海', '沙龙', '短期']
  },
  {
    id: 'e3',
    title: '索尼Alpha新品体验会',
    type: '器材体验会',
    category: '器材',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=sony%20alpha%20new%20camera%20experience%20event%20demo&sign=7801e7949f7d2a5e0e7c3a308a3fba3a',
    location: '北京·朝阳区',
    date: '2023-10-05 10:00-16:00',
    duration: '6小时',
    status: '已结束',
    instructor: {
      id: 'i3',
      name: '索尼技术专家王强',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=sony%20camera%20technical%20expert%20male%20professional&sign=78333651a183c3049ee0b820a0642879',
      title: '索尼官方讲师',
    },
    price: 0,
    participants: 25,
    maxParticipants: 50,
    description: '索尼Alpha系列新品体验会，现场体验最新的索尼相机和镜头，包括A7R V、A7S III等热门机型。专业技术专家现场讲解产品特性和使用技巧，并提供一对一咨询服务。',
    itinerary: [
      '10:00-10:30：签到与自由体验',
      '10:30-11:30：新品技术解析',
      '11:30-12:30：午餐交流',
      '12:30-15:00：分组体验与指导',
      '15:00-16:00：问答与抽奖'
    ],
    notes: ['无需自带器材', '提前报名确认', '遵守活动秩序'],
    tags: ['器材', '索尼', '新品', '体验', '免费'],
    feedback: {
      rating: 4.8,
      comment: '活动组织得很好，有机会体验最新的索尼器材，技术专家的讲解也很专业。'
    }
  },
  {
    id: 'e4',
    title: '云南元阳梯田春季摄影创作',
    type: '采风团',
    category: '风光',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=yunnan%20yuanyang%20rice%20terraces%20spring%20photography%20tour&sign=09c3d6131214921bb3af386fac7bdba4',
    location: '云南·元阳',
    date: '2023-02-20 至 2023-02-25',
    duration: '6天5晚',
    status: '已结束',
    instructor: {
      id: 'i4',
      name: '风光摄影师刘芳',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=landscape%20photographer%20female%20nature%20professional&sign=c3336bf3ce1c7229154ec96830fedbfc',
      title: '国际风光摄影奖得主',
    },
    price: 5699,
    participants: 8,
    maxParticipants: 15,
    description: '春季元阳梯田灌水期，是拍摄梯田云海、日出日落的最佳时节。跟随国际风光摄影奖得主刘芳，深入元阳梯田核心景区，在最佳拍摄点和时间，捕捉梯田如镜面般倒映天空和云霞的壮观景象。',
    itinerary: [
      '第1天：昆明集合',
      '第2天：昆明 - 元阳 - 老虎嘴梯田',
      '第3天：多依树梯田日出 - 爱春蓝梯田',
      '第4天：箐口梯田 - 坝达梯田日落',
      '第5天：龙树坝梯田 - 阿者科古村',
      '第6天：元阳 - 昆明解散'
    ],
    notes: ['需自带摄影器材', '有一定摄影基础', '早起拍摄'],
    tags: ['风光', '云南', '春季', '梯田', '经典'],
    feedback: {
      rating: 5.0,
      comment: '这是我参加过的最棒的摄影团！刘老师的指导非常专业，拍摄地点选择得恰到好处，收获满满。'
    }
  },
];

const ProfileEvents: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, past
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // date, type, price

  // 切换标签
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 获取所有标签
  const getAllTags = () => {
    const tags: string[] = [];
    mockRegisteredEvents.forEach(event => {
      event.tags.forEach(tag => {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      });
    });
    return tags;
  };

  // 过滤和排序活动
  const getFilteredEvents = () => {
    let events = [...mockRegisteredEvents];
    
    // 按状态过滤
    if (activeTab === 'upcoming') {
      events = events.filter(event => event.status === '即将开始' || event.status === '进行中');
    } else {
      events = events.filter(event => event.status === '已结束');
    }
    
    // 按标签过滤
    if (selectedTags.length > 0) {
      events = events.filter(event => 
        selectedTags.some(tag => event.tags.includes(tag))
      );
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      events = events.filter(event => 
        event.title.toLowerCase().includes(term) || 
        event.location.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term)
      );
    }
    
    // 排序
    if (sortBy === 'date') {
      events.sort((a, b) => {
        // 先按状态排序
        const statusOrder = { '即将开始': 1, '进行中': 2, '已结束': 3 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
          return statusOrder[a.status] - statusOrder[b.status];
        }
        // 再按日期排序（即将开始和进行中按开始日期，已结束按结束日期）
        return new Date(a.date.split(' ')[0]).getTime() - new Date(b.date.split(' ')[0]).getTime();
      });
    } else if (sortBy === 'type') {
      events.sort((a, b) => a.type.localeCompare(b.type));
    } else if (sortBy === 'price') {
      events.sort((a, b) => a.price - b.price);
    }
    
    return events;
  };

  const filteredEvents = getFilteredEvents();
  const allTags = getAllTags();

  if (!isAuthenticated) {
    return (
     <div className="container mx-auto px-4 py-8 bg-[#1E2A3A] min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看您已报名的摄影活动和历史记录</p>
          <Link to="/login" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors">
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
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">我的活动</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            查看和管理您已报名的摄影活动、采风团和赛事
          </p>
        </div>

        {/* 活动状态选择 */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => setActiveTab('upcoming')}
            className={`py-4 rounded-xl flex flex-col items-center justify-center transition-all ${
              activeTab === 'upcoming'
                ? 'bg-[#4A5F8B] text-[#F5F7FA] border-2 border-[#4A5F8B] shadow-md'
                : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
            }`}
          >
            <i className="fa-solid fa-calendar-check text-2xl mb-2"></i>
            <span className="font-medium">即将开始</span>
          </motion.button>
          
          <motion.button
            whileHover={{ y: -5 }}
            onClick={() => setActiveTab('past')}
            className={`py-4 rounded-xl flex flex-col items-center justify-center transition-all ${
              activeTab === 'past'
                ? 'bg-[#4A5F8B] text-[#F5F7FA] border-2 border-[#4A5F8B] shadow-md'
                : 'bg-[#2D3748] text-[#B8C6D8] border border-[#4A5F8B]'
            }`}
          >
            <i className="fa-solid fa-history text-2xl mb-2"></i>
            <span className="font-medium">历史活动</span>
          </motion.button>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索活动名称或地点..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
            >
              <option value="date">按日期排序</option>
              <option value="type">按类型排序</option>
              <option value="price">按价格排序</option>
            </select>
          </div>
          
          {/* 标签筛选 */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-[#F5F7FA] mb-2">按标签筛选</h4>
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
              
              {/* 清除标签 */}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="mt-3 text-sm text-[#B8C6D8] hover:text-[#F5F7FA] transition-colors"
                >
                  <i className="fa-solid fa-times mr-1"></i> 清除所有标签
                </button>
              )}
            </div>
          )}
        </div>

        {/* 活动列表 */}
        <div className="space-y-6">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
              className="bg-gradient-to-r from-[#4A5F8B] to-[#6B7C93] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
            >
              {/* 活动图片和状态 */}
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === '即将开始'
                        ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                        : event.status === '进行中'
                          ? 'bg-[#38B2AC] text-[#F5F7FA]'
                          : 'bg-[#B8C6D8] text-[#4A5059]'
                    }`}>
                      {event.status}</span>
                  </div>
                </div>
                
                {/* 活动信息 */}
                <div className="p-5 md:w-2/3">
                  {/* 活动类型和分类 */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#F5F7FA] font-medium">{event.type}</span>
                    <span className="text-xs px-2 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-full">{event.category}</span>
                  </div>
                  
                  {/* 活动标题 */}
                  <h3 className="text-lg font-bold text-[#F5F7FA] mb-2 hover:text-[#F5F7FA] transition-colors">
                    {event.title}
                  </h3>
                  
                  {/* 活动基本信息 */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center text-sm text-[#F5F7FA]/80">
                      <i className="fa-solid fa-map-marker-alt mr-2 text-[#F5F7FA]"></i>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-[#F5F7FA]/80">
                      <i className="fa-solid fa-calendar-alt mr-2 text-[#F5F7FA]"></i>
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-[#F5F7FA]/80">
                      <i className="fa-solid fa-clock mr-2 text-[#F5F7FA]"></i>
                      <span>{event.duration}</span>
                    </div>
                  </div>
                  
                  {/* 导师信息 */}
                  <div className="flex items-center mb-4">
                    <img
                      src={event.instructor.avatar}
                      alt={event.instructor.name}
                      className="w-8 h-8 rounded-full mr-2 object-cover border border-[#B8C6D8]"
                    />
                    <div>
                      <p className="text-sm font-medium text-[#F5F7FA]">{event.instructor.name}</p>
                      <p className="text-xs text-[#F5F7FA]/70">{event.instructor.title}</p>
                    </div>
                  </div>
                  
                  {/* 活动描述 */}
                  <p className="text-sm text-[#F5F7FA]/80 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  {/* 活动标签 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.slice(0, 5).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#2D3748] text-[#F5F7FA] rounded-full text-xs border border-[#4A5F8B]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 text-center bg-[#6B7C93] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#4A5F8B] transition-colors">
                      <i className="fa-solid fa-eye mr-1"></i> 查看详情
                    </button>
                    {event.status === '已结束' ? (
                      <button className="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
                        <i className="fa-solid fa-star mr-1"></i> 评价活动
                      </button>
                    ) : (
                      <button className="flex-1 py-2 text-center bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
                        <i className="fa-solid fa-calendar-check mr-1"></i> 已报名
                      </button>
                    )}
                  </div>
                  
                  {/* 活动评价 */}
                  {event.status === '已结束' && (event as any).feedback && (
                    <div className="mt-4 p-3 bg-[#2D3748] rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid fa-star ${
                                i < Math.floor((event as any).feedback.rating)
                                  ? 'text-[#4A5F8B]'
                                  : 'text-[#B8C6D8]'
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-sm text-[#F5F7FA]">
                          您的评价: {(event as any).feedback.rating}/5
                        </span>
                      </div>
                      <p className="text-sm text-[#F5F7FA] italic">"{(event as any).feedback.comment}"</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center mt-8">
            <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
              <i className="fa-solid fa-calendar-alt text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">
              {activeTab === 'upcoming' ? '暂无即将开始的活动' : '暂无历史活动'}
            </h3>
            <p className="text-[#B8C6D8] mb-6">
              {activeTab === 'upcoming' 
                ? '浏览更多摄影活动，找到感兴趣的内容' 
                : '您还没有参加过任何活动，快去发现精彩的摄影之旅吧'
              }
            </p>
            <Link to="/offline-events" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
              <i className="fa-solid fa-compass mr-2"></i>
              浏览更多活动
            </Link>
          </div>
        )}

        {/* 分页 */}
        {filteredEvents.length > 0 && (
          <div className="flex justify-center mt-10">
            <nav className="flex items-center space-x-1 bg-[#2D3748] p-2 rounded-lg border border-[#4A5F8B]">
              <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button className="px-3 py-2 rounded border border-[#4A5F8B] bg-[#4A5F8B] text-[#F5F7FA]">
                1
              </button>
              <button className="px-3 py-2 rounded border border-[#4A5F8B] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors">
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </nav>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfileEvents;