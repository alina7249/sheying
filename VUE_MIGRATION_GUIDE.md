# React 到 Vue 迁移指南

## 已完成的基础配置

### 1. 依赖更新 (package.json)
- ✅ 替换 React 相关依赖为 Vue 3
- ✅ 添加 Vue Router 替代 React Router
- ✅ 添加 Pinia 替代 Zustand
- ✅ 添加 Vite Vue 插件
- ✅ 保留 Tailwind CSS、Axios 等通用依赖

### 2. 构建配置
- ✅ `vite.config.ts`: 使用 `@vitejs/plugin-vue` 替代 React 插件
- ✅ `tsconfig.json`: 配置 Vue 相关编译选项，添加 `.vue` 文件支持
- ✅ `tailwind.config.js`: 添加 `.vue` 文件到内容扫描路径

### 3. 入口文件
- ✅ 创建 `src/main.ts`: Vue 应用入口，配置 Pinia 和 Vue Router
- ✅ 创建 `src/App.vue`: 根组件
- ✅ 更新 `index.html`: 引用 `main.ts` 而非 `main.tsx`
- ✅ 更新 `src/vite-env.d.ts`: 添加 `.vue` 文件类型声明

### 4. 示例组件
- ✅ `src/components/Header.vue`: Header 组件的 Vue 版本
- ✅ `src/components/Footer.vue`: Footer 组件的 Vue 版本
- ✅ `src/pages/Home.vue`: Home 页面的 Vue 版本

## 组件转换指南

### 1. 组件定义

**React (JSX/TSX):**
```tsx
import React, { useState } from 'react';

const MyComponent: React.FC<Props> = ({ prop1, prop2 }) => {
  const [count, setCount] = useState(0);
  // ...
  return <div>{count}</div>;
};

export default MyComponent;
```

**Vue 3 (SFC):**
```vue
<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  prop1: string;
  prop2: number;
}

const props = defineProps<Props>();
const count = ref(0);
</script>

<template>
  <div>{{ count }}</div>
</template>
```

### 2. 状态管理

**React (useState):**
```tsx
const [count, setCount] = useState(0);
const [user, setUser] = useState<User | null>(null);

// 更新
setCount(count + 1);
```

**Vue 3 (ref/reactive):**
```ts
const count = ref(0);
const user = reactive<User | null>(null);

// 更新
count.value++;
```

### 3. 路由

**React (React Router):**
```tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';

<Link to="/path">Go</Link>
const location = useLocation();
const navigate = useNavigate();
navigate('/path');
```

**Vue (Vue Router):**
```vue
<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
router.push('/path');
</script>

<template>
  <router-link to="/path">Go</router-link>
</template>
```

### 4. 条件渲染

**React:**
```tsx
{isLoggedIn ? <UserPanel /> : <LoginForm />}
{show && <Modal />}
```

**Vue:**
```vue
<UserPanel v-if="isLoggedIn" />
<LoginForm v-else />
<Modal v-show="show" />
```

### 5. 列表渲染

**React:**
```tsx
{items.map(item => (
  <Item key={item.id} data={item} />
))}
```

**Vue:**
```vue
<Item v-for="item in items" :key="item.id" :data="item" />
```

### 6. 事件处理

**React:**
```tsx
<button onClick={handleClick}>Click</button>
<input onChange={e => setValue(e.target.value)} />
```

**Vue:**
```vue
<button @click="handleClick">Click</button>
<input @input="e => setValue(e.target.value)" />
```

### 7. 样式绑定

**React:**
```tsx
<div className={`container ${isActive ? 'active' : ''}`} style={{ color: 'red' }}>
```

**Vue:**
```vue
<div 
  :class="['container', { active: isActive }]"
  :style="{ color: 'red' }"
>
```

### 8. 生命周期

**React:**
```tsx
useEffect(() => {
  // 挂载时
  return () => {
    // 卸载时
  };
}, [deps]);
```

**Vue:**
```ts
onMounted(() => { /* 挂载时 */ });
onUnmounted(() => { /* 卸载时 */ });
watch(dep, () => { /* 依赖变化时 */ });
```

## 状态管理 (Pinia vs Zustand)

**Zustand:**
```ts
const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

**Pinia:**
```ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
  },
});
```

## 表单处理

**React Hook Form:**
```tsx
const { register, handleSubmit } = useForm();
```

**VeeValidate (推荐):**
```vue
<Form @submit="onSubmit">
  <Field name="email" rules="required|email" />
</Form>
```

## 迁移步骤建议

1. **先迁移基础配置** (已完成)
2. **创建通用组件的 Vue 版本** (Header, Footer 等已完成)
3. **迁移页面组件** (从简单页面开始)
4. **迁移路由配置**
5. **迁移状态管理** (从简单 store 开始)
6. **测试和调试**

## 运行项目

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```
