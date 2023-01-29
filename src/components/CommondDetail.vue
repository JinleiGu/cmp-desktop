<!--suppress ALL -->
<template>
  <div class="common-detail">
      <div class="detail-header">
        <span class="detail-back" @click="goBack"><i class="iconfont icon-left-arrow"></i> 返回</span>
        <span class="line"></span>
        <span class="title">{{detailData[setting.name || 'name']}}</span>
        <slot name="detail_header"></slot>
      </div>
      <div class="detail-body">
          <div style="padding:35px  20px 20px">
            <slot name="basic_info">
              <el-container class="basic-info">
                <el-aside width="100px">
                  <el-card>
                    <img :src="logo" alt="">
                  </el-card>
                </el-aside>
                <el-main style="padding-top: 0px;padding-bottom: 0px">
                  <el-row v-for="(row,key) in setting.columns" :key="key">
                    <el-col :span="8" class="attr" v-for="(item, key) in row" :key="key">
                      <span class="attr-name" :title="item.name">{{item.name}}：</span>
                      <!--<el-tooltip class="item" effect="dark" :content="String(detailData[item.value])" placement="top-start">-->
                      <span class="attr-value" :title="detailData[item.value]">
                          <status-icon :color="detailData.iconStatus" v-if="item.icon">{{detailData[item.value]}} {{item.unit}}</status-icon>
                          <span v-else>{{detailData[item.value]}} {{item.unit}}</span>
                      </span>
                      <!--</el-tooltip>-->
                    </el-col>
                  </el-row>
                  <slot name="basic_cell"></slot>
                </el-main>
              </el-container>
            </slot>
            <slot></slot>
          </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: function () {
        return {};
      }
    },
    setting: {
      type: Object,
      default: function () {
        return {};
      }
    }
  },
  computed: {
  // 针对过滤器做处理
    detailData: function () {
      const data = Object.assign({}, this.data);
      this.setting.columns && this.setting.columns.forEach((row) => {
        row.forEach((item) => {
          if (item.icon) {
            data.iconStatus = item.icon(data[item.value], 'color');
          }
          if (item.filter) {
            data[item.value] = item.filter(data[item.value], item.arg);
          }
        });
      });
      return data;
    },
    logo: function () {
      return this.setting.image ? this.setting.image : `/static/img/detail/${this.setting.type}.png`;
    }
  },
  data () {
    return {
      height: 600
    };
  },
  mounted () {
    this.height = document.body.clientHeight;
  },
  created () {
  },
  beforeDestroy () {
  },
  methods: {
    goBack () {
      this.$emit('goBack');
    }
  }
};

</script>
<style lang="scss">
  .common-detail{
    background: #fff;
    width: 100%;
    border: 1px solid #e6e6e6;
    .detail-header{
      width: calc(100% - 40px);
      height: 44px;
      line-height: 44px;
      z-index: 99;
      background: #fff;
      padding: 0 20px;
      border-bottom: 1px solid #e6e6e6;
      .title{
        display: inline-block;
        color: #333;
      }
      .line{
        position: relative;
        top: 4px;
        margin: 0 10px;
        height: 20px;
        width: 1px;
        display: inline-block;
        background-color: #b5b5b5;
      }
      .detail-back{
        color: #46ABf1;
        cursor: pointer;
      }
    }
    .detail-body{
      .basic-info{
        padding: 0;
        .attr{
          font-size: 12px;
          margin-bottom: 12px;
        }
        .attr-name{
          display: inline-block;
          white-space: nowrap;
          color: #999;
          width: 98px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .attr-value{
          display: inline-block;
          white-space: nowrap;
          width: calc(100% - 105px);
          overflow: hidden;
          text-overflow: ellipsis;
          color: #333;
          img{
            height: 13px;
          }
        }
      }
      .table-header{
        background: #f0f2f5;
        color: #333;
        height: 44px;
      }
    }
  }

</style>
