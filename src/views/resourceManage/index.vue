<template>
  <div class="wrapper-sm">
    <el-card>
    <!-- 搜索框 -->
    <div class="search">
      <el-form inline :model="listQuery" ref="searchForm">
        <el-form-item>
          <el-input v-model="listQuery.name" placeholder="平台组名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="handleSearch()">查询</el-button>
          <el-button plain icon="el-icon-refresh" @click="reset()">重置</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <basic-table :data="datalist" :params="params" :get-list="getData" :total="total">
      <el-table-column label="平台组名称" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column show-overflow-tooltip label="状态">
        <template slot-scope="scope">
          <status-icon :color="cnUser(scope.row.status, 'color')">
            {{cnUser(scope.row.status)}}
          </status-icon>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="gmtCreate" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="220px" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="handleCreate(scope.row)"><i class="el-icon-edit"></i> 编辑</el-button>
          <div class="action-divider"></div>
          <el-button type="text" @click="handleDelete(scope.row.id)"><i class="el-icon-delete"></i> 删除</el-button>
          <div class="action-divider"></div>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleGrant(scope.row.id)">
                平台配置
              </el-dropdown-item>
              <el-dropdown-item @click.native="handleMember(scope.row.id)" >
                成员配置
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </basic-table>
    <!--新增编辑用户弹窗-->
    <el-dialog
    :title="textMap[dialogStatus]"
    :close-on-click-modal="false"
    v-if="addDialogVisible"
    :visible.sync="addDialogVisible">
      <cmp-form :model="addData" ref="addData" label-width="110px">
        <el-row>
          <el-col :span="24">
            <cmp-form-item label="名称：" prop="name" validate="required">
              <el-input v-model="addData.name" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <cmp-form-item label="描述：" prop="remark">
              <el-input type="textarea" v-model="addData.remark" auto-complete="off"></el-input>
            </cmp-form-item>
          </el-col>
        </el-row>
      </cmp-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="ghost" @click.native="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit">提交</el-button>
      </div>
    </el-dialog>
    <!--资源组授权平台弹窗-->
    <AuthDialog v-if="authDialog.visible" :dialog="authDialog"></AuthDialog>
    <MemberDialog v-if="memberDialog.visible" :dialog="memberDialog"></MemberDialog>
    </el-card>
  </div>
</template>

<script>
import { getGroup, getGroupDetail, createGroup, modifyGroup, removeGroup, createUserGroup, getUserGroup, authVendorsGroup, getVendorsGroup } from 'api/group'
import AuthDialog from './authDialog'
import MemberDialog from './memberDialog'
export default {
  components: {
    AuthDialog,
    MemberDialog
  },
  data () {
    return {
      total: null,
      listQuery: {
        name: undefined
      },
      datalist: [],
      params: {
        page: 1,
        rows: 10
      },
      addDialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑平台组',
        create: '创建平台组'
      },
      addData: {},
      authDialog: {},
      memberDialog: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    cnUser (value, type) {
      const cnUserData = {
        NORMAL: '正常',
        ABNORMAL: '已冻结',
        LOGOUT: '注销'
      }
      const colorMap = {
        ABNORMAL: 'danger',
        NORMAL: 'normal',
        LOGOUT: 'disabled'
      }
      return type == 'color' ? colorMap[value] : cnUserData[value]
    },
    getData () {
      getGroup(this.params).then(res => {
        this.total = res.data.total
        this.datalist = res.data.rows
      })
    },
    // 查询
    handleSearch () {
      this.params.page = 1
      this.params.params = this.$tools.formatSearchParam({
        lkParam: {
          name: this.listQuery.name
        }
      })
      this.getData()
    },
    // 重置
    reset () {
      this.listQuery = {
        name: undefined
      }
      this.handleSearch()
    },
    handleCreate (data) {
      if (data) {
        this.addDialogVisible = true
        getGroupDetail(data.id).then(res => {
          if (res.success) {
            this.addData = res.data
            this.dialogStatus = 'update'
            this.addDialogVisible = true
          }
        })
      } else {
        this.addData = {}
        this.dialogStatus = 'create'
        this.addDialogVisible = true
      }
    },
    handleDelete (id) {
      this.$confirm('您确定要删除该平台组吗?', '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        removeGroup(id).then(res => {
          if (res.success) {
            this.$message.success({
              message: res.message,
              type: 'success'
            })
            this.getData()
          }
        })
      }).catch(() => {
      })
    },
    handleGrant (id) {
      this.authDialog = {
        id: id,
        visible: true
      }
    },
    handleMember (id) {
      this.memberDialog = {
        id: id,
        visible: true
      }
    },
    addSubmit () {
      const http = this.addData.id ? modifyGroup : createGroup
      this.$refs.addData.validate((valid) => {
        if (valid) {
          http(this.addData).then(res => {
            if (res.success) {
              this.$notify({
                message: res.message,
                type: 'success'
              })
              this.addDialogVisible = false
              this.getData()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .el-input--suffix .el-input__inner {
    padding-right: 15px !important
  }
  .time-picker  {
    width: 100% !important;
  }
  .i-checks input:checked + i:before {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #00aeef;
  }
  .wrapper-sm {
    background: #f5f7f9;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:100%;
  }
</style>
