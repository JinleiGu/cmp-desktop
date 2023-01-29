<template>
  <el-dialog
  title="授权用户"
  :visible.sync="dialog.visible"
  :close-on-click-modal="false"
  width="800px">
    <el-table
    :data="appList"
    ref="authForm"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    row-key="id"
    stripe
    border
    fit>
      <el-table-column :reserve-selection="true" show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column prop="name" label="应用名称"></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <el-select v-model="scope.row.roleIds" placeholder="请选择" multiple filterable allow-create @change="roleIdsChange(scope.row)">
            <el-option v-for="(item, index) in scope.row.roles" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="params.page" :rows.sync="params.rows" @pagination="getAppList()" />
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click.native="grantSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { authUser, showAuth } from 'api/user'
import { pageApp } from 'api/app'
import Pagination from 'components/Pagination'
export default {
  props: {
    dialog: {
      type: Object
    }
  },
  components: {
    Pagination
  },
  data () {
    return {
      total: 0,
      params: {
        page: 1,
        rows: 10
      },
      appList: [],
      selections: [],
      initAuth: []
    }
  },
  created () {
    this.getAuthData()
  },
  computed: {
    filterAuth () {
      const tempData = []
      if (this.selections) {
        this.selections.forEach(item => {
          const tempArry = {
            userId: this.dialog.id,
            appId: undefined,
            roleIds: undefined
          }
          tempArry.appId = item.appId
          tempArry.roleIds = item.roleIds
          tempData.push(tempArry)
        })
      }
      return tempData
    }
  },
  methods: {
    getAuthData () {
      showAuth(this.dialog.id).then(res => {
        if (res.success) {
          this.selections = res.data
          this.selections.forEach((item) => {
            item.roleIds = JSON.parse(item.roleIds)
          })
          this.initAuth = JSON.parse(JSON.stringify(this.selections))
          this.getAppList()
        }
      })
    },
    removeAuth (id) {
      const ids = this.initAuth.map((item) => item.appId)
      const index = ids.indexOf(id)
      if (index > -1) {
        this.initAuth.splice(index, 1)
      }
    },
    getAppList () {
      pageApp(this.params).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.appList = res.data.rows
          this.$nextTick(() => {
            this.appList.forEach((item) => {
              this.$set(item, 'roleIds', [])
              if (item.roles) item.roles = JSON.parse(item.roles) || []
              const ids = this.selections.map((item) => item.appId)
              if (ids.includes(item.id)) {
                this.removeAuth(item.id)
                const { roleIds } = this.selections.find(cell => cell.appId === item.id)
                item.roleIds = roleIds
                this.$refs.authForm.toggleRowSelection(item, true)
              }
            })
          })
        }
      })
    },
    handleSelectionChange (selection) {
      selection.forEach((item) => {
        item.appId = item.id
      })
      this.selections = [
        ...selection,
        ...this.initAuth
      ]
    },
    // 当角色发生变化的触发的事件
    roleIdsChange (data) {
      // 直接添加角色的情况，默认选中
      if (data.roleIds.length) {
        this.appList.forEach((item) => {
          if (item.id === data.id) {
            this.$refs.authForm.toggleRowSelection(item, true)
          }
        })
      }
      // 在已经选中的应用中改变角色，需要手动更新
      this.selections.forEach((item) => {
        if (item.appId === data.id) {
          item.roleIds = data.roleIds
        }
      })
    },
    grantSubmit () {
      authUser(this.dialog.id, { params: JSON.stringify(this.filterAuth) }).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$refs.authForm.clearSelection()
          this.dialog.visible = false
        }
      })
    }
  }
}
</script>
