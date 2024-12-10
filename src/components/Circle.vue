<script setup>
  import { ref } from 'vue'

  const isExpand = ref(false)

  const onToolsButtonClick = async (index) => {
    console.log('index', index)
  }

  function onClickedWrapper() {
    isExpand.value = false
  }

  function onActionButtonClick() {
    isExpand.value = !isExpand.value
  }
</script>

<template>
  <div class="buttons-wrapper">
    <div :class="{ 'action-button': true, 'action-button-expand': isExpand }" @click="onActionButtonClick">
      <v-icon icon="mdi-plus-circle" size="50px" color="#006769" />
    </div>
    <div
      :class="{ 'icon-tool-button': true, 'oft1': isExpand, 'oft1-rotate-reverse': !isExpand }"
      @click="() => onToolsButtonClick(1)"
    >
      <span>产品展示</span>
      <v-icon icon="mdi-home-circle" size="50px" color="#0D92F4" />
    </div>
    <div
      @click="() => onToolsButtonClick(2)"
      :class="{ 'icon-tool-button': true, 'oft2': isExpand, 'oft2-rotate-reverse': !isExpand }"
    >
      <span>服务内容</span>
      <v-icon icon="mdi-recycle" size="50px" color="#81A263"/>
    </div>
    <div
      @click="() => onToolsButtonClick(3)"
      :class="{ 'icon-tool-button': true, 'oft3': isExpand, 'oft3-rotate-reverse': !isExpand }"
    >
      <span>关于我们</span>
      <v-icon icon="mdi-fire-circle" size="50px" color="#FF5F00" />
    </div>
    <div
      @click="() => onToolsButtonClick(4)"
      :class="{ 'icon-tool-button': true, 'oft4': isExpand, 'oft4-rotate-reverse': !isExpand }"
    >
      <span>售后服务</span>
      <v-icon icon="mdi-leaf-circle" size="50px" color="#009FBD" />
    </div>
    <div
      @click="() => onToolsButtonClick(5)"
      :class="{ 'icon-tool-button': true, 'oft5': isExpand, 'oft5-rotate-reverse': !isExpand }"
    >
      <span>联系方式</span>
      <v-icon icon="mdi-music-circle" size="50px" color="#A02334" />
    </div>
  </div>
</template>

