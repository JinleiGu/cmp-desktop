<template>
  <div class="wrapper-sm">
    <el-card>
      <!-- 搜索栏和按钮 -->
      <el-form inline>
        <el-form-item><el-input v-model="listQuery.name" placeholder="应用名称"></el-input></el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search"  @click="handleSearch()">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="reset()">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="openAddDialog()">新增</el-button>
        </el-form-item>
      </el-form>
      <!-- 应用列表 -->
      <el-row :gutter="20">
        <el-col v-for="item in appData" :key="item.id" class="m-b card-container" :span="24">
          <el-card class="service-card">
            <el-row style="padding-top: 10px;">
              <el-col class="cell-logo" :span="4">
                <img :src="item.icon || '/static/img/default_cmdb.png'">
              </el-col>
              <el-col class="cell-content" :span="16">
                <p class="cell-title detail-href">{{item.name}}</p>
                <el-tooltip :content="item.remark" placement="bottom-start">
                  <p class="cell-remark">{{item.remark}}</p>
                </el-tooltip>
              </el-col>
            </el-row>
            <div class="footer">
              <div class="pull-right  footer-operate">
                <el-tooltip content="应用授权" placement="bottom-start">
                  <el-button size="small" @click="openAuthDialog(item)"><span class="iconfont icon-yingyong1"></span></el-button>
                </el-tooltip>
                <el-tooltip content="角色获取" placement="bottom-start">
                  <el-button size="small" @click="handleRole(item)"><span class="iconfont icon-guanliyuan"></span></el-button>
                </el-tooltip>
                <el-tooltip content="编辑" placement="bottom-start">
                  <el-button size="small" @click="openEditDialog(item)"><span class="iconfont icon-edit"></span></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="bottom-start">
                  <el-button size="small" @click="handleDelete(item)"><span class="iconfont icon-delete"></span></el-button>
                </el-tooltip>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-pagination class="pull-right" @size-change="handleSizeChange" @current-change="getData" :current-page.sync="params.page" :page-sizes="[9,18,36,72]" :page-size="params.rows" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <!-- 编辑和新增弹出框 -->
    <AddApp v-if="addDialogConfig.visible" :config="addDialogConfig" :addData="addServiceData" @close="getData"></AddApp>
    <!-- 授权弹出框 -->
    <AuthDialog v-if="authDialog.visible" :dialog="authDialog"></AuthDialog>
  </div>
</template>
<script>
import { pageApp, deleteApp, handleApp, getAppDetail } from 'api/app'
import AuthDialog from './authDialog'
import AddApp from './addApp'
export default {
  components: {
    AddApp,
    AuthDialog
  },
  data () {
    return {
      total: 0,
      addDialogConfig: { visible: false },
      listQuery: {
        name: undefined
      },
      params: {
        page: 1,
        rows: 9
      },
      addServiceData: {},
      authDialog: {},
      appData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      pageApp(this.params).then(res => {
        this.total = res.data.total
        this.appData = res.data.rows
      })
    },
    handleRole (item) {
      handleApp(item.id).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.getData()
        }
      })
    },
    handleSizeChange (val) {
      this.params.rows = val;
      this.getData()
    },
    openEditDialog (item) {
      this.addDialogConfig.visible = true
      this.addDialogConfig.status = 'update'
      getAppDetail(item.id).then(res => {
        if (res.success) {
          this.addServiceData = res.data
        }
      })
    },
    handleDelete (item) {
      this.$confirm('您确定要删除该应用吗?', '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        deleteApp(item.id).then(res => {
          if (res.success) {
            this.$message.success('删除成功')
            this.getData()
          }
        })
      }).catch(() => {})
    },
    openAddDialog () {
      this.addDialogConfig.visible = true
      this.addDialogConfig.status = 'create'
      this.addServiceData = {}
    },
    openAuthDialog (item) {
      this.authDialog = {
        id: item.id,
        appData: this.appData,
        visible: true
      }
    },
    handleSearch () {
      this.params.page = 1
      this.params.params = this.$tools.formatSearchParam({
        lkParam: {
          name: this.listQuery.name
        }
      })
      this.getData()
    },
    reset () {
      this.listQuery.name = undefined
      this.handleSearch()
    }
  }
}
</script>

<style lang="scss" scoped>
.wrapper-sm {
  background: #f5f7f9;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box
}
.card-container {
  width: 33.33%!important;
}
.footer {
  position: absolute;
  background: #fafafa;
  width: calc(100% - 40px);
  left: 0;
  bottom: 0;
  padding: 5px 20px;
  border-top: 1px solid #ebebeb;
  .footer-operate {
    width: 230px;
  }
  .footer-category {
    height: 32px;
    line-height: 32px;
    color: #666;
    font-size: 12px;
    width: calc(100% - 180px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .operate:not(.is-disabled) {
    color: #666;
    &:hover {
      color: #2d8cf0;
    }
  }
  i.iconfont {
    font-size: 16px;
  }
}
.service-card {
  position: relative;
  padding-bottom: 52px;
}
.cell-logo {
  height: 64px;
  width: 64px;
  img {
    width: 64px;
  }
}
.cell-content {
  width: calc(100% - 64px);
  padding: 0 15px 15px;
}
.detail-href {
  color: #409eff!important;
  cursor: pointer;
  text-decoration: none!important;
}
.cell-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cell-remark {
  height: 32px;
  line-height: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #999;
  font-size: 12px;
}
</style>
