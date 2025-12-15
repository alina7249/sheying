import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import { toast } from 'sonner';

// 定义类型
interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: "owner" | "admin" | "member";
  joinDate: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  avatar: string;
  members: GroupMember[];
  posts: number;
  createdAt: string;
  isPublic: boolean;
  joined: boolean;
  tags: string[];
  ownerId?: string;
}

interface GroupCardProps {
  group: Group;
  onJoin?: (groupId: string) => void;
  onLeave?: (groupId: string) => void;
  onDelete?: (groupId: string) => void;
  canDelete?: boolean;
}

export const GroupCard: React.FC<GroupCardProps> = (
  {
    group,
    onJoin,
    onLeave,
    onDelete,
    canDelete = false
  }
) => {
  const { isAuthenticated } = useContext(AuthContext);

  const handleJoinLeave = () => {
    if (!isAuthenticated) {
      toast.info("请先登录后再操作");
      return;
    }

    if (group.joined) {
      if (window.confirm(`确定要退出"${group.name}"小组吗？`)) {
        if (onLeave) {
          onLeave(group.id);
        }
        toast.success(`已退出"${group.name}"小组`);
      }
    } else {
      if (onJoin) {
        onJoin(group.id);
      }
      toast.success(`已加入"${group.name}"小组`);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(group.id);
    }
  };

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow: "0 8px 24px rgba(74,95,139,0.3)",
        transition: { duration: 0.3 }
      }}
      style={{
        transformStyle: "preserve-3d",
        backgroundColor: "transparent"
      }}
      className="bg-[#2D3748] border border-[#4A5F8B] rounded-lg overflow-hidden shadow-sm"
    >
      {/* 小组封面 */}
      <div className="relative h-32">
        <Link to={`/group/${group.id}`} className="block w-full h-full">
          <img
            src={group.coverImage}
            alt={`${group.name} cover`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <div
              className="w-16 h-16 rounded-full border-2 border-[#2D3748] overflow-hidden shadow-md"
            >
              <img
                src={group.avatar}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {!group.isPublic && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-[#1E2532]/80 text-white text-xs rounded-full backdrop-blur-sm">
              <i className="fa-solid fa-lock mr-1"></i>私密
            </div>
          )}
          {canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleDelete();
              }}
              className="absolute top-3 right-3 px-2 py-1 bg-[#F56565]/80 text-white text-xs rounded-full backdrop-blur-sm"
              title="删除小组"
            >
              <i className="fa-solid fa-trash mr-1"></i>删除
            </button>
          )}
        </Link>
      </div>

      {/* 小组信息 */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#F5F7FA] mb-1">
          <Link to={`/group/${group.id}`} className="hover:text-[#4A5F8B] transition-colors">
            {group.name}
          </Link>
        </h3>
        <p className="text-sm text-[#B8C6D8] mb-3 line-clamp-2">{group.description}</p>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <span className="text-sm text-[#B8C6D8]">
              {group.members.length}成员
            </span>
            <span className="mx-2 text-[#6B7C93]">•</span>
            <span className="text-sm text-[#B8C6D8]">
              {group.posts}帖子
            </span>
          </div>
          <span className="text-xs text-[#6B7C93]">创建于 {new Date(group.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {group.tags.map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-[#1E2532] text-[#B8C6D8] rounded-full text-xs border border-[#4A5F8B]">#{tag}</span>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleJoinLeave}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            group.joined ? "bg-[#F56565] text-white hover:bg-[#E53E3E]" : "bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]"
          }`}
        >
          {group.joined ? "退出小组" : "加入小组"}
        </motion.button>
      </div>
    </motion.div>
  );
};