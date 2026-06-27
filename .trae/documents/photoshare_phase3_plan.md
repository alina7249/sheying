# 摄影社区项目 - 第三批&第四批&第五批 实施计划

## 项目概述

本计划涵盖搜索排序功能、社区统计修复、Footer 收尾、UI/UX 全面美化、后端配置优化等多个模块的改造工作。

---

## 第一批：功能修复与补全

### 1.1 搜索排序功能（SearchResult.vue）

**目标**：为搜索结果页面添加排序选项，支持按相关度、最新发布、最受欢迎排序。

**涉及文件**：
- `fronted/src/pages/SearchResult.vue`
- `fronted/src/services/api.ts`

**改动步骤**：

1. **api.ts 修改**：
   - 扩展 `searchPosts` 函数参数，增加 `sortField?` 和 `sortOrder?` 可选参数
   - 请求时将排序参数传入后端

2. **SearchResult.vue 状态管理**：
   - 新增 `currentSort` ref，默认值 `'relevance'`
   - 定义排序选项配置：
     - `relevance`：相关度（不传排序参数）
     - `latest`：最新发布（sortField: 'createTime', sortOrder: 'descend'）
     - `popular`：最受欢迎（sortField: 'thumbNum', sortOrder: 'descend'）

3. **UI 组件**：
   - 在搜索框下方添加排序选项栏
   - 3 个胶囊形按钮：相关度、最新发布、最受欢迎
   - 选中状态高亮显示
   - 与现有暗色主题保持一致

4. **交互逻辑**：
   - 点击排序按钮切换 `currentSort`
   - 切换时重置页码为 1，重新执行搜索
   - `performSearch` 函数根据 `currentSort` 决定是否传入排序参数

---

### 1.2 Community.vue 统计数据修复

**目标**：移除不准确的统计数字，避免误导用户。

**涉及文件**：
- `fronted/src/pages/Community.vue`

**改动方案**（采用推荐方案：隐藏不准确数据）：

1. **移除统计数据卡片**：
   - 删除"摄影作品"和"社区成员"两个统计卡片
   - 或改为仅保留"摄影作品"（total 来自后端，是真实的），删除"社区成员"

2. **移除"本页活跃作者"侧边栏**：
   - 该数据仅基于当前页帖子提取，非全站统计
   - 标题已标注"本页"，但仍可能造成误解，建议移除

3. **保留模块**：
   - 作品列表（真实数据）
   - 热门标签（后端接口 `getHotTags`，真实数据）
   - 搜索框

---

## 第三批：Footer 收尾

### 3.1 快速链接确认

**目标**：确认 Footer 中快速链接的路由正常工作。

**涉及文件**：
- `fronted/src/components/Footer.vue`

**检查项**：
- 首页 `/` — `router-link to="/"` ✓ 已正确配置
- 社区 `/community` — `router-link to="/community"` ✓ 已正确配置
- 上传作品 `/publish` — `router-link to="/publish"` ✓ 已正确配置
- 其他链接（赛事、器材交易）已用 `v-if="false"` 隐藏，保持现状

---

### 3.2 社交分享图标改为真实分享链接

**目标**：将社交图标从 toast 提示改为真实的分享链接。

**当前状态分析**：
- 微博分享：已实现真实分享链接（`shareToWeibo` 调用 window.open）
- 微信分享：当前是 toast 提示（微信需要扫码，无法直接跳转分享页）
- QQ 分享：已实现真实分享链接（`shareToQQ` 调用 window.open）

**改动方案**：
- 微博：保持现状（已正确）
- 微信：保持 toast 提示（微信分享必须扫码，这是正确做法），但可以优化提示文案为"请使用微信扫描二维码分享"
- QQ：保持现状（已正确）
- 三个图标的 `href="#"` 和 `@click.prevent` 模式是合理的，保持不变

---

## 第四批：UI/UX 全面美化优化

### 4.1 整体风格与字体

**目标**：打造暗色沉浸式画廊风格。

**涉及文件**：
- `fronted/src/index.css`（全局样式）
- `fronted/index.html`（Google Fonts 引入）
- `fronted/tailwind.config.js`（主题配置）

**改动步骤**：

1. **引入 Google Fonts**：
   - 在 `index.html` 的 `<head>` 中添加 Playfair Display 和 Inter 字体链接
   - Playfair Display 用于标题（衬线体，编辑质感）
   - Inter 用于正文

