<template>
  <el-dialog
    v-if="dialog.visible"
    :title="title[source]"
    :close-on-click-modal="false"
    :visible.sync="dialog.visible"
    width="650px"
    append-to-body
    class="app-dialog"
  >
    <div class="col-md-12">
      <el-form inline>
        <el-form-item label="应用名称：">
          <el-input name="appName" v-model="appName" placeholder="请输入应用名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">
            <i class="el-icon-search"></i> 查询
          </el-button>
          <el-button type="ghost" plain @click="addStore" v-if="source == 'myStore'">
            <i class="el-icon-plus"></i> 新增
          </el-button>
        </el-form-item>
      </el-form>
      <div class="table-responsive">
        <el-table :data="datalist">
          <el-table-column label="应用图标">
            <template slot-scope="scope">
              <img class="app-img" :src="scope.row.src" />
            </template>
          </el-table-column>
          <el-table-column label="应用名称" prop="name"></el-table-column>
          <el-table-column label="URl地址" prop="url"></el-table-column>
          <el-table-column label="简介" prop="remark"></el-table-column>
          <el-table-column label="操作" :width="source == 'myStore' ? 150 : 100">
            <template slot-scope="scope">
              <el-button
                round
                type="success"
                :disabled="scope.row.isadd"
                @click="add(scope.row)"
                v-if="scope.row.status == '0' && source == 'appStore'"
              >
                <i class="fa fa-plus-circle icon-font"></i> 添加应用
              </el-button>
              <el-button
                round
                type="primary"
                :disabled="true"
                v-if="scope.row.status == '1' && source == 'appStore' "
              >
                <i class="fa fa-check icon-font"></i> 已添加
              </el-button>
              <el-button type="success" @click="update(scope.row)" v-if="source == 'myStore'">
                <i class="fa fa-pencil"></i> 编辑
              </el-button>
              <el-button type="danger" @click="remove(scope.row.id)" v-if="source == 'myStore'">
                <i class="fa fa-trash-o icon-font"></i> 删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="getData"
            :current-page.sync="param.page"
            background
            :page-size="param.rows"
            layout="total, prev, pager, next"
            :total="totalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button type="success" @click="ok" :disabled="isEmpty" v-if="source == 'appStore'">确认添加</el-button>
      <el-button type="ghost" @click="cancel">取消</el-button>
    </div>
    <AddMyApp v-if="myAppDialog.visible" :row="myAppData" :dialog="myAppDialog" @updateMyApp="updateMyApp"></AddMyApp>
  </el-dialog>
</template>
<script>
import AddMyApp from './addMyApp';
export default {
  components: {
    AddMyApp
  },
  props: {
    dialog: {
      type: Object
    }
  },
  data () {
    return {
      title: { appStore: '应用市场', myStore: '我的应用' },
      username: '',
      appName: '',
      datalist: [],
      param: {
        page: 1,
        rows: 10
      },
      totalCount: 0,
      isImageData: false,
      isTr: false,
      url: '',
      addAppIds: [],
      addAppRows: [],
      isEmpty: true,
      source: '',
      myAppDialog: {
        visible: false
      },
      myAppData: null
    };
  },
  mounted () {
    this.source = this.dialog.source || 'appStore';
    if (this.source === 'appStore') {
      this.url = '/app/list';
    } else {
      this.url = '/app/my/list';
    }
    this.getData();
  },
  methods: {
    getData () {
      this.param.page = this.param.page;
      this.$http({
        url: this.url,
        method: 'POST',
        data: {
          ...this.param,
          name: this.appName
        },
        options: {
          noParam: true
        }
      }).then(data => {
        if (data.data && data.data.rows && data.data.rows.length) {
          this.isImageData = false;
          this.isTr = true;
          this.totalCount = data.data.total;
          this.datalist = data.data.rows;
          this.datalist.forEach(item => {
            if (this.addAppIds.indexOf(item.id) > -1) {
              item.isadd = true
            }
            // item.icon = item.icon.replace(/[a-zA-Z]+\.[a-zA-Z]+/, '');
            // let iconUrl = item.icon.replace(/[/\\]/g, '');
            let iconUrl = item.icon.match(/[0-9]+/)[0]
            item.src = '/app/IoReadImage/' + iconUrl;
            if (item.description && item.description.length > 10) {
              item.newDescription = item.description.substr(0, 10) + '...';
            } else {
              item.newDescription = item.description;
            }
          });
        } else {
          this.isImageData = true;
          this.isTr = false;
          this.totalCount = 0;
          this.datalist = []
        }
      });
    },
    handleSizeChange (val) {
      this.param.page = 1
      this.param.rows = val;
      this.getData();
    },
    searchData () {
      this.param.page = 1
      this.getData();
    },
    add (row) {
      row.isadd = true;
      this.addAppIds.push(row.id)
      this.addAppRows.push(row);
      if (this.addAppRows.length > 0) {
        this.isEmpty = false;
      } else {
        this.isEmpty = true;
      }
    },
    addStore () {
      this.myAppData = null;
      this.myAppDialog.visible = true;
    },
    update (row) {
      this.myAppData = row;
      this.myAppDialog.visible = true;
    },
    updateMyApp (data) {
      if (data.id) {
        /* 编辑我的应用 */
        this.myAppData.icon = data.icon
        this.myAppData.name = data.name
        this.myAppData.url = data.url
        this.myAppData.roles = data.roles
        this.myAppData.current = data.current
        this.myAppData.remark = data.remark
        // this.myAppData.icon = this.myAppData.icon.replace(/[a-zA-Z]+\.[a-zA-Z]+/, '');
        // let iconUrl = this.myAppData.icon.replace(/[/\\]/g, '');
        let iconUrl = this.myAppData.icon.match(/[0-9]+/)[0]
        this.myAppData.src = '/app/IoReadImage/' + iconUrl;
        this.$emit('updateOrDelApp', this.myAppData)
      } else {
        /* 新增我的应用 */
        this.getData();
      }
    },
    ok () {
      this.addData = { params: this.addAppRows };
      this.$http({
        url: '/app/appAdd',
        method: 'POST',
        data: this.addData
      }).then(data => {
        if (data.success) {
          this.$message.success(data.message);
          this.$emit('addAppFromStore', this.addAppRows)
          this.cancel()
        }
      });
    },
    cancel () {
      this.dialog.visible = false;
    },
    remove (id) {
      this.$confirm('你确定要删除该应用吗？?', '提示', {
        confirmButtonText: '删除',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: '/app/remove/' + id,
          method: 'GET'
        }).then(data => {
          if (data.success) {
            this.$message.success(data.message);
            this.getData();
            this.$emit('updateOrDelApp', { id: id, type: 'del' })
          }
        });
      });
    }
  }
};
</script>

<style lang="scss">
.app-dialog .el-dialog {
  .el-dialog__header {
    padding: 15px;
    border-bottom: 1px solid #e5e5e5;
  }
  .el-dialog__title {
    margin: 0;
    line-height: 1.42857143;
  }
  .el-dialog__footer {
    padding: 15px;
    border-top: 1px solid #e5e5e5;
  }
}
</style>
