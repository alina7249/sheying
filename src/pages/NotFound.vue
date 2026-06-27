<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">
        抱歉，您访问的页面不存在或已被移除。
      </p>
      <div class="error-actions">
        <button @click="handleGoHome" class="btn btn-primary">
          <span>🏠</span>
          返回首页
        </button>
        <button @click="goBack" class="btn btn-secondary">
          <span>←</span>
          返回上页
        </button>
      </div>
      
      <div class="helpful-links">
        <h3>您可能想访问：</h3>
        <div class="links-grid">
          <router-link to="/equipment-hub" class="helpful-link">
            <span class="link-icon">📷</span>
            <span class="link-text">器材中心</span>
          </router-link>
          <router-link to="/community" class="helpful-link">
            <span class="link-icon">👥</span>
            <span class="link-text">摄影社区</span>
          </router-link>
          <router-link to="/online-courses" class="helpful-link">
            <span class="link-icon">📚</span>
            <span class="link-text">在线课程</span>
          </router-link>
          <router-link to="/events-contests" class="helpful-link">
            <span class="link-icon">🏆</span>
            <span class="link-text">活动赛事</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useInteraction } from '../composables/useInteraction';

const router = useRouter();
const { showInfo } = useInteraction();

const handleGoHome = () => {
  showInfo('正在返回首页...');
  router.push('/');
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0F1C2D 0%, #1E2532 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.error-content {
  text-align: center;
  max-width: 600px;
}

.error-icon {
  font-size: 120px;
  font-weight: 800;
  background: linear-gradient(135deg, #4A5F8B, #6B7C93);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 24px;
  line-height: 1;
}

.error-title {
  font-size: 36px;
  font-weight: 700;
  color: #F5F7FA;
  margin: 0 0 16px 0;
}

.error-message {
  font-size: 18px;
  color: #B8C6D8;
  line-height: 1.6;
  margin: 0 0 40px 0;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 60px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #4A5F8B, #3A4B6F);
  color: #F5F7FA;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #6B7C93, #4A5F8B);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(74, 95, 139, 0.3);
}

.btn-secondary {
  background: rgba(74, 95, 139, 0.1);
  color: #4A5F8B;
  border: 1px solid #4A5F8B;
}

.btn-secondary:hover {
  background: rgba(74, 95, 139, 0.2);
  transform: translateY(-2px);
}

.helpful-links {
  background: rgba(74, 95, 139, 0.1);
  border: 1px solid rgba(74, 95, 139, 0.2);
  border-radius: 16px;
  padding: 32px;
}

.helpful-links h3 {
  font-size: 16px;
  font-weight: 600;
  color: #F5F7FA;
  margin: 0 0 24px 0;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.helpful-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #2D3748;
  border: 1px solid #4A5F8B;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.helpful-link:hover {
  background: rgba(74, 95, 139, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 95, 139, 0.2);
}

.link-icon {
  font-size: 24px;
}

.link-text {
  font-size: 14px;
  font-weight: 600;
  color: #F5F7FA;
}
</style>
