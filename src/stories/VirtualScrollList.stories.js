import VirtualScrollList from '../components/VirtualScrollList.vue';

export default {
  title: 'Components/VirtualScrollList',
  component: VirtualScrollList,
  argTypes: {
    items: { control: 'array' },
    itemHeight: { control: 'number' },
    buffer: { control: 'number' }
  }
};

const Template = (args) => ({
  components: { VirtualScrollList },
  setup() {
    return { args };
  },
  template: '<VirtualScrollList v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  items: Array.from({ length: 1000 }, (_, i) => ({ id: i, content: `Item ${i}` })),
  itemHeight: 50,
  buffer: 5
};
