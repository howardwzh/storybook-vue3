import '../style.css';
import AdvancedCounter from '../components/AdvancedCounter.vue';

export default {
  title: 'Advanced/AdvancedCounter',
  component: AdvancedCounter,
};

const Template = (args) => ({
  components: { AdvancedCounter },
  setup() {
    return { args };
  },
  template: '<AdvancedCounter v-bind="args" />',
});

export const Default = Template.bind({});