2. **Tailwind 配置**：
   - 在 `tailwind.config.js` 中配置字体家族
   - 扩展颜色调色板（深炭灰背景、金色/琥珀色强调色）

3. **全局样式**：
   - 背景色统一为 `#0a0a0a` 或 `#111827`
   - 文字用低饱和度灰色
   - 大标题收紧字距（tracking-tight）
   - 小标题和标签用 sentence case

---

### 4.2 首页优化

**涉及文件**：
- `fronted/src/pages/Home.vue`

**改动项**：

1. **Hero 区域**：
   - 全屏精选作品大图作为背景
   - 半透明黑色遮罩（渐变）
   - 网站名和 slogan 叠加在图片上
   - 当前已有 hero 区域，但背景是纯色渐变，需要换成真实图片背景

2. **分类筛选按钮**：
   - 从方形按钮改为胶囊形标签（pill shape）
   - 选中时加金色/琥珀色底色
   - 当前已有类似设计，可进一步优化

3. **作品卡片**：
   - 去掉白色边框，只保留图片+标题+作者信息
   - hover 时图片轻微放大 + 阴影加深
   - 当前 PhotographyCard 已有边框，需调整

4. **加载更多按钮**：
   - 改为加载动画（转圈或脉冲效果）
   - 不要普通文字按钮
   - 滚动到底部自动加载或使用 Intersection Observer

---

### 4.3 作品详情页优化

**涉及文件**：
- `fronted/src/pages/PhotoDetail.vue`（需先确认文件）

**改动项**：

1. **布局**：
   - 左侧 60-65%：大图
   - 右侧 35-40%：作者信息 + EXIF 参数 + 评论
   - 画册翻页质感

2. **EXIF 参数展示**：
   - 相机/镜头/光圈/快门/ISO
   - 等宽字体（monospace）
   - 小字号、灰色标签样式

3. **评论区**：
   - 头像圆形
   - 评论内容字号适中
   - 时间显示为相对时间（如"3小时前"）

---

### 4.4 个人主页优化

**涉及文件**：
- `fronted/src/pages/Profile.vue`

**改动项**：

1. **顶部封面区**：
   - 大背景图（封面图）
   - 头像叠加在封面下方，类似 Instagram 风格
   - 当前已有渐变背景，可增强

2. **作品墙**：
   - 不规则网格（masonry）布局
   - 照片有横有竖更自然
   - 当前是等高网格，需改造

3. **粉丝/关注数**：
   - 大字号居中显示
   - 当前已有，可优化样式

---

### 4.5 通用交互优化

**涉及文件**：
- 全局样式及各组件

**改动项**：

1. **按钮状态**：
   - 所有按钮加 hover 状态（背景色变化 + transition 200ms）
   - 所有按钮加 active 反馈（scale(0.97) 或 translateY(1px)）

2. **图片加载**：
   - 图片加载时显示骨架屏占位
   - 避免白屏闪烁
   - 当前已有 LazyImage 组件，确认其骨架屏效果

3. **滚动动画**：
   - 页面滚动进入视口时，卡片有淡入上移动画
   - staggered entry（错开延迟）效果

4. **导航栏**：
   - 滚动一定距离后加毛玻璃背景（backdrop-filter: blur）
   - 当前 Header.vue 需确认并增强

---

### 4.6 响应式适配

**改动项**：

1. **移动端导航**：
   - 汉堡菜单（如未实现则添加）
   - 侧滑抽屉或下拉菜单

2. **作品详情页**：
   - 移动端改为上下布局（上面大图，下面信息）

3. **瀑布流**：
   - 移动端单列
   - 平板双列
   - 桌面三列

---

### 4.7 组件复用与抽离

**新组件**：

1. **PhotoCard.vue**（或复用 PhotographyCard.vue）：
   - 首页和社区页的作品卡片样式统一
   - 当前已用 PhotographyCard，确认是否需要重命名或优化

2. **UserBrief.vue**：
   - 用户信息展示（头像+昵称+简介）
   - Profile.vue 和 PhotoDetail.vue 复用

3. **CommentSection.vue**：
   - 评论列表+评论输入框
   - 统一组件，避免各页面重复

---

## 第五批：后端配置优化

### 5.1 application.yml 配置确认

**涉及文件**：
- `backend/src/main/resources/application.yml`

**检查与调整项**：

