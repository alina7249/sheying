import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/authContext';

// 模拟订单数据
const mockOrders = [
  {
    id: 'o1',
    orderNumber: 'ORD-20231025-001',
    type: '器材',
    title: '索尼 A7R V 相机',
    description: '索尼全画幅微单相机 6100万像素 专业摄影',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20a7rv%20mirrorless%20camera%20professional%20photography&sign=6b099a6dd31856f91c56e9cc8bcfe622',
    price: '26999',
    status: '已发货',
    orderDate: '2023-10-25',
    paymentDate: '2023-10-25',
    expectedDelivery: '2023-10-30',
    trackingNumber: 'SF1234567890',
    items: [
      { id: 'i1', name: '索尼 A7R V 机身', price: '26999', quantity: 1 }
    ],
    address: {
      name: '张先生',
      phone: '138****6789',
      address: '上海市浦东新区张江高科技园区博云路2号'
    }
  },
  {
    id: 'o2',
    orderNumber: 'ORD-20231015-002',
    type: '课程',
    title: '风光摄影进阶课程',
    description: '专业风光摄影技巧详解，从构图到后期全流程教学',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=landscape%20photography%20course%20online%20tutorial&sign=589d29479c156e79a4947927fe14d279',
    price: '599',
    status: '已完成',
    orderDate: '2023-10-15',
    paymentDate: '2023-10-15',
    completionDate: '2023-10-15',
    items: [
      { id: 'i2', name: '风光摄影进阶课程', price: '599', quantity: 1 }
    ],
    accessLink: '/online-courses/123',
    completionProgress: 65
  },
  {
    id: 'o3',
    orderNumber: 'ORD-20231010-003',
    type: '作品授权',
    title: '城市风光摄影作品授权',
    description: '城市天际线摄影作品商业授权使用',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=city%20skyline%20photography%20commercial%20license&sign=bd307c3da858be7cfb2e0db97f9ea59f',
    price: '2500',
    status: '已完成',
    orderDate: '2023-10-10',
    paymentDate: '2023-10-10',
    completionDate: '2023-10-10',
    items: [
      { id: 'i3', name: '城市风光作品授权 - 商业用途', price: '2500', quantity: 1 }
    ],
    licenseType: '商业授权',
    licensePeriod: '永久',
    downloadLink: '/downloads/license-123'
  },
  {
    id: 'o4',
    orderNumber: 'ORD-20231005-004',
    type: '器材',
    title: '索尼 FE 24-70mm F2.8 GM II 镜头',
    description: '索尼全画幅标准变焦镜头 大三元 专业级',
    image: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=sony%20fe%2024-70mm%20f2.8%20gm%20ii%20lens%20professional&sign=cf947b7d5153c26105db97fef95b85ef',
    price: '19999',
    status: '已完成',
    orderDate: '2023-10-05',
    paymentDate: '2023-10-05',
    deliveryDate: '2023-10-08',
    items: [
      { id: 'i4', name: '索尼 FE 24-70mm F2.8 GM II 镜头', price: '19999', quantity: 1 }
    ],
    address: {
      name: '张先生',
      phone: '138****6789',
      address: '上海市浦东新区张江高科技园区博云路2号'
    }
  }
];

