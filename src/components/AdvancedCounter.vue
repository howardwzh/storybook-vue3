<template>
  <div class="advanced-counter p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
    <h2 class="text-xl font-semibold text-gray-900">Advanced Counter: {{ count }}</h2>
    <p class="text-gray-700">Squared value: {{ squaredCount }}</p>
    <p class="text-gray-700">Count is {{ evenOrOdd }}</p>
    <div class="space-x-2">
      <button @click="increment" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Increment</button>
      <button @click="decrement" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Decrement</button>
      <button @click="reset" class="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Reset</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'AdvancedCounter',
  setup() {
    const count = ref(0)
    const squaredCount = computed(() => count.value * count.value)
    const evenOrOdd = computed(() => count.value % 2 === 0 ? 'even' : 'odd')

    const increment = () => count.value++
    const decrement = () => count.value--
    const reset = () => count.value = 0

    watch(count, (newValue, oldValue) => {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    })

    onMounted(() => {
      console.log('AdvancedCounter component mounted')
    })

    onUnmounted(() => {
      console.log('AdvancedCounter component will be unmounted')
    })

    return {
      count,
      squaredCount,
      evenOrOdd,
      increment,
      decrement,
      reset
    }
  }
}
</script>

<style scoped>
.advanced-counter {
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
  border-radius: 5px;
}
</style>
