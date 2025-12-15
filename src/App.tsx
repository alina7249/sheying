import React, { useState, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from './contexts/authContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/adminAuthContext';
import { Toaster } from 'sonner';
import { Header } from "@/components/Header";
import { useThemeStore } from '@/store/themeStore';
// 使用React.lazy实现组件懒加载
const Home = React.lazy(() => import("@/pages/Home"));
const PhotoDetail = React.lazy(() => import("@/pages/PhotoDetail"));
const Login = React.lazy(() => import("@/pages/Login"));
const Register = React.lazy(() => import("@/pages/Register"));
  const Profile = React.lazy(() => import("@/pages/Profile"));
  const ProfileCenter = React.lazy(() => import("@/pages/ProfileCenter"));
const ProfileMaterials = React.lazy(() => import("@/pages/ProfileMaterials"));
const ProfileMembership = React.lazy(() => import("@/pages/ProfileMembership"));
const ProfileSettings = React.lazy(() => import("@/pages/ProfileSettings"));
const ProfileEvents = React.lazy(() => import("@/pages/ProfileEvents"));
const ProfileNotifications = React.lazy(() => import("@/pages/ProfileNotifications"));
const ProfileOrders = React.lazy(() => import("@/pages/ProfileOrders"));
const ProfileEditor = React.lazy(() => import("@/pages/ProfileEditor"));
const Community = React.lazy(() => import("@/pages/Community"));
const Resources = React.lazy(() => import("@/pages/Resources"));
const ProjectDetail = React.lazy(() => import("@/pages/ProjectDetail"));
const SearchResult = React.lazy(() => import("@/pages/SearchResult"));
const EquipmentDatabase = React.lazy(() => import("@/pages/EquipmentDatabase"));
const EquipmentReview = React.lazy(() => import("@/pages/EquipmentReview"));
// 修复Empty组件的导入路径，确保与项目结构一致
const Empty = React.lazy(() => import('@/components/Empty'));
const EquipmentTrade = React.lazy(() => import("@/pages/EquipmentTrade"));
const OnlineCourses = React.lazy(() => import("@/pages/OnlineCourses"));
const CourseDetail = React.lazy(() => import("@/pages/CourseDetail"));
const TutorialDetail = React.lazy(() => import("@/pages/TutorialDetail"));
const TutorialResources = React.lazy(() => import("@/pages/TutorialResources"));
const OfflineEvents = React.lazy(() => import("@/pages/OfflineEvents"));
const PhotographyContests = React.lazy(() => import("@/pages/PhotographyContests"));
const PhotographerOrders = React.lazy(() => import("@/pages/PhotographerOrders"));
const OneOnOneCoaching = React.lazy(() => import("@/pages/OneOnOneCoaching"));
const PhotoComments = React.lazy(() => import("@/pages/PhotoComments"));
const PhotoLocations = React.lazy(() => import("@/pages/PhotoLocations"));
const BatchManagePhotos = React.lazy(() => import("@/pages/BatchManagePhotos"));
const EquipmentLibrary = React.lazy(() => import("@/pages/EquipmentLibrary"));
const EventDetail = React.lazy(() => import("@/pages/EventDetail"));
const ContestDetail = React.lazy(() => import("@/pages/ContestDetail"));
const EventsAndContests = React.lazy(() => import("@/pages/EventsAndContests"));
const PostDetail = React.lazy(() => import("@/pages/PostDetail"));
// 导入AIChat组件
const AIChat = React.lazy(() => import("@/pages/AIChat"));
// 导入小组相关组件
const GroupsList = React.lazy(() => import("@/pages/GroupsList"));
const GroupDetail = React.lazy(() => import("@/pages/GroupDetail"));
// 使用React.lazy将Footer设置为异步加载
const Footer = React.lazy(() => import("@/components/Footer.tsx"));
// 导入后台管理系统组件
const Layout = React.lazy(() => import("@/components/admin/Layout"));
const Dashboard = React.lazy(() => import("@/pages/admin/Dashboard"));
const UserManagement = React.lazy(() => import("@/pages/admin/UserManagement"));
const ContentManagement = React.lazy(() => import("@/pages/admin/ContentManagement"));
const GroupManagement = React.lazy(() => import("@/pages/admin/GroupManagement"));
const OrderManagement = React.lazy(() => import("@/pages/admin/OrderManagement"));
const Analytics = React.lazy(() => import("@/pages/admin/Analytics"));
const Settings = React.lazy(() => import("@/pages/admin/Settings"));

  // 后台管理系统认证守卫
  const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAdminAuth();
    
    // 如果未登录，重定向到登录页
    if (!isAuthenticated) {
      // 重定向到登录页，并指定登录成功后返回管理后台
      return <Navigate to="/login?redirect=/admin" replace />;
    }
    
    // 确保只有管理员可以访问后台，再次验证用户对象是否存在
    if (!user) {
      return <Navigate to="/login?redirect=/admin" replace />;
    }
    
    return <>{children}</>;
  };