<style scoped lang="less">
  .content--rotate-bloom {
    width: calc(min(100vw, 600px) - 32px);
    height: calc(100vh - 32px);
    left: calc(50% - (min(100vw, 600px) - 32px) / 2);
    top: calc(50% - (100vh - 32px) / 2);
  }

  @center-right: 12px;
  @center-bottom: 160px;
  @ellipse-radius-x: 90px; // 椭圆的水平半径（左右窄）
  @ellipse-radius-y: 140px; // 椭圆的垂直半径（上下高）
  @startAngle: 90deg; // 起始角度（12点钟方向）
  @totalAngle: 180deg; // 总角度（半圆）
  @itemCount: 5; // 总个数
  @offset-right: 4px - @ellipse-radius-x;
  @offset-bottom: 2px - @ellipse-radius-y;

  .buttons-wrapper {
    position: fixed;
    right: @center-right;
    bottom: @center-bottom;
    z-index: 1000;
    // @media (min-width: 600px) {
    //   right: calc(((100vw - 600px) / 2) + @center-right);
    // }
  }

  .init-status {
    right: 0;
    bottom: 0;
    opacity: 0;
  }

  .getCurrentStatus(@index, @offset-angle) {
    // 计算当前项目的角度
    @currentAngle: @startAngle + (@totalAngle / (@itemCount - 1) * (@index - 1)) + @offset-angle;

    // 使用三角函数计算位置
    @right: @offset-right+ @ellipse-radius-x * (1 - cos(@currentAngle));
    @bottom: @offset-bottom+ @ellipse-radius-y * (1 + sin(@currentAngle));

    right: unit(@right, px);
    bottom: unit(@bottom, px);
    opacity: 1;
  }

  .action-button {
    border-radius: 30px;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 300;
    background-size: 100% 100%;
    animation: rotateAndCollapse 0.3s linear 1 forwards;
    // animation-play-state: paused;
  }

  .action-button-expand {
    animation: rotateAndBlossom 0.3s linear 1 forwards;
    z-index: 999;
  }


  @keyframes rotateAndBlossom {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-90deg);
    }
    100% {
      transform: rotate(-180deg);
    }
  }

  @keyframes rotateAndCollapse {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(90deg);
    }
    100% {
      transform: rotate(180deg);
    }
  }

  .icon-tool-button {
    .init-status;
    height: 50px;
    border-radius: 25px;
    position: absolute;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
    animation-direction: reverse;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    z-index: 210;
    white-space: nowrap;
    padding-left: 12px;
    img {
      max-width: initial;
    }
  }

  .icon-tool-button span {
    font-size: 14px;
    color: #333;
    margin-right: 6px;
  }

  .oft1 {
    animation: oft1Blossom 0.2s linear 1 forwards;
  }

  .oft1-rotate-reverse {
    animation: oft1Collapse 0.2s linear 1 forwards;
    animation-play-state: paused;
    animation-delay: 0.12s;
  }


  @keyframes oft1Blossom {
    0% {
      .init-status;
    }
    100% {
      .getCurrentStatus(1,0);
    }
  }


  @keyframes oft1Collapse {
    0% {
      .getCurrentStatus(1,0);
    }
    100% {
      .init-status;
    }
  }

  .oft2 {
    animation: oft2Blossom 0.2s linear 1 forwards;
    animation-delay: 0.03s;
  }

  .oft3 {
    animation: oft3Blossom 0.2s linear 1 forwards;
    animation-delay: 0.06s;
  }

  .oft4 {
    animation: oft4Blossom 0.2s linear 1 forwards;
    animation-delay: 0.09s;
  }

  .oft5 {
    animation: oft5Blossom 0.2s linear 1 forwards;
    animation-delay: 0.12s;
  }

  .oft2-rotate-reverse {
    animation: oft2Collapse 0.2s linear 1 forwards;
    animation-play-state: paused;
    animation-delay: 0.09s;
  }

  .oft3-rotate-reverse {
    animation: oft3Collapse 0.2s linear 1 forwards;
    animation-play-state: paused;
    animation-delay: 0.06s;
  }

  .oft4-rotate-reverse {
    animation: oft4Collapse 0.2s linear 1 forwards;
    animation-play-state: paused;
    animation-delay: 0.03s;
  }

  .oft5-rotate-reverse {
    animation: oft5Collapse 0.2s linear 1 forwards;
    animation-play-state: paused;
    animation-delay: 0.01s;
  }



  @keyframes oft2Blossom {
    0% {
      .init-status;
    }
    100% {
      .getCurrentStatus(2,14);
      z-index: calc(9e999);
    }
  }

  @keyframes oft3Blossom {
    0% {
      .init-status;
    }
    100% {
      .getCurrentStatus(3,0);
      z-index: calc(9e999);
    }
  }

  @keyframes oft4Blossom {
    0% {
      .init-status;
    }
    100% {
      .getCurrentStatus(4,-14);
      z-index: calc(9e999);
    }
  }

  @keyframes oft5Blossom {
    0% {
      .init-status;
    }
    100% {
      .getCurrentStatus(5,0);
      z-index: calc(9e999);
    }
  }


  @keyframes oft2Collapse {
    0% {
      .getCurrentStatus(2,14);
    }
    100% {
      .init-status;
    }
  }

  @keyframes oft3Collapse {
    0% {
      .getCurrentStatus(3,0);
    }
    100% {
      .init-status;
    }
  }

  @keyframes oft4Collapse {
    0% {
      .getCurrentStatus(4,-14);
    }
    100% {
      .init-status;
    }
  }

  @keyframes oft5Collapse {
    0% {
      .getCurrentStatus(5,0);
    }
    100% {
      .init-status;
    }
  }
</style>