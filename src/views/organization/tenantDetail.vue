<template>
  <CommondDetail :setting="detailSetting" :data="detailData" :title="detailData.name" @goBack="config.visible=false">
    <el-tabs v-model="activeName" @tab-click="handleDetailTab">
      <el-tab-pane label="用户列表" name="user">
        <basic-table :data="userList" :params="params" :get-list="getTenantUser" :total="userTotal">
          <el-table-column label="登录账号" prop="account">
          </el-table-column>
          <el-table-column label="用户姓名" prop="name">
          </el-table-column>
          <el-table-column label="邮箱" prop="email">
          </el-table-column>
          <el-table-column label="联系方式" prop="mobile">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="状态">
            <template slot-scope="scope">
              <status-icon :color="cnUser(scope.row.status, 'color')">
                {{cnUser(scope.row.status)}}
              </status-icon>
            </template>
          </el-table-column>
        </basic-table>
      </el-tab-pane>
      <el-tab-pane label="单位管理员" name="admin">
        <basic-table :data="adminList">
          <el-table-column label="登录账号" prop="account">
          </el-table-column>
          <el-table-column label="用户姓名" prop="name">
          </el-table-column>
          <el-table-column label="邮箱" prop="email">
          </el-table-column>
          <el-table-column label="联系方式" prop="mobile">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="状态">
            <template slot-scope="scope">
              <status-icon :color="cnUser(scope.row.status, 'color')">
                {{cnUser(scope.row.status)}}
              </status-icon>
            </template>
          </el-table-column>
          <div slot="pagination"></div>
        </basic-table>
      </el-tab-pane>
    </el-tabs>
  </CommondDetail>
</template>

<script>
import { getTenantDetail, getOrAdmin } from 'api/organization'
import { pageUser } from 'api/user'
import { generaltypeFilter } from 'filters'
import CommondDetail from 'components/CommondDetail'
const detailSetting = {
  type: 'host',
  columns: [
    [
      { name: '组织名称', value: 'name' },
      { name: '组织编码', value: 'code' },
      { name: '组织简称', value: 'displayName' }
    ],
    [
      { name: '组织类型', value: 'type', filter: generaltypeFilter },
      { name: '电子邮箱', value: 'email' },
      { name: '创建时间', value: 'gmtCreate' }
    ],
    [
      { name: '修改时间', value: 'gmtModify' },
      { name: '描述', value: 'remark' }
    ]
  ]
}
export default {
  props: {
    config: {
      type: Object
    }
  },
  components: { CommondDetail },
  data () {
    return {
      chartsList: {},
      detailData: {},
      params: {
        page: 1,
        rows: 10
      },
      userList: [],
      adminList: [],
      userTotal: 0,
      detailSetting,
      activeName: 'user'
    }
  },
  created () {
    this.getDetail()
    this.activeName = 'user'
    this.getTenantUser()
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
    handleDetailTab (tab) {
      switch (tab.name) {
        case 'user':
          this.params.page = 1
          this.getTenantUser()
          break
        case 'admin':
          this.getTenantAdmin()
          break
      }
    },
    getDetail () {
      getTenantDetail(this.config.id).then(data => {
        if (data.success) {
          this.detailData = data.data
        }
      })
    },
    getTenantUser () {
      this.params.params = JSON.stringify([{ param: { deptId: this.config.id }, sign: 'EQ' }])
      pageUser(this.params).then(data => {
        if (data.success) {
          this.userList = data.data.rows
          this.userTotal = data.data.total
        }
      })
    },
    getTenantAdmin () {
      getOrAdmin(this.config.id).then(data => {
        if (data.success) {
          this.adminList = data.data
        }
      })
    }
  }
}
</script>
