<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
};
</script>

<style>
#app, body, html {
  background: #000;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-size: 14px;
  overflow: hidden !important;
  font-family: Microsoft YaHei,Hiragino Sans GB;
}

html,body {
  position: relative;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  overflow: hidden;
}
@keyframes dialog-fade-in {
  0% {
      transform: translate3d(0,100% , 0);
      opacity: 0;
  }
  100% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
      transform: translate3d(0, 0, 0);
      opacity: 1;
  }
  100% {
      transform: translate3d(0, -100%, 0);
      opacity: 0;
  }
}
</style>
