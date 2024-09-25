import '../style.css';
import AdvancedDataTable from '../components/AdvancedDataTable.vue';
import Switch from '../components/Switch.vue';
import { h } from 'vue';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Advanced/AdvancedDataTable',
  component: AdvancedDataTable,
  argTypes: {
    data: { control: 'object' },
    columns: { control: 'object' },
  },
};

const Template = (args) => ({
  components: { AdvancedDataTable },
  setup() {
    const onEdit = ({ index, item }) => {
      action('edit')(index, item);
      args.data[index] = { ...item };
    };

    const onDelete = (item) => {
      action('delete')(item);
      const index = args.data.findIndex(i => i.id === item.id);
      if (index !== -1) {
        args.data.splice(index, 1);
      }
    };

    const onStatusChange = (item) => {
      action('statusChange')(item);
      const index = args.data.findIndex(i => i.id === item.id);
      if (index !== -1) {
        args.data[index] = { ...item };
      }
    };

    return { 
      args,
      onEdit,
      onDelete,
      onStatusChange
    };
  },
  template: '<AdvancedDataTable v-bind="args" @edit="onEdit" @delete="onDelete" @status-change="onStatusChange" />',
});

export const Default = Template.bind({});
Default.args = {
  data: [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, status: true },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 25, status: false },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', age: 35, status: true },
  ],
  columns: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'age', label: 'Age', type: 'number' },
    {
      key: 'status',
      label: 'Status',
      component: {
        components: { Switch },
        props: ['value'],
        emits: ['update:value'],
        setup(props, { emit }) {
          return () => h(Switch, {
            modelValue: props.value,
            'onUpdate:modelValue': (newValue) => emit('update:value', newValue)
          });
        }
      },
    },
  ],
};

export const WithCustomComponent = Template.bind({});
WithCustomComponent.args = {
  ...Default.args,
  data: [
    ...Default.args.data,
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', age: 28, status: true },
    { id: 5, name: 'Charlie Davis', email: 'charlie@example.com', age: 32, status: false },
  ],
};
