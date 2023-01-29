<template>
  <div class="custom-scrollbar">
    <el-card v-show="!detailComponent.visible">
      <el-form inline>
        <el-form-item><el-input v-model="listQuery.name" placeholder="组织名称"></el-input></el-form-item>
        <el-form-item>
          <el-select v-model="listQuery.type" placeholder="组织类型" clearable>
            <el-option v-for="(item, index) in typeData" :key="index" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button  @click="handleSearch()">搜索</el-button>
          <el-button  @click="reset()">重置</el-button>
          <el-button type="primary"  @click="goTree()">切换树形</el-button>
          <el-button type="warning"  @click="handleSync()">全量同步</el-button>
        </el-form-item>
      </el-form>
      <basic-table
        :data="tableData"
        :params="params"
        :get-list="getData"
        :total="total">
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
      </basic-table>
      <!-- 设置管理员 -->
      <AdminDialog v-if="adminDialog.visible" :dialog="adminDialog"></AdminDialog>
    </el-card>
    <!--详情界面-->
    <TenantDetail v-if="detailComponent.visible" :config="detailComponent"></TenantDetail>
  </div>
</template>

<script>
import { pageOr, syncOr } from 'api/organization'
import AdminDialog from './adminDialog'
import TenantDetail from './tenantDetail'
export default {
  components: {
    AdminDialog,
    TenantDetail
  },
  data () {
    return {
      total: null,
      tableData: [],
      listQuery: {
        name: undefined,
        type: undefined
      },
      params: {
        page: 1,
        rows: 10
      },
      adminDialog: {},
      detailComponent: {},
      typeData: [
        { label: '单位类型', value: 'category' },
        { label: '单位', value: 'topOrganization' },
        { label: '部门', value: 'department' }
      ]
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
      pageOr(this.params).then(res => {
        if (res.success) {
          this.total = res.data.total
          this.tableData = res.data.rows
        }
      })
    },
    getDetail (id) {
      this.detailComponent = {
        id: id,
        visible: true
      }
    },
    handleSearch () {
      this.params.page = 1
      this.params.params = this.$tools.formatSearchParam({
        lkParam: {
          name: this.listQuery.name
        },
        eqParam: {
          type: this.listQuery.type
        }
      })
      this.getData()
    },
    handleAdmin (data) {
      this.adminDialog = {
        id: data.id,
        visible: true
      }
    },
    goTree () {
      this.$emit('goTree')
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
    reset () {
      this.listQuery = {
        name: undefined,
        type: undefined
      }
      this.handleSearch()
    }
  }
}
</script>
<style>

</style>