export default function App() {
  const { theme } = useThemeStore();
  // 获取当前位置信息
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(true);
  
  // 监听路由变化，自动滚动到顶部
  useEffect(() => {
    // 滚动到页面顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // 平滑滚动效果
    });
    
    // 根据路由决定是否显示页脚
    const noFooterRoutes = ['/login', '/register'];
    setShowFooter(!noFooterRoutes.includes(location.pathname));
  }, [location]);
  
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Suspense fallback={
              <div className="container mx-auto px-4 py-8 h-80 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin"></div>
              </div>
            }>
                <Routes>
                  {/* 核心页面 */}
                  <Route path="/" element={<Home />} />
                   {/* 重定向runtime路径到对应页面 */}
                   <Route path="/runtime/" element={<Navigate to="/" replace />} />
                   <Route path="/runtime/login" element={<Navigate to="/login" replace />} />
                   <Route path="/runtime/register" element={<Navigate to="/register" replace />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  
                   {/* 个人中心相关 */}
                   <Route path="/profile-center" element={<ProfileCenter />} />
                  <Route path="/profile-center/batch-manage" element={<BatchManagePhotos />} />
                  <Route path="/profile-center/photo-locations" element={<PhotoLocations />} />
                  <Route path="/profile-center/materials" element={<ProfileMaterials />} />
                  <Route path="/profile-center/membership" element={<ProfileMembership />} />
                  <Route path="/profile-center/settings" element={<ProfileSettings />} />
                  <Route path="/profile-center/notifications" element={<ProfileNotifications />} />
                  <Route path="/profile-center/events" element={<ProfileEvents />} />
                  <Route path="/profile-center/orders" element={<ProfileOrders />} />
                  <Route path="/profile-center/editor" element={<ProfileEditor />} />
                  <Route path="/profile-center/contests" element={<PhotographyContests />} />
                  <Route path="/profile-center/equipment" element={<EquipmentLibrary />} />
                  
                   {/* 社区相关 */}
                  <Route path="/community" element={<Community />} />
                  <Route path="/groups" element={<GroupsList />} />
                  <Route path="/group/:id" element={<GroupDetail />} />
                  <Route path="/post/:id" element={<PostDetail />} />
                  
                  {/* 资源相关 */}
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/project/:id" element={<ProjectDetail />} />
                  
                  {/* 器材相关 */}
                  <Route path="/equipment-database" element={<EquipmentDatabase />} />
                  <Route path="/equipment-review" element={<EquipmentReview />} />
                  <Route path="/equipment-trade" element={<EquipmentTrade />} />
                  <Route path="/equipment-detail/:id" element={<EquipmentTrade />} />
                  
                  {/* 课程相关 */}
                  <Route path="/online-courses" element={<OnlineCourses />} />
                  <Route path="/course/:id" element={<CourseDetail />} />
                  <Route path="/tutorial/:id" element={<TutorialDetail />} />
                  <Route path="/tutorial-resources" element={<TutorialResources />} />
                  
                  {/* 活动与赛事 */}
                  <Route path="/offline-events" element={<OfflineEvents />} />
                  <Route path="/events-and-contests" element={<EventsAndContests />} />
                  <Route path="/event/:id" element={<EventDetail />} />
                  <Route path="/photography-contests" element={<PhotographyContests />} />
                  <Route path="/contest/:id" element={<ContestDetail />} />
                  {/* AI助手 */}
                  <Route path="/ai-chat" element={<AIChat />} />
                  
                  {/* 摄影服务 */}
                  <Route path="/photographer-orders" element={<PhotographerOrders />} />
                  <Route path="/one-on-one-coaching" element={<OneOnOneCoaching />} />
                  
                  {/* 搜索结果 */}
                  <Route path="/search" element={<SearchResult />} />
                  
                  {/* 照片详情 */}
                  <Route path="/photo/:id" element={<PhotoDetail />} />
                  <Route path="/photo-comments/:id" element={<PhotoComments />} />
                  
                  {/* 后台管理系统 */}
                  <Route path="/admin" element={
                    <AdminAuthGuard>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/users" element={
                    <AdminAuthGuard>
                      <Layout>
                        <UserManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/users/pending" element={
                    <AdminAuthGuard>
                      <Layout>
                        <UserManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/users/banned" element={
                    <AdminAuthGuard>
                      <Layout>
                        <UserManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/content" element={
                    <AdminAuthGuard>
                      <Layout>
                        <ContentManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/content/photos" element={
                    <AdminAuthGuard>
                      <Layout>
                        <ContentManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/content/posts" element={
                    <AdminAuthGuard>
                      <Layout>
                        <ContentManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/content/comments" element={
                    <AdminAuthGuard>
                      <Layout>
                        <ContentManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/groups" element={
                    <AdminAuthGuard>
                      <Layout>
                        <GroupManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/orders" element={
                    <AdminAuthGuard>
                      <Layout>
                        <OrderManagement />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/analytics" element={
                    <AdminAuthGuard>
                      <Layout>
                        <Analytics />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  <Route path="/admin/settings" element={
                    <AdminAuthGuard>
                      <Layout>
                        <Settings />
                      </Layout>
                    </AdminAuthGuard>
                  } />
                  {/* 404页面 */}
                  <Route path="*" element={<div className="text-center text-xl py-10">页面未找到</div>} />
              </Routes>
            </Suspense>
          </main>
          {showFooter && (
            <Suspense fallback={
              <div className={`w-full py-10 mt-12 ${theme === 'dark' ? 'bg-[#1E2532]' : 'bg-gray-100'}`}>
                <div className="container mx-auto px-4 text-center text-[#B8C6D8]">
                  <div className="w-16 h-16 border-4 border-[#4A5F8B] border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-4">加载页脚中...</p>
                </div>
              </div>
            }>
              <Footer />
            </Suspense>
          )}
        </div>
        <Toaster />
      </AdminAuthProvider>
    </AuthProvider>
  );
}