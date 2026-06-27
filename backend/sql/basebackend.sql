/*
SQLyog Community v13.3.1 (64 bit)
MySQL - 8.0.44 : Database - citywalk
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`photoshare` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `photoshare`;

/*Table structure for table `post` */

DROP TABLE IF EXISTS `post`;

CREATE TABLE `post` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '内容',
  `tags` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签列表（json 数组）',
  `imageUrl` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '作品图片',
  `camera` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '相机',
  `lens` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '镜头',
  `aperture` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '光圈',
  `shutter` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '快门',
  `iso` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'ISO',
  `thumbNum` int NOT NULL DEFAULT '0' COMMENT '点赞数',
  `favourNum` int NOT NULL DEFAULT '0' COMMENT '收藏数',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_userId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='帖子';

/*Data for the table `post` */

INSERT INTO `post` (`id`, `title`, `content`, `tags`, `imageUrl`, `camera`, `lens`, `aperture`, `shutter`, `iso`, `thumbNum`, `favourNum`, `userId`, `createTime`, `updateTime`, `isDelete`) VALUES
(10001, '晨曦中的雪山之巅', '清晨五点半，我站在海拔4500米的垭口，等待第一缕阳光洒向雪山。当金色的光芒照亮峰顶的那一刻，所有的寒冷与疲惫都值得了。这张照片记录了大自然最壮美的瞬间。', '["风光","雪山","日出","自然","旅行"]', 'https://picsum.photos/seed/photo001/800/600', 'Sony A7R IV', 'Sony FE 24-70mm f/2.8 GM', 'f/8', '1/250s', 'ISO 100', 128, 56, 1935152147047858177, '2025-06-20 08:30:00', '2025-06-27 10:15:00', 0),
(10002, '城市夜色：霓虹与星光', '站在城市最高点，俯瞰万家灯火。车流如水，霓虹闪烁，这是都市独有的浪漫。用长曝光记录下光的轨迹，感受现代都市的脉搏。', '["城市","夜景","长曝光","建筑","街拍"]', 'https://picsum.photos/seed/photo002/800/600', 'Canon EOS R5', 'Canon RF 15-35mm f/2.8L IS', 'f/11', '30s', 'ISO 100', 256, 102, 1935152147047858177, '2025-06-21 22:15:00', '2025-06-27 11:20:00', 0),
(10003, '春日樱花烂漫时', '四月的京都，樱花盛开的季节。漫步在哲学之道，粉色的花瓣随风飘落，仿佛走进了童话世界。这是春天最美的礼物。', '["樱花","春天","日本","京都","旅行"]', 'https://picsum.photos/seed/photo003/800/600', 'Nikon Z7 II', 'Nikkor Z 50mm f/1.2 S', 'f/1.8', '1/1000s', 'ISO 200', 512, 234, 1938516975548272642, '2025-06-22 14:20:00', '2025-06-27 09:45:00', 0),
(10004, '海边落日余晖', '傍晚的海滩，夕阳将天空染成橙红色。海浪轻轻拍打着礁石，咸湿的海风吹拂着脸庞。这一刻，时间仿佛静止了。', '["海景","日落","海滩","自然","旅行"]', 'https://picsum.photos/seed/photo004/800/600', 'Fujifilm GFX 100S', 'GF 32-64mm f/4 R LM WR', 'f/8', '1/125s', 'ISO 400', 189, 78, 1938512849213009922, '2025-06-23 19:30:00', '2025-06-26 16:50:00', 0),
(10005, '老街巷里的烟火气', '走进这座千年古镇，青石板路、白墙黛瓦，还有街角飘来的茶香。每一个角落都在诉说着古老的故事，每一帧都是一幅画。', '["人文","古镇","街拍","旅行","生活"]', 'https://picsum.photos/seed/photo005/800/600', 'Leica Q2', 'Summilux 28mm f/1.7', 'f/2.8', '1/500s', 'ISO 400', 324, 145, 1938513000694493186, '2025-06-24 10:45:00', '2025-06-27 08:30:00', 0),
(10006, '星空下的银河', '远离城市的光污染，来到这片高原。抬头仰望，银河横跨天际，繁星如钻石般闪耀。宇宙的浩瀚让人心生敬畏。', '["星空","银河","风光","夜景","自然"]', 'https://picsum.photos/seed/photo006/800/600', 'Sony A7S III', 'Sony FE 14mm f/1.8 GM', 'f/1.8', '20s', 'ISO 6400', 678, 312, 1935152147047858177, '2025-06-25 02:15:00', '2025-06-27 13:25:00', 0),
(10007, '秋日枫叶红似火', '深秋的香山，层林尽染，漫山遍野的红叶如火焰般燃烧。阳光透过树叶洒下斑驳的光影，这是秋天最绚烂的告别。', '["秋天","枫叶","风光","自然","旅行"]', 'https://picsum.photos/seed/photo007/800/600', 'Canon EOS 5D Mark IV', 'Canon EF 70-200mm f/2.8L IS II', 'f/5.6', '1/250s', 'ISO 200', 267, 123, 1938516975548272642, '2025-06-26 11:30:00', '2025-06-27 10:00:00', 0),
(10008, '人像：窗边的少女', '窗边的自然光总是最柔美的。侧光勾勒出面部轮廓，眼神中带着淡淡的忧伤。这是一次关于情绪和光影的探索。', '["人像","光影","室内","情绪","写真"]', 'https://picsum.photos/seed/photo008/800/600', 'Canon EOS R6', 'Canon RF 85mm f/1.2L USM', 'f/1.4', '1/200s', 'ISO 100', 891, 456, 1938512849213009922, '2025-06-27 15:00:00', '2025-06-27 16:40:00', 0),
(10009, '雾中仙境张家界', '清晨的张家界被浓雾笼罩，山峰若隐若现，宛如仙境。云雾在山间流动，阳光穿透云层洒下一束束光芒，美不胜收。', '["风光","山水","雾景","自然","旅行"]', 'https://picsum.photos/seed/photo009/800/600', 'Nikon D850', 'Nikkor 24-70mm f/2.8E ED VR', 'f/11', '1/60s', 'ISO 100', 445, 201, 1935152147047858177, '2025-06-18 07:20:00', '2025-06-25 14:10:00', 0),
(10010, '街头巷尾的咖啡香', '周末的午后，找一家藏在巷子里的咖啡店。点一杯手冲，看着窗外人来人往，享受这份难得的悠闲时光。', '["生活","咖啡","街拍","人文","城市"]', 'https://picsum.photos/seed/photo010/800/600', 'Fujifilm X-T4', 'XF 23mm f/1.4 R', 'f/2', '1/250s', 'ISO 800', 178, 87, 1938513000694493186, '2025-06-19 16:00:00', '2025-06-26 11:30:00', 0),
(10011, '草原上的骏马', '辽阔的草原上，骏马在自由奔跑。蓝天白云下，风吹草低见牛羊。这是最原始、最纯粹的自然之美。', '["动物","草原","风光","自然","旅行"]', 'https://picsum.photos/seed/photo011/800/600', 'Sony A9 II', 'Sony FE 100-400mm f/4.5-5.6 GM OSS', 'f/8', '1/1000s', 'ISO 400', 234, 109, 1939569854321205250, '2025-06-20 09:45:00', '2025-06-27 08:15:00', 0),
(10012, '古建筑的光影之美', '故宫的红墙黄瓦，在夕阳的映照下更加庄严肃穆。几百年的历史沉淀在每一块砖石之中，光影流转，仿佛诉说着过往。', '["建筑","故宫","历史","光影","旅行"]', 'https://picsum.photos/seed/photo012/800/600', 'Sony A7C', 'Sony FE 16-35mm f/2.8 GM', 'f/8', '1/200s', 'ISO 100', 567, 278, 1935152147047858177, '2025-06-21 17:30:00', '2025-06-27 12:00:00', 0),
(10013, '水下世界的奥秘', '潜入深蓝，进入另一个世界。五彩斑斓的珊瑚，悠然游过的鱼群，还有那透过水面洒下的光束。这是一场无声的对话。', '["水下","海洋","自然","生态","旅行"]', 'https://picsum.photos/seed/photo013/800/600', 'Olympus TG-6', '内置 4.5-18mm f/2-4.9', 'f/4', '1/125s', 'ISO 200', 389, 167, 1938516975548272642, '2025-06-22 14:10:00', '2025-06-26 18:45:00', 0),
(10014, '微距：露珠里的世界', '清晨的草地上，一颗颗晶莹的露珠挂在叶尖。透过微距镜头，每一颗露珠都是一个小小的世界，折射出大自然的奇妙。', '["微距","露珠","自然","生态","静物"]', 'https://picsum.photos/seed/photo014/800/600', 'Canon EOS R', 'Canon RF 100mm f/2.8L Macro IS', 'f/8', '1/250s', 'ISO 100', 198, 92, 1938512849213009922, '2025-06-23 06:30:00', '2025-06-27 09:20:00', 0),
(10015, '火车旅行的浪漫', '绿皮火车慢悠悠地穿行在山野之间，窗外的风景如画卷般展开。这不仅是一次旅行，更是一种生活态度的回归。', '["旅行","火车","风光","人文","怀旧"]', 'https://picsum.photos/seed/photo015/800/600', 'Leica M10-R', 'Summicron 35mm f/2', 'f/5.6', '1/500s', 'ISO 400', 276, 134, 1938513000694493186, '2025-06-24 13:00:00', '2025-06-26 20:30:00', 0),
(10016, '雪山下的湖泊', '碧蓝的湖水倒映着雪山，天空如洗，云朵悠然。站在湖边，感受着大自然的宁静与壮美，心灵也得到了净化。', '["风光","湖泊","雪山","自然","旅行"]', 'https://picsum.photos/seed/photo016/800/600', 'Nikon Z6 II', 'Nikkor Z 14-24mm f/2.8 S', 'f/11', '1/125s', 'ISO 100', 423, 198, 1939569854321205250, '2025-06-25 11:15:00', '2025-06-27 07:50:00', 0),
(10017, '街角的流浪猫', '城市的角落里，总有一些毛茸茸的身影。这只橘猫懒洋洋地晒着太阳，眯着眼睛打盹，完全不理会过往的行人。', '["动物","猫","街拍","城市","生活"]', 'https://picsum.photos/seed/photo017/800/600', 'Fujifilm X-Pro3', 'XF 56mm f/1.2 R', 'f/1.8', '1/500s', 'ISO 800', 534, 267, 1935152147047858177, '2025-06-26 15:40:00', '2025-06-27 10:45:00', 0),
(10018, '雨后彩虹', '一场雷雨过后，天空出现了一道绚丽的彩虹。七色的光带横跨天际，给城市披上了一件梦幻的外衣。', '["彩虹","天气","城市","风光","自然"]', 'https://picsum.photos/seed/photo018/800/600', 'Sony A7 IV', 'Sony FE 24-105mm f/4 G OSS', 'f/8', '1/250s', 'ISO 200', 312, 145, 1938516975548272642, '2025-06-27 17:20:00', '2025-06-27 18:00:00', 0),
(10019, '美食：精致的寿司', '新鲜的食材，精湛的手艺，每一贯寿司都是一件艺术品。入口即化的口感，配上温热的清酒，这就是幸福的味道。', '["美食","寿司","日本","静物","生活"]', 'https://picsum.photos/seed/photo019/800/600', 'Canon EOS M6 Mark II', 'EF-M 32mm f/1.4 STM', 'f/2.8', '1/125s', 'ISO 400', 167, 78, 1938512849213009922, '2025-06-18 19:00:00', '2025-06-25 21:30:00', 0),
(10020, '梯田的曲线之美', '层层叠叠的梯田，如大地的指纹。从山顶俯瞰，蜿蜒的曲线勾勒出一幅壮美的画卷。这是人类与自然共同创造的杰作。', '["风光","梯田","人文","自然","旅行"]', 'https://picsum.photos/seed/photo020/800/600', 'DJI Mavic 3', '哈苏 L2D-20c', 'f/4', '1/500s', 'ISO 100', 489, 223, 1938513000694493186, '2025-06-19 10:30:00', '2025-06-27 08:40:00', 0),
(10021, '冬日雪景', '白雪皑皑，银装素裹。整个世界都变得安静而纯净。踩在雪地上，咯吱作响，这是冬天独有的旋律。', '["冬天","雪景","风光","自然","旅行"]', 'https://picsum.photos/seed/photo021/800/600', 'Sony A7R V', 'Sony FE 24-70mm f/2.8 GM II', 'f/8', '1/500s', 'ISO 100', 245, 112, 1939569854321205250, '2025-06-20 09:15:00', '2025-06-26 15:20:00', 0),
(10022, '沙漠中的驼队', '金色的沙丘连绵起伏，夕阳下的驼队缓缓前行。驼铃声声，在空旷的沙漠中回荡，仿佛穿越了千年时光。', '["沙漠","风光","人文","旅行","自然"]', 'https://picsum.photos/seed/photo022/800/600', 'Canon EOS R3', 'Canon RF 24-105mm f/4L IS USM', 'f/8', '1/500s', 'ISO 100', 367, 178, 1935152147047858177, '2025-06-21 18:45:00', '2025-06-27 11:10:00', 0),
(10023, '婚礼上的新娘', '洁白的婚纱，幸福的笑容。这是女人一生中最美的时刻。在亲友的祝福中，她走向了人生的下一段旅程。', '["婚礼","人像","幸福","纪实","情感"]', 'https://picsum.photos/seed/photo023/800/600', 'Sony A7 IV', 'Sony FE 85mm f/1.4 GM', 'f/1.8', '1/320s', 'ISO 200', 678, 345, 1938516975548272642, '2025-06-22 16:30:00', '2025-06-27 13:50:00', 0),
(10024, '云海日出', '站在高山之巅，脚下是翻涌的云海，东方的天空渐渐泛起鱼肚白。当太阳跃出云层的那一刻，整个世界都被照亮了。', '["云海","日出","风光","山景","自然"]', 'https://picsum.photos/seed/photo024/800/600', 'Nikon Z9', 'Nikkor Z 24-70mm f/2.8 S', 'f/8', '1/250s', 'ISO 100', 534, 267, 1938512849213009922, '2025-06-23 05:45:00', '2025-06-26 17:30:00', 0),
(10025, '花卉摄影：牡丹', '国色天香，花中之王。牡丹的雍容华贵，在镜头下展现得淋漓尽致。每一片花瓣都散发着迷人的芬芳。', '["花卉","牡丹","静物","自然","生态"]', 'https://picsum.photos/seed/photo025/800/600', 'Canon EOS 90D', 'Canon EF 100mm f/2.8L Macro IS', 'f/5.6', '1/250s', 'ISO 100', 189, 89, 1938513000694493186, '2025-06-24 10:20:00', '2025-06-27 09:55:00', 0),
(10026, '城市天桥上的行人', '下班高峰的天桥上，人来人往，行色匆匆。每个人都在为生活奔波，这是城市最真实的模样。', '["街拍","城市","人文","生活","黑白"]', 'https://picsum.photos/seed/photo026/800/600', 'Ricoh GR III', 'GR 18.3mm f/2.8', 'f/5.6', '1/500s', 'ISO 400', 234, 110, 1939569854321205250, '2025-06-25 18:10:00', '2025-06-26 22:15:00', 0),
(10027, '瀑布的气势磅礴', '飞流直下三千尺，疑是银河落九天。站在瀑布前，感受着水花的飞溅和震耳的轰鸣，大自然的力量令人震撼。', '["瀑布","风光","自然","山水","旅行"]', 'https://picsum.photos/seed/photo027/800/600', 'Sony A7R IVA', 'Sony FE 16-35mm f/4 ZA OSS', 'f/11', '1/4s', 'ISO 100', 378, 182, 1935152147047858177, '2025-06-26 14:00:00', '2025-06-27 12:30:00', 0),
(10028, '咖啡拉花艺术', '一杯好的咖啡，不仅要美味，还要有颜值。拉花师用灵巧的双手，在奶泡上画出一幅幅精美的图案。', '["咖啡","美食","静物","生活","艺术"]', 'https://picsum.photos/seed/photo028/800/600', 'Panasonic Lumix S5', 'Lumix S 50mm f/1.8', 'f/2.8', '1/125s', 'ISO 200', 156, 73, 1938516975548272642, '2025-06-27 10:45:00', '2025-06-27 11:20:00', 0),
(10029, '森林中的小木屋', '密林深处，一座小木屋静静地矗立着。烟囱里飘出袅袅炊烟，门前的花园种满了鲜花。这是童话里才有的场景。', '["森林","木屋","风光","自然","旅行"]', 'https://picsum.photos/seed/photo029/800/600', 'Fujifilm GFX 50S II', 'GF 45-100mm f/4 R LM OIS WR', 'f/8', '1/125s', 'ISO 100', 298, 145, 1938512849213009922, '2025-06-18 16:30:00', '2025-06-25 19:40:00', 0),
(10030, '烟花绽放的夜晚', '节日的夜空，烟花绽放，绚烂夺目。虽然只有短暂的美丽，却将最灿烂的一刻留给了人间。', '["烟花","夜景","节日","城市","风光"]', 'https://picsum.photos/seed/photo030/800/600', 'Canon EOS 6D Mark II', 'Canon EF 24-105mm f/3.5-5.6 IS STM', 'f/8', '4s', 'ISO 100', 412, 198, 1938513000694493186, '2025-06-19 21:00:00', '2025-06-27 08:00:00', 0);

