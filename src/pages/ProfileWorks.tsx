// ProfileWorks.tsx 已被删除

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../contexts/authContext';

const ProfileWorks: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#1E2532] min-h-screen">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="w-16 h-16 bg-[#4A5F8B] rounded-full flex items-center justify-center text-[#F5F7FA] mb-4">
            <i className="fa-solid fa-user-lock text-2xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-[#F5F7FA] mb-2">请先登录</h2>
          <p className="text-[#B8C6D8] mb-6 max-w-md">登录后查看您的个人中心</p>
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
          <h1 className="text-3xl font-bold text-[#F5F7FA] mb-2">我的作品集</h1>
          <p className="text-[#B8C6D8] max-w-2xl mx-auto">
            此功能已被移除
          </p>
        </div>

        <div className="p-8 bg-[#2D3748] rounded-xl border border-[#4A5F8B] text-center mt-8">
          <div className="w-16 h-16 bg-[#1E2A3A] rounded-full flex items-center justify-center text-[#4A5F8B] mx-auto mb-4">
            <i className="fa-solid fa-image text-2xl"></i>
          </div>
          <h3 className="text-lg font-medium text-[#F5F7FA] mb-2">作品集功能已被移除</h3>
          <p className="text-[#B8C6D8] mb-6">
            您可以返回个人中心继续使用其他功能
          </p>
          <Link to="/profile-center" className="px-6 py-3 bg-[#4A5F8B] text-[#F5F7FA] rounded-lg font-medium hover:bg-[#6B7C93] transition-colors inline-flex items-center">
            <i className="fa-solid fa-arrow-left mr-2"></i>
            返回个人中心
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileWorks;