<template>
  <div>
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface Props {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area'
  data: {
    labels: string[]
    datasets: {
      label?: string
      data: number[]
      borderColor?: string
      backgroundColor?: string | string[]
      fill?: boolean
      tension?: number
      pointRadius?: number
      pointHoverRadius?: number
      borderWidth?: number
      borderRadius?: number
    }[]
  }
  options?: Record<string, any>
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '100%',
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

function createChart() {
  if (!canvasRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) return

  chartInstance = new Chart(ctx, {
    type: props.type === 'area' ? 'line' : props.type,
    data: {
      labels: props.data.labels,
      datasets: props.data.datasets.map(ds => ({
        ...ds,
        fill: props.type === 'area' ? {
          target: 'origin',
          above: ds.backgroundColor || 'rgba(74,95,139,0.1)',
        } : ds.fill,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...props.options,
    },
  })
}

onMounted(() => {
  createChart()
})

watch(() => props.data, () => {
  createChart()
}, { deep: true })

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>