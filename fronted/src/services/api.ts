import axios from 'axios';
import { toast } from 'vue-sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8121',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('登录已过期，请重新登录');
      return Promise.reject({ message: '登录已过期，请重新登录' });
    }
    
    let errorMessage = '网络错误，请稍后重试';
    
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误';
          break;
        case 403:
          errorMessage = data?.message || '没有权限访问该资源';
          break;
        case 404:
          errorMessage = data?.message || '请求的资源不存在';
          break;
        case 500:
          errorMessage = data?.message || '服务器繁忙，请稍后重试';
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查网络';
    } else {
      errorMessage = error.message || '请求失败';
    }
    
    // 500 错误统一 toast 提示
    if (error.response?.status === 500) {
      toast.error('服务器繁忙，请稍后重试');
    }
    
    return Promise.reject({ message: errorMessage, ...error.response?.data });
  }
);

export interface PostQueryRequest {
  current: number;
  pageSize: number;
  searchText?: string;
  userId?: number;
  tags?: string[];
}

export interface CommentQueryRequest {
  current: number;
  pageSize: number;
  postId?: number;
  userId?: number;
}

export interface CommentAddRequest {
  postId: number;
  content: string;
}

export interface PostAddRequest {
  title: string;
  content: string;
  tags: string[];
  imageUrl: string;
  camera?: string;
  lens?: string;
  aperture?: string;
  shutter?: string;
  iso?: string;
}

export const login = async (userAccount: string, userPassword: string) => {
  return api.post('/api/user/login', { userAccount, userPassword });
};

export const register = async (userAccount: string, userPassword: string, checkPassword: string, userName: string) => {
  return api.post('/api/user/register', { userAccount, userPassword, checkPassword, userName });
};

export const getCurrentUser = async () => {
  return api.get('/api/user/get/login');
};

export const getUserVOById = async (id: number) => {
  return api.get(`/api/user/get/vo?id=${id}`);
};

export const getPostList = async (queryRequest: PostQueryRequest) => {
  return api.post('/api/post/list/page/vo', queryRequest);
};

export const getPostDetail = async (id: number) => {
  return api.get(`/api/post/get/vo?id=${id}`);
};

export const searchPosts = async (searchText: string, current: number, pageSize: number, sortField?: string, sortOrder?: string) => {
  const params: any = { searchText, current, pageSize };
  if (sortField) params.sortField = sortField;
  if (sortOrder) params.sortOrder = sortOrder;
  return api.get('/api/post/search', { params });
};

export const addPost = async (post: PostAddRequest) => {
  return api.post('/api/post/add', post);
};

export const thumbPost = async (postId: number) => {
  return api.post('/api/post_thumb/', { postId });
};

export const favourPost = async (postId: number) => {
  return api.post('/api/post_favour/', { postId });
};

export const getMyFavourPosts = async (queryRequest: PostQueryRequest) => {
  return api.post('/api/post_favour/my/list/page', queryRequest);
};

export const getCommentList = async (queryRequest: CommentQueryRequest) => {
  return api.post('/api/comment/list/page/vo', queryRequest);
};

export const addComment = async (comment: CommentAddRequest) => {
  return api.post('/api/comment/add', comment);
};

export const deleteComment = async (id: number) => {
  return api.post('/api/comment/delete', { id });
};

export const doFollow = async (followeeId: number) => {
  return api.post('/api/follow/do', { followeeId });
};

export const checkFollow = async (followeeId: number) => {
  return api.get(`/api/follow/check?followeeId=${followeeId}`);
};

export const getMyFollowers = async (current: number, pageSize: number) => {
  return api.get('/api/follow/my/followers', {
    params: { current, pageSize }
  });
};

export const getMyFollowing = async (current: number, pageSize: number) => {
  return api.get('/api/follow/my/following', {
    params: { current, pageSize }
  });
};

export const getUserFollowStats = async (userId: number) => {
  return api.get('/api/follow/stats', {
    params: { userId }
  });
};

