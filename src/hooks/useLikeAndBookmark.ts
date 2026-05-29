import { ref, watch, onMounted, onUnmounted } from 'vue';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';

export const useLikeAndBookmark = (postId: string, initialLikes: number, initialCollections: number) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated;
  const user = authStore.user;

  const isLiked = ref(false);
  const isBookmarked = ref(false);
  const likeCount = ref(initialLikes);
  const collectionCount = ref(initialCollections);

  const loadState = () => {
    if (isAuthenticated && user) {
      const savedLikes = localStorage.getItem(`user_likes_${user.id}`);
      if (savedLikes) {
        const likedPosts = JSON.parse(savedLikes);
        isLiked.value = likedPosts.includes(postId);
        likeCount.value = isLiked.value ? initialLikes + 1 : initialLikes;
      }

      const savedBookmarks = localStorage.getItem(`user_bookmarks_${user.id}`);
      if (savedBookmarks) {
        const bookmarkedPosts = JSON.parse(savedBookmarks);
        isBookmarked.value = bookmarkedPosts.includes(postId);
        collectionCount.value = isBookmarked.value ? initialCollections + 1 : initialCollections;
      }
    }
  };

  const handleStorageChange = (e: StorageEvent) => {
    if (isAuthenticated && user) {
      if (e.key === `user_likes_${user.id}` && e.newValue) {
        const likedPosts = JSON.parse(e.newValue);
        const newLikedState = likedPosts.includes(postId);
        if (newLikedState !== isLiked.value) {
          isLiked.value = newLikedState;
          likeCount.value = newLikedState ? likeCount.value + 1 : likeCount.value - 1;
        }
      }

      if (e.key === `user_bookmarks_${user.id}` && e.newValue) {
        const bookmarkedPosts = JSON.parse(e.newValue);
        const newBookmarkState = bookmarkedPosts.includes(postId);
        if (newBookmarkState !== isBookmarked.value) {
          isBookmarked.value = newBookmarkState;
          collectionCount.value = newBookmarkState ? collectionCount.value + 1 : collectionCount.value - 1;
        }
      }
    }
  };

  onMounted(() => {
    loadState();
    window.addEventListener('storage', handleStorageChange);
  });

  onUnmounted(() => {
    window.removeEventListener('storage', handleStorageChange);
  });

  const handleLike = () => {
    if (!isAuthenticated) {
      toast.info('请先登录后再点赞');
      return;
    }

    const newLikedState = !isLiked.value;
    isLiked.value = newLikedState;
    likeCount.value = newLikedState ? likeCount.value + 1 : likeCount.value - 1;

    if (user) {
      const savedLikes = localStorage.getItem(`user_likes_${user.id}`);
      const likedPosts = savedLikes ? JSON.parse(savedLikes) : [];

      if (newLikedState) {
        likedPosts.push(postId);
      } else {
        const index = likedPosts.indexOf(postId);
        if (index > -1) likedPosts.splice(index, 1);
      }

      localStorage.setItem(`user_likes_${user.id}`, JSON.stringify(likedPosts));

      const event = new StorageEvent('storage', {
        key: `user_likes_${user.id}`,
        newValue: JSON.stringify(likedPosts),
        oldValue: savedLikes,
        storageArea: localStorage,
        url: window.location.href
      });

      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: event }));
    }

    toast.success(newLikedState ? '点赞成功' : '取消点赞');
  };

  const handleBookmark = () => {
    if (!isAuthenticated) {
      toast.info('请先登录后再收藏');
      return;
    }

    const newBookmarkState = !isBookmarked.value;
    isBookmarked.value = newBookmarkState;
    collectionCount.value = newBookmarkState ? collectionCount.value + 1 : collectionCount.value - 1;

    if (user) {
      const savedBookmarks = localStorage.getItem(`user_bookmarks_${user.id}`);
      const bookmarkedPosts = savedBookmarks ? JSON.parse(savedBookmarks) : [];

      if (newBookmarkState) {
        bookmarkedPosts.push(postId);
      } else {
        const index = bookmarkedPosts.indexOf(postId);
        if (index > -1) bookmarkedPosts.splice(index, 1);
      }

      localStorage.setItem(`user_bookmarks_${user.id}`, JSON.stringify(bookmarkedPosts));

      const event = new StorageEvent('storage', {
        key: `user_bookmarks_${user.id}`,
        newValue: JSON.stringify(bookmarkedPosts),
        oldValue: savedBookmarks,
        storageArea: localStorage,
        url: window.location.href
      });

      window.dispatchEvent(new CustomEvent('localStorageUpdated', { detail: event }));
    }

    toast.success(newBookmarkState ? '收藏成功' : '取消收藏');
  };

  return {
    isLiked,
    isBookmarked,
    likeCount,
    collectionCount,
    handleLike,
    handleBookmark
  };
};