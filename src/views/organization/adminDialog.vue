<template>
  <el-dialog
    title="设置管理员"
    width="800px"
    :close-on-click-modal="false"
    :visible.sync="dialog.visible">
    <el-form inline>
      <el-form-item><el-input v-model="listQuery.name" placeholder="用户姓名"></el-input></el-form-item>
      <el-form-item>
        <el-button  @click="handleSearch()">搜索</el-button>
        <el-button  @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      height="300px"
      :data="userList"
      border
      stripe
      ref="adminForm"
      row-key="id"
      @selection-change="handleSelectionChange">
      <el-table-column :reserve-selection="true" type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="mobile" label="手机号码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="email" label="电子邮箱" show-overflow-tooltip></el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" class="m-t-sm">
        <pagination :total="total" :page.sync="params.page" :rows.sync="params.rows" @pagination="getData()" />
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click.native="dialog.visible = false">取消</el-button>
      <el-button type="primary" icon="el-icon-upload" @click="submitAdmin">提交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getOrAdmin, setOrAdmin } from 'api/organization'
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
      total: 0,
      listQuery: {
        name: undefined
      },
      params: {
        page: 1,
        rows: 10
      },
      multipleSelection: [],
      userList: [],
      adminList: [],
      initAdmin: []
    }
  },
  computed: {
    filterAdmin () {
      const tempData = []
      if (this.multipleSelection) {
        this.multipleSelection.forEach(item => {
          tempData.push(item.id)
        })
      }
      return tempData
    }
  },
  created () {
    this.getAdminData()
  },
  methods: {
    getAdminData () {
      getOrAdmin(this.dialog.id).then(res => {
        if (res.success) {
          this.adminList = res.data
          this.multipleSelection = res.data
          this.initAdmin = res.data
          this.handleSearch()
        }
      })
    },
    getData () {
      pageUser(this.params).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.userList = res.data.rows
          const ids = this.adminList.map((item) => item.id)
          this.$nextTick(() => {
            this.userList.forEach((item) => {
              if (ids.indexOf(item.id) !== -1) {
                this.removeAdmin(item.id)
                this.$refs.adminForm.toggleRowSelection(item, true)
              }
            })
          })
        }
      })
    },
    removeAdmin (id) {
      const ids = this.initAdmin.map((item) => item.id)
      const index = ids.indexOf(id)
      if (index > -1) {
        this.initAdmin.splice(index, 1)
      }
    },
    handleSearch () {
      this.params.page = 1
      this.params.params = this.$tools.formatSearchParam({
        lkParam: {
          name: this.listQuery.name
        },
        eqParam: {
          deptId: this.dialog.id
        },
        ueqParam: {
          status: 'LOGOUT'
        }
      })
      this.getData()
    },
    handleChange (val) {
      this.params.rows = val
      this.handleSearch()
    },
    handleSelectionChange (selection) {
      this.multipleSelection = [
        ...selection,
        ...this.initAdmin
      ]
    },
    reset () {
      this.listQuery = {
        name: undefined
      }
      this.handleSearch()
    },
    submitAdmin () {
      setOrAdmin(this.dialog.id, this.filterAdmin).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.$refs.adminForm.clearSelection()
          this.dialog.visible = false;
        }
      })
    }
  }
}
</script>
