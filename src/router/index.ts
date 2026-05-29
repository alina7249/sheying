import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Profile from '../pages/Profile.vue';
import EquipmentHub from '../pages/EquipmentHub.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: () => import('../pages/Register.vue') },
  { path: '/profile/:id?', name: 'Profile', component: Profile },
  { path: '/photo-detail/:id', name: 'PhotoDetail', component: () => import('../pages/PhotoDetail.vue') },

  { path: '/equipment-hub', name: 'EquipmentHub', component: EquipmentHub },
  { path: '/equipment-database', name: 'EquipmentDatabase', component: () => import('../pages/EquipmentDatabase.vue') },
  { path: '/equipment-library', name: 'EquipmentLibrary', component: () => import('../pages/EquipmentLibrary.vue') },
  { path: '/equipment-review/:id', name: 'EquipmentReview', component: () => import('../pages/EquipmentReview.vue') },
  { path: '/equipment-trade', name: 'EquipmentTrade', component: () => import('../pages/EquipmentTrade.vue') },

  { path: '/aichat', name: 'AIChat', component: () => import('../pages/AIChat.vue') },
  { path: '/community', name: 'Community', component: () => import('../pages/Community.vue') },
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
  { path: '/profile-benefits', name: 'ProfileBenefits', component: () => import('../pages/ProfileBenefits.vue') },
  { path: '/search-result', name: 'SearchResult', component: () => import('../pages/SearchResult.vue') },

  { path: '/admin/dashboard', name: 'AdminDashboard', component: () => import('../pages/admin/Dashboard.vue') },
  { path: '/admin/users', name: 'UserManagement', component: () => import('../pages/admin/UserManagement.vue') },
  { path: '/admin/groups', name: 'GroupManagement', component: () => import('../pages/admin/GroupManagement.vue') },
  { path: '/admin/content', name: 'ContentManagement', component: () => import('../pages/admin/ContentManagement.vue') },
  { path: '/admin/orders', name: 'OrderManagement', component: () => import('../pages/admin/OrderManagement.vue') },
  { path: '/admin/analytics', name: 'Analytics', component: () => import('../pages/admin/Analytics.vue') },
  { path: '/admin/settings', name: 'AdminSettings', component: () => import('../pages/admin/Settings.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;