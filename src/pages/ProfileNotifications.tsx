// ProfileNotifications.tsx - 通知+私信一体化模块组件
// 功能描述：包含通知分类、状态管理、操作入口、实时推送和私信功能的完整消息系统
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';
import { toast } from 'sonner';
import { AuthContext } from '../contexts/authContext';

// 通知类型定义
interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'share' | 'contest' | 'event' | 'system' | 'security' | 'message';
  category: '作品互动' | '社交连接' | '内容活动' | '系统安全';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedUrl?: string;
  conversationId?: string; // 私信相关通知的会话ID
  sender?: {
    id: string;
    name: string;
    avatar: string;
  };
  relatedItem?: {
    id: string;
    title: string;
    thumbnail?: string;
  };
  actions?: {
    type: string;
    label: string;
  }[];
}

// 会话类型定义
interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  isMuted: boolean;
}

// 消息类型定义
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  contentType: 'text' | 'image' | 'photoLink' | 'file';
  timestamp: string;
  isRead: boolean;
  fileInfo?: {
    name: string;
    size: number;
    url: string;
    type: string;
  };
  photoInfo?: {
    id: string;
    title: string;
    thumbnail: string;
    url: string;
  };
}

// 模拟通知数据
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    category: '作品互动',
    title: '作品获赞',
    message: '摄影爱好者小王赞了你的作品《城市日落》',
    timestamp: '2分钟前',
    isRead: false,
    relatedUrl: '/photo/123',
    sender: {
      id: 'user1',
      name: '摄影爱好者小王',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20young&sign=7cfa9169f3be8f37a915ca433e371296',
    },
    relatedItem: {
      id: '123',
      title: '城市日落',
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=city%20sunset%20photography%20urban%20landscape&sign=92f469395c439e7a84b11891bfb3431e',
    },
    actions: [
      { type: 'view', label: '查看作品' }
    ]
  },
  {
    id: '2',
    type: 'comment',
    category: '作品互动',
    title: '新评论',
    message: '专业摄影师李明评论了你的作品《山间晨雾》：构图非常棒，光影处理得很自然！',
    timestamp: '15分钟前',
    isRead: false,
    relatedUrl: '/photo/456#comments',
    sender: {
      id: 'user2',
      name: '专业摄影师李明',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20male%20mature&sign=3b33a1ecbd8abb84a20ab1fc5971b64f',
    },
    relatedItem: {
      id: '456',
      title: '山间晨雾',
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=mountain%20morning%20mist%20landscape%20photography&sign=a124f5e049d0b54ad49a10052dce0ccf',
    },
    actions: [
      { type: 'reply', label: '回复' },
      { type: 'view', label: '查看评论' }
    ]
  },
  {
    id: '3',
    type: 'follow',
    category: '社交连接',
    title: '新粉丝',
    message: '摄影师小张关注了你',
    timestamp: '1小时前',
    isRead: false,
    relatedUrl: '/profile/user3',
    sender: {
      id: 'user3',
      name: '摄影师小张',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20creative&sign=05eaa6a6889c9fd565f612592ebff64a',
    },
    actions: [
      { type: 'followback', label: '回关' },
      { type: 'view', label: '查看主页' }
    ]
  },
  {
    id: '4',
    type: 'message',
    category: '社交连接',
    title: '新私信',
    message: '摄影师小李给你发了一条私信：嘿，看到你拍的城市风光作品很棒，可以交流一下拍摄经验吗？',
    timestamp: '3小时前',
    isRead: true,
    relatedUrl: '/profile-center/notifications',
    conversationId: 'conv1',
    sender: {
      id: 'user4',
      name: '摄影师小李',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20enthusiast%20female%20young&sign=231146bb4d12e9c13f5e5ff9838149c0',
    },
    actions: [
      { type: 'reply', label: '回复' }
    ]
  },
  {
    id: '5',
    type: 'contest',
    category: '内容活动',
    title: '赛事提醒',
    message: '你关注的摄影大赛《城市风光》即将开始，点击了解详情并报名！',
    timestamp: '昨天',
    isRead: true,
    relatedUrl: '/contest/101',
    relatedItem: {
      id: '101',
      title: '城市风光摄影大赛',
    },
    actions: [
      { type: 'register', label: '立即报名' },
      { type: 'view', label: '了解详情' }
    ]
  },
  {
    id: '6',
    type: 'event',
    category: '内容活动',
    title: '活动通知',
    message: '线下摄影活动《秋意浓》将于本周末在上海举行，已有28人报名',
    timestamp: '2天前',
    isRead: true,
    relatedUrl: '/event/202',
    relatedItem: {
      id: '202',
      title: '秋意浓摄影外拍活动',
    },
    actions: [
      { type: 'join', label: '我要参加' },
      { type: 'view', label: '活动详情' }
    ]
  },
  {
    id: '7',
    type: 'system',
    category: '系统安全',
    title: '系统通知',
    message: '您的账号于今天下午2点在新设备上登录，如非本人操作，请及时修改密码',
    timestamp: '3天前',
    isRead: true,
    relatedUrl: '/profile-center/settings',
    actions: [
      { type: 'check', label: '查看详情' },
      { type: 'security', label: '安全设置' }
    ]
  },
  {
    id: '8',
    type: 'security',
    category: '系统安全',
    title: '安全提醒',
    message: '您的会员服务将在7天后到期，建议及时续费以继续享受全部特权',
    timestamp: '4天前',
    isRead: true,
    relatedUrl: '/profile-center/membership',
    actions: [
      { type: 'renew', label: '立即续费' }
    ]
  },
  {
    id: '9',
    type: 'share',
    category: '作品互动',
    title: '作品被分享',
    message: '摄影爱好者小赵分享了你的作品《星空夜景》到他的动态',
    timestamp: '上周',
    isRead: true,
    relatedUrl: '/photo/303',
    sender: {
      id: 'user5',
      name: '摄影爱好者小赵',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20night%20photography&sign=03e414a62159164b338153e73cd9692c',
    },
    relatedItem: {
      id: '303',
      title: '星空夜景',
      thumbnail: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=night%20sky%20stars%20landscape%20photography&sign=ff7a7ce7a32d9a5122435c001095de5f',
    },
    actions: [
      { type: 'view', label: '查看分享' }
    ]
  },
  {
    id: '10',
    type: 'system',
    category: '系统安全',
    title: '新功能上线',
    message: '平台新增摄影作品集批量管理功能，点击了解如何使用',
    timestamp: '2周前',
    isRead: true,
    relatedUrl: '/tutorial/404',
    actions: [
      { type: 'learn', label: '学习使用' }
    ]
  }
];

