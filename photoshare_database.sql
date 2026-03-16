-- PhotoShare 数据库创建脚本
-- 创建数据库
CREATE DATABASE IF NOT EXISTS photoshare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE photoshare;

-- 一、用户管理模块

-- 用户表 (users)
-- 用户表(users)用于存储平台用户的基本信息和账户数据。user_id是表的主键，username和email用于用户唯一标识，password_hash存储加密后的用户密码。
CREATE TABLE IF NOT EXISTS users (
  user_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(50) NOT NULL COMMENT '用户名',
  email VARCHAR(100) NOT NULL COMMENT '邮箱',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
  avatar VARCHAR(255) NULL DEFAULT NULL COMMENT '头像URL',
  bio TEXT NULL COMMENT '个人简介',
  interest_tags JSON NULL COMMENT '兴趣标签',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  status ENUM('active','banned','pending') NOT NULL DEFAULT 'active' COMMENT '状态',
  last_login_at TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  followers_count INT NOT NULL DEFAULT 0 COMMENT '粉丝数',
  following_count INT NOT NULL DEFAULT 0 COMMENT '关注数',
  posts_count INT NOT NULL DEFAULT 0 COMMENT '作品数',
  level VARCHAR(50) NULL DEFAULT NULL COMMENT '等级名称',
  level_num INT NULL DEFAULT NULL COMMENT '等级数字',
  progress INT NULL DEFAULT NULL COMMENT '当前进度',
  progress_max INT NULL DEFAULT NULL COMMENT '最大进度',
  -- 主键与索引
  PRIMARY KEY (user_id),
  UNIQUE KEY uk_users_username (username),
  UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 用户权限表 (user_permissions)
-- 用户权限表(user_permissions)用于管理用户的特殊权限授予记录。permission_id是表的主键，通过user_id关联用户表，记录用户获得的特殊权限类型permission_type和授权时间granted_at。
CREATE TABLE IF NOT EXISTS user_permissions (
  permission_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '权限ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  permission_type VARCHAR(50) NOT NULL COMMENT '权限类型',
  granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '授权时间',
  -- 主键与索引
  PRIMARY KEY (permission_id),
  KEY idx_user_permissions_user_id (user_id),
  CONSTRAINT fk_user_permissions_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户权限表';

-- 关注表 (follows)
-- 关注表(follows)用于存储用户之间的关注关系。follow_id是表的主键，通过follower_id和following_id关联用户表，记录关注者与被关注者的关系及关注时间created_at。
CREATE TABLE IF NOT EXISTS follows (
  follow_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '关注ID',
  follower_id BIGINT(20) NOT NULL COMMENT '关注者ID',
  following_id BIGINT(20) NOT NULL COMMENT '被关注者ID',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '关注时间',
  -- 主键与索引
  PRIMARY KEY (follow_id),
  UNIQUE KEY uk_follows_follower_following (follower_id, following_id),
  KEY idx_follows_follower_id (follower_id),
  KEY idx_follows_following_id (following_id),
  CONSTRAINT fk_follows_follower_id FOREIGN KEY (follower_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_follows_following_id FOREIGN KEY (following_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注表';

-- 会员表 (memberships)
-- 会员表(memberships)用于管理用户的会员订阅信息。membership_id是表的主键，通过user_id关联用户表，记录会员类型membership_type和开始日期start_date。
CREATE TABLE IF NOT EXISTS memberships (
  membership_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '会员ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  membership_type ENUM('free','basic','premium','vip') NOT NULL DEFAULT 'free' COMMENT '会员类型',
  start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '开始日期',
  end_date TIMESTAMP NULL DEFAULT NULL COMMENT '结束日期',
  status ENUM('active','expired','cancelled') NOT NULL DEFAULT 'active' COMMENT '状态',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (membership_id),
  KEY idx_memberships_user_id (user_id),
  KEY idx_memberships_status (status),
  CONSTRAINT fk_memberships_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会员表';

-- 二、作品展示与交流模块

-- 摄影作品表 (photographs)
-- 摄影作品表(photographs)用于存储用户发布的摄影作品信息。photo_id是表的主键，通过user_id关联用户表，记录作品标题title和图片地址image_url。
CREATE TABLE IF NOT EXISTS photographs (
  photo_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '作品ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  title VARCHAR(100) NOT NULL COMMENT '作品标题',
  description TEXT NULL COMMENT '作品描述',
  image_url VARCHAR(255) NOT NULL COMMENT '图片URL',
  thumbnail_url VARCHAR(255) NOT NULL COMMENT '缩略图URL',
  tags JSON NULL COMMENT '标签',
  location_id BIGINT(20) NULL DEFAULT NULL COMMENT '拍摄地点ID',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  views_count INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  likes_count INT NOT NULL DEFAULT 0 COMMENT '点赞次数',
  comments_count INT NOT NULL DEFAULT 0 COMMENT '评论次数',
  visibility ENUM('public','private') NOT NULL DEFAULT 'public' COMMENT '可见性',
  -- 主键与索引
  PRIMARY KEY (photo_id),
  KEY idx_photographs_user_id (user_id),
  KEY idx_photographs_location_id (location_id),
  KEY idx_photographs_created_at (created_at),
  CONSTRAINT fk_photographs_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_photographs_location_id FOREIGN KEY (location_id) REFERENCES photo_locations (location_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='摄影作品表';

-- 拍摄地点表 (photo_locations)
-- 拍摄地点表(photo_locations)用于存储摄影拍摄地点的地理信息。location_id是表的主键，记录地点名称name和地址address。
CREATE TABLE IF NOT EXISTS photo_locations (
  location_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '地点ID',
  name VARCHAR(100) NOT NULL COMMENT '地点名称',
  address VARCHAR(255) NOT NULL COMMENT '地址',
  latitude DECIMAL(10,8) NOT NULL COMMENT '纬度',
  longitude DECIMAL(11,8) NOT NULL COMMENT '经度',
  image VARCHAR(255) NULL DEFAULT NULL COMMENT '图片URL',
  categories JSON NULL COMMENT '分类',
  photos_count INT NOT NULL DEFAULT 0 COMMENT '照片数量',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (location_id),
  KEY idx_photo_locations_latitude (latitude),
  KEY idx_photo_locations_longitude (longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='拍摄地点表';

-- 用户拍摄地点记录表 (user_photo_locations)
-- 用户拍摄地点记录表(user_photo_locations)用于存储用户对拍摄地点的访问记录和评价。record_id是表的主键，通过user_id和location_id分别关联用户表和拍摄地点表，记录访问次数visit_count、首次访问first_visit和最近访问last_visit时间。
CREATE TABLE IF NOT EXISTS user_photo_locations (
  record_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  location_id BIGINT(20) NOT NULL COMMENT '地点ID',
  visit_count INT NOT NULL DEFAULT 0 COMMENT '访问次数',
  first_visit TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '首次访问',
  last_visit TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最近访问',
  rating TINYINT(1) NULL DEFAULT NULL COMMENT '评分(1-5)',
  notes TEXT NULL COMMENT '笔记',
  is_favorite TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否收藏',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (record_id),
  UNIQUE KEY uk_user_photo_locations_user_location (user_id, location_id),
  KEY idx_user_photo_locations_user_id (user_id),
  KEY idx_user_photo_locations_location_id (location_id),
  KEY idx_user_photo_locations_is_favorite (is_favorite),
  CONSTRAINT fk_user_photo_locations_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_user_photo_locations_location_id FOREIGN KEY (location_id) REFERENCES photo_locations (location_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户拍摄地点记录表';

-- 点赞表 (likes)
-- 点赞表(likes)用于存储用户对摄影作品的点赞记录。like_id是表的主键，通过user_id和photo_id分别关联用户表和摄影作品表，记录点赞时间created_at。
CREATE TABLE IF NOT EXISTS likes (
  like_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '点赞ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  photo_id BIGINT(20) NOT NULL COMMENT '作品ID',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '点赞时间',
  -- 主键与索引
  PRIMARY KEY (like_id),
  UNIQUE KEY uk_likes_user_photo (user_id, photo_id),
  KEY idx_likes_photo_id (photo_id),
  CONSTRAINT fk_likes_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_likes_photo_id FOREIGN KEY (photo_id) REFERENCES photographs (photo_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- 收藏表 (bookmarks)
-- 收藏表(bookmarks)用于存储用户对摄影作品的收藏记录。bookmark_id是表的主键，通过user_id和photo_id分别关联用户表和摄影作品表，记录收藏时间created_at。
CREATE TABLE IF NOT EXISTS bookmarks (
  bookmark_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '收藏ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  photo_id BIGINT(20) NOT NULL COMMENT '作品ID',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  -- 主键与索引
  PRIMARY KEY (bookmark_id),
  UNIQUE KEY uk_bookmarks_user_photo (user_id, photo_id),
  KEY idx_bookmarks_photo_id (photo_id),
  CONSTRAINT fk_bookmarks_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_bookmarks_photo_id FOREIGN KEY (photo_id) REFERENCES photographs (photo_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- 评论表 (comments)
-- 评论表(comments)用于存储用户对摄影作品的评论内容。comment_id是表的主键，通过user_id和photo_id分别关联用户表和摄影作品表，记录评论内容content、评论时间created_at和更新时间updated_at。
CREATE TABLE IF NOT EXISTS comments (
  comment_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '评论ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  photo_id BIGINT(20) NOT NULL COMMENT '作品ID',
  content TEXT NOT NULL COMMENT '评论内容',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  parent_comment_id BIGINT(20) NULL DEFAULT NULL COMMENT '父评论ID',
  -- 主键与索引
  PRIMARY KEY (comment_id),
  KEY idx_comments_user_id (user_id),
  KEY idx_comments_photo_id (photo_id),
  KEY idx_comments_parent_comment_id (parent_comment_id),
  CONSTRAINT fk_comments_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_photo_id FOREIGN KEY (photo_id) REFERENCES photographs (photo_id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_parent_comment_id FOREIGN KEY (parent_comment_id) REFERENCES comments (comment_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 三、智能摄影辅助模块

-- AI角色表 (ai_roles)
-- AI角色表(ai_roles)用于存储AI摄影助手的角色配置信息。role_id是表的主键，记录角色名称name和描述description。
CREATE TABLE IF NOT EXISTS ai_roles (
  role_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  name VARCHAR(50) NOT NULL COMMENT '角色名称',
  description TEXT NOT NULL COMMENT '角色描述',
  avatar VARCHAR(255) NULL DEFAULT NULL COMMENT '头像URL',
  system_prompt TEXT NOT NULL COMMENT '系统提示词',
  features JSON NULL COMMENT '功能特性',
  is_active TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
  sort_order INT NOT NULL DEFAULT 0 COMMENT '排序',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (role_id),
  KEY idx_ai_roles_is_active (is_active),
  KEY idx_ai_roles_sort_order (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI角色表';

-- AI会话表 (ai_chat_sessions)
-- AI会话表(ai_chat_sessions)用于存储用户与AI助手的对话会话信息。session_id是表的主键，通过user_id和role_id分别关联用户表和AI角色表，记录会话标题session_title、上下文ID context_id和会话状态status。
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  session_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  role_id BIGINT(20) NULL DEFAULT NULL COMMENT 'AI角色ID',
  session_title VARCHAR(100) NULL DEFAULT NULL COMMENT '会话标题',
  context_id VARCHAR(100) NULL DEFAULT NULL COMMENT '上下文ID',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  last_message_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后消息时间',
  status ENUM('active','closed') NOT NULL DEFAULT 'active' COMMENT '状态',
  is_pinned TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否置顶',
  -- 主键与索引
  PRIMARY KEY (session_id),
  KEY idx_ai_chat_sessions_user_id (user_id),
  KEY idx_ai_chat_sessions_role_id (role_id),
  KEY idx_ai_chat_sessions_status (status),
  CONSTRAINT fk_ai_chat_sessions_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_ai_chat_sessions_role_id FOREIGN KEY (role_id) REFERENCES ai_roles (role_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI会话表';

-- AI消息表 (ai_messages)
-- AI消息表(ai_messages)用于存储用户与AI助手的对话消息内容。message_id是表的主键，通过session_id关联AI会话表，记录发送者类型sender_type(user用户/ai助手)、消息内容content和创建时间created_at。
CREATE TABLE IF NOT EXISTS ai_messages (
  message_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  session_id BIGINT(20) NOT NULL COMMENT '会话ID',
  sender_type ENUM('user','ai') NOT NULL COMMENT '发送者类型',
  content TEXT NOT NULL COMMENT '消息内容',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  metadata JSON NULL COMMENT '元数据',
  is_favorite TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否收藏',
  tags JSON NULL COMMENT '标签',
  status ENUM('sending','sent','failed') NOT NULL DEFAULT 'sent' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (message_id),
  KEY idx_ai_messages_session_id (session_id),
  KEY idx_ai_messages_created_at (created_at),
  KEY idx_ai_messages_is_favorite (is_favorite),
  CONSTRAINT fk_ai_messages_session_id FOREIGN KEY (session_id) REFERENCES ai_chat_sessions (session_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='AI消息表';

-- 四、器材与学习资源模块

-- 器材表 (equipment)
-- 器材表(equipment)用于存储摄影器材的详细信息。equipment_id是表的主键，记录器材名称name和类型type。
CREATE TABLE IF NOT EXISTS equipment (
  equipment_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '器材ID',
  name VARCHAR(100) NOT NULL COMMENT '器材名称',
  type ENUM('camera','lens','accessory') NOT NULL COMMENT '器材类型',
  brand VARCHAR(50) NOT NULL COMMENT '品牌',
  model VARCHAR(100) NOT NULL COMMENT '型号',
  price DECIMAL(10,2) NULL DEFAULT NULL COMMENT '价格',
  specs JSON NULL COMMENT '规格参数',
  description TEXT NULL COMMENT '描述',
  image_urls JSON NULL COMMENT '图片URLs',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  average_rating DECIMAL(3,2) NOT NULL DEFAULT 0.00 COMMENT '平均评分',
  -- 主键与索引
  PRIMARY KEY (equipment_id),
  KEY idx_equipment_type (type),
  KEY idx_equipment_brand (brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='器材表';

-- 器材评测表 (equipment_reviews)
-- 器材评测表(equipment_reviews)用于存储用户对摄影器材的评测内容。review_id是表的主键，通过equipment_id和user_id分别关联器材表和用户表，记录评分rating、评测标题title和评测内容content。
CREATE TABLE IF NOT EXISTS equipment_reviews (
  review_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '评测ID',
  equipment_id BIGINT(20) NOT NULL COMMENT '器材ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  rating INT NOT NULL COMMENT '评分',
  title VARCHAR(100) NOT NULL COMMENT '评测标题',
  content TEXT NOT NULL COMMENT '评测内容',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (review_id),
  UNIQUE KEY uk_equipment_reviews_user_equipment (user_id, equipment_id),
  KEY idx_equipment_reviews_equipment_id (equipment_id),
  KEY idx_equipment_reviews_user_id (user_id),
  KEY idx_equipment_reviews_rating (rating),
  CONSTRAINT fk_equipment_reviews_equipment_id FOREIGN KEY (equipment_id) REFERENCES equipment (equipment_id) ON DELETE CASCADE,
  CONSTRAINT fk_equipment_reviews_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='器材评测表';

-- 课程表 (courses)
-- 课程表(courses)用于存储摄影课程的详细信息。course_id是表的主键，通过instructor_id关联用户表(讲师)，记录课程标题title、描述description、时长duration和价格price。
CREATE TABLE IF NOT EXISTS courses (
  course_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '课程ID',
  title VARCHAR(100) NOT NULL COMMENT '课程标题',
  description TEXT NOT NULL COMMENT '课程描述',
  instructor_id BIGINT(20) NOT NULL COMMENT '讲师ID',
  duration INT NOT NULL COMMENT '课程时长',
  level ENUM('beginner','intermediate','advanced') NOT NULL COMMENT '难度等级',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  cover_image VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  category VARCHAR(50) NULL DEFAULT NULL COMMENT '分类',
  lessons INT NULL DEFAULT NULL COMMENT '课程数',
  students_count INT NOT NULL DEFAULT 0 COMMENT '学生数',
  rating DECIMAL(3,2) NOT NULL DEFAULT 0.00 COMMENT '评分',
  reviews_count INT NOT NULL DEFAULT 0 COMMENT '评论数',
  type ENUM('free','paid') NOT NULL DEFAULT 'paid' COMMENT '类型',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  status ENUM('published','draft') NOT NULL DEFAULT 'draft' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (course_id),
  KEY idx_courses_instructor_id (instructor_id),
  KEY idx_courses_level (level),
  KEY idx_courses_status (status),
  KEY idx_courses_category (category),
  CONSTRAINT fk_courses_instructor_id FOREIGN KEY (instructor_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程表';

-- 教程资源表 (tutorials)
-- 教程资源表(tutorials)用于存储摄影教程和技巧文章。tutorial_id是表的主键，通过author_id关联用户表(作者)，记录教程标题title和内容content。
CREATE TABLE IF NOT EXISTS tutorials (
  tutorial_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '教程ID',
  title VARCHAR(100) NOT NULL COMMENT '教程标题',
  content TEXT NOT NULL COMMENT '教程内容',
  author_id BIGINT(20) NOT NULL COMMENT '作者ID',
  category VARCHAR(50) NOT NULL COMMENT '分类',
  level VARCHAR(50) NULL DEFAULT NULL COMMENT '难度等级',
  duration VARCHAR(50) NULL DEFAULT NULL COMMENT '时长',
  cover_image VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  views_count INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  likes_count INT NOT NULL DEFAULT 0 COMMENT '点赞次数',
  tags JSON NULL COMMENT '标签',
  -- 主键与索引
  PRIMARY KEY (tutorial_id),
  KEY idx_tutorials_author_id (author_id),
  KEY idx_tutorials_category (category),
  KEY idx_tutorials_created_at (created_at),
  CONSTRAINT fk_tutorials_author_id FOREIGN KEY (author_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教程资源表';

-- 五、社区互动模块

-- 群组表 (groups)
-- 群组表(groups)用于存储摄影兴趣群组的基本信息。group_id是表的主键，通过created_by关联用户表(创建者)，记录群组名称name和状态status。
CREATE TABLE IF NOT EXISTS `groups` (
  group_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '群组ID',
  name VARCHAR(100) NOT NULL COMMENT '群组名称',
  description TEXT NULL COMMENT '群组描述',
  cover_image VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  created_by BIGINT(20) NOT NULL COMMENT '创建者ID',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  members_count INT NOT NULL DEFAULT 0 COMMENT '成员数',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (group_id),
  KEY idx_groups_created_by (created_by),
  KEY idx_groups_status (status),
  CONSTRAINT fk_groups_created_by FOREIGN KEY (created_by) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='群组表';

-- 群组成员表 (group_members)
-- 群组成员表(group_members)用于存储用户加入群组的成员关系。member_id是表的主键，通过group_id和user_id分别关联群组表和用户表，记录成员角色role和状态status。
CREATE TABLE IF NOT EXISTS group_members (
  member_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '成员ID',
  group_id BIGINT(20) NOT NULL COMMENT '群组ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  role ENUM('admin','member') NOT NULL DEFAULT 'member' COMMENT '角色',
  joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
  status ENUM('active','banned') NOT NULL DEFAULT 'active' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (member_id),
  UNIQUE KEY uk_group_members_group_user (group_id, user_id),
  KEY idx_group_members_group_id (group_id),
  KEY idx_group_members_user_id (user_id),
  KEY idx_group_members_role (role),
  CONSTRAINT fk_group_members_group_id FOREIGN KEY (group_id) REFERENCES `groups` (group_id) ON DELETE CASCADE,
  CONSTRAINT fk_group_members_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='群组成员表';

-- 活动表 (events)
-- 活动表(events)用于存储摄影活动的详细信息。event_id是表的主键，通过organizer_id关联用户表(组织者)，记录活动标题title和状态status。
CREATE TABLE IF NOT EXISTS events (
  event_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '活动ID',
  title VARCHAR(100) NOT NULL COMMENT '活动标题',
  description TEXT NOT NULL COMMENT '活动描述',
  organizer_id BIGINT(20) NOT NULL COMMENT '组织者ID',
  location VARCHAR(100) NOT NULL COMMENT '活动地点',
  start_time TIMESTAMP NOT NULL COMMENT '开始时间',
  end_time TIMESTAMP NOT NULL COMMENT '结束时间',
  max_participants INT NULL DEFAULT NULL COMMENT '最大参与人数',
  registration_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '报名费用',
  cover_image VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  type VARCHAR(50) NULL DEFAULT NULL COMMENT '活动类型',
  category VARCHAR(50) NULL DEFAULT NULL COMMENT '分类',
  duration VARCHAR(50) NULL DEFAULT NULL COMMENT '时长',
  participants_count INT NOT NULL DEFAULT 0 COMMENT '参与人数',
  tags JSON NULL COMMENT '标签',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  status ENUM('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (event_id),
  KEY idx_events_organizer_id (organizer_id),
  KEY idx_events_start_time (start_time),
  KEY idx_events_status (status),
  KEY idx_events_type (type),
  KEY idx_events_category (category),
  CONSTRAINT fk_events_organizer_id FOREIGN KEY (organizer_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动表';

-- 活动报名表 (event_registrations)
-- 活动报名表(event_registrations)用于存储用户参加活动的报名记录。registration_id是表的主键，通过event_id和user_id分别关联活动表和用户表，记录状态status和支付状态payment_status。
CREATE TABLE IF NOT EXISTS event_registrations (
  registration_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '报名ID',
  event_id BIGINT(20) NOT NULL COMMENT '活动ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  registration_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  status ENUM('confirmed','pending','cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  payment_status ENUM('paid','unpaid') NOT NULL DEFAULT 'unpaid' COMMENT '支付状态',
  -- 主键与索引
  PRIMARY KEY (registration_id),
  UNIQUE KEY uk_event_registrations_event_user (event_id, user_id),
  KEY idx_event_registrations_event_id (event_id),
  KEY idx_event_registrations_user_id (user_id),
  KEY idx_event_registrations_status (status),
  KEY idx_event_registrations_payment_status (payment_status),
  CONSTRAINT fk_event_registrations_event_id FOREIGN KEY (event_id) REFERENCES events (event_id) ON DELETE CASCADE,
  CONSTRAINT fk_event_registrations_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动报名表';

-- 赛事表 (contests)
-- 赛事表(contests)用于存储摄影比赛的详细信息。contest_id是表的主键，通过organizer_id关联用户表(组织者)，记录赛事标题title和状态status。
CREATE TABLE IF NOT EXISTS contests (
  contest_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '赛事ID',
  title VARCHAR(100) NOT NULL COMMENT '赛事标题',
  description TEXT NOT NULL COMMENT '赛事描述',
  organizer_id BIGINT(20) NOT NULL COMMENT '组织者ID',
  start_time TIMESTAMP NOT NULL COMMENT '开始时间',
  end_time TIMESTAMP NOT NULL COMMENT '结束时间',
  theme VARCHAR(100) NOT NULL COMMENT '赛事主题',
  prizes JSON NULL COMMENT '奖品',
  cover_image VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  type VARCHAR(50) NULL DEFAULT NULL COMMENT '赛事类型',
  categories JSON NULL COMMENT '分类',
  rules JSON NULL COMMENT '规则',
  tags JSON NULL COMMENT '标签',
  entries_count INT NOT NULL DEFAULT 0 COMMENT '作品数',
  participants_count INT NOT NULL DEFAULT 0 COMMENT '参与人数',
  works_count INT NOT NULL DEFAULT 0 COMMENT '作品数量',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  status ENUM('upcoming','ongoing','completed','cancelled') NOT NULL DEFAULT 'upcoming' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (contest_id),
  KEY idx_contests_organizer_id (organizer_id),
  KEY idx_contests_start_time (start_time),
  KEY idx_contests_status (status),
  KEY idx_contests_type (type),
  CONSTRAINT fk_contests_organizer_id FOREIGN KEY (organizer_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='赛事表';

-- 赛事提交表 (contest_submissions)
-- 赛事提交表(contest_submissions)用于存储用户向摄影比赛提交的作品记录。submission_id是表的主键，通过contest_id、user_id和photo_id分别关联赛事表、用户表和摄影作品表，记录状态status和得分score。
CREATE TABLE IF NOT EXISTS contest_submissions (
  submission_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '提交ID',
  contest_id BIGINT(20) NOT NULL COMMENT '赛事ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  photo_id BIGINT(20) NOT NULL COMMENT '作品ID',
  submission_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
  status ENUM('accepted','rejected','pending') NOT NULL DEFAULT 'pending' COMMENT '状态',
  score DECIMAL(5,2) NULL DEFAULT NULL COMMENT '得分',
  -- 主键与索引
  PRIMARY KEY (submission_id),
  UNIQUE KEY uk_contest_submissions_contest_user_photo (contest_id, user_id, photo_id),
  KEY idx_contest_submissions_contest_id (contest_id),
  KEY idx_contest_submissions_user_id (user_id),
  KEY idx_contest_submissions_photo_id (photo_id),
  KEY idx_contest_submissions_status (status),
  CONSTRAINT fk_contest_submissions_contest_id FOREIGN KEY (contest_id) REFERENCES contests (contest_id) ON DELETE CASCADE,
  CONSTRAINT fk_contest_submissions_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_contest_submissions_photo_id FOREIGN KEY (photo_id) REFERENCES photographs (photo_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='赛事提交表';

-- 六、订单系统模块

-- 订单表 (orders)
-- 订单表(orders)用于存储平台各类订单信息。order_id是表的主键，通过user_id关联用户表，记录订单编号order_number、订单类型type和状态status。
CREATE TABLE IF NOT EXISTS orders (
  order_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  order_number VARCHAR(50) NOT NULL COMMENT '订单号',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  type ENUM('equipment','course','license','event','coaching') NOT NULL COMMENT '订单类型',
  title VARCHAR(200) NOT NULL COMMENT '订单标题',
  description TEXT NULL COMMENT '订单描述',
  image_url VARCHAR(255) NULL DEFAULT NULL COMMENT '图片URL',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  status ENUM('pending','paid','shipped','completed','cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
  payment_date TIMESTAMP NULL DEFAULT NULL COMMENT '支付时间',
  delivery_date TIMESTAMP NULL DEFAULT NULL COMMENT '发货时间',
  tracking_number VARCHAR(100) NULL DEFAULT NULL COMMENT '物流单号',
  address JSON NULL COMMENT '收货地址',
  items JSON NULL COMMENT '订单项',
  completion_progress INT NULL DEFAULT NULL COMMENT '完成进度',
  access_link VARCHAR(255) NULL DEFAULT NULL COMMENT '访问链接',
  license_type VARCHAR(50) NULL DEFAULT NULL COMMENT '许可证类型',
  license_period VARCHAR(50) NULL DEFAULT NULL COMMENT '许可证期限',
  download_link VARCHAR(255) NULL DEFAULT NULL COMMENT '下载链接',
  -- 主键与索引
  PRIMARY KEY (order_id),
  UNIQUE KEY uk_orders_order_number (order_number),
  KEY idx_orders_user_id (user_id),
  KEY idx_orders_type (type),
  KEY idx_orders_status (status),
  KEY idx_orders_order_date (order_date),
  CONSTRAINT fk_orders_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='订单表';

-- 七、通知与消息系统模块

-- 通知表 (notifications)
-- 通知表(notifications)用于存储系统发送给用户的各种通知信息。notification_id是表的主键，通过user_id关联用户表，记录通知类型type和是否已读is_read。
CREATE TABLE IF NOT EXISTS notifications (
  notification_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  type ENUM('like','comment','follow','mention','share','contest','event','system','security','message') NOT NULL COMMENT '通知类型',
  category VARCHAR(50) NOT NULL COMMENT '分类',
  title VARCHAR(200) NOT NULL COMMENT '标题',
  message TEXT NOT NULL COMMENT '消息内容',
  is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已读',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  related_url VARCHAR(255) NULL DEFAULT NULL COMMENT '相关URL',
  conversation_id BIGINT(20) NULL DEFAULT NULL COMMENT '会话ID',
  sender_id BIGINT(20) NULL DEFAULT NULL COMMENT '发送者ID',
  related_item JSON NULL COMMENT '相关项目',
  actions JSON NULL COMMENT '操作',
  -- 主键与索引
  PRIMARY KEY (notification_id),
  KEY idx_notifications_user_id (user_id),
  KEY idx_notifications_type (type),
  KEY idx_notifications_is_read (is_read),
  KEY idx_notifications_created_at (created_at),
  CONSTRAINT fk_notifications_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知表';

-- 消息会话表 (conversations)
-- 消息会话表(conversations)用于存储用户之间的私信会话信息。conversation_id是表的主键，通过user1_id和user2_id关联用户表，记录最后消息时间last_message_at和最后消息内容last_message_content。
CREATE TABLE IF NOT EXISTS conversations (
  conversation_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '会话ID',
  user1_id BIGINT(20) NOT NULL COMMENT '用户1 ID',
  user2_id BIGINT(20) NOT NULL COMMENT '用户2 ID',
  last_message_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后消息时间',
  last_message_content TEXT NULL COMMENT '最后消息内容',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (conversation_id),
  UNIQUE KEY uk_conversations_users (user1_id, user2_id),
  KEY idx_conversations_user1_id (user1_id),
  KEY idx_conversations_user2_id (user2_id),
  CONSTRAINT fk_conversations_user1_id FOREIGN KEY (user1_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_conversations_user2_id FOREIGN KEY (user2_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息会话表';

-- 消息表 (messages)
-- 消息表(messages)用于存储用户私信的具体消息内容。message_id是表的主键，通过conversation_id关联消息会话表，通过sender_id和receiver_id关联用户表，记录消息内容content和是否已读is_read。
CREATE TABLE IF NOT EXISTS messages (
  message_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
  conversation_id BIGINT(20) NOT NULL COMMENT '会话ID',
  sender_id BIGINT(20) NOT NULL COMMENT '发送者ID',
  receiver_id BIGINT(20) NOT NULL COMMENT '接收者ID',
  content TEXT NOT NULL COMMENT '消息内容',
  is_read BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否已读',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (message_id),
  KEY idx_messages_conversation_id (conversation_id),
  KEY idx_messages_sender_id (sender_id),
  KEY idx_messages_receiver_id (receiver_id),
  KEY idx_messages_created_at (created_at),
  CONSTRAINT fk_messages_conversation_id FOREIGN KEY (conversation_id) REFERENCES conversations (conversation_id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_sender_id FOREIGN KEY (sender_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_receiver_id FOREIGN KEY (receiver_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息表';

-- 八、内容审核模块

-- 内容审核表 (content_moderations)
-- 内容审核表(content_moderations)用于存储平台内容的审核记录和举报信息。moderation_id是表的主键，记录内容类型content_type、内容IDcontent_id和审核状态status。
CREATE TABLE IF NOT EXISTS content_moderations (
  moderation_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '审核ID',
  content_type ENUM('photo','comment','post','message') NOT NULL COMMENT '内容类型',
  content_id BIGINT(20) NOT NULL COMMENT '内容ID',
  reporter_id BIGINT(20) NULL DEFAULT NULL COMMENT '举报者ID',
  reason VARCHAR(200) NOT NULL COMMENT '原因',
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending' COMMENT '状态',
  reviewed_by BIGINT(20) NULL DEFAULT NULL COMMENT '审核人ID',
  reviewed_at TIMESTAMP NULL DEFAULT NULL COMMENT '审核时间',
  review_notes TEXT NULL COMMENT '审核备注',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (moderation_id),
  KEY idx_content_moderations_content_type_id (content_type, content_id),
  KEY idx_content_moderations_status (status),
  KEY idx_content_moderations_created_at (created_at),
  CONSTRAINT fk_content_moderations_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES users (user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='内容审核表';

-- 九、数据统计模块

-- 数据统计表 (statistics)
-- 数据统计表(statistics)用于存储平台各类数据的统计信息。stat_id是表的主键，通过user_id关联用户表，记录统计类型stat_type和统计值stat_value。
CREATE TABLE IF NOT EXISTS statistics (
  stat_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '统计ID',
  user_id BIGINT(20) NULL DEFAULT NULL COMMENT '用户ID',
  stat_type VARCHAR(50) NOT NULL COMMENT '统计类型',
  stat_date DATE NOT NULL COMMENT '统计日期',
  stat_value INT NOT NULL DEFAULT 0 COMMENT '统计值',
  metadata JSON NULL COMMENT '元数据',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (stat_id),
  KEY idx_statistics_user_id (user_id),
  KEY idx_statistics_type_date (stat_type, stat_date),
  CONSTRAINT fk_statistics_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据统计表';

-- 十、支付系统模块

-- 支付记录表 (payments)
-- 支付记录表(payments)用于存储订单的支付信息。payment_id是表的主键，通过order_id和user_id分别关联订单表和用户表，记录支付方式payment_method和支付状态payment_status。
CREATE TABLE IF NOT EXISTS payments (
  payment_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '支付ID',
  order_id BIGINT(20) NOT NULL COMMENT '订单ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  payment_method VARCHAR(50) NOT NULL COMMENT '支付方式',
  payment_status ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'pending' COMMENT '支付状态',
  amount DECIMAL(10,2) NOT NULL COMMENT '金额',
  transaction_id VARCHAR(100) NULL DEFAULT NULL COMMENT '交易ID',
  paid_at TIMESTAMP NULL DEFAULT NULL COMMENT '支付时间',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (payment_id),
  KEY idx_payments_order_id (order_id),
  KEY idx_payments_user_id (user_id),
  KEY idx_payments_payment_status (payment_status),
  KEY idx_payments_created_at (created_at),
  CONSTRAINT fk_payments_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE,
  CONSTRAINT fk_payments_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='支付记录表';

-- 十一、版权管理模块

-- 版权许可表 (licenses)
-- 版权许可表(licenses)用于存储摄影作品的版权授权信息。license_id是表的主键，通过user_id和photo_id分别关联用户表和摄影作品表，记录许可类型license_type和价格price。
CREATE TABLE IF NOT EXISTS licenses (
  license_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '许可ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  photo_id BIGINT(20) NULL DEFAULT NULL COMMENT '作品ID',
  license_type ENUM('personal','commercial','exclusive') NOT NULL COMMENT '许可类型',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  start_date TIMESTAMP NOT NULL COMMENT '开始日期',
  end_date TIMESTAMP NULL DEFAULT NULL COMMENT '结束日期',
  usage_rights TEXT NULL COMMENT '使用权限',
  restrictions TEXT NULL COMMENT '限制条件',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (license_id),
  KEY idx_licenses_user_id (user_id),
  KEY idx_licenses_photo_id (photo_id),
  KEY idx_licenses_license_type (license_type),
  CONSTRAINT fk_licenses_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_licenses_photo_id FOREIGN KEY (photo_id) REFERENCES photographs (photo_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='版权许可表';

-- 十二、器材交易模块

-- 器材交易表 (equipment_trades)
-- 器材交易表(equipment_trades)用于存储用户二手器材的出售信息。trade_id是表的主键，通过seller_id关联用户表(卖家)，记录交易标题title和状态status。
CREATE TABLE IF NOT EXISTS equipment_trades (
  trade_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '交易ID',
  seller_id BIGINT(20) NOT NULL COMMENT '卖家ID',
  title VARCHAR(100) NOT NULL COMMENT '标题',
  description TEXT NULL COMMENT '描述',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  brand VARCHAR(50) NULL DEFAULT NULL COMMENT '品牌',
  model VARCHAR(100) NULL DEFAULT NULL COMMENT '型号',
  `condition` VARCHAR(50) NOT NULL COMMENT '成色',
  images JSON NULL COMMENT '图片',
  location VARCHAR(100) NULL DEFAULT NULL COMMENT '位置',
  status ENUM('available','sold','reserved') NOT NULL DEFAULT 'available' COMMENT '状态',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (trade_id),
  KEY idx_equipment_trades_seller_id (seller_id),
  KEY idx_equipment_trades_status (status),
  KEY idx_equipment_trades_created_at (created_at),
  CONSTRAINT fk_equipment_trades_seller_id FOREIGN KEY (seller_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='器材交易表';

-- 十三、一对一指导模块

-- 一对一指导表 (one_on_one_coaching)
-- 一对一指导表(one_on_one_coaching)用于存储摄影师提供的一对一指导服务信息。coaching_id是表的主键，通过instructor_id关联用户表(讲师)，记录指导标题title和价格price。
CREATE TABLE IF NOT EXISTS one_on_one_coaching (
  coaching_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '指导ID',
  instructor_id BIGINT(20) NOT NULL COMMENT '讲师ID',
  title VARCHAR(100) NOT NULL COMMENT '标题',
  description TEXT NOT NULL COMMENT '描述',
  price DECIMAL(10,2) NOT NULL COMMENT '价格',
  duration INT NOT NULL COMMENT '时长',
  cover_image VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  category VARCHAR(50) NULL DEFAULT NULL COMMENT '分类',
  level VARCHAR(50) NULL DEFAULT NULL COMMENT '难度',
  available_slots INT NOT NULL DEFAULT 0 COMMENT '可用名额',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (coaching_id),
  KEY idx_one_on_one_coaching_instructor_id (instructor_id),
  KEY idx_one_on_one_coaching_status (status),
  KEY idx_one_on_one_coaching_category (category),
  CONSTRAINT fk_one_on_one_coaching_instructor_id FOREIGN KEY (instructor_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='一对一指导表';

-- 一对一指导预约表 (coaching_bookings)
-- 一对一指导预约表(coaching_bookings)用于存储用户预约一对一指导服务的记录。booking_id是表的主键，通过coaching_id和user_id分别关联一对一指导表和用户表，记录预约时间booking_date和状态status。
CREATE TABLE IF NOT EXISTS coaching_bookings (
  booking_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '预约ID',
  coaching_id BIGINT(20) NOT NULL COMMENT '指导ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  booking_date TIMESTAMP NOT NULL COMMENT '预约时间',
  status ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  payment_status ENUM('paid','unpaid') NOT NULL DEFAULT 'unpaid' COMMENT '支付状态',
  notes TEXT NULL COMMENT '备注',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (booking_id),
  KEY idx_coaching_bookings_coaching_id (coaching_id),
  KEY idx_coaching_bookings_user_id (user_id),
  KEY idx_coaching_bookings_status (status),
  KEY idx_coaching_bookings_booking_date (booking_date),
  CONSTRAINT fk_coaching_bookings_coaching_id FOREIGN KEY (coaching_id) REFERENCES one_on_one_coaching (coaching_id) ON DELETE CASCADE,
  CONSTRAINT fk_coaching_bookings_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='一对一指导预约表';

-- 十四、后台管理模块

-- 管理员表 (admin_users)
-- 管理员表(admin_users)用于存储平台后台管理员账户信息。admin_id是表的主键，通过username和email字段实现管理员身份唯一标识，记录角色role和状态status。
CREATE TABLE IF NOT EXISTS admin_users (
  admin_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '管理员ID',
  username VARCHAR(50) NOT NULL COMMENT '用户名',
  email VARCHAR(100) NOT NULL COMMENT '电子邮箱',
  password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希值',
  role ENUM('super_admin','admin','editor') NOT NULL COMMENT '角色',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  last_login_at TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  -- 主键与索引
  PRIMARY KEY (admin_id),
  UNIQUE KEY uk_admin_users_username (username),
  UNIQUE KEY uk_admin_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理员表';

-- 管理日志表 (admin_logs)
-- 管理日志表(admin_logs)用于记录平台后台管理员的操作日志信息。log_id是表的主键，通过admin_id关联管理员表，记录操作内容action和操作时间created_at。
CREATE TABLE IF NOT EXISTS admin_logs (
  log_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  admin_id BIGINT(20) NOT NULL COMMENT '管理员ID',
  action VARCHAR(100) NOT NULL COMMENT '操作内容',
  target_type VARCHAR(50) NULL DEFAULT NULL COMMENT '操作对象类型',
  target_id BIGINT(20) NULL DEFAULT NULL COMMENT '操作对象ID',
  details JSON NULL COMMENT '操作详情',
  ip_address VARCHAR(50) NULL DEFAULT NULL COMMENT '登录IP',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  -- 主键与索引
  PRIMARY KEY (log_id),
  KEY idx_admin_logs_admin_id (admin_id),
  KEY idx_admin_logs_created_at (created_at),
  KEY idx_admin_logs_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='管理日志表';

-- 十五、系统模块

-- 反馈表 (feedback)
-- 反馈表(feedback)用于存储用户提交的各类反馈信息。id是表的主键，通过user_id关联用户表，记录反馈类型type和状态status。
CREATE TABLE IF NOT EXISTS feedback (
  id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '反馈主键',
  user_id BIGINT(20) NULL DEFAULT NULL COMMENT '用户ID',
  type ENUM('bug','feature','complaint','other') NOT NULL COMMENT '反馈类型',
  content TEXT NOT NULL COMMENT '反馈内容',
  contact VARCHAR(255) NULL DEFAULT NULL COMMENT '联系方式',
  images JSON NULL COMMENT '图片列表',
  status ENUM('pending','processing','resolved','closed') NOT NULL DEFAULT 'pending' COMMENT '处理状态',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (id),
  KEY idx_feedback_user_id (user_id),
  KEY idx_feedback_type (type),
  KEY idx_feedback_status (status),
  KEY idx_feedback_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='反馈表';

-- 系统设置表 (system_settings)
-- 系统设置表(system_settings)用于存储平台的全局配置参数和系统设置信息。setting_id是表的主键，通过key字段实现配置项的唯一标识，记录设置值value。
CREATE TABLE IF NOT EXISTS system_settings (
  setting_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '设置ID',
  `key` VARCHAR(100) NOT NULL COMMENT '设置键',
  value TEXT NULL COMMENT '设置值',
  description VARCHAR(255) NULL DEFAULT NULL COMMENT '设置描述',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  updated_by BIGINT(20) NULL DEFAULT NULL COMMENT '更新者ID',
  -- 主键与索引
  PRIMARY KEY (setting_id),
  UNIQUE KEY uk_system_settings_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';

-- 十六、摄影需求与接单模块

-- 摄影需求表 (摄影需求photography_requests)
-- 摄影需求表(photography_requests)用于存储客户发布的摄影服务需求信息。request_id是表的主键，通过client_id关联用户表，记录需求标题title和需求状态status。
CREATE TABLE IF NOT EXISTS photography_requests (
  request_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '需求ID',
  client_id BIGINT(20) NOT NULL COMMENT '客户ID',
  title VARCHAR(200) NOT NULL COMMENT '需求标题',
  type VARCHAR(50) NOT NULL COMMENT '服务类型',
  category VARCHAR(50) NOT NULL COMMENT '服务分类',
  description TEXT NOT NULL COMMENT '需求描述',
  budget_min DECIMAL(10,2) NULL DEFAULT NULL COMMENT '预算下限',
  budget_max DECIMAL(10,2) NULL DEFAULT NULL COMMENT '预算上限',
  deadline DATE NOT NULL COMMENT '截止日期',
  location VARCHAR(200) NOT NULL COMMENT '拍摄地点',
  requirements JSON NULL COMMENT '具体要求',
  tags JSON NULL COMMENT '标签',
  image VARCHAR(255) NULL DEFAULT NULL COMMENT '需求图片',
  views_count INT NOT NULL DEFAULT 0 COMMENT '浏览次数',
  applications_count INT NOT NULL DEFAULT 0 COMMENT '申请次数',
  status ENUM('open','in_progress','completed','cancelled') NOT NULL DEFAULT 'open' COMMENT '状态',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (request_id),
  KEY idx_photography_requests_client_id (client_id),
  KEY idx_photography_requests_type (type),
  KEY idx_photography_requests_category (category),
  KEY idx_photography_requests_status (status),
  KEY idx_photography_requests_deadline (deadline),
  CONSTRAINT fk_photography_requests_client_id FOREIGN KEY (client_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='摄影需求表';

-- 摄影需求申请表 (photography_applications)
-- 摄影需求申请表(photography_applications)用于存储摄影师对摄影需求的申请信息。application_id是表的主键，通过request_id关联摄影需求表，通过photographer_id关联用户表，记录申请方案proposal和申请状态status。
CREATE TABLE IF NOT EXISTS photography_applications (
  application_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  request_id BIGINT(20) NOT NULL COMMENT '需求ID',
  photographer_id BIGINT(20) NOT NULL COMMENT '摄影师ID',
  proposal TEXT NOT NULL COMMENT '申请方案',
  quoted_price DECIMAL(10,2) NULL DEFAULT NULL COMMENT '报价',
  portfolio_urls JSON NULL COMMENT '作品集链接',
  status ENUM('pending','accepted','rejected','withdrawn') NOT NULL DEFAULT 'pending' COMMENT '状态',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '申请时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (application_id),
  UNIQUE KEY uk_photography_applications_request_photographer (request_id, photographer_id),
  KEY idx_photography_applications_request_id (request_id),
  KEY idx_photography_applications_photographer_id (photographer_id),
  KEY idx_photography_applications_status (status),
  CONSTRAINT fk_photography_applications_request_id FOREIGN KEY (request_id) REFERENCES photography_requests (request_id) ON DELETE CASCADE,
  CONSTRAINT fk_photography_applications_photographer_id FOREIGN KEY (photographer_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='摄影需求申请表';

-- 十七、素材管理模块

-- 素材表 (materials)
-- 素材表(materials)用于存储平台提供的各类摄影素材信息。material_id是表的主键，记录素材名称name和素材类型type。
CREATE TABLE IF NOT EXISTS materials (
  material_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '素材ID',
  name VARCHAR(100) NOT NULL COMMENT '素材名称',
  thumbnail VARCHAR(255) NULL DEFAULT NULL COMMENT '缩略图URL',
  type VARCHAR(50) NOT NULL COMMENT '素材类型',
  size VARCHAR(20) NULL DEFAULT NULL COMMENT '素材大小',
  preview_url VARCHAR(255) NULL DEFAULT NULL COMMENT '预览URL',
  camera VARCHAR(100) NULL DEFAULT NULL COMMENT '相机型号',
  resolution VARCHAR(50) NULL DEFAULT NULL COMMENT '分辨率',
  categories JSON NULL COMMENT '分类',
  tags JSON NULL COMMENT '标签',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (material_id),
  KEY idx_materials_type (type),
  KEY idx_materials_categories (categories)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='素材表';

-- 素材版本表 (material_versions)
-- 素材版本表(material_versions)用于存储素材的版本迭代信息。version_id是表的主键，通过material_id关联素材表，记录版本号version和下载URLdownload_url。
CREATE TABLE IF NOT EXISTS material_versions (
  version_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '版本ID',
  material_id BIGINT(20) NOT NULL COMMENT '素材ID',
  version VARCHAR(20) NOT NULL COMMENT '版本号',
  changes TEXT NULL COMMENT '更新说明',
  download_url VARCHAR(255) NOT NULL COMMENT '下载URL',
  date DATE NOT NULL COMMENT '版本日期',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  -- 主键与索引
  PRIMARY KEY (version_id),
  KEY idx_material_versions_material_id (material_id),
  KEY idx_material_versions_date (date),
  CONSTRAINT fk_material_versions_material_id FOREIGN KEY (material_id) REFERENCES materials (material_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='素材版本表';

-- 用户素材表 (user_materials)
-- 用户素材表(user_materials)用于存储用户收藏和使用素材的记录。user_material_id是表的主键，通过user_id关联用户表，通过material_id关联素材表，记录使用次数used_count和是否收藏is_favorite。
CREATE TABLE IF NOT EXISTS user_materials (
  user_material_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '用户素材ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  material_id BIGINT(20) NOT NULL COMMENT '素材ID',
  used_count INT NOT NULL DEFAULT 0 COMMENT '使用次数',
  last_used TIMESTAMP NULL DEFAULT NULL COMMENT '最后使用时间',
  is_favorite TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否收藏',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (user_material_id),
  UNIQUE KEY uk_user_materials_user_material (user_id, material_id),
  KEY idx_user_materials_user_id (user_id),
  KEY idx_user_materials_material_id (material_id),
  KEY idx_user_materials_is_favorite (is_favorite),
  CONSTRAINT fk_user_materials_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE,
  CONSTRAINT fk_user_materials_material_id FOREIGN KEY (material_id) REFERENCES materials (material_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户素材表';

-- 十七、社区话题模块
-- 社区话题表 (topics)
-- 社区话题表(topics)用于存储用户在社区发布的话题讨论信息。topic_id是表的主键，通过user_id关联用户表，记录话题标题title和话题内容content。
CREATE TABLE IF NOT EXISTS topics (
  topic_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '话题ID',
  user_id BIGINT(20) NOT NULL COMMENT '作者ID',
  title VARCHAR(200) NOT NULL COMMENT '话题标题',
  content TEXT NOT NULL COMMENT '话题内容',
  tags JSON NULL COMMENT '标签',
  images JSON NULL COMMENT '图片',
  likes_count INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  comments_count INT NOT NULL DEFAULT 0 COMMENT '评论数',
  views_count INT NOT NULL DEFAULT 0 COMMENT '浏览数',
  is_essential BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否精华',
  is_sticky BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否置顶',
  is_selected BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否精选',
  status ENUM('draft','published','locked','deleted') NOT NULL DEFAULT 'published' COMMENT '状态',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (topic_id),
  KEY idx_topics_user_id (user_id),
  KEY idx_topics_status (status),
  KEY idx_topics_is_essential (is_essential),
  KEY idx_topics_is_sticky (is_sticky),
  KEY idx_topics_created_at (created_at),
  CONSTRAINT fk_topics_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='社区话题表';

-- 十八、群组帖子模块
-- 群组帖子表 (group_posts)
-- 群组帖子表(group_posts)用于存储用户在群组中发布的帖子信息。post_id是表的主键，通过group_id关联群组表，通过user_id关联用户表，记录帖子标题title和状态status。
CREATE TABLE IF NOT EXISTS group_posts (
  post_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '帖子ID',
  group_id BIGINT(20) NOT NULL COMMENT '群组ID',
  user_id BIGINT(20) NOT NULL COMMENT '作者ID',
  title VARCHAR(200) NOT NULL COMMENT '帖子标题',
  content TEXT NOT NULL COMMENT '帖子内容',
  images JSON NULL COMMENT '图片',
  tags JSON NULL COMMENT '标签',
  likes_count INT NOT NULL DEFAULT 0 COMMENT '点赞数',
  comments_count INT NOT NULL DEFAULT 0 COMMENT '评论数',
  views_count INT NOT NULL DEFAULT 0 COMMENT '浏览数',
  is_pinned BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否置顶',
  status ENUM('draft','published','locked','deleted') NOT NULL DEFAULT 'published' COMMENT '状态',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (post_id),
  KEY idx_group_posts_group_id (group_id),
  KEY idx_group_posts_user_id (user_id),
  KEY idx_group_posts_status (status),
  KEY idx_group_posts_created_at (created_at),
  CONSTRAINT fk_group_posts_group_id FOREIGN KEY (group_id) REFERENCES `groups` (group_id) ON DELETE CASCADE,
  CONSTRAINT fk_group_posts_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='群组帖子表';

-- 十九、收藏夹模块
-- 收藏夹表 (collections)
-- 收藏夹表(collections)用于存储用户创建的收藏夹信息。collection_id是表的主键，通过user_id关联用户表，记录收藏夹名称name和收藏数量items_count。
CREATE TABLE IF NOT EXISTS collections (
  collection_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '收藏夹ID',
  user_id BIGINT(20) NOT NULL COMMENT '用户ID',
  name VARCHAR(100) NOT NULL COMMENT '收藏夹名称',
  description TEXT NULL COMMENT '收藏夹描述',
  cover_image VARCHAR(255) NULL DEFAULT NULL COMMENT '封面图片',
  items_count INT NOT NULL DEFAULT 0 COMMENT '收藏数量',
  is_public BOOLEAN NOT NULL DEFAULT FALSE COMMENT '是否公开',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  -- 主键与索引
  PRIMARY KEY (collection_id),
  KEY idx_collections_user_id (user_id),
  KEY idx_collections_is_public (is_public),
  CONSTRAINT fk_collections_user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏夹表';

-- 收藏夹项目表 (collection_items)
-- 收藏夹项目表(collection_items)用于存储收藏夹中的具体项目信息。item_id是表的主键，通过collection_id关联收藏夹表，记录项目类型item_type和项目ID引用item_id_ref。
CREATE TABLE IF NOT EXISTS collection_items (
  item_id BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '项目ID',
  collection_id BIGINT(20) NOT NULL COMMENT '收藏夹ID',
  item_type ENUM('photograph','topic','group_post','tutorial') NOT NULL COMMENT '项目类型',
  item_id_ref BIGINT(20) NOT NULL COMMENT '项目ID引用',
  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  -- 主键与索引
  PRIMARY KEY (item_id),
  KEY idx_collection_items_collection_id (collection_id),
  KEY idx_collection_items_item_type (item_type),
  KEY idx_collection_items_item_id_ref (item_id_ref),
  CONSTRAINT fk_collection_items_collection_id FOREIGN KEY (collection_id) REFERENCES collections (collection_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏夹项目表';

SELECT 'PhotoShare 数据库创建脚本执行完成' AS message;
