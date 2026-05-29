<template>
  <div
    :class="containerClasses"
    :style="{ position: loading ? 'relative' : 'static' }"
    @click="handleClick"
  >
    <slot>
      <i :class="iconClasses"></i>
      <div :class="textClasses">
        {{ text || typeConfig.text }}
      </div>
      <div v-if="helperText || typeConfig.helperText" :class="helperTextClasses">
        {{ helperText || typeConfig.helperText }}
      </div>
      <button
        v-if="actionText"
        :class="buttonClasses"
        @click.stop="handleActionClick"
        :disabled="loading"
      >
        {{ actionText }}
      </button>

      <div v-if="loading" class="absolute inset-0 bg-[#1E2532]/80 flex items-center justify-center rounded-xl">
        <i class="fa-solid fa-spinner fa-spin text-2xl text-[#4A5F8B]"></i>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { toast } from 'sonner';

export type EmptyType = 'empty' | 'permission' | 'network' | 'function' | 'disabled';
export type EmptySize = 'sm' | 'md' | 'lg';
export type ActionType = 'primary' | 'secondary' | 'ghost';

interface EmptyProps {
  type?: EmptyType;
  size?: EmptySize;
  text?: string;
  helperText?: string;
  icon?: string;
  actionText?: string;
  actionType?: ActionType;
  loading?: boolean;
  showToast?: boolean;
  toastText?: string;
  effect3d?: boolean;
  onClick?: () => void;
  onActionClick?: () => void;
  backgroundColor?: string;
  textColor?: string;
  padding?: string;
  cursor?: string;
}

const props = withDefaults(defineProps<EmptyProps>(), {
  type: 'empty',
  size: 'md',
  actionType: 'primary',
  loading: false,
  showToast: true,
  toastText: 'Coming soon',
  effect3d: false,
  backgroundColor: 'bg-[#2D3748]',
  textColor: 'text-[#F5F7FA]',
  cursor: 'cursor-pointer',
});

const emit = defineEmits<{
  click: [];
  actionClick: [];
}>();

const defaultConfig = {
  typeConfig: {
    empty: {
      icon: 'fa-box-open',
      text: '暂无数据',
      helperText: '暂无相关数据，请稍后再试',
      defaultAction: () => toast('暂无数据'),
    },
    permission: {
      icon: 'fa-lock',
      text: '无访问权限',
      helperText: '您没有权限访问此内容',
      defaultAction: () => toast.warning('您没有权限访问此内容'),
    },
    network: {
      icon: 'fa-wifi-slash',
      text: '网络连接失败',
      helperText: '请检查您的网络连接',
      defaultAction: () => window.location.reload(),
    },
    function: {
      icon: 'fa-toolbox',
      text: '功能正在开发中',
      helperText: '此功能即将上线，敬请期待',
      defaultAction: () => toast('功能正在开发中，敬请期待'),
    },
    disabled: {
      icon: 'fa-ban',
      text: '功能已禁用',
      helperText: '该功能目前已被禁用',
      defaultAction: () => {},
    },
  },
  sizeConfig: {
    sm: {
      iconSize: 'text-4xl',
      textSize: 'text-lg',
      helperTextSize: 'text-sm',
      padding: 'p-4',
    },
    md: {
      iconSize: 'text-5xl',
      textSize: 'text-xl',
      helperTextSize: 'text-sm',
      padding: 'p-6',
    },
    lg: {
      iconSize: 'text-6xl',
      textSize: 'text-2xl',
      helperTextSize: 'text-base',
      padding: 'p-8',
    },
  },
  actionTypeConfig: {
    primary: 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]',
    secondary: 'bg-[#2D3748] text-[#B8C6D8] hover:bg-[#4A5F8B] border border-[#4A5F8B]',
    ghost: 'bg-transparent text-[#4A5F8B] hover:bg-[#4A5F8B]/10 border border-[#4A5F8B]',
  },
};

const typeConfig = computed(() => defaultConfig.typeConfig[props.type]);
const sizeConfig = computed(() => defaultConfig.sizeConfig[props.size]);
const actionTypeStyle = computed(() => defaultConfig.actionTypeConfig[props.actionType]);

const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

const containerClasses = computed(() => {
  return cn(
    'flex flex-col items-center justify-center',
    props.padding || sizeConfig.value.padding,
    props.backgroundColor,
    'border border-[#4A5F8B] rounded-xl',
    'transition-all duration-300',
    props.effect3d ? 'transform-style-3d hover:rotate-y-5' : '',
    props.type === 'disabled' ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    !props.loading && !props.onClick && props.type !== 'disabled' ? 'cursor-default' : props.cursor,
    !props.loading && props.onClick && props.type !== 'disabled' ? 'hover:shadow-lg' : ''
  );
});

const iconClasses = computed(() => {
  return cn(
    'fa-solid',
    props.icon || typeConfig.value.icon,
    sizeConfig.value.iconSize,
    'text-[#4A5F8B] mb-4',
    props.type === 'network' && !props.loading ? 'animate-pulse-icon' : '',
    props.loading ? 'fa-spin' : ''
  );
});

const textClasses = computed(() => {
  return cn(sizeConfig.value.textSize, props.textColor, 'font-medium mb-2');
});

const helperTextClasses = computed(() => {
  return cn(sizeConfig.value.helperTextSize, 'text-[#B8C6D8] text-center mb-4');
});

const buttonClasses = computed(() => {
  return cn(
    'px-4 py-2 rounded-lg transition-colors duration-200',
    actionTypeStyle.value,
    props.loading ? 'opacity-50 cursor-not-allowed' : ''
  );
});

const handleClick = () => {
  if (!props.loading && !props.onClick && props.showToast && props.type !== 'disabled') {
    toast(props.toastText);
  } else if (!props.loading && props.onClick && props.type !== 'disabled') {
    props.onClick();
    emit('click');
  }
};

const handleActionClick = () => {
  if (!props.loading) {
    if (props.onActionClick) {
      props.onActionClick();
    } else {
      typeConfig.value.defaultAction();
    }
    emit('actionClick');
  }
};
</script>