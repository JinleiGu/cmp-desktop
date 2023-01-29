<template>
  <div class="clearfix script-content">
    <div class="wrapper">
      <div class="panel row" style="padding-top: 10px">
        <div class="col-md-3">
          <div class="select-handle select-all" @click="readAll">标记所有为已读</div>
          <div class="select-handle" style="margin-top: 20px">
            <div
              class="is-read"
              :class="{ messageActive: type == 'UNREAD'}"
              @click="search('UNREAD')"
            >
              <i class="status-dot-style dot-9"></i> 未读
              <span class="ui label">{{unreadCount}}</span>
            </div>
            <div class="is-read" :class="{ messageActive: type == 'READ' }" @click="search('READ')">
              <i class="status-dot-style dot-8"></i> 已读
              <span class="ui label">{{readCount}}</span>
            </div>
            <div class="is-read" :class="{ messageActive: type == undefined}" @click="search">
              <i class="status-dot-style dot-3"></i> 所有
              <span class="ui label">{{total}}</span>
            </div>
          </div>
        </div>
        <div class="col-md-9">
          <div class="list-group">
            <a
              href
              class="list-group-item b-l-3x"
              v-for="(row,key) in listData" :key="key"
              @click="goDetail($event,row)"
            >
              <span class="block text-ellipsis messageInfo m-b-xs">
                <i
                  class="status-dot-style"
                  :class="{ 'READ': 'dot-8', 'UNREAD': 'dot-9'}[row.newsStatus]"
                ></i>
                {{row.subSystem}}
                <span class="gmtCreate">{{row.gmtCreate}}</span>
              </span>
              <small class="text-muted text-ellipsis">{{row.description}}</small>
            </a>
            <div class="td-nodata" v-if="listData.length == 0">暂无消息</div>
            <div class="clearfix">
              <div class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="getData"
                  :current-page.sync="param.page"
                  :page-sizes="[5,10,20,30,50]" :page-size="param.rows"
                  layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="showDetail"
        class="animated tab-detail"
        :class="{ true: 'bounceInRight', false: 'bounceOutRight' }[isActive]"
      >
        <div class="col-md-12">
          <div class="panel panel-default">
            <div class="panel-heading font-bold">
              <span class="p-l-6">消息详情</span>
            </div>
            <div class="panel-body pmb-block">
              <div v-if="messageDetail.description">
                <div>{{messageDetail.subSystem}}</div>
                <div>时间：{{messageDetail.gmtCreate}}</div>
                <pre>{{messageDetail.description}}</pre>
              </div>
              <div class="detail-go-back" @click="goBack">
                <i class="fa fa-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      param: {
        page: 1,
        rows: 10
      },
      type: 'UNREAD'
    }
  },
  methods: {
    // 获取已读未读所有条数
    selectCount () {
      this.$http({
        url: '/message/statistics',
        method: 'POST',
        noParam: true
      }).then(data => {
        if (data.success) {
          this.unreadCount = data.data.unreadCount;
          this.readCount = data.data.readCount;
          this.total = data.data.total;
        }
      })
    },
    // 获取消息列表
    getList () {
      this.param.page = this.param.page;
      this.$http({
        url: '/message/list',
        method: 'POST',
        data: this.param
      }).then(data => {
        if (data.data && data.data.rows && data.data.rows.length) {
          this.listData = data.data.rows;
          this.totalPage = data.data.total;
        } else {
          this.listData = [];
          this.totalPage = 0;
        }
        this.selectCount();
      })
    },
    // 查询已读/未读/所有
    search (type) {
      this.type = type;
      this.param = {
        page: 1,
        rows: 10,
        newsStatus: this.type
      }
      this.getList();
    },
    readAll () {
      this.$http({
        url: '/message/readAll',
        method: 'POST',
        noParam: true
      }).then(data => {
        this.$message.success(data.message);
        this.getList();
      })
    },
    // 详情
    goDetail ($event, row) {
      $event.stopPropagation();
      this.showDetail = this.isActive = true;
      this.messageDetail = row;
      if (row.newsStatus == 'UNREAD') {
        this.$http({
          url: '/message/readAll',
          method: 'POST',
          data: { id: row.id }
        }).then(data => {
          this.$message.success(data.message);
          this.getList();
        })
      };
    },
    goBack () {
      this.isActive = false;
      setTimeout(() => {
        this.showDetail = false;
      }, 200);
    }
  },
  mounted () {
    this.search('UNREAD');
  }
};
</script>

<style lang="scss" scoped>
.message-detail {
  padding: 15px;
  border: 1px solid #eee;
  background: #1C2026;
  color: #fff;
  height: 300px;
  overflow: auto;
}

.assign-cell{
  position: relative;
  min-height: 30px;
  padding: 0 0 20px 30px;
  border-left: 4px solid #ddd;
}
.assign-cell .icon, .alarm-cell .icon{
  position: absolute;
  z-index: 1;
  left: -16px;
  top: -2px;
  width: 30px;
  height: 30px;
  font-style: normal;
  font-size: 15px;
  line-height: 30px;
  color: #fff;
  border-radius: 50%;
  text-align: center;
}
.assign-user-list{
  width: 60%;
  padding: 10px;
  background: #eee;
  margin-top: 10px;
}
.assign-cell input{
  padding: 2px 6px;
}
.bg-blue{
  background: #4A9BFF;
}
.bg-green{
  background: #46c37b;
}
.list-group-item:nth-child(odd){
  border-left-color: #27c24c;
}
.list-group-item:nth-child(even){
  border-left-color: #23b7e5;
}

.select-handle{
  border:1px solid #ddd;
  border-radius:5px;
  text-align:center;
  padding: 10px 0;
}
.is-read{
  padding: 10px 10px;
  text-align:left;
  position:relative;
}
.is-read:hover,.select-all:hover{
  background-color: #f6f8f8;
  cursor:pointer;
}
.messageActive{
  background: #f6f8f8;
}
.news-name{
  height: 100%;
  padding: 15px;
  background: #e7fff8;
}
.news-name .pagination{
  margin: 0;
}
.news-detail{
  background: #F0F3F4;
  padding: 15px;
  height:100%;
}
.ui.label{
  border-radius:30%;
  height:20px;
  line-height:16px;
  font-size:12px;
  position:absolute;
  right: 20px;
}
.label{
  color:#7687AB;
  background:rgba(115,121,128,0.2);
}
.page-bottom{
  position: absolute;
  bottom: 20px;
  width: 100%;
}
.messageInfo{
  position:relative;
}
.gmtCreate{
  position:absolute;
  right:0px;
}
.status-dot-style {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border-width: 3px;
    display: inline-block;
}
.dot-3 {
    background-color: #6fa7e7;
    border-color: #6fa7e7;
}
.dot-8 {
    background-color: #27c24c;
    border-color: #27c24c;
}
.dot-9 {
    background-color: #fad733;
    border-color: #fad733;
}
.td-nodata {
	text-align: center;
		line-height: 40px;
}
.tab-detail {
    width: 70%;
    height: 100%;
    position: fixed;
    z-index: 1000;
    top: 25px;
    right: -16px;
}
.tab-detail>div.col-md-12 {
    height: 100%;
}
.tab-detail .panel-default, .tab-detail .panel-body {
    height: 100%;
}
.detail-go-back {
  position: absolute;
  left: 20px;
  top: 48%;
  font-size: 16px;
  cursor: pointer;
}
</style>
