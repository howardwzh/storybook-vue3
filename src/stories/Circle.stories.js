import DropdownMenu from '../components/Circle.vue';

export default {
  title: 'UI/DropdownMenu',
  component: DropdownMenu,
};

const Template = (args) => ({
  components: { DropdownMenu },
  setup() {
    return { args };
  },
  template: `
    <div style="height: 100vh; display: flex; justify-content: center; align-items: center;">
      <DropdownMenu v-bind="args" />
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};