/*Table structure for table `post_favour` */

DROP TABLE IF EXISTS `post_favour`;

CREATE TABLE `post_favour` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `postId` bigint NOT NULL COMMENT '帖子 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_postId` (`postId`) USING BTREE,
  KEY `idx_userId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='帖子收藏';

/*Data for the table `post_favour` */

/*Table structure for table `post_thumb` */

DROP TABLE IF EXISTS `post_thumb`;

CREATE TABLE `post_thumb` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `postId` bigint NOT NULL COMMENT '帖子 id',
  `userId` bigint NOT NULL COMMENT '创建用户 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_postId` (`postId`) USING BTREE,
  KEY `idx_userId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='帖子点赞';

/*Data for the table `post_thumb` */

/*Table structure for table `comment` */

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `postId` bigint NOT NULL COMMENT '帖子 id',
  `userId` bigint NOT NULL COMMENT '用户 id',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT '内容',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_postId` (`postId`) USING BTREE,
  KEY `idx_userId` (`userId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='评论';

/*Data for the table `comment` */

/*Table structure for table `follow` */

DROP TABLE IF EXISTS `follow`;

CREATE TABLE `follow` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `followerId` bigint NOT NULL COMMENT '关注者 id',
  `followeeId` bigint NOT NULL COMMENT '被关注者 id',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_followerId` (`followerId`) USING BTREE,
  KEY `idx_followeeId` (`followeeId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='关注';

/*Data for the table `follow` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `userAccount` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '账号',
  `userPassword` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码',
  `unionId` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '微信开放平台id',
  `mpOpenId` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '公众号openId',
  `userName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户昵称',
  `userAvatar` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像',
  `userProfile` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户简介',
  `userRole` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT '用户角色：user/admin/ban',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `isDelete` tinyint NOT NULL DEFAULT '0' COMMENT '是否删除',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `idx_unionId` (`unionId`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2015629289921245186 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='用户';

/*Data for the table `user` */

insert  into `user`(`id`,`userAccount`,`userPassword`,`unionId`,`mpOpenId`,`userName`,`userAvatar`,`userProfile`,`userRole`,`createTime`,`updateTime`,`isDelete`) values 
(1935152147047858177,'zhangsan','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'张三',NULL,NULL,'admin','2025-06-18 09:46:39','2025-06-27 14:03:30',0),
(1938481258256347138,'zhangsan1','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'222222222222','',NULL,'user','2025-06-27 14:15:21','2025-06-27 14:16:22',0),
(1938481322349506561,'zhangsan1','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'111','',NULL,'user','2025-06-27 14:15:37','2025-06-27 14:17:12',1),
(1938512849213009922,'lisi','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,NULL,NULL,NULL,'user','2025-06-27 16:20:53','2025-06-27 16:20:53',0),
(1938513000694493186,'wangwu','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,NULL,NULL,NULL,'user','2025-06-27 16:21:29','2025-06-27 16:21:29',0),
(1938516975548272642,'zhangziyi','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'章子怡',NULL,NULL,'user','2025-06-27 16:37:17','2025-06-27 16:37:17',0),
(1939569854321205250,'wangwang','b03d227f78c0c79334fca76e7b8eb46a',NULL,NULL,'王王',NULL,NULL,'user','2025-06-30 14:21:03','2025-06-30 14:21:03',0),
(2015629289921245185,'13070849125','14c8f4f580cb3653f62466011e59feaa',NULL,NULL,'13070849125',NULL,NULL,'user','2026-01-26 11:34:05','2026-01-26 11:34:05',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
