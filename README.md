# 📸 摄影分享平台 - PhotoShare Vue

> 一个专业的摄影作品分享与交流平台，基于 Vue 3 + TypeScript + Tailwind CSS 构建

## ✨ 平台特色

### 🎨 视觉设计
- **深邃优雅的暗色主题**：采用专业的深色配色方案，保护眼睛同时提升图片展示效果
- **流畅的交互动效**：精心设计的动画效果，包括淡入、移动、缩放等过渡动画
- **响应式布局**：完美适配桌面端、平板和移动端设备

### 📱 核心功能
- **作品库**：瀑布流展示摄影作品，支持分类筛选
- **器材中心**：二手/全新器材交易平台，专业验机保障
- **在线课程**：丰富的摄影教程和技巧分享
- **摄影社区**：与其他摄影师交流互动
- **AI助手**：智能摄影建议和问题解答
- **活动赛事**：摄影比赛和活动信息

### 🛠️ 技术栈
- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全的编程语言
- **Vue Router** - 客户端路由管理
- **Pinia** - 状态管理
- **Tailwind CSS** - 原子化 CSS 框架
- **Chart.js** - 数据可视化
- **Vite** - 下一代前端构建工具

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm
pnpm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173 查看应用

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
photoshare-vue/
├── public/                 # 静态资源
│   ├── icons/             # PWA 图标
│   ├── screenshots/       # 应用截图
│   ├── robots.txt         # 搜索引擎爬虫规则
│   ├── sitemap.xml        # 网站地图
│   ├── manifest.json      # PWA 应用清单
│   ├── sw.js             # Service Worker
│   ├── offline.html       # 离线页面
│   ├── privacy.html       # 隐私政策
│   ├── terms.html         # 服务条款
│   └── image-preview.html # 图片预览页面
├── src/
│   ├── assets/           # 资源文件
│   │   └── styles/       # 全局样式
│   ├── components/       # Vue 组件
│   │   ├── common/        # 通用组件
│   │   │   └── Button.vue # 按钮组件
│   │   ├── Animations.vue # 动画样式
│   │   ├── LazyImage.vue  # 懒加载图片
│   │   ├── EquipmentCard.vue    # 器材卡片
│   │   ├── PostCard.vue         # 帖子卡片
│   │   ├── BaseModal.vue        # 模态框
│   │   ├── FilterSection.vue    # 筛选区块
│   │   ├── UserCard.vue         # 用户卡片
│   │   ├── Header.vue           # 页头
│   │   ├── Footer.vue           # 页脚
│   │   ├── Banner.vue           # 轮播图
│   │   ├── Feature.vue          # 功能展示
│   │   ├── PhotographyCard.vue  # 摄影卡片
│   │   ├── EquipmentComparisonChart.vue # 器材对比图
│   │   ├── ContactSellerModal.vue      # 联系卖家弹窗
│   │   ├── PublishEquipmentForm.vue    # 发布器材表单
│   │   └── EquipmentDetail.vue         # 器材详情
│   ├── composables/       # Vue Composables
│   │   ├── useSeo.ts     # SEO 优化
│   │   └── useAuth.ts    # 认证逻辑
│   ├── pages/            # 页面组件
│   │   ├── Home.vue             # 首页
│   │   ├── EquipmentHub.vue      # 器材中心
│   │   ├── EquipmentDatabase.vue # 器材库
│   │   ├── EquipmentTrade.vue    # 器材交易
│   │   ├── OnlineCourses.vue     # 在线课程
│   │   ├── Community.vue        # 社区
│   │   ├── Resources.vue        # 资源
│   │   ├── AIChat.vue           # AI 助手
│   │   ├── EventsContests.vue   # 活动赛事
│   │   └── NotFound.vue         # 404 页面
│   ├── store/            # Pinia 状态管理
│   │   ├── authStore.ts  # 认证状态
│   │   └── chatStore.ts  # 聊天状态
│   ├── router/           # Vue Router 配置
│   │   └── index.ts
│   ├── lib/              # 工具函数
│   │   └── equipmentData.ts
│   ├── App.vue           # 根组件
│   └── main.ts           # 应用入口
├── index.html            # HTML 入口
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
├── tailwind.config.js    # Tailwind CSS 配置
└── postcss.config.js     # PostCSS 配置
```

## 🎯 组件系统

### 通用组件

#### Button 组件
```vue
<template>
  <Button 
    variant="primary" 
    size="md"
    :disabled="false"
    @click="handleClick"
    ariaLabel="按钮描述"
  >
    <span>按钮文本</span>
  </Button>
