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
    <div :class="{ 'action-button': true, 'action-button-expand': isExpand }" @click="onActionButtonClick" />
    <div
      :class="{ 'icon-tool-button': true, 'oft1': isExpand, 'oft1-rotate-reverse': !isExpand }"
      @click="() => onToolsButtonClick(1)"
    >
      <span>产品展示</span>
      <img width="50" src="https://seapicann.shsiliang.com/241011-1430/img/kaijiangxianchang_06c915b5.png" />
    </div>
    <div
      @click="() => onToolsButtonClick(2)"
      :class="{ 'icon-tool-button': true, 'oft2': isExpand, 'oft2-rotate-reverse': !isExpand }"
    >
      <span>服务内容</span>
      <img width="50" src="https://49208.com/img/jiaoliudating.18841653.png" />
    </div>
    <div
      @click="() => onToolsButtonClick(3)"
      :class="{ 'icon-tool-button': true, 'oft3': isExpand, 'oft3-rotate-reverse': !isExpand }"
    >
      <span>关于我们</span>
      <img width="50" src="https://seapicann.shsiliang.com/241011-1430/img/chatroom_63f624eb.png" />
    </div>
    <div
      @click="() => onToolsButtonClick(4)"
      :class="{ 'icon-tool-button': true, 'oft4': isExpand, 'oft4-rotate-reverse': !isExpand }"
    >
      <span>售后服务</span>
      <img
        style="background-color: white; border-radius: 25px"
        width="50"
        fit="cover"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAaVBMVEVHcEwjb9YjZ8wjYsYjbdQxfuElcdgpdNolbdQlbtQiXsIkcNYiYcUjeuMjctkkatAjZcojc9siXsEkc9sjgOoiYcUjd+AiXL8iZMkjeeIjfOYiac8iXsIjdd0ic9oiWbsibNMicNcjgOuGCLG+AAAAFXRSTlMAtslrhgdDESAx312X1ppQ7euxb7U8gV88AAAD5klEQVRYw+1Y58KrIAxVUBlurdXapb7/Q94QULHbr/67PVpGQg4hCGgd54cfftgc4cZ8It6YcDdsyxcMA9+Sj8XDEDhiMz5/NwAhjzflG4J42GyCFd8A6RbO8QDd05RfTkSY7HLF0+qrHXbfsJU7IFFsreGDYhz8OWq7FjHgPQEoS/YF3UPk5erBJu3hBeHqgYu4BUK8Du3iGgtt663ZpLQlwmQmb63i7uNIJoePsI/5p3z7w17hIQv+9pi0nzGW+7c4jIX4g1GHN8ZndWOyt7JRGftv5xesEYbJ3FN9fz6PLRBv55qc77BfUtzI3+y34dw+j3NduOBtKdzE85LY1J4POi2F4+cXhfMlCVS4eRmbuuLE4iUODQNPtAxOVlGm91uee7mUjqeN3HnyQt3FBM9yKEAd7I/lwkQD+HJmHDSB5mjL3Jmtj3XEmLEOlOySOgzs3JsDEhSJE/YKiXm+L2ZP8UCHip4gEXf73mwNpZK6qu2lX+4W0AYkKu1zMyhPtWWTmar5eqDQxsytnys5c4K+X7rIkUirra1OkGR2xPDx3LMWHGoCTWyvwxA9F30HvFN0eSh8j43edmaZhXDUh3z2BEw8PUL7RSrpus5zQki7ZO7cqoRuwqzGPR0rMZgQ6NG2VCGEeojSbuyHqUr3YF8OUMEsy9xBX+wgErRVfnbjaFK0e7BUvUVPWNO9EKtRBnWBvXW+TXh8SjguDardFZBmVqMj2ALhETCtxO54fEyo5DOhsuFACELbQ5AawslDVXlCCBgJS20joBfbQwJSiKHubRWhp0cVQGrHUPkWauXYUqDdg5d0HORRWK5ImGXI7FlO0BmQNsfI9jp7cGawzPKGKRNXO2o/h7RpGlgpzbFpsjGILCLFOH4eERJNlYJEbBox2KiVAhm113KDTFkD8gevLWmGXdE7hbJrGljLYNkszlSC8kips7vD1kMzoHRvVFyixncCSMnyLAFJhPKmkUszQZoZnh1Uofkg6sqTm1MArGAGdIvM0vFoZqvgzuZQjhoB83TrIEyBrCoKk1PhRSiasbSAphUC6bQyoiGNSKNlignM5N3z4NMIgiurEZmU2URVNZWFZpGljqgkfXaYhtVaFGpwL077Yh3dKeNcVvTFqwPPTmtQpCJ7yQfPQnaqXpPUEF5JioimHKb6dErffcOe6teEcpwAP4jqU/H+6zQ91a9wqgsvKoqCSHCWfPQxQOsPICUM+tPPcSFfclG2+kuKFfW1vsJdj/nVFFROqRrzyi97ml0foR4L0WonfSqvT1H85Y8H/yll9Of/MeBBu+WUBWXOV+BhVEhFi4tju/9Yfvjh/8Y/I5G0R6X3D5cAAAAASUVORK5CYII="
      />
    </div>
    <div
      @click="() => onToolsButtonClick(5)"
      :class="{ 'icon-tool-button': true, 'oft5': isExpand, 'oft5-rotate-reverse': !isExpand }"
    >
      <span>联系方式</span>
      <img width="50" src="https://seapicann.shsiliang.com/241011-1430/img/ziliaodaquan_2b434b4d.png" />
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
    width: 50px;
    height: 50px;
    border-radius: 25px;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 300;
    background-color: #333;
    background-size: 100% 100%;
    animation: rotateAndCollapse 0.2s linear 1 forwards;
    animation-play-state: paused;
  }

  .action-button-expand {
    animation: rotateAndBlossom 0.2s linear 1 forwards;
    z-index: calc(9e999);
  }

  .icon-tool-button {
    .init-status;
    height: 50px;
    border-radius: 25px;
    position: absolute;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
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

  .oft1-rotate-reverse {
    animation: oft1Collapse 0.2s linear 1 forwards;
    animation-play-state: paused;
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

  @keyframes rotateAndBlossom {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(-180deg);
      background-color: #333;
    }
    100% {
      transform: rotate(-360deg);
      background-color: #333;
    }
  }

  @keyframes rotateAndCollapse {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
      background-color: #333;
    }
    100% {
      transform: rotate(360deg);
      background-color: #333;
    }
  }

  @keyframes oft1Blossom {
    0% {
      .init-status;
    }
    100% {
      .getCurrentStatus(1,0);
      z-index: calc(9e999);
    }
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

  @keyframes oft1Collapse {
    0% {
      .getCurrentStatus(1,0);
    }
    100% {
      .init-status;
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