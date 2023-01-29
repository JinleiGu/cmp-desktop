<template>
  <el-dialog
  title="成员配置"
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
    border>
      <el-table-column :reserve-selection="true" type="selection"></el-table-column>
      <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="手机号码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="email" label="电子邮箱" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" class="m-t-sm">
        <pagination :total="total" :page.sync="params.page" :rows.sync="params.rows" @pagination="getUserList()" />
      </el-col>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click.native="Submit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createUserGroup, getUserGroup } from 'api/group'
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
      initData: []
    }
  },
  created () {
    this.getUserGroup()
  },
  methods: {
    getUserGroup () {
      getUserGroup(this.dialog.id).then(res => {
        if (res.success) {
          this.selections = res.data
          this.initData = res.data
          this.getUserList()
        }
      })
    },
    removeAuth (id) {
      const index = this.initData.indexOf(id)
      if (index > -1) {
        this.initData.splice(index, 1)
      }
    },
    getUserList () {
      pageUser(this.params).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.userList = res.data.rows
          this.$nextTick(() => {
            this.userList.forEach((item) => {
              if (this.selections.includes(item.id)) {
                this.removeAuth(item.id)
                this.$refs.authForm.toggleRowSelection(item, true)
              }
            })
          })
        }
      })
    },
    handleSelectionChange (selection) {
      const ids = selection.map((item) => item.id)
      this.selections = [
        ...ids,
        ...this.initData
      ]
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
    Submit () {
      createUserGroup(this.dialog.id, this.selections).then(res => {
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
