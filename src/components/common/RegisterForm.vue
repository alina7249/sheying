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
        <label for="phone" class="block text-sm font-medium text-[#E2E8F0] mb-1">
          手机号码
        </label>
        <input
          id="phone"
          type="tel"
          v-model="formData.phone"
          @blur="validatePhone"
          :class="[
            'w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors',
            errors.phone ? 'border-red-500' : 'border-[#4A5568]',
            theme === 'dark' ? 'bg-[#4A5568] text-[#FFFFFF]' : 'bg-white text-[#1E2532]'
          ]"
          placeholder="请输入手机号码"
        />
        <p v-if="errors.phone" class="mt-1 text-sm text-red-500">{{ errors.phone }}</p>
      </div>

      <Captcha
        :value="captchaValue"
        @update:value="captchaValue = $event"
      />
      <p v-if="captchaValue.length > 0 && captchaValue.length !== 6" class="mt-1 text-sm text-red-500">验证码必须是6位</p>

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
            placeholder="至少8个字符"
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

      <div>
        <label for="confirm-password" class="block text-sm font-medium text-[#E2E8F0] mb-1">
          确认密码
        </label>
        <div class="relative">
          <input
            id="confirm-password"
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="formData.confirmPassword"
            @blur="validateConfirmPassword"
            :class="[
              'w-full px-4 py-3 pr-10 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors',
              errors.confirmPassword ? 'border-red-500' : 'border-[#4A5568]',
              theme === 'dark' ? 'bg-[#4A5568] text-[#FFFFFF]' : 'bg-white text-[#1E2532]'
            ]"
            placeholder="再次输入密码"
          />
          <button
            type="button"
            @click="toggleConfirmPasswordVisibility"
            class="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718096] hover:text-[#B8C6D8]"
            :aria-label="showConfirmPassword ? '隐藏密码' : '显示密码'"
          >
            <i :class="['fa-solid', showConfirmPassword ? 'fa-eye-slash' : 'fa-eye']"></i>
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-500">{{ errors.confirmPassword }}</p>
      </div>

      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            id="terms"
            type="checkbox"
            v-model="formData.terms"
            @change="validateTerms"
            class="h-4 w-4 text-[#38B2AC] focus:ring-[#38B2AC] border-[#4A5568] rounded bg-[#1E2A3A]"
          />
        </div>
        <div class="ml-3 text-sm">
          <label for="terms" class="text-[#718096]">
            我已阅读并同意
            <a href="#" class="text-[#63B3ED] hover:text-[#63B3ED] transition-colors">
              服务条款
            </a>
            和
            <a href="#" class="text-[#63B3ED] hover:text-[#63B3ED] transition-colors">
              隐私政策
            </a>
          </label>
          <p v-if="errors.terms" class="mt-1 text-sm text-red-500">{{ errors.terms }}</p>
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
          注册中...
        </span>
        <span v-else>注册</span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';
import { useAuthStore } from '../../store/authStore';
import Captcha from './Captcha.vue';

interface RegisterFormData {
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  captcha: string;
}

const authStore = useAuthStore();
const router = useRouter();

const captchaValue = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);

const formData = reactive<RegisterFormData>({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  terms: false,
  captcha: ''
});

const errors = reactive({
  username: '',
  phone: '',
  password: '',
  confirmPassword: '',
  terms: ''
});

const theme = ref('dark');

const validateUsername = () => {
  const value = formData.username;
  const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
  if (!value) {
    errors.username = '请输入用户名';
  } else if (!usernameRegex.test(value)) {
    errors.username = '用户名必须是4-16位字母数字组合';
  } else {
    errors.username = '';
  }
};

const validatePhone = () => {
  const value = formData.phone;
  const phoneRegex = /^1[3-9]\d{9}$/;
  if (!value) {
    errors.phone = '请输入手机号码';
  } else if (!phoneRegex.test(value)) {
    errors.phone = '请输入有效的手机号码';
  } else {
    errors.phone = '';
  }
};

const validatePassword = () => {
  const value = formData.password;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}$/;
  if (!value) {
    errors.password = '请输入密码';
  } else if (value.length !== 8) {
    errors.password = '密码必须是8个字符';
  } else if (!passwordRegex.test(value)) {
    errors.password = '密码必须包含大小写字母和特殊符号';
  } else {
    errors.password = '';
  }
};

const validateConfirmPassword = () => {
  const value = formData.confirmPassword;
  if (!value) {
    errors.confirmPassword = '请确认密码';
  } else if (value !== formData.password) {
    errors.confirmPassword = '两次输入的密码不一致';
  } else {
    errors.confirmPassword = '';
  }
};

const validateTerms = () => {
  if (!formData.terms) {
    errors.terms = '请阅读并同意服务条款和隐私政策';
  } else {
    errors.terms = '';
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPasswordVisibility = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  try {
    if (captchaValue.value.length !== 6) {
      toast.warning('请输入6位验证码');
      isSubmitting.value = false;
      return;
    }

    const success = await authStore.register(formData.username, formData.password, formData.confirmPassword, formData.username);

    if (success) {
      toast.success('注册成功，请登录！');
      router.push('/login');
    } else {
      toast.error('注册失败，请稍后重试');
    }
  } catch (error) {
    toast.error('注册失败，请稍后重试');
    console.error('Registration error:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>