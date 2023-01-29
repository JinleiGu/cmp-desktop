<template>
  <el-dialog
  title="授权应用"
  :visible.sync="dialog.visible"
  :close-on-click-modal="false"
  width="800px">
    <el-form inline>
      <el-form-item><el-input v-model="listQuery.name" placeholder="用户名称"></el-input></el-form-item>
      <el-form-item>
        <el-button  @click="handleSearch()">搜索</el-button>
        <el-button  @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
    :data="userList"
    ref="authForm"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    row-key="id"
    stripe
    border
    fit>
      <el-table-column :reserve-selection="true" show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="手机号码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="email" label="电子邮箱" show-overflow-tooltip></el-table-column>
      <el-table-column label="角色">
        <template slot-scope="scope">
          <el-select v-model="scope.row.roleIds" placeholder="请选择" multiple filterable allow-create @change="roleIdsChange(scope.row)">
            <el-option v-for="item in filterRole " :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :page.sync="params.page" :rows.sync="params.rows" @pagination="getUserList()" />
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click.native="grantSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { authApp, showAuth } from 'api/app'
import { pageUser } from 'api/user'
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
      listQuery: {
        name: undefined
      },
      total: 0,
      params: {
        page: 1,
        rows: 10
      },
      userList: [],
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
            appId: this.dialog.id,
            userId: undefined,
            roleIds: undefined
          }
          tempArry.userId = item.userId
          tempArry.roleIds = item.roleIds
          tempData.push(tempArry)
        })
      }
      return tempData
    },
    filterRole () {
      const tempData = []
      for (var i in this.dialog.appData) {
        if (this.dialog.appData[i].id === this.dialog.id) {
          const ary = JSON.parse(this.dialog.appData[i].roles)
          tempData.push(ary)
        }
      }
      return tempData[0]
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
          this.getUserList()
        }
      })
    },
    removeAuth (id) {
      const ids = this.initAuth.map((item) => item.userId)
      const index = ids.indexOf(id)
      if (index > -1) {
        this.initAuth.splice(index, 1)
      }
    },
    getUserList () {
      pageUser(this.params).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.userList = res.data.rows
          this.$nextTick(() => {
            this.userList.forEach((item) => {
              this.$set(item, 'roleIds', [])
              const ids = this.selections.map((item) => item.userId)
              if (ids.includes(item.id)) {
                this.removeAuth(item.id)
                const { roleIds } = this.selections.find(cell => cell.userId === item.id)
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
        item.userId = item.id
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
        this.userList.forEach((item) => {
          if (item.id === data.id) {
            this.$refs.authForm.toggleRowSelection(item, true)
          }
        })
      }
      // 在已经选中的应用中改变角色，需要手动更新
      this.selections.forEach((item) => {
        if (item.userId === data.id) {
          item.roleIds = data.roleIds
        }
      })
    },
    handleSearch () {
      this.params.page = 1
      this.params.params = this.$tools.formatSearchParam({
        lkParam: {
          name: this.listQuery.name
        }
      })
      this.getUserList()
    },
    reset () {
      this.listQuery.name = undefined
      this.handleSearch()
    },
    grantSubmit () {
      authApp(this.dialog.id, this.filterAuth).then(res => {
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
