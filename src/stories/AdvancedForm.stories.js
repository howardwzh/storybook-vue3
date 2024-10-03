import AdvancedForm from '../components/AdvancedForm.vue';

export default {
  title: 'Advanced/AdvancedForm',
  component: AdvancedForm,
};

const Template = (args) => ({
  components: { AdvancedForm },
  setup() {
    return { args };
  },
  template: '<AdvancedForm v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {};
