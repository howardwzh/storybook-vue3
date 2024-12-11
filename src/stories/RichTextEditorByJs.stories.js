import RichTextEditorByJs from '../components/RichTextEditorByJs.vue';
import { ref } from 'vue';

export default {
  title: 'Components/RichTextEditorByJs',
  component: RichTextEditorByJs,
};

const Template = (args) => ({
  components: { RichTextEditorByJs },
  setup() {
    const color = ref(args.color??"#00ff00");
    const content = ref("");
    const changeColor = (c) => {
      color.value = c;
    };
    return { args, color, changeColor, content };
  },
  template: `
    <div style="height: 100vh; display: flex; flex-direction: column; width:70vw;">
      <RichTextEditorByJs v-bind="args" v-model="content" :color="color" style="border:1px solid #333;" />
      <div style="display:flex;gap:8px; padding: 8px 0;">
      <button @mousedown.prevent="changeColor('#000000')" style="background-color:#000000"></button>
      <button @mousedown.prevent="changeColor('#E73879')" style="background-color:#E73879"></button>
      <button @mousedown.prevent="changeColor('#BF2EF0')" style="background-color:#BF2EF0"></button>
      <button @mousedown.prevent="changeColor('#FFA24C')" style="background-color:#FFA24C"></button>
      <button @mousedown.prevent="changeColor('#640D5F')" style="background-color:#640D5F"></button>
      </div>
      <div style="width:100%;">{{content}}</div>
    </div>
  `,
});

export const Default = Template.bind({});
Default.args = {};