1. **Redis**：保持注释状态 ✓（当前已注释）
2. **Elasticsearch**：保持注释状态 ✓（当前已注释）
3. **COS 对象存储**：保持注释状态 ✓（当前已注释，文件上传已改成本地存储）
4. **微信配置**：保持占位 ✓（当前有占位配置）
5. **文件上传**：
   - `spring.servlet.multipart.max-file-size: 10MB` ✓ 已配置
   - 本地存储路径在 FileConstant.java 中：`/tmp/photoshare/upload` ✓

---

### 5.2 CORS 配置确认

**涉及文件**：
- `backend/src/main/java/com/yupi/yuoj/config/CorsConfig.java`

**当前状态**：
- `.allowedOriginPatterns("*")` — 允许所有域名
- `.allowCredentials(true)` — 允许携带 Cookie
- `.allowedHeaders("*")` — 允许所有 header
- `.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")` — 允许所有常用方法

**结论**：
- 当前配置已允许 http://localhost:5173 和 http://localhost:5174 跨域
- 允许携带 Cookie 和 Authorization header ✓
- 配置正确，无需修改

---

### 5.3 文件上传访问

**涉及文件**：
- `backend/src/main/java/com/yupi/yuoj/controller/FileController.java`
- `backend/src/main/java/com/yupi/yuoj/constant/FileConstant.java`

**当前状态分析**：
- 文件上传后保存在 `/tmp/photoshare/upload/{biz}/{userId}/{filename}`
- 返回的访问 URL 格式：`http://localhost:8121/api/file/download/{biz}/{userId}/{filename}`
- 已有 `GET /file/download/{biz}/{userId}/{filename}` 接口提供文件访问
- 通过 Controller 接口流式返回文件内容，不需要静态资源映射

**结论**：
- 文件上传和访问机制已完整实现 ✓
- 前端可以通过返回的 URL 访问图片 ✓
- 无需额外配置静态资源映射

---

### 5.4 删除不需要的代码

**涉及文件/目录**：
- `backend/src/main/java/com/yupi/yuoj/controller/WxMpController.java`
- `backend/src/main/java/com/yupi/yuoj/wxmp/` 整个包
- `backend/src/main/java/com/yupi/yuoj/esdao/PostEsDao.java`

**处理方案**（保守方案）：
- 不删除文件，避免后续需要时恢复困难
- WxMpController 的路由本来就需要微信配置才能生效，当前配置是占位值，不会实际生效
- PostEsDao 在 ES 未启用时不会被调用
- 建议保留代码，仅注释掉相关 bean 的创建（如果有 @Component 等注解）

**更激进方案**（用户确认后执行）：
- 直接删除 wxmp 包和 WxMpController.java
- 保留 PostEsDao（ES 以后可能启用）

---

## 实施顺序建议

由于改动量较大，建议按以下优先级分批实施：

### 优先级 P0（必须先做）
1. 搜索排序功能
2. Community.vue 统计数据修复
3. Footer 收尾确认

### 优先级 P1（核心体验）
4. 整体风格与字体
5. 首页优化
6. 通用交互优化（按钮、动画、骨架屏）

### 优先级 P2（页面美化）
7. 作品详情页优化
8. 个人主页优化
9. 响应式适配

### 优先级 P3（架构优化）
10. 组件复用与抽离
11. 后端配置确认与清理

---

## 风险与注意事项

1. **样式改动风险**：UI 美化涉及大量样式调整，可能影响现有页面布局。建议每页改动后立即测试。
2. **组件抽离风险**：抽离公共组件时需确保各调用方的 props 和事件兼容。
3. **后端代码删除风险**：删除微信相关代码前确认没有其他地方依赖。
4. **字体加载**：Google Fonts 在国内可能加载较慢，考虑备用方案（系统字体回退）。
5. **Masonry 布局**：不规则网格布局实现较复杂，可用 CSS columns 或第三方库（如 vue-masonry）。

---

## 验收标准

- [ ] 搜索结果页有 3 个排序按钮，切换后结果正确排序
- [ ] Community.vue 不再显示不准确的统计数字
- [ ] Footer 链接可正常跳转，社交分享功能正常
- [ ] 整体风格统一为暗色沉浸式画廊风格
- [ ] 各页面交互有流畅的 hover/active 反馈
- [ ] 图片加载有骨架屏，无白屏闪烁
- [ ] 移动端适配良好
- [ ] 后端配置正确，文件上传可正常访问
