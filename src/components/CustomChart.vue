<template>
  <div class="chart-container">
    <component :is="chartComponent" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import { defineComponent, h, computed } from 'vue'
import { Bar, Line, Pie, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, ArcElement)

export default defineComponent({
  name: 'CustomChart',
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['bar', 'line', 'pie', 'doughnut'].includes(value)
    },
    data: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const chartComponent = computed(() => {
      switch (props.type) {
        case 'bar':
          return Bar
        case 'line':
          return Line
        case 'pie':
          return Pie
        case 'doughnut':
          return Doughnut
        default:
          return Bar
      }
    })

    const chartData = computed(() => props.data)
    const chartOptions = computed(() => ({
      responsive: true,
      maintainAspectRatio: false,
      ...props.options
    }))

    return {
      chartComponent,
      chartData,
      chartOptions
    }
  }
})
</script>

<style scoped>
.chart-container {
  height: 400px;
  width: 100%;
}
</style>