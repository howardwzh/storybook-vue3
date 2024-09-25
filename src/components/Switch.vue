<template>
  <div 
    @click="toggle" 
    :class="[
      'relative w-12 h-7 rounded-full cursor-pointer transition-colors duration-200 ease-in-out',
      modelValue ? 'bg-green-500' : 'bg-gray-200'
    ]"
  >
    <span class="sr-only">Toggle switch</span>
    <div
      :class="[
        'absolute left-0.5 top-0.5 w-6 h-6 rounded-full bg-white transition-transform duration-200 ease-in-out transform',
        modelValue ? 'translate-x-5' : 'translate-x-0'
      ]"
    ></div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Switch',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const toggle = () => {
      emit('update:modelValue', !props.modelValue);
    };

    return { toggle };
  }
});
</script>

<style scoped>
.bg-green-500 {
  background-color: #34C759;
}

.bg-gray-200 {
  background-color: #E9E9EA;
}

div {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

div > div {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
