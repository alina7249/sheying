import axios from 'axios';

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
          errorMessage = data?.message || '服务器内部错误';
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查网络';
    } else {
      errorMessage = error.message || '请求失败';
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

export const searchPosts = async (searchText: string, current: number, pageSize: number) => {
  return api.get('/api/post/search', {
    params: { searchText, current, pageSize }
  });
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

export default api;
