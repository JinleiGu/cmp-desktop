<template>
  <el-dialog
  title="授权平台资源"
  :visible.sync="dialog.visible"
  :close-on-click-modal="false"
  width="700px">
    <el-table
    :data="platformList"
    ref="authForm"
    tooltip-effect="dark"
    @selection-change="handleSelectionChange"
    row-key="id"
    stripe
    border
    fit>
      <el-table-column :reserve-selection="true" show-overflow-tooltip type="selection"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="vendorCategory" label="平台类型"></el-table-column>
      <el-table-column prop="version" label="平台版本"></el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialog.visible = false">取消</el-button>
      <el-button type="primary" @click.native="grantSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getVendorsGroup, authVendorsGroup, getVendors } from 'api/group'
import Pagination from 'components/Pagination'
export default {
  props: {
    dialog: {
      type: Object
    }
  },
  data () {
    return {
      platformList: [],
      selections: [],
      initAuth: []
    }
  },
  created () {
    this.getAuthData()
  },
  methods: {
    getAuthData () {
      getVendorsGroup(this.dialog.id).then(res => {
        if (res.success) {
          this.initAuth = res.data
          this.getList()
        }
      })
    },
    getList () {
      getVendors({
        simple: true,
        condition: JSON.stringify({ condition: 'listAllVendors' })
      }).then(res => {
        if (res.success) {
          this.platformList = res.data
          this.$nextTick(() => {
            this.platformList.forEach((item) => {
              if (this.initAuth.includes(item.id)) {
                this.$refs.authForm.toggleRowSelection(item, true)
              }
            })
          })
        }
      })
    },
    handleSelectionChange (selection) {
      this.selections = selection
    },
    getSelectedIds () {
      return this.selections.map(item => item.id)
    },
    grantSubmit () {
      const id = this.getSelectedIds()
      authVendorsGroup(this.dialog.id, this.getSelectedIds()).then(res => {
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
