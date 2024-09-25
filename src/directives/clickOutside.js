export default {
  beforeMount(el, binding) {
    el.clickOutsideEvent = (event) => {
      // 检查点击是否发生在元素外部
      if (!(el === event.target || el.contains(event.target))) {
        // 如果是，调用绑定的回调函数
        binding.value(event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
};
