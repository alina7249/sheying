# 贡献指南

感谢您对摄影分享平台的关注！🎉

本指南将帮助您了解如何为项目做出贡献。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发环境设置](#开发环境设置)
- [编码规范](#编码规范)
- [提交信息规范](#提交信息规范)
- [Pull Request 流程](#pull-request-流程)

## 行为准则

我们期望所有贡献者都能遵守以下行为准则：

- **友好和包容**：尊重所有参与者，无论其背景如何
- **专业态度**：避免任何形式的骚扰和歧视
- **建设性反馈**：提出建设性的批评和建议
- **感恩之心**：感谢他人的贡献和时间

## 如何贡献

### 🐛 报告 Bug

在报告 Bug 之前，请：

1. 搜索现有 Issues 确保 Bug 未被报告
2. 使用最新版本确认 Bug 仍然存在
3. 收集相关信息：
   - 浏览器和操作系统版本
   - 复现步骤
   - 期望行为和实际行为
   - 控制台错误信息（如有）

### 💡 提出新功能

我们欢迎新功能提案！请：

1. 搜索现有 Issues 确保功能未被提议
2. 详细描述功能需求和使用场景
3. 提供可能的实现方案
4. 解释为什么该功能对项目有价值

### 🔧 修复 Bug

修复 Bug 时请：

1. 在 Issues 中认领或创建相关 Issue
2. Fork 项目并创建修复分支
3. 编写测试用例确保 Bug 已修复
4. 提交 PR 并关联相关 Issue

## 开发环境设置

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0
- Git

### 安装步骤

1. **Fork 项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/photoshare-vue.git
   cd photoshare-vue
   ```

2. **添加上游仓库**
   ```bash
   git remote add upstream https://github.com/photoshare-team/photoshare-vue.git
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **创建开发分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 编码规范

### Vue 组件规范

```vue
<!-- ✅ 推荐：使用组合式 API -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Props 定义
interface Props {
  title: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

// Emits 定义
const emit = defineEmits<{
  (e: 'update', value: number): void;
}>();

// 响应式数据
const isLoading = ref(false);
const data = computed(() => props.count * 2);

// 生命周期钩子
onMounted(() => {
  console.log('Component mounted');
});

// 方法
const handleClick = () => {
  emit('update', data.value);
};
</script>

<template>
  <div class="component">
    <h1>{{ title }}</h1>
    <button @click="handleClick">点击</button>
  </div>
</template>

<style scoped>
.component {
  padding: 20px;
}
</style>
```

### TypeScript 规范

```typescript
// ✅ 推荐：使用接口定义类型
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// ✅ 推荐：使用类型别名
type UserRole = 'admin' | 'editor' | 'viewer';

// ✅ 推荐：显式返回类型
function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(res => res.json());
}

// ✅ 推荐：使用枚举
enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed'
}
```

### CSS 规范

```css
/* ✅ 推荐：使用语义化类名 */
.card-header { }
.card-content { }
.button-primary { }

/* ✅ 推荐：遵循 BEM 命名 */
.article-card__title { }
.article-card__content--featured { }

/* ✅ 推荐：使用 CSS 变量 */
:root {
  --color-primary: #4A5F8B;
  --spacing-md: 16px;
}
```

## 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### 类型 (Type)

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `build`: 构建系统相关
- `ci`: CI/CD 相关
- `chore`: 其他更改

### 示例

```
feat(home): 添加新的轮播图组件

- 实现自动轮播功能
- 添加导航指示器
- 支持触摸滑动

Closes #123
```

```
fix(community): 修复帖子点赞计数错误

问题：点赞后计数未正确更新
解决方案：同步更新本地状态和服务器数据

Fixes #456
```

## Pull Request 流程

### 1. 保持同步

在开始工作之前，确保您的分支与上游仓库同步：

```bash
git fetch upstream
git rebase upstream/main
```

### 2. 提交您的更改

```bash
git add .
git commit -m 'feat(component): 添加新功能'
git push origin feature/your-feature-name
```

### 3. 创建 Pull Request

1. 访问您的 Fork 仓库
2. 点击 "New Pull Request"
3. 选择您的分支
4. 填写 PR 模板：
   - 清晰的标题和描述
   - 关联相关 Issues
   - 提供测试说明

### 4. 代码审查

- 耐心等待代码审查
- 积极响应审查意见
- 进行必要的修改

### 5. 合并

一旦 PR 获得批准并且通过所有检查，它将被合并到主分支。

## 📞 获得帮助

如果您有任何问题：

- 📧 发送邮件至：dev@photoshare.example.com
- 💬 加入开发者 Discord 社区
- 📖 查看 [开发文档](https://docs.photoshare.example.com)

## 🎯 认领 Issues

我们为初次贡献者准备了 "good first issue" 标签的 Issues：

- 适合新手的问题
- 有明确的解决方案
- 有详细的指导说明

## 📈 贡献者统计

我们使用 [All Contributors](https://allcontributors.org/) 来记录所有贡献者。

感谢所有为项目做出贡献的朋友！🙏

---

**再次感谢您的贡献！** 💖
