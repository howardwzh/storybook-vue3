import '../src/style.css'; // 引入全局样式
import { setup } from '@storybook/vue3';
import vuetify from '../src/plugins/vuetify';

// 使用 setup 注册 Vuetify
setup((app) => {
  app.use(vuetify);
});

/** @type { import('@storybook/vue3').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
