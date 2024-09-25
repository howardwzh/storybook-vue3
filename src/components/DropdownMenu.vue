<template>
  <div class="relative inline-block text-left">
    <button @click.stop="toggleMenu" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
      Toggle Menu
    </button>
    <div v-if="isOpen" v-click-outside="closeMenu" class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div class="py-1">
        <p class="block px-4 py-2 text-sm text-gray-700">Dropdown Menu Content</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import clickOutside from '../directives/clickOutside';

export default {
  name: 'DropdownMenu',
  directives: {
    clickOutside
  },
  setup() {
    const isOpen = ref(false);

    const toggleMenu = () => {
      isOpen.value = !isOpen.value;
    };

    const closeMenu = () => {
      isOpen.value = false;
    };
    console.log('isOpen', isOpen.value);

    return {
      isOpen,
      toggleMenu,
      closeMenu
    };
  }
};
</script>

<style scoped>
/* No additional styles needed */
</style>
