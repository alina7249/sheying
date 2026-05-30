<template>
  <form @submit="handleSubmit" class="mt-8 space-y-6">
    <div class="space-y-4">
      <div>
        <label for="username" class="block text-sm font-medium text-[#E2E8F0] mb-1">
          用户名
        </label>
        <input
          id="username"
          type="text"
          v-model="formData.username"
          @blur="validateUsername"
          :class="[
            'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors',
            errors.username ? 'border-red-500' : 'border-[#4A5568]',
            theme === 'dark' ? 'bg-[#4A5568] text-[#FFFFFF]' : 'bg-white text-[#1E2532]'
          ]"
          placeholder="请输入用户名"
        />
        <p v-if="errors.username" class="mt-1 text-sm text-red-500">{{ errors.username }}</p>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-[#E2E8F0] mb-1">
          密码
        </label>
        <div class="relative">
          <input
            id="password"
            :type="showPassword ? 'text' : 'password'"
            v-model="formData.password"
            @blur="validatePassword"
            :class="[
              'w-full px-4 py-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors',
              errors.password ? 'border-red-500' : 'border-[#4A5568]',
              theme === 'dark' ? 'bg-[#4A5568] text-[#FFFFFF]' : 'bg-white text-[#1E2532]'
            ]"
            placeholder="••••••••"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718096] hover:text-[#B8C6D8]"
            :aria-label="showPassword ? '隐藏密码' : '显示密码'"
          >
            <i :class="['fa-solid', showPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
          </button>
        </div>
        <p v-if="errors.password" class="mt-1 text-sm text-red-500">{{ errors.password }}</p>
      </div>

      <div v-if="showCaptcha">
        <Captcha
          :value="captchaValue"
          @update:value="captchaValue = $event"
        />
        <p v-if="captchaValue.length > 0 && captchaValue.length !== 6" class="mt-1 text-sm text-red-500">验证码必须是6位</p>
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            v-model="formData.rememberMe"
            class="h-4 w-4 text-[#38B2AC] focus:ring-[#38B2AC] border-[#4A5568] rounded bg-[#1E2A3A]"
          />
          <label for="remember-me" class="ml-2 block text-sm text-[#E2E8F0]">
            记住我
          </label>
        </div>

        <div>
          <a
            href="#"
            @click.prevent="handleForgotPassword"
            class="text-sm font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
          >
            忘记密码？
          </a>
        </div>
      </div>
    </div>

    <div>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full py-3 px-4 bg-[#63B3ED] hover:bg-[#4299E1] text-[#0F1C2D] font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center">
          <i class="fa-solid fa-circle-notch fa-spin mr-2"></i>
          登录中...
        </span>
        <span v-else>登录</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useAuthStore } from '../../store/authStore';
import { useInteraction } from '../../composables/useInteraction';
import Captcha from './Captcha.vue';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
}

const authStore = useAuthStore();
const router = useRouter();
const { showInfo } = useInteraction();

const showPassword = ref(false);
const showCaptcha = ref(false);
const captchaValue = ref('');
const loginAttempts = ref(0);
const isSubmitting = ref(false);

const formData = reactive<LoginFormData>({
  username: '',
  password: '',
  rememberMe: false,
  captcha: ''
});

const errors = reactive({
  username: '',
  password: ''
});

const theme = ref('dark');

onMounted(() => {
  const attempts = localStorage.getItem('loginAttempts');
  if (attempts) {
    loginAttempts.value = parseInt(attempts);
    showCaptcha.value = parseInt(attempts) >= 5;
  }

  const rememberedUsername = localStorage.getItem('rememberedUsername');
  if (rememberedUsername) {
    formData.username = rememberedUsername;
    formData.rememberMe = true;
  }
});

watch(loginAttempts, (newVal) => {
  localStorage.setItem('loginAttempts', newVal.toString());
});

const resetLoginAttempts = () => {
  loginAttempts.value = 0;
  showCaptcha.value = false;
  localStorage.setItem('loginAttempts', '0');
};

const validateUsername = () => {
  const value = formData.username;
  if (!value) {
    errors.username = '请输入用户名';
  } else if (value.length < 4) {
    errors.username = '用户名至少需要4个字符';
  } else {
    errors.username = '';
  }
};

const validatePassword = () => {
  const value = formData.password;
  if (!value) {
    errors.password = '请输入密码';
  } else if (value.length < 4) {
    errors.password = '密码至少需要4个字符';
  } else {
    errors.password = '';
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleForgotPassword = () => {
  showInfo('密码重置功能即将上线，请联系管理员');
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    if (showCaptcha.value && captchaValue.value.length !== 6) {
      toast.warning('请输入6位验证码');
      isSubmitting.value = false;
      return;
    }

    const isAdminUsername = ['admin', 'editor', 'operator'].includes(formData.username.toLowerCase());

    if (isAdminUsername) {
      const adminSuccess = await authStore.adminLogin(formData.username, formData.password);
      
      if (adminSuccess) {
        resetLoginAttempts();
        toast.success('管理员登录成功！');
        router.push('/admin');
        return;
      } else {
        loginAttempts.value++;
        if (loginAttempts.value >= 5) {
          showCaptcha.value = true;
        }
        toast.error('管理员用户名或密码错误');
        isSubmitting.value = false;
        return;
      }
    } else {
      try {
        const success = await authStore.login(formData.username, formData.password);
        
        if (!success) {
          loginAttempts.value++;
          if (loginAttempts.value >= 5) {
            showCaptcha.value = true;
          }
          
          toast.error('用户名或密码错误，请重试');
          
          if (loginAttempts.value >= 5) {
            toast.info('连续登录失败5次，请输入验证码');
          }
          
          isSubmitting.value = false;
          return;
        }
        
        if (formData.rememberMe) {
          localStorage.setItem('rememberedUsername', formData.username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        resetLoginAttempts();
        toast.success('登录成功！');
        router.push('/');
        return;
      } catch (error) {
        console.error('User login error:', error);
        toast.error('登录失败，请稍后重试');
        isSubmitting.value = false;
        return;
      }
    }
    
    toast.error('登录失败，请稍后重试');
  } catch (error) {
    toast.error('登录失败，请稍后重试');
    console.error('Login form error:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>