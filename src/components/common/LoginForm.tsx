import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useThemeStore } from '../../store/themeStore';
import Captcha from './Captcha';
import { AuthContext } from '../../contexts/authContext';
import { AdminAuthContext } from '../../contexts/adminAuthContext';

// 定义表单数据类型
interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
}

const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext);
  const adminAuthContext = useContext(AdminAuthContext);
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  
  // 表单状态
  const [showPassword, setShowPassword] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaValue, setCaptchaValue] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  // 从localStorage获取登录失败次数
  useEffect(() => {
    const attempts = localStorage.getItem('loginAttempts');
    if (attempts) {
      setLoginAttempts(parseInt(attempts));
      setShowCaptcha(parseInt(attempts) >= 5);
    }
  }, []);
  
  // 保存登录失败次数到localStorage
  useEffect(() => {
    localStorage.setItem('loginAttempts', loginAttempts.toString());
  }, [loginAttempts]);
  
  // 重置登录失败次数
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    setShowCaptcha(false);
    localStorage.setItem('loginAttempts', '0');
  };
  
  // React Hook Form配置
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
      captcha: ''
    }
  });
  
   // 处理表单提交
  const onSubmit = async (data: LoginFormData) => {
    try {
      // 验证验证码（如果需要）
      if (showCaptcha && captchaValue.length !== 6) {
        toast.warning('请输入6位验证码');
        return;
      }
      
      // 先检查是否为管理员用户名
      const isAdminUsername = ['admin', 'editor', 'operator'].includes(data.username.toLowerCase());
      
      // 如果是管理员用户名，只尝试管理员登录
      if (isAdminUsername) {
        // 管理员用户使用简化验证（已在表单验证中完成）
        if (adminAuthContext) {
          try {
            // 只接受这三个管理员账号，不允许任何其他账号登录
            if (['admin', 'editor', 'operator'].includes(data.username.toLowerCase())) {
              const adminSuccess = await adminAuthContext.login(data.username, data.password);
              
              if (adminSuccess) {
                resetLoginAttempts(); // 登录成功，重置失败次数
                toast.success('管理员登录成功！');
                // 管理员登录成功后直接重定向到管理后台
                navigate('/admin');
                return;
              } else {
                // 管理员登录失败，不尝试普通用户登录
                setLoginAttempts(prev => {
                  const newAttempts = prev + 1;
                  setShowCaptcha(newAttempts >= 5);
                  return newAttempts;
                });
                toast.error('管理员用户名或密码错误');
                return;
              }
            } else {
              toast.error('管理员用户名错误');
              return;
            }
          } catch (error) {
            console.error('Admin login error:', error);
            toast.error('登录失败，请稍后重试');
            return;
          }
        }
      } else {
        // 普通用户
        try {
          // 尝试普通用户登录
          const success = await login(data.username, data.password);
          
          if (!success) {
            // 登录失败，增加失败次数
            setLoginAttempts(prev => {
              const newAttempts = prev + 1;
              setShowCaptcha(newAttempts >= 5);
              return newAttempts;
            });
            
            toast.error('用户名或密码错误，请重试');
            
            // 如果失败次数达到5次，显示验证码
            if (loginAttempts + 1 >= 5) {
              toast.info('连续登录失败5次，请输入验证码');
            }
            
            return;
          }
          
          // 保存记住我状态
          if (data.rememberMe) {
            localStorage.setItem('rememberedUsername', data.username);
          } else {
            localStorage.removeItem('rememberedUsername');
          }
          
          // 普通用户登录成功，重置失败次数并重定向到主页面
          resetLoginAttempts();
          toast.success('登录成功！');
          navigate('/');
          return;
        } catch (error) {
          console.error('User login error:', error);
          toast.error('登录失败，请稍后重试');
          return;
        }
      }
      
      // 如果上面的条件分支都没有执行到，显示通用错误信息
      toast.error('登录失败，请稍后重试');
    } catch (error) {
      toast.error('登录失败，请稍后重试');
      console.error('Login form error:', error);
    }
  };
  
  // 从localStorage获取记住的用户名
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      reset({
        username: rememberedUsername,
        rememberMe: true
      });
    }
  }, []);
   
   // 密码强度验证函数 - 针对普通用户
  const validateRegularPassword = (value: string) => {
    // 必须8位，包含大小写字母和特殊符号
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}$/;
    if (!value) return '请输入密码';
    if (value.length !== 8) return '密码必须是8个字符';
    if (!passwordRegex.test(value)) 
      return '密码必须包含大小写字母和特殊符号';
    return true;
  };
  
   // 管理员密码验证函数 - 根据不同角色验证不同密码
  const validateAdminPassword = (value: string) => {
    if (!value) return '请输入密码';
    
    // 获取当前输入的用户名
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const username = usernameInput?.value.toLowerCase() || '';
    
    // 根据不同管理员角色验证密码格式
     if (username === 'admin' && value !== 'Admin@123') {
      return '超级管理员密码错误';
    } else if (username === 'editor' && value !== 'Editor@123') {
      return '内容编辑密码错误';
    } else if (username === 'operator' && value !== 'Operator@123') {
      return '运营人员密码错误';
    }
    
    // 验证密码复杂度是否符合要求
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8}$/;
    if (value.length !== 8) return '密码必须是8个字符';
    if (!passwordRegex.test(value)) 
      return '密码必须包含大小写字母和特殊符号';
    
    return true;
  };
  
  // 用户名验证函数
  const validateUsername = (value: string) => {
    // 4-16位字母数字组合
    const usernameRegex = /^[a-zA-Z0-9]{4,16}$/;
    if (!value) return '请输入用户名';
    if (!usernameRegex.test(value)) 
      return '用户名必须是4-16位字母数字组合';
    return true;
  };
  
  // 切换密码显示/隐藏
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-[#E2E8F0] mb-1">
            用户名
          </label>
          <input
            id="username"
            type="text"
            {...register('username', { 
              required: '请输入用户名',
              validate: validateUsername
            })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.username 
                ? 'border-red-500' 
                : 'border-[#4A5568]'
            } ${
              theme === 'dark' 
                ? 'bg-[#4A5568] text-[#FFFFFF]' 
                : 'bg-white text-[#1E2532]'
            } focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors`}
            placeholder="请输入用户名"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#E2E8F0] mb-1">
            密码
          </label>
          <div className="relative">
            <input
              id="password"
               type={showPassword ? 'text' : 'password'}
               {...register('password', { 
                required: '请输入密码',
                // 根据用户名动态确定密码验证规则
                validate: (value) => {
                  // 获取当前输入的用户名
                  const usernameInput = document.getElementById('username') as HTMLInputElement;
                  const username = usernameInput?.value.toLowerCase() || '';
                  
                  // 检查是否为管理员用户名
                  const isAdminUsername = ['admin', 'editor', 'operator'].includes(username);
                  
                  // 如果是管理员用户名，使用简化验证
                  if (isAdminUsername) {
                    return validateAdminPassword(value);
                  } else {
                    // 普通用户，使用严格密码验证
                    return validateRegularPassword(value);
                  }
                }
              })}
              className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                errors.password 
                  ? 'border-red-500' 
                  : 'border-[#4A5568]'
              } ${
                theme === 'dark' 
                  ? 'bg-[#4A5568] text-[#FFFFFF]' 
                  : 'bg-white text-[#1E2532]'
              } focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#718096] hover:text-[#B8C6D8]"
              aria-label={showPassword ? '隐藏密码' : '显示密码'}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>
        
        {showCaptcha && (
          <div>
            <Captcha
              value={captchaValue}
              onChange={setCaptchaValue}
            />
            {captchaValue.length > 0 && captchaValue.length !== 6 && (
              <p className="mt-1 text-sm text-red-500">验证码必须是6位</p>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              {...register('rememberMe')}
              className="h-4 w-4 text-[#38B2AC] focus:ring-[#38B2AC] border-[#4A5568] rounded bg-[#1E2A3A]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-[#E2E8F0]">
              记住我
            </label>
          </div>
          
          <div>
            <a
              href="#"
              className="text-sm font-medium text-[#63B3ED] hover:text-[#63B3ED] transition-colors"
            >
              忘记密码？
            </a>
          </div>
        </div>
      </div>
      
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-[#63B3ED] hover:bg-[#4299E1] text-[#0F1C2D] font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-[#63B3ED] transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
              登录中...
            </span>
          ) : (
            '登录'
          )}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;