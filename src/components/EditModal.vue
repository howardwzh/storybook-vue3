<template>
  <transition name="modal">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancel"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Edit Item
                </h3>
                <div class="mt-2">
                  <form @submit.prevent="saveEdit">
                    <div v-for="column in columns" :key="column.key" class="mb-4">
                      <label :for="column.key" class="block text-sm font-medium text-gray-700">{{ column.label }}</label>
                      <template v-if="column.key === 'id'">
                        <span class="mt-1 block w-full text-gray-500">{{ editingItemCopy[column.key] }}</span>
                      </template>
                      <template v-else-if="!column.component">
                        <input 
                          :id="column.key" 
                          v-model="editingItemCopy[column.key]" 
                          :type="column.type || 'text'" 
                          class="border mt-1 block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        >
                      </template>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="saveEdit" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
              Save
            </button>
            <button @click="cancel" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref, watch, computed } from 'vue';

export default {
  name: 'EditModal',
  props: {
    modelValue: {
      type: Object,
      default: null
    },
    columns: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue', 'save'],
  setup(props, { emit }) {
    const editingItemCopy = ref({});

    watch(() => props.modelValue, (newValue) => {
      if (newValue) {
        editingItemCopy.value = { ...newValue };
      }
    }, { deep: true });

    const editableColumns = computed(() => 
      props.columns.filter(column => !column.component)
    );

    const saveEdit = () => {
      emit('save', editingItemCopy.value);
      emit('update:modelValue', null);
    };

    const cancel = () => {
      emit('update:modelValue', null);
    };

    return {
      editingItemCopy,
      editableColumns,
      saveEdit,
      cancel
    };
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
