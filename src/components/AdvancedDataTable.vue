<template>
  <div class="overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th v-for="column in columns" :key="column.key" scope="col" class="px-6 py-3">
            <div class="flex items-center">
              {{ column.label }}
              <button @click="sortBy(column.key)" class="ml-2 focus:outline-none">
                <span v-if="sortKey === column.key" class="text-blue-500">
                  {{ sortOrder === 'asc' ? '▲' : '▼' }}
                </span>
                <span v-else class="text-gray-400">⇅</span>
              </button>
            </div>
          </th>
          <th scope="col" class="px-6 py-3">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedData" :key="index" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
          <td v-for="column in columns" :key="column.key" class="px-6 py-4">
            <component 
              v-if="column.component"
              :is="column.component"
              :value="item[column.key]"
              @update:value="(newValue) => updateItemValue(item, column.key, newValue)"
            />
            <template v-else>
              {{ item[column.key] }}
            </template>
          </td>
          <td class="px-6 py-4 text-right">
            <button @click="editItem(item)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2">Edit</button>
            <button @click="$emit('delete', item)" class="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <EditModal 
      v-model="editingItem"
      :columns="columns"
      @save="saveEdit"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import EditModal from './EditModal.vue';

export default {
  name: 'AdvancedDataTable',
  components: {
    EditModal
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    }
  },
  emits: ['edit', 'delete', 'status-change'],
  setup(props, { emit }) {
    const sortKey = ref('');
    const sortOrder = ref('asc');
    const editingItem = ref(null);

    const sortBy = (key) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
      } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
      }
    };

    const sortedData = computed(() => {
      if (!sortKey.value) return props.data;

      const sorted = [...props.data].sort((a, b) => {
        const aValue = a[sortKey.value];
        const bValue = b[sortKey.value];

        if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
      });

      return sorted;
    });

    const editItem = (item) => {
      editingItem.value = { ...item };
    };

    const saveEdit = (editedItem) => {
      const index = props.data.findIndex(item => item.id === editedItem.id);
      if (index !== -1) {
        emit('edit', { index, item: editedItem });
      }
    };

    const updateItemValue = (item, key, value) => {
      if (key === 'status') {
        emit('status-change', { ...item, [key]: value });
      }
    };

    onMounted(() => {
      console.log('AdvancedDataTable mounted');
    });

    return {
      sortKey,
      sortOrder,
      sortBy,
      sortedData,
      editingItem,
      editItem,
      saveEdit,
      updateItemValue
    };
  }
};
</script>