export const uploadFile = async (file: File, biz: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('biz', biz);
  return api.post('/api/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getHotTags = async () => {
  return api.get('/api/post/tags/hot');
};

// ==================== 消息相关 ====================
export interface MessageAddRequest {
  toUserId: number;
  content: string;
}

export const sendMessage = async (req: MessageAddRequest) => {
  return api.post('/api/message/send', req);
};

export const getConversations = async () => {
  return api.get('/api/message/conversations');
};

export const getConversationMessages = async (targetUserId: number) => {
  return api.get(`/api/message/conversation/${targetUserId}`);
};

export const markMessageRead = async (fromUserId: number, toUserId: number) => {
  return api.put('/api/message/read', { fromUserId, toUserId });
};

export const getUnreadMessageCount = async () => {
  return api.get('/api/message/unread-count');
};

// ==================== 通知相关 ====================
export const getNotifications = async (current: number, pageSize: number, type?: string, isRead?: number) => {
  return api.get('/api/notification/list', { params: { current, pageSize, type, isRead } });
};

export const markNotificationRead = async (id: number) => {
  return api.post('/api/notification/read', { id });
};

export const getUnreadNotificationCount = async () => {
  return api.get('/api/notification/unread-count');
};

export const markAllNotificationsRead = async () => {
  return api.post('/api/notification/read-all');
};

// ==================== 器材相关 ====================
export const getEquipmentList = async (current: number, pageSize: number, brand?: string, category?: string, name?: string) => {
  return api.get('/api/equipment/list', { params: { current, pageSize, brand, category, name } });
};

export const getEquipmentDetail = async (id: number) => {
  return api.get(`/api/equipment/get/${id}`);
};

export const addEquipment = async (data: any) => {
  return api.post('/api/equipment/add', data);
};

export const getEquipmentReviews = async (equipmentId: number, current: number, pageSize: number) => {
  return api.get(`/api/equipment-review/list/${equipmentId}`, { params: { current, pageSize } });
};

export const addEquipmentReview = async (data: { equipmentId: number; title: string; content: string; rating: number }) => {
  return api.post('/api/equipment-review/add', data);
};

// ==================== 活动相关 ====================
export const getEventList = async (current: number, pageSize: number, status?: string) => {
  return api.get('/api/event/list', { params: { current, pageSize, status } });
};

export const getEventDetail = async (id: number) => {
  return api.get(`/api/event/get/${id}`);
};

export const joinEvent = async (eventId: number) => {
  return api.post(`/api/event/register/${eventId}`);
};

export const cancelEventJoin = async (eventId: number) => {
  return api.post(`/api/event/cancel/${eventId}`);
};

export const getMyRegistrations = async () => {
  return api.get('/api/event/my-registrations');
};

// ==================== AI 聊天 ====================
export const chatWithAI = async (message: string, sessionId?: string) => {
  return api.post('/api/ai/chat', { message, sessionId });
};

export const getAIHistory = async (sessionId: string) => {
  return api.get('/api/ai/history', { params: { sessionId } });
};

// ==================== 用户资料 ====================
export const updateUserProfile = async (data: { userName?: string; userAvatar?: string; userProfile?: string }) => {
  return api.put('/api/profile/update', data);
};

export const getMemberInfo = async () => {
  return api.get('/api/membership/info');
};

export const upgradeMember = async (level: number) => {
  return api.post('/api/member/upgrade', null, { params: { level } });
};

// ==================== 热门作品 ====================
export const getHotPosts = async (current: number = 1, pageSize: number = 10) => {
  return api.get('/api/post/hot', { params: { current, pageSize } });
};

// ==================== 用户列表（管理后台） ====================
export const getUserListPage = async (current: number, pageSize: number, userName?: string) => {
  return api.get('/api/user/list/page', { params: { current, pageSize, userName } });
};

export const banUser = async (userId: number) => {
  return api.post('/api/user/ban', { userId });
};
export const unbanUser = async (userId: number) => {
  return api.post('/api/user/unban', { userId });
};

// ==================== 会员套餐 ====================
export const getMembershipPlans = async () => {
  return api.get('/api/membership/plans');
};

// ==================== 订单相关 ====================
export const createOrder = async (planId: number) => {
  return api.post('/api/order/create', { planId });
};

export const mockPay = async (orderId: number) => {
  return api.post('/api/order/pay/mock', { orderId });
};

export const getMyOrders = async (current: number, pageSize: number) => {
  return api.get('/api/order/my/list', { params: { current, pageSize } });
};

export default api;

// ==================== 举报系统 ====================
export const submitReport = async (data: { targetId: number; targetType: string; reason: string; description?: string }) => {
  return api.post('/api/report/add', data);
};

export const getReportList = async (current: number, pageSize: number, status?: string) => {
  return api.get('/api/report/list/page', { params: { current, pageSize, status } });
};

export const handleReport = async (reportId: number, status: string, handleNote?: string) => {
  return api.post('/api/report/handle', { reportId, status, handleNote });
};

export const auditPost = async (postId: number, auditStatus: string, auditNote?: string) => {
  return api.post('/api/post/audit', { postId, auditStatus, auditNote });
};

// ==================== 收藏夹相关 ====================
export const createCollection = async (data: { title: string; description?: string }) => {
  return api.post('/api/collection/add', data);
};

export const getCollections = async () => {
  return api.get('/api/collection/list');
};

export const getCollectionDetail = async (id: number) => {
  return api.get('/api/collection/get/vo', { params: { id } });
};

export const addPostToCollection = async (collectionId: number, postId: number) => {
  return api.post('/api/collection/add-post', { collectionId, postId });
};

export const removePostFromCollection = async (collectionId: number, postId: number) => {
  return api.post('/api/collection/delete-post', { collectionId, postId });
};

export const deleteCollection = async (id: number) => {
  return api.post('/api/collection/delete', { id });
};

// ==================== 修改密码 ====================
export const changePassword = async (oldPassword: string, newPassword: string) => {
  return api.post('/api/user/change-password', { oldPassword, newPassword });
};

export default api;
