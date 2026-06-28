import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Profile from '../pages/Profile.vue';
import EquipmentHub from '../pages/EquipmentHub.vue';

// 需要登录才能访问的路由
const authRoutes = ['/publish', '/profile-settings', '/messages', '/notifications', '/my-collections', '/change-password'];

// 检查是否已登录
const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: () => import('../pages/Register.vue') },
  { path: '/profile/:id?', name: 'Profile', component: Profile },
  { path: '/photo-detail/:id', name: 'PhotoDetail', component: () => import('../pages/PhotoDetail.vue') },

  { path: '/equipment', redirect: '/equipment-hub' },
  { path: '/equipment-hub', name: 'EquipmentHub', component: EquipmentHub },
  { path: '/ai-chat', redirect: '/aichat' },
  { path: '/events-and-contests', redirect: '/events-contests' },
  { path: '/equipment-database', name: 'EquipmentDatabase', component: () => import('../pages/EquipmentDatabase.vue') },
  { path: '/equipment-library', name: 'EquipmentLibrary', component: () => import('../pages/EquipmentLibrary.vue') },
  { path: '/equipment-review/:id', name: 'EquipmentReview', component: () => import('../pages/EquipmentReview.vue') },
  { path: '/equipment-trade', name: 'EquipmentTrade', component: () => import('../pages/EquipmentTrade.vue') },

  { path: '/aichat', name: 'AIChat', component: () => import('../pages/AIChat.vue') },
  { path: '/community', name: 'Community', component: () => import('../pages/Community.vue') },
  { path: '/publish', name: 'Publish', component: () => import('../pages/Publish.vue') },
  { path: '/groups-list', name: 'GroupsList', component: () => import('../pages/GroupsList.vue') },
  { path: '/group-detail/:id', name: 'GroupDetail', component: () => import('../pages/GroupDetail.vue') },
  { path: '/events-contests', name: 'EventsAndContests', component: () => import('../pages/EventsAndContests.vue') },
  { path: '/photography-contests', name: 'PhotographyContests', component: () => import('../pages/PhotographyContests.vue') },
  { path: '/contest-detail/:id', name: 'ContestDetail', component: () => import('../pages/ContestDetail.vue') },
  { path: '/event-detail/:id', name: 'EventDetail', component: () => import('../pages/EventDetail.vue') },
  { path: '/offline-events', name: 'OfflineEvents', component: () => import('../pages/OfflineEvents.vue') },
  { path: '/online-courses', name: 'OnlineCourses', component: () => import('../pages/OnlineCourses.vue') },
  { path: '/course-detail/:id', name: 'CourseDetail', component: () => import('../pages/CourseDetail.vue') },
  { path: '/tutorial-detail/:id', name: 'TutorialDetail', component: () => import('../pages/TutorialDetail.vue') },
  { path: '/tutorial-resources', name: 'TutorialResources', component: () => import('../pages/TutorialResources.vue') },
  { path: '/resources', name: 'Resources', component: () => import('../pages/Resources.vue') },
  { path: '/project-detail/:id', name: 'ProjectDetail', component: () => import('../pages/ProjectDetail.vue') },
  { path: '/post-detail/:id', name: 'PostDetail', component: () => import('../pages/PostDetail.vue') },
  { path: '/photo-comments/:id', name: 'PhotoComments', component: () => import('../pages/PhotoComments.vue') },
  { path: '/photo-locations', name: 'PhotoLocations', component: () => import('../pages/PhotoLocations.vue') },
  { path: '/batch-manage-photos', name: 'BatchManagePhotos', component: () => import('../pages/BatchManagePhotos.vue') },
  { path: '/profile-settings', name: 'ProfileSettings', component: () => import('../pages/ProfileSettings.vue') },
  { path: '/messages', name: 'Messages', component: () => import('../pages/Messages.vue') },
  { path: '/notifications', name: 'Notifications', component: () => import('../pages/Notifications.vue') },
  { path: '/profile-benefits', name: 'ProfileBenefits', component: () => import('../pages/ProfileBenefits.vue') },
  { path: '/membership', name: 'Membership', component: () => import('../pages/Membership.vue') },
  { path: '/search-result', name: 'SearchResult', component: () => import('../pages/SearchResult.vue') },

  { path: '/admin/dashboard', name: 'AdminDashboard', component: () => import('../pages/admin/Dashboard.vue') },
  { path: '/admin/users', name: 'UserManagement', component: () => import('../pages/admin/UserManagement.vue') },
  { path: '/admin/groups', name: 'GroupManagement', component: () => import('../pages/admin/GroupManagement.vue') },
  { path: '/admin/content', name: 'ContentManagement', component: () => import('../pages/admin/ContentManagement.vue') },
  { path: '/admin/orders', name: 'OrderManagement', component: () => import('../pages/admin/OrderManagement.vue') },
  { path: '/admin/analytics', name: 'Analytics', component: () => import('../pages/admin/Analytics.vue') },
  { path: '/admin/settings', name: 'AdminSettings', component: () => import('../pages/admin/Settings.vue') },
  { path: '/admin/reports', name: 'ReportManagement', component: () => import('../pages/admin/ReportManagement.vue') },

  { path: '/my-collections', name: 'MyCollections', component: () => import('../pages/MyCollections.vue') },
  { path: '/change-password', name: 'ChangePassword', component: () => import('../pages/ChangePassword.vue') },
  { path: '/user-agreement', name: 'UserAgreement', component: () => import('../pages/UserAgreement.vue') },
  { path: '/privacy-policy', name: 'PrivacyPolicy', component: () => import('../pages/PrivacyPolicy.vue') },

  // 404 路由
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../pages/NotFound.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 检查是否需要登录
  if (authRoutes.includes(to.path) && !isAuthenticated()) {
    // 未登录，跳转到登录页
    next({ path: '/login', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;