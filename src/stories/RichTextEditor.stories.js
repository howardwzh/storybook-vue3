import RichTextEditor from '../components/RichTextEditor.vue';

export default {
  title: 'Components/RichTextEditor',
  component: RichTextEditor,
  argTypes: {
    modelValue: { control: 'text' }
  }
};

const Template = (args) => ({
  components: { RichTextEditor },
  setup() {
    return { args };
  },
  template: '<RichTextEditor v-model="args.modelValue" />',
});

export const Default = Template.bind({});
Default.args = {
  modelValue: '<p>Start editing...</p>'
};