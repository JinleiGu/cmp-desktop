<template>
  <div class="parentBox">
    <div class="zBox">
      <img src="/static/img/404.png" alt="">
      <div class="zSorry">抱歉，你访问的页面不存在！</div>
      <div>
        <el-button type="primary" @click="go" icon="el-icon-back">返回</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    go () {
      this.$router.push({ name: 'Desktop' })
    }
  }
}
</script>

<style scoped>
  .parentBox {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .zBox {
    width: 400px;
    height: 200px;
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
  }

  .zSorry {
    color: #666;
    font-size: 16px !important;
    margin-top: 32px;
    margin-bottom: 28px;
  }

  .zBox button {
    width: 98px;
    height: 28px;
    font-size: 12px
  }
</style>