</template>
```

#### LazyImage 组件
```vue
<template>
  <LazyImage 
    :src="imageUrl" 
    :alt="imageAlt"
    :lazy="true"
  />
</template>
```

### 业务组件

#### EquipmentCard 组件
```vue
<template>
  <EquipmentCard
    :item="equipmentData"
    :trade-type="'used'"
    @view-detail="handleViewDetail"
    @contact="handleContact"
  />
</template>
```

#### PostCard 组件
```vue
<template>
  <PostCard
    :post="postData"
    @click="handlePostClick"
    @like="handleLike"
    @comment="handleComment"
  />
</template>
```

## 🌐 SEO 优化

项目包含完整的 SEO 支持：

- **Meta 标签**：自动生成 title、description、keywords
- **Open Graph**：社交媒体分享优化
- **Twitter Cards**：Twitter 分享支持
- **结构化数据**：Schema.org JSON-LD
- **Sitemap**：自动生成网站地图
- **Robots.txt**：搜索引擎爬虫规则

### 使用 SEO Composable

```typescript
import { useSEO } from '@/composables/useSeo';

const { updateMeta } = useSEO();

updateMeta({
  title: '页面标题',
  description: '页面描述',
  keywords: '关键词1, 关键词2',
  ogImage: '/images/share.png',
  ogType: 'website',
  twitterCard: 'summary_large_image'
});
```

## 📱 PWA 支持

项目已配置完整的 PWA 功能：

- **Service Worker**：离线缓存、推送通知
- **Web App Manifest**：可安装到桌面
- **离线页面**：网络断开时显示友好提示
- **应用快捷方式**：快速访问核心功能

### 安装应用

在支持的浏览器中，网站会显示"添加到主屏幕"的提示，或手动访问：

```
设置 > 添加到主屏幕
```

## 🔒 安全与隐私

### 安全措施
- HTTPS 强制使用
- Content Security Policy (CSP) 配置
- XSS 和 CSRF 防护
- 敏感数据加密存储

### 合规文档
- [隐私政策](/privacy.html)
- [服务条款](/terms.html)
- [Cookie 使用说明](/cookies.html)

## 🧪 测试

### 运行单元测试

```bash
npm run test
```

### 运行端到端测试

```bash
npm run test:e2e
```

## 📈 性能优化

项目采用多种性能优化策略：

1. **代码分割**：自动按路由分割代码
2. **Tree Shaking**：移除未使用的代码
3. **图片懒加载**：减少首屏加载时间
4. **CDN 加速**：静态资源使用 CDN
5. **Gzip 压缩**：减小传输体积
6. **缓存策略**：合理的缓存配置

## 🌐 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Tailwind CSS](https://tailwindcss.com/) - 原子化 CSS 框架
- [Picsum Photos](https://picsum.photos/) - 免费高质量图片服务
- [Font Awesome](https://fontawesome.com/) - 图标库

## 📞 联系方式

- 📧 邮箱：support@photoshare.example.com
- 💬 在线客服：访问我们的官方网站
- 📞 电话：400-123-4567

## 🔗 相关链接

- [官方文档](https://docs.photoshare.example.com)
- [API 文档](https://api.photoshare.example.com)
- [用户论坛](https://forum.photoshare.example.com)
- [开发者博客](https://blog.photoshare.example.com)

---

<p align="center">
  <strong>Made with ❤️ by PhotoShare Team</strong>
  <br>
  <small>© 2024-2025 摄影分享平台. 保留所有权利.</small>
</p>
