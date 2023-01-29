<template>
  <el-dialog title="主题设置" :close-on-click-modal="false" :visible.sync="dialog.visible" width="60%">
    <div>
      <span>显示方式：</span>
      <el-select v-model="themeStyle">
        <el-option v-for="style in styles" :key="style" :label="style" :value="style"></el-option>
      </el-select>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(row, key) in themeData" :key="key">
        <div class="theme-item" @click="switchTheme(row.src)" >
          <div class="theme-img-item" :class="{'active-bg': urlImg === row.src}">
            <img :src="row.src" style="cursor: pointer;width: 100%;height: 100%;" />
          </div>
          <p>{{row.name}}</p>
        </div>
      </el-col>
    </el-row>
    <div slot="footer">
      <el-button @click="cancel">关闭</el-button>
      <el-button type="primary" @click="changeTheme">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getTheme, setTheme } from 'api/user'
export default {
  props: {
    dialog: {
      type: Object
    }
  },
  created () {
    this.getTheme()
  },
  mounted () {
    let userInfo = JSON.parse(localStorage.getItem('userData')) || {}
  },
  data () {
    return {
      themeData: [
        {
          src: '/static/images/1.png',
          name: 'rainy city'
        },
        {
          src: '/static/images/2.png',
          name: 'Urban agglomeration'
        },
        {
          src: '/static/images/3.png',
          name: 'sandy beach'
        },
        {
          src: '/static/images/4.png',
          name: 'simple style'
        }
      ],
      userId: '',
      themeStyle: '',
      styles: ['填充', '适应', '平铺', '拉伸', '居中'],
      urlImg: ''
    }
  },
  methods: {
    getTheme () {
      getTheme().then(res => {
        if (res.success) {
          this.themeStyle = res.data.themeStyle || '填充'
          this.urlImg = res.data.themeUrl || '/static/images/4.png'
        }
      })
    },
    switchTheme (src) {
      this.urlImg = src
    },
    changeTheme () {
      let params = {
        themeStyle: this.themeStyle,
        themeUrl: this.urlImg
      }
      setTheme({ params: JSON.stringify(params) }).then(res => {
        if (res.success) {
          this.$emit('updateTheme')
          this.cancel()
        }
      })
    },
    cancel () {
      this.dialog.visible = false;
    }
  }
};
</script>

<style lang="scss">
  .theme-item {
    text-align: center;
    margin-top: 15px;
    .theme-img-item{
      height: 110px;
      overflow: hidden;
      border: 3px solid transparent;
      &.active-bg{
        border: 3px solid #2a9dda;
      }
    }
  }
</style>
