<template>
  <ul class="menu" id="menu">
    <template v-if="appId">
      <li class="menu-item"><a @click="openApp">打开</a></li>
      <li class="menu-item"><a @click="deleteApp">删除</a></li>
    </template>
    <li class="menu-item" v-else><a @click="setTheme">主题设置</a></li>
    <!-- <li class="menu-item">
      <a @click="deleteApp">主题设置<i class="el-icon-caret-right"></i></a>
      <ul class="menu">
        <li class="menu-item"><a @click="changeTheme(0)">主题一</a></li>
        <li class="menu-item"><a @click="changeTheme(1)">主题二</a></li>
        <li class="menu-item"><a @click="changeTheme(2)">主题三</a></li>
      </ul>
    </li> -->
  </ul>
</template>

<script>
export default {
  props: {
    // background: {
    //   type: Object
    // },
    appId: {
      type: Number || String
    }
  },
  mounted () {
  },
  data () {
    return {
    }
  },
  methods: {
    setTheme () {
      this.$emit('setTheme')
    },
    openApp () {
      this.$emit('openApp', this.appId)
    },
    deleteApp () {
      this.$emit('deleteApp', this.appId)
    }
    // changeTheme (id) {
    //   let vm = this;
    //   let imgs = ['/static/images/1.jpg', '/static/images/2.jpg', '/static/images/3.jpg']
    //   if (isNaN(id)) return
    //   id = id % imgs.length
    //   let img = new Image();
    //   img.src = imgs[id];
    //   // 确定图片加载完成后再进行背景图片切换
    //   img.onload = function () {
    //     vm.background.src = imgs[id];
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
#menu {
  z-index: 10;
}
.menu-item {
  cursor: pointer;
  display: block;
  font-size: 12px;
  text-align: center;
  position: relative;
  a {
    position: relative;
    display: block;
    height: 25px;
    line-height: 24px;
    margin: 2px 0;
    padding: 0 5px;
    color: #333;
    text-decoration: none;
    i {
      position: absolute;
      right: 5px;
      font-weight: 500;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .menu {
    left: 95px;
    top: 0;
    display: none;
  }
  &:hover .menu {
    display: block;
  }
  &:hover > a {
    background: rgb(52, 140, 204);
    color: white;
  }
}

.menu {
  padding: 0;
  width: 100px;
  position: absolute;
  border: 1px solid #b8cbcb;
  background-color: #fff;
  box-shadow: 2px 2px 5px #666;
  li:not(:first-child) {
    border-top: 1px solid #d6d5d5;
  }
}
</style>
