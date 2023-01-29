<template>
  <div class="custom-scrollbar">
    <el-card v-show="!detailComponent.visible">
      <el-form inline>
        <el-form-item>
          <el-button type="primary" @click="goPage()">切换分页</el-button>
          <el-button type="warning"  @click="handleSync()">全量同步</el-button>
        </el-form-item>
      </el-form>
      <div class="table-container">
        <el-table
          :data="tableData"
          row-key="id"
          :tree-props="{children: 'childs', hasChildren: 'hasChildren'}"
          header-cell-class-name="custom-header">
          <el-table-column label="组织名称" prop="name" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="detail-href" @click="getDetail(scope.row.id)">
                {{scope.row.name}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="组织简称" prop="displayName" show-overflow-tooltip></el-table-column>
          <el-table-column label="组织描述" prop="remark" show-overflow-tooltip></el-table-column>
          <el-table-column label="组织类型" prop="type" show-overflow-tooltip>
            <template slot-scope="scope">
              {{type(scope.row.type)}}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="gmtCreate" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button
                    type="text"
                    icon="el-icon-user-solid"
                    v-show="scope.row.type === 'topOrganization'"
                    @click="handleAdmin(scope.row)"
                >设置管理员</el-button>
            </template>
          </el-table-column>
          <div slot="pagination"></div>
        </el-table>
      </div>
    <!-- 设置管理员 -->
    <AdminDialog v-if="adminDialog.visible" :dialog="adminDialog"></AdminDialog>
    </el-card>
    <!--详情界面-->
    <TenantDetail v-if="detailComponent.visible" :config="detailComponent"></TenantDetail>
  </div>
</template>

<script>
import { treeOr, syncOr } from 'api/organization'
import AdminDialog from './adminDialog'
import TenantDetail from './tenantDetail'
export default {
  components: {
    AdminDialog,
    TenantDetail
  },
  data () {
    return {
      tableData: [],
      adminDialog: {},
      detailComponent: {}
    }
  },
  created () {
    this.getData()
  },
  methods: {
    type (value) {
      const obj = {
        category: '单位类型',
        topOrganization: '单位',
        department: '部门'
      }
      return obj[value]
    },
    getData () {
      treeOr().then(res => {
        if (res.success) {
          this.tableData = res.data.childs
        }
      })
    },
    getDetail (id) {
      this.detailComponent = {
        id: id,
        visible: true
      }
    },
    handleSync () {
      this.$confirm('全量同步操作风险高，确定要进行全量同步吗', '提示', {
        confirmButtonClass: 'el-button--danger',
        type: 'warning'
      }).then(() => {
        syncOr().then(res => {
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
    handleAdmin (data) {
      this.adminDialog = {
        id: data.id,
        visible: true
      }
    },
    goPage () {
      this.$emit('goPage')
    }
  }
}
</script>
<style>
</style>
