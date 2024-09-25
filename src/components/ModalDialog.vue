<template>
  <transition name="modal-fade">
    <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75" @click="close">
      <div class="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full" @click.stop>
        <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
        <p class="text-gray-700 mb-4">{{ message }}</p>
        <button @click="close" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Close</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ModalDialog',
  props: {
    title: {
      type: String,
      default: 'Modal Title'
    },
    message: {
      type: String,
      default: 'This is a modal message.'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const close = () => {
      emit('update:visible', false);
    };

    return {
      close
    };
  }
};
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.5s;
}

.modal-fade-enter, .modal-fade-leave-to /* .modal-fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