// 模拟会话数据
const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    userId: 'user4',
    userName: '摄影师小李',
    userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photography%20enthusiast%20female%20young&sign=231146bb4d12e9c13f5e5ff9838149c0',
    lastMessage: '嘿，看到你拍的城市风光作品很棒，可以交流一下拍摄经验吗？',
    lastMessageTime: '3小时前',
    unreadCount: 1,
    isOnline: true,
    isPinned: false,
    isMuted: false
  },
  {
    id: 'conv2',
    userId: 'user2',
    userName: '专业摄影师李明',
    userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=professional%20photographer%20male%20mature&sign=3b33a1ecbd8abb84a20ab1fc5971b64f',
    lastMessage: '我看了你最近的作品，进步很大！构图和光影都很出色',
    lastMessageTime: '昨天',
    unreadCount: 0,
    isOnline: false,
    isPinned: true,
    isMuted: false
  },
  {
    id: 'conv3',
    userId: 'user1',
    userName: '摄影爱好者小王',
    userAvatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20male%20young&sign=7cfa9169f3be8f37a915ca433e371296',
    lastMessage: '你用的是什么相机拍摄的？效果真不错',
    lastMessageTime: '2天前',
    unreadCount: 0,
    isOnline: false,
    isPinned: false,
    isMuted: false
  }
];

// 模拟消息数据
const mockMessages: Message[] = [
  {
    id: 'msg1',
    conversationId: 'conv1',
    senderId: 'user4',
    content: '嘿，看到你拍的城市风光作品很棒，可以交流一下拍摄经验吗？',
    contentType: 'text',
    timestamp: '3小时前',
    isRead: false
  },
  {
    id: 'msg2',
    conversationId: 'conv1',
    senderId: 'current',
    content: '当然可以！我主要用的是索尼A7R IV加上24-70mm F2.8镜头拍摄的，你对哪方面的技巧比较感兴趣？',
    contentType: 'text',
    timestamp: '3小时前',
    isRead: true
  },
  {
    id: 'msg3',
    conversationId: 'conv1',
    senderId: 'user4',
    content: '主要是想了解一下你的后期流程，尤其是色彩处理方面',
    contentType: 'text',
    timestamp: '2小时前',
    isRead: false
  },
  {
    id: 'msg4',
    conversationId: 'conv2',
    senderId: 'user2',
    content: '我看了你最近的作品，进步很大！构图和光影都很出色',
    contentType: 'text',
    timestamp: '昨天',
    isRead: true
  },
  {
    id: 'msg5',
    conversationId: 'conv2',
    senderId: 'current',
    content: '谢谢李老师的肯定！我一直有在学习你分享的后期教程，收获很大',
    contentType: 'text',
    timestamp: '昨天',
    isRead: true
  }
];

// 分类数据
const categories = [
  { id: 'all', name: '全部通知', icon: 'fa-bell', type: 'notification' },
  { id: '作品互动', name: '作品互动', icon: 'fa-image', type: 'notification' },
  { id: '社交连接', name: '社交连接', icon: 'fa-user-friends', type: 'notification' },
  { id: '内容活动', name: '内容活动', icon: 'fa-calendar-alt', type: 'notification' },
  { id: '系统安全', name: '系统安全', icon: 'fa-shield-alt', type: 'notification' },
  { id: 'messages', name: '私信', icon: 'fa-comment', type: 'message' },
];

// 筛选选项
const filters = [
  { id: 'all', name: '全部' },
  { id: 'unread', name: '未读' },
  { id: 'read', name: '已读' },
];