const ProfileOrders: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all'); // all, equipment, courses, licenses
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-asc, date-desc, price-asc, price-desc

  // 过滤和排序订单
  const getFilteredOrders = () => {
    let orders = [...mockOrders];
    
    // 按类型过滤
    if (activeTab !== 'all') {
      orders = orders.filter(order => order.type.toLowerCase() === activeTab.toLowerCase());
    }
    
    // 按状态过滤
    if (selectedStatus !== 'all') {
      orders = orders.filter(order => order.status === selectedStatus);
    }
    
    // 按搜索词过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      orders = orders.filter(order => 
        order.title.toLowerCase().includes(term) || 
        order.orderNumber.toLowerCase().includes(term) ||
        order.description.toLowerCase().includes(term)
      );
    }
    
    // 排序
    if (sortBy === 'date-asc') {
      orders.sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime());
    } else if (sortBy === 'date-desc') {
      orders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
    } else if (sortBy === 'price-asc') {
      orders.sort((a, b) => parseInt(a.price) - parseInt(b.price));
    } else if (sortBy === 'price-desc') {
      orders.sort((a, b) => parseInt(b.price) - parseInt(a.price));
    }
    
    return orders;
  };

  const filteredOrders = getFilteredOrders();

  if (!isAuthenticated) {
    return (
     <div className="container mx-auto px-4 py-8 bg-[#1E2A3A] min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的订单记录和购买历史</p>
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
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">我的订单</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            查看和管理您的器材购买、课程订阅和作品授权订单
          </p>
        </div>

        {/* 订单类型选择 - 未选中：深灰蓝 #2D3748 + 浅冷灰 #B8C6D8；选中：浅蓝灰 #4A5F8B + 浅白 #F5F7FA */}
        <div className="bg-[#2D3748] rounded-xl p-1 mb-8 flex flex-wrap">
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-4 px-4 text-center rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-shopping-bag mr-2"></i>
            <span>全部订单</span>
          </motion.button>
          
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setActiveTab('equipment')}
            className={`flex-1 py-4 px-4 text-center rounded-lg transition-colors ${
              activeTab === 'equipment'
                ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-video mr-2"></i>
            <span>器材订单</span>
          </motion.button>
          
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setActiveTab('courses')}
            className={`flex-1 py-4 px-4 text-center rounded-lg transition-colors ${
              activeTab === 'courses'
                ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-book mr-2"></i>
            <span>课程订单</span>
          </motion.button>
          
          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setActiveTab('licenses')}
            className={`flex-1 py-4 px-4 text-center rounded-lg transition-colors ${
              activeTab === 'licenses'
                ? 'bg-[#4A5F8B] text-[#F5F7FA] font-medium'
                : 'bg-[#2D3748] text-[#B8C6D8] hover:text-[#F5F7FA]'
            }`}
          >
            <i className="fa-solid fa-copyright mr-2"></i>
            <span>授权订单</span>
          </motion.button>
        </div>

        {/* 搜索和筛选 - 同全局通用样式 */}
        <div className="bg-[#2D3748] rounded-xl p-6 shadow-sm border border-[#4A5F8B] mb-8">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="搜索订单号或商品名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all placeholder:text-[#B8C6D8]"
              />
              <i className="fa-solid fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
            </div>
            
            <div className="flex space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="待付款">待付款</option>
                <option value="待发货">待发货</option>
                <option value="已发货">已发货</option>
                <option value="已完成">已完成</option>
                <option value="已取消">已取消</option>
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-[#2D3748] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
              >
                <option value="date-desc">最新下单</option>
                <option value="date-asc">最早下单</option>
                <option value="price-desc">价格从高到低</option>
                <option value="price-asc">价格从低到高</option>
              </select>
            </div>
          </div>
        </div>

        {/* 订单列表 - 订单卡片：底色深灰蓝 #2D3748；状态标签已发货：浅蓝灰 #4A5F8B；已完成：浅灰蓝 #6B7C93 */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              whileHover={{ y: -5, boxShadow: '0 2px 12px rgba(74, 95, 139, 0.3)' }}
              className="bg-[#2D3748] rounded-xl overflow-hidden border border-[#4A5F8B] transition-all shadow-sm"
            >
              {/* 订单头部 */}
              <div className="p-5 border-b border-[#4A5F8B] bg-[#2D3748]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <span className="text-sm text-[#B8C6D8] font-medium mr-4">{order.orderNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === '已完成'
                        ? 'bg-[#6B7C93]/20 text-[#6B7C93]'
                        : order.status === '已发货'
                          ? 'bg-[#4A5F8B]/20 text-[#4A5F8B]'
                          : order.status === '待发货'
                            ? 'bg-[#ED8936]/20 text-[#ED8936]'
                            : order.status === '待付款'
                              ? 'bg-[#F6AD55]/20 text-[#F6AD55]'
                              : 'bg-[#B8C6D8]/20 text-[#B8C6D8]'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-[#B8C6D8]">
                    <i className="fa-solid fa-calendar-alt mr-2 text-[#4A5F8B]"></i>
                    <span>下单时间：{order.orderDate}</span>
                  </div>
                </div>
              </div>
              
              {/* 订单内容 */}
              <div className="p-5">
                <div className="md:flex">
                  <div className="md:w-1/4 mb-4 md:mb-0">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-full h-40 object-cover rounded-lg border border-[#4A5F8B]"
                    />
                  </div>
                  
                  <div className="md:w-3/4 md:pl-6">
                    {/* 商品信息 */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-[#F5F7FA] mb-2">{order.title}</h3>
                      <p className="text-sm text-[#B8C6D8]">{order.description}</p>
                    </div>
                    
                    {/* 订单详情 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {order.type === '器材' && order.address && (
                        <div>
                          <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">收货信息</h4>
                          <p className="text-sm text-[#B8C6D8]">{order.address.name} {order.address.phone}</p>
                          <p className="text-sm text-[#B8C6D8] mt-1">{order.address.address}</p>
                        </div>
                      )}
                      
                      {order.type === '课程' && order.accessLink && (
                        <div>
                          <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">学习进度</h4>
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-[#1E2532] rounded-full overflow-hidden mr-2">
                              <div 
                                className="h-full bg-[#4A5F8B]" 
                                style={{ width: `${order.completionProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-[#B8C6D8]">{order.completionProgress}%</span>
                          </div>
                        </div>
                      )}
                      
                      {order.type === '作品授权' && order.licenseType && (
                        <div>
                          <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">授权信息</h4>
                          <p className="text-sm text-[#B8C6D8]">{order.licenseType}</p>
                          <p className="text-sm text-[#B8C6D8] mt-1">有效期：{order.licensePeriod}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">支付信息</h4>
                        <p className="text-sm text-[#B8C6D8]">支付时间：{order.paymentDate}</p>
                        <p className="text-sm text-[#B8C6D8] mt-1">订单金额：¥{parseInt(order.price).toLocaleString()}</p>
                      </div>
                      
                      {(order.type === '器材' && order.expectedDelivery) && (
                        <div>
                          <h4 className="text-sm font-medium text-[#B8C6D8] mb-2">物流信息</h4>
                          <p className="text-sm text-[#B8C6D8]">预计送达：{order.expectedDelivery}</p>
                          {order.trackingNumber && (
                            <p className="text-sm text-[#B8C6D8] mt-1">运单号：{order.trackingNumber}</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* 操作按钮 - "订单详情"按钮：浅灰蓝 #6B7C93 + 浅冷灰；操作按钮（查看物流/继续学习）：浅蓝灰 #4A5F8B + 浅白 #F5F7FA */}
                    <div className="flex justify-end space-x-3">
                      <button className="px-4 py-2 bg-[#6B7C93] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#6B7C93] text-sm">
                        订单详情
                      </button>
                      
                      {order.status === '待付款' && (
                        <button className="px-4 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#63B3ED] transition-colors text-sm">
                          立即付款
                        </button>
                      )}
                      
                       {order.status === '已发货' && order.type === '器材' && (
                        <button className="px-4 py-2 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] text-sm">
                          查看物流
                        </button>
                      )}
                      
                       {order.status === '已完成' && order.type === '课程' && order.accessLink && (
                        <button className="px-4 py-2 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] text-sm">
                          继续学习
                        </button>
                      )}
                      
                       {order.status === '已完成' && order.type === '作品授权' && order.downloadLink && (
                        <button className="px-4 py-2 bg-[#2D3748] text-[#B8C6D8] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors border border-[#4A5F8B] text-sm">
                          下载文件
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center mt-8">
            <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
              <i className="fa-solid fa-shopping-bag text-2xl"></i>
            </div>
            <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无订单</h3>
            <p className="text-[#B8C6D8] mb-6">
              您还没有相关类型的订单记录
            </p>
            <button className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors">
              <i className="fa-solid fa-compass mr-2"></i>
              浏览商城
            </button>
          </div>
        )}

        {/* 分页 - 同全局通用样式 */}
        {filteredOrders.length > 0 && (
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

export default ProfileOrders;