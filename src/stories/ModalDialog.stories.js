import '../style.css';
import ModalDialog from '../components/ModalDialog.vue';
import { ref } from 'vue';

export default {
  title: 'Advanced/ModalDialog',
  component: ModalDialog,
  argTypes: {
    title: { control: 'text' },
    message: { control: 'text' },
    visible: { control: 'boolean' }
  }
};

const Template = (args) => ({
  components: { ModalDialog },
  setup() {
    const visible = ref(args.visible);
    const toggleModal = () => {
      visible.value = !visible.value;
    };
    return { args, visible, toggleModal };
  },
  template: `
    <div style="height: 100vh; display: flex; justify-content: center; align-items: center;">
      <button @click="toggleModal">Toggle Modal</button>
      <ModalDialog v-bind="args" :visible="visible" @update:visible="visible = $event" />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {
  title: 'Default Modal Title',
  message: 'This is the default modal message.',
  visible: false
};