const ProfileNotifications: React.FC = () => {
  const { theme } = useTheme();
  const { isAuthenticated, user } = React.useContext(AuthContext);
  const navigate = useNavigate();
  
  // 状态管理
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTab, setSelectedTab] = useState<'notifications' | 'messages'>('notifications');
  const [selectedConversations, setSelectedConversations] = useState<string[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [newNotification, setNewNotification] = useState<Notification | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageInputType, setMessageInputType] = useState<'text' | 'image' | 'photoLink' | 'file'>('text');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 计算未读数量
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const unreadMessageCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  // 筛选通知
  const filteredNotifications = notifications.filter(notification => {
    const categoryMatch = selectedCategory === 'all' || notification.category === selectedCategory;
    const filterMatch = selectedFilter === 'all' || 
                      (selectedFilter === 'unread' && !notification.isRead) || 
                      (selectedFilter === 'read' && notification.isRead);
    const searchMatch = searchQuery === '' || 
                       notification.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && filterMatch && searchMatch;
  });

  // 筛选会话
  const filteredConversations = conversations.filter(conversation => {
    const searchMatch = searchQuery === '' || 
                       conversation.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    return searchMatch;
  });

  // 获取当前会话的消息
  const getCurrentConversationMessages = (conversationId: string) => {
    return messages.filter(message => message.conversationId === conversationId);
  };

  // 标记单条通知为已读
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  // 批量标记已读
  const markSelectedAsRead = () => {
    if (selectedTab === 'notifications') {
      setNotifications(prev => 
        prev.map(notification => 
          selectedNotifications.includes(notification.id) ? { ...notification, isRead: true } : notification
        )
      );
      setSelectedNotifications([]);
      toast.success('已标记选中的通知为已读');
    } else {
      // 标记选中的会话消息为已读
      setConversations(prev => 
        prev.map(conversation => 
          selectedConversations.includes(conversation.id) ? { ...conversation, unreadCount: 0 } : conversation
        )
      );
      setMessages(prev => 
        prev.map(message => 
          selectedConversations.includes(message.conversationId) ? { ...message, isRead: true } : message
        )
      );
      setSelectedConversations([]);
      toast.success('已标记选中的消息为已读');
    }
    setIsSelectMode(false);
  };

  // 删除选中的项目
  const deleteSelectedItems = () => {
    if (selectedTab === 'notifications') {
      setNotifications(prev => 
        prev.filter(notification => !selectedNotifications.includes(notification.id))
      );
      setSelectedNotifications([]);
      toast.success('已删除选中的通知');
    } else {
      setConversations(prev => 
        prev.filter(conversation => !selectedConversations.includes(conversation.id))
      );
      setMessages(prev => 
        prev.filter(message => !selectedConversations.includes(message.conversationId))
      );
      setSelectedConversations([]);
      toast.success('已删除选中的会话');
      
      // 如果删除了当前活跃的会话，清除活跃会话
      if (activeConversation && selectedConversations.includes(activeConversation)) {
        setActiveConversation(null);
        setIsMobileChatOpen(false);
      }
    }
    setIsSelectMode(false);
  };

  // 标记所有为已读
  const markAllAsRead = () => {
    if (selectedTab === 'notifications') {
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      toast.success('已将所有通知标记为已读');
    } else {
      setConversations(prev => 
        prev.map(conversation => ({ ...conversation, unreadCount: 0 }))
      );
      setMessages(prev => 
        prev.map(message => ({ ...message, isRead: true }))
      );
      toast.success('已将所有消息标记为已读');
    }
  };

  // 切换选择状态
  const toggleSelection = (id: string) => {
    if (selectedTab === 'notifications') {
      setSelectedNotifications(prev => 
        prev.includes(id) 
          ? prev.filter(itemId => itemId !== id) 
          : [...prev, id]
      );
    } else {
      setSelectedConversations(prev => 
        prev.includes(id) 
          ? prev.filter(itemId => itemId !== id) 
          : [...prev, id]
      );
    }
  };

  // 处理通知操作
  const handleNotificationAction = (notification: Notification, actionType: string) => {
    // 根据操作类型执行不同的操作
    switch(actionType) {
      case 'followback':
        toast.success('已成功关注');
        break;
      case 'reply':
        // 跳转到评论区域或打开私信
        if (notification.type === 'message' && notification.conversationId) {
          handleOpenConversation(notification.conversationId);
        } else if (notification.relatedUrl) {
          window.location.href = notification.relatedUrl;
        }
        break;
      case 'register':
      case 'join':
      case 'renew':
        if (notification.relatedUrl) {
          window.location.href = notification.relatedUrl;
        }
        toast.success('操作成功');
        break;
      default:
        if (notification.relatedUrl) {
          window.location.href = notification.relatedUrl;
        }
    }
    
    // 标记为已读
    markAsRead(notification.id);
  };

  // 打开会话
  const handleOpenConversation = (conversationId: string) => {
    // 标记会话为已读
    setConversations(prev => 
      prev.map(conversation => 
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      )
    );
    setMessages(prev => 
      prev.map(message => 
        message.conversationId === conversationId ? { ...message, isRead: true } : message
      )
    );
    
    // 设置活跃会话
    setActiveConversation(conversationId);
    
    // 在移动端打开聊天窗口
    if (window.innerWidth < 1024) {
      setIsMobileChatOpen(true);
    }
    
    // 滚动到页面顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // 滚动到最新消息
    setTimeout(() => {
      if (messagesEndRef.current) {
        // 只在聊天窗口内容区域内滚动
        const chatContainer = messagesEndRef.current.closest('.overflow-y-auto');
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      }
    }, 100);
  };

  // 发送消息
  const handleSendMessage = () => {
    if (!activeConversation || !newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversation,
      senderId: 'current',
      content: newMessage.trim(),
      contentType: messageInputType,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    
    // 添加新消息
    setMessages(prev => [...prev, newMsg]);
    
    // 更新会话最后消息
    setConversations(prev => 
      prev.map(conversation => 
        conversation.id === activeConversation 
          ? { 
              ...conversation, 
              lastMessage: newMessage.trim(),
              lastMessageTime: newMsg.timestamp,
              isRead: true
            } 
          : conversation
      )
    );
    
    // 清空输入框
    setNewMessage('');
    
    // 滚动到最新消息
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 模拟实时通知推送
  useEffect(() => {
    const interval = setInterval(() => {
      const randomActions = [
        { type: 'like', label: '查看作品' },
        { type: 'comment', label: '回复' },
        { type: 'reply', label: '回复' }
      ];
      const randomAction = randomActions[Math.floor(Math.random() * randomActions.length)];
      
      // 随机生成通知或私信
      const isMessage = Math.random() > 0.7;
      
      if (isMessage) {
        // 模拟新私信
        const conversation = mockConversations[Math.floor(Math.random() * mockConversations.length)];
        const newMsg = {
          id: `msg-${Date.now()}`,
          conversationId: conversation.id,
          senderId: conversation.userId,
          content: `这是一条新私信，关于你分享的摄影作品${['《城市风光》', '《山间晨雾》', '《星空夜景》'][Math.floor(Math.random() * 3)]}`,
          contentType: 'text',
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          isRead: false
        };
        
        // 添加到消息列表
        setMessages(prev => [...prev, newMsg]);
        
        // 更新会话
        setConversations(prev => 
          prev.map(conv => 
            conv.id === conversation.id 
              ? { 
                  ...conv, 
                  lastMessage: newMsg.content,
                  lastMessageTime: newMsg.timestamp,
                  unreadCount: conv.unreadCount + 1
                } 
              : conv
          )
        );
        
        // 创建通知
        const newNotif: Notification = {
          id: `new-${Date.now()}`,
          type: 'message',
          category: '社交连接',
          title: '新私信',
          message: `${conversation.userName}给你发了一条私信：${newMsg.content}`,
          timestamp: '刚刚',
          isRead: false,
          relatedUrl: '/profile-center/notifications',
          conversationId: conversation.id,
          sender: {
            id: conversation.userId,
            name: conversation.userName,
            avatar: conversation.userAvatar,
          },
          actions: [{ type: 'reply', label: '回复' }]
        };
        
        setNewNotification(newNotif);
        setShowNotificationToast(true);
        
        // 3秒后将新通知添加到列表
        setTimeout(() => {
          setNotifications(prev => [newNotif, ...prev]);
          setShowNotificationToast(false);
          setNewNotification(null);
        }, 3000);
        
      } else {
        // 模拟普通通知
        const newNotif: Notification = {
          id: `new-${Date.now()}`,
          type: 'like',
          category: '作品互动',
          title: '作品获赞',
          message: `摄影爱好者${['小明', '小红', '小刚', '小丽'][Math.floor(Math.random() * 4)]}赞了你的作品《${['山间溪流', '城市夜景', '海边日落', '田园风光'][Math.floor(Math.random() * 4)]}》`,
          timestamp: '刚刚',
          isRead: false,
          relatedUrl: '/photo/new',
          sender: {
            id: `new-user-${Date.now()}`,
            name: `摄影爱好者${['小明', '小红', '小刚', '小丽'][Math.floor(Math.random() * 4)]}`,
            avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=photographer%20avatar%20random%20portrait&sign=f1c2bfc4248f6a70b783bb4812c5de0c',
          },
          actions: [randomAction]
        };
        
        setNewNotification(newNotif);
        setShowNotificationToast(true);
        
        // 3秒后将新通知添加到列表
        setTimeout(() => {
          setNotifications(prev => [newNotif, ...prev]);
          setShowNotificationToast(false);
          setNewNotification(null);
        }, 3000);
      }
      
    }, 30000); // 每30秒模拟一次新消息
    
    return () => clearInterval(interval);
  }, []);

  // 获取通知类型对应的图标
  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'like': return 'fa-heart';
      case 'comment': return 'fa-comment';
      case 'follow': return 'fa-user-plus';
      case 'mention': return 'fa-at';
      case 'share': return 'fa-share-alt';
      case 'contest': return 'fa-trophy';
      case 'event': return 'fa-calendar-check';
      case 'system': return 'fa-info-circle';
      case 'security': return 'fa-shield-alt';
      case 'message': return 'fa-comment-alt';
      default: return 'fa-bell';
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 获取当前活跃会话信息
  const getActiveConversationInfo = () => {
    return conversations.find(conv => conv.id === activeConversation);
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
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
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">我的消息</h1><p className="text-[#B8C6D8] max-w-2xl mx-auto">
            查看最新的互动消息、活动通知、系统提醒和私信
          </p>
        </div>

        {/* 主要内容区布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <div className="bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B] sticky top-24">
              <h3 className="text-lg font-bold text-[#F5F7FA] mb-4">消息分类</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`flex items-center justify-between w-full py-3 px-4 rounded-lg transition-colors ${
                      (selectedTab === category.type && (category.type === 'messages' || selectedCategory === category.id))
                        ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                        : 'text-[#B8C6D8] hover:bg-[#1E2532]'
                    }`}
                    onClick={() => {
                      if (category.type === 'notification') {
                        setSelectedTab('notifications');
                        setSelectedCategory(category.id);
                      } else {
                        setSelectedTab('messages');
                        setActiveConversation(null);
                        setIsMobileChatOpen(false);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <i className={`fa-solid ${category.icon} mr-3`}></i>
                      <span>{category.name}</span>
                    </div>
                    {category.type === 'notification' ? (
                      category.id === 'all' && unreadCount > 0 ? (
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs font-medium">
                          {unreadCount}
                        </span>
                      ) : (
                        category.id !== 'all' && notifications.filter(n => n.category === category.name && !n.isRead).length > 0 ? (
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs font-medium">
                            {notifications.filter(n => n.category === category.name && !n.isRead).length}
                          </span>
                        ) : null
                      )
                    ) : unreadMessageCount > 0 ? (
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs font-medium">
                        {unreadMessageCount}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
              
              {/* 批量操作按钮 */}
              <div className="mt-6 pt-4 border-t border-[#4A5F8B]">
                <button 
                  className="w-full py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]"
                  onClick={markAllAsRead}
                >
                  <i className="fa-solid fa-check-double mr-2"></i>
                  全部标记为已读
                </button>
              </div>
            </div>
          </div>
          
          {/* 主内容区 - 通知/会话列表 */}
          {(selectedTab === 'notifications' || (selectedTab === 'messages' && !activeConversation)) && (
            <div className="lg:col-span-3 space-y-6">
              {/* 顶部操作栏 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0 bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B]">
                <div className="flex items-center space-x-2">
                  <button 
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isSelectMode
                        ? 'bg-[#4A5F8B] text-[#F5F7FA] border border-[#4A5F8B]'
                        : 'bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                    }`}
                    onClick={() => setIsSelectMode(!isSelectMode)}
                  >
                    <i className={`fa-solid ${isSelectMode ? 'fa-times' : 'fa-check-square'} mr-2`}></i>
                    {isSelectMode ? '取消选择' : '选择'}
                  </button>
                  
                  {isSelectMode && (
                    <>
                      <button 
                        className="px-4 py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#4A5F8B] hover:text-[#F5F7FA] transition-colors"
                        onClick={markSelectedAsRead}
                        disabled={selectedTab === 'notifications' ? selectedNotifications.length === 0 : selectedConversations.length === 0}
                      >
                        <i className="fa-solid fa-check mr-2"></i>
                        标记已读
                      </button>
                      <button 
                        className="px-4 py-2 bg-[#1E2532] text-[#B8C6D8] border border-[#4A5F8B] rounded-lg font-medium hover:bg-[#F56565] hover:text-[#F5F7FA] transition-colors"
                        onClick={deleteSelectedItems}
                        disabled={selectedTab === 'notifications' ? selectedNotifications.length === 0 : selectedConversations.length === 0}
                      >
                        <i className="fa-solid fa-trash-alt mr-2"></i>
                        删除
                      </button>
                    </>
                  )}
                </div>
                
                {/* 筛选和搜索 */}
                <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
                  {selectedTab === 'notifications' && (
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="w-full sm:w-auto px-4 py-2 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all appearance-none cursor-pointer"
                    >
                      {filters.map(filter => (
                        <option key={filter.id} value={filter.id}>{filter.name}</option>
                      ))}
                    </select>
                  )}
                  
                  <div className="relative w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder={selectedTab === 'notifications' ? '搜索通知...' : '搜索会话...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 px-4 py-2 pl-10 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                    />
                    <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B8C6D8]"></i>
                  </div>
                </div>
              </div>
              
              {/* 内容列表 */}
              <div className="space-y-4">
                {selectedTab === 'notifications' ? (
                  // 通知列表
                  filteredNotifications.length > 0 ? (
                    filteredNotifications.map(notification => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`bg-[#2D3748] rounded-xl p-4 shadow-sm border ${
                          notification.isRead 
                            ? 'border-[#4A5F8B]' 
                            : 'border-[#4A5F8B] bg-gradient-to-r from-[#4A5F8B]/30 to-[#2D3748]'
                        } hover:border-[#4A5F8B] transition-all`}
                        onClick={() => {
                          if (!isSelectMode) {
                            if (notification.type === 'message' && notification.conversationId) {
                              handleOpenConversation(notification.conversationId);
                            } else if (notification.relatedUrl) {
                              window.location.href = notification.relatedUrl;
                            }
                            markAsRead(notification.id);
                          }
                        }}
                      >
                        {/* 选择模式下的复选框 */}
                        {isSelectMode && (
                          <div className="absolute top-4 left-4">
                            <input
                              type="checkbox"
                              checked={selectedNotifications.includes(notification.id)}
                              onChange={() => toggleSelection(notification.id)}
                              className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] bg-[#1E2532]"
                            />
                          </div>
                        )}
                        
                        <div className={`relative ${isSelectMode ? 'pl-10' : ''}`}>
                          {/* 通知头部 */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              {/* 未读指示器 */}
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-[#4A5F8B] rounded-full mr-2 mt-2"></div>
                              )}
                              
                              {/* 发送者头像 */}
                              {notification.sender && (
                                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-[#4A5F8B]">
                                  <img 
                                    src={notification.sender.avatar} 
                                    alt={notification.sender.name} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              
                              {/* 通知内容 */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-bold text-[#F5F7FA] truncate">
                                    {notification.title}
                                  </h3>
                                  <span className="text-xs text-[#4A5F8B] ml-2 whitespace-nowrap">
                                    {notification.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm text-[#B8C6D8] mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                              </div>
                            </div>
                            
                            {/* 相关项目缩略图 */}
                            {notification.relatedItem?.thumbnail && (
                              <div className="w-16 h-16 rounded-lg overflow-hidden ml-3 border border-[#4A5F8B] flex-shrink-0">
                                <img 
                                  src={notification.relatedItem.thumbnail} 
                                  alt={notification.relatedItem.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          
                          {/* 通知操作按钮 */}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex space-x-2 mt-3 pt-3 border-t border-[#4A5F8B]/50">
                              {notification.actions.map((action, index) => (
                                <button
                                  key={index}
                                  className="px-3 py-1 text-xs rounded-lg font-medium transition-colors bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] border border-[#4A5F8B]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNotificationAction(notification, action.type);
                                  }}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                      <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                        <i className="fa-solid fa-bell-slash text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无通知</h3>
                      <p className="text-[#B8C6D8]">
                        您当前没有{selectedFilter === 'unread' ? '未读' : ''}{selectedCategory !== 'all' ? selectedCategory : ''}通知
                      </p>
                    </div>
                  )
                ) : (
                  // 会话列表
                  filteredConversations.length > 0 ? (
                    <>
                      {/* 置顶会话 */}
                      {filteredConversations.filter(conv => conv.isPinned).length > 0 && (
                        <>
                          <h3 className="text-sm font-medium text-[#4A5F8B] mt-2">置顶会话</h3>
                          <div className="space-y-2">
                            {filteredConversations.filter(conv => conv.isPinned).map(conversation => (
                              <motion.div
                                key={conversation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B] hover:border-[#4A5F8B] transition-all`}
                                onClick={() => {
                                  if (!isSelectMode) {
                                    handleOpenConversation(conversation.id);
                                  }
                                }}
                              >
                                {/* 选择模式下的复选框 */}
                                {isSelectMode && (
                                  <div className="absolute top-4 left-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedConversations.includes(conversation.id)}
                                      onChange={() => toggleSelection(conversation.id)}
                                      className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] bg-[#1E2532]"
                                    />
                                  </div>
                                )}
                                
                                <div className={`relative ${isSelectMode ? 'pl-10' : ''}`}>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                      {/* 在线状态指示器 */}
                                      {conversation.isOnline && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2D3748]"></div>
                                      )}
                                      
                                      {/* 用户头像 */}
                                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-[#4A5F8B] relative">
                                        <img 
                                          src={conversation.userAvatar} 
                                          alt={conversation.userName} 
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      
                                      {/* 会话内容 */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center">
                                            <h3 className="font-bold text-[#F5F7FA] truncate">
                                              {conversation.userName}
                                            </h3>
                                            {conversation.isMuted && (
                                              <i className="fa-solid fa-volume-mute ml-2 text-[#4A5F8B] text-xs"></i>
                                            )}
                                            <i className="fa-solid fa-thumbtack ml-2 text-[#4A5F8B] text-xs"></i>
                                          </div>
                                          <span className="text-xs text-[#4A5F8B] ml-2 whitespace-nowrap">
                                            {conversation.lastMessageTime}
                                          </span>
                                        </div>
                                        <p className={`text-sm mt-1 line-clamp-1 ${
                                          conversation.unreadCount > 0 ? 'text-[#F5F7FA] font-medium' : 'text-[#B8C6D8]'
                                        }`}>
                                          {conversation.lastMessage}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {/* 未读消息数 */}
                                    {conversation.unreadCount > 0 && (
                                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs font-medium flex-shrink-0">
                                        {conversation.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}
                      
                      {/* 普通会话 */}
                      {filteredConversations.filter(conv => !conv.isPinned).length > 0 && (
                        <>
                          <h3 className="text-sm font-medium text-[#4A5F8B] mt-4 mb-2">最近会话</h3>
                          <div className="space-y-2">
                            {filteredConversations.filter(conv => !conv.isPinned).map(conversation => (
                              <motion.div
                                key={conversation.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`bg-[#2D3748] rounded-xl p-4 shadow-sm border border-[#4A5F8B] hover:border-[#4A5F8B] transition-all`}
                                onClick={() => {
                                  if (!isSelectMode) {
                                    handleOpenConversation(conversation.id);
                                  }
                                }}
                              >
                                {/* 选择模式下的复选框 */}
                                {isSelectMode && (
                                  <div className="absolute top-4 left-4">
                                    <input
                                      type="checkbox"
                                      checked={selectedConversations.includes(conversation.id)}
                                      onChange={() => toggleSelection(conversation.id)}
                                      className="h-4 w-4 text-[#4A5F8B] focus:ring-[#4A5F8B] border-[#4A5F8B] bg-[#1E2532]"
                                    />
                                  </div>
                                )}
                                
                                <div className={`relative ${isSelectMode ? 'pl-10' : ''}`}>
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start">
                                      {/* 在线状态指示器 */}
                                      {conversation.isOnline && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#2D3748]"></div>
                                      )}
                                      
                                      {/* 用户头像 */}
                                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border border-[#4A5F8B] relative">
                                        <img 
                                          src={conversation.userAvatar} 
                                          alt={conversation.userName} 
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      
                                      {/* 会话内容 */}
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center">
                                            <h3 className="font-bold text-[#F5F7FA] truncate">
                                              {conversation.userName}
                                            </h3>
                                            {conversation.isMuted && (
                                              <i className="fa-solid fa-volume-mute ml-2 text-[#4A5F8B] text-xs"></i>
                                            )}
                                          </div>
                                          <span className="text-xs text-[#4A5F8B] ml-2 whitespace-nowrap">
                                            {conversation.lastMessageTime}
                                          </span>
                                        </div>
                                        <p className={`text-sm mt-1 line-clamp-1 ${
                                          conversation.unreadCount > 0 ? 'text-[#F5F7FA] font-medium' : 'text-[#B8C6D8]'
                                        }`}>
                                          {conversation.lastMessage}
                                        </p>
                                      </div>
                                    </div>
                                    
                                    {/* 未读消息数 */}
                                    {conversation.unreadCount > 0 && (
                                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-xs font-medium flex-shrink-0">
                                        {conversation.unreadCount}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center">
                      <div className="w-16 h-16 bg-[#1E2532] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
                        <i className="fa-solid fa-comment-slash text-2xl"></i>
                      </div>
                      <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">暂无会话</h3>
                      <p className="text-[#B8C6D8] mb-4">
                        您还没有任何私信会话，开始与其他摄影师交流吧
                      </p>
                      <button className="px-6 py-2 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors border border-[#4A5F8B]">
                        <i className="fa-solid fa-plus mr-2"></i>
                        发起新私信
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
          
          {/* 主内容区 - 聊天窗口 */}
          {(selectedTab === 'messages' && activeConversation) && (
            <div className="lg:col-span-3">
              {/* 聊天窗口 */}
              <div className="bg-[#2D3748] rounded-xl shadow-sm border border-[#4A5F8B] h-[70vh] flex flex-col">
                {/* 聊天窗口头部 */}
                <div className="p-4 border-b border-[#4A5F8B] flex items-center justify-between">
                  <div className="flex items-center">
                    <button 
                      className="mr-3 text-[#B8C6D8] hover:text-[#F5F7FA]"
                      onClick={() => {
                        setActiveConversation(null);
                        setIsMobileChatOpen(false);
                        // 返回时也滚动到页面顶部
                        window.scrollTo({
                          top: 0,
                          behavior: 'smooth'
                        });
                      }}
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    
                    {getActiveConversationInfo() && (
                      <>
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-[#4A5F8B] relative">
                          <img 
                            src={getActiveConversationInfo()?.userAvatar} 
                            alt={getActiveConversationInfo()?.userName} 
                            className="w-full h-full object-cover"
                          />
                          {getActiveConversationInfo()?.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2D3748]"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#F5F7FA]">{getActiveConversationInfo()?.userName}</h3>
                          <p className="text-xs text-[#4A5F8B]">
                            {getActiveConversationInfo()?.isOnline ? '在线' : '离线'}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button className="p-2 text-[#B8C6D8] hover:text-[#F5F7FA] hover:bg-[#1E2532] rounded-full transition-colors">
                      <i className="fa-solid fa-phone-alt"></i>
                    </button>
                    <button className="p-2 text-[#B8C6D8] hover:text-[#F5F7FA] hover:bg-[#1E2532] rounded-full transition-colors">
                      <i className="fa-solid fa-video"></i>
                    </button>
                    <button className="p-2 text-[#B8C6D8] hover:text-[#F5F7FA] hover:bg-[#1E2532] rounded-full transition-colors">
                      <i className="fa-solid fa-info-circle"></i>
                    </button>
                  </div>
                </div>
                
                {/* 聊天内容区域 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {getCurrentConversationMessages(activeConversation).map(message => (
                    <div 
                      key={message.id}
                      className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.senderId === 'current' ? 'order-2' : 'order-1'}`}>
                        <div className={`p-3 rounded-2xl ${
                          message.senderId === 'current' 
                            ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-br-none' 
                            : 'bg-[#1E2532] text-[#F5F7FA] rounded-bl-none'
                        }`}>
                          {message.contentType === 'text' && (
                            <p>{message.content}</p>
                          )}
                          
                          {message.contentType === 'image' && (
                            <div className="rounded-lg overflow-hidden">
                              <img 
                                src={message.fileInfo?.url || 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20sample%20image&sign=7af587cbcf15bddfacf61e10bf0ddf8f'} 
                                alt="图片消息" 
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}
                          
                          {message.contentType === 'photoLink' && message.photoInfo && (
                            <div className="bg-[#2D3748] rounded-lg p-2 border border-[#4A5F8B]">
                              <div className="flex items-center">
                                <div className="w-16 h-16 rounded-md overflow-hidden mr-2 flex-shrink-0">
                                  <img 
                                    src={message.photoInfo.thumbnail} 
                                    alt={message.photoInfo.title} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-[#F5F7FA] truncate">{message.photoInfo.title}</h4>
                                  <p className="text-xs text-[#B8C6D8] mt-1">点击查看作品详情</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {message.contentType === 'file' && message.fileInfo && (
                            <div className="flex items-center bg-[#2D3748] rounded-lg p-2 border border-[#4A5F8B]">
                              <div className="w-8 h-8 rounded-full bg-[#4A5F8B] flex items-center justify-center mr-2 text-[#F5F7FA]">
                                <i className="fa-solid fa-file"></i>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-[#F5F7FA] truncate">{message.fileInfo.name}</h4>
                                <p className="text-xs text-[#B8C6D8] mt-1">{formatFileSize(message.fileInfo.size)}</p>
                              </div>
                              <button className="ml-2 text-[#4A5F8B] hover:text-[#F5F7FA]">
                                <i className="fa-solid fa-download"></i>
                              </button>
                            </div>
                          )}
                          
                          <div className={`flex items-center justify-end mt-1 text-xs ${
                            message.senderId === 'current' ? 'text-[#F5F7FA]/70' : 'text-[#B8C6D8]'
                          }`}>
                            <span>{message.timestamp}</span>
                            {message.senderId === 'current' && (
                              <i className={`fa-solid ml-1 ${message.isRead ? 'fa-check-double text-green-500' : 'fa-check'}`}></i>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {message.senderId !== 'current' && (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-[#4A5F8B] order-0 mt-1">
                          <img 
                            src={getActiveConversationInfo()?.userAvatar} 
                            alt={getActiveConversationInfo()?.userName} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* 输入区域 */}
                <div className="p-4 border-t border-[#4A5F8B]">
                  <div className="flex items-center space-x-2 mb-2">
                    <button 
                      className={`p-2 rounded-full transition-colors ${
                        messageInputType === 'text' 
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                          : 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                      }`}
                      onClick={() => setMessageInputType('text')}
                    >
                      <i className="fa-solid fa-keyboard"></i>
                    </button>
                    <button 
                      className={`p-2 rounded-full transition-colors ${
                        messageInputType === 'image' 
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                          : 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                      }`}
                      onClick={() => setMessageInputType('image')}
                    >
                      <i className="fa-solid fa-image"></i>
                    </button>
                    <button 
                      className={`p-2 rounded-full transition-colors ${
                        messageInputType === 'photoLink' 
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                          : 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                      }`}
                      onClick={() => setMessageInputType('photoLink')}
                    >
                      <i className="fa-solid fa-camera"></i>
                    </button>
                    <button 
                      className={`p-2 rounded-full transition-colors ${
                        messageInputType === 'file' 
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                          : 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                      }`}
                      onClick={() => setMessageInputType('file')}
                    >
                      <i className="fa-solid fa-file"></i>
                    </button>
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    {messageInputType === 'text' && (
                      <input
                        type="text"
                        placeholder="输入消息..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                    )}
                    
                    {messageInputType === 'image' && (
                      <div className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-[#B8C6D8] flex items-center justify-center cursor-pointer hover:border-[#4A5F8B] transition-all">
                        <i className="fa-solid fa-plus mr-2"></i>
                        <span>选择图片上传</span>
                        <input type="file" accept="image/*" className="hidden" />
                      </div>
                    )}
                    
                    {messageInputType === 'photoLink' && (
                      <div className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-[#B8C6D8] flex items-center justify-center cursor-pointer hover:border-[#4A5F8B] transition-all">
                        <i className="fa-solid fa-camera mr-2"></i>
                        <span>从我的作品中选择</span>
                      </div>
                    )}
                    
                    {messageInputType === 'file' && (
                      <div className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-[#B8C6D8] flex items-center justify-center cursor-pointer hover:border-[#4A5F8B] transition-all">
                        <i className="fa-solid fa-file mr-2"></i>
                        <span>选择文件上传 (RAW/预设等)</span>
                        <input type="file" className="hidden" />
                      </div>
                    )}
                    
                    <button 
                      className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                        (messageInputType === 'text' && newMessage.trim()) || messageInputType !== 'text'
                          ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                          : 'bg-[#1E2532] text-[#B8C6D8] cursor-not-allowed'
                      }`}
                      onClick={handleSendMessage}
                      disabled={messageInputType === 'text' && !newMessage.trim()}
                    >
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* 移动端聊天窗口 */}
        {isMobileChatOpen && activeConversation && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-0 bg-[#2D3748] z-50 lg:hidden"
          >
            <div className="h-full flex flex-col">
              {/* 聊天窗口头部 */}
              <div className="p-4 border-b border-[#4A5F8B] flex items-center">
                  <button 
                    className="mr-3 text-[#B8C6D8] hover:text-[#F5F7FA]"
                    onClick={() => {
                      setIsMobileChatOpen(false);
                      setActiveConversation(null);
                      // 返回时也滚动到页面顶部
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      });
                    }}
                  >
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                
                {getActiveConversationInfo() && (
                  <>
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-[#4A5F8B] relative">
                      <img 
                        src={getActiveConversationInfo()?.userAvatar} 
                        alt={getActiveConversationInfo()?.userName} 
                        className="w-full h-full object-cover"
                      />
                      {getActiveConversationInfo()?.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#2D3748]"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#F5F7FA]">{getActiveConversationInfo()?.userName}</h3>
                      <p className="text-xs text-[#4A5F8B]">
                        {getActiveConversationInfo()?.isOnline ? '在线' : '离线'}
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* 聊天内容区域 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getCurrentConversationMessages(activeConversation).map(message => (
                  <div 
                    key={message.id}
                    className={`flex ${message.senderId === 'current' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.senderId === 'current' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 rounded-2xl ${
                        message.senderId === 'current' 
                          ? 'bg-[#4A5F8B] text-[#F5F7FA] rounded-br-none' 
                          : 'bg-[#1E2532] text-[#F5F7FA] rounded-bl-none'
                      }`}>
                        {message.contentType === 'text' && (
                          <p>{message.content}</p>
                        )}
                        
                        {message.contentType === 'image' && (
                          <div className="rounded-lg overflow-hidden">
                            <img 
                              src={message.fileInfo?.url || 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_4_3&prompt=photography%20sample%20image&sign=7af587cbcf15bddfacf61e10bf0ddf8f'} 
                              alt="图片消息" 
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        )}
                        
                        {message.contentType === 'photoLink' && message.photoInfo && (
                          <div className="bg-[#2D3748] rounded-lg p-2 border border-[#4A5F8B]">
                            <div className="flex items-center">
                              <div className="w-16 h-16 rounded-md overflow-hidden mr-2 flex-shrink-0">
                                <img 
                                  src={message.photoInfo.thumbnail} 
                                  alt={message.photoInfo.title} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-[#F5F7FA] truncate">{message.photoInfo.title}</h4>
                                <p className="text-xs text-[#B8C6D8] mt-1">点击查看作品详情</p>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {message.contentType === 'file' && message.fileInfo && (
                          <div className="flex items-center bg-[#2D3748] rounded-lg p-2 border border-[#4A5F8B]">
                            <div className="w-8 h-8 rounded-full bg-[#4A5F8B] flex items-center justify-center mr-2 text-[#F5F7FA]">
                              <i className="fa-solid fa-file"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-[#F5F7FA] truncate">{message.fileInfo.name}</h4>
                              <p className="text-xs text-[#B8C6D8] mt-1">{formatFileSize(message.fileInfo.size)}</p>
                            </div>
                            <button className="ml-2 text-[#4A5F8B] hover:text-[#F5F7FA]">
                              <i className="fa-solid fa-download"></i>
                            </button>
                          </div>
                        )}
                        
                        <div className={`flex items-center justify-end mt-1 text-xs ${
                          message.senderId === 'current' ? 'text-[#F5F7FA]/70' : 'text-[#B8C6D8]'
                        }`}>
                          <span>{message.timestamp}</span>
                          {message.senderId === 'current' && (
                            <i className={`fa-solid ml-1 ${message.isRead ? 'fa-check-double text-green-500' : 'fa-check'}`}></i>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {message.senderId !== 'current' && (
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-[#4A5F8B] order-0 mt-1">
                        <img 
                          src={getActiveConversationInfo()?.userAvatar} 
                          alt={getActiveConversationInfo()?.userName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
              
              {/* 输入区域 */}
              <div className="p-4 border-t border-[#4A5F8B]">
                <div className="flex items-center space-x-2 mb-2">
                  <button 
                    className={`p-2 rounded-full transition-colors ${
                      messageInputType === 'text' 
                        ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                        : 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                    }`}
                    onClick={() => setMessageInputType('text')}
                  >
                    <i className="fa-solid fa-keyboard"></i>
                  </button>
                  <button 
                    className={`p-2 rounded-full transition-colors ${
                      messageInputType === 'image' 
                        ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                        : 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                    }`}
                    onClick={() => setMessageInputType('image')}
                  >
                    <i className="fa-solid fa-image"></i>
                  </button>
                  <button 
                    className={`p-2 rounded-full transition-colors ${
                      messageInputType === 'photoLink' 
                        ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                        : 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                    }`}
                    onClick={() => setMessageInputType('photoLink')}
                  >
                    <i className="fa-solid fa-camera"></i>
                  </button>
                  <button 
                    className={`p-2 rounded-full transition-colors ${
                      messageInputType === 'file' 
                        ? 'bg-[#4A5F8B] text-[#F5F7FA]' 
                        : 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]'
                    }`}
                    onClick={() => setMessageInputType('file')}
                  >
                    <i className="fa-solid fa-file"></i>
                  </button>
                </div>
                
                <div className="flex items-end space-x-2">
                  {messageInputType === 'text' && (
                    <input
                      type="text"
                      placeholder="输入消息..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A5F8B] transition-all"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                  )}
                  
                  {messageInputType === 'image' && (
                    <div className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-[#B8C6D8] flex items-center justify-center cursor-pointer hover:border-[#4A5F8B] transition-all">
                      <i className="fa-solid fa-plus mr-2"></i>
                      <span>选择图片上传</span>
                      <input type="file" accept="image/*" className="hidden" />
                    </div>
                  )}
                  
                  {messageInputType === 'photoLink' && (
                    <div className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-[#B8C6D8] flex items-center justify-center cursor-pointer hover:border-[#4A5F8B] transition-all">
                      <i className="fa-solid fa-camera mr-2"></i>
                      <span>从我的作品中选择</span>
                    </div>
                  )}
                  
                  {messageInputType === 'file' && (
                    <div className="flex-1 px-4 py-3 bg-[#1E2532] border border-[#4A5F8B] rounded-lg text-[#B8C6D8] flex items-center justify-center cursor-pointer hover:border-[#4A5F8B] transition-all">
                      <i className="fa-solid fa-file mr-2"></i>
                      <span>选择文件上传 (RAW/预设等)</span>
                      <input type="file" className="hidden" />
                    </div>
                  )}
                  
                  <button 
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      (messageInputType === 'text' && newMessage.trim()) || messageInputType !== 'text'
                        ? 'bg-[#4A5F8B] text-[#F5F7FA]'
                        : 'bg-[#1E2532] text-[#B8C6D8] cursor-not-allowed'
                    }`}
                    onClick={handleSendMessage}
                    disabled={messageInputType === 'text' && !newMessage.trim()}
                  >
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* 移动端优化：底部导航栏 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#2D3748] border-t border-[#4A5F8B] z-40">
          <div className="grid grid-cols-5 py-2">
            <Link 
              to="/" 
              className="flex flex-col items-center justify-center py-1 text-[#B8C6D8]"
            >
              <i className="fa-solid fa-home text-lg mb-1"></i>
              <span className="text-xs">首页</span>
            </Link>
            <Link 
              to="/community" 
              className="flex flex-col items-center justify-center py-1 text-[#B8C6D8]"
            >
              <i className="fa-solid fa-users text-lg mb-1"></i>
              <span className="text-xs">社区</span>
            </Link>
            <Link 
              to="/profile-center" 
              className="flex flex-col items-center justify-center py-1 text-[#4A5F8B]"
            >
              <i className="fa-solid fa-user text-lg mb-1"></i>
              <span className="text-xs">我的</span>
            </Link>
            <Link 
              to="/resources" 
              className="flex flex-col items-center justify-center py-1 text-[#B8C6D8]"
            >
              <i className="fa-solid fa-chart-line text-lg mb-1"></i>
              <span className="text-xs">资源</span>
            </Link>
            <Link 
              to="/profile-center/notifications" 
              className="flex flex-col items-center justify-center py-1 text-[#4A5F8B] relative"
            >
              <i className="fa-solid fa-bell text-lg mb-1"></i>
              {(unreadCount + unreadMessageCount) > 0 && (
                <span className="absolute top-1 right-[20%] w-4 h-4 rounded-full bg-[#4A5F8B] text-[#F5F7FA] text-[10px] flex items-center justify-center">
                  {unreadCount + unreadMessageCount}
                </span>
              )}
              <span className="text-xs">消息</span>
            </Link>
          </div>
        </div>
      </motion.div>
      
      {/* 实时通知提示弹窗 */}
      {showNotificationToast && newNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-[#2D3748] text-[#F5F7FA] px-4 py-3 rounded-lg shadow-lg z-50 border border-[#4A5F8B] max-w-sm flex items-start"
        >
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-[#4A5F8B] flex-shrink-0">
            <img 
              src={newNotification.sender?.avatar || ''} 
              alt={newNotification.sender?.name || ''} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm">{newNotification.title}</h4>
            <p className="text-xs text-[#B8C6D8] mt-1 line-clamp-2">{newNotification.message}</p>
            <div className="flex space-x-2 mt-2">
              {newNotification.actions?.map((action, index) => (
                <button
                  key={index}
                  className="px-2 py-1 text-xs rounded-lg font-medium transition-colors bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] border border-[#4A5F8B]"
                  onClick={() => {
                    handleNotificationAction(newNotification, action.type);
                    setShowNotificationToast(false);
                  }}
                >
                  {action.label}
                </button>
              ))}
              <button
                className="px-2 py-1 text-xs rounded-lg font-medium transition-colors bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA] border border-[#4A5F8B]"
                onClick={() => setShowNotificationToast(false)}
              >
                关闭
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfileNotifications;