<template>
  <div :class="['mt-6 p-4 rounded-lg border', theme.container]">
    <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
      <h3 :class="['text-lg font-semibold', theme.primaryText]">性能分析</h3>

      <div class="flex flex-wrap gap-2">
        <div class="flex border rounded-lg overflow-hidden">
          <button
            @click="handleChartTypeChange('radar')"
            :class="['px-3 py-1.5 text-sm transition-colors', chartType === 'radar' ? theme.button : theme.buttonSecondary]"
          >
            雷达图
          </button>
          <button
            @click="handleChartTypeChange('bar')"
            :class="['px-3 py-1.5 text-sm transition-colors', chartType === 'bar' ? theme.button : theme.buttonSecondary]"
          >
            柱状图
          </button>
        </div>

        <button
          @click="handleToggle3DMode"
          :class="['px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition-colors', is3DMode ? theme.button : theme.buttonSecondary]"
        >
          <i class="fa-solid fa-cube"></i>
          {{ is3DMode ? '关闭3D' : '开启3D' }}
        </button>

        <button
          @click="showAddModal = true"
          :disabled="compareEquipmentList.length >= 3"
          :class="['px-3 py-1.5 text-sm rounded-lg flex items-center gap-1 transition-colors', compareEquipmentList.length >= 3 ? 'opacity-50 cursor-not-allowed' : theme.button]"
        >
          <i class="fa-solid fa-plus"></i>
          添加对比
        </button>

        <button
          @click="handleExportChart"
          :class="['px-3 py-1.5 text-sm rounded-lg flex items-center gap-1', theme.button]"
        >
          <i class="fa-solid fa-download"></i>
          导出图表
        </button>
      </div>
    </div>

    <div v-if="compareEquipmentList.length > 0" class="flex flex-wrap gap-2 mt-2">
      <div
        v-for="eq in compareEquipmentList"
        :key="eq.id"
        :class="['inline-flex items-center px-3 py-1 rounded-full', theme.buttonSecondary, 'text-sm']"
      >
        <span>{{ eq.name }}</span>
        <button @click="handleRemoveCompareEquipment(eq.id)" class="ml-2 text-[#F56565] hover:text-[#E53E3E]">
          <i class="fa-solid fa-times"></i>
        </button>
      </div>
    </div>

    <div class="mb-4 mt-3">
      <div class="relative">
        <input
          type="text"
          v-model="filterKeyword"
          placeholder="搜索性能类别..."
          :class="['w-full pl-10 pr-4 py-2 rounded-lg', theme.input, 'focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]']"
        />
        <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7C93]"></i>
      </div>
    </div>

    <div ref="chartRef" :class="['rounded-lg p-4', theme.chartContainer]">
      <canvas ref="canvasRef" :height="chartHeight"></canvas>
    </div>

    <div class="mt-6">
      <h4 :class="['text-sm font-medium', theme.primaryText, 'mb-3']">性能优势分析</h4>

      <div class="mb-4">
        <p :class="theme.text">
          综合性能评分为 <span :class="['font-semibold', theme.highlight]">{{ overallScore.toFixed(1) }}/10</span>，
          {{ overallScore >= 9 ? '处于行业领先水平' : overallScore >= 8 ? '表现优秀' : overallScore >= 7 ? '表现良好' : '表现一般' }}。
        </p>
      </div>

      <div class="mb-4">
        <h5 :class="['text-xs uppercase tracking-wider', theme.secondaryText, 'mb-2']">核心优势</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <li v-for="(item, index) in coreStrengths" :key="index" :class="theme.text">
            {{ translateCategory(item.key) }} - {{ item.value }}/10（{{ item.evaluation }}）
          </li>
        </ul>
      </div>

      <div class="mb-4">
        <h5 :class="['text-xs uppercase tracking-wider', theme.secondaryText, 'mb-2']">待提升方面</h5>
        <ul class="list-disc pl-5 space-y-1 text-sm">
          <template v-if="areasForImprovement.length > 0">
            <li v-for="(item, index) in areasForImprovement" :key="index" :class="theme.text">
              {{ translateCategory(item.key) }} - {{ item.value }}/10（{{ item.evaluation }}）
            </li>
          </template>
          <li v-else :class="theme.text">各方面性能表现均衡，无明显短板</li>
        </ul>
      </div>

      <div :class="['pt-3 border-t', darkMode ? 'border-[#4A5F8B]' : 'border-[#B8C6D8]']">
        <h5 :class="['text-xs uppercase tracking-wider', theme.secondaryText, 'mb-2']">适用场景建议</h5>
        <p :class="theme.text">根据性能分析，该器材特别适合{{ usageScenarios }}。</p>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showAddModal" class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" @click="showAddModal = false">
        <div :class="['w-full max-w-2xl', theme.container, 'rounded-lg p-6']" @click.stop>
          <h3 :class="['text-xl font-bold', theme.primaryText, 'mb-4']">添加对比器材</h3>

          <div class="mb-4">
            <label :class="['block', theme.text, 'mb-2']">器材名称</label>
            <input
              type="text"
              v-model="newEquipmentName"
              placeholder="请输入器材名称"
              :class="['w-full px-4 py-2 rounded-lg', theme.input, 'focus:outline-none focus:ring-2 focus:ring-[#4A5F8B]']"
            />
          </div>

          <div class="mb-4">
            <label :class="['block', theme.text, 'mb-2']">性能评分</label>
            <div class="space-y-4">
              <div v-for="([key, value], index) in Object.entries(performance)" :key="index">
                <div class="flex justify-between mb-1">
                  <span :class="theme.text">{{ translateCategory(key) }}</span>
                  <span :class="['font-medium', theme.highlight]">
                    {{ newEquipmentPerformance[key] || value }}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  :value="newEquipmentPerformance[key] || value"
                  @input="handleNewEquipmentPerformanceChange(key, parseFloat(($event.target as HTMLInputElement).value))"
                  class="w-full h-2 rounded-lg appearance-none bg-[#1E2532] outline-none"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-3">
            <button @click="showAddModal = false" :class="['px-4 py-2 rounded-lg', theme.buttonSecondary, 'transition-colors']">
              取消
            </button>
            <button @click="handleAddCompareEquipment" :class="['px-4 py-2 rounded-lg', theme.button, 'transition-colors']">
              添加
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import html2canvas from 'html2canvas';

Chart.register(...registerables);

interface PerformanceData {
  category: string;
  current: number;
  [key: string]: any;
}

interface CompareEquipment {
  id: string;
  name: string;
  performance: Record<string, number>;
}

interface EquipmentComparisonChartProps {
  equipmentName: string;
  performance: Record<string, number>;
  darkMode?: boolean;
}

const props = withDefaults(defineProps<EquipmentComparisonChartProps>(), {
  darkMode: true
});

const chartType = ref<'radar' | 'bar'>('radar');
const is3DMode = ref(false);
const showAddModal = ref(false);
const compareEquipmentList = ref<CompareEquipment[]>([]);
const filterKeyword = ref('');
const newEquipmentName = ref('');
const newEquipmentPerformance = ref<Record<string, number>>({});
const chartRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const chartInstance = ref<Chart | null>(null);

const COLORS = ['#4A5F8B', '#8884d8', '#6B7C93', '#4CAF50'];

const chartHeight = computed(() => {
  return typeof window !== 'undefined' ? (window.innerWidth <= 768 ? 300 : 400) : 400;
});

const translateCategory = (category: string): string => {
  const translations: Record<string, string> = {
    resolution: '分辨率',
    lowLight: '弱光性能',
    autofocus: '自动对焦',
    battery: '电池续航',
    speed: '连拍速度',
    sharpness: '锐度',
    bokeh: '虚化效果',
    buildQuality: '做工质量',
    versatility: '多功能性',
    valueForMoney: '性价比',
    stability: '稳定性',
    portability: '便携性'
  };
  return translations[category] || category;
};

const overallScore = computed(() => {
  const scores = Object.values(props.performance);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
});

const filteredCategories = computed(() => {
  if (!filterKeyword.value.trim()) {
    return Object.entries(props.performance);
  }
  const keyword = filterKeyword.value.toLowerCase();
  return Object.entries(props.performance).filter(([key]) =>
    translateCategory(key).toLowerCase().includes(keyword)
  );
});

const chartData = computed(() => {
  const data: PerformanceData[] = filteredCategories.value.map(([key, value]) => ({
    category: translateCategory(key),
    current: value
  }));

  compareEquipmentList.value.forEach((eq, index) => {
    data.forEach(item => {
      const originalKey = Object.entries(props.performance).find(([k]) => translateCategory(k) === item.category)?.[0];
      if (originalKey) {
        item[`compare${index + 1}`] = eq.performance[originalKey] || 0;
      }
    });
  });

  return data;
});

const coreStrengths = computed(() => {
  return Object.entries(props.performance)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key, value]) => ({
      key,
      value,
      evaluation: value >= 9.5 ? '卓越，业内顶尖水平' : value >= 9 ? '优秀，远超同类产品' : value >= 8.5 ? '良好，高于平均水平' : ''
    }));
});

const areasForImprovement = computed(() => {
  return Object.entries(props.performance)
    .sort(([, a], [, b]) => a - b)
    .filter(([, value]) => value < 8)
    .slice(0, 2)
    .map(([key, value]) => ({
      key,
      value,
      evaluation: value >= 7 ? '基本满足需求，仍有提升空间' : value >= 6 ? '表现一般，可能影响特定使用场景' : '相对较弱，建议根据使用需求考虑'
    }));
});

const usageScenarios = computed(() => {
  const strengths = Object.entries(props.performance)
    .filter(([, value]) => value >= 9)
    .map(([key]) => translateCategory(key));

  if (strengths.length === 0) return '一般日常拍摄场景';

  let scenarios = '';
  if (strengths.includes('分辨率') || strengths.includes('锐度')) scenarios += '风光摄影、商业摄影、';
  if (strengths.includes('弱光性能')) scenarios += '夜景拍摄、室内人像、';
  if (strengths.includes('自动对焦') || strengths.includes('速度')) scenarios += '运动摄影、野生动物拍摄、';
  if (strengths.includes('虚化效果')) scenarios += '人像摄影、';
  if (strengths.includes('电池续航')) scenarios += '户外长时间拍摄、';

  return scenarios.replace(/、$/, '') || '各种摄影创作';
});

const createChart = () => {
  if (!canvasRef.value) return;

  const ctx = canvasRef.value.getContext('2d');
  if (!ctx) return;

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const labels = chartData.value.map(d => d.category);
  const datasets = [
    {
      label: props.equipmentName,
      data: chartData.value.map(d => d.current),
      backgroundColor: `${COLORS[0]}33`,
      borderColor: COLORS[0],
      borderWidth: 2,
      pointBackgroundColor: COLORS[0]
    }
  ];

  compareEquipmentList.value.forEach((eq, index) => {
    datasets.push({
      label: eq.name,
      data: chartData.value.map(d => d[`compare${index + 1}`] || 0),
      backgroundColor: `${COLORS[index + 1]}33`,
      borderColor: COLORS[index + 1],
      borderWidth: 2,
      pointBackgroundColor: COLORS[index + 1]
    });
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: chartType.value === 'radar' ? {
        min: 0,
        max: 10,
        angleLines: {
          color: props.darkMode ? '#4A5F8B33' : '#B8C6D833'
        },
        grid: {
          color: props.darkMode ? '#4A5F8B33' : '#B8C6D833'
        },
        pointLabels: {
          color: props.darkMode ? '#B8C6D8' : '#4A5F8B',
          font: { size: 12 }
        },
        ticks: {
          color: props.darkMode ? '#B8C6D8' : '#4A5F8B'
        }
      } : undefined,
      x: chartType.value === 'bar' ? {
        ticks: {
          color: props.darkMode ? '#B8C6D8' : '#4A5F8B',
          font: { size: 12 }
        },
        grid: {
          color: props.darkMode ? '#4A5F8B33' : '#B8C6D833'
        }
      } : undefined,
      y: chartType.value === 'bar' ? {
        min: 0,
        max: 10,
        ticks: {
          color: props.darkMode ? '#B8C6D8' : '#4A5F8B'
        },
        grid: {
          color: props.darkMode ? '#4A5F8B33' : '#B8C6D833'
        }
      } : undefined
    },
    plugins: {
      legend: {
        labels: {
          color: props.darkMode ? '#B8C6D8' : '#4A5F8B'
        }
      }
    }
  };

  chartInstance.value = new Chart(ctx, {
    type: chartType.value,
    data: {
      labels,
      datasets
    },
    options: chartOptions
  });
};

const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
};

onMounted(() => {
  nextTick(() => {
    createChart();
  });
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});

watch([chartType, compareEquipmentList, filterKeyword], () => {
  nextTick(() => {
    createChart();
  });
});

watch(showAddModal, (newVal) => {
  if (newVal) {
    newEquipmentName.value = '';
    newEquipmentPerformance.value = {};
  }
});

const handleAddCompareEquipment = () => {
  if (!newEquipmentName.value.trim()) {
    alert('请输入器材名称');
    return;
  }

  if (compareEquipmentList.value.length >= 3) {
    alert('最多支持添加3个对比器材');
    return;
  }

  const newEquipment: CompareEquipment = {
    id: `compare-${Date.now()}`,
    name: newEquipmentName.value.trim(),
    performance: Object.fromEntries(
      Object.entries(props.performance).map(([key, value]) => [key, newEquipmentPerformance.value[key] || value])
    )
  };

  compareEquipmentList.value = [...compareEquipmentList.value, newEquipment];
  showAddModal.value = false;
  alert('已添加对比器材');
};

const handleRemoveCompareEquipment = (id: string) => {
  compareEquipmentList.value = compareEquipmentList.value.filter(eq => eq.id !== id);
  alert('已移除对比器材');
};

const handleNewEquipmentPerformanceChange = (key: string, value: number) => {
  newEquipmentPerformance.value = { ...newEquipmentPerformance.value, [key]: value };
};

const handleChartTypeChange = (type: 'radar' | 'bar') => {
  chartType.value = type;
};

const handleToggle3DMode = () => {
  is3DMode.value = !is3DMode.value;
};

const handleExportChart = async () => {
  if (!chartRef.value) return;

  try {
    const canvas = await html2canvas(chartRef.value, {
      backgroundColor: props.darkMode ? '#2D3748' : '#F5F7FA',
      scale: 2
    });

    const imageDataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `器材性能对比图_${props.equipmentName}.png`;
    link.href = imageDataURL;
    link.click();
    alert('图表导出成功');
  } catch (error) {
    console.error('导出图表失败:', error);
    alert('导出图表失败，请重试');
  }
};

const theme = computed(() => {
  if (props.darkMode) {
    return {
      container: 'bg-[#2D3748] border-[#4A5F8B]',
      text: 'text-[#B8C6D8]',
      primaryText: 'text-[#F5F7FA]',
      secondaryText: 'text-[#6B7C93]',
      button: 'bg-[#4A5F8B] text-[#F5F7FA] hover:bg-[#6B7C93]',
      buttonSecondary: 'bg-[#1E2532] text-[#B8C6D8] hover:bg-[#4A5F8B] hover:text-[#F5F7FA]',
      input: 'bg-[#1E2532] border-[#4A5F8B] text-[#F5F7FA] placeholder:text-[#6B7C93]',
      chartContainer: 'bg-[#1E2532] border-[#4A5F8B]',
      highlight: 'text-[#4A5F8B]'
    };
  }

  return {
    container: 'bg-[#F5F7FA] border-[#B8C6D8]',
    text: 'text-[#4A5059]',
    primaryText: 'text-[#4A5059]',
    secondaryText: 'text-[#6B7C93]',
    button: 'bg-[#4A5F8B] text-white hover:bg-[#6B7C93]',
    buttonSecondary: 'bg-white text-[#4A5F8B] hover:bg-[#E6EBF2]',
    input: 'bg-white border-[#B8C6D8] text-[#4A5059] placeholder:text-[#6B7C93]',
    chartContainer: 'bg-white border-[#B8C6D8]',
    highlight: 'text-[#4A5F8B]'
  };
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>