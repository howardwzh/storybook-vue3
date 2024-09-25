<template>
  <div ref="editor"></div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export default {
  name: 'RichTextEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const editor = ref(null);
    let quill = null;

    onMounted(() => {
      quill = new Quill(editor.value, {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']
          ]
        }
      });

      quill.root.innerHTML = props.modelValue;

      quill.on('text-change', () => {
        emit('update:modelValue', quill.root.innerHTML);
      });
    });

    watch(() => props.modelValue, (newValue) => {
      if (quill && newValue !== quill.root.innerHTML) {
        quill.root.innerHTML = newValue;
      }
    });

    return { editor };
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>